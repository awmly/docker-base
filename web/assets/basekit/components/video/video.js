(function(base, window) {

  // ELEMENTS
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    autoplay: true,
    show_on_devices: 'xs,sm,md,lg,xl,2xl',
    show_poster: false,
    loop:true,
    speed:1,
    preload:'auto' // auto or none
  }


  // LISTENERS
  base.on('window.resetize', function(){

    for(var x in elements) {

      elements[x].video('resetize', false);

    }

  });
  base.on('window.resized window.loaded', function(){

    for(var x in elements) {

      elements[x].video('resize', false);

    }

  });


  // METHODS
  base.plugin('video', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {});
      this.data('video', config);


      // Load video
      if (config.show_on_devices.indexOf(base.data('device.id')) > -1) {
        this.video('load');
      } else {
        config.show_poster = true;
        config.player = false;
        this.addClass('invalid-device');
      }


      // Show poster?
      if (config.show_poster) {
        this.addClass('show-poster');
      }

      return this;

    },

    getPlayer: function() {

      // Get config
      config = this.data('video');
      return config.player;

    },

    getConfig: function(param) {

      config = this.data('video');

      return config[param];

    },

    load: function() {


      // Get config
      config = this.data('video');


      // Initiate player
      config.player = this.find('.video-js').elm;
      config.player.id_ = Math.random().toString(36).substring(7);

      // config.player.autoplay = true;
      // config.player.controls = false
      // config.player.autoplay = false
      // config.player.preload = config.preload
      // config.player.loop = false


      // Set video id on to plugin holder
      this.attr('data-video-id', config.player.id_);

      
      holder = base('[data-video-id="' +  config.player.id_ + '"]');
      holder.video('resize', holder.video('getConfig', 'autoplay'));

      
      // Set listeners

      config.player.addEventListener('error', function() {

        base('[data-video-id="' +  this.id_ + '"]').addClass('video-error');

      });


      config.player.addEventListener('ended', function() {

        base('[data-video-id="' +  this.id_ + '"]').video('ended');

      });

    },

    ended: function() {

      config = this.data('video');

      this.trigger('video.ended');

      if (config.loop) {
        config.player.play();
      }

    },

    resetize: function() {

      config = this.data('video');

      this.find('.video-js').css({ height: 'auto', width: 'auto', 'margin-left': '0', 'margin-top': '0'});

    },

    reset: function () {

      config = this.data('video');

      if (config.player) {
        config.player.currentTime = 0;
      }

    },

    playFromStart: function () {

      this.video('reset');
      this.video('play');

    },

    play: function () {

      this.video('resize', true);

    },

    pause: function () {

      config = this.data('video');

      //this.removeClass('video-playing');

      if (config.player) {
        config.player.pause();
      }

    },

    resize: function(play) {

      var hw, hh, vw, vh, nh, nw, mt, ml;

      config = this.data('video');

      //if (this.attr('data-video-width') && this.attr('data-video-height') && this.attr('data-video-width') != '0' && this.attr('data-video-height') != '0') {
      if (this.attr('x-base-video-ready') == '1') {

        if (config.aspect_ratio == 'fixed') {
          this.css('height', 'auto');
        }

        vw = parseInt(this.attr('data-video-width'));
        vh = parseInt(this.attr('data-video-height'));
        hw = this.width() || vw;
        hh = this.height() || vh;

        if (config.aspect_ratio == 'fixed') {

          if ((vh / hh) > (vw / hw)) {
            nw = (vw/vh) * hh;
            this.find('.video-js').css({ height: hh + 'px', width: nw + 'px' });
          } else {
            nh = (vh/vw) * hw;
            this.find('.video-js').css({ width: hw + 'px', height: nh + 'px' });
            this.css('height', nh + 'px');
          }

        } else {

          if ((vh / hh) < (vw / hw)) {
            nw = (vw/vh) * hh;
            ml = (nw - hw) / 2;
            this.find('.video-js').css({ height: hh + 'px', width: nw + 'px', 'margin-left': '-' + ml + 'px', 'margin-top': '0'  });
          } else {
            nh = (vh/vw) * hw;
            mt = (nh - hh) / 2;
            this.find('.video-js').css({ width: hw + 'px', height: nh + 'px', 'margin-top': '-' + mt + 'px', 'margin-left': '0' });
          }

        }

        if (play) {
          this.addClass('video-playing');
          this.removeClass('show-poster');
          config.player.play();
          config.player.playbackRate = config.speed;
        }

        this.trigger('video.resized');
        base.trigger('video.resized');


      } else if (!this.hasClass('video-error') && !this.hasClass('invalid-device')) {

        if (!this.attr('data-video-width') || this.attr('data-video-width') == '0') {
          this.attr({
            'data-video-width': config.player.videoWidth,
            'data-video-height': config.player.videoHeight,
            'data-video-duration': config.player.duration
          });
        }

        if (this.attr('data-video-width') && this.attr('data-video-width') != '0') {
          this.attr('x-base-video-ready', 1);
        }

        this.delay(100, function(){
          this.video('resize', play);
        });

      }

    }

  });

})(base, window);
