(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    'accordion': false,
    'allow_multi': true,
    'allow_none': true,
    'set_history': true,
    'sticky': true
  }

  // VARS
  var elm;


  // LISTENERS
  base("body").on('click', "[x-base-toggle='tabs.open']", function(event){

    elm = this.getTarget("[x-base-tabs]");

    elm.tabs('open', this.attr('x-base-id'));

    return false;

  });

  base("body").on('click', "[x-base-toggle='tabs.open'] a", function(event){

    return false;

  });

  base.on('tabs.resize window.resize', function() {

    for(var x in elements) {

      elements[x].tabs('resize');

    }

  });

  base.on('history.pop.tabs', function(event) {

    elmID = event.data.state.elmID;
    tabID = window.location.hash.substr(1);

    elm = base('#' + elmID);

    //elm.setConfig('set_history', false);
    elm.tabs('open', tabID);

  });



  // METHODS
  base.plugin('tabs', {

    init: function(config) {

      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('tabs', config);


      // Set attribute for listeners
      this.attr('x-base-tabs','');


      // No history in multi mode
      if (config.allow_multi) {
        config.set_history = false;
      }


      // Init
      tabID = window.location.hash.substr(1);
      if (this.find('[x-base-tab="' + tabID + '"]').count) {
        //if (!this.find('[x-base-tab="' + tabID + '"]').hasClass('active')) {
          this.tabs('open', tabID);
        //}
      } else {
        if (config.accordion) {
          tabID = this.find('.accordion-nav.active').attr('x-base-id');
        } else {
          tabID = this.find('[x-base-tab].active').attr('x-base-tab') || this.find('[x-base-tab]:first-child').attr('x-base-tab');
          this.tabs('open', tabID);
        }
      }
      if (config.set_history) {
        base.history('tabs', 'replace', '#' + tabID, {'elmID': this.attr('id')});
      }

      // Check content exists for all tab items
      base('[x-base-toggle="tabs.open"]').each(function() {
        if (!base('[x-base-tab="' + this.attr('x-base-id') + '"]').count) {
          this.remove();
        }
      });   
      if (base('[x-base-toggle="tabs.open"]').count == 1) {
        base('[x-base-toggle="tabs.open"]').remove();
      }   


      // Resize
      this.tabs('resize');

      // Sticky
      this.find('.nav-placeholder-before').attr('x-base-inview-status', '0');
      this.find('.nav-placeholder-before').on('inview.change', function (event) {

        this.parents('.tabs').tabs('sticky', event.data);

      });
      base.trigger('inview.check');
      // End Sticky

      // Return element
      return this;

    },

    sticky: function(status) {

      config = this.data('tabs');

      config.sticky_status = status;

      // this.find('.nav-placeholder-after, .nav-placeholder-before').css('height', '0');
      // this.find('nav').css('top', 'auto').css('bottom', 'auto');

      // if (status == 'in') {
      //   this.removeClass('before-view');
      //   this.removeClass('after-view');
      // } else if (status == 'before') {
      //   this.addClass('before-view');
      //   this.removeClass('after-view');
      //   this.find('.nav-placeholder-before').css('height', this.find('nav').height() + 'px');
      //   this.find('nav').css('bottom', '0');
      // } else if (status == 'after') {
      //   this.find('.nav-placeholder-after').css('height', this.find('nav').height() + 'px');
      //   this.find('nav').css('top', base('header').height() + 'px');
      //   this.removeClass('in-view');
      //   this.addClass('after-view');
      // }

    },

    open: function(tabID) {

      config = this.data('tabs');

      active = this.find('[x-base-id="' + tabID + '"]').hasClass('active');

      if ((config.accordion && !config.allow_multi) || !config.accordion) {
        this.find('.tab-nav, .accordion-nav, .tab-holder, .accordion-holder').removeClass('active');
        base('[x-base-target="#'+this.attr('id')+'"]').removeClass('active');
      }


      if (config.accordion && active && config.allow_none) {
        base('[x-base-id="' + tabID + '"]').removeClass('active');
        this.find('[x-base-tab="' + tabID + '"]').removeClass('active');
      } else { //if (!config.accordion || !active)
        base('[x-base-id="' + tabID + '"]').addClass('active');
        this.find('[x-base-tab="' + tabID + '"]').addClass('active');
      }

      if (config.set_history) {
        if (window.location.hash != '#' + tabID) {
          base.history('tabs', 'push', '#' + tabID, {'elmID': this.attr('id')});
        }
      }

      this.trigger('tabs.open');
      base.trigger('tabs.open');

    },

    setConfig: function(param, value) {

      config = this.data('tabs');

      if (param && typeof value !== 'undefined') {
        config[param] = value;
      }

    },

    resize: function() {

      config = this.data('tabs');

      offset = base('header').height() + this.find('nav').height();

      this.find('[x-base-scrollto-offset]').attr('x-base-scrollto-offset', offset);

      this.tabs('sticky', config.sticky_status);

    }

  });

})(base, window);
