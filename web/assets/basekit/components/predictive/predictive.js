(function(base, window) {

  // ELEMENTS
  var config;
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    url: '',
    exact_match_only: false,
    submit_form_on_select: false,
    selected_result: -1,
    results_open: false,
    query: null
  }

  // VARS
  var elm;


  // LISTENERS
  base("body").on('keydown', "[x-base-predictive] input", function(event){

    if (event.keyCode == 13) {

      event.stopPropagation();
      event.preventDefault();

    }

    elm = this.getTarget("[x-base-predictive]");

    elm.predictive('keyDown', event.keyCode);

  });
  base("body").on('keyup', "[x-base-predictive] input", function(event){

    elm = this.getTarget("[x-base-predictive]");

    elm.predictive('keyUp', event.keyCode);

  });
  base("body").on('focusin', "[x-base-predictive] input", function(event){

    elm = this.getTarget("[x-base-predictive]");

    elm.predictive('focus');

  });
  base("body").on('click', "[x-base-predictive] li", function(event){

    elm = this.getTarget("[x-base-predictive]");

    index = this.index('li.result');

    elm.predictive('click', index);

  });

  base("body").on('click', '*', function(event){

    elm = this.parents('[x-base-predictive]');

    for (var x in elements) {

      if (!elm || !elements[x].is(elm)) {
        elements[x].predictive('blur');
      } else {
        elements[x].predictive('hint');
      }

    }

  });



  // METHODS
  base.plugin('predictive', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('predictive', config);


      config.results = this.find('[x-base-results]');


      // Add atr
      this.attr('x-base-predictive', '');

      return this;

    },

    focus: function() {

      config = this.data('predictive');

      if (!config.results_open && config.exact_match_only) {
        this.find('input').value('');
      }

    },

    blur: function() {

      config = this.data('predictive');

      this.find('input[type=text]').elm.blur();

      if (config.exact_match_only && !this.find('input[type=hidden]').value()) {
        this.find('input[type=text]').value('');
      }

      config.results.removeClass('active').html('');
      config.results_open = false;
      config.query = null;

    },

    keyDown: function(key) {

      config = this.data('predictive');

      if (key == 13 || key == 9) { // Submit or Tab

        this.predictive('selectOption');

      }

    },

    keyUp: function(key) {

      config = this.data('predictive');

      if (key == '38') { // Up

        config.selected_result--;
        this.predictive('highlightOption');

      } else if (key == '40') { // Down

        config.selected_result++;
        this.predictive('highlightOption');

      } else if (key == 13) { // Submit



      } else {

        this.predictive('search');

      }

    },

    click: function(index) {

      config = this.data('predictive');

      config.selected_result = index;

      this.predictive('selectOption');

    },

    selectOption: function() {

      config = this.data('predictive');

      if (!config.results_open) return;

      if (config.selected_result >= 0 || config.exact_match_only) {

        index = config.selected_result >= 0 ? config.selected_result : 0;

        results = config.results.find('[x-base-value]');

        if (results.count) {

          selected_result = results.eq(index);

          this.find('input[type=text]').value(selected_result.attr('x-base-title') || selected_result.html());
          this.find('input[type=hidden]').value(selected_result.attr('x-base-value') || selected_result.html());

        }

      } else {

        this.find('input[type=hidden]').value(this.find('input[type=text]').value());

      }

      this.predictive('blur');

      this.predictive('submit');

    },

    highlightOption: function() {

      config = this.data('predictive');

      if (!config.results_open) return;

      results = config.results.find('[x-base-value]');

      if (results.count) {

        if (config.selected_result == results.count) {
          config.selected_result = 0;
        }

        if (config.selected_result < 0) {
          config.selected_result = results.count - 1;
        }

        results.removeClass('selected');

        results.eq(config.selected_result).addClass('selected');

      }

    },

    hint: function() {

      config = this.data('predictive');

      if (!config.results_open) {
        this.predictive('search');
      }

    },

    search: function() {

      config = this.data('predictive');

      query = this.find('input[type=text]').value();

      if (!config.exact_match_only) {
          this.find('input[type=hidden]').value(query);
      }

      if (query != config.query) {

        config.query = query;

        config.selected_result = -1;
        config.results_open = true;

        config.results.addClass('active');

        config.results.load(config.url, {query: config.query}, function(){



        });

      }

    },

    submit: function() {

      config = this.data('predictive');

      if (config.submit_form_on_select) {

        this.parents('form').trigger('submit');

      }

    }

  });

})(base, window);
