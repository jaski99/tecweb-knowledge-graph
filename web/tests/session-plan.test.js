import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pianoOggi } from '../js/core/session-plan.js';
import { statoVuoto } from '../modules/ripasso/store.js';
const nodi = [
  { id: 'a', title: 'A', area: 1, gruppo: 'A', tempo_studio_min: 60, prerequisiti: [] },
  { id: 'b', title: 'B', area: 2, gruppo: 'A', tempo_studio_min: 60, prerequisiti: [{ id: 'a', forza: 'hard' }] },
  { id: 'c', title: 'C', area: 3, gruppo: 'B', tempo_studio_min: 30, prerequisiti: [] },
];
const carte = nodi.flatMap((n) => [0, 1].map((i) => ({ id: `${n.id}#${i}`, nodoId: n.id, nodoTitolo: n.title, area: n.area, priorita: 'alta', tipo: 'domanda', indice: i, domanda: '?', risposta: '!' })));
const base = { nodi, ordine: ['a', 'b', 'c'], carte, datiRipasso: statoVuoto(), oggi: '2026-10-27' };

test('sessione guidata: prerequisiti morbidi, data e tempi calcolati', () => {
  let p = pianoOggi({ ...base, statiStudio: { a: 'so-gia' }, dataEsame: '2026-10-29', budget: 25 });
  assert.equal(p.prossimo.id, 'b');
  assert.equal(p.minResidui, 90); assert.equal(p.ritmo, 45); assert.equal(p.avvisoA, true);
  assert.equal(p.nuove, 6);
  p = pianoOggi({ ...base, dataEsame: '2026-10-26' });
  assert.equal(p.giorni, -1); assert.equal(p.ritmo, null);
  assert.throws(() => pianoOggi({ ...base, oggi: 'oggi' }));
});

test('richiamo a spirale alterna aree e mai nodi adiacenti', () => {
  const p = pianoOggi({ ...base, budget: 90, statiStudio: { a: 'completato', b: 'completato', c: 'in-corso' } });
  assert.equal(p.spirale.length, 3);
  assert.equal(new Set(p.spirale.map((c) => c.nodoId)).size, 3);
  assert.deepEqual(p.spirale.map((c) => c.area), [1, 2, 3]);
});
