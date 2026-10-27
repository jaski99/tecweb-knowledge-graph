import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vicinoDaTastiera, nodiLocali } from '../js/core/graph-navigation.js';
import { nodi } from './fixture.js';
const ns = nodi(), order = ['a', 'b', 'c', 'd'];
test('frecce seguono gli archi rispettando i filtri', () => {
  assert.equal(vicinoDaTastiera(ns, order, null, 'ArrowDown'), 'a');
  assert.equal(vicinoDaTastiera(ns, order, 'a', 'ArrowDown'), 'c');
  assert.equal(vicinoDaTastiera(ns, order, 'd', 'ArrowUp'), 'c');
  assert.equal(vicinoDaTastiera(ns, order, 'd', 'ArrowUp', new Set(['a', 'b', 'd'])), 'b');
  assert.equal(vicinoDaTastiera(ns, order, 'a', 'ArrowUp'), 'a');
});
test('intorno per profondità e sola catena dei prerequisiti', () => {
  assert.deepEqual([...nodiLocali(ns, 'c', 1)].sort(), ['a', 'c', 'd']);
  assert.deepEqual([...nodiLocali(ns, 'd', 'tutto', true)].sort(), ['a', 'b', 'c', 'd']);
  assert.deepEqual([...nodiLocali(ns, 'a', 'tutto', true)], ['a']);
});
