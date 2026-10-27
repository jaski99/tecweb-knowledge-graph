// Contratto pubblico X6 → X5, indipendente da DOM e sessione.
export const CHIAVE_ESITI = 'ids-kg:esiti-quiz:v1';
const valido = (e) => e && typeof e.item_id === 'string' && e.item_id.length > 0
  && typeof e.nodo_id === 'string' && e.nodo_id.length > 0 && typeof e.corretto === 'boolean'
  && ['allenamento', 'simulazione'].includes(e.modalita)
  && typeof e.ts === 'string' && /^\d{4}-\d\d-\d\dT/.test(e.ts) && Number.isFinite(Date.parse(e.ts));
const pulisci = ({ item_id, nodo_id, corretto, modalita, ts }) => ({ item_id, nodo_id, corretto, modalita, ts });
export function leggiEsiti(storage) {
  try {
    const data = JSON.parse(storage.getItem(CHIAVE_ESITI));
    return Array.isArray(data) ? data.filter(valido).slice(-2000).map(pulisci) : [];
  } catch { return []; }
}
export function registraEsito(storage, esito) {
  if (!valido(esito)) return false;
  try {
    storage.setItem(CHIAVE_ESITI, JSON.stringify([...leggiEsiti(storage), pulisci(esito)].slice(-2000)));
    return true;
  } catch { return false; }
}
