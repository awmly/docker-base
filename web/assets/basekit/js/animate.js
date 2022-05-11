(function(base, window) {

  /*
  this.animate({
    translateX: {
      start: -200,
      finish:0
    },
    opacity: 1
  }, 600);
  */

  base.animate = function(element, properties, speed, delay, easing, callback, callbackElement) {

    var speed = speed   || 2000, // speed equals pixels per second!
        easing = easing || 'easeOutSine',
        delay = delay || 0,
        frame = 0,
        ratio = 0;

    // Length between 0.1 - 1 second
    // Is this really needed to be this complicated?
    // If we set a speed of 2000 px/s and it gets animated 4000px lets just animate over 2s ????
    //var length = ; //Math.max(.1, Math.min(Math.abs(properties.scrollY - properties.scrollTargetY) / speed, 1));

    // Calculate total frames based on 60fps
    var totalFrames = (speed / 1000) * 60;

    var totalDelay = (delay / 1000) * 60;

    var styles = [];

    for (style in properties) {
      if (typeof properties[style].start !== 'undefined') {
        styles[style] = properties[style];
      } else {
        styles[style] = {
          start: element.css(style) || 0,
          finish: properties[style]
        }
      }

    }

    function animate() {

      frame++;

      if (frame < (totalFrames + totalDelay)) {

        if (frame >= totalDelay) {

          if (styles.scrollY) {
            if ('scrollTo' in element) {
              element.scrollTo(0, base.easing(easing, frame - totalDelay, totalFrames, styles.scrollY.start, styles.scrollY.finish));
            } else {
              element.scrollTop(base.easing(easing, frame - totalDelay, totalFrames, styles.scrollY.start, styles.scrollY.finish));
            }
          } else {
            for (style in styles) {
              if (style == 'scrollLeft') {
                element.scrollLeft(base.easing(easing, frame - totalDelay, totalFrames, styles[style].start, styles[style].finish));
              } else if (style == 'scrollTop') {
                element.scrollTop(base.easing(easing, frame - totalDelay, totalFrames, styles[style].start, styles[style].finish));
              } else {
                element.css(setStyle(style), setValue(style, base.easing(easing, frame - totalDelay, totalFrames, styles[style].start, styles[style].finish)));
              }
            }
          }

        }

        requestAnimationFrame(animate);

      } else {

        if (properties.scrollY) {
          if ('scrollTo' in element) {
            element.scrollTo(0, styles.scrollY.finish);
          } else {
            element.scrollTop(styles.scrollY.finish);
          }
        } else {
          for (style in styles) {
            if (style == 'scrollLeft') {
              element.scrollLeft(styles[style].finish);
            } else if (style == 'scrollTop') {
              element.scrollTop(styles[style].finish);
            } else {
              element.css(setStyle(style), setValue(style, styles[style].finish));
            }
          }
        }

        if (typeof callback === 'function') {
          callback.apply(callbackElement || element);
        }

      }

    }

    animate();

  };

  setStyle = function(style) {

    if (style == 'rotate' || style == 'rotateX' || style == 'scale' || style == 'translateX' || style == 'translateY') {
      style = 'transform';
    }

    return style;

  };

  setValue = function(style, value) {

    if (style == 'rotate') {
      value = 'rotateZ(' + value + 'deg)';
    }

    if (style == 'rotateX') {
      value = 'rotateX(' + value + 'deg)';
    }

    if (style == 'scale') {
      value = 'scale(' + value + ', ' + value + ')';
    }

    if (style == 'translateX') {
      value = 'translateX(' + value + 'px)';
    }

    if (style == 'translateY') {
      value = 'translateY(' + value + 'px)';
    }


    return value;

  };

})(base, window);
