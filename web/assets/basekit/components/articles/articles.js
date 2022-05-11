(function(base, window) {

  var checkIfPrevSeen = function(elm) {

    var prevIsSeen = false;
    var prev, delay;

    var index = parseInt(elm.attr('x-base-index'));

    if (index) {

      var offset = index - 1;
      prev = elm.parents('.module').find('.animate-article', offset)

      if (prev.hasClass('article-seen')) {
        prevIsSeen = true;
        delay = 200;
      }

    } else {
      prevIsSeen = true;
      delay = 0;
    }

    if (prevIsSeen) {

      // add class
      setTimeout(function() {
        elm.addClass('article-seen');
      }, delay);

    } else {

      setTimeout(function() {

        checkIfPrevSeen(elm);

      }, 50);

    }

  };

  base.addArticleInViewAttributes = function (elm) {

    elm.find('.animate-article').each(function(index){

      this.attr({
        'x-base-inview': 'window',
        'x-base-btm-offset': '100',
        'x-base-index': index
      });


      this.on('inview.seen', function(){

        checkIfPrevSeen(this);

      });

    });

  }

  // ON SCROLL LOADING IN JS
  base('.module.list, .module.pagination').each(function(){

    base.addArticleInViewAttributes(this);

  });


})(base, window);
