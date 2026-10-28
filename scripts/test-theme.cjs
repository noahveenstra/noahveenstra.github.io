const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const source = readFileSync(join(__dirname, '../assets/theme.js'), 'utf8');

function page({ dark = false, saved = null, baseline = null, blocked = false, legacy = false } = {}) {
  const events = {};
  const root = { dataset: {} };
  const meta = [{ content: '' }, { content: '' }];
  const values = new Map([['noah-theme', saved], ['noah-theme-system', baseline]]);
  let button, change;
  const storage = {
    getItem(key) { if (blocked) throw Error('Storage blocked'); return values.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); values.set(key, value); },
    removeItem(key) { if (blocked) throw Error('Storage blocked'); values.delete(key); }
  };
  const media = { matches: dark };
  media[legacy ? 'addListener' : 'addEventListener'] = legacy
    ? listener => { change = listener; }
    : (type, listener) => { assert.equal(type, 'change'); change = listener; };
  const document = {
    documentElement: root,
    querySelectorAll: () => meta,
    addEventListener: (type, listener) => { events[type] = listener; },
    createElement(type) {
      assert.equal(type, 'button');
      return { attributes: {}, firstElementChild: {}, setAttribute(key, value) { this.attributes[key] = value; }, addEventListener(type, fn) { this[type] = fn; } };
    },
    body: { append(element) { button = element; } }
  };
  runInNewContext(source, {
    document, localStorage: storage,
    window: { matchMedia: () => media, addEventListener: (type, listener) => { events[type] = listener; } }
  });
  const initial = root.dataset.theme;
  events.DOMContentLoaded();
  return {
    initial, root, meta, button, values,
    system(dark) { media.matches = dark; change(); },
    click() { button.click(); },
    storage(value, baseline) {
      values.set('noah-theme', value); values.set('noah-theme-system', baseline);
      events.storage({ key: 'noah-theme' });
    },
    restore(dark) { media.matches = dark; events.pageshow({ persisted: true }); }
  };
}

test('original toggle markup and accessible state follow system colors before rendering', () => {
  for (const dark of [false, true]) {
    const p = page({ dark });
    assert.equal(p.initial, dark ? 'dark' : 'light');
    assert.equal(p.button.className, 'theme-toggle');
    assert.equal(p.button.type, 'button');
    assert.equal(p.button.innerHTML, '<span aria-hidden="true">◐</span>');
    assert.equal(p.button.attributes['aria-pressed'], String(dark));
    p.system(!dark);
    assert.equal(p.root.dataset.theme, dark ? 'light' : 'dark');
    assert.equal(p.button.firstElementChild.textContent, dark ? '◐' : '☼');
    assert.equal(p.meta[0].content, dark ? '#f8f8f7' : '#181818');
  }
});

test('button toggles and persists, then any system change automatically takes over', () => {
  const p = page();
  p.click();
  assert.equal(p.root.dataset.theme, 'dark');
  assert.equal(p.values.get('noah-theme'), 'dark');
  assert.equal(p.values.get('noah-theme-system'), 'light');
  p.system(true);
  assert.equal(p.root.dataset.theme, 'dark');
  assert.equal(p.values.has('noah-theme'), false);
  p.system(false);
  assert.equal(p.root.dataset.theme, 'light');
  p.click(); p.click();
  assert.equal(p.root.dataset.theme, 'light');
  p.system(true);
  assert.equal(p.root.dataset.theme, 'dark');
});

test('stale and legacy preferences cannot lock out the system theme', () => {
  assert.equal(page({ dark: true, saved: 'light' }).initial, 'dark');
  assert.equal(page({ dark: true, saved: 'light', baseline: 'light' }).initial, 'dark');
  assert.equal(page({ dark: true, saved: 'light', baseline: 'dark' }).initial, 'light');
  const p = page({ saved: 'dark', baseline: 'light' });
  p.restore(true); p.restore(false);
  assert.equal(p.root.dataset.theme, 'dark');
  p.system(true); p.system(false);
  assert.equal(p.root.dataset.theme, 'light');
});

test('blocked storage and older media listeners still support the button and automatic changes', () => {
  for (const options of [{ blocked: true }, { legacy: true }]) {
    const p = page(options);
    p.click(); assert.equal(p.root.dataset.theme, 'dark');
    p.system(true); p.system(false);
    assert.equal(p.root.dataset.theme, 'light');
  }
});

test('other tabs and back/forward restoration resynchronize colors', () => {
  const p = page();
  p.storage('dark', 'light');
  assert.equal(p.root.dataset.theme, 'dark');
  p.storage(null, null);
  assert.equal(p.root.dataset.theme, 'light');
  p.restore(true);
  assert.equal(p.root.dataset.theme, 'dark');
});
