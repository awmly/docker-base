(function() {

  
  /** Textarea linebreaks
  $('textarea').each(function() {
    $(this).val($(this).val().replace(/<br\/>/gi, "\n"));
  });

  // Track events
  $("[data-event]").click(function() {

    var cat = !!$(this).is("[data-cat]") ? $(this).attr("data-cat") : "Link";
    var action = !!$(this).is("[data-action]") ? $(this).attr("data-action") : "Action";
    var label = !!$(this).is("[data-label]") ? $(this).attr("data-label") : $(this).attr("href");

    trackEvent(cat, action, label);

  });



  $('body').on('click', '[data-ajax]', function(event) {
    $.post($(this).attr('data-ajax'));
  });



  /** Data URL
  $("[data-url]").click(function() {
    document.location.href = $(this).attr('data-url');
  });

*/

})();
