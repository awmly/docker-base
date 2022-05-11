(function(base, window) {

  base.on('window.scroll window.ready', function() {

    if (base.data('device.id') == 'lg') {

      base('.resp-bgr-paralax').each(function() {

        offset = Math.ceil(this.offset().window / 5);

        this.css('background-position', 'center ' + offset + 'px');

      });

    } else {

      base('.resp-bgr-paralax').css('background-position', 'center 0');

    }

  });

})(base, window);
