(function(base, window) {

    // ELEMENTS
    var elements = [];
  
  
    // CONSTANTS - static across all elements
    var defaults = {
     direction:'horizontal', // < TO DO
     selector: 'article',
     easing: 'easeOutSine',
     duration: 500,
     scroll_selector: '', // < TO DO
     index:0,
     scrollelm: false,
    }
  
    // VARS
    var elm;

  
  
    // METHODS
    base.plugin('ticker', {
  
      init: function(config) {
  
        // Check plugin has not already been init'd on element
        if(elements[this.id()]) return;
  
        // Store element in elements
        elements[this.id()] = this;
  
        // Merge config with defaults and store
        config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
        this.data('ticker', config);

        config.selectors = this.find(config.selector);

        this.delay(2000, function() {
            this.ticker('scroll');
        });
  
        
      },
  
      scroll: function() {
        
        config = this.data('ticker');

        selector = base(config.selectors.elms[config.index]);

        currentScroll = this.scrollTop();

        start = currentScroll;
        
        if (start == this.maxScrollTop())
        {
            config.index = 0;
            finish = 0;
            duration = config.selectors.count * 20;
        } else {
            config.index++;
            finish = currentScroll + selector.height();
            duration = config.duration;
        }

        this.animate({
            scrollTop: {
                start: start,
                finish: finish
            }
        }, duration, 0, config.easing, function() {

            this.delay(2000, function() {
                this.ticker('scroll');
            });

        });


      }
  
    });
  
  })(base, window);
  