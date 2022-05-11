(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    autoload: false,
    load_on_interact: false,
    append_data_to_url: true,
    response: 'json',
    method: 'GET',
    url: '',
    data: {}
  }

  // VARS
  var elm;


  // LISTENERS
  base("[x-base-toggle='module.refresh']").on('click', function(){

    elm = this.getTarget("[x-base-module]");

    elm.module('refresh');

  });

  base.on('window.interact', function() {

    base('[x-base-config-autoload="interact"]').each(function() {

      this.attr('x-base-config-autoload', 0);
      this.module('refresh');

    });

  });



  // METHODS
  base.plugin('module', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('module', config);

      // Set module
      config.module = this.attr("x-base-module");

      // Autoload?
      if (config.autoload == 'load') {
        this.module('refresh');
      }

      return this;

    },

    addParam: function(param, value) {

      config = this.data('module');

      config.data[param] = value;

      return this;

    },

    setData: function(data) {

      config = this.data('module');

      config.data = data;

      return this;

    },

    refresh: function() {

      config = this.data('module');

      this.trigger('module.refresh');

      data = '';

      if (config.append_data_to_url) {
        for (param in config.data) {
          if (config.data[param]) {
            data += '/' + param + '/' + config.data[param];
          }
        }
      }

      if (config.method == 'POST') {
        contentType = 'application/x-www-form-urlencoded';
      } else {
        contentType = '';
      }

      window.filterInteracted = false;

      this.ajax({
        'method':     config.method,
        'url':        config.url + data,
        'data':       config.data,
        'responseType': config.response,
        'contentType': contentType,
        'onLoad':     function(data, xhr) {

          if(window.filterInteracted){
            return;
          }


          if (this.attr('x-base-lazy-load') != "1") {
            
            if ((typeof data.html) !== 'undefined') {

              this.html(data.html);
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

              this.html(data);

            }

          }

          this.trigger('module.refreshed', data);
          base.trigger('module.refreshed', data);

        }
      });

    }

  });

})(base, window);
