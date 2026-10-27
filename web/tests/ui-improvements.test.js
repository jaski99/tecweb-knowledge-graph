import { test } from 'node:test';
import assert from 'node:assert/strict';
import { opzioniStato } from '../js/ui/study-status.js';
import { legendaAttiva } from '../js/ui/graph-legend.js';
import { descriviRitmo } from '../js/ui/today.js';
import { scaricaFile } from '../js/ui/download.js';
import { createBackupView } from '../js/ui/backup-view.js';
import { emptyFilters } from '../js/core/filters.js';

test('study-status: opzioni testuali, selezione e default', () => {
  const opzioni = opzioniStato('so-gia');
  assert.equal(opzioni.find((o) => o.selected).label, 'So già (salto per ora)');
  assert.equal(opzioniStato(null).find((o) => o.selected).value, 'non-iniziato');
});
test('graph-legend: lo stato dei pulsanti riflette i filtri condivisi', () => {
  const f = emptyFilters(); f.aree.add(7); f.tipi.add('abilita'); f.soloNonPadroneggiati = true;
  assert.equal(legendaAttiva('aree', '7', f, new Set()), true);
  assert.equal(legendaAttiva('tipi', 'concetto', f, new Set()), false);
  assert.equal(legendaAttiva('soloNonPadroneggiati', 'true', f, new Set()), true);
  assert.equal(legendaAttiva('forze', 'soft', f, new Set(['soft'])), true);
});
test('today: messaggi distinti per data assente, scaduta e ritmo indicativo', () => {
  assert.match(descriviRitmo({ giorni: null }), /Inserisci/);
  assert.match(descriviRitmo({ giorni: 0 }), /oggi/);
  assert.match(descriviRitmo({ giorni: 3, minResidui: 90, ritmo: 30 }), /1 h 30 min.*30 min al giorno/);
});
test('download: file locale con nome e rimozione del link', () => {
  const anchor = { click() { this.clicked = true; }, remove() { this.removed = true; } };
  const doc = { createElement: () => anchor, body: { append(el) { assert.equal(el, anchor); } } };
  scaricaFile(doc, 'prova.json', '{}', 'application/json');
  assert.equal(anchor.download, 'prova.json'); assert.equal(anchor.clicked, true); assert.equal(anchor.removed, true);
});


test('backup-view: file invalido non chiede conferma; file valido viene importato solo con consenso', async () => {
  const previousDocument = globalThis.document;
  class Element {
    constructor(tag, doc) { this.tag = tag; this.ownerDocument = doc; this.nodeType = 1; this.children = []; this.attrs = {}; this.listeners = {}; }
    setAttribute(key, value) { this.attrs[key] = value; }
    addEventListener(type, listener) { this.listeners[type] = listener; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
  }
  const doc = { createElement(tag) { return new Element(tag, this); } };
  globalThis.document = doc;
  try {
    const root = new Element('details', doc), data = new Map();
    const storage = { get length() { return data.size; }, key: (i) => [...data.keys()][i],
      getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
    let confirmations = 0, reloads = 0, allow = false;
    createBackupView(root, { storage, getEsitiReader: () => null,
      confirm: () => { confirmations++; return allow; }, reload: () => { reloads++; } });
    const find = (node, id) => node.attrs.id === id ? node : node.children.filter((c) => c?.nodeType).map((c) => find(c, id)).find(Boolean);
    const upload = (text) => find(root, 'backup-import').listeners.change({ target: { files: [{ text: async () => text }], value: 'file' } });
    await upload('{');
    assert.match(root.children.find((c) => c?.attrs?.role === 'status').children.join(''), /JSON non valido/);
    assert.equal(confirmations, 0);
    const valid = JSON.stringify({ formato: 'tecweb-knowledge-graph', versione: 1, dati: { 'ids-kg:tema:v1': 'dark' } });
    await upload(valid);
    assert.equal(confirmations, 1); assert.equal(data.size, 0); assert.equal(reloads, 0);
    allow = true;
    await upload(valid);
    assert.equal(data.get('ids-kg:tema:v1'), 'dark'); assert.equal(reloads, 1);
  } finally { globalThis.document = previousDocument; }
});
