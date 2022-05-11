(function(base, window) {

  function touchend (event) {

    var dir = event.wheelDelta;

    if (dir > 0 && this.elm.scrollTop === 0) {
      event.preventDefault();
    }

    if (dir < 0 && (this.elm.scrollTop >= this.elm.scrollHeight - this.height())) {
      event.preventDefault();
    }

    event.stopPropagation();

  }

  function touchstart (event) {

    var touch = event.touches[0] || event.changedTouches[0];

    this.data('pageY', touch.pageY);
    this.data('pageX', touch.pageX);

  }

  function touchmove (event) {

    //event.stopPropagation(); BREAKS SWIPER

    var touch = event.touches[0] || event.changedTouches[0];

    var dir = this.data('pageY') - touch.pageY;
    var dirX = this.data('pageX') - touch.pageX;

    var dist = dir;
    var distX = dirX;

    if (dist < 0) {
      dist = dist * -1;
    }

    if (distX < 0) {
      distX = distX * -1;
    }

    if (dist > distX) {

      if (dir > 0 && (this.elm.scrollTop >= this.elm.scrollHeight - this.height())) {
        event.preventDefault();
      }

      if (dir < 0 && this.elm.scrollTop === 0) {
        event.preventDefault();
      }

    }

  }

  base('.stop-parent-scroll').on('mousewheel touchend', function(event) {

    touchend.apply(this, [event]);

  }, {passive:false});


  base('.stop-parent-scroll').on('touchstart', function(event) {

    touchstart.apply(this, [event]);

  }, {passive:true});


  base('.stop-parent-scroll').on('touchmove', function(event) {

    touchmove.apply(this, [event]);

  }, {passive:false});


  base('.stop-parent-scroll-holder').on('mousewheel touchend', '.stop-parent-scroll', function(event) {

    touchend.apply(this, [event]);

  }, {passive:false});


  base('.stop-parent-scroll-holder').on('touchstart', '.stop-parent-scroll', function(event) {

    touchstart.apply(this, [event]);

  }, {passive:true});


  base('.stop-parent-scroll-holder').on('touchmove', '.stop-parent-scroll', function(event) {

    touchmove.apply(this, [event]);

  }, {passive:false});

})(base, window);
