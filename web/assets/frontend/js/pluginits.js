(function() {

  base(".popup-iframe").popup({
    type: 'iframe',
    width: 1280,
    height: 720,
    aspect_ratio: 'fixed',
    devices: 'xs|sm|md|lg|xl|2xl',
    gutter: 50
  });

  base(".popup-view").popup({
    type: 'ajax',
    width: 2000,
    height: 'auto',
    aspect_ratio: 'variable',
    devices: 'xs|sm|md|lg|xl|2xl',
    gutter: 50
  });

  // Init autos
  base("[x-base-module]").each(function() {

    this.module({
      autoload: false,
      method: 'POST',
      url: '/module/' + this.attr('x-base-module') + '/scripts/view/' + base('[x-base-view]').attr('x-base-view')
    });

  });

  base('.fix-height-holder, [x-base-module]').fixedHeight({
    'selectors': '.fix-height'
  });
  base.on('img.loaded', function() {
    base.trigger('base.fixheight');
  });

})();
