(function(base, window) {

  var progress = base('[x-base-progress]');

  base.progress = {

    init: function() {

      progress.addClass('active');
      progress.style.width = 0;

    },

    set: function(percent) {

      progress.style.width = percent + "%";

    },

    complete: function() {

      progress.removeClass('active');

      setTimeout(function(){

        progress.style.width = 0;

      }, 500);

    }

  };

})(base, window);
