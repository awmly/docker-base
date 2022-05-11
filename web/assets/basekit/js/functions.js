(function(base, window) {

  'use strict';

  base.data = function(key, val) {

    return base('body').data(key, val);

  };

  base.on = function () {

    base('body').on(arguments[0], arguments[1], arguments[2]);

    return base;

  };

  base.registeredEvents = [];
  base.trigger = function (event, data) {

    base('body').trigger(event, data);

    if (typeof base.registeredEvents[event] != 'undefined') {

      var elms = base.registeredEvents[event];

      for (var x = 0; x < elms.length; x++) {
        elms[x].trigger(event, data);
      }

    }

  };

  base.console = function(log) {
    console.log(log);
    base('#consolelog').append('<code>' + log + '</code>');
  }


  /*
   * var1=converts|var2=a string like this|var3=to an object
   */
  base.parseString = function(string) {

    var params = {};
    var parts = string.split("|");

    for (var x = 0; x < parts.length; x++) {

      var pairs = parts[x].split("=");

      if (pairs[0]) {
        params[pairs[0]] = pairs[1];
      }

    }

    return params;

  };



  base.values = [];

  base.setValue = function(id, callback) {

    base.values[id] = callback;

  };

  base.getValue = function(id) {

    return base.values[id].apply();

  };

  base.serialize = function (data) {

    var array = [];

    for(var key in data) {

      if (Array.isArray(data[key])) {

        for (var x in data[key]) {
          array.push(encodeURIComponent(key + "[]") + "=" + encodeURIComponent(data[key][x]));
        }

      }else if (typeof data[key] === 'object'){

        for (var x in data[key]) {
          array.push(encodeURIComponent(key + "[" + x + "]") + "=" + encodeURIComponent(data[key][x]));
        }

      } else {

       array.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));

      }

    }

    return array.join("&");

  };

  /**
   * String
   */
   base.string = {
     cleanup: function() {
       return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
     }
   };

   /**
    * Number
    */

   base.number = {

     round: function(max_decimals) {

       var pow = Math.pow(10, max_decimals);

       return Math.round(this * pow) / pow;

     },

     roundDown: function(max_decimals) {

       var pow = Math.pow(10, max_decimals);

       return Math.floor(this * pow) / pow;

     }

   };

})(base, window);
