(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    min_days: 4,
    disallowed_days: ['na']
  }

  // VARS
  var elm;


  // LISTENERS
  base.on('click', '[x-base-toggle="date.set"]', function(){

    elm = this.getTarget("[x-base-calendar]");

    elm.calendar('setDate', parseInt(this.attr('x-base-date-index')), this.attr('x-base-date'));

  });

  base.on('mouseover', '[x-base-toggle="date.set"]', function(){

    elm = this.getTarget("[x-base-calendar]");

    elm.calendar('hoverDate', parseInt(this.attr('x-base-date-index')));

  });

  base.on('click', '[x-base-date-error]', function(){

    this.removeClass('active');

  });


  // METHODS
  base.plugin('calendar', {

    init: function(config) {

      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;

      // Store element in elements
      elements[this.id()] = this;

      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      config.clickId = 1;
      config.startIndex = false;
      config.endIndex = false;
      this.data('calendar', config);

      // Set attr


      return this;

    },

    checkIndexes: function() {

      config = this.data('calendar');

      if (config.startIndex > config.endIndex) {
        var index = config.startIndex;
        var date = config.startDate;
        config.startIndex = config.endIndex;
        config.startDate = config.endDate;
        config.endIndex = index;
        config.endDate = date;
      }

    },

    setDate: function(dateIndex, date) {

      config = this.data('calendar');

      if (config.clickId == 1) {

        this.trigger('dates.clear', config);

        this.find('[x-base-date-error]').removeClass('active');

        config.startDate = date;
        config.startIndex = dateIndex;
        config.clickId = 2;

        this.calendar('highlightDates', config.startIndex, config.startIndex);

      } else {

        config.endDate = date;
        config.endIndex = dateIndex;
        config.clickId = 1;

        this.calendar('checkIndexes');

        this.calendar('checkSelection')

        if (!config.allow_status) {

          this.find('[x-base-date-error="status"]').addClass('active');

        } else if (!config.allow_duration) {

          this.find('[x-base-date-error="duration"]').addClass('active');

        } else {

          this.calendar('highlightDates', config.startIndex, config.endIndex);
          this.trigger('dates.selected', config);

        }

      }

    },

    hoverDate: function(endIndex) {

      config = this.data('calendar');

      if (config.clickId == 1) return;

      if (config.startIndex < endIndex) {
        this.calendar('highlightDates', config.startIndex, endIndex);
      } else {
        this.calendar('highlightDates', endIndex, config.startIndex);
      }

    },

    highlightDates: function(startIndex, endIndex) {

      config = this.data('calendar');

      this.find('.selected').removeClass('selected');

      for (var index = startIndex; index <= endIndex; index++) {

        this.find('[x-base-date-index="' + index + '"]').addClass('selected');

      }

    },

    checkSelection: function() {

      config = this.data('calendar');

      config.allow_status = true;
      config.allow_duration = true;
      var totalDays = 0;

      for (var index = config.startIndex; index <= config.endIndex; index++) {

        totalDays++;

        if (config.disallowed_days.includes(this.find('[x-base-date-index="' + index + '"]').attr('x-base-date-status'))) {
          config.allow_status = false;
        }

      }

      if (totalDays < config.min_days) {
        config.allow_duration = false;
      }

    }

  });

})(base, window);
