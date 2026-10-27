// Contratto condiviso, senza dipendenze dalla web app X5.
export const CHIAVE_MODULO_IA = 'tecweb.moduloIA';

export function moduloIAAttivo(storage) {
  try { return storage?.getItem(CHIAVE_MODULO_IA) === '1'; }
  catch { return false; }
}

const nodoIA = (id) => typeof id === 'string' && id.startsWith('ia-');
export function elementoIA(item) {
  return item?.area === 7 || [item?.id, item?.nodo_id, item?.nodoId].some(nodoIA)
    || (item?.abbinamenti || []).some((p) => nodoIA(p.nodo_id));
}

// Il default è sempre TW, anche per chiamanti senza storage (test e strumenti).
export function filtraPerModulo(items, includiIA = false) {
  return (Array.isArray(items) ? items : []).filter((item) => includiIA === true || !elementoIA(item));
}
