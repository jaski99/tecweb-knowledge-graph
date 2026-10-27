// Persistenza del ripasso. Lo storage è iniettato: niente localStorage globale.
// Un'unica chiave `ids.ripasso.v1`: stati SM-2 delle carte, giorni di studio, filtri scelti.
// Dati corrotti o di versioni diverse vengono ignorati (mai eccezioni verso la vista).
import { isIsoDay } from './giorni.js';
import { PRIORITA } from './mazzo.js';
import { normalizzaStato } from './sm2.js';

export const CHIAVE_STORAGE = 'ids.ripasso.v1';
const VERSIONE = 1;
export const LIMITE_NUOVE_DEFAULT = 20;
export const LIMITE_NUOVE_MAX = 1000;

export function statoVuoto() {
  return { versione: VERSIONE, carte: {}, giorni: [], filtri: { area: null, priorita: null }, limiteNuove: LIMITE_NUOVE_DEFAULT, nuovePerGiorno: {} };
}

/** Qualsiasi valore -> dati del ripasso affidabili (le voci non valide vengono scartate). */
export function normalizzaDati(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v) || v.versione !== VERSIONE) return statoVuoto();
  const carte = {};
  if (v.carte && typeof v.carte === 'object' && !Array.isArray(v.carte)) {
    for (const [id, stato] of Object.entries(v.carte)) {
      const pulito = id.trim() ? normalizzaStato(stato) : null;
      if (pulito) carte[id] = pulito;
    }
  }
  const giorni = Array.isArray(v.giorni) ? [...new Set(v.giorni.filter(isIsoDay))].sort() : [];
  const filtri = {
    area: Number.isInteger(v.filtri?.area) ? v.filtri.area : null,
    priorita: PRIORITA.includes(v.filtri?.priorita) ? v.filtri.priorita : null,
  };
  const limiteNuove = Number.isInteger(v.limiteNuove) && v.limiteNuove >= 0 && v.limiteNuove <= LIMITE_NUOVE_MAX
    ? v.limiteNuove : LIMITE_NUOVE_DEFAULT;
  const nuovePerGiorno = {};
  if (v.nuovePerGiorno && typeof v.nuovePerGiorno === 'object' && !Array.isArray(v.nuovePerGiorno)) {
    for (const [giorno, ids] of Object.entries(v.nuovePerGiorno)) {
      if (isIsoDay(giorno) && Array.isArray(ids)) nuovePerGiorno[giorno] = [...new Set(ids.filter((id) => typeof id === 'string' && id.trim()))];
    }
  }
  return { versione: VERSIONE, carte, giorni, filtri, limiteNuove, nuovePerGiorno };
}

export function leggiStato(storage, chiave = CHIAVE_STORAGE) {
  try {
    const raw = storage?.getItem(chiave);
    return raw ? normalizzaDati(JSON.parse(raw)) : statoVuoto();
  } catch {
    return statoVuoto();
  }
}

/** Ritorna false se il browser non salva (quota, privacy mode): la vista avvisa lo studente. */
export function salvaStato(storage, dati, chiave = CHIAVE_STORAGE) {
  try {
    storage.setItem(chiave, JSON.stringify(normalizzaDati(dati)));
    return true;
  } catch {
    return false;
  }
}

export function cancellaStato(storage, chiave = CHIAVE_STORAGE) {
  try {
    storage.removeItem(chiave);
    return true;
  } catch {
    return false;
  }
}

/** Nuovi dati con la revisione registrata e il giorno di studio segnato (input immutato). */
export function conRevisione(dati, cartaId, statoCarta, oggi) {
  const base = normalizzaDati(dati);
  const giorni = base.giorni.includes(oggi) ? base.giorni : [...base.giorni, oggi].sort();
  const nuove = base.nuovePerGiorno[oggi] || [];
  const primaRevisione = !base.carte[cartaId] || !base.carte[cartaId].revisioni;
  const nuovePerGiorno = primaRevisione && !nuove.includes(cartaId)
    ? { ...base.nuovePerGiorno, [oggi]: [...nuove, cartaId] } : base.nuovePerGiorno;
  return { ...base, carte: { ...base.carte, [cartaId]: statoCarta }, giorni, nuovePerGiorno };
}

/** Limite giornaliero globale, condiviso fra filtri e riaperture della vista. */
export function nuoveDisponibili(dati, oggi) {
  const base = normalizzaDati(dati);
  return Math.max(0, base.limiteNuove - (base.nuovePerGiorno[oggi] || []).length);
}
