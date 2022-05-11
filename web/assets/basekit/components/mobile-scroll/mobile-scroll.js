/*
$STAN.on('stan.loaded window.resize', function() {

  $('.mobile-scroll').each(function() {

    width = 0;

    $(this).width(10000);

    $(this).find('.mobile-scroll-inner').css({
      width: 'auto',
      display: 'inline-block'
    });

    width = $(this).find(".mobile-scroll-inner").width() + 1;

    $(this).find(".mobile-scroll-inner").width(width);

    $(this).css('width', '');

    active = $(this).find('.mobile-scroll-inner > .active');

    if (active) {
      $(this).scrollLeft(active.offset().left - 15);
    }

  });

});*/
