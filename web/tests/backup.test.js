import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creaBackup, validaBackup, importaBackup, mazzoAnkiTSV } from '../js/core/backup.js';
function memory(init = {}) {
  const m = new Map(Object.entries(init));
  return { get length() { return m.size; }, key: (i) => [...m.keys()][i], getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), m };
}
const quiz = [{ item_id: 'q1', nodo_id: 'node-1', corretto: true, modalita: 'allenamento', ts: '2026-01-01T00:00:00Z' }];
const leggiEsiti = (s) => JSON.parse(s.getItem('ids-kg:esiti-quiz:v1'));

test('backup completo e round trip, inclusi prefissi storici e reader X6', () => {
  const s = memory({ 'ids-kg:completati:v1': '["node-1"]', 'ids.ripasso.v1': JSON.stringify({ versione: 1, carte: {}, giorni: [], filtri: { area: null, priorita: null } }),
    'tecweb:simulatore:v1': '{"versione":1}', 'ids-kg:esiti-quiz:v1': JSON.stringify(quiz), 'other': 'no' });
  const b = creaBackup(s, leggiEsiti);
  assert.equal(Object.keys(b.dati).length, 4);
  const t = memory({ 'other': 'intatto' });
  assert.equal(importaBackup(t, JSON.stringify(b)), 4);
  assert.equal(t.getItem('ids-kg:esiti-quiz:v1'), JSON.stringify(quiz));
  assert.equal(t.getItem('other'), 'intatto');
  assert.throws(() => creaBackup(s), /lettore degli esiti/);
});

test('validazione totale prima della scrittura e ripristino su errore di quota', () => {
  const s = memory({ 'ids-kg:tema:v1': 'light' });
  const b = { formato: 'tecweb-knowledge-graph', versione: 1, dati: { 'ids-kg:tema:v1': 'dark', 'ids-kg:data-esame:v1': '2026-02-30' } };
  assert.throws(() => importaBackup(s, b), /non valido/);
  assert.equal(s.getItem('ids-kg:tema:v1'), 'light');
  assert.throws(() => validaBackup('{'), /JSON non valido/);
  assert.throws(() => validaBackup({ ...b, dati: { 'foreign': 'x' } }), /non valido/);
  const original = s.setItem;
  s.setItem = (k, v) => { if (k === 'ids-kg:data-esame:v1') throw Error('quota'); original(k, v); };
  b.dati['ids-kg:data-esame:v1'] = '2026-02-28';
  assert.throws(() => importaBackup(s, b), /ripristinati/);
  assert.equal(s.getItem('ids-kg:tema:v1'), 'light');
});

test('TSV Anki: tre campi senza tabulazioni o a capo interni e tag', () => {
  const tsv = mazzoAnkiTSV([{ domanda: 'D\tuno', risposta: 'R\ndue', area: 7, nodoId: 'ia-base', gruppo: 'A' }]);
  assert.match(tsv, /#separator:tab/);
  assert.equal(tsv.trim().split('\n').at(-1), 'D uno\tR due\tarea_7 nodo_ia-base gruppo_A');
});

test('lettura degli esiti per esportazione e rollback solo tramite lettore X6', () => {
  const s = memory({ 'ids-kg:esiti-quiz:v1': JSON.stringify(quiz) });
  const get = s.getItem;
  s.getItem = (key) => { if (key === 'ids-kg:esiti-quiz:v1') throw Error('lettura diretta vietata'); return get(key); };
  const read = () => quiz;
  const b = creaBackup(s, read);
  assert.equal(importaBackup(s, b, read), 1);
  assert.throws(() => importaBackup(s, b), /lettore degli esiti/);
});
