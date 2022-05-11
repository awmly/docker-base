(function(base, window) {

  var adWords = base('[x-base-adwords]').attr('x-base-adwords');

  base.event = function(category, label, action, conversion, url) {

    if (typeof ga !== 'undefined') {
      ga('send', 'event', category, action, label);
    }

    if(typeof fbq !== 'undefined'){
      fbq('trackCustom', label + ' > ' + action, {
        category: category
      });
    }

    if(typeof gtag !== 'undefined'){

      gtag('event', label + ' > ' + action, {
        'event_category': category,
        'event_label': url
      });

      if (adWords && conversion !== 'undefined' && action == 'complete') {

        gtag('event', 'conversion', {
          'send_to': adWords + '/' + conversion,
          'value': 1.0,
          'currency': 'GBP'
        });

      }

    }

  }

  base.notification = function(data) {

    base.ajax({
      'method': 'post',
      'url':    '/module/scripts:tracking:notification/async',
      'contentType': 'application/x-www-form-urlencoded',
      'data':   data,
      'onLoad': function(data, xhr) { 
        console.log(data);
      }
    });

  }

})(base, window);
