var auth = require('../helpers/auth');
var proxy = require('../helpers/proxy');

var config = {
  /**
   * --------- ADD YOUR UAA CONFIGURATION HERE ---------
   *
   * This uaa helper object simulates NGINX uaa integration using Grunt allowing secure cloudfoundry service integration in local development without deploying your application to cloudfoundry.
   * Please update the following uaa configuration for your solution
   */
  // uaa: {
  //   clientId: 'predix-seed',
  //   serverUrl: 'https://etc.predix-uaa-staging.grc-apps.svc.ice.ge.com',
  //   defaultClientRoute: '/about',
  //   base64ClientCredential: 'cHJlZGl4LXNlZWQ6TTBhVzdrTmZRRndyTTZ3ZHJpV2h3bVc2ck1HQ045Q0x1cnI5VnI3elc0cz0='
  // },
  uaa: {
   clientId: 'my_uaa_client',
   serverUrl: 'https://5b47d057-8cef-4120-95aa-5572ff91e394.predix-uaa-staging.grc-apps.svc.ice.ge.com',
   defaultClientRoute: '/dashboard',
   base64ClientCredential: 'bXlfdWFhX2NsaWVudDpNak1md0pxbEkwVEhrNy9YR096M0ZPMUJPbHk0dllzVWFQN3dGS2tMV3djPQ=='
 },
  /**
   * --------- ADD YOUR SECURE ROUTES HERE ------------
   *
   * Please update the following object add your secure routes
   *
   * Note: Keep the /api in front of your services here to tell the proxy to add authorization headers.
   */
  // proxy: {
  //   '/api/view-service(.*)': {
  //     url: 'http://predix-views-dev.grc-apps.svc.ice.ge.com/v1$1',
  //     instanceId: '49a92fd6-df7b-45f6-925e-0bca94be7313'
  //   }
  // }
  proxy: {
   '/api/view-service(.*)': {
     url: 'https://predix-views-predix-sysint.grc-apps.svc.ice.ge.com/v1$1',
     instanceId: 'a944c9cd-d015-474f-a22d-b608ec27587c'
   }
 }
};

module.exports = {
  server: {
    options: {
      port: 9000,
      base: 'public',
      open: true,
      hostname: 'localhost',
      middleware: function (connect, options) {
        var middlewares = [];

        //add predix services proxy middlewares
        middlewares = middlewares.concat(proxy.init(config.proxy));

        //add predix uaa authentication middlewaress
        middlewares = middlewares.concat(auth.init(config.uaa));

        if (!Array.isArray(options.base)) {
          options.base = [options.base];
        }

        var directory = options.directory || options.base[options.base.length - 1];
        options.base.forEach(function (base) {
          // Serve static files.
          middlewares.push(connect.static(base));
        });

        // Make directory browse-able.
        middlewares.push(connect.directory(directory));

        return middlewares;
      }
    }
  }
};
