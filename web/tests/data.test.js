import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateGraph } from '../js/core/validate.js';
import { prepare, loadGraph } from '../js/data.js';
import { createSetStore, memoryStorage } from '../js/core/store.js';
import { createState } from '../js/core/state.js';
import { graph } from './fixture.js';
import { readFileSync } from 'node:fs';

test('fixture valida, prepare calcola ordine e indice', () => {
  assert.deepEqual(validateGraph(graph()), []);
  const g = prepare(graph());
  assert.equal(g.byId.get('d').area, 2); assert.equal(g.order[0], 'b');
});
test('errori: versione, duplicati, area, prerequisito', () => {
  const g = graph(); g.versione = 1; g.nodi.push({ ...g.nodi[0] }); g.nodi[1].area = 9; g.nodi[2].prerequisiti = [{ id: 'x', forza: 'hard' }];
  const e = validateGraph(g).join('\n');
  for (const re of [/versione/, /duplicato/, /area 9/, /inesistente x/]) assert.match(e, re);
});
test('graph.json reale del repo è valido', () => {
  const g = JSON.parse(readFileSync(new URL('../../graph/graph.json', import.meta.url)));
  assert.deepEqual(validateGraph(g), []);
});
test('loadGraph prova gli URL in ordine', async () => {
  const fake = async (u) => (u === 'ok.json' ? { ok: true, json: async () => graph() } : { ok: false, status: 404 });
  const g = await loadGraph(['no.json', 'ok.json'], fake);
  assert.equal(g.nodi.length, 4);
  await assert.rejects(loadGraph(['no.json'], fake), /404/);
});
test('loadGraph legge quiz opzionale e continua quando quiz.json manca', async () => {
  const fake = async (url) => url === 'graph.json'
    ? { ok: true, json: async () => graph() }
    : { ok: false, status: 404 };
  const withoutQuiz = await loadGraph(['graph.json'], fake, ['quiz.json']);
  assert.equal(withoutQuiz.nodi.length, 4);
  const withQuiz = await loadGraph(['graph.json'], async (url) => url === 'graph.json'
    ? { ok: true, json: async () => graph() }
    : { ok: true, json: async () => ({ domande: [{ domanda: 'Q', risposta: 'A' }] }) }, ['quiz.json']);
  assert.equal(withQuiz.quiz.domande[0].risposta, 'A');
});
test('prepare accetta lo schema v4', () => {
  const g = graph(); g.versione = 4;
  assert.deepEqual(validateGraph(g), []);
  assert.equal(prepare(g).versione, 4);
});
test('store persistente su storage iniettato', () => {
  const st = memoryStorage();
  const s = createSetStore(st, 'k'); s.toggle('a'); s.toggle('b', true); s.toggle('a');
  assert.deepEqual([...createSetStore(st, 'k').values()], ['b']);
  st.setItem('k', 'rotto{'); assert.equal(createSetStore(st, 'k').values().size, 0);
});
test('state pub/sub', () => {
  const s = createState({ x: 1 }); let seen; s.subscribe((v) => (seen = v.x)); s.set({ x: 2 });
  assert.equal(seen, 2); assert.equal(s.get().x, 2);
});

test('banca quiz lenta non blocca il caricamento del grafo né delle lezioni', async () => {
  let risolviQuiz;
  const fetchFn = (url) => url === 'graph.json' ? Promise.resolve({ ok: true, json: async () => graph() })
    : new Promise((resolve) => { risolviQuiz = resolve; });
  const g = await loadGraph(['graph.json'], fetchFn, ['quiz.json'], { deferQuiz: true });
  assert.equal(g.nodi.length, 4);
  assert.equal(g.quiz, undefined);
  risolviQuiz({ ok: true, json: async () => ({ elementi: [{ id: 'q' }] }) });
  await g.quizPronto;
  assert.equal(g.quiz.elementi[0].id, 'q');
});
