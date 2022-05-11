(function(base, window) {

  function throttle (callback, limit) {

    var allow = true;
    var waiting = false;

    var call = function() {

      callback.call();

      setTimeout(function() {

        if (waiting) {
          waiting = false;
          call();
        } else {
          allow = true;
        }

      }, limit);

    }

    return function() {

      if (allow) {
        allow = false;
        call();
      } else {
        waiting = true;
      }

    }

  }

  function setWindow() {

    //var ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    //var wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    ww = document.body.clientWidth || window.innerWidth; //document.body.clientWidth || 
    wh = window.innerHeight;
    dh = document.documentElement.clientHeight;

    hh = base('header').height();

    base.data('window.width', ww);
    base.data('window.height', wh);
    base.data('viewport.height', dh);
    base.data('content.height', dh - hh);

  }

  window.addEventListener('resize', throttle(function() {

    setWindow();

    base.trigger('window.resetize');
    base.trigger('window.resize');
    base.trigger('window.resized');

  }, 50), {passive:true});

  window.addEventListener("mousemove", function() {

    base.trigger('mouse.move');

  });

  document.addEventListener("touchstart", function() {

    base.trigger('touch.start');

  });

  var interacted = false
  base.on('mouse.move touch.start', function() {

    if (!interacted) {
      base.trigger('window.interact');
    }

    interacted = true;

  });

  window.addEventListener('scroll', throttle(function() {

    var scrollTop = window.scrollY || window.pageYOffset;

    var scrollDirection = scrollTop < base.data('window.scrollTop') ? 'up' : 'down';

    base.data('window.scrollDirection', scrollDirection);

    base.data('window.scrollTop', scrollTop);

    base.trigger('window.scroll');

  }, 50), {passive:true});

  //window.addEventListener('load', function(){

    setWindow();

    base('body').removeClass('window-loading').addClass('window-loaded');

    base.trigger('window.load');
    base.trigger('window.loaded');

  //});

  // FUCK I HATE IE
  if (base.feature('ie')) {

    setTimeout(function() {
    
      setWindow();

      base('body').removeClass('window-loading').addClass('window-loaded');

      base.trigger('window.load');
      base.trigger('window.loaded');
      
    }, 500);

  }

  setWindow();
  base.data('window.scrollTop', window.scrollY || window.pageYOffset);

})(base, window);
