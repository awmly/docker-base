(function(base, window) {

  if (base.feature('touch')) {
    base('html').addClass('touch');
  } else {
    base('html').addClass('no-touch');
  }


  function clearTouchHovers() {

    base('.hovered').each(function() {
      this.removeClass('hovered');
      this.trigger('touchhover.deactive');
    });

  }

  base('.touch-hover').on('touchend', function(event) {

    elm = this.hasClass('hover-parent') ? this.parent() : this;

    if (elm.hasClass('hovered')) {

      elm.trigger('touchhover.click');
      return true;

    } else {

      clearTouchHovers();

      elm.addClass('hovered');
      elm.trigger('touchhover.active');

      event.preventDefault();
      event.stopPropagation();
      return false;

    }

  }, {passive:false});


  base('html').on("touchend", ":not(.touch-hover)", function(event) {

    clearTouchHovers();

  });

})(base, window);
