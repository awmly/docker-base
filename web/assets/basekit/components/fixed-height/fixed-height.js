(function(base, window) {

  // ELEMENTS
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    selectors: '.fix-height'
  }

  // VARS
  var elm;


  // LISTENERS
  base.on('base.fixheight window.resize base.load window.load', function() {

    for(var x in elements) {

      elements[x].fixedHeight('resize');

    }

  });


  // METHODS
  base.plugin('fixedHeight', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('fixedHeight', config);


      // Go
      this.fixedHeight('resize');

    },

    resize: function() {

      config = this.data('fixedHeight');

      var thisTop, lastTop, newLine;
      var lineHeight = 0;
      var lineElements = [];

      this.find(config.selectors).removeClass('first');

      this.find(config.selectors, function(){

        // Set constant height so new ine can be determined even if element is positioned bottom
        this.css('height', '10px');

        thisTop = this.offset().top;

        // Reset height to auto now to have elements offset values
        this.css('height', 'auto');

        if (lastTop < thisTop + 20 && lastTop > thisTop - 20) {
          newLine = false;
        } else{
          newLine = true;
          this.addClass('first');
        }

        if (newLine && lineHeight > 0) {

          for (var x in lineElements) {
            lineElements[x].css('height', lineHeight + 'px');
          }

          lineHeight = 0;
          lineElements = [];

        }

        if (this.height() > lineHeight) {
          lineHeight = this.height();
        }

        lineElements.push(this);

        lastTop = thisTop;

      });

      if (lineHeight) {
        for (var x in lineElements) {
          lineElements[x].css('height', lineHeight + 'px');
        }
      }

    }

  });

})(base, window);
