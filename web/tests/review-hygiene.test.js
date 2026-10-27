import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interleaving, codaStudio, costruisciMazzo } from '../modules/ripasso/mazzo.js';
import { previsioneSettimana, carteSanguisuga } from '../modules/ripasso/statistiche.js';
import { azzeraNodiAttivi, giorniContabili, statoVuoto, conRevisione, nuoveDisponibili, normalizzaDati } from '../modules/ripasso/store.js';
import { createSetStore, memoryStorage } from '../js/core/store.js';
import { azzeraChecklistAttive } from '../js/ui/review.js';
import { applicaVoto } from '../modules/ripasso/sm2.js';
const oggi = '2026-10-27';
const card = (id, area, nodoId = id, priorita = 'alta') => ({ id, area, nodoId, priorita, tipo: 'domanda', indice: 0 });

test('interleaving deterministico di aree e nodi, senza spostare le scadute più vecchie', () => {
  const cs = [card('a1', 1, 'a'), card('a2', 1, 'a'), card('b1', 2, 'b'), card('b2', 2, 'b')];
  assert.deepEqual(interleaving(cs).map((c) => c.id), ['a1', 'b1', 'a2', 'b2']);
  const st = { a1: { revisioni: 1, scadenza: '2026-10-25' }, b1: { revisioni: 1, scadenza: '2026-10-26' } };
  assert.deepEqual(codaStudio(cs, st, oggi, { maxNuove: 1 }).map((c) => c.id), ['a1', 'b1', 'a2']);
  assert.deepEqual(codaStudio(cs, st, oggi, { maxNuove: 0 }).map((c) => c.id), ['a1', 'b1']);
});

test('le checklist hanno un retro specifico e non inventato', () => {
  const [a, b] = costruisciMazzo([{ id: 'n', area: 1, title: 'N', sapere: 'Generico', checklist_ripasso: ['Una prima verifica precisa', 'Una seconda verifica diversa'] }]);
  assert.equal(a.risposta, 'Una prima verifica precisa');
  assert.equal(b.risposta, 'Una seconda verifica diversa');
  assert.notEqual(a.risposta, b.risposta);
  assert.notEqual(a.domanda, a.risposta);
});

test('tetto giornaliero resiste a ripetizioni, migrazione e giorni successivi', () => {
  let s = { ...statoVuoto(), limiteNuove: 1 };
  s = conRevisione(s, 'a', applicaVoto(null, 'ancora', oggi), oggi);
  assert.equal(nuoveDisponibili(s, oggi), 0);
  s = conRevisione(s, 'a', applicaVoto(s.carte.a, 'bene', oggi), oggi);
  assert.equal(s.nuovePerGiorno[oggi].length, 1);
  assert.equal(nuoveDisponibili(s, '2026-10-28'), 1);
  assert.equal(normalizzaDati({ versione: 1, carte: {}, giorni: [], filtri: {} }).limiteNuove, 20);
});

test('quote e reset riguardano solo i nodi attivi, conservando la cronologia nascosta', () => {
  let dati = { ...statoVuoto(), limiteNuove: 2 };
  dati = conRevisione(dati, 'web#domanda-0', applicaVoto(null, 'bene', oggi), oggi);
  dati = conRevisione(dati, 'ia-base#domanda-0', applicaVoto(null, 'bene', oggi), oggi);
  const originali = structuredClone(dati);
  const mazzoTW = [card('web#domanda-0', 1, 'web'), card('web#domanda-1', 1, 'web')];
  assert.equal(nuoveDisponibili(dati, oggi, mazzoTW), 1);
  assert.equal(nuoveDisponibili(dati, oggi), 0);
  assert.equal(giorniContabili(dati, new Set(['ia-base'])), null);
  assert.equal(giorniContabili(dati, new Set()), 1);
  const reset = azzeraNodiAttivi(dati, [{ id: 'web' }]);
  assert.deepEqual(Object.keys(reset.carte), ['ia-base#domanda-0']);
  assert.deepEqual(reset.nuovePerGiorno[oggi], ['ia-base#domanda-0']);
  assert.deepEqual(reset.giorni, [oggi]);
  assert.deepEqual(dati, originali);
});

test('reset checklist conserva nodi e trappole inattivi usando gli indici originali', () => {
  const storage = memoryStorage();
  const store = createSetStore(storage, 'review');
  for (const key of ['web#0', 'ia-base#0', 'trappola#0', 'trappola#1', 'trappola#2']) store.toggle(key, true);
  azzeraChecklistAttive(store, { nodi: [{ id: 'web' }], trappole: [{ indiceRipassoOriginale: 0 }, { indiceRipassoOriginale: 2 }] });
  assert.deepEqual([...store.values()].sort(), ['ia-base#0', 'trappola#1']);
  assert.deepEqual([...createSetStore(storage, 'review').values()].sort(), ['ia-base#0', 'trappola#1']);
});

test('previsione include arretrati, esclude nuove e mostra le sanguisughe', () => {
  const cards = [card('a', 1), card('b', 2), card('c', 1), card('d', 2)];
  const stati = { a: { revisioni: 1, scadenza: '2026-10-01', errori: 3 }, b: { revisioni: 1, scadenza: '2026-10-30', errori: 4 }, c: { revisioni: 1, scadenza: '2026-11-03' } };
  const previsioni = previsioneSettimana(cards, stati, oggi);
  assert.equal(previsioni.length, 7);
  assert.deepEqual(previsioni.map((g) => g.dovute), [1, 0, 0, 1, 0, 0, 0]);
  assert.deepEqual(carteSanguisuga(cards, stati).map((c) => c.id), ['b', 'a']);
});

test('flashcard multiple mantengono l’id storico della prima carta', () => {
  const deck = costruisciMazzo([{ id: 'ia', area: 7, title: 'IA', gruppo: 'A',
    lezione: { flashcard: [{ fronte: 'F1', retro: 'R1' }, { fronte: 'F2', retro: 'R2' }] } }]);
  assert.deepEqual(deck.map((c) => c.id), ['ia#flashcard', 'ia#flashcard-1']);
  assert.deepEqual(deck.map((c) => c.risposta), ['R1', 'R2']);
});
