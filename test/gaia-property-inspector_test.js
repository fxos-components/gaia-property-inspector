/*global window,assert,suite,setup,teardown,sinon,test*/

suite.skip('GaiaHeader', function() {
  'use strict';

  var CssPanel = window['gaia-property-inspector'];

  setup(function(done) {
    this.sinon = sinon.sandbox.create();

    // DOM container to put test cases
    this.dom = document.createElement('div');

    this.dom.innerHTML = `
      <style>
        .my-div { color: red; }
      </style>
      <div class="my-div"></div>
    `;

    document.body.appendChild(this.dom);

    this.panel = new CssPanel();
    this.panel.set(this.dom.querySelector('.my-div'));

    setTimeout(done, 100);
  });

  teardown(function() {
    this.sinon.restore();
    this.dom.remove();
  });

  test('It', function() {
    // console.log('XXX', document.styleSheets.length);
    var styles = this.panel.shadowRoot.querySelector('.styles');
    assert.equal(styles.textContent, 'color: red');
  });
});
