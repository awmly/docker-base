/* ALSO CHANGE
* web/lib/STAN/Items/Items/Parts/Images/Image.php
* web/assets/frontend/scss/variables.scss
* web/assets/frontend/templates/common/inline-css.php
*/

var deviceConfig = {
  // base device XS
  'xs': {
    min_width: 0,
    max_width: 640,
    classes: 'd-xs mobile',
    data: {
      mobile: true,
      desktop: false
    }
  },
  // base device SM
  'sm': {
    min_width: 640,
    max_width: 768,
    classes: 'd-sm mobile',
    data: {
      mobile: true,
      desktop: false
    }
  },

  'md': {
    min_width: 768,
    max_width: 1024,
    classes: 'd-md mobile',
    data: {
      mobile: true,
      desktop: false
    }
  },
  // base device MD
  'lg': {
    min_width: 1024,
    max_width: 1280,
    classes: 'd-lg desktop',
    data: {
      mobile: false,
      desktop: true
    }
  },
  // base device LG
  'xl': {
    min_width: 1280,
    max_width: 1536,
    classes: 'd-xl desktop',
    data: {
      mobile: false,
      desktop: true
    }
  },

  '2xl': {
    min_width: 1536,
    max_width: 9999,
    classes: 'd-2xl desktop',
    data: {
      mobile: false,
      desktop: true
    }
  }

};

(function(win, doc) {

	// Decale variables
	var loadCount = 0,
		libs,
		successCallback,
		errorCallback,
		isReady;

	var funcs = [];

	/*
	 * Set libs and callback from the public method
	 */
	function loaded() {

		// Incriment loadCount
		loadCount++;

		// Check for libs to load - else perform callback
		if (libs[loadCount]) {

			addScript();

		} else {

			// Check callback is a function
			if (typeof(successCallback) === 'function') {
				successCallback();
			}

			ready();

		}

	}

	/*
	 * Set libs and callback from the public method
	 */
	function errored() {

		if (typeof(errorCallback) === 'function') {
			errorCallback();
		}

	}

	/*
	 * Create and add the script to the head
	 */
	function addScript() {

		var script = doc.createElement('script');
		script.type = 'text/javascript';
		script.src = libs[loadCount];
		script.async = true;

		// Set onload events for newly added script
		script.onload = loaded;

		script.onerror = errored;

		// Add the html to the head
		doc.getElementsByTagName("head")[0].appendChild(script);

	}

	/*
	 *
	 */
	function ready() {

		isReady = true;

		for (var x in funcs) {

			funcs[x]();

		}

    base.trigger('base.ready');

	}

	/*
	 *
	 */
	var loader = function(selector, offset) {
    return base.getElm(selector, offset);
  };

  loader.ready = function(func) {

		if (isReady) {
			func();
		} else {
			funcs.push(func);
		}

	}

	/*
	 * Set libs and callback from the public method
	 */
	loader.init = function(_libs, _successCallback, _errorCallback, _forceLoad) {

		libs = _libs;
		successCallback = _successCallback;
		errorCallback = _errorCallback;

		// Add window load listeners (W3C : IE8)
		//doc.addEventListener('DOMContentLoaded', addScript);

    window.addEventListener("load", addScript);

		// Force load if win/dom events not available
		if (typeof _forceLoad !== "undefined") {
			//addScript();
		}

	}


	loader.setHeight = function(elm) {

    if (typeof elm === 'string') {
      elm = document.querySelector(elm);
    }

    var windowHeight = document.documentElement.clientHeight;
    var fullScreen = window.innerHeight;
    var headerHeight = !! document.querySelector('.header-placeholder') ? document.querySelector('.header-placeholder').getBoundingClientRect().height : 0;
		var ww = window.innerWidth;

    for (var _device in deviceConfig) {

      var breakpoint = deviceConfig[_device];

      if (breakpoint.min_width <= ww && ww < breakpoint.max_width) {
        var device = _device;
      }

    }

    try {
      sizes = JSON.parse(elm.getAttribute('x-base-set-height'));
      size = sizes[device];
    } catch (e) {
      size = elm.getAttribute('x-base-set-height');
    }

    try {
      offsets = JSON.parse(elm.getAttribute('x-base-set-height-offset'));
      offset = parseInt(offsets[device]) || 0;
    } catch (e) {
      offset = 0;
    }

    if (size == 'auto' || size == 'css') {
      height = 'auto';
    } else if (size == 'parent') {
      height = '100%';
    } else if (size == 'fullscreen') {
      height = fullScreen - offset;
    } else if (size == 'window') {
      height = windowHeight - offset;
    } else if (size == 'content') {
      height = windowHeight - headerHeight - offset;
    } else if (size.indexOf('.') >= 0) {
      height = Math.ceil(elm.getBoundingClientRect().width / parseFloat(size));
    } else {
      height = size;
    }

    if (height != 'auto' && height != '100%') {
      height = height + 'px';
    }

    if (height == 'auto') {
      height = '';
    }

    elm.style['height'] = height;

  }

	// declare public methods
	win.base = loader;

})(window, document);
