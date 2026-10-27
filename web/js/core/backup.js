// Backup locale versionato. I valori sono stringhe come in Storage: non si
// rinominano le chiavi storiche e non si esegue nessun contenuto importato.
import { isIsoDay } from '../../modules/ripasso/giorni.js';
import { normalizzaStato } from '../../modules/ripasso/sm2.js';
import { STATI_STUDIO } from './study-state.js';
import { STORAGE_KEYS } from '../config.js';

export const CHIAVE_ESITI = 'ids-kg:esiti-quiz:v1';
const FORMATO = 'tecweb-knowledge-graph';
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_KEYS = 10000;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const oggetto = (v) => v && typeof v === 'object' && !Array.isArray(v);
const keyValida = (k) => typeof k === 'string' && k.length <= 200
  && (k.startsWith('ids-kg:') || k === 'ids.ripasso.v1' || k === 'tecweb:simulatore:v1');
const listaStringhe = (v) => Array.isArray(v) && v.every((s) => typeof s === 'string' && s.length <= 500);
const parse = (s) => { try { return JSON.parse(s); } catch { throw new Error('JSON non valido in una chiave del backup.'); } };

function validaRipasso(v) {
  if (!oggetto(v) || v.versione !== 1 || !oggetto(v.carte) || !listaStringhe(v.giorni)
    || !v.giorni.every(isIsoDay) || !oggetto(v.filtri)) return false;
  if (!(v.filtri.area === null || (Number.isInteger(v.filtri.area) && v.filtri.area > 0))) return false;
  if (!(v.filtri.priorita === null || ['alta', 'media', 'bassa'].includes(v.filtri.priorita))) return false;
  if (!Object.entries(v.carte).every(([id, s]) => id.length > 0 && id.length <= 500 && normalizzaStato(s)
    && s.ef >= 1.3 && s.ef <= 2.5 && (s.ultimoVoto === null || ['ancora', 'difficile', 'bene', 'facile'].includes(s.ultimoVoto)))) return false;
  if (v.limiteNuove !== undefined && (!Number.isInteger(v.limiteNuove) || v.limiteNuove < 0 || v.limiteNuove > 1000)) return false;
  if (v.nuovePerGiorno !== undefined && (!oggetto(v.nuovePerGiorno) || !Object.entries(v.nuovePerGiorno)
    .every(([day, ids]) => isIsoDay(day) && listaStringhe(ids)))) return false;
  return true;
}
function validaEsiti(v) {
  return Array.isArray(v) && v.length <= 2000 && v.every((e) => oggetto(e)
    && typeof e.item_id === 'string' && e.item_id.length > 0 && e.item_id.length <= 500
    && typeof e.nodo_id === 'string' && ID.test(e.nodo_id) && typeof e.corretto === 'boolean'
    && ['allenamento', 'simulazione'].includes(e.modalita) && typeof e.ts === 'string'
    && /^\d{4}-\d{2}-\d{2}T/.test(e.ts) && Number.isFinite(Date.parse(e.ts)));
}
function valoreValido(key, raw) {
  if (typeof raw !== 'string' || raw.length > MAX_BYTES) return false;
  if (key === STORAGE_KEYS.last) return ID.test(raw);
  if (key === STORAGE_KEYS.examDate) return isIsoDay(raw);
  if (key === STORAGE_KEYS.dailyBudget) return ['25', '50', '90'].includes(raw);
  if (key === 'ids-kg:tema:v1') return ['light', 'dark'].includes(raw);
  if (key === STORAGE_KEYS.done || key === STORAGE_KEYS.review) return listaStringhe(parse(raw));
  if (key === STORAGE_KEYS.studyStates) {
    const v = parse(raw);
    return oggetto(v) && v.versione === 1 && oggetto(v.stati)
      && Object.entries(v.stati).every(([id, s]) => ID.test(id) && Object.hasOwn(STATI_STUDIO, s));
  }
  if (/^ids-kg:checklist:[a-z0-9-]+:v1$/.test(key)) {
    const v = parse(raw);
    return oggetto(v) && Object.entries(v).every(([k, checked]) => /^(fare|dire)-\d+$/.test(k) && typeof checked === 'boolean');
  }
  if (key === 'ids.ripasso.v1') return validaRipasso(parse(raw));
  if (key === CHIAVE_ESITI) return validaEsiti(parse(raw));
  if (key === 'tecweb:simulatore:v1') {
    const v = parse(raw);
    // Il formato interno è proprietà di X6: manteniamo il valore come opaco.
    return oggetto(v) && Number.isInteger(v.versione) && v.versione > 0;
  }
  // Chiavi future ids-kg sono conservate come valori opachi, con limiti di dimensione.
  return true;
}

