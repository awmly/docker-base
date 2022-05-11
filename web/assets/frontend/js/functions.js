function replaceCDNImages(cdnurl) {

  var attr = ['src', 'delay-src', 'defer-src', 'data-xs', 'data-sm', 'data-md', 'data-lg'];

  base('img').each(function() {
    for (var x in attr) {
      if (this.attr(attr[x])) this.attr(attr[x], this.attr(attr[x]).replace(cdnurl, ""));
    }
  });

}

function trackEvent(cat, action, label) {
  ga('send', 'event', cat, action, label);
}


function isDesktop() {

  if (base('body').hasClass('device-lg')) {
    return true;
  } else {
    return false;
  }

}

/*
 * x*y = box
 * a*b = scaled
 */
function Ratio(x, y, a) {
  b = y * (a / x);
  return b;
}


function LoadURL(url) {
  document.location.href = url;
}



function AddCSS(file) {

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.href = file;
  document.getElementsByTagName('body')[0].appendChild(link);

}

function AddJS(file) {

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = file;
  document.getElementsByTagName('head')[0].appendChild(script);

}
