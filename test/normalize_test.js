/*global window,assert,suite,setup,teardown,sinon,test*/

suite('normalize-list', function() {
  var normalize = window['./lib/normalize'];

  test('HTMLCollection', function() {
    var el = document.createElement('div');
    el.appendChild(document.createElement('div'));
    el.appendChild(document.createElement('div'));
    el.appendChild(document.createElement('div'));

    var normalized = normalize(el.children);
    var result = normalized.result;

    assert.equal(result.length, 3);
    assert.equal(result[0].key, 0);
    assert.equal(result[0].value, el.children[0]);
  });

  test('HTMLElement', function() {
    var el = document.createElement('div');
    var normalized = normalize(el);
    var result = normalized.result;

    assert.equal(normalized.result.tagName.value, 'DIV');
    assert.equal(normalized.type, 'object');
  });

  test('Attr', function() {
    var el = document.createElement('div');
    el.setAttribute('title', 'my title');

    var normalized = normalize(el.attributes.title);
    var result = normalized.result;

    assert.equal(result.value, 'my title');
    assert.equal(normalized.type, 'value');
  });
});