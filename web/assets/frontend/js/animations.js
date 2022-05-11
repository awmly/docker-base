(function() {

  base.on('base.ready window.loaded window.scroll window.resize', function() {

    var st = base.data('window.scrollTop');

    base('.style-sticky-block').each(function() {

      this.find('.tos').css('transform', 'translateY(-'+st+'px)');
      
    });

  });

})();

/***
//image-left-in text in right
base('.block-animate.blocks-text-image-2-col.col-8-4').each(function() {
    this.on('inview.in', function() {
      this.find('.inset-img').removeClass('fadeOutLeft').addClass('fadeInLeft');
      this.find('.text-block').delay(300, function() {
        this.removeClass('fadeOutRight').addClass('fadeInRight');
      });
    }).on('inview.out', function() {
      this.find('.inset-img').removeClass('fadeInLeft').addClass('fadeOutLeft');
      this.find('.text-block').removeClass('fadeInRight').addClass('fadeOutRight');
    });
});


//image-left-in text in right oppisite way
base('.block-animate.blocks-text-image-2-col.col-4-8').each(function() {
    this.on('inview.in', function() {
      this.find('.text-block').delay(300, function() {
        this.removeClass('fadeOutLeft').addClass('fadeInLeft');
      });
      this.find('.inset-img').removeClass('fadeOutRight').addClass('fadeInRight');
    }).on('inview.out', function() {
      
      this.find('.text-block').removeClass('fadeInLeft').addClass('fadeOutLeft');
      this.find('.inset-img').removeClass('fadeInRight').addClass('fadeOutRight');
    });
});
***/