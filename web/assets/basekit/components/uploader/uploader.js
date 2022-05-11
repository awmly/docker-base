(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    post_url: '',
    max_size: '5000000',
    allowed_files: 'png|jpg|jpeg|gif',
    post_input: '',
    multi: 1,
    uploaded: [],
    queue: [],
    uploading: false,
    upload_service: 'server'
  }

  // VARS
  var elm;

  // METHODS
  base.plugin('uploader', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('uploader', config);

      if (config.multi == '0' || config.multi == 'false') {
        config.multi = false;
      }

      if (config.multi) {
        this.find('.add input').attr('multiple', 'multiple');
      }

      // Init
      this.find('.add input').on('change', function(event) {
        this.parents('[x-base-uploader]').uploader('process');
      });

      this.find('[x-base-error]').on('click', function() {
        this.removeClass('active');
      });

      config.post_input = config.post_input.split(',');

      this.uploader('getCurrent');

      return this;

    },

    getCurrent: function () {

      config = this.data('uploader');

      var files = JSON.parse(this.find('[x-base-files-value]').value());


      for (var x in files) {

        var file = files[x];

        var template = base('template[x-base-file]').template();

        template.find('span').html(file.title);

        template.find('.file').attr({
          'status': 'current',
          'title': file.title,
          'path': file.path,
          'id': file.id
        }).removeClass('current');

        template.find('i').on('click', function() {
          var elm = this.parents('[x-base-uploader]');
          var par = this.parents('.file');
          par.attr('status', 'deleted').addClass('deleted');
          elm.uploader('updateFiles');
        });

        this.find('[x-base-files]').appendChild(template);

      }

      this.uploader('updateFiles');

    },

    process: function() {

      config = this.data('uploader');

      var files = this.find('.add input').elm.files;

      for( var x = 0; x < files.length; x++) {
        config.queue.push(files[x]);
      }

      this.find('.add input').elm.value = '';

      if (!config.uploading) {
        config.uploading = true;
        this.uploader('getFile');
      }

    },

    getFile: function () {

      config = this.data('uploader');

      var file = config.queue[0];
      config.queue.shift();

      //console.log(file);

      var error;

      if (file.size > config.max_size) {
        error = 'size';
      } else if (!this.uploader('allowedExt', file)) {
        error = 'ext';
      }

      if (error) {
        this.uploader('showError', error);
        this.uploader('checkQueue');
      } else {

        base.trigger('file.uploading', file);
        this.trigger('file.uploading', file);

        var template = base('template[x-base-file]').template();

        template.find('span').html(file.name);

        if (!config.multi) {
          this.find('.file').attr('status', 'deleted').addClass('deleted');
        }

        this.find('[x-base-files]').appendChild(template);

        this.uploader('upload', file);
      }

    },

    upload: function(file) {

      config = this.data('uploader');

      if (config.upload_service == 'firebase') {
        this.uploader('uploadFirebase', file);
      } else {
        this.uploader('uploadServer', file);
      }

    },

    uploadFirebase: async function (file) {

      await basefire.getStorageFunctions();

      var randStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      var filename = file.name;
      var fileExt = file.name.split('.').pop();

      var path = 'uploads/temp/' + randStr + '.' + fileExt;

      var storage = basefire.storage.getStorage(); //getStorage
      var storageRef = basefire.storage.ref(storage, path); //ref

      var uploadTask = basefire.storage.uploadBytesResumable(storageRef, file); //uploadBytesResumable

      var elm = this;

      uploadTask.on('state_changed', function(snapshot) {

          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          elm.find('.current .progress').css('width', percent + '%');
          //console.log('Upload is ' + progress + '% done');

        }, function(error) {

          //console.log(error.message);
          elm.uploader('complete', {
            'status': 'error'
          });

        }, function() {

          // Upload completed successfully, now we can get the download URL
          basefire.storage.getDownloadURL(uploadTask.snapshot.ref).then(function() { //getDownloadURL

            elm.uploader('complete', {
              'status': 'success',
              'title': filename,
              'path': path,
              'id': 0,
              'data': []
            });

          });

        }
      );

    },

    uploadServer: function(file) {

      config = this.data('uploader');

      var formData = new FormData();

      // HTML file input, chosen by user
      formData.append("file", file);

      for (var x in config.post_input) {
        var field = config.post_input[x];
        formData.append(field, base('[name="' + field + '"]').value());
      }

      if (config.post_json) {
        formData.append('PostJSON', config.post_json);
      }



      this.ajax({
        'method':     'POST',
        'url':        config.post_url,
        'data':       formData,
        'responseType':   'json',
        'onLoad':     function(data, xhr) {
          this.uploader('complete', data);
        },
        'onProgress': function(event, xhr) {
          var percent = (event.loaded / event.total) * 100;
          this.find('.current .progress').css('width', percent + '%');
        }
      });

    },

    complete: function(file) {

      config = this.data('uploader');

      this.find('.current i').on('click', function() {
        var elm = this.parents('[x-base-uploader]');
        var par = this.parents('.file');
        par.attr('status', 'deleted').addClass('deleted');
        elm.uploader('updateFiles');
      });

      this.find('.current').removeClass('current').attr({
        'status': 'new',
        'title': file.title,
        'path': file.path,
        'id': file.id,
        'data': JSON.stringify(file.data)
      });

      if (file.status == 'success') {
        this.uploader('updateFiles');
      } else {
        this.uploader('showError', 'upload');
      }

      base.trigger('file.uploaded', file);
      this.trigger('file.uploaded', file);
      this.uploader('checkQueue');

    },

    checkQueue: function() {

      config = this.data('uploader');

      if (config.queue[0]) {
        this.uploader('getFile');
      } else {
        config.uploading = false;
      }

    },

    updateFiles: function() {

      config = this.data('uploader');

      config.uploaded = [];

      this.find('.file').each(function(){
        config.uploaded.push({
          status: this.attr('status'),
          title: this.attr('title'),
          path: this.attr('path'),
          id: this.attr('id'),
          data: JSON.parse(this.attr('data'))
        });
      });

      this.find('[x-base-files-value]').value(JSON.stringify(config.uploaded));

    },

    allowedExt: function(file) {

      config = this.data('uploader');

      var re = new RegExp("\.(" + config.allowed_files + ")+$", "i");
      if (file.name.search(re) > 0) return true;
      else return false;

    },

    showError: function (error) {

      this.find('[x-base-error="' + error + '"]').addClass('active');

    }

  });

})(base, window);
