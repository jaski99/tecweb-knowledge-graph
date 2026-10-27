import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AREA_IA, CHIAVE_MODULO_IA, filtraNodiAttivi, isModuloIAAttivo, setModuloIA } from '../js/core/modulo-ia.js';
import { memoryStorage } from '../js/core/store.js';

test('modulo spento per default e per ogni valore diverso da 1', () => {
  const storage = memoryStorage();
  assert.equal(isModuloIAAttivo(storage), false);
  for (const valore of ['0', 'true', '', '2']) {
    storage.setItem(CHIAVE_MODULO_IA, valore);
    assert.equal(isModuloIAAttivo(storage), false);
  }
  assert.equal(CHIAVE_MODULO_IA, 'tecweb.moduloIA');
  assert.equal(AREA_IA, 7);
});

test('filtro non mutante e preferenza persistente dopo attivazione e disattivazione', () => {
  const storage = memoryStorage();
  const nodi = [{ id: 'web', area: 1 }, { id: 'ia-base', area: 7 }, { id: 'web-altro', area: 6 }];
  const iniziali = structuredClone(nodi);
  assert.deepEqual(filtraNodiAttivi(nodi, storage).map((n) => n.id), ['web', 'web-altro']);
  assert.deepEqual(nodi, iniziali);
  assert.equal(setModuloIA(true, storage), true);
  assert.equal(storage.getItem(CHIAVE_MODULO_IA), '1');
  assert.equal(isModuloIAAttivo(storage), true);
  assert.deepEqual(filtraNodiAttivi(nodi, storage), nodi);
  assert.notEqual(filtraNodiAttivi(nodi, storage), nodi);
  assert.equal(setModuloIA(false, storage), true);
  assert.equal(storage.getItem(CHIAVE_MODULO_IA), '0');
  assert.equal(isModuloIAAttivo(storage), false);
  assert.deepEqual(nodi, iniziali);
  assert.throws(() => setModuloIA('1', storage), TypeError);
});

test('storage indisponibile: spento e nessuna falsa conferma del salvataggio', () => {
  const negato = { getItem() { throw Error('privacy'); }, setItem() { throw Error('quota'); } };
  assert.equal(isModuloIAAttivo(negato), false);
  assert.equal(setModuloIA(true, negato), false);
  assert.equal(setModuloIA(true, null), false);
  assert.deepEqual(filtraNodiAttivi([{ area: 1 }, { area: 7 }], negato), [{ area: 1 }]);
});
