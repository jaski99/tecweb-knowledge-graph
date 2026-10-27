import { test } from 'node:test';
import assert from 'node:assert/strict';
import { interleaving, codaStudio, costruisciMazzo } from '../modules/ripasso/mazzo.js';
import { previsioneSettimana, carteSanguisuga } from '../modules/ripasso/statistiche.js';
import { statoVuoto, conRevisione, nuoveDisponibili, normalizzaDati } from '../modules/ripasso/store.js';
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
