(function(base, window) {

  base('nav .collapse-icon').on('click', function() {

    var li = this.parents('li');

    if (li.hasClass('sub-nav-open')) {
      li.removeClass('sub-nav-open');
    } else {
      li.addClass('sub-nav-open');
    }

  });

  base('nav.nav-horizontal li').on('mouseover touchstart', function() {

    base.subNavWidths(this, true);

  }, { passive:true });

  base('.responsive-nav li').on('mouseover touchstart', function() {

    if (base.data('device.desktop')){
      set = true;
    } else {
      set = false;
    }

    base.subNavWidths(this, set);

  }, { passive:true });

  base.subNavWidths = function($this, set) {

    if (!$this.find('.sub').count) {
      return;
    }

    $this = $this.find('.sub');

    ul = $this.children('ul');

    if (set == true) {

      width = 0;

      $this.css('width', '1000px');

      ul.css({
        'width':'auto'
      });

      ul.children().each(function() {

        $t = this;

        $t.css({
          display: 'inline-block',
          width: 'auto'
        });

        if ($t.width() > width) {
          width = $t.width();
        }

      });

      $this.css('width', '');

      if (width < ul.width()) {
        width = '100%';
      } else {
        width++;
        width = width + 'px';
      }

      ul.css({
        'width': width
      });

      ul.children().css({
        'width': width,
        'display': 'block'
      });

    } else {

      ul.css({
        'width': ''
      });

      ul.children().css({
        'width': '',
      });

    }

  }

})(base, window);
