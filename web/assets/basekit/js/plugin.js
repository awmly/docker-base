(function(base, window) {

  base.plugin = function(pluginID, methods) {

    base.BaseElement.prototype[pluginID] = function(method, arg1, arg2, arg3) {

      if (typeof method !== 'string') {
        arg1 = method;
        method = 'init';
      }

      if (typeof arg1 === 'undefined') {
        arg1 = {};
      }

      if (this.count > 1) {

        for (var x = 0; x < this.elms.length; x++) {

          var elm = base(this.elms[x]);
          elm['plugin' + pluginID][method].apply(elm, [arg1, arg2, arg3]);

        }

        return this;

      } else if (this.count == 1) {

        return this['plugin' + pluginID][method].apply(this, [arg1, arg2, arg3]);

      }

    }

    base.BaseElement.prototype['plugin' + pluginID] = methods;

  }

})(base, window);
