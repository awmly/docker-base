/*(function() {
    
    // Js for layout of blocks
    // No functionality for tabs / accordions is in here!

    // var zIndex = 50;
    // base('.tab-over').each(function(){
    //     this.css('z-index', zIndex);
    //     zIndex--;
    // });

    base.on('window.resize base.ready window.load img.loaded', function() {

        base('[x-base-tab-2-col], [x-base-tab-3-col]').each(function() {

            var width, offset, txt1, txt2, height1, height2;

            var txt1 = this.find('[x-base-tab-txt-1] .cms');
            var txt2 = this.find('[x-base-tab-txt-2] .cms');

            txt1.css('margin-left', '');
            txt2.css('margin-right', '');

            if (base.data('device.desktop') == true) {

                // Left col indent
                if (this.attr('x-base-tab-contain-col-1') == "1") {
                    offset  = this.find('[x-base-tab-col-1]').offset();
                    txt1.css('margin-left', offset.left + 'px');
                }

                // Right col indent 
                if (this.attr('x-base-tab-contain-col-2') == "1") {
                    offset  = this.find('[x-base-tab-col-2]').offset();
                    txt2.css('margin-right', offset.right + 'px');
                }

    
                //  Background widths
                offset  = this.find('[x-base-tab-col-2]').offset();
                offset2 = this.find('[x-base-inner]').offset().left;
                width = (offset.left - offset2) + 'px';

            } else {

                width = '100%';

            }

            this.find('[x-base-tab-bgr-1], [x-base-tab-txt-1]').css({
                'width': width,
                'max-width':width
            });

        });


        base('[x-base-tab-2-col], [x-base-tab-3-col]').each(function() {
            
            this.find('[x-base-tab-bgr-1]').css('height', '');
            this.find('[x-base-tab-bgr-2]').css('height', '');
            this.find('[x-base-tab-bgr-3]').css('height', '');

            //if (base.data('device.desktop') == true) {
            
            if ((this.hasClass('xs-stacked') && base.data('device.id') == 'xs') || (this.hasClass('sm-stacked') && base.data('device.id') == 'sm')) {
                this.find('[x-base-tab-bgr-1]').css('height', (this.find('[x-base-tab-txt-1]').height() + this.find('[x-base-block-top]').height('padding')) + 'px');
                this.find('[x-base-tab-bgr-3]').css('height', (this.find('[x-base-tab-txt-3]').height()) + 'px');
                this.find('[x-base-tab-bgr-2]').css('height', (this.find('[x-base-tab-txt-2]').height() + this.find('[x-base-block-bottom]').height('padding') + this.find('[x-base-block-modules]').height()) + 'px');
            }

        });

        base('.tab-bgr.loading').each(function() {
            this.removeClass('loading');
        });


    });

})();
*/