const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const { test } = require('node:test');
const source = readFileSync(join(__dirname, '../assets/theme.js'), 'utf8');

function page({ dark = false, saved = null, blocked = false, legacy = false } = {}) {
  const events = {};
  const root = { dataset: {} };
  const meta = [{ content: '' }, { content: '' }];
  let control, change;
  const storage = {
    getItem() { if (blocked) throw Error('Storage blocked'); return saved; },
    setItem(key, value) { if (blocked) throw Error('Storage blocked'); saved = value; },
    removeItem() { if (blocked) throw Error('Storage blocked'); saved = null; }
  };
  const media = { matches: dark };
  media[legacy ? 'addListener' : 'addEventListener'] = legacy
    ? listener => { change = listener; }
    : (type, listener) => { assert.equal(type, 'change'); change = listener; };
  const document = {
    documentElement: root,
    querySelectorAll: () => meta,
    addEventListener: (type, listener) => { events[type] = listener; },
    createElement: () => ({ setAttribute() {}, add() {}, addEventListener(type, fn) { this[type] = fn; } }),
    body: { append(element) { control = element; } }
  };
  runInNewContext(source, {
    document, localStorage: storage, Option: function() {},
    window: { matchMedia: () => media, addEventListener: (type, listener) => { events[type] = listener; } }
  });
  const initial = root.dataset.theme;
  events.DOMContentLoaded();
  return {
    initial, root, meta, control,
    get saved() { return saved; },
    system(dark) { media.matches = dark; change(); },
    select(value) { control.value = value; control.change(); },
    storage(value, key = 'noah-theme') { saved = value; events.storage({ key, newValue: value, storageArea: storage }); },
    restore(value, dark) { saved = value; media.matches = dark; events.pageshow({ persisted: true }); }
  };
}

test('system is applied before DOM ready and follows live light/dark changes', () => {
  for (const dark of [false, true]) {
    const p = page({ dark });
    assert.equal(p.initial, dark ? 'dark' : 'light');
    assert.equal(p.control.value, 'system');
    p.system(!dark);
    assert.equal(p.root.dataset.theme, dark ? 'light' : 'dark');
    assert.equal(p.meta[0].content, dark ? '#f8f8f7' : '#181818');
    p.system(dark);
    assert.equal(p.root.dataset.theme, dark ? 'dark' : 'light');
    assert.equal(p.saved, null);
  }
});

test('saved manual choices survive system changes; System removes the override', () => {
  for (const saved of ['light', 'dark']) {
    const p = page({ dark: saved !== 'dark', saved });
    assert.equal(p.initial, saved);
    p.system(false); p.system(true);
    assert.equal(p.root.dataset.theme, saved);
    p.select('system');
    assert.equal(p.saved, null);
    assert.equal(p.root.dataset.theme, 'dark');
    p.system(false);
    assert.equal(p.root.dataset.theme, 'light');
    p.select('dark');
    assert.equal(p.saved, 'dark');
    assert.equal(p.root.dataset.theme, 'dark');
  }
});

test('unavailable storage and invalid saved values still allow live system theming', () => {
  for (const options of [{ blocked: true }, { saved: 'invalid' }, { legacy: true }]) {
    const p = page(options);
    assert.equal(p.control.value, 'system');
    p.system(true);
    assert.equal(p.root.dataset.theme, 'dark');
    p.select('light');
    assert.equal(p.root.dataset.theme, 'light');
    p.select('system'); p.system(false);
    assert.equal(p.root.dataset.theme, 'light');
  }
});

test('other tabs and back/forward restoration synchronize the preference', () => {
  const p = page();
  p.storage('dark');
  assert.equal(p.control.value, 'dark');
  assert.equal(p.root.dataset.theme, 'dark');
  p.storage(null);
  assert.equal(p.control.value, 'system');
  p.system(true);
  assert.equal(p.root.dataset.theme, 'dark');
  p.storage('light', 'unrelated');
  assert.equal(p.root.dataset.theme, 'dark');
  p.storage(null, null);
  assert.equal(p.control.value, 'system');
  p.restore('light', true);
  assert.equal(p.root.dataset.theme, 'light');
  p.restore(null, false);
  assert.equal(p.control.value, 'system');
  assert.equal(p.root.dataset.theme, 'light');
});
