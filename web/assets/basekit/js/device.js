(function(base, window) {

  base.on('base.core window.resize window.load', function(){

    for (var device in deviceConfig) {

      var breakpoint = deviceConfig[device];

      //ww = base.data('window.width');
      ww = window.innerWidth;
      wh = base.data('window.height');

      if (breakpoint.min_width <= ww && ww < breakpoint.max_width) {

        if (base.data('device.id') != device) {

          // Unregister old
          var oldDevice = base.data('device.id');
          var oldBreakpoint = deviceConfig[oldDevice];

          if (oldDevice) {

            for (var key in oldBreakpoint.data) {
              base.data('device.' + key, false);
            }

            base('body').removeClass(oldBreakpoint.classes);

            base.trigger('device.deactive', oldDevice);

          }

          // Register new
          base.data('device.id', device);

          for (var key in breakpoint.data) {
            base.data('device.' + key, breakpoint.data[key]);
          }

          base('body').addClass(breakpoint.classes);

          base.trigger('device.active', device);

        }

      }

    }

  });

})(base, window);
