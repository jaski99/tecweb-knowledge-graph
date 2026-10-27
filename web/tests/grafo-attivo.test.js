import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { grafoAttivo } from '../js/core/grafo-attivo.js';
import { setModuloIA } from '../js/core/modulo-ia.js';
import { memoryStorage } from '../js/core/store.js';
import { topoOrder } from '../js/core/topo.js';
import { prepare } from '../js/data.js';
import { graph } from './fixture.js';

function grafoConIA() {
  const g = graph();
  g.aree = [...g.aree, { id: 7, titolo: 'IA' }];
  const ia = { ...structuredClone(g.nodi[0]), id: 'ia-base', area: 7, prerequisiti: [] };
  g.nodi.push(ia);
  g.nodi[0].prerequisiti.push({ id: ia.id, forza: 'hard', motivo: 'di prova' });
  g.corso = { nome: 'Tecnologie Web', docente: 'Docente TW; Docente IA (modulo IA)' };
  g.nota_esame = 'Regole TW [F1]. IA prevede quiz [F1]. Il voto integrato è una media [F1]. IPOTESI non confermata.';
  g.trappole = [
    { tema: 'TW', risposta: 'Risposta TW' },
    { tema: 'Modulo IA', risposta: 'Risposta IA' },
    { tema: 'TW 2', risposta: 'Altra risposta TW' },
  ];
  return prepare(g);
}

test('proiezione coerente di aree, ordine, indice, prerequisiti e metadati senza mutazioni', () => {
  const completo = grafoConIA(), storage = memoryStorage();
  const nodiOriginali = structuredClone(completo.nodi);
  const attivo = grafoAttivo(completo, storage);
  assert.deepEqual(attivo.aree.map((a) => a.id), [1, 2]);
  assert.equal(attivo.nodi.length, 4);
  assert.equal(attivo.byId.has('ia-base'), false);
  assert.equal(attivo.nodiInattivi.has('ia-base'), true);
  assert.ok(!attivo.order.includes('ia-base'));
  assert.deepEqual(attivo.order, topoOrder(attivo.nodi));
  assert.ok(!attivo.byId.get('c').prerequisiti.some((p) => p.id === 'ia-base'));
  assert.ok(completo.byId.get('c').prerequisiti.some((p) => p.id === 'ia-base'));
  assert.deepEqual(completo.nodi, nodiOriginali);
  assert.equal(attivo.corso.docente, 'Docente TW');
  assert.equal(attivo.nota_esame, 'Regole TW [F1]. IPOTESI non confermata.');
  assert.deepEqual(attivo.trappole.map((t) => t.indiceRipassoOriginale), [0, 2]);
  assert.equal(completo.trappole.length, 3);

  setModuloIA(true, storage);
  const tutti = grafoAttivo(completo, storage);
  assert.equal(tutti.nodi.length, 5);
  assert.ok(tutti.byId.has('ia-base'));
  assert.equal(tutti.nodiInattivi.size, 0);
  assert.equal(tutti.corso.docente, completo.corso.docente);
  assert.equal(tutti.nota_esame, completo.nota_esame);
  assert.equal(tutti.trappole.length, 3);
  assert.deepEqual(tutti.byId.get('c').prerequisiti, completo.byId.get('c').prerequisiti);
});

test('i metadati reali conservano le informazioni TW e nascondono quelle IA', () => {
  const completo = prepare(JSON.parse(readFileSync(new URL('../../graph/graph.json', import.meta.url), 'utf8')));
  const attivo = grafoAttivo(completo, memoryStorage());
  assert.match(attivo.corso.docente, /modulo TW/);
  assert.doesNotMatch(attivo.corso.docente, /\bIA\b/);
  assert.match(attivo.nota_esame, /TW prevede scritto/);
  assert.doesNotMatch(attivo.nota_esame, /\bIA\b|integrat[oaie]/i);
  assert.ok(attivo.trappole.length > 0);
  assert.doesNotMatch(JSON.stringify(attivo.trappole), /\bIA\b|integrat[oaie]/i);
  assert.equal(attivo.nodi.length, completo.nodi.filter((n) => n.area !== 7).length);
});

test('la banca quiz asincrona resta disponibile anche nella proiezione', async () => {
  const completo = grafoConIA();
  let risolvi;
  completo.quizPronto = new Promise((resolve) => { risolvi = resolve; }).then((quiz) => {
    completo.quiz = quiz;
    return quiz;
  });
  const attivo = grafoAttivo(completo, memoryStorage());
  assert.equal(attivo.quiz, undefined);
  const quiz = { elementi: [{ id: 'q1' }] };
  risolvi(quiz);
  assert.equal(await attivo.quizPronto, quiz);
  assert.equal(attivo.quiz, quiz);
  assert.equal(completo.quiz, quiz);
});
