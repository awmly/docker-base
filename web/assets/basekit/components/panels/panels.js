(function(base, window) {

  // ELEMENTS
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    flex_height: '',
    stop_scroll: false,
    active: true,
    open: false,
    collpase_type: 'push',
    collpase_max_height: false,
    sticky_position: false,
    sticky_offset: 0,
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    '2xl': true
  }

  // VARS
  var elm;


  // LISTENERS
  base('body').on('click', '[x-base-panel-title]', function(){
    
    elm = this.parents('.panel');

    elm.panel('toggle');

  });
  base.on('window.resize', function(){

    for(var x in elements) {

      elements[x].panel('resize');

    }

  });

  base.on('panel.close', function(e){

    for(var x in elements) {

      elements[x].panel('close');

    }

  });


  // METHODS
  base.plugin('panel', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;

      // reopen panels after module refresh
      elements.forEach((element, i) => {
        let existsInDom = document.body.contains(element.elm);
        
        if(element && !existsInDom && element.attr('id') == this.attr('id')){
          
          config.open = element.data('panel').open;
          delete elements[i];

        }
      });

      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('panel', config);

      this.attr('x-base-panel', '');

      this.removeClass('pre-init');

      this.panel('resize');

      if (config.open) {

        this.panel('open');

      }

    },

    resize: function() {

      config = this.data('panel');

      device = base.data('device.id');

      if (config[device] == 'collapse') {

        config.active = true;
        this.addClass('panel-collapse panel-active');

        if (config.collpase_type == 'over') {
          this.addClass('content-over');
        }

        if(!config.open) {
          this.children('.panel-content').css('height', '0');
        }

      } else {

        config.active = false;
        config.open = false;
        this.removeClass('panel-active panel-opened panel-collapse content-over');
        this.children('.panel-content').css('height', 'auto');

      }


      if (config[device] == 'flex') {

        this.addClass('panel-flex');

        if (config.flex_height) {
          this.css('height', config.flex_height + 'px');
        }

      } else {

        this.removeClass('panel-flex');

        this.css('height', '');

      }

      if (config[device] == 'collapse' || config[device] == 'flex') {

        if (config.stop_scroll) {
          this.find('.panel-scroll, .panel-inner, .panel-title').addClass('stop-parent-scroll');
        }

      } else {

        this.find('.panel-scroll, .panel-inner, .panel-title').removeClass('stop-parent-scroll');

      }

      if (config.sticky_position) {

        var top = parseInt(this.css('margin-top'));

        if (config.sticky_position == 'below-header') {
          top += base('header').height();
        }

        if (config.sticky_offset) {
          top += parseInt(config.sticky_offset);
        }

        this.css('top', top + 'px');

      }

    },


    toggle: function() {

      config = this.data('panel');

      if (config.active) {
        if (config.open) {

          this.panel('close');

        } else {

          base.trigger('panel.close');
          this.panel('open');

        }
      }

    },

    open: function() {

      config = this.data('panel');

      config.open = true;

      this.addClass('panel-opened');

      content = this.children('.panel-content');
      content.removeClass('panel-right');

      var height = this.panel('getContentHeight', content);

      this.trigger('panel.open');

      content.css('height', height);

      if (config.collpase_type == 'over') {

        ctr = base('.ctr').offset();

        if (ctr.right < content.offset().right) {
          content.addClass('panel-right');
        }

      }

      /*content.animate({'height': height + 'px'}, 200, function(){
        this.css('height', '100px');
        this.parent().trigger('panel.open');
      });*/

    },

    close: function() {

      config = this.data('panel');

      config.open = false;

      this.removeClass('panel-opened');

      content = this.children('.panel-content');

      content.css('height', '0px');

      this.trigger('panel.closed');

      /*content.animate({'height': '0'}, 200, function(){
        this.parent().trigger('panel.closed');
      });*/

    },

    getContentHeight: function(content) {

      content.css({
        'height': '1000px',
      });

      content.find('.panel-inner').css('height', 'auto');

      var height = content.find('.panel-inner').height();

      content.css({
        'height': '0',
      });

      content.find('.panel-inner').css('height', '100%');

      var max_height = parseInt(config.collpase_max_height);

      if (max_height > 0 && height > max_height) {
        height = max_height + 'px';
      } else {
        height = height + 'px';
      }

      return height;

    },

    setTitle: function(title) {

      this.find('.panel-title span').html(title);

    }

  });

})(base, window);
