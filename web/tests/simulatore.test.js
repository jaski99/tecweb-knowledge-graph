import { CHIAVE_MODULO_IA, moduloIAAttivo, elementoIA, filtraPerModulo } from '../modules/simulatore/modulo-ia.js';
import { readFileSync } from 'node:fs';
import { correggi, esitiItem, reportAree, rispostaCompleta } from '../modules/simulatore/correzione.js';
import { CHIAVE_ESITI, leggiEsiti, registraEsito } from '../modules/simulatore/esiti.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogoEsercizi, generaProva, DURATA_ESAME_MS } from '../modules/simulatore/genera.js';
import { etichettaEsito, riepilogoRisposte } from '../modules/simulatore/punteggio.js';
import { formatTempo, leggiTimer, timerInCorso, timerInPausa, timerNuovo } from '../modules/simulatore/timer.js';
import {
  CHIAVE_STORAGE, consegna, creaSessione, leggiRisposta, leggiSessione, mettiInPausa,
  riprendi, salvaSessione, sessioneInCorsoValida, scriviRisposta, sessionePerModulo,
} from '../modules/simulatore/sessione.js';

const nodi = [{ id: 'http-base', title: 'HTTP', area: 1, esercizi: [
  { tipo_esame: 'Domanda aperta', testo: 'Spiega il metodo GET.', soluzione: 'GET recupera una rappresentazione.' },
] }];
const storageFinto = () => {
  const dati = new Map();
  return { getItem: (k) => dati.get(k) ?? null, setItem: (k, v) => dati.set(k, String(v)), removeItem: (k) => dati.delete(k) };
};

