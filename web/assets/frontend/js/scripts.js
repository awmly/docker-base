(function() {

  if (base.feature('safari') || base.feature('ie')) {
    base('body').addClass('no-webp');
    base('.fade-on-load').addClass('fade-on-load-active');
  } else {
    base('body').addClass('has-paralax');
  }

  base('[x-base-show-overlay]').on('click', function() {
    base('body').addClass('overlay-active');
    base.trigger('window.resized');
  });

  base('body').on('click', '.gdpr-title', function() {
    this.parent().find('.gdpr-msg').toggleClass('hidden');
    base.trigger('popup.resize');
  })

  // base.on('window.resize base.ready', function () {
    
    
  // });

  //overflow jumbo js cl
  /*base.on('window.resize block.offset', function() {

    var titles = document.querySelector('.jumbo-overflow-item');
    if(titles){

      var titleHeight = titles.offsetHeight + 'px';
      var itemOffset = document.querySelector('.jumbo-overflow-holder');
      var itemOffsetMob = document.querySelector('.jumbo-overflow-holder-mob');

      if(base.data('device.desktop') || base('body').hasClass('offset-tabs-mobile')) {

        itemOffset.style.marginTop = "-" + titleHeight;

      } else {

        itemOffset.style.marginTop = '5vh';

      }
    }

    });


    base.trigger('block.offset');*/


  })();
