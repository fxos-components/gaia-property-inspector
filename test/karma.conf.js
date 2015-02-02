
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'sinon-chai'],
    browsers: ['firefox_latest'],
    client: {
      captureConsole: true,
      mocha: { 'ui': 'tdd' }
    },
    basePath: '../',

    customLaunchers: {
      firefox_latest: {
        base: 'FirefoxNightly',
        prefs: { 'dom.webcomponents.enabled': true }
      }
    },

    files: [
      'bower_components/gaia-component/gaia-component.js',
      'lib/format.js',
      'gaia-property-inspector.js',
      'test/format_test.js',
      'test/gaia-property-inspector_test.js'
    ],

    proxies: {
      '/bower_components/': 'http://localhost:9876/base/bower_components/'
    }
  });
};
