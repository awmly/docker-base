if (typeof base === 'undefined') base = {};
(function(base) {

  'use strict';

  base.params = {};

  if (window.location.search.length) {

    var params = window.location.search.substr(1).split('&');

    for (var x in params) {

      var keyval = decodeURIComponent(params[x]).split('=');

      if (keyval[0]) {
        base.params[keyval[0]] = keyval[1];
      }

    }

  }

})(base);
