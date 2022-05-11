(function() {

  base.on('products.search', function(event) {

    form = event.data;
    val = form.find('[x-base-location]').value();

    base.setFilter('latlng', '');
    base.setFilter('location', val);
    base.filterTriggers();
    base.addFilterHistory();

  });

  
  // base.on('location.filter', function(event) {
    
  //   form = event.data;
  //   val = form.find('input').value();
    
  //   base("[x-base-module] > .module").addClass('module-loading');
  //   base('[x-base-location-invalid]').css('display', 'none');

  //   localStorage.setItem('locationValue', val);

  //   base.event('Locations', 'Search', val);

  //   base.ajax({
  //     'method':     'POST',
  //     'url':        '/module/scripts:ajax:geo/async',
  //     'contentType': 'application/x-www-form-urlencoded',
  //     'data':       { 'location': val },
  //     'responseType':   'json',
  //     'onLoad':     function(data, xhr) {

  //         if (data.lat && data.lng){

  //             base.setFilter('lat', data.lat);
  //             base.setFilter('lng', data.lng);
  //             localStorage.setItem('locationLat', data.lat);
  //             localStorage.setItem('locationLng', data.lng);
  //             base.filterTriggers();
          
  //         } else {

  //             base('[x-base-location-invalid]').css('display', 'block');
  //             base.setFilter('lat', 0);
  //             base.setFilter('lng', 0);
  //             localStorage.setItem('locationLat', false);
  //             localStorage.setItem('locationLng', false);
  //             base.filterTriggers();

  //         }

  //     }
  //   });
    
    

  // });

  base('body').on('click', '[x-base-locations-geo]', function(e){
      
    //base('[x-base-location-invalid]').css('display', 'none');
    
    navigator.geolocation.getCurrentPosition(function(position) {

      base.setFilter('latlng', position.coords.latitude + ',' + position.coords.longitude);
      
      // localStorage.setItem('locationLat', position.coords.latitude);
      // localStorage.setItem('locationLng', position.coords.longitude);

      // DO SOME REVERSE GEO CODING
      base.ajax({
        'method':     'POST',
        'url':        '/module/scripts:ajax:reverse-geo/async',
        'contentType': 'application/x-www-form-urlencoded',
        'data':       {
          'lat': position.coords.latitude,
          'lng': position.coords.longitude 
        },
        'responseType':   'json',
        'onLoad':     function(data, xhr) {
          //base.event('Locations', 'Geo', data.address);
          //localStorage.setItem('locationValue', data.address);
          base('[x-base-location-input]').value(data.address);
          base.setFilter('location', data.address);
          base.filterTriggers();
          base.addFilterHistory();
        }
      });

    }, function(error) {
      
    });

  });

  base.on('window.load', function() {
      

    //Check if user has previously searched and re-load location list
    // if ( localStorage.getItem('locationLat') && localStorage.getItem('locationLng'))
    // {
    //   base.setFilter('lat', localStorage.getItem('locationLat'));
    //   base.setFilter('lng', localStorage.getItem('locationLng'));
    //   base.setFilter('location', localStorage.getItem('locationValue'));
    //   base.filterTriggers();
    //   base.addFilterHistory();
    // }
    
    // Add user searched location into input field
    // if (localStorage.getItem('locationValue') && base('[x-base-location-input]').elm)
    // {
    //   base('[x-base-location-input]').value(localStorage.getItem('locationValue'));
    // }
  
  });


})();
