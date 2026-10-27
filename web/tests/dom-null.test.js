// Regressione: Element.append(null) scrive il testo letterale "null".
// Gli helper DOM devono scartare i figli assenti (null, undefined, false).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as domUi from '../js/ui/dom.js';
import * as domModuli from '../modules/dom.js';
import { createTodayView } from '../js/ui/today.js';

// Element finto che si comporta come il DOM reale: i non-nodi diventano testo.
class Element {
  constructor(tag, doc) { this.tag = tag; this.ownerDocument = doc; this.nodeType = 1; this.children = []; this.attrs = {}; this.listeners = {}; }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(t, l) { this.listeners[t] = l; }
  append(...c) { this.children.push(...c.map((x) => (x?.nodeType ? x : String(x)))); }
  replaceChildren(...c) { this.children = []; this.append(...c); }
  querySelector() { return null; }
  // Spazio tra i nodi: così 'null' resta una parola anche fra due paragrafi.
  get textContent() { return this.children.map((c) => (typeof c === 'string' ? c : c.textContent)).join(' '); }
}
const conDocumento = (fn) => {
  const prev = globalThis.document;
  const doc = { createElement(tag) { return new Element(tag, this); } };
  globalThis.document = doc;
  try { return fn(doc); } finally { globalThis.document = prev; }
};
const SPORCO = /\b(null|undefined|NaN)\b/;

for (const [nome, dom] of [['js/ui/dom.js', domUi], ['modules/dom.js', domModuli]]) {
  test(`${nome}: append, fill e h ignorano null, undefined e false`, () => conDocumento((doc) => {
    const root = new Element('div', doc);
    dom.append(root, 'a', null, undefined, false, [null, ['b', null]], 0);
    assert.deepEqual(root.children, ['a', 'b', '0']);
    dom.fill(root, null, dom.h('p', {}, null, 'c', false));
    assert.equal(root.children.length, 1);
    assert.equal(root.textContent.trim(), 'c');
  }));
}

test('today: con localStorage vuoto la sessione di oggi non mostra null/undefined/NaN', () => conDocumento((doc) => {
  const root = new Element('section', doc);
  const storage = { getItem: () => null, setItem() {}, removeItem() {} };
  const graph = { order: ['a'], nodi: [{ id: 'a', title: 'A', area: 1, gruppo: 'A', tempo_studio_min: 30, prerequisiti: [] }] };
  createTodayView(root, graph, { storage, carte: [], onOpen() {}, onChange() {}, now: () => new Date('2026-10-27T10:00:00') })
    .render({ mastery: new Map(), statiStudio: {} });
  assert.match(root.textContent, /Sessione di oggi/);
  assert.doesNotMatch(root.textContent, SPORCO);
}));

// Igiene: le viste non chiamano Element.append direttamente sul contenitore,
// così un figlio condizionale (cond ? nodo : null) non può diventare testo.
const file = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? file(p) : p.endsWith('.js') ? [p] : [];
});
test('viste: niente clear(x).append( né root/container.append( diretti', () => {
  const base = new URL('..', import.meta.url).pathname;
  const viste = [...file(join(base, 'js/ui')), ...file(join(base, 'modules'))];
  const vietato = /clear\([^)]*\)\.append\(|\b(root|container)\.append\(/;
  const colpevoli = viste.filter((p) => vietato.test(readFileSync(p, 'utf8')));
  assert.deepEqual(colpevoli, []);
});
