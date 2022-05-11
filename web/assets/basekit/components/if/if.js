(function(base, window) {

    /*
    * USAGE
    * check if param is set
    * <span x-base-if="{{View.website}}">Website: <a href="{{View.website}}" target="_blank" rel="noopener">{{View.website}}</a></span>
    * check if param is set to certain value
    * <span x-base-if="{{View.id}}=951|805">Text here</span>
    * check if param is NOT set to certain value
    * <span x-base-if="{{View.id}}!=951|805">Text here</span>
    * check if session storage variable has any value
    * <span x-base-if="session.var">Text here</span>
    * check if local storage variable is empty
    * <span x-base-if="local.var!">Text here</span>
    */

    var baseif, condition, display, values, i, params, param, logic, match, nomatch;

    base.on('base.ready', function() {

        base('[x-base-if]').each(function() {

            display = false;

            baseif = this.attr('x-base-if');

            if (baseif.includes('!='))
            {
                condition = baseif.split('!=');
                logic = '!=';
            }
            else if (baseif.includes('!'))
            {
                condition = baseif.split('!');
                logic = '!=';
            }
            else
            {
                condition = baseif.split('=');
                logic = '=';
            }

            params = condition[0].split('.');

            if (params[0] =='local')
            {
                param = localStorage.getItem(params[1]);
            }
            else if (params[0] =='session')
            {
                param = sessionStorage.getItem(params[1]);
            }
            else
            {
                param = params[0];
            }

            if (condition[1])
            {
                values = condition[1].split('|');
                match = nomatch = false;

                for(i = 0; i < values.length; i++)
                {
                    if (param == values[i])
                    {
                        match = true;
                    }
                    else
                    {
                        nomatch = true;
                    }
                }

                if (logic == '=')
                {
                    if (match == true)
                    {
                        display = true;
                    }
                }
                else
                {
                    if (match == false)
                    {
                        display = true;
                    }
                }

            }
            else if (param)
            {
                if (logic == '=')
                {
                    display = true;
                }
                else
                {
                    display = false;
                }
            }
            else
            {
                if (logic == '!=')
                {
                    display = true;
                }
            }

            if (display)
            {
                this.addClass('is-valid')
                this.attr('x-base-if', '');
            }
            else
            {
                this.remove();
            }

        });

    });

})(base, window);
