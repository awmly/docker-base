(function(base, window) {

  // ELEMENTS
  var elements = [];


  // CONSTANTS - static across all elements
  var defaults = {
    selectors: 'article',
    devices: 'xs|sm|md|lg|xl|2xl',
    scrollType: 'single',
    widthOffset: 0,
    overflowRight: false,
    overflowLeft: false,
    offsetLeft: 0,
    offsetRight : 0,
    valign: 'top',
    snapAmount: 20,
    autoScroll: false,
    autoScrollSpeed: 200, //pixels per second
  }

  // VARS
  var elm;


  // LISTENERS
  base.on('base.colousel window.resize base.load window.load', function() {

    for(var x in elements) {

      elements[x].colousel('resize');

    }

  });

  base.on('click', '[x-base-control="colousel.next"]', function(){

    elm = this.getTarget("[x-base-colousel]");

    elm.colousel('next');

  });

  base.on('click', '[x-base-control="colousel.prev"]', function(){

    elm = this.getTarget("[x-base-colousel]");

    elm.colousel('prev');

  });

  // this.find('[x-base-control="colousel.next"]').on('click', function(){

      //   elm = this.parents('.colousel');

      //   elm.colousel('next');

      // });


  // METHODS
  base.plugin('colousel', {

    init: function(config) {


      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('colousel', config);

       // Set id
       config.id = "#" + this.attr('id');

      // Set Listeners
      this.colousel('listeners');

      // Prep selectors
      //this.find(config.selectors).css('position', 'absolute').css(config.valign, '0');

      // Go
      this.colousel('resize');

      this.addClass('colousel-loaded');

      this.trigger('colousel.loaded');

      if(config.autoScroll){
        this.colousel('autoScroll');
      }

    },

    listeners: function() {

      this.find('img').on('load', function() {

        elm = this.parents('.colousel');

        elm.colousel('resize');

      });

      // this.find('[x-base-control="colousel.next"]').on('click', function(){

      //   elm = this.parents('.colousel');

      //   elm.colousel('next');

      // });
      // this.find('[x-base-control="colousel.prev"]').on('click', function(){

      //   elm = this.parents('.colousel');

      //   elm.colousel('prev');

      // });
      this.find('.colousel-scroll').on('scroll', function(){

        elm = this.parents('.colousel');

        elm.colousel('checkControls');

      });

    },

    next: function() {

      config = this.data('colousel');

      if ((config.currentScroll + config.scrollAmount) > (config.maxScroll - config.snapAmount)) {
        finish = config.maxScroll;
      } else {
        finish = config.currentScroll + config.scrollAmount;
      }

      this.colousel('scroll', finish);

    },

    prev: function() {

      config = this.data('colousel');

      if ((config.currentScroll - config.scrollAmount) < config.snapAmount) {
        finish = 0;
      } else {
        finish = config.currentScroll - config.scrollAmount;
      }

      this.colousel('scroll', finish);

    },

    scroll: function(finish) {

      config = this.data('colousel');

      this.find(config.selectors).removeClass('colousel-inview').addClass('colousel-outview');

      this.find('.colousel-scroll').animate({
        scrollLeft: {
          start: config.currentScroll,
          finish: finish
        }
      }, 300, function(){

        this.parents('.colousel').colousel('checkControls');

      });

    },

    checkControls: function() {

      config = this.data('colousel');

      config.currentScroll = this.find('.colousel-scroll').scrollLeft();

      config.at_start = config.at_end = false;

      this.removeClass('colousel-no-scroll');

      this.find(config.selectors, function() {
        left = parseInt(this.attr('x-base-left'));

        if (config.currentScroll > (left - 250) && config.currentScroll < (left + 250)) {
          this.addClass('colousel-inview').removeClass('colousel-outview');
        } else {
          this.addClass('colousel-outview').removeClass('colousel-inview');
        }
      });

      this.trigger('colousel.inview');

      this.find('[x-base-control="colousel.prev"]').removeClass('colousel-inactive');
      base('[x-base-target="' + config.id + '"][x-base-control="colousel.prev"]').removeClass('colousel-inactive');
      
      this.find('[x-base-control="colousel.next"]').removeClass('colousel-inactive');
      base('[x-base-target="' + config.id + '"][x-base-control="colousel.next"]').removeClass('colousel-inactive');

      if (config.currentScroll === 0) {
        this.find('[x-base-control="colousel.prev"]').addClass('colousel-inactive');
        base('[x-base-target="' + config.id + '"][x-base-control="colousel.prev"]').addClass('colousel-inactive');
        config.at_start = true;
      }

      if ((config.currentScroll + 1) >= config.maxScroll || config.maxScroll < 0) {
        this.find('[x-base-control="colousel.next"]').addClass('colousel-inactive');
        base('[x-base-target="' + config.id + '"][x-base-control="colousel.next"]').addClass('colousel-inactive');
        config.at_end = true;
      }

      if (config.at_start && config.at_end) {

        this.addClass('colousel-no-scroll');

        //this.find('.colousel-holder, .colousel-inner').css('width', '100%');

        // totalWidth = 0;

        // this.find(config.selectors, function() {

        //   this.css('left', totalWidth + 'px');

        //   totalWidth += this.width(true);

        // });

      }

    },


    resize: function() {

      config = this.data('colousel');

      var totalWidth = 0;
      var maxHeight = 0;

      scrollLeft = this.find('.colousel-scroll').scrollLeft();

      this.find('.colousel-scroll').css('margin-left', '');
      this.find('.colousel-holder').css('margin-left', '');
      this.find('.colousel-scroll').css('width', '');
      this.find(config.selectors + ', .colousel-holder, .colousel-inner').css('width', '');

      if (config.devices.indexOf(base.data('device.id')) >= 0) {

        this.addClass('colousel-active');

        this.find('.colousel-inner').css('width', (this.find('.colousel-inner').width() - config.widthOffset) + 'px');

        this.find(config.selectors, function() {

          config.scrollAmount = this.elm.offsetLeft + this.width(true) - totalWidth;

          //this.css('left', totalWidth + 'px');
          this.attr('x-base-left', this.elm.offsetLeft);
          totalWidth = this.elm.offsetLeft + this.width(true);

          if (this.height() > maxHeight) {
            maxHeight = this.height();
          }

        });

        var margin = 0;
        margin += parseInt(this.find('.colousel-inner').css('margin-left'));
        margin += parseInt(this.find('.colousel-inner').css('margin-right'));

        if (margin < 0) {
          margin = margin * -1;
          totalWidth = totalWidth - margin;
        }

        if (totalWidth > this.find('.colousel-scroll').width()) {
          allow_overflow = true;
        } else {
          allow_overflow = false;
        }

        if (config.overflowLeft && allow_overflow) {

          config.offsetLeft = this.find('.colousel-scroll').offset().left;
          this.find('.colousel-scroll').css('margin-left', '-' + config.offsetLeft + 'px');
          this.find('.colousel-holder').css('margin-left', config.offsetLeft + 'px');

        } else {

          config.offsetLeft = 0;
          this.find('.colousel-scroll').css('margin-left', '');
          this.find('.colousel-holder').css('margin-left', '');

        }

        if (config.overflowRight && allow_overflow) {

          config.offsetRight = base.data('window.width') - this.find('.colousel-scroll').offset().left;
          this.find('.colousel-scroll').css('width', config.offsetRight + 'px');
          config.offsetRight -= this.width();

        } else {

          config.offsetRight = 0;
          this.find('.colousel-scroll').css('width', '');

        }

        this.find('.colousel-holder').css({
          //'height': maxHeight + 'px',
          'width': (totalWidth + config.offsetRight - config.offsetLeft) + 'px'
        });

        if (config.scrollType == 'single') {
          //config.scrollAmount = this.find(config.selectors).width();
        } else {
          config.scrollAmount = this.find('.colousel-inner').width();
        }

        config.maxScroll = this.find('.colousel-holder').width() - this.width() - config.offsetRight + config.offsetLeft;

        this.find('.colousel-scroll').scrollLeft(scrollLeft);

      } else {
        this.removeClass('colousel-active');
      }

      this.colousel('checkControls');
      

    },

    autoScroll: function(){
      this.find('.colousel-inner').append(this.find('.colousel-inner').html());
      this.find('.colousel-inner').append(this.find('.colousel-inner').html());
      let cols = this.find('.colousel-inner').children();
      base(cols.elms[cols.count * 1 / 4]).addClass('first');
      base(cols.elms[cols.count * 2 / 4]).addClass('last');
      
      this.find('[x-base-control]').remove();

      this.colousel('resize');
      this.colousel('animateScroll');
    },

    animateScroll: function(){
      let object = this;
      config = this.data('colousel');

      let start = this.find('.colousel-inner > .first').offset().left - this.find('.colousel-inner').offset().left;
      let finish = this.find('.colousel-inner > .last').offset().left - this.find('.colousel-inner').offset().left;
      let speed = ((finish - start) * 1000 / config.autoScrollSpeed);

      console.log({start, finish})

      if(config.autoScroll == 'reverse'){
        let tmp = start;
        start = finish;
        finish = tmp;
      }

      this.find('.colousel-scroll').animate({
        scrollLeft: {
          start: start,
          finish: finish
        }
      }, speed, 0, 'linnear', function() {

        object.colousel('animateScroll');

      });
    },

  });

})(base, window);
