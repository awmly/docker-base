(function(base, window) {

  base.isDevice = function(devices) {

    return !!devices ? devices.indexOf(base.data('device.id')) >= 0 : false;

  }

  base.setWindowHeights = function() {

    base('[x-base-set-height]').each(function(){

      base.setHeight(this.elm);

    });

  };

  base.on('window.resize window.load window.heights', function() {

    base.setWindowHeights();
    base.trigger('window.heights.set');

  });

})(base, window);