/** Il lettore X6 è l'unica via per interpretare gli esiti nello storage. */
export function creaBackup(storage, leggiEsiti = null) {
  const dati = Object.create(null);
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!keyValida(key)) continue;
    if (key === CHIAVE_ESITI) {
      if (!leggiEsiti) throw new Error('Il lettore degli esiti quiz non è disponibile: backup non creato per evitare perdite.');
      dati[key] = JSON.stringify(leggiEsiti(storage));
    } else dati[key] = storage.getItem(key);
  }
  const backup = { formato: FORMATO, versione: 1, dati };
  validaBackup(backup);
  return backup;
}

/** Valida interamente prima di qualsiasi scrittura, rifiutando versioni e tipi ignoti. */
export function validaBackup(input) {
  const v = typeof input === 'string' ? parse(input) : input;
  if (!oggetto(v) || v.formato !== FORMATO || v.versione !== 1 || !oggetto(v.dati)) throw new Error('Formato o versione del backup non validi.');
  const entries = Object.entries(v.dati);
  if (entries.length > MAX_KEYS || entries.reduce((n, [k, value]) => n + k.length + (typeof value === 'string' ? value.length : 0), 0) > MAX_BYTES) throw new Error('Backup troppo grande.');
  for (const [key, value] of entries) {
    if (!keyValida(key) || !valoreValido(key, value)) throw new Error(`Dato non valido: ${key}. Nessuna modifica eseguita.`);
  }
  return v;
}

/** Sovrascrive solo le chiavi del file; rollback delle scritture in caso di quota/errore. */
export function importaBackup(storage, input, leggiEsiti = null) {
  const backup = validaBackup(input);
  const entries = Object.entries(backup.dati);
  const esisteEsiti = Array.from({ length: storage.length }, (_, i) => storage.key(i)).includes(CHIAVE_ESITI);
  if (esisteEsiti && entries.some(([k]) => k === CHIAVE_ESITI) && !leggiEsiti) {
    throw new Error('Il lettore degli esiti quiz non è disponibile: importazione annullata per evitare perdite.');
  }
  const vecchi = new Map(entries.map(([k]) => [k, k === CHIAVE_ESITI
    ? (esisteEsiti ? JSON.stringify(leggiEsiti(storage)) : null) : storage.getItem(k)]));
  const scritti = [];
  try {
    for (const [k, v] of entries) { storage.setItem(k, v); scritti.push(k); }
  } catch {
    let ripristino = true;
    for (const k of scritti.reverse()) {
      try { const v = vecchi.get(k); v === null ? storage.removeItem(k) : storage.setItem(k, v); }
      catch { ripristino = false; }
    }
    throw new Error(ripristino ? 'Importazione non riuscita: i dati precedenti sono stati ripristinati.'
      : 'Importazione non riuscita e ripristino incompleto: verifica i dati del browser.');
  }
  return entries.length;
}

const campoTSV = (v) => String(v ?? '').replace(/[\t\r\n]+/g, ' ').trim();
/** Tre campi: fronte, retro, tag Anki. Ogni riga rimane una carta. */
export function mazzoAnkiTSV(carte) {
  const lines = (carte || []).map((c) => {
    const tags = [`area_${c.area}`, `nodo_${c.nodoId}`, c.gruppo ? `gruppo_${c.gruppo}` : ''].filter(Boolean)
      .map((s) => s.replace(/[^a-zA-Z0-9_-]/g, '_')).join(' ');
    return [c.domanda, c.risposta, tags].map(campoTSV).join('\t');
  });
  return ['#separator:tab', '#html:false', '#tags column:3', ...lines].join('\n') + '\n';
}
