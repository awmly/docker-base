(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    left: true,
    right: true,
    up: false,
    down: false,
    sensitivity: 'low'
  }

  // VARS
  var elm;


  // LISTENERS
  base("body").on('touchstart mousedown', "[x-base-swiper]", function(event){

    this.swiper('start', event);

  });

  base("body").on('touchmove mouseup', "[x-base-swiper]", function(event){

    this.swiper('move', event);

  });



  // METHODS
  base.plugin('swiper', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('swiper', config);


      // Add atr
      this.attr('x-base-swiper', '');

      return this;

    },

    start: function(event) {

      config = this.data('swiper');

      config.coX = event.pageX || event.touches[0].pageX;
      config.coY = event.pageY || event.touches[0].pageY;

      config.swiped = false;

    },

    move: function(event) {

      config = this.data('swiper');

      var distX = config.coX - (event.pageX || event.touches[0].pageX);
      var distY = config.coY - (event.pageY || event.touches[0].pageY);

      var dirX, dirY, dir, dist, size;

      if (distX < 0) {
        dirX = 'right';
        distX = distX * -1;
      } else {
        dirX = 'left';
      }

      if (distY < 0) {
        dirY = 'down';
        distY = distY * -1;
      } else {
        dirY = 'up';
      }

      if (distX > distY) {
        dir = dirX;
        dist = distX;
        size = this.width();
      } else {
        dir = dirY;
        dist = distY;
        size = this.height();
      }

      if (config[dir] && !config.swiped) {

        var percent = (dist / size) * 100;

        if (percent > 80 || (percent > 35 && config.sensitivity == 'medium') || (percent > 15 && config.sensitivity == 'low')) {

          this.trigger('swipe swipe.' + dir, {
            'direction': dir,
            'distance': dist
          });

          config.swiped = true;

        }

      }

    }

  });

})(base, window);
