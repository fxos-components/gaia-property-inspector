;(function(define){'use strict';define(function(require,exports,module){

/**
 * Dependencies
 */

var GaiaTextarea = require('gaia-text-input-multiline');
var component = require('gaia-component');
var format = require('./lib/format');
var GaiaPage = require('gaia-pages');

/**
 * Simple logger (toggle 0)
 *
 * @type {Function}
 */
var debug = 1 ? console.log.bind(console) : function() {};

/**
 * Register the element.
 *
 * @return {Element} constructor
 */
module.exports = component.register('gaia-property-inspector', {

  /**
   * Called when the element is first created.
   *
   * Here we create the shadow-root and
   * inject our template into it.
   *
   * @private
   */
  created: function() {
    debug('created');
    this.setupShadowRoot();

    this.els = {
      inner: this.shadowRoot.querySelector('.inner'),
      props: this.shadowRoot.querySelector('.props'),
      router: this.shadowRoot.querySelector('gaia-pages'),
      pages: this.shadowRoot.querySelectorAll('[data-route]'),
      header: this.shadowRoot.querySelector('gaia-header'),
      saveButton: this.shadowRoot.querySelector('.save')
    };

    this.els.title = this.els.header.querySelector('h1');

    this.router = this.els.router;
    this.shadowRoot.addEventListener('click', e => this.onClick(e));
    this.router.addEventListener('changed', e => this.onPageChange(e));
    this.els.header.addEventListener('action', () => this.router.back({ dir: 'back' }));
  },

  attached: function() {

    // HACK: This isn't being called natively :(
    this.els.header.attachedCallback();
  },

  set: function(node) {
    debug('set node', node);
    this.node = node;
    this.router.reset();
    this.router.navigate('/');
  },

  onClick: function(e) {
    debug('click', e);
    var a = e.target.closest('a');
    if (!a) { return; }
    e.preventDefault();
    var href = a.getAttribute('href');
    if (href === 'back') { this.router.back({ dir: 'back' }); }
    else { this.router.navigate(href, { dir: 'forward' }); }
  },

  onPageChange: function() {
    debug('on page change');
    var page = this.router.current;
    var data = dataFromPath(this.router.path, this.node);
    var formatted = format(data.value, data.key);
    var displayType = formatted.displayType;
    var el = render[displayType](formatted.formatted);

    this.setTitle(formatted.title || data.key);
    this.toggleSaveButton(displayType === 'value');

    page.innerHTML = '';
    page.appendChild(el);
  },

  setTitle: function(text) {
    this.els.title.textContent = text;
  },

  toggleSaveButton: function(value) {
    this.els.saveButton.hidden = !value;
  },

  template: `
    <div class="inner">
      <gaia-header action="back" not-flush>
        <h1>Header</h1>
        <button class="save">Save</button>
      </gaia-header>
      <gaia-pages manual>
        <section data-route="."></section>
        <section data-route="."></section>
      </gaia-pages>
    </div>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style-type: none;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      :host {
        display: block;
      }

      .inner {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;

        font-size: 0.9em;
        color: var(--text-color);
        background: var(--background);
        // font-family: Consolas,Monaco,"Andale Mono",monospace;
        -moz-user-select: none;
        cursor: default;
      }

      gaia-pages {
        flex: 1;
      }

      .value-page {
        display: flex;
        height: 100%;
      }

      .value-page .textarea {
        width: 100%;
      }

      .props {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      .item {
        display: block;
        padding: 0.5em 0.5em;
        border-bottom: solid 1px var(--border-color);
        opacity: 0.6;
      }

      .item.clickable {
        opacity: 1;
      }

      .item:nth-child(odd) {
      }

      .item .name {
        font: inherit;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item .value {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item > .value {
        color: var(--highlight-color);
      }

    </style>`
});

function dataFromPath(path, object) {
  debug('object from path', path, object);
  var key;

  var value = path.split('/').reduce((object, part) => {
    key = part;
    return part ? object[part] : object;
  }, object);

  return {
    key: key,
    value: value
  };
}

var render = {
  // object: function(node) {
  //   debug('render node page', node);
  //   var el = document.createElement('ul');

  //   for (var key in node) {
  //     var item = node[key];
  //     var li = document.createElement('a');
  //     var title = document.createElement('h3');
  //     var value = document.createElement('div');
  //     var isObject = typeof item.value === 'object';

  //     title.className = 'name';
  //     title.textContent = key;

  //     value.className = 'value';
  //     value.textContent = item.displayValue;

  //     li.appendChild(title);
  //     li.appendChild(value);
  //     li.classList.add('item');

  //     if (isObject || item.writable) {
  //       li.classList.add('writable');
  //       li.href = key;
  //     }

  //     el.appendChild(li);
  //   }

  //   return el;
  // },

  object: function(props) {
    debug('render props', props);
    var list = document.createElement('div');

    props.forEach(prop => {
      var item = document.createElement('a');
      var key = document.createElement('h3');
      var value = document.createElement('div');
      var isObject = typeof prop.value === 'object';

      key.className = 'name';
      value.className = 'value';

      key.textContent = prop.key;
      value.textContent = prop.displayValue;

      item.appendChild(key);
      item.appendChild(value);
      item.className = 'item';

      if (isObject || prop.writable) {
        item.classList.add('clickable');
        item.href = prop.key;
      }

      list.appendChild(item);
    });

    return list;
  },

  value: function(item) {
    debug('render value', item);
    // XXX: gaia-text-input is broken on B2G. Use a standard <textarea> for now.
    //var textarea = document.createElement('gaia-text-input-multiline');
    var textarea = document.createElement('textarea');
    var el = document.createElement('div');
    el.className = 'value-page';
    //textarea.value = item.value;
    textarea.innerHTML = item.value;
    textarea.className = 'textarea';
    el.appendChild((textarea));
    return el;
  }
};

function getDisplayValue(value) {
  if (typeof value === 'string') { return '\'' + value + '\''; }
  else if (value instanceof HTMLElement) return toString.element(value);
  else if (value instanceof Text) return toString.textNode(value);
  else return value;
}

});})(typeof define=='function'&&define.amd?define
:(function(n,w){'use strict';return typeof module=='object'?function(c){
c(require,exports,module);}:function(c){var m={exports:{}};c(function(n){
return w[n];},m.exports,m);w[n]=m.exports;};})('gaia-property-inspector',this));
