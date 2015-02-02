/*global window,assert,suite,setup,teardown,sinon,test*/

suite('normalize-list', function() {
  var normalize = window['./normalize-list'];

  setup(function() {
    this.dom = document.createElement('div');

    this.dom.innerHTML = `
      <ul
        style="color: red; background-color: blue;"
        title="foo"
        class="one two three"
        data-foo="foo"
        data-bar="bar">
        <li>One</li>
        <li>Two</li>
        <li>Three</li>
      </ul>`;

    this.el = this.dom.firstElementChild;
    document.body.appendChild((this.dom));
  });

  teardown(function() {
    this.dom.remove();
  });

  test('HTMLCollection', function() {
    var normalized = normalize(this.el.children);

    assert.equal(normalized[0].key, 0);
    assert.equal(normalized[0].value, this.el.children[0]);
    assert.equal(normalized[0].displayValue, 'HTMLLIElement');
    assert.equal(normalized[0].type, 'HTMLLIElement');

    assert.equal(normalized[1].key, 1);
    assert.equal(normalized[1].value, this.el.children[1]);
    assert.equal(normalized[1].displayValue, 'HTMLLIElement');
    assert.equal(normalized[1].type, 'HTMLLIElement');
  });

  test('NodeList', function() {
    var normalized = normalize(this.el.childNodes);

    assert.equal(normalized[0].key, 0);
    assert.equal(normalized[0].value, this.el.childNodes[0]);
    assert.equal(normalized[0].displayValue, 'Text');
    assert.equal(normalized[0].type, 'Text');

    assert.equal(normalized[1].key, 1);
    assert.equal(normalized[1].value, this.el.childNodes[1]);
    assert.equal(normalized[1].displayValue, 'HTMLLIElement');
    assert.equal(normalized[1].type, 'HTMLLIElement');
  });

  test('NamedNodeMap', function() {
    var normalized = normalize(this.el.attributes);

    assert.equal(normalized[0].key, 'data-bar');
    assert.equal(normalized[0].value, 'bar');
    assert.equal(normalized[0].displayValue, '\'bar\'');
    assert.equal(normalized[0].type, 'Attr');

    assert.equal(normalized[1].key, 'data-foo');
    assert.equal(normalized[1].value, 'foo');
    assert.equal(normalized[1].displayValue, '\'foo\'');
    assert.equal(normalized[1].type, 'Attr');
  });

  test('DOMTokenList', function() {
    var normalized = normalize(this.el.classList);

    assert.equal(normalized[0].key, 0);
    assert.equal(normalized[0].value, 'one');
    assert.equal(normalized[0].displayValue, '\'one\'');
    assert.equal(normalized[0].type, 'string');

    assert.equal(normalized[1].key, 1);
    assert.equal(normalized[1].value, 'two');
    assert.equal(normalized[1].displayValue, '\'two\'');
    assert.equal(normalized[1].type, 'string');
  });

  test('DOMStringMap', function() {
    var normalized = normalize(this.el.dataset);

    assert.equal(normalized[0].key, 'bar');
    assert.equal(normalized[0].value, 'bar');
    assert.equal(normalized[0].displayValue, '\'bar\'');
    assert.equal(normalized[0].type, 'string');

    assert.equal(normalized[1].key, 'foo');
    assert.equal(normalized[1].value, 'foo');
    assert.equal(normalized[1].displayValue, '\'foo\'');
    assert.equal(normalized[1].type, 'string');
  });

  test('CSS2Properties', function() {
    var normalized = normalize(this.el.style);

    assert.equal(normalized[0].key, 'color');
    assert.equal(normalized[0].value, 'red');
    assert.equal(normalized[0].displayValue, '\'red\'');
    assert.equal(normalized[0].type, 'string');

    assert.equal(normalized[1].key, 'background-color');
    assert.equal(normalized[1].value, 'blue');
    assert.equal(normalized[1].displayValue, '\'blue\'');
    assert.equal(normalized[1].type, 'string');
  });
});