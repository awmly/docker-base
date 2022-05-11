(function(base, window) {

  var start;

  base.scrollToElm = function (target, speed) {

    var position = base(target).offset().header;
    var easing = 'easeOutSine';

    start = base.data('window.scrollTop');

    base.animate(window, {
      scrollY: {
        start: start,
        finish: position
      }
    }, speed, 0, easing);

  }

  base.scrollTo = function(elm, position, speed, easing) {

    this.trigger('scrollto.start');

    if ('scrollTo' in elm) {
      start = base.data('window.scrollTop');
    } else {
      start = elm.scrollTop();
    }

    base.animate(elm, {
      scrollY: {
        start: start,
        finish: position
      }
    }, speed, 0, easing, function(){

      this.trigger('scrollto.finish');

    }, this);

  }


  base('[x-base-scrollto]').on('click', function(event){

    if (parseInt(this.attr('x-base-scrollto'))) {

      var position = parseInt(this.attr('x-base-scrollto'));

    } else {

      var target = base(this.attr('x-base-scrollto'));

      if (this.attr('x-base-scrollto-offset-up') && target.offset().top < base.data('window.scrollTop')) {
        var position = target.offset().top - parseInt(this.attr('x-base-scrollto-offset-up'));
      } else if (this.attr('x-base-scrollto-offset')) {
        var position = target.offset().top - parseInt(this.attr('x-base-scrollto-offset'));
      } else if (this.hasAttr('x-base-scrollto-offset-header')) {
        var position = target.offset().header - parseInt(this.attr('x-base-scrollto-offset-header'));
      } else if (this.hasAttr('x-base-scrollto-offset-module')) {
        var position = target.offset().header - parseInt(this.height()) + 5;
      } else {
        var position = target.offset().header;// - parseInt(target.css('margin-top'));
      }
    
    }

    var speed = this.attr('x-base-scrollto-speed') || 300;
    var easing = this.attr('x-base-scrollto-easing') || 'easeOutSine';

    base.scrollTo.apply(this, [window, position, speed, easing]);

    event.preventDefault();
    return false;

  });

  base.on('window.resize window.ready', function() {

    base('.set-scroll-offset-header').each(function() {

      this.find('[x-base-scrollto-offset-header]').attr('x-base-scrollto-offset-header', this.height());

    });

  });


  // Spying
  if (base('[x-base-scrollto-grp]').count) {

    base.on('base.load', function() {

      base('[x-base-scrollto-grp]').each(function() {

        if (window.location.hash.substring(1) == this.attr('x-base-hash')) {

          var target = base(this.attr('x-base-scrollto'));

          if (this.attr('x-base-scrollto-offset')) {
            var position = target.offset().top - parseInt(this.attr('x-base-scrollto-offset'));
          } else if (this.hasAttr('x-base-scrollto-offset-header')) {
            var position = target.offset().header - parseInt(this.attr('x-base-scrollto-offset-header'));
          } else if (this.hasAttr('x-base-scrollto-offset-module')) {
            var position = target.offset().header - parseInt(this.height());
          } else {
            var position = target.offset().header;
          }

          window.scrollTo(0, position);

        }

      });

    });

    base.on('window.scroll', function() {

      base('[x-base-scrollto-grp]').removeClass('active');

      var hash = false;

      base('[x-base-scrollto-grp]').each(function() {

        var grp = this.attr('x-base-scrollto-grp');

        var target = base(this.attr('x-base-scrollto'));

        if (this.attr('x-base-scrollto-offset-up') && base.data('window.scrollDirection') == 'up') {
          var offset = parseInt(this.attr('x-base-scrollto-offset-up'));
        } else if (this.attr('x-base-scrollto-offset')) {
          var offset = parseInt(this.attr('x-base-scrollto-offset'));
        } else if (this.hasAttr('x-base-scrollto-offset-header')) {
          var offset = base('header').height() + parseInt(this.attr('x-base-scrollto-offset-header'));
        } else if (this.hasAttr('x-base-scrollto-offset-module')) {
          var offset = base('header').height() + parseInt(this.height());
        } else {
          var offset = base('header').height();
        }

        if (target.offset().window <= offset) {
          base('[x-base-scrollto-grp="' + grp + '"]').removeClass('active');
          this.addClass('active');
          hash = this.attr('x-base-hash');
        }

      });

      if (hash) {
        if (hash != window.location.hash.substring(1)) {
          base.history('scroll', 'replace', '#' + hash);
          base.trigger('scroll.to', hash);
        }
      }

    });

  }


})(base, window);
