(function(base, window) {


  //base.on('window.resize window.load base.load', function() {
    //base.imgResponsive();
  //});

  

  // base.on('window.load', function() {
  //   setTimeout(function() {
      
      // base.imgDelayed();

      // base.on('module.refreshed', function() {
      //   base.imgDelayed();
      // });

  //   }, 50);
  // });

  // WEBP ERROR DETECTION
  base('img').on('error', function(event) {

    var parent = this.parent();

    if (parent.is('picture')) {

      base('body').addClass('no-webp');
      base('.fade-on-load').removeClass('fade-on-load');

      parent.find("[type='image/webp']").each(function() {

        this.remove();

      });

    } 

  });

  // SCROLL <img>
  base('picture.scroll').each(function(){

    this.parent().attr({
      'x-base-inview': 'window',
      'x-base-btm-offset': '50'
    }).on('inview.seen', function(){

      var img = this.find('img');

      img.attr({
        src: img.attr('scrollsrc'),
        delaysrc: ''
      }).on('load', function(){
        this.parent().removeClass('scroll');
      });

      this.find('source').each(function(){

        this.attr({
          srcset: this.attr('scrollsrcset'),
          scrollsrcset: ''
        });

      });

    });

  });

  // FADE IN
  base('.bgr-img.fade-in').each(function(){

    this.attr({
      'x-base-inview': 'window',
      'x-base-btm-offset': '50'
    });

  }).on('inview.seen', function(){

    this.addClass('scroll').delay(50, function(){
      this.addClass('fade-in-active');
    });

  });


  // DELAYED <img> and background-image
  base.imgDelayed = function() {

    base('.bgr-img').addClass('delay');

    base('picture.delay').each(function(){

      this.addClass('fade').removeClass('delay');

      var img = this.find('img');

      img.attr({
        src: img.attr('delaysrc'),
        delaysrc: ''
      });

      img.on('load', function() {
        this.parent().removeClass('fade');
        base.trigger('img.loaded');
      });

      this.find('source').each(function(){

        this.attr({
          srcset: this.attr('delaysrcset'),
          delaysrcset: ''
        });

      });

    });

    base('img.delay').each(function(){

      this.removeClass('delay');

      this.attr({
        src: this.attr('delaysrc'),
        delaysrc: ''
      });

    });

  }

  // DEFERED <img> and background-image
  base.imgDefered = function(target) {

    target.find('.bgr-img').addClass('defer');

    target.find('picture.defer').each(function(){

      this.removeClass('defer');

      var img = this.find('img');

      img.attr({
        src: img.attr('defersrc'),
        defersrc: ''
      });

      this.find('source').each(function(){

        this.attr({
          srcset: this.attr('defersrcset'),
          defersrcset: ''
        });

      });

    });

  }

  // FADE ON LOAD - background-images
  // THIS DOESNT HAVE ANY PRELOAD / DELAY FUNCTIONALITY
  // IT JUST MAKES THE INITIAL LOAD SEEM SMOOTHER
  // EG FRAME 1 OF A SLIDER
  var fadeOnLoadImages = [];
  base('.fade-on-load').each(function(index) {

    var bg = this.css('background-image');
    var url = bg.match(/url\(['"]?(.*?)['"]?\)/i);

    this.addClass('fade-on-load-' + index);

    fadeOnLoadImages[index] = document.createElement('img');
    fadeOnLoadImages[index].src = url[1];
    fadeOnLoadImages[index].id = 'fade-on-load-' + index;
    fadeOnLoadImages[index].onload = function() {
      base('.' + this.id).addClass('fade-on-load-active');
    }

  });

  base.imgDelayed();

      base.on('module.refreshed', function() {
        base.imgDelayed();
      });

})(base, window);
