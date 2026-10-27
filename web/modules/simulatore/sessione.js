import { filtraPerModulo } from './modulo-ia.js';
// Sessione del simulatore salvata localmente. Nessun punteggio o formato d'esame viene presunto.
import { leggiTimer, timerNuovo, timerInPausa, timerInCorso } from './timer.js';

export const CHIAVE_STORAGE = 'tecweb:simulatore:v1';

export function creaSessione(prova, now) {
  return { versione: 1, prova, fase: 'svolgimento', risposte: {}, confermate: {}, registrati: {}, timer: timerNuovo(now, prova.durataMs) };
}

export function sessioneValida(data) {
  return Boolean(data && data.versione === 1 && ['svolgimento', 'consegnata'].includes(data.fase)
    && data.prova?.versione === 1 && Number.isFinite(data.prova.durataMs) && data.prova.durataMs > 0
    && Array.isArray(data.prova.esercizi) && data.prova.esercizi.length > 0
    && data.prova.esercizi.every((e) => typeof e?.id === 'string' && typeof e.testo === 'string' && typeof e.soluzione === 'string')
    && data.timer && typeof data.timer.running === 'boolean' && Number.isFinite(data.timer.elapsedMs)
    && Number.isFinite(data.timer.durataMs) && data.timer.durataMs === data.prova.durataMs
    && (data.timer.running ? Number.isFinite(data.timer.startedAt) : data.timer.startedAt === null)
    && data.risposte && typeof data.risposte === 'object' && !Array.isArray(data.risposte));
}

export function leggiSessione(storage, key = CHIAVE_STORAGE) {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return sessioneValida(value) ? value : null;
  } catch { return null; }
}

export function salvaSessione(storage, sessione, key = CHIAVE_STORAGE) {
  try { storage.setItem(key, JSON.stringify(sessione)); return true; }
  catch { return false; }
}

export function cancellaSessione(storage, key = CHIAVE_STORAGE) {
  try { storage.removeItem(key); } catch { /* modalità privata */ }
}

export function leggiRisposta(sessione, id) { return sessione?.risposte?.[id] ?? ''; }

export function scriviRisposta(sessione, id, testo) {
  return { ...sessione, risposte: { ...sessione.risposte, [id]: testo } };
}

export function sessioneInCorsoValida(sessione, now) {
  return sessioneValida(sessione) && sessione.fase === 'svolgimento'
    && !(sessione.timer.running && sessione.timer.startedAt > now)
    && !leggiTimer(sessione.timer, now).scaduto;
}

export function mettiInPausa(sessione, now) {
  return { ...sessione, timer: timerInPausa(sessione.timer, now) };
}
export function riprendi(sessione, now) {
  return { ...sessione, timer: timerInCorso(sessione.timer, now) };
}
export function consegna(sessione, now) {
  return { ...sessione, fase: 'consegnata', timer: timerInPausa(sessione.timer, now) };
}
export function scaduta(sessione) {
  return { ...sessione, fase: 'consegnata', timer: { ...sessione.timer, running: false, startedAt: null, elapsedMs: sessione.timer.durataMs } };
}

// Proiezione non distruttiva: lo storico e il salvataggio originale non vengono cancellati.
export function sessionePerModulo(sessione, includiIA = false) {
  if (!sessione) return null;
  const esercizi = filtraPerModulo(sessione.prova.esercizi, includiIA);
  if (!esercizi.length) return null;
  const ids = new Set(esercizi.map((e) => e.id));
  const seleziona = (record) => Object.fromEntries(Object.entries(record || {}).filter(([id]) => ids.has(id)));
  return { ...sessione, prova: { ...sessione.prova, esercizi },
    risposte: seleziona(sessione.risposte), confermate: seleziona(sessione.confermate), registrati: seleziona(sessione.registrati) };
}
