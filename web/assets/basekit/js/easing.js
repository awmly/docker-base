(function(base, window) {

  // https://github.com/danro/easing-js/blob/master/easing.js
  var easingEquations = {

    linnear: function(pos) {
      return pos;
    },

    easeOutSine: function(pos) {
      return Math.sin(pos * (Math.PI / 2));
    },

    easeInOutSine: function(pos) {
      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
    },

    easeInOutQuint: function(pos) {
      if ((pos /= 0.5) < 1) {
        return 0.5 * Math.pow(pos, 5);
      }
      return 0.5 * (Math.pow((pos - 2), 5) + 2);
    }

  };

  base.easing = function(equation, currentFrame, totalFrames, currentPosition, targetPosition) {

    var ratio = easingEquations[equation](currentFrame / totalFrames);

    return parseInt(currentPosition) + ((parseInt(targetPosition) - parseInt(currentPosition)) * ratio);

  };

})(base, window);
