import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeProgress, formatMinuti, masteryProgress } from '../js/core/progress.js';
import { nodi, aree } from './fixture.js';

test('progresso per area e totale con tempo residuo', () => {
  const p = computeProgress(nodi(), aree, new Set(['a', 'b']));
  assert.equal(p.totale.fatti, 2); assert.equal(p.totale.totale, 4);
  assert.equal(p.totale.perc, 50); assert.equal(p.totale.minTotali, 150); assert.equal(p.totale.minResidui, 60);
  assert.deepEqual(p.aree.map((a) => [a.area.id, a.fatti, a.totale, a.minResidui]), [[1, 1, 2, 30], [2, 1, 2, 30]]);
});
test('nessun nodo: 0%', () => assert.equal(computeProgress([], aree, new Set()).totale.perc, 0));
test('formato minuti', () => {
  assert.equal(formatMinuti(45), '45 min'); assert.equal(formatMinuti(60), '1 h'); assert.equal(formatMinuti(135), '2 h 15 min');
});

test('padronanza gruppo A: calcolo senza un numero fisso di nodi', () => {
  const ns = [{ id: 'a', gruppo: 'A' }, { id: 'b', gruppo: 'A' }, { id: 'c', gruppo: 'B' }];
  assert.deepEqual(masteryProgress(ns, new Map([['a', 'padroneggiato']])), { totale: 2, padroneggiati: 1, percentuale: 50 });
  assert.equal(masteryProgress([], new Map()).percentuale, 0);
});
