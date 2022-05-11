(function () {
  let timeoutId = null;

  const debounce = (callback, wait) => {
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }


  /*base('[href*="/download/"]').on('click', function() {



  });*/

  /*
   * Allow filters to modify the titles of panels
   */
  base.on("filter.add filter.ready", "[x-base-filter]", function (event) {
    //console.log(this);
    var value = "";
    var panel = this;

    if (panel.hasAttr("x-base-panel")) {
      if (!panel.attr("x-base-default-title") && panel.find("[x-base-panel-title] div").count) {
        panel.attr("x-base-default-title", panel.find("[x-base-panel-title] div").html());
      }

      this.find(".active").each(function () {
        if (value) value += ", ";
        value += this.attr("x-base-title");
      });

      if (!value) value = panel.attr("x-base-default-title");

      panel.find(".panel-title div").html(value);
      // panel.panel('close');
    }
  });

  // Auto scroll tab nav colousel
  // Probably needs work as its too generic with class names
  /*
  base.on('scroll.to', function(event) {

    offset = base("[x-base-hash='"+event.data+"']").offset();
    base('.colousel-scroll').scrollLeft(offset.left);

  });
  */

  base.on("faq.filter", function (event) {
    var form = event.data;
    var search = form
      .find("input")
      .value()
      .replace(/[^0-9a-zA-Z_ ]/gi, "");

    base(".list-faqs").addClass("updating");

    base.setFilter("text", search);
    base.filterTriggers();
  });

  base("[x-base-download]").on("click", function (event) {
    var href = this.attr("x-base-href") || this.attr("href");
    var filename = href.replace(window.location.protocol + "//", "").replace(window.location.host, "");

    if (this.attr("href") == "javascript:;") {
      event.preventDefault();

      basefire.verifyDownload(filename, this.attr("x-base-download-ref"), this.attr("x-base-download-id"), this.attr("x-base-download-name"));
    } else {
      base.event("Download", this.attr("x-base-download-name"), filename);
    }
  });

  base.on("popup.open", function () {
    base.trigger("window.heights");
  });

  /* TEST CODE
  base.on('form.check', function(event) {
    console.log(event.data);
  });
  */

  base.on("form.token", function (event) {
    basefire.authDownload(event.data);
  });

  base.on("form.login.complete", function (event) {
    window.location.href = event.data;
  });

  // Form return handler
  base.on("form.error form.stage form.complete", function (event) {
    base.trigger("popup.resize");
  });

  base.on("form.stage", function (event) {
    var data = event.data;

    // var width = base('form .stage-nav .stage').width() + 2;
    // var left = width * (data.current_stage - 1);
    // base('form .stage-nav').scrollLeft(left);
  });

  base.on("window.resize window.scroll", function () {
    //var top = base('header').hasClass('slide-down') ? base('header').height() : 0;
    // base('.tabs.tabs-stacked nav').css('top', top + 'px');
    //base('.tabs.tabs-stacked nav [x-base-scrollto-offset]').attr('x-base-scrollto-offset', base('.tabs.tabs-stacked nav').height());
    //base('.tabs.tabs-stacked nav [x-base-scrollto-offset]').attr('x-base-scrollto-offset-up', base('header').height() + base('.tabs.tabs-stacked nav').height());
  });

  base.on("tabs.open", function () {
    base.trigger("window.resize");
    base.trigger("window.heights");
    base.trigger("base.colousel");
    base.trigger("base.fixheight");
    base.trigger("inview.check");
  });

  base.on("window.heights.set", function () {
    base.trigger("base.colousel");
  });

  base.on("filter.updated", function (event) {
    let debounceTime = 0;

    if(event.data.multi){
      debounceTime = 1000;
      window.filterInteracted = true;
    }
    else {
      base.trigger("panel.close");
    }

    this.find(".module").addClass("module-loading");

    debounce(() => {
      base("[x-base-module]").each(function () {
        //if (this.attr("x-base-config-autoload") == "") {
        event.data["_lazy_load"] = this.attr("x-base-lazy-load");
        this.module("setData", event.data);
        this.module("refresh");
        //}
      });
    }, debounceTime)();
  });
  

  base('[x-base-module^="list:"]').on("module.refreshed", function (event) {
    var data = this.data("module").data;

    if (data["_last_filter"] == "_page" && !this.attr("x-base-lazy-load")) {
      base.scrollTo.apply(this, [window, this.offset().header - 100, 300, "easeOutSine"]);
    }

    base.trigger("base.fixheight");
    base.setWindowHeights();

    base.addArticleInViewAttributes(this);
    base.trigger("inview.check");
  });

  base.on("modules.refresh", function () {
    base("[x-base-module] > .module").addClass("module-loading");
    base("[x-base-module]").module("refresh");
  });

  base.on("module.refreshed", function () {
    base("form").removeClass("form-submitting");
  });

  //faqs article js
  base(".site").on("click", "[data-faq-id] .question", function () {
    this.parent().toggleClass("active");
  });
})();
