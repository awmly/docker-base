(function(base, window) {

  // Declare vars
  var config, header, placeholder, hh, ph, st, previousScroll;

  // Set header object
  header = base('header');

  if (header.count) {

    // Config
    config = {
      shrink: parseInt(header.attr('x-base-shrink')),
      scroll: parseInt(header.attr('x-base-scroll')),
      scrollUp: parseInt(header.attr('x-base-scroll-up')),
      header_height: false,
      cta: false,
    };

  } else {
    config = {};
  }


  /*
   * Scroll header
   */
  base.headerScroll = function() {

    st = window.scrollY || window.pageYOffset;

    if (st > config.scroll) {
      header.addClass('scroll');
      header.removeClass('not-scroll');
    } else {
      header.addClass('not-scroll');
      header.removeClass('scroll');
    }

  }


  /*
   * Scroll Up header
   */
  base.headerScrollUp = function() {

      if (window.scrollY > previousScroll || window.scrollY == 0) {
        header.addClass('scroll-up');
        header.removeClass('scroll-down');
      } else {
        header.addClass('scroll-down');
        header.removeClass('scroll-up');
      }

      if (window.scrollY > 200) {

        if (window.scrollY > previousScroll) {
          header.addClass('slide-up');
          header.removeClass('slide-down');
        } else {
          header.addClass('slide-down');
          header.removeClass('slide-up');
        }

      } else {
        header.addClass('slide-down');
        header.removeClass('slide-up');
      }

      previousScroll = window.scrollY;

  }


  /*
   * Shrink header
   */
  base.headerShrink = function() {

    // Shrink header
    if (base.data('device.desktop')) {

      if (!config.header_height) {
        config.header_height = header.height();
      }

      var st = base.data('window.scrollTop');

      hh = Math.floor(config.header_height - (st / 4));

      if (hh <= config.shrink){

        hh = config.shrink;
        header.addClass('shrunk');
        header.removeClass('not-shrunk');

      } else {

        header.removeClass('shrunk');
        header.addClass('not-shrunk');

      }

      //hh = Math.floor(hh);
      //if (hh % 2) hh = hh + 1;

      header.css('height', hh + 'px');

      header.trigger('shrink');

    } else {

      header.addClass('shrunk');
      header.removeClass('not-shrunk');

      header.css('height', '');

    }

  };


  // Open mobile nav listener
  base("[x-base-toggle='nav.mobile']").on('click', function() {

    var mobilenav = base('[x-base-mobile-nav]');

    if (mobilenav.attr('x-base-open') == '1') {

      mobilenav.removeClass('mobile-open');
      mobilenav.attr('x-base-open', 0);

    } else {

      mobilenav.addClass('mobile-open');
      mobilenav.attr('x-base-open', 1);

    }

  });


  // Resize listener
  base.on('window.resize window.scroll window.load base.load', function() {

    if (config.shrink > 0) {
      base.headerShrink();
    }

    if (config.scroll > 0) {
      base.headerScroll();
    }

    if (config.scrollUp > 0) {
      base.headerScrollUp();
    }

  });

})(base, window);
