import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogoEsercizi, generaProva, DURATA_ESAME_MS } from '../modules/simulatore/genera.js';
import { etichettaEsito, riepilogoRisposte } from '../modules/simulatore/punteggio.js';
import { formatTempo, leggiTimer, timerInCorso, timerInPausa, timerNuovo } from '../modules/simulatore/timer.js';
import {
  CHIAVE_STORAGE, consegna, creaSessione, leggiRisposta, leggiSessione, mettiInPausa,
  riprendi, salvaSessione, sessioneInCorsoValida, scriviRisposta,
} from '../modules/simulatore/sessione.js';

const nodi = [{ id: 'http-base', title: 'HTTP', area: 1, esercizi: [
  { tipo_esame: 'Domanda aperta', testo: 'Spiega il metodo GET.', soluzione: 'GET recupera una rappresentazione.' },
] }];
const storageFinto = () => {
  const dati = new Map();
  return { getItem: (k) => dati.get(k) ?? null, setItem: (k, v) => dati.set(k, String(v)), removeItem: (k) => dati.delete(k) };
};

test('il catalogo usa solo esercizi completi e tollera formati quiz noti', () => {
  const catalogo = catalogoEsercizi(nodi, { quiz: [{ domanda: 'Cos’è HTTP?', risposta: 'Un protocollo.' }, { domanda: 'senza risposta' }] });
  const alternate = catalogoEsercizi([], { questions: [{ prompt: 'Domanda?', options: ['A', 'B'], correct_answer: 1 }] });
  assert.equal(alternate[0].soluzione, 'B');
  assert.equal(catalogo.length, 2);
  assert.equal(catalogo[0].nodoId, 'http-base');
  assert.equal(catalogo[1].tipoEsame, 'Quiz');
});

test('la prova è riproducibile e dura due ore senza introdurre punteggi', () => {
  const a = generaProva(nodi, { seed: 3, now: 100 });
  const b = generaProva(nodi, { seed: 3, now: 100 });
  assert.deepEqual(a, b);
  assert.equal(a.durataMs, 120 * 60 * 1000);
  assert.equal(a.durataMs, DURATA_ESAME_MS);
  assert.equal(a.esercizi[0].testo, nodi[0].esercizi[0].testo);
  assert.equal('puntiTotali' in a, false);
});

test('riepilogo delle risposte è descrittivo e non assegna voti', () => {
  const esercizi = [{ id: 'a' }, { id: 'b' }];
  const summary = riepilogoRisposte(esercizi, { a: 'Risposta' });
  assert.deepEqual(summary, { totale: 2, compilate: 1, mancanti: 1, percentuale: 50 });
  assert.match(etichettaEsito(summary), /non viene calcolato un voto/i);
});

test('timer: pausa, ripresa, scadenza e durata esatta', () => {
  let timer = timerNuovo(0);
  assert.equal(formatTempo(leggiTimer(timer, 0).rimanenti), '02:00:00');
  timer = timerInPausa(timer, 1500);
  assert.equal(leggiTimer(timer, 50_000).trascorsoMs, 1500);
  timer = timerInCorso(timer, 50_000);
  assert.equal(leggiTimer(timer, 51_000).trascorsoMs, 2500);
  assert.equal(formatTempo(0), '00:00:00');
  assert.equal(leggiTimer(timerNuovo(0, 1000), 1000).scaduto, true);
});

test('sessione: scrittura, persistenza, ripresa e consegna', () => {
  const storage = storageFinto();
  let session = creaSessione(generaProva(nodi, { seed: 2, now: 100 }), 100);
  session = scriviRisposta(session, session.prova.esercizi[0].id, 'La risposta dello studente');
  assert.equal(salvaSessione(storage, session), true);
  assert.equal(CHIAVE_STORAGE, 'tecweb:simulatore:v1');
  const loaded = leggiSessione(storage);
  assert.equal(leggiRisposta(loaded, session.prova.esercizi[0].id), 'La risposta dello studente');
  assert.equal(sessioneInCorsoValida(loaded, 101), true);
  session = mettiInPausa(loaded, 200);
  session = riprendi(session, 500);
  assert.equal(leggiTimer(session.timer, 1500).trascorsoMs, 1100);
  assert.equal(consegna(session, 1600).fase, 'consegnata');
  storage.setItem(CHIAVE_STORAGE, '{');
  assert.equal(leggiSessione(storage), null);
});
