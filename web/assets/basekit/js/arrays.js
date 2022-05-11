(function(base, window) {

  base.array = function(_array) {

    // Clone the array
    array = JSON.parse(JSON.stringify(_array));

    return {

      get: function() {

        return array;

      },

      join: function(separator) {

        separator = separator || "/";

        return array.join(separator);

      },

      merge: function(source, source2) {

        var merged = {};

        for (var x in source) {
          array[x] = source[x];
        }

        //Object.assign(merged, array);
        //Object.assign(merged, source);

        if (typeof source2 !== 'undefined') {
          for (var x in source2) {
            array[x] = source2[x];
          }
        }

        //array = merged;

        return array;

      },

      push: function(source) {

        for (var x = 0; x < source.length; x++) {
          array.push(source[x]);
        }

        return array;

      },

      set: function(key, value) {

        if (value) {
          this.add(key, value);
        } else {
          this.remove(key);
        }

      },

      add: function(key, value) {

        for(x=0; x<array.length; x++) {

          if (array[x] == key) {
            array[x+1] = value;
            return;
          }

        }

        array.push(key);
        array.push(value);

      },

      remove: function(param) {

        for(x=0; x<array.length; x++) {

          if (array[x] == param) {
            array.splice(x, 2);
          }

        }

      }

    }

  };

})(base, window);
