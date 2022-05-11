(function(window, base) {

  'use strict';

  var elm, index;

  var dataID = 1;
  var dataStore = {};

  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }

  base.getElm = function (selector, offset) {

    if (typeof selector == 'string') {

      var elms = document.querySelectorAll(selector);

    }else if (selector instanceof Element || selector instanceof DocumentFragment) {

      var elms = [selector];

    } else {

      var elms = selector;

    }

    elms = filterElements(elms, offset);

    var be = new base.BaseElement(elms);

    return be;

  }

  function filterElements(elms, offset) {

    var results = [];

    if (offset) {

      if (Number.isInteger(offset)) {

        results.push(elms[offset]);

      } else if (offset.indexOf('+') > -1) {

        for (var x in elms) {
          if (x < parseInt(offset)) {
            results.push(elms[x]);
          }
        }

      } else if (offset.indexOf('-') > -1) {

        for (var x in elms) {
          if (x >= (elms.length + parseInt(offset))) {
            results.push(elms[x]);
          }
        }

      }

    } else {
      results = elms;
    }

    return results;

  }


  base.BaseElement = function(elms) {

    this.elm = elms[0];
    this.elms = elms;

    this.count = this.elms.length;

  }


  base.BaseElement.prototype = {

    id: function() {

      if (!this.elm.baseID) {

        this.apply(function(){

          if (!this.baseID) {
            this.baseID = dataID;
            dataStore[dataID] = {};
            dataID++;
          }

        }, arguments);

      }

      return this.elm.baseID;

    },

    data: function(key, value, overwrite) {

      if (!this.count) return;

      if (value !== undefined) {

        if (dataStore[this.id()][key] === undefined || overwrite !== false) {

          this.apply(function(){

            dataStore[this.baseID][key] = value;

          }, arguments);
        }
      }

      return dataStore[this.id()][key];

    },

    apply: function(callback, args) {

      for (var x = 0; x < this.elms.length; x++) {

        index = x;
        callback.apply(this.elms[x], args);

      }

      return this;

    },

    /**
     * Events
     */

     onfirst: function(events, callback) {

       this.on(events, function(event){

         var isFirst = true;
         var allEvents = events.split(" ");

         for (var x in allEvents) {
           if (this.data('event.' + allEvents[x])) {
             isFirst = false;
           }
         }

         this.data('event.' + event.type, true);

         if (isFirst) {
           this.trigger('event.first');
         }

       });

       this.on('event.first', callback);

     },

     onlast: function(events, callback) {

       this.on(events, function(event){

         var isLast = true;
         var allEvents = events.split(" ");

         this.data('event.' + event.type, true);

         for (var x in allEvents) {
           if (!this.data('event.' + allEvents[x])) {
             isLast = false;
           }
         }

         if (isLast) {
           this.trigger('event.last');
         }

       });

       this.on('event.last', callback);

     },

     on: function() {

       var _event = arguments[0];

       if (typeof arguments[2] === 'function') {
         var _target = arguments[1];
         var _callback = arguments[2];
         var _options = arguments[3] || {};
       } else {
         var _target = false;
         var _callback = arguments[1];
         var _options = arguments[2] || {};
       }

       return this.apply(function(){

         var events = _event.split(" ");

         for (var x in events) {

           this.addEventListener(events[x], function(event){

             var hit = false;

             if (_target) {

               if (_target == '*' || event.target.matches(_target)) {

                 hit = true;
                 elm = base(event.target);

               } else {

                 elm = base(event.target).parents(_target);

                 if (elm) {
                   hit = true;
                 }

               }

             } else {

               /* Once we don't need to support IE11 this IF can fuck off and hit = true; */
               /* Also the trigger function can be simplified */

               if (event.isTrusted) {
                 hit = true;
               } else {
                 if (event.target.isSameNode(this)) {
                   hit = true;
                 }
               }

               elm = base(this);

             }

             if (hit) {
               _callback.apply(elm, [event]);
             }

           }, _options);

         }

       }, arguments);

     },

     addTrigger: function(event) {

       if (typeof base.registeredEvents[event] === 'undefined') {
         base.registeredEvents[event] = [];
       }

       return this.apply(function(){

         base.registeredEvents[event].push(base(this));

       }, arguments);

     },

     trigger: function(event, data) {

       return this.apply(function(){

         var events = event.split(" ");

         for (var x in events) {

           var eventObj = document.createEvent('Event'); // IE11
           eventObj.initEvent(events[x], true, true); // IE11

           //var eventObj = new Event(events[x]); // Proper browsers

           eventObj.data = data;
           this.dispatchEvent(eventObj);

         }

       }, arguments);

     },

     /**
      * AJAX
      */

      ajax: function(request) {

        request.object = this;

        base.ajax(request);

      },

      load: function() {

        var url = arguments[0];

        if (typeof arguments[1] === 'function') {
          var data = {};
          var callback = arguments[1];
        } else {
          var data = arguments[1];
          var callback = arguments[2];
        }

        var request = {
          object: this,
          method: "GET",
          url: url,
          data: data,
          onLoad: function(data) {

            this.html(data);
            this.trigger('loaded');

            if (typeof callback === 'function') {
              callback.apply(this);
            }

          }
        };

        base.ajax(request);

      },

    /**
     * Classes
     */

     addClass: function(classList) {

       return this.apply(function(){

         var classes = classList.split(" ");

         for (var x in classes) {
           if (this.classList) {
             this.classList.add(classes[x]);
           }
         }

       }, arguments);

     },

     removeClass: function(classList) {

       return this.apply(function(){

         var classes = classList.split(" ");

         for (var x in classes) {
           if (this.classList) {
             this.classList.remove(classes[x]);
           }
         }

       }, arguments);

     },

     hasClass: function(classList) {

      if (!this.elm) return;

       if (this.elm.classList) {
         return this.elm.classList.contains(classList);
       } else {
         return false;
       }

     },

    toggleClass: function(classList) {

      return this.elm.classList.toggle(classList);

    },

    /**
     * HTML
     */

     html: function(html, method) {

       if (typeof html === 'undefined') {

         return this.elm.innerHTML;

       } else {

         return this.apply(function(){

           if (method == 'append') {
             this.innerHTML += html;
           } else if (method == 'prepend') {
             this.innerHTML = html + this.innerHTML;
           } else {
             this.innerHTML = html;
           }

         }, arguments);

       }

     },

     append: function(html) {

       return this.apply(function(){

         this.innerHTML += html;

       }, arguments);

     },

     appendChild: function (node) {

       return this.apply(function(){

         this.appendChild(node.elm);

       }, arguments);

     },

     removeChildren: function(node) {

       return this.apply(function(){

         while (this.firstChild) {
           this.removeChild(this.firstChild);
         }

       }, arguments);

    },

     prepend: function(html) {

       return this.apply(function(){

         this.innerHTML = html + this.innerHTML;

       }, arguments);

     },

     template: function() {

       if ("content" in document.createElement("template")) {
           return base(document.importNode(this.elm.content, true));
       } else {
           var fragment = document.createDocumentFragment();
           var children = this.elm.childNodes;
           for (var i = 0; i < children.length; i++) {
               fragment.appendChild(children[i].cloneNode(true));
           }
           return base(fragment);
       }

     },

     clone: function(deep) {

       return base(this.elm.cloneNode(deep));

     },


     /**
      * Properties
      */

      height: function(type) {

        if (!this.elm) return 0;

        if (type == 'padding')  return this.elm.offsetHeight;
        else                    return this.elm.clientHeight;

        //return !!this.elm ? this.elm.clientHeight : 0;

      },

      width: function(incMargin) {

        var margin;

        if (incMargin == true) {
          var style = this.style();
          margin = parseInt(style.marginLeft) + parseInt(style.marginRight);
        } else {
          margin = 0;
        }

        var width = this.elm.getBoundingClientRect().width || this.elm.clientWidth;

        return Math.ceil(width) + margin;

      },

      style: function() {

        return window.getComputedStyle ? getComputedStyle(this.elm, null) : this.elm.currentStyle;

      },

      offset: function() {

        var scrollY = window.scrollY || window.pageYOffset;
        var element = this.elm;
        var top = 0,
          left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        if (base('header').count) {
          var header = base('header').height();
        } else {
          var header = 0;
        }

        return {
          top: top,
          bottom: top + this.height(true),
          left: left,
          right: left + this.width(false),
          width: this.width(false),
          window: top - scrollY,
          header: top - header
        };

      },

      value: function(value) {

        if (typeof value === 'undefined') {

          if (this.attr('type') == 'radio' || this.attr('type') == 'checkbox') {

            var checked = base('input[name="' + this.attr('name') + '"]:checked');

            if (checked.count) {
              return checked.elm.value;
            } else {
              return '';
            }

          } else {

            return !!this.elm ? this.elm.value : '';

          }

        } else {

          return this.apply(function(){

            this.value = value;

          }, arguments);

        }

      },

      is: function(selector) {

        if (!selector) return false;

        if (typeof selector === 'string') {
          return this.elm.matches(selector);
        } else {
          return this.elm.isEqualNode(selector.elm);
        }

      },

      hasAttr: function(attribute) {

        return !! this.elm ? this.elm.hasAttribute(attribute) : false;
        
      },

      attr: function(attribute, value, append) {

        if (typeof value === 'undefined' && typeof attribute === 'string') {

          return !! this.elm ? this.elm.getAttribute(attribute) : false;

        } else {

          return this.apply(function(){

            if (typeof attribute === 'string') {

              var current = this.getAttribute(attribute);

              if (current && append == true) {
                value = current + " " + value;
              }

              this.setAttribute(attribute, value);

            } else {

              for(var x in attribute) {
                this.setAttribute(x, attribute[x]);
              }

            }

          }, arguments);

        }

      },

      getAttr: function (name, stripName) {

        var attrs = this.elm.attributes;
        var values = {};
        var key;

        for (var x = 0; x < attrs.length; x++) {

          var attr = attrs[x];

          if (attr && attr.name && attr.name.indexOf(name) === 0) {

            if (stripName === true) {
              key = attr.name.replace(name, "");
            } else {
              key = attr.name;

            }

            values[key] = attr.value;

          }

        }

        return values;

      },



    /**
     * Searching
     */

     each: function(callback) {

       return this.apply(function(){

         callback.apply(base(this), [index])

       });

     },

     children: function(selector) {

      var children = this.elm.children;

      var elms = [];

      for (var x = 0; x < children.length; x++) {

        if (typeof selector === 'undefined') {
          elms.push(children[x]);
        } else {
          if(children[x].matches(selector)) {
            //return base(children[x]);
            elms.push(children[x]);
          }
        }

      }

      return base(elms);

     },

     siblings: function(selector) {

       return this.parent().children(selector);

     },

     find: function(selector) {

       var elms = this.elm.querySelectorAll(selector);

       if (typeof arguments[1] === 'function') {

         for (var x = 0; x < elms.length; x++) {

           arguments[1].apply(base(elms[x]));

         }

       } else {

         elms = filterElements(elms, arguments[1]);

       }

       return base(elms);

     },

     index: function(selector) {

       var siblings = this.siblings(selector);

       for (var x = 0; x < siblings.elms.length; x++) {
         if (this.is(base(siblings.elms[x]))) {
           return x;
         }
       }

     },

     eq: function(index) {

        return base(this.elms[index]);

     },

     parent: function(selector) {

       return base(this.elm.parentNode);

     },

     parents: function(selector) {

       var parent = this.elm.parentNode;
       var element = false;

       if (!parent) return false;

       if (parent.matches('html')) return false;

       do {

         if (parent.matches(selector)) {
           element = parent;
         } else {
           parent = parent.parentNode;
         }

         if (!parent || parent.matches('html')) parent = false;

       } while (!element && parent);

       if (element) {
         return base(element);
       } else {
         return false;
       }

     },

     getTarget: function(attr) {

       if (this.attr('x-base-target')) {
         return base(this.attr('x-base-target'));
       } else {
         return this.parents(attr);
       }

     },

     /**
      * CSS
      */

      animate: function(properties, speed, delay, easing, callback) {

        if (typeof delay == 'function') {
          callback = delay;
          delay = 0;
          easing = 'easeOutSine';
        } else if (typeof easing == 'function') {
          callback = easing;
          easing = 'easeOutSine';
        }

        base.animate(this, properties, speed, delay, easing, callback);

      },

      delay: function(delay, callback) {

        var t = this;

        setTimeout(function(){

          callback.apply(t);

        }, delay);

        return this;

      },

      css: function(property, value) {

        if (typeof value === 'undefined' && typeof property === 'string') {

          return !! this.elm ? window.getComputedStyle(this.elm).getPropertyValue(property) : false;

        } else {

          return this.apply(function(){

            if (typeof property === 'string') {
              this.style[property] = value;
            } else {
              for(var x in property) {
                this.style[x] = property[x];
              }
            }

          }, arguments);

        }

      },

      remove: function() {

        return this.apply(function(){

          if (this.parentElement) {
            this.parentElement.removeChild(this);
          }

        }, arguments);

      },

      /**
       * SCROLL
       */

      maxScrollTop: function() {

        return !!this.elm ? this.elm.scrollHeight - this.elm.clientHeight : 0;

      },

      scrollTop: function(value) {

        if (typeof value === 'undefined') {

          return this.elm.scrollTop;

        } else {

          return this.apply(function(){

            this.scrollTop = value;

          }, arguments);

        }

      },

      maxScrollLeft: function() {

        return !!this.elm ? this.elm.scrollWidth - this.elm.clientWidth : 0;

      },

      scrollLeft: function(value) {

        if (typeof value === 'undefined') {

          return this.elm.scrollLeft;

        } else {

          return this.apply(function(){

            this.scrollLeft = value;

          }, arguments);

        }

      }

  };

  //window.base = base;

})(window, base);
