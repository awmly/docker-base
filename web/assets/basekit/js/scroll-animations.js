(function() {

    /*
    * USAGE
    * Add attribute to element you want to animate
    * x-base-scroll-animation='up'
    */
    var wh, st, cc, ot, offset;

    base.on('base.ready window.loaded window.scroll window.resize', function() {

        wh = base.data('window.height');
        st = base.data('window.scrollTop');

        // Calculate current centre window position in pixel.
        cc = st + (wh / 2);

        base('[x-base-scroll-animation]').each(function() {

            // Calculat middle of element we want to animate
            ot = this.offset().top + (this.height() / 2);

            if (base.data('device.desktop'))
            {
                // Calculate distance between centre of window and centre of element
                offset = ot - cc;

                // Divide to create paralax effect
                offset = offset / 10;
            }
            else
            {
                offset = 0;
            }

            if (this.attr('x-base-scroll-animation'))
            {
                base.scrollAnimation[this.attr('x-base-scroll-animation')](this, offset);
            }

        });


    });

    base.scrollAnimation = {

        up: function(elm, offset) {

            elm.css('transform', 'translateY('+offset+'px)');

        },

        down:function(elm, offset) {

            offset = offset * -1;

            elm.css('transform', 'translateY('+offset+'px)');

        },

        left: function(elm, offset) {

            elm.css('transform', 'translateX('+offset+'px)');

        },

        right:function(elm, offset) {

            offset = offset * -1;
            
            elm.css('transform', 'translateX('+offset+'px)');

        }

    };

  
})();
  