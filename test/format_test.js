/*global window,assert,suite,setup,teardown,sinon,test*/

suite.only('format', function() {
  var format = window['./lib/format'];

  test('It gives each property a descriptive type', function() {
    var result = format(document.createElement('div'));
    var props = result.formatted;

    assert.equal(find(props, 'children').type, 'HTMLCollection');
    assert.equal(find(props, 'childNodes').type, 'NodeList');
    assert.equal(find(props, 'attributes').type, 'NamedNodeMap');
    assert.equal(find(props, 'nodeType').type, 'number');
    assert.equal(find(props, 'tagName').type, 'string');
  });

  test('It provides the current value of each property', function() {
    var el = document.createElement('div');
    var props = format(el).formatted;

    assert.equal(find(props, 'children').value, el.children);
    assert.equal(find(props, 'childNodes').value, el.childNodes);
    assert.equal(find(props, 'nodeType').value, 1);
    assert.equal(find(props, 'tagName').value, 'DIV');
  });

  test('It declares whether a property is writable', function() {
    var el = document.createElement('div');
    var props = format(el).formatted;

    // Not writable
    assert.equal(find(props, 'children').writable, false);
    assert.equal(find(props, 'childNodes').writable, false);
    assert.equal(find(props, 'nodeType').writable, false);
    assert.equal(find(props, 'tagName').writable, false);
    assert.equal(find(props, 'attributes').writable, false);

    // Writable
    assert.equal(find(props, 'textContent').writable, true);
    assert.equal(find(props, 'innerHTML').writable, true);
  });

  test('It copes with Text nodes', function() {
    var textNode = document.createTextNode('foo');
    var props = format(textNode).formatted;

    assert.equal(find(props, 'nodeValue').value, 'foo');
    assert.equal(find(props, 'nodeValue').type, 'string');
    assert.equal(find(props, 'nodeValue').writable, true);
    assert.equal(find(props, 'nodeType').value, 3);
  });

  test('It handles document nodes', function() {
    var result = format(document);

    assert.equal(result.title, 'HTMLDocument');
    assert.equal(result.displayType, 'object');
  });

  test('It handles document nodes', function() {
    var result = format(document);

    assert.equal(result.title, 'HTMLDocument');
    assert.equal(result.displayType, 'object');
  });

  test('It creates a `title`', function() {
    var textNode = document.createTextNode('foo');
    var props = format(textNode);
    assert.equal(props.title, '<text!foo>');

    var el = document.createElement('div');
    el.className = 'foo bar';
    el.id = 'myel';

    props = format(el);
    assert.equal(props.title, '<div#myel.foo.bar>');
  });

  suite('Lists', function() {
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
    });

    test('HTMLCollection', function() {
      var normalized = format(this.el.children);
      var props = normalized.formatted;

      assert.equal(props[0].key, 0);
      assert.equal(props[0].value, this.el.children[0]);
      assert.equal(props[0].displayValue, 'HTMLLIElement');
      assert.equal(props[0].type, 'HTMLLIElement');

      assert.equal(props[1].key, 1);
      assert.equal(props[1].value, this.el.children[1]);
      assert.equal(props[1].displayValue, 'HTMLLIElement');
      assert.equal(props[1].type, 'HTMLLIElement');
    });

    test('NodeList', function() {
      var normalized = format(this.el.childNodes);
      var props = normalized.formatted;

      assert.equal(props[0].key, 0);
      assert.equal(props[0].value, this.el.childNodes[0]);
      assert.equal(props[0].displayValue, 'Text');
      assert.equal(props[0].type, 'Text');

      assert.equal(props[1].key, 1);
      assert.equal(props[1].value, this.el.childNodes[1]);
      assert.equal(props[1].displayValue, 'HTMLLIElement');
      assert.equal(props[1].type, 'HTMLLIElement');
    });

    test('NamedNodeMap', function() {
      var normalized = format(this.el.attributes);
      var props = normalized.formatted;

      assert.equal(props[0].key, 'data-bar');
      assert.equal(props[0].value, 'bar');
      assert.equal(props[0].displayValue, '\'bar\'');
      assert.equal(props[0].type, 'Attr');

      assert.equal(props[1].key, 'data-foo');
      assert.equal(props[1].value, 'foo');
      assert.equal(props[1].displayValue, '\'foo\'');
      assert.equal(props[1].type, 'Attr');
    });

    test('DOMTokenList', function() {
      var normalized = format(this.el.classList);
      var props = normalized.formatted;

      assert.equal(props[0].key, 0);
      assert.equal(props[0].value, 'one');
      assert.equal(props[0].displayValue, '\'one\'');
      assert.equal(props[0].type, 'string');

      assert.equal(props[1].key, 1);
      assert.equal(props[1].value, 'two');
      assert.equal(props[1].displayValue, '\'two\'');
      assert.equal(props[1].type, 'string');
    });

    test('DOMStringMap', function() {
      var normalized = format(this.el.dataset);
      var props = normalized.formatted;

      assert.equal(props[0].key, 'bar');
      assert.equal(props[0].value, 'bar');
      assert.equal(props[0].displayValue, '\'bar\'');
      assert.equal(props[0].type, 'string');

      assert.equal(props[1].key, 'foo');
      assert.equal(props[1].value, 'foo');
      assert.equal(props[1].displayValue, '\'foo\'');
      assert.equal(props[1].type, 'string');
    });

    test('CSS2Properties', function() {
      var normalized = format(this.el.style);
      var props = normalized.formatted;

      assert.equal(props[0].key, 'color');
      assert.equal(props[0].value, 'red');
      assert.equal(props[0].displayValue, '\'red\'');
      assert.equal(props[0].type, 'string');

      assert.equal(props[1].key, 'background-color');
      assert.equal(props[1].value, 'blue');
      assert.equal(props[1].displayValue, '\'blue\'');
      assert.equal(props[1].type, 'string');
    });
  });

  /**
   * Utils
   */

  function find(list, key) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].key === key) return list[i];
    }
  }
});
