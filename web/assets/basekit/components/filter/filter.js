(function(base, window) {

  var filters = [];
  var filtersData = [];
  var filterHistoryAdded = false;

  base.addFilterHistory = function() {

    url = base('[x-base-view-url]').attr('x-base-view-url');
    let filterUrl = '';

    for (filter in filters) {
      if (filter && filter.substring(0,1) != '_' && base('[x-base-filter="'+filter+'"]').hasAttr('x-base-filter-history')) {
        if ((filter != 'page' && filters[filter]) || (filter == 'page' && filters[filter] != '1')) {
          filterUrl += '/' + filter + '/' + filters[filter];
          localStorage.setItem('filter.' + filter, filters[filter]);
        }
      }
    }

    if (base('[x-base-shopify]').count && filterUrl) {
      url = url + "?filter=";
    }

    url = url + filterUrl;

    if (!filterHistoryAdded) {
      base.history('filter', 'replace', window.location.href, []);
      filterHistoryAdded = true;
    }

    base.history('filter', 'replace', url, []); // CHANGED FROM PSUH FOR LAZY LOADING

  };

  base.setFilterPage = function() {

    elm = this.getTarget("[x-base-filter]");
    page = this.attr('x-base-page');

    filters['page'] = page;
    filters['_last_filter'] = '_page';

    base.filterTriggers(elm);

  };

  base.addFilterParam = function() {

    elm = this.getTarget("[x-base-filter]");

    logic = elm.attr('x-base-logic');
    param  = this.attr('x-base-param');
    value = this.attr('x-base-value');

    if (!param && !value) {
      return;
    }

    // Work out logic from preset filters
    if (!logic && filters[param]) {
      if (filters[param].indexOf('|') >= 0) {
        logic = '|';
      } else if (filters[param].indexOf('&') >= 0) {
        logic = '&';
      }
    }

    if (logic == 'min' || logic == 'max') {
      
      if (filtersData[param + '_' + logic] == value) {
        filtersData[param + '_' + logic] = 0;
      } else {
        filtersData[param + '_' + logic] = value;
      }

      min = filtersData[param + '_min'] || 0;
      max = filtersData[param + '_max'] || 0;
      
      if(min != 0 || max != 0){
        filters[param] = min + '-' + max;
      }
      else{
        filters[param] = false;
      }
    } else if ((logic == '|' || logic == '&') && filters[param]) {

      if (filters[param].indexOf(value) >= 0) {

        filters[param] = filters[param].replace(value + logic, "");
        filters[param] = filters[param].replace(logic + value, "");
        filters[param] = filters[param].replace(value, "");
        this.removeClass('active');

      } else {

        filters[param] += logic + value;
        this.addClass('active');

      }

    } else {

      if (!logic) {
        elm.find('[x-base-param]').removeClass('active');
      }

      if (filters[param] == value && !this.attr('x-base-persistent')) {
        filters[param] = '';
        this.removeClass('active');
      } else if (value != '') {
        filters[param] = value;
        this.addClass('active');
      } else {
        filters[param] = false;
      }

    }

    localStorage.removeItem('filter.' + param);

    if (elm.find('.active').count) {
      elm.addClass('has-active')
    } else {
      elm.removeClass('has-active');
      elm.find('[x-base-value=""]').addClass('active'); // Add the active class to 'All' if the filter has one
    }

    // Go to page 1
    filters['_last_filter'] = '_' + param;
    filters['page'] = 1;

    if(logic == '&' || logic == '|'){
      filters['multi'] = true;
    }
    else{
      filters['multi'] = false;
    }

  };

  base.filterTriggers = function(elm) {

    if (elm) {
      elm.trigger('filter.updated', filters);
    }

    base.trigger('filter.updated', filters);

  };

  base.setFilter = function (param, value) {

    localStorage.setItem('filter.' + param, value);
    filters[param] = value;

  };

  // LISTENERS
  base("body").on('click', '[x-base-param]', function(event){

    base.addFilterParam.apply(this);

    base.filterTriggers(this.getTarget("[x-base-filter]"));

    base.addFilterHistory();

    event.preventDefault();

    this.getTarget("[x-base-filter]").trigger('filter.add');

  });

  base("body").on('click', '[x-base-page]', function(event){

    base.setFilterPage.apply(this);

    if (this.attr('x-base-no-history') != "1")
    {
      base.addFilterHistory();
    }


    event.preventDefault();

  });

  base("body").on('click', '[x-base-filter-show-all], [x-base-filter-show-less]', function(event){

    this.getTarget("[x-base-filter]").toggleClass('showing-all');

  });

  base.on('window.load', function() {

    /*base("meta[x-base-route-param]").each(function () {

      var param = this.attr('x-base-route-param');
      var value = this.attr('x-base-route-value');

      filters[param] = value;

    });*/

  });

  base.on('history.pop.filter window.ready', function(event) {

    url = base('[x-base-view-url]').attr('x-base-view-url');

    urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('filter')) {
      params = urlParams.get('filter').split("/");
    } else {
      params = window.location.pathname.replace(url, "").split("/");
    }

    filters = [];
    hasFilter = false;
    loadedFromSession = false;

    //var page = 1;

    

    for (var x = 1; x < params.length; x = x+2) {
      if (base('[x-base-param="' + params[x] + '"]').count) {
        hasFilter = true;
        base('[x-base-filter] [x-base-value]').removeClass('active');
      }
    }

    for (var x = 1; x < params.length; x = x+2) {
        y = x + 1;
        
        filterElm = base('[x-base-filter="'+params[x]+'"]');
        if (filterElm.attr('x-base-logic') == 'min'  || filterElm.attr('x-base-logic') == 'max') {
          parts = params[y].split('-');
          filtersData[params[x] + '_min'] = parts[0];
          filtersData[params[x] + '_max'] = parts[1];
        }

        filters[params[x]] = params[y];
        //base('[x-base-filter="' + params[x] + '"]').addClass('has-active');
        if (params[x] == 'page') {
          //page = params[y];
        } else {
          // console.log(params[x]);
          // console.log(params[y]);
          // console.log('****');
          base('[x-base-param="' + params[x] + '"][x-base-value="' + params[y] + '"]').addClass('active');
        }
    }

    base('[x-base-param][x-base-default]').each(function() {
      filters[this.attr('x-base-param')] = this.attr('x-base-value');
      hasFilter = true;
    });

    // load from php active classes
    base('[x-base-filter]').each(function() {
      param = this.find('.active');
      if (param.count)
      {
          hasFilter = true;
          loadedFromSession = true;
          filters[param.attr('x-base-param')] = param.attr('x-base-value');
      }
    });

    // load from session
    /*base('[x-base-filter]').each(function() {
      param = this.attr('x-base-filter');
      value = localStorage.getItem('filter.' + param);
      if (value)
      {
        //console.log(param + ' > ' + value);
        //if (base("[x-base-param='"+param+"'][x-base-value='"+value+"']").count) {
          hasFilter = true;
          loadedFromSession = true;
          filters[param] = value;
        //}

        if (this.attr('x-base-logic') == 'min'  || this.attr('x-base-logic') == 'max') {
          parts = value.split('-');
          filtersData[param + '_min'] = parts[0];
          filtersData[param + '_max'] = parts[1];
        }
        
      }
    });*/

    // Set active page
    //base('[x-base-page="' + page + '"]').addClass('active');

    // Add has active to filter holder
    base('[x-base-filter]').each(function() {

      if (this.find('.active').count) {
        this.addClass('has-active')
      } else {
        this.removeClass('has-active');
        this.find('[x-base-value=""]').addClass('active'); // Add the active class to 'All' if the filter has one
      }

    });

    // Update poanel title based on active filters
    base('[x-base-filter]').each(function() {
      this.trigger('filter.ready');
    });
    
    if (hasFilter) {
      filters['_last_filter'] = '_load';
      base.filterTriggers(false);
      if (loadedFromSession)
      {
        base.addFilterHistory();
      }
    }

  });

})(base, window);
