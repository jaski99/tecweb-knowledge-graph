// Indicatori di studio, non voti né previsioni d'esame. Nessun accesso allo storage.
// Gli esiti vengono forniti dal chiamante esclusivamente tramite leggiEsiti di X6.
export const LIVELLI = Object.freeze({
  'non-iniziato': { etichetta: 'Non iniziato', icona: '○' },
  visto: { etichetta: 'Visto', icona: '◔' },
  familiare: { etichetta: 'Familiare', icona: '◑' },
  sicuro: { etichetta: 'Sicuro', icona: '◕' },
  padroneggiato: { etichetta: 'Padroneggiato', icona: '●' },
});

/**
 * Regole esplicite e conservative: una spunta è esposizione; una risposta riuscita
 * è familiarità; due quesiti distinti riusciti o due carte stabili indicano
 * sicurezza. Per «padroneggiato» servono tre quesiti distinti consecutivi in
 * almeno due giorni e tutte le carte del nodo stabili. Un errore recente nel
 * quiz o «Ancora» nell'ultima revisione di una carta riporta a «Visto».
 * Le soglie sono scelte dell'app, non misure validate della preparazione.
 */
export function calcolaPadronanza({ nodoId, esiti = [], carte = [], statiCarte = {}, completato = false, statoStudio = 'non-iniziato', checklist = false } = {}) {
  const quiz = esiti.filter((e) => e && e.nodo_id === nodoId && typeof e.item_id === 'string'
    && typeof e.corretto === 'boolean' && ['allenamento', 'simulazione'].includes(e.modalita)
    && typeof e.ts === 'string' && Number.isFinite(Date.parse(e.ts)))
    .slice().sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
  const carteNodo = carte.filter((c) => c.nodoId === nodoId);
  const viste = carteNodo.map((c) => statiCarte[c.id]).filter((s) => s && s.revisioni > 0);
  const segnaleManuale = completato || checklist || statoStudio !== 'non-iniziato';
  if (!quiz.length && !viste.length && !segnaleManuale) return 'non-iniziato';
  if (quiz[0]?.corretto === false || viste.some((s) => s.ultimoVoto === 'ancora')) return 'visto';
  const successi = [];
  for (const e of quiz) { if (!e.corretto) break; successi.push(e); }
  const distinti = new Set(successi.map((e) => e.item_id));
  const giorni = new Set(successi.map((e) => e.ts.slice(0, 10)));
  const stabili = viste.filter((s) => s.ripetizioni >= 2).length;
  if (carteNodo.length && stabili === carteNodo.length && distinti.size >= 3 && giorni.size >= 2) return 'padroneggiato';
  if (distinti.size >= 2 || stabili >= 2) return 'sicuro';
  if (successi.length || viste.some((s) => s.ripetizioni > 0)) return 'familiare';
  return 'visto';
}

export function padronanzaNodi(nodi, segnali = {}) {
  return new Map((nodi || []).map((n) => [n.id, calcolaPadronanza({
    ...segnali,
    nodoId: n.id,
    completato: segnali.done?.has(n.id) || false,
    statoStudio: segnali.statiStudio?.[n.id] || 'non-iniziato',
    checklist: segnali.checklist?.has(n.id) || false,
  })]));
}
