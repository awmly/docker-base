(function() {

  var recaptchaAdded = false;
  var recaptchaKey = base('[x-base-recaptcha-key]').attr('x-base-recaptcha-key');

  base.on('window.interact', function() {

    if(!recaptchaAdded){

      recaptchaAdded = true;

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.google.com/recaptcha/api.js?render=' + recaptchaKey; //6LdPUbUUAAAAADm7SwXnbBj-FsCjbgHP1MuIlt1f
      document.getElementsByTagName('head')[0].appendChild(script);
    }

  });

  base('body').on('submit', '[x-base-form-trigger]', function(event) {

    event.preventDefault();

    this.addClass('form-submitting');

    base.trigger(this.attr('x-base-form-trigger'), this);

  });

  base('body').on('click', '[x-base-form]', function(event) {

    if (!this.attr('x-base-interact')) {
      this.attr('x-base-interact', 1);
      base.event('Form', this.attr('x-base-event'), 'interact', false, base("[x-base-view-url]").attr("x-base-view-url"));
    }

  });

  base('body').on('submit', '[x-base-form]', function(event) {

    event.preventDefault();

    if (this.attr('x-base-submitted') != '1') {

      this.attr('x-base-submitted', '1');
      this.addClass('form-submitting');

      var form = this;

      if (form.find('.g-recaptcha-response').count) {
        grecaptcha.ready(function() {
          grecaptcha.execute(recaptchaKey).then(function(token) {

            form.find(".g-recaptcha-response").attr("value", token);
            base.formValidate.apply(form);

          });
        });
      } else{
        base.formValidate.apply(form);
      }

    }

  }, {passive:false});

  base('body').on('click', '[x-base-goto-stage]', function(event) {

    event.preventDefault();

    var form = this.parents('form');

    if (form.attr('x-base-submitted') != '1') {

      form.attr('x-base-submitted', '1');
      form.addClass('form-submitting');

      form.find("[name='goto_stage']").value(this.attr('x-base-goto-stage'));

      base.formValidate.apply(form);

    }

  }, {passive:false});

  base.formValidate = function() {

    if (this.attr('x-base-form') == 'javascript') {
      base.formJavascript.apply(this);
    } else {
      this.attr('x-base-allow-submit', 1);
      this.elm.submit();
    }

  };

  base.formJavascript = function() {

    var urlParams = '';
    this.find('[x-base-url-param]').each(function() {
      urlParams += '/' + this.attr('x-base-url-param') + '/' + this.attr('value');
    });

    var url = "/module/scripts:ajax:form-validate/async" + urlParams;

    base.trigger("form.submit");
    base.trigger("form.submit." + this.attr('name'));

    var data = [];
    var form = this;

    this.find('input[type=text],input[type=password],input[type=email],input[type=hidden],select,textarea,[x-base-custom-field]', function(){

      if (form.find('[name="' + this.attr('name') + '"]').count > 1) {

        data[this.elm.name] = [];

        form.find('[name="' + this.attr('name') + '"]').each(function() {
          data[this.elm.name].push(this.value());
        });

      } else {
        data[this.elm.name] = this.value();
      }


    });

    this.find('input[type=radio],input[type=checkbox]', function(){
      if (this.elm.checked) {
        data[this.elm.name] = this.value();
      }
    });

    this.ajax({
      'method': this.attr('method'),
      'url': url,
      'data': data,
      'responseType': 'json',
      'contentType': 'application/x-www-form-urlencoded',
      'onLoad': function(data) {

        //console.log(data);

        base.formReturn.apply(this, [data]);

        if (data.status == 'stage') {

          base.formNextStage.apply(this, [data]);

        } else if (data.status == 'complete') {

          base.formComplete.apply(this, [data]);

        } else {

          base.formError.apply(this, [data]);

        }

      }

    });


  }

  base.formReturn = function(data) {

    this.removeClass('form-submitting');

    if (data.feedback) {
      this.find('.feedback-holder').html(data.feedback);
      base.formScripts(data.feedback_scripts);
    }

    if (data.scroll) {

      if (this.parents('.popup-scroll')) {
        base.scrollTo.apply(this, [base('.popup-scroll'), 0, 300, 'easeOutSine']);
      } else {
        base.scrollTo.apply(this, [window, this.offset().header, 300, 'easeOutSine']);
      }

    }

    if (data.trigger) {
      for (trigger in data.trigger) {
        base.trigger(trigger, data.trigger[trigger]);
      }
    }

    if (data.status == 'complete') {
      base.event('Form', data.analytics_event, data.status, data.ad_words_label, base("[x-base-view-url]").attr("x-base-view-url"));
    } else {
      base.event('Form', data.analytics_event, data.status + ' ' + data.current_stage, false, base("[x-base-view-url]").attr("x-base-view-url"));
    }


  };

  base.formNextStage = function(data) {

    this.find('.feedback-holder').html('');

    this.find('[x-base-stage-nav]').removeClass('stage-nav-' + data.previous_stage).addClass('stage-nav-' + data.current_stage);

    this.find('[x-base-stage="' + data.previous_stage + '"]').html('');
    this.find('[x-base-stage="' + data.current_stage + '"]').html(data.stage_html);

    this.attr('x-base-submitted', '0');
    this.removeClass('form-submitting');

    base.formScripts(data.stage_scripts);

    // Triggers
    base.trigger("form.stage", data);
    base.trigger("form.stage." + this.attr('name'), data);
    this.trigger('form.stage');

  };

  base.formScripts = function(scripts) {

    // Remove previous script holder
    base('script[x-base-ajax]').remove();

    // Add new script holder
    var script_tag = document.createElement('script');
    script_tag.nonce = base('[x-base-ajax-nonce]').attr('x-base-ajax-nonce');
    script_tag.text = scripts;
    script_tag.setAttribute('x-base-ajax', 1);
    document.body.appendChild(script_tag);

  };

  base.formComplete = function(data) {


    if (data.hide_form) {

      this.find('.fields-holder, .stage-nav').css('display', 'none');

    }

    if (data.hide_text) {

      this.find('.cms').css('display', 'none');

    }

    this.find('.form-group').removeClass('failed');

    base.trigger("form.complete", data);
    base.trigger("form.complete." + this.attr('name'), data);
    this.trigger('form.complete');

  }

  base.formError = function(data) {

    this.find('.validation').html("");
    this.find("[x-base-field]").removeClass('has-error');

    for (field in data.fields) {

      elm = this.find("[x-base-field='" + field + "']");

      if (elm.count) {
        elm.addClass('has-error');
        elm.find('.validation').html(data.fields[field]);
      }

    }

    /*var gr = this.find(".g-recaptcha").attr('data-recaptcha-id');

    if (typeof window.grecaptcha !== 'undefined' && gr !== false) {
      window.grecaptcha.reset(parseInt(gr));
    }*/

    this.attr('x-base-submitted', '0');
    this.removeClass('form-submitting');

    base.trigger("form.error", data);
    base.trigger("form.error." + this.attr('name'), data);

  }

  base.formDependencies = function(form) {

    var field, dep, check_val, current_val;

    form.find('[x-base-field]').each(function() {

      dep = this.attr('x-base-dependency');
      check_val = this.attr('x-base-dependency-value');

      if (dep && check_val) {

        vals = check_val.split("|");

        field = form.find('[name="' + dep + '"]');

        current_val = field.value();

        if (current_val)
        {
          current_val = current_val.trim();
        }

        this.addClass('field-inactive');

        for (var x in vals) {

          if (field.attr('type') == 'checkbox')
          {

            if (field.is(':checked') && vals[x] == 1) {
              this.removeClass('field-inactive');
            } else if (!field.is(':checked') && vals[x] != 1) {
              this.removeClass('field-inactive');
            }
  
          }
          else if (field.attr('type') == 'radio')
          {
            //if ($(form).find("[name='" + dep + "']:checked").val() == val[x]) display = true;
          }
          else if (current_val == vals[x] || (vals[x] == '*' && current_val))
          {
            this.removeClass('field-inactive');
          }
          else if (vals[x].indexOf('*') >= 0)
          {
            if (current_val.indexOf(vals[x].replace(/\*/g, "")) >= 0) this.removeClass('field-inactive');
          }
          else if (vals[x].indexOf('!') >= 0)
          {
             if (current_val.indexOf(vals[x].replace(/!/g, "")) == -1) this.removeClass('field-inactive');
          }
          else
          {
            
          }

        }

      }

    });

  }

  base.formDependenciesInit = function(selector) {

    var form = base(selector);

    base.formDependencies(form);

    form.find('select, input[type="radio"], input[type="checkbox"]').on('change', function() {

      base.formDependencies(form);

    });

  }

})();