test('la prova è riproducibile con durata didattica predefinita, non ufficiale', () => {
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

const banca = JSON.parse(readFileSync(new URL('../../graph/quiz.json', import.meta.url)));
const graph = JSON.parse(readFileSync(new URL('../../graph/graph.json', import.meta.url)));
const tipo = (kind) => catalogoEsercizi([], banca).find((i) => i.tipo === kind);
const answer = (item) => item.tipo === 'abbinamento' ? Object.fromEntries(item.abbinamenti.map((p, i) => [i, p.risposta_id]))
  : item.tipo === 'completamento_codice' ? Object.fromEntries(Object.entries(item.soluzioni).map(([k, v]) => [k, v[0]])) : item.risposta_corretta;

test('adattatore sul file vero: nessun elemento o campo perso, comprese tutte le coppie', () => {
  const actual = catalogoEsercizi(graph.nodi, banca, { includiIA: true });
  const quizzes = actual.filter((i) => i.tipo !== 'aperta');
  assert.equal(quizzes.length, banca.elementi.length);
  for (const original of banca.elementi) {
    const adapted = quizzes.find((i) => i.id === original.id);
    for (const key of Object.keys(original)) assert.deepEqual(adapted[key], original[key]);
    assert.equal(adapted.nodoId, original.nodo_id);
    assert.ok(adapted.testo && adapted.soluzione);
  }
  assert.ok(actual.some((e) => e.tipo === 'aperta'));
  assert.deepEqual(catalogoEsercizi(null), []);
});

test('seed: stessa prova, opzioni diverse con altri seed, correttezza sempre per ID', () => {
  const opts = { seed: 12, now: 1, quiz: banca, quanti: 100, includiIA: true };
  const a = generaProva([], opts);
  assert.deepEqual(a, generaProva([], opts));
  const b = generaProva([], { ...opts, seed: 13 });
  assert.equal(a.esercizi.length, banca.elementi.length);
  assert.ok(a.esercizi.some((e) => e.opzioni && JSON.stringify(e.opzioni) !== JSON.stringify(b.esercizi.find((i) => i.id === e.id).opzioni)));
  for (const e of a.esercizi) {
    assert.equal(correggi(e, answer(e)), true, e.id);
    assert.equal(correggi(e, undefined), false);
  }
  assert.equal(new Set(a.esercizi.map((e) => e.id)).size, a.esercizi.length);
});

test('blueprint bilanciato per le aree effettive, durata configurabile e nessun voto', () => {
  const aree = new Set(catalogoEsercizi(graph.nodi, banca).map((e) => e.area));
  const quanti = aree.size * 2;
  const prova = generaProva(graph.nodi, { quiz: banca, seed: 9, quanti, durataMs: 90000 });
  assert.equal(prova.durataMs, 90000);
  const counts = new Map();
  prova.esercizi.forEach((e) => counts.set(e.area, (counts.get(e.area) || 0) + 1));
  assert.deepEqual(new Set(counts.keys()), aree);
  assert.ok([...counts.values()].every((count) => count === quanti / aree.size));
  const areeConBanca = new Set(banca.elementi.map((e) => e.area));
  assert.ok(prova.esercizi.every((e) => !areeConBanca.has(e.area) || e.tipo !== 'aperta'));
  assert.equal('voto' in prova, false);
  const extra = { ...banca.elementi[0], id: 'area-futura', area: Math.max(...aree) + 1 };
  const bancaFutura = { elementi: [...banca.elementi, extra] };
  const attese = new Set(filtraPerModulo(bancaFutura.elementi).map((e) => e.area));
  const futura = generaProva([], { quiz: bancaFutura, quanti: attese.size });
  assert.deepEqual(new Set(futura.esercizi.map((e) => e.area)), attese);
  assert.deepEqual(generaProva([], { quiz: null }).esercizi, []);
});

for (const numeroAree of [1, 3, 8]) test(`blueprint senza costanti: ${numeroAree} aree non consecutive`, () => {
  const elementi = Array.from({ length: numeroAree * 3 }, (_, i) => ({
    ...banca.elementi[0], id: `fixture-${i}`, area: 10 + (i % numeroAree) * 2,
  }));
  const prova = generaProva([], { quiz: { elementi }, quanti: numeroAree * 2, seed: 4 });
  const counts = new Map();
  prova.esercizi.forEach((e) => counts.set(e.area, (counts.get(e.area) || 0) + 1));
  assert.equal(counts.size, numeroAree);
  assert.ok([...counts.values()].every((n) => n === 2));
});

test('area senza banca: usa le aperte del grafo senza perderle o attribuire esiti automatici', () => {
  const aree = [...new Set(filtraPerModulo(graph.nodi).map((n) => n.area))];
  const areaSenzaQuiz = aree.at(-1);
  const quiz = { elementi: banca.elementi.filter((i) => i.area !== areaSenzaQuiz) };
  const prova = generaProva(graph.nodi, { quiz, quanti: aree.length * 2, seed: 9 });
  const aperte = prova.esercizi.filter((i) => i.area === areaSenzaQuiz);
  assert.ok(aperte.length > 0);
  for (const item of aperte) {
    assert.equal(item.tipo, 'aperta');
    assert.ok(item.id.includes('#'));
    assert.equal(correggi(item, item.soluzione), null);
    assert.deepEqual(esitiItem(item, item.soluzione, 'allenamento', new Date(0).toISOString()), []);
  }
});

test('abbinamenti: distrattori selezionabili, niente risposta corretta per posizione', () => {
  const prova = generaProva([], { quiz: banca, quanti: 100, seed: 12 });
  const e = prova.esercizi.find((i) => i.tipo === 'abbinamento');
  assert.equal(e.opzioni.length, e.abbinamenti.length + e.distrattori.length);
  const a = answer(e);
  a[0] = e.opzioni.find((o) => o.id.startsWith('distrattore-')).id;
  assert.equal(correggi(e, a), false);
});

test('vero/falso booleano e completamenti: varianti esplicite senza eseguire codice', () => {
  const tf = tipo('vero_falso');
  assert.equal(rispostaCompleta(tf, false), true);
  assert.equal(correggi(tf, false), true);
  assert.equal(correggi(tf, 'false'), false);
  const code = tipo('completamento_codice');
  assert.equal(correggi(code, { '1': ' GET ', '2': 'jsonify' }), true);
  assert.equal(correggi(code, { '1': 'get', '2': 'eval' }), false);
  assert.equal(correggi({ tipo: 'aperta' }, ''), null);
});

test('report per area distingue aperte e linka solo i nodi sbagliati', () => {
  const e = tipo('scelta_multipla');
  const aperta = { id: 'open', tipo: 'aperta', area: e.area, nodoId: e.nodoId };
  const rows = reportAree([e, aperta], {});
  assert.deepEqual(rows[0], { area: e.area, totale: 2, corretti: 0, aperte: 1, nodi: [e.nodoId] });
  assert.deepEqual(reportAree([e], { [e.id]: answer(e) })[0].nodi, []);
  const match = tipo('abbinamento');
  assert.equal(esitiItem(match, answer(match), 'simulazione', new Date(0).toISOString()).length, match.abbinamenti.length);
  assert.deepEqual(esitiItem(aperta, '', 'allenamento', new Date(0).toISOString()), []);
});

test('esiti: chiave esatta, campi contrattuali e limite 2000, senza mutare input', () => {
  const storage = storageFinto();
  const esito = { item_id: 'item', nodo_id: 'nodo', corretto: false, modalita: 'allenamento', ts: new Date(0).toISOString() };
  assert.equal(CHIAVE_ESITI, 'ids-kg:esiti-quiz:v1');
  storage.setItem(CHIAVE_ESITI, JSON.stringify(Array.from({ length: 2000 }, (_, i) => ({ ...esito, item_id: String(i) }))));
  assert.equal(registraEsito(storage, { ...esito, extra: true }), true);
  const result = leggiEsiti(storage);
  assert.equal(result.length, 2000);
  assert.equal(result[0].item_id, '1');
  assert.deepEqual(result.at(-1), esito);
  result.pop();
  assert.equal(leggiEsiti(storage).length, 2000);
});

test('esiti: JSON corrotto, record invalidi, storage negato, input non valido', () => {
  const storage = storageFinto();
  storage.setItem(CHIAVE_ESITI, '{');
  assert.deepEqual(leggiEsiti(storage), []);
  storage.setItem(CHIAVE_ESITI, JSON.stringify([null, {}, { item_id: 'a' }]));
  assert.deepEqual(leggiEsiti(storage), []);
  assert.equal(registraEsito(storage, {}), false);
  const broken = { getItem() { throw Error('denied'); }, setItem() { throw Error('quota'); } };
  assert.deepEqual(leggiEsiti(broken), []);
  assert.equal(registraEsito(broken, { item_id: 'i', nodo_id: 'n', corretto: true, modalita: 'simulazione', ts: new Date(0).toISOString() }), false);
});

test('sessione preserva oggetti di abbinamento e booleani anche dopo ricaricamento', () => {
  const storage = storageFinto();
  let s = creaSessione(generaProva([], { quiz: banca }), 0);
  s = scriviRisposta(s, 'tf', false);
  s = scriviRisposta(s, 'match', { '0': 'ruolo-1' });
  salvaSessione(storage, s);
  assert.equal(leggiRisposta(leggiSessione(storage), 'tf'), false);
  assert.deepEqual(leggiRisposta(leggiSessione(storage), 'match'), { '0': 'ruolo-1' });
});

test('schema di banca v1: abbinamenti senza nodo principale usano il nodo della prima coppia', () => {
  const match = structuredClone(banca.elementi.find((i) => i.tipo === 'abbinamento'));
  delete match.nodo_id;
  const adapted = catalogoEsercizi([], { versione: 1, elementi: [match] })[0];
  assert.equal(adapted.nodoId, match.abbinamenti[0].nodo_id);
  assert.equal(correggi(adapted, answer(adapted)), true);
});


test('modulo IA: assente, valori diversi da 1 e storage negato significano spento', () => {
  const storage = storageFinto();
  assert.equal(CHIAVE_MODULO_IA, 'tecweb.moduloIA');
  assert.equal(moduloIAAttivo(storage), false);
  assert.equal(moduloIAAttivo(undefined), false);
  for (const value of ['0', 'true', 'false', '', ' 1 ', '01']) {
    storage.setItem(CHIAVE_MODULO_IA, value);
    assert.equal(moduloIAAttivo(storage), false);
  }
  assert.equal(moduloIAAttivo({ getItem() { throw Error('negato'); } }), false);
  storage.setItem(CHIAVE_MODULO_IA, '1');
  assert.equal(moduloIAAttivo(storage), true);
});

test('filtro IA: area e prefissi dei nodi, comprese le coppie trasversali', () => {
  const items = [{ id: 'tw', area: 1 }, { id: 'area', area: 7 },
    { id: 'ia-nodo', area: 2 }, { id: 'quiz', area: 3, nodo_id: 'ia-bayes' },
    { id: 'adattato', area: 4, nodoId: 'ia-regressione' },
    { id: 'match', area: 5, abbinamenti: [{ nodo_id: 'ia-clustering' }] }];
  const snapshot = structuredClone(items);
  assert.deepEqual(filtraPerModulo(items), [items[0]]);
  assert.deepEqual(filtraPerModulo(items, true), items);
  assert.deepEqual(filtraPerModulo(items, '1'), [items[0]]);
  assert.deepEqual(filtraPerModulo(null), []);
  assert.deepEqual(items, snapshot);
});

test('catalogo e prove TW di default; attivazione esplicita ripristina tutti i quesiti', () => {
  const storage = storageFinto();
  const tw = catalogoEsercizi(graph.nodi, banca);
  assert.ok(tw.length > 0 && tw.every((i) => !elementoIA(i)));
  assert.doesNotMatch(JSON.stringify(tw), /\bIA\b|intelligenza artificiale|Calderara|bayesian/i);
  for (const modalita of ['simulazione', 'allenamento']) {
    for (const seed of [1, 2, 3]) {
      const prova = generaProva(graph.nodi, { quiz: banca, seed, modalita });
      assert.ok(prova.esercizi.every((i) => !elementoIA(i)));
    }
  }
  storage.setItem(CHIAVE_MODULO_IA, '1');
  const includiIA = moduloIAAttivo(storage);
  const full = catalogoEsercizi([], banca, { includiIA });
  assert.equal(full.length, banca.elementi.length);
  const prova = generaProva(graph.nodi, { quiz: banca, includiIA, quanti: new Set(graph.nodi.map((n) => n.area)).size });
  assert.ok(prova.esercizi.some(elementoIA));
});

test('conteggi e report ignorano IA per default, senza cancellare storico e banca', () => {
  const tw = tipo('scelta_multipla');
  const ia = catalogoEsercizi([], banca, { includiIA: true }).find(elementoIA);
  const items = [tw, ia];
  const answers = { [tw.id]: answer(tw), [ia.id]: answer(ia) };
  assert.equal(riepilogoRisposte(items, answers).totale, 1);
  assert.equal(riepilogoRisposte(items, answers).compilate, 1);
  assert.equal(riepilogoRisposte(items, answers, { includiIA: true }).totale, items.length);
  assert.deepEqual(reportAree(items, answers).map((r) => r.area), [tw.area]);
  assert.equal(reportAree(items, answers, { includiIA: true }).length, 2);
  const storage = storageFinto();
  const esito = esitiItem(ia, answer(ia), 'allenamento', new Date(0).toISOString())[0];
  registraEsito(storage, esito);
  assert.deepEqual(leggiEsiti(storage), [esito]); // API contrattuale X5: nessuna cancellazione.
});

test('sessioni miste salvate: solo TW nella proiezione, originali intatti e recuperabili', () => {
  const originale = creaSessione(generaProva(graph.nodi, { quiz: banca, includiIA: true, quanti: 100 }), 0);
  const ia = originale.prova.esercizi.find(elementoIA);
  originale.risposte[ia.id] = answer(ia);
  originale.confermate[ia.id] = true;
  const storage = storageFinto();
  salvaSessione(storage, originale);
  const tw = sessionePerModulo(leggiSessione(storage));
  assert.ok(tw.prova.esercizi.every((i) => !elementoIA(i)));
  assert.equal(ia.id in tw.risposte, false);
  assert.equal(ia.id in tw.confermate, false);
  assert.deepEqual(sessionePerModulo(leggiSessione(storage), true), originale);
  assert.equal(sessionePerModulo({ ...originale, prova: { ...originale.prova, esercizi: [ia] } }), null);
  assert.equal(sessionePerModulo(null), null);
});
