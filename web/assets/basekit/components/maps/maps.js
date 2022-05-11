(function(base, window) {

  // ELEMENTS
  var elements = [];
  var config;


  // CONSTANTS - static across all elements
  var defaults = {
    map: false,
    lat: '',
    lng: '',
    zoom: '',
    markers: [],
    infobox: [],
    showInfoBoxes: true,
    showControls: true
  }

  // VARS
  var elm;


  // LISTENERS
  base("body").on('click', "[x-base-toggle='map.marker']", function(event){

    elm = this.getTarget("[x-base-map]");

    elm.map('toggleMarker', this.attr('x-base-article'));

  });
  base.on('map.ready', function() {

    for(var x in elements) {

      elements[x].map('loadMap');

    }

  });
  base.on('map.resize window.resize', function() {

    for(var x in elements) {

      elements[x].map('resize');

    }

  });



  // METHODS
  base.plugin('map', {

    init: function(config) {

      // Check plugin has not already been init'd on element
      if(elements[this.id()]) return;


      // Store element in elements
      elements[this.id()] = this;


      // Merge config with defaults and store
      config = base.array(defaults).merge(config || {}, this.getAttr('x-base-config-', true));
      this.data('map', config);


      // Set attribute for listeners
      this.attr('x-base-map','');


      // Set target for markers
      config.target = "#" + this.attr('id');

      // Check if google map library is loaded
      if (base.data('map.ready') == 1) {
        this.map('loadMap');
      }

      // Return element
      return this;

    },

    loadMap: function() {

      config = this.data('map');

      this.map('setCenter');

      config.map = new google.maps.Map(this.find('[x-base-map]').elm, {
        zoom: config.zoom,
        center: config.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: config.showControls,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
        scrollwheel: false,
        styles: JSON.parse(config.style)
      });

      /*google.maps.event.addDomListener(_this.infobox[id].content_, 'mouseover', function() {

        _this.map.setOptions({
          scrollwheel: false
        });

      });

      google.maps.event.addDomListener(_this.infobox[id].content_, 'mouseout', function() {

        _this.map.setOptions({
          scrollwheel: true
        });

      });*/

      this.map('addMarkers');

    },

    addMarkers: function() {

      config = this.data('map');

      this.find('[x-base-marker]').each(function() {

        // Set id
        id = this.attr('x-base-marker');

        // Set icon dimensions
        width = parseInt(this.attr('x-base-icon-width'));
        height = parseInt(this.attr('x-base-icon-height'));

        // Set icons
        markerPosition = new google.maps.LatLng(this.attr("x-base-lat"), this.attr("x-base-lng"));
        markerIcon = new google.maps.MarkerImage(this.attr("x-base-icon"), new google.maps.Size(width, height), new google.maps.Point(0, 0), new google.maps.Point(width/2, height));
        markerIconOn = new google.maps.MarkerImage(this.attr("x-base-icon-on"), new google.maps.Size(width, height), new google.maps.Point(0, 0), new google.maps.Point(width/2, height));

        // Add to map
        config.markers[id] = new google.maps.Marker({
          position: markerPosition,
          icon: markerIcon,
          icon_off: markerIcon,
          icon_on: markerIconOn,
          zoom: parseInt(this.attr("x-base-zoom")),
          map: config.map,
          zIndex: 1,
          id: id,
          target: config.target
        });

        config.markers[id].isOpen = false;

        if (config.showInfoBoxes) {

          // Create infobox
          infobox = base('[x-base-infobox="' + id + '"]');
          infoBoxOffset = new google.maps.Size(parseInt(infobox.attr('x-base-offset-x')), parseInt(infobox.attr('x-base-offset-y')));

          config.infobox[id] = new InfoBox({
            content: infobox.template().elm,
            pixelOffset: infoBoxOffset,
            closeBoxURL: ''
          });

          // Open infobox and turn off visibility
          config.infobox[id].open(config.map, config.markers[id]);
          config.infobox[id].setVisible(false);

        }

        // Add marker click listener
        google.maps.event.addListener(config.markers[id], 'click', function() {

          target = base(this.target);
          target.map('toggleMarker', this.id);

        });

      });

      // THIS NEEDS AN IF(){ }
      var markerCluster = new MarkerClusterer(config.map, config.markers, {
        styles: [
          {
            width: 30,
            height: 30,
            className: 'custom-clustericon-1'
          },
          {
            width: 40,
            height: 40,
            className: 'custom-clustericon-2'
          },
          {
            width: 50,
            height: 50,
            className: 'custom-clustericon-3'
          }
        ],
        clusterClass: 'custom-clustericon',
        gridSize: 20,
      });

    },

    setCenter: function() {

      config = this.data('map');

      config.center = new google.maps.LatLng(config.lat, config.lng);

    },

    toggleMarker: function(id) {

      config = this.data('map');

      if (config.markers[id].isOpen) {
        this.map('closeInfoBox');
      } else {
        this.map('openInfoBox', id);
      }

    },

    openInfoBox: function(id) {

      config = this.data('map');

      if (!config.markers[id].isOpen) {

        this.map('closeInfoBox');

        config.markers[id].setIcon(config.markers[id].icon_on);
        config.markers[id].setZIndex(999);

        config.markers[id].isOpen = true;

        if (config.showInfoBoxes) {
          config.infobox[id].setVisible(true);
        }

        config.map.setCenter(config.markers[id].position);
        config.map.setZoom(config.markers[id].zoom);

        this.find('[x-base-article="' + id + '"]').addClass('active');

      }

    },

    closeInfoBox: function() {

      config = this.data('map');

      for (var id in config.markers) {

        marker = config.markers[id];

        marker.setIcon(marker.icon_off);
        marker.setZIndex(1);

        config.markers[id].isOpen = false;

        if (config.showInfoBoxes) {
          config.infobox[id].setVisible(false);
        }

        this.find('[x-base-article="' + id + '"]').removeClass('active');

      }

    },

    resize: function() {

      config = this.data('map');

      if (!config.map) return;

      google.maps.event.trigger(config.map, "resize");
      config.map.setCenter(config.center);

    }

  });

})(base, window);
