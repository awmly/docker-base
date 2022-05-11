(function(base, window) {

  'use strict';

  var stateObj;

  // Shortcut events
  base.history = function(id, method, url, data) {

    stateObj = {
      id: id,
      state: data
    };

    history[method + 'State'](stateObj, 'Base', url);

    base.trigger('history.push.' + id);

  };

  window.addEventListener('popstate', function(event) {

    if (event.state != null) {
      base.trigger('history.pop.' + event.state.id, event.state);
    }

  });

})(base, window);
