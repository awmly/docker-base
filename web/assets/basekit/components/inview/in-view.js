(function(base, window) {

  var id, offset, status, top, px, btmpx, height;

  base.on('window.resize window.load inview.check', function() {
    base.inView();
  });

  base.on('window.scroll', function() {
    base.inView();
  });

  base.inView = function() {

    base('[x-base-inview]').each(function() {

      px = this.attr('x-base-inview');
      if (px == 'window') {
        offset = this.attr('x-base-btm-offset') || 0;
        px = window.innerHeight - parseInt(offset);
        btmpx = 150;
      } else {
        px = parseInt(px);
        btmpx = px;
      }

      top = this.elm.getBoundingClientRect().top; //this.offset().window ||

      //btm = top + (this.elm.offsetHeight - parseInt(offset));
      height = this.elm.getBoundingClientRect().height; // this.elm.offsetHeight ||
      if (height < 10) height = 10;
      btm = top + height;
      status = this.attr('x-base-inview-status');

      // Just to check we didn't jump past the scroll point
      if (px > btm && status == 'before') px = btm - 1;

      if ((px >= top && btm > btmpx && status != 'in')) {

        this.removeClass('before after');

        if (status == 'before') {
          this.addClass('before-in');
        } else {
          this.addClass('after-in');
        }

        this.attr('x-base-inview-status', 'in');

        this.addClass('in-view');

        if (!this.hasClass('seen')) {
          this.addClass('seen');
          this.trigger('inview.seen', 'seen');
        }

        this.trigger('inview.change inview.in', 'in');


      } else if ((px < top ) && status == 'in'){

        this.addClass('before');
        this.removeClass('after before-in after-in');

        this.attr('x-base-inview-status', 'before');
        this.removeClass('in-view');
        this.trigger('inview.change inview.out', 'before');

      } else if(btm < btmpx && status == 'in') {

        this.addClass('after');
        this.removeClass('before before-in after-in');

        this.attr('x-base-inview-status', 'after');
        this.removeClass('in-view');
        this.trigger('inview.change inview.out', 'after');

      }

    });

  }

  base('[x-base-inview]').each(function() {

    this.addClass('before');
    this.attr('x-base-inview-status', 'before');

  });

})(base, window);
