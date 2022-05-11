(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    width: 600,
    height: 'auto',
    min_height: '1',
    gutter: 50,
    aspect_ratio: 'variable',
    type: 'html',
    devices: 'xs|sm|md|lg|xl|2xl',
    responseType: 'json',
    iframe_scrolling: 'no',
    src: ''
  }

  // VARS
  var elm;


  // LISTENERS
  base.on('base.ready', function() {

    var popup = base('[x-base-popup-load');

    if (popup.count) {

      var logic = popup.attr('x-base-logic');
      var slug = popup.attr('x-base-slug');
      var display = false;
      var storage;

      if (logic == 'session')
      {
        storage = window.sessionStorage;
      }
      else if (logic == 'cookie')
      {
        storage = window.localStorage;
      }
      else
      {
        storage = false;
        display = true;
      }

      if (storage && !storage.getItem('popup-' + slug))
      {
          display = true;
          storage.setItem('popup-' + slug, true);
      }
  

      if (display)
      {
        elm = popup.getTarget("[x-base-popup]");
        elm.popup('setConfig', 'src', popup.attr('x-base-src'));
        elm.popup('setConfig', 'width', popup.attr('x-base-width'));
        elm.popup('setConfig', 'height', popup.attr('x-base-height'));
        elm.popup('setConfig', 'min_height', popup.attr('x-base-min-height'));
        elm.popup('setConfig', 'gutter', popup.attr('x-base-gutter'));
        elm.popup('open');
      }
      

    }

  });

  base("body").on('click', "[x-base-toggle='popup.open']", function(event){

    elm = this.getTarget("[x-base-popup]");

    elm.popup('setConfig', 'src', this.attr('x-base-src'));
    elm.popup('setConfig', 'width', this.attr('x-base-width'));
    elm.popup('setConfig', 'height', this.attr('x-base-height'));
    elm.popup('setConfig', 'min_height', this.attr('x-base-min-height'));
    elm.popup('setConfig', 'gutter', this.attr('x-base-gutter'));

    allowDefault = elm.popup('open');

    if (!allowDefault) {
      event.preventDefault();
      return false;
    }

  });
  base("body").on('click', "[x-base-toggle='popup.close']", function(){

    elm = this.getTarget("[x-base-popup]");

    elm.popup('close');

  });
  base("[x-base-toggle='popup.src']").on('click', function(){

    elm = this.getTarget("[x-base-popup]");

    elm.popup('setConfig', 'src', this.attr('x-base-src'));

  });
  base("[x-base-toggle='popup.width']").on('click', function(){

    elm = this.getTarget("[x-base-popup]");

    elm.popup('setConfig', 'width', this.attr('x-base-width'));

  });
  base("[x-base-toggle='popup.height']").on('click', function(){

    elm = this.getTarget("[x-base-popup]");

    elm.popup('setConfig', 'height', this.attr('x-base-height'));
    elm.popup('setConfig', 'min_height', this.attr('x-base-min-height'));

  });
  base.on('popup.resize window.resize', function() {

    for(var x in elements) {

      elements[x].popup('resize');

    }

  });



  // METHODS
  base.plugin('popup', {

    init: function(config) {

      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('popup', config);


      // Set attribute for listeners
      this.attr('x-base-popup','');


      // Iframe
      if (config.type == 'iframe') {
        this.find('.popup-content').html("<iframe src='about:blank' seamless frameborder='0' scrolling='"+config.iframe_scrolling+"'></iframe>");
        this.find('iframe').on('load', function() {
          base.trigger('popup.resize');
        })

      }


      // Force variable aspect ratio if height is auto
      if (config.height == 'auto') {
        config.aspect_ratio = 'variable';
      }

      // Return element
      return this;

    },

    open: function() {

      config = this.data('popup');

      if (config.devices.indexOf(base.data('device.id')) >= 0) {

        if (config.type == 'ajax') {

          this.addClass('popup-open popup-loading');

          this.ajax({
            'method': 'GET',
            'url': config.src,
            'responseType': config.responseType,
            'onLoad': function(data) {

              if (config.responseType == 'json') {

                this.find('.popup-content').html(data.html);
                base('style', '-1').html(data.styles, 'append');

                // Remove previous script holder
                base('script[x-base-ajax]').remove();

                // Add new script holder
                var script_tag = document.createElement('script');
                script_tag.nonce = base('[x-base-ajax-nonce]').attr('x-base-ajax-nonce');
                script_tag.text = data.scripts;
                script_tag.setAttribute('x-base-ajax', 1);
                document.body.appendChild(script_tag);

              } else {
                this.find('.popup-content').html(data);
              }

              this.removeClass('popup-loading');
              this.popup('resize');
              this.trigger('popup.open');
              base.trigger('popup.open');
            }
          });

        } else {

          if (config.type == 'iframe') {

            this.find('iframe').attr('src', config.src);

          }

          this.addClass('popup-open');

          this.popup('resize');

          this.trigger('popup.open');

        }

        return false;

      } else {

        return true;

      }

    },

    close: function() {

      config = this.data('popup');

      this.removeClass('popup-open');

      if (config.type == 'iframe') {

        this.find('iframe').attr('src', 'about:blank');

      } else if (config.type == 'ajax') {

        this.find('.popup-content').html("");

      }

      this.trigger('popup.close');
      base.trigger('popup.close');

    },

    setConfig: function(param, value) {

      config = this.data('popup');

      if (param && value != null && typeof value !== 'undefined') {
        config[param] = value;
      }

    },

    getConfig: function(param) {

      config = this.data('popup');
      return config[param];

    },


    resize: function() {

      config = this.data('popup');

      // Set popup display element
      display = this.find('.popup-display');

      // Get max width/height
      maxWidth = base.data('window.width') - (config.gutter * 2);
      //maxHeight = base.data('window.height') - (config.gutter * 2);
      maxHeight = this.height() - (config.gutter * 2);

      // Set width
      width = Math.min(config.width, maxWidth);

      // Auto height
      if (config.height == 'auto') {

        display.css({
          width: width + 'px',
          height: 'auto'
        });

        height = Math.min((display.height() + 1), maxHeight);

      } else {

        height = Math.min(config.height, maxHeight);

      }

      // Aspect ratio
      if (config.aspect_ratio == 'fixed') {

        if ((width / height) > (config.width / config.height)) {
          width = config.width * (height / config.height);
        } else {
          height = config.height * (width / config.width);
        }

      }

      if (height < config.min_height) height = config.min_height;

      // Set width and height
      display.css({
        width: (2 * Math.round(width / 2)) + 'px',
        height: (2 * Math.round(height /2)) + 'px'
      });

    }

  });

})(base, window);
