// Statistiche pure: dovute oggi, padronanza per area, serie di giorni di studio.
// Una carta è "padroneggiata" dopo 2 ripetizioni riuscite di fila (intervallo SM-2 di 6 giorni).
import { addDaysIso, isIsoDay } from './giorni.js';
import { isScaduta } from './sm2.js';

export const RIPETIZIONI_PADRONANZA = 2;

/** 'nuova' mai vista, 'apprendimento' vista ma non stabile, 'padroneggiata' con >= 2 ripetizioni. */
export function statoCarta(stato) {
  if (!stato || stato.revisioni === 0) return 'nuova';
  return stato.ripetizioni >= RIPETIZIONI_PADRONANZA ? 'padroneggiata' : 'apprendimento';
}

const percentuale = (parte, totale) => (totale ? Math.round((parte / totale) * 100) : 0);

/**
 * Riepilogo di un insieme di carte: `dovute` = già viste con scadenza arrivata,
 * `nuove` = mai viste (in coda oggi ci sono dovute + nuove).
 */
export function riepilogoCarte(carte, stati, oggi) {
  const r = { totale: 0, nuove: 0, inApprendimento: 0, padroneggiate: 0, dovute: 0 };
  for (const carta of carte || []) {
    const stato = stati?.[carta.id];
    r.totale += 1;
    const tipo = statoCarta(stato);
    if (tipo === 'nuova') r.nuove += 1;
    else if (tipo === 'padroneggiata') r.padroneggiate += 1;
    else r.inApprendimento += 1;
    if (stato && stato.revisioni > 0 && isScaduta(stato, oggi)) r.dovute += 1;
  }
  return { ...r, percentualePadronanza: percentuale(r.padroneggiate, r.totale) };
}

/**
 * Padronanza per ciascuna area di `aree` ([{id, titolo}] del grafo).
 * Se `aree` è vuota, le aree si ricavano dalle carte.
 */
export function padronanzaPerArea(carte, stati, aree) {
  const elenco = Array.isArray(aree) && aree.length
    ? aree.map((a) => ({ area: a.id, titolo: a.titolo }))
    : [...new Set((carte || []).map((c) => c.area).filter((a) => a !== null))]
      .sort((a, b) => a - b)
      .map((a) => ({ area: a, titolo: `Area ${a}` }));
  return elenco.map(({ area, titolo }) => {
    const inArea = (carte || []).filter((c) => c.area === area);
    const padroneggiate = inArea.filter((c) => statoCarta(stati?.[c.id]) === 'padroneggiata').length;
    return { area, titolo, totale: inArea.length, padroneggiate, percentuale: percentuale(padroneggiate, inArea.length) };
  });
}

/** Previsione dei prossimi sette giorni, oggi incluso; gli arretrati contano oggi. */
export function previsioneSettimana(carte, stati, oggi) {
  if (!isIsoDay(oggi)) throw new TypeError('Data non valida');
  const giorni = Array.from({ length: 7 }, (_, i) => ({ giorno: addDaysIso(oggi, i), dovute: 0 }));
  for (const c of carte || []) {
    const s = stati?.[c.id];
    if (!s || !s.revisioni) continue;
    const giorno = !s.scadenza || s.scadenza <= oggi ? oggi : s.scadenza;
    const riga = giorni.find((g) => g.giorno === giorno);
    if (riga) riga.dovute++;
  }
  return giorni;
}

/** Non si sospende nulla automaticamente: si segnalano le carte con tre errori o più. */
export function carteSanguisuga(carte, stati, soglia = 3) {
  return (carte || []).filter((c) => (stati?.[c.id]?.errori || 0) >= soglia)
    .slice().sort((a, b) => stati[b.id].errori - stati[a.id].errori || a.id.localeCompare(b.id));
}
