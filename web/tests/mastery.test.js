import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcolaPadronanza, padronanzaNodi, LIVELLI } from '../js/core/mastery.js';
import { caricaLettoreEsiti } from '../js/core/esiti-reader.js';

const carta = (id) => ({ id, nodoId: 'n' });
const esito = (item, corretto, ts, nodo_id = 'n') => ({ item_id: item, nodo_id, corretto, modalita: 'allenamento', ts });
const ok = (ripetizioni = 2) => ({ revisioni: 2, ripetizioni, ultimoVoto: 'bene' });

test('padronanza: segnali manuali deboli e carte SM-2', () => {
  assert.equal(calcolaPadronanza({ nodoId: 'n' }), 'non-iniziato');
  assert.equal(calcolaPadronanza({ nodoId: 'n', completato: true }), 'visto');
  assert.equal(calcolaPadronanza({ nodoId: 'n', checklist: true }), 'visto');
  const dati = { nodoId: 'n', carte: [carta('a'), carta('b')], statiCarte: { a: ok(1), b: ok(1) } };
  assert.equal(calcolaPadronanza(dati), 'familiare');
  assert.equal(calcolaPadronanza({ ...dati, statiCarte: { a: ok(), b: ok() } }), 'sicuro');
  assert.equal(calcolaPadronanza({ ...dati, statiCarte: { a: { ...ok(), ultimoVoto: 'ancora' } } }), 'visto');
  assert.equal(Object.keys(LIVELLI).length, 5);
});

test('padronanza: quesiti distinti, giorni diversi, copertura delle carte e regressione', () => {
  const esiti = [esito('a', true, '2026-01-01T10:00:00Z'), esito('b', true, '2026-01-01T11:00:00Z'), esito('c', true, '2026-01-02T11:00:00Z')];
  const dati = { nodoId: 'n', carte: [carta('a'), carta('b')], statiCarte: { a: ok(), b: ok() }, esiti };
  assert.equal(calcolaPadronanza(dati), 'padroneggiato');
  assert.equal(calcolaPadronanza({ ...dati, statiCarte: { a: ok() } }), 'sicuro');
  assert.equal(calcolaPadronanza({ ...dati, esiti: [...esiti, esito('d', false, '2026-01-03T11:00:00Z')] }), 'visto');
  assert.equal(calcolaPadronanza({ nodoId: 'n', esiti: [esito('a', true, 'no'), esito('a', true, '2026-01-01T00:00:00Z', 'altro')] }), 'non-iniziato');
  assert.equal(padronanzaNodi([{ id: 'n' }], { done: new Set(['n']) }).get('n'), 'visto');
});

test('adattatore esiti: assenza tollerata e doppio con contratto X6', async () => {
  let chiamato = false;
  assert.equal(await caricaLettoreEsiti(false, () => { chiamato = true; }), null);
  assert.equal(chiamato, false);
  const storage = { getItem: (k) => k === 'ids-kg:esiti-quiz:v1' ? JSON.stringify([esito('a', true, '2026-01-01T00:00:00Z')]) : null };
  const doppio = { leggiEsiti: (s) => JSON.parse(s.getItem('ids-kg:esiti-quiz:v1') || '[]') };
  const leggiEsiti = await caricaLettoreEsiti(true, async () => doppio);
  assert.deepEqual(leggiEsiti(storage), [esito('a', true, '2026-01-01T00:00:00Z')]);
  assert.equal(await caricaLettoreEsiti(true, async () => { throw Error('non disponibile'); }), null);
});
