// Seleziona esercizi reali del grafo (e quiz con struttura riconoscibile), senza inventare consegne o punteggi.
import { DURATA_ESAME_MS } from './timer.js';
export { DURATA_ESAME_MS };

function seedRandom(seed) {
  let state = Number.isFinite(seed) ? seed >>> 0 : Date.now() >>> 0;
  return () => { state = (1664525 * state + 1013904223) >>> 0; return state / 0x100000000; };
}

export function catalogoEsercizi(nodi, quiz = null) {
  const items = [];
  for (const node of Array.isArray(nodi) ? nodi : []) {
    const id = typeof node?.id === 'string' ? node.id : '';
    for (const [index, exercise] of (Array.isArray(node?.esercizi) ? node.esercizi : []).entries()) {
      const testo = String(exercise?.testo || '').trim();
      const soluzione = String(exercise?.soluzione || '').trim();
      if (!id || !testo || !soluzione) continue;
      items.push({
        id: `${id}#${index}`, nodoId: id, nodoTitolo: node.title || id,
        area: node.area, tipoEsame: exercise.tipo_esame || 'Esercizio', testo, soluzione,
      });
    }
  }
  const quizzes = Array.isArray(quiz) ? quiz
    : ['quiz', 'domande', 'questions', 'quizzes', 'items'].map((key) => quiz?.[key]).find(Array.isArray) || [];
  quizzes.forEach((item, index) => {
    const testo = String(item?.domanda || item?.question || item?.prompt || item?.testo || '').trim();
    const rawAnswer = item?.risposta ?? item?.answer ?? item?.soluzione ?? item?.risposta_corretta ?? item?.correct_answer ?? item?.correctAnswer ?? item?.corretta;
    const solutionText = typeof rawAnswer === 'number' && Array.isArray(item?.opzioni)
      ? item.opzioni[rawAnswer] : typeof rawAnswer === 'number' && Array.isArray(item?.options) ? item.options[rawAnswer] : rawAnswer;
    const soluzione = String(solutionText || item?.spiegazione || item?.explanation || '').trim();
    if (!testo || !soluzione) return;
    const nodoId = String(item.nodoId || item.nodo || item.node_id || '').trim();
    items.push({ id: `quiz#${index}`, nodoId, nodoTitolo: item.nodoTitolo || nodoId || 'Quiz', area: item.area, tipoEsame: 'Quiz', testo, soluzione });
  });
  return items;
}

export function generaProva(nodi, { seed = Date.now(), quiz = null, quanti = 12, now = Date.now() } = {}) {
  const random = seedRandom(seed);
  const pool = catalogoEsercizi(nodi, quiz);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return {
    versione: 1,
    generataIl: now,
    durataMs: DURATA_ESAME_MS,
    esercizi: pool.slice(0, Math.max(1, Math.min(100, quanti))),
  };
}
