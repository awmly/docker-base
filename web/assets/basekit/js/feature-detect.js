(function(base, window) {

  var feature = [];

  base.feature = function(id) {

    return feature[id];

  };

  // Touch
  feature.touch = "ontouchstart" in document.documentElement;

  // IE
  feature.ie = "ActiveXObject" in window;

  // FF
  feature.ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  // SAFARI
  feature.safari =  navigator.userAgent.toLowerCase().indexOf('safari') > -1
                 && navigator.userAgent.toLowerCase().indexOf('chrome') == -1;


})(base, window);
