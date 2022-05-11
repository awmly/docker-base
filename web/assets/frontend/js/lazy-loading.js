(function() {

    var LazyLoadModule = 'list:case-studies';

    base('[x-base-module="'+LazyLoadModule+'"]').attr('x-base-lazy-load', '1');

    base('[x-base-module="'+LazyLoadModule+'"] .results-holder').attr('x-base-current-results', 1);

    base('[x-base-module="'+LazyLoadModule+'"]').on('module.refresh', function() {

        this.find('.pagination-loadmore').remove();
        this.find('.pagination-loadmore-spinner').addClass('active');

    }).on('module.refreshed', function(event) {

        var data = this.data('module').data;
        var method = 'append';

        if (data['page'] > 1 && data['_last_filter'] == '_load') {
            method = 'prepend';
        } else if (data['_last_filter'] == '_page') {
            method = 'append';
        } else {
            method = 'replace';
        }

        this.find('.pagination-loadmore-spinner').remove();

        base('[x-base-template]').html(event.data.html);

        if (this.find('.module.list').count && base('[x-base-template]').find('.module.list').count) {
            this.find('.module.list').html(base('[x-base-template]').find('.module.list').html(), method);
        }
        
        base('style', '-1').html(event.data.styles, 'append');

        base('[x-base-template]').html("");
        
        this.find('.module-loading').removeClass('module-loading');

        base.trigger('inview.check');

        if (data['page'] > 1 && data['_last_filter'] == '_load') {
            base.scrollTo.apply(this, [window, this.find('[x-base-current-results]').offset().header - 50, 300, 'easeOutSine']);
        }

    });

    base('[x-base-module="'+LazyLoadModule+'"]').on('inview.in', '[x-base-loadmore]', function() {

        this.find('[x-base-page]').trigger('click');

    });


})();