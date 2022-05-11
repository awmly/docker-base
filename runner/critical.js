const critical = require('critical');
const pages = require('/runner/tmp/critical.json');

//const domain = 'https://base.applied.digital/';

let url;

let runCritical = async () => {

  for (page in pages) {

    if (pages[page].path) {
      url = pages[page].path.substr(1);
    } else {
      url = pages[page].url.substr(1); //.replace(domain, '');
    }

    if (url == '') url = 'index';

    console.log("Setting critical css > " + url);

    await critical.generate({
      inline: false,
      base: '/firebase/public',
      src: url + '.html',
      target:  url + '.css',
      dimensions: [{
          height: 1000,
          width: 500
        }, {
            height: 1000,
            width: 900
        }, {
            height: 1000,
            width: 1200
        }, {
          height: 1000,
          width: 1920
      }],
      penthouse: {
        timeout: 300000
      }
    }).catch(error => console.log('caught', error.message));

  }

}

runCritical();