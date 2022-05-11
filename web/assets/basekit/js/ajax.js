(function(base, window) {

  var xhr;
  var queue = [];
  var queueID = 0;
  var inProgress = false;
  var request, data, params, ajaxUrl, domain;

  /**
  request = {
    'object':     'pass in anything here to be refernced in the onLoad function',
    'method':     'GET',
    'url':        '/bla/bla',
    'onLoad':     function(data, xhr) { this.html(data); console.log(data.responseText); },
    'contentType': 'application/x-www-form-urlencoded', // REQUIRED FOR $_POST TO WORK - else its php://input
    'onProgress': function() { },
    'data':       {property: value},
    'responseType':   'json' - optional
  }
  */

  base.ajax = function(req) {

    ajaxUrl = base("[x-base-ajax-url]").attr("x-base-ajax-url");
    domain = base("[x-base-domain]").attr("x-base-domain");

    if (ajaxUrl && req.url && req.url.startsWith('/module/')) {
      req.url = ajaxUrl + req.url;
    }

    queue.push(req);

    if (!inProgress) {

      ajaxDoRequest();

    }

  }


  var ajaxDoRequest = function() {

    inProgress = true;

    request = queue[queueID];

    if (typeof request.data === 'string'){
      data = request.data;
    } else if (request.data instanceof FormData) {
      data = request.data;
    } else {
      data = base.serialize(request.data);
    }

    if (request.method == 'GET') {
      if (data && typeof data === 'string') {
        url = request.url + "?" + data;
      } else {
        url = request.url;
      }
      params = null;
    } else {
      url = request.url;
      params = data;
    }

    xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(event){

      if (typeof request.onProgress === 'function') {
        request.onProgress.apply(request.object || {}, [event, xhr]);
      }

    }

    xhr.onload = function(event){

      //if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        if (typeof request.onLoad === 'function') {

          if (request.responseType == 'json') {
            data = JSON.parse(xhr.responseText);
            // data = xhr.response; // IE12+
          } else {
            data = xhr.responseText;
          }

          request.onLoad.apply(request.object || {}, [data, xhr]);

        }

        ajaxRequestLoaded();

      //}

    }

    xhr.open(request.method, url, true);

    if (request.contentType) {
      xhr.setRequestHeader('Content-type', request.contentType);
    }

    if (domain) {
      xhr.setRequestHeader('x-base-domain', domain);
    }

    xhr.send(params);

  }

  var ajaxRequestLoaded = function() {

    inProgress = false;

    queueID++;

    if (queue[queueID]) {

      ajaxDoRequest();

    } else {

      base('body').trigger('ajax.queue.complete');

    }

  }

  /**
   * Auto load
   */
   base("[x-base-ajax-load]").each(function() {

     this.load(this.attr("x-base-ajax-load"));

   });

  base.fetch = function(resource, init = {}){

    ajaxUrl = base("[x-base-ajax-url]").attr("x-base-ajax-url");
    domain = base("[x-base-domain]").attr("x-base-domain");

    if (ajaxUrl && resource && resource.startsWith('/module/')) {
      resource = ajaxUrl + resource;
    }

    if(domain){
      if(!init.headers) init.headers = {};
      init.headers['x-base-domain'] = domain;
    }

    return fetch(resource, init)

  }

})(base, window);
