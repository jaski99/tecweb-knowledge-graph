// Costruzione del mazzo, filtri e coda di studio. Solo dati del grafo:
// - domande di autoverifica (lezione.domande_autoverifica): domanda -> risposta;
// - punti di checklist_ripasso: il fronte è un completamento, il retro è
//   il punto specifico originale, non il generico `sapere` del nodo.
// Le carte con domanda o risposta vuote vengono saltate.
import { diffDaysIso } from './giorni.js';
import { isScaduta } from './sm2.js';

export const PRIORITA = ['alta', 'media', 'bassa'];

const testo = (v) => (typeof v === 'string' ? v.trim() : '');
const rangoPriorita = (p) => {
  const i = PRIORITA.indexOf(p);
  return i === -1 ? PRIORITA.length : i;
};
const rangoTipo = (t) => (t === 'domanda' ? 0 : 1);

function cartaBase(nodo, id, titolo) {
  return {
    id,
    nodoId: nodo.id,
    nodoTitolo: titolo,
    area: Number.isInteger(nodo.area) ? nodo.area : null,
    priorita: PRIORITA.includes(nodo.priorita?.livello) ? nodo.priorita.livello : null,
    gruppo: ['A', 'B', 'C'].includes(nodo.gruppo) ? nodo.gruppo : null,
  };
}

export function costruisciMazzo(nodi) {
  if (!Array.isArray(nodi)) return [];
  const carte = [];
  for (const nodo of nodi) {
    const id = testo(nodo?.id);
    if (!id) continue;
    const titolo = testo(nodo.title) || id;
    const lezione = nodo.lezione || {};
    const domande = [
      ...(Array.isArray(lezione.domande_autoverifica) ? lezione.domande_autoverifica : []),
      ...(Array.isArray(lezione.richiamo_attivo?.domande) ? lezione.richiamo_attivo.domande : []),
    ];
    domande.forEach((d, i) => {
      const domanda = testo(d?.domanda);
      const risposta = testo(d?.risposta);
      if (!domanda || !risposta) return;
      carte.push({ ...cartaBase(nodo, `${id}#domanda-${i}`, titolo), tipo: 'domanda', indice: i, domanda, risposta });
    });
    const flashcard = Array.isArray(lezione.flashcard) ? lezione.flashcard : [lezione.flashcard];
    flashcard.forEach((f, i) => {
      const fronte = testo(f?.fronte), retro = testo(f?.retro);
      const suffisso = i === 0 ? 'flashcard' : `flashcard-${i}`;
      if (fronte && retro) carte.push({ ...cartaBase(nodo, `${id}#${suffisso}`, titolo), tipo: 'flashcard', indice: i, domanda: fronte, risposta: retro });
    });
    const checklist = Array.isArray(nodo.checklist_ripasso) ? nodo.checklist_ripasso : [];
    checklist.forEach((punto, i) => {
      const risposta = testo(punto);
      if (!risposta) return;
      // Il punto è già un'affermazione: nasconderne la fine crea uno spunto
      // di richiamo e mantiene come retro soltanto il testo originale verificato.
      const parole = risposta.split(/\s+/);
      const inizio = parole.slice(0, Math.max(1, Math.ceil(parole.length / 2))).join(' ');
      const domanda = `Completa il punto: ${inizio} …`;
      carte.push({ ...cartaBase(nodo, `${id}#checklist-${i}`, titolo), tipo: 'checklist', indice: i, domanda, risposta });
    });
  }
  return carte;
}

/** Filtri: `area` (intero) e `priorita` ('alta'|'media'|'bassa'); null = nessun filtro. */
export function filtraCarte(carte, filtri = {}) {
  const area = filtri?.area ?? null;
  const priorita = filtri?.priorita ?? null;
  return (carte || []).filter((c) => (area === null || c.area === area) && (priorita === null || c.priorita === priorita));
}

function confrontaBase(a, b) {
  return rangoPriorita(a.priorita) - rangoPriorita(b.priorita)
    || (a.area ?? Infinity) - (b.area ?? Infinity)
    || a.nodoId.localeCompare(b.nodoId)
    || rangoTipo(a.tipo) - rangoTipo(b.tipo)
    || a.indice - b.indice;
}

/** Alterna aree e nodi quando possibile, senza cambiare il contenuto del gruppo. */
export function interleaving(carte, precedente = null) {
  const restanti = [...carte];
  const risultato = [];
  let ultimo = precedente;
  while (restanti.length) {
    let i = ultimo ? restanti.findIndex((c) => c.area !== ultimo.area && c.nodoId !== ultimo.nodoId) : 0;
    if (i < 0) i = restanti.findIndex((c) => c.nodoId !== ultimo.nodoId);
    if (i < 0) i = 0;
    ultimo = restanti.splice(i, 1)[0];
    risultato.push(ultimo);
  }
  return risultato;
}

/**
 * Prima tutte le scadute, dalla più vecchia; poi le nuove, per priorità.
 * A parità di scadenza/priorità alterna aree e nodi. Il tetto riguarda solo
 * le nuove: le carte scadute non vengono mai sacrificate.
 */
export function codaStudio(carte, stati, oggi, { maxNuove = Infinity } = {}) {
  const scadute = [], nuove = [];
  for (const carta of carte || []) {
    const stato = stati?.[carta.id];
    if (!stato || !stato.revisioni) nuove.push(carta);
    else if (isScaduta(stato, oggi)) scadute.push({ carta, ritardo: stato.scadenza ? diffDaysIso(stato.scadenza, oggi) : 0 });
  }
  scadute.sort((a, b) => b.ritardo - a.ritardo || confrontaBase(a.carta, b.carta));
  nuove.sort(confrontaBase);
  const coda = [];
  const perGruppo = (items, chiave) => {
    for (let i = 0; i < items.length;) {
      let fine = i + 1;
      while (fine < items.length && chiave(items[fine]) === chiave(items[i])) fine++;
      coda.push(...interleaving(items.slice(i, fine).map((e) => e.carta || e), coda.at(-1)));
      i = fine;
    }
  };
  perGruppo(scadute, (e) => e.ritardo);
  const numeroScadute = coda.length;
  perGruppo(nuove, (c) => rangoPriorita(c.priorita));
  const limite = Number.isFinite(maxNuove) ? Math.max(0, Math.floor(maxNuove)) : Infinity;
  return [...coda.slice(0, numeroScadute), ...coda.slice(numeroScadute, numeroScadute + limite)];
}

/** Prima scadenza futura tra le carte già viste (per dire quando ci sarà altro da ripassare). */
export function prossimaScadenza(carte, stati, oggi) {
  let prossima = null;
  for (const carta of carte || []) {
    const scadenza = stati?.[carta.id]?.scadenza;
    if (scadenza && scadenza > oggi && (prossima === null || scadenza < prossima)) prossima = scadenza;
  }
  return prossima;
}
