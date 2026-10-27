import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSetStore, memoryStorage } from '../js/core/store.js';
import { createStudyStore, prerequisitiSoddisfatti } from '../js/core/study-state.js';

test('migrazione dei completati, salvataggio e conservazione del prefisso', () => {
  const storage = memoryStorage();
  storage.setItem('ids-kg:completati:v1', JSON.stringify(['a']));
  const old = createSetStore(storage, 'ids-kg:completati:v1');
  const store = createStudyStore(storage, 'ids-kg:stati-studio:v1', old);
  assert.equal(store.values().a, 'completato');
  store.set('b', 'in-corso'); store.set('c', 'so-gia');
  assert.deepEqual([...old.values()], ['a']);
  store.set('a', 'so-gia');
  assert.equal(old.has('a'), false);
  assert.deepEqual(createStudyStore(storage, 'ids-kg:stati-studio:v1', old).values(), { a: 'so-gia', b: 'in-corso', c: 'so-gia' });
  assert.throws(() => store.set('b', 'inventato'));
});

test('i prerequisiti sono morbidi e anche so già è considerato soddisfatto', () => {
  const n = { prerequisiti: [{ id: 'a', forza: 'hard' }, { id: 'b', forza: 'soft' }] };
  assert.equal(prerequisitiSoddisfatti(n, {}), false);
  assert.equal(prerequisitiSoddisfatti(n, { a: 'so-gia' }), true);
  assert.equal(prerequisitiSoddisfatti(n, { a: 'completato' }), true);
});

test('migrazione robusta anche per un id valido uguale a una proprietà del prototipo', () => {
  const storage = memoryStorage();
  storage.setItem('ids-kg:completati:v1', '["constructor"]');
  const done = createSetStore(storage, 'ids-kg:completati:v1');
  const study = createStudyStore(storage, 'ids-kg:stati-studio:v1', done);
  assert.equal(study.values().constructor, 'completato');
});
