/*global window,assert,suite,setup,teardown,sinon,test*/

suite('normalize-value', function() {
  var normalize = window['./normalize-value'];

  test('String', function() {
    var result = normalize('Simple String');

    assert.equal(result.value, 'Simple String');
    assert.equal(result.displayValue, '\'Simple String\'');
    assert.equal(result.constructor, String);
    assert.equal(result.type, 'string');
  });

  test('Function', function() {
    var fn = function(){};
    var result = normalize(fn);

    assert.equal(result.value, fn);
    assert.equal(result.displayValue, 'function (){}');
    assert.equal(result.constructor, Function);
    assert.equal(result.type, 'function');
    assert.equal(result.native, false);
  });

  test('Function [native]', function() {
    var fn = HTMLElement.prototype.querySelector;
    var result = normalize(fn);

    assert.equal(result.value, fn);
    assert.equal(result.displayValue, fn);
    assert.equal(result.constructor, Function);
    assert.equal(result.type, 'function');
    assert.equal(result.native, true);
  });

  test('Attr', function() {
    var el = document.createElement('div');
    el.setAttribute('title', 'foo');
    var attr = el.attributes.title;
    var result = normalize(attr);

    assert.equal(result.value, 'foo');
    assert.equal(result.displayValue, '\'foo\'');
    assert.equal(result.constructor, Attr);
    assert.equal(result.type, 'Attr');
  });

  test('Boolean', function() {
    var result = normalize(100);

    assert.equal(result.value, 100);
    assert.equal(result.displayValue, '100');
    assert.equal(result.constructor, Number);
    assert.equal(result.type, 'number');
  });
});