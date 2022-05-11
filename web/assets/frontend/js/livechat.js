/** 
 * ADD THIS IS SCFRIPTS via ADMIN
 * 
 *  window.__lc = window.__lc || {};
 *  window.__lc.license = 12247236;
 *  ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))
 *
 *  ;LiveChatWidget.on('ready', base.setLivechatStatus);
 */

(function(base) {

  base.setLivechatStatus = function() {
      
    base('[x-base-livechat]').removeClass('status');

    if (LC_API.agents_are_available()) {

      base('[x-base-livechat]').addClass('active');

    } else {

      base('[x-base-livechat]').addClass('inactive');

    }

  }

  // Agents available returns true until livechat widget has fully init'd
  // Do regular checks to make sure value is correct
  // setTimeout(setLivechatStatus, 1000);
  // setTimeout(setLivechatStatus, 2000);
  // setTimeout(setLivechatStatus, 3000);
  //setTimeout(setLivechatStatus, 3000);


  base('[x-base-livechat-open]').on('click', function() {

    LC_API.open_chat_window();

  });

  base.on('livechat.open', function() {

    LC_API.open_chat_window();

  });

  

})(base);
