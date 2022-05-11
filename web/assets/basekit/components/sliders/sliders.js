(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    activeFrame: 1,
    autoplay: true,
    autoplay_break_on_click: true,
    autoplay_delay: 5000,
    set_height: false,
    videoFrame: false,
    timer: ''
  }

  // VARS
  var elm;


  // LISTENERS
  base.on('click', '[x-base-control="slider.set"]', function(event){

    elm = this.getTarget("[x-base-slider]");

    elm.slider('set', this.attr('x-base-frame'));

    event.stopPropagation();

  });
  base.on('click', '[x-base-control="slider.next"]', function(event){

    elm = this.getTarget("[x-base-slider]");

    elm.slider('next');

    event.stopPropagation();

  });
  base.on('click', '[x-base-control="slider.prev"]', function(event){

    elm = this.getTarget("[x-base-slider]");

    elm.slider('prev');

    event.stopPropagation();

  });
  base.on('window.resized window.loaded', function(){

    for(var x in elements) {

      elements[x].slider('resize');

    }

  });


  // METHODS
  base.plugin('slider', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('slider', config);

      // Set attr
      this.attr("x-base-slider", "1");

      // Set id
      config.id = "#" + this.attr('id');

      // Set total frames
      config.totalFrames = this.find('.frame').count;
      this.find('[x-base-slider-total]').html(config.totalFrames);
      this.find('[x-base-slider-current]').html(config.activeFrame);

      // Show controls if more than 1 frame
      if (config.totalFrames > 1) {
        this.addClass('show-controls');
      }

      // Preload some frames in both directions
      this.slider('setFrameIndexes', 'next');
      this.slider('setFrameIndexes', 'prev');

      // Add Dots
      this.slider('addDots');

      // Set starting classes
      this.find('.frame').addClass('frame-before');
      this.find('.frame-' + config.totalFrames).removeClass('frame-before').addClass('frame-after');
      this.find('.frame-' + config.activeFrame).removeClass('frame-before frame-after').addClass('frame-transition frame-active');

      // Check video
      this.slider('video', config.activeFrame, 'playFromStart');

      // Set active classes
      this.slider('setActiveClasses', config.activeFrame);
      this.find('.frame').addClass('frame-ready').removeClass('frame-load');

      // Resize
      this.slider('resize');

      // Autoplay
      if (config.totalFrames > 1) {
        this.slider('autoplaySet');
      }

      return this;

    },

    addDots: function() {

      config = this.data('slider');

      dots = this.find("[x-base-control='slider.dots']");

      if (dots.count && !dots.html()) {
        for (var x = 1; x <= config.totalFrames; x++) {

          dots.html('<span class="dot dot-' + x + '" x-base-control="slider.set" x-base-frame="' + x + '"></span>', 'append');

        }
      }

    },

    autoplaySet: function() {

      config = this.data('slider');

      if (config.autoplay && !config.videoFrame) {

        config.timer = this.delay(config.autoplay_delay, function(){

          config = this.data('slider');

          if (config.autoplay) {
            this.slider('next', true);
          }

        });

      }

    },

    autoplayCheck: function(isAutoplay) {

      config = this.data('slider');

      if (isAutoplay !== true) {
        if (config.autoplay_break_on_click) {
          config.autoplay = false;
        }
      }

      //clearTimeout(config.timer);

    },

    set: function(frame) {

      config = this.data('slider');

      config.nextFrame = parseInt(frame);

      if (config.nextFrame > config.activeFrame) {
        direction = 'next';
      } else if (config.nextFrame < config.activeFrame) {
        direction = 'prev';
      } else {
        direction = false;
      }

      if (direction) {

        this.slider('autoplayCheck', false);

        this.slider('preLoadFrames');

        this.slider('setFrameClasses', direction);

      }

    },

    next: function(isAutoplay) {

      config = this.data('slider');

      if (config.totalFrames > 1) {

        this.slider('autoplayCheck', isAutoplay);

        this.slider('setFrameIndexes', 'next');

        this.slider('setFrameClasses', 'next');

        this.slider('autoplaySet');

      }

    },

    prev: function(isAutoplay) {

      config = this.data('slider');

      if (config.totalFrames > 1) {

        this.slider('autoplayCheck', isAutoplay);

        this.slider('setFrameIndexes', 'prev');

        this.slider('setFrameClasses', 'prev');

      }


    },

    setFrameClasses: function(direction) {

      config = this.data('slider');

      this.find('.frame').addClass('frame-before');
      this.find('.frame-' + config.activeFrame).removeClass('frame-before');

      if (direction == 'next') {
        config.before = 'before';
        config.after = 'after';
        this.find('.frame-' + config.nextFrame).removeClass('frame-after frame-transition').addClass('frame-before');
      } else {
        config.before = 'after';
        config.after = 'before';
        this.find('.frame-' + config.nextFrame).removeClass('frame-before frame-transition').addClass('frame-after');
      }

      this.slider('video', config.activeFrame, 'pause');
      this.slider('video', config.nextFrame, 'playFromStart');

      this.delay(100, function(){

        config = this.data('slider');

        this.find('.frame').removeClass('frame-active');
        this.find('.frame-' + config.activeFrame).removeClass('frame-active frame-in frame-' + config.before).addClass('frame-transition frame-out frame-' + config.after);
        this.find('.frame-' + config.nextFrame).removeClass('frame-out frame-' + config.before).addClass('frame-transition frame-active frame-in');

        this.slider('setActiveClasses', config.nextFrame);

        config.activeFrame = config.nextFrame;

        this.find('[x-base-slider-current]').html(config.activeFrame);

      });

    },

    video: function(frame, method) {

      config = this.data('slider');

      var video = this.find('.frame-' + frame + ' [x-base-slider-video]');

      if (video.count) {
        config.videoFrame = true;
        video.video(method);
      } else {
        config.videoFrame = false;
      }

    },

    videoEnded: function() {

      config = this.data('slider');

      if (config.autoplay) {

        this.slider('next', true);

      }

    },

    setActiveClasses: function(frame) {

      config = this.data('slider');

      this.find("[x-base-control='slider.set']").removeClass('active');
      this.find("[x-base-control='slider.set'][x-base-frame='" + frame + "']").addClass('active');

      base("[x-base-target='" + config.id + "'][x-base-control='slider.set']").removeClass('active');
      base("[x-base-target='" + config.id + "'][x-base-control='slider.set'][x-base-frame='" + frame + "']").addClass('active');

    },

    setFrameIndexes: function(direction) {

      config = this.data('slider');

      if (direction == 'next') {
        config.nextFrame = config.activeFrame + 1;
      } else {
        config.nextFrame = config.activeFrame - 1;
      }

      if (config.nextFrame > config.totalFrames) {
        config.nextFrame = 1;
      } else if (config.nextFrame == 0) {
        config.nextFrame = config.totalFrames;
      }

      if (direction == 'next') {
        config.preloadFrame = config.nextFrame + 1;
      } else {;
        config.preloadFrame = config.nextFrame - 1;
      }

      if (config.preloadFrame > config.totalFrames) {
        config.preloadFrame = 1;
      } else if (config.preloadFrame == 0) {
        config.preloadFrame = config.totalFrames;
      }

      this.slider('preLoadFrames');

    },

    preLoadFrames: function() {

      config = this.data('slider');

      // this.find('.frame-' + config.activeFrame + ' .bgr-img').addClass('defer');
      // this.find('.frame-' + config.nextFrame + ' .bgr-img').addClass('defer');
      // this.find('.frame-' + config.preloadFrame + ' .bgr-img').addClass('defer');

      base.imgDefered(this.find('.frame-' + config.activeFrame));
      base.imgDefered(this.find('.frame-' + config.nextFrame));
      base.imgDefered(this.find('.frame-' + config.preloadFrame));

    },

    resize: function() {

      config = this.data('slider');

      if (config.set_height) {

        height = 0;

        this.find('.frame').css('height', 'auto').each(function(){

          if (this.height() > height) {
            height = this.height();
          }

        });

        this.css({
          height: height + 'px'
        });

        this.find('.frame').css({
          height: height + 'px'
        });

      }

    }

  });

})(base, window);
