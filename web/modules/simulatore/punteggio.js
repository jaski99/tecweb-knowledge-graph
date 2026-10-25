// Indicatori di completamento descrittivi: il simulatore non assegna punteggi non documentati.
export function riepilogoRisposte(esercizi, risposte) {
  const totale = Array.isArray(esercizi) ? esercizi.length : 0;
  const compilate = (esercizi || []).filter((e) => String(risposte?.[e.id] || '').trim()).length;
  return { totale, compilate, mancanti: Math.max(0, totale - compilate), percentuale: totale ? Math.round(compilate * 100 / totale) : 0 };
}

export function etichettaEsito(summary) {
  if (!summary.totale) return 'Nessun esercizio disponibile nel grafo.';
  const risposta = summary.compilate === 1 ? 'risposta scritta' : 'risposte scritte';
  return `${summary.compilate} ${risposta} su ${summary.totale}. Il confronto con le soluzioni è autovalutativo; non viene calcolato un voto.`;
}
