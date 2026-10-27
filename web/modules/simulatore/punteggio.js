import { filtraPerModulo } from './modulo-ia.js';
import { rispostaCompleta } from './correzione.js';
// Indicatori di completamento descrittivi: il simulatore non assegna punteggi non documentati.
export function riepilogoRisposte(esercizi, risposte, { includiIA = false } = {}) {
  esercizi = filtraPerModulo(esercizi, includiIA);
  const totale = Array.isArray(esercizi) ? esercizi.length : 0;
  const compilate = (esercizi || []).filter((e) => rispostaCompleta(e, risposte?.[e.id])).length;
  return { totale, compilate, mancanti: Math.max(0, totale - compilate), percentuale: totale ? Math.round(compilate * 100 / totale) : 0 };
}

export function etichettaEsito(summary) {
  if (!summary.totale) return 'Nessun esercizio disponibile nel grafo.';
  const risposta = summary.compilate === 1 ? 'risposta compilata' : 'risposte compilate';
  return `${summary.compilate} ${risposta} su ${summary.totale}. I quesiti chiusi sono corretti automaticamente; le aperte sono autovalutative; non viene calcolato un voto.`;
}
