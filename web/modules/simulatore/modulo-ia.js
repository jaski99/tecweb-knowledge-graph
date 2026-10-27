// Adattatore del simulatore sul modulo condiviso: stessa chiave e stessa lettura della web app.
import { AREA_IA, CHIAVE_MODULO_IA, isModuloIAAttivo } from '../../js/core/modulo-ia.js';

export { CHIAVE_MODULO_IA };

export function moduloIAAttivo(storage) {
  return isModuloIAAttivo(storage ?? null);
}

const nodoIA = (id) => typeof id === 'string' && id.startsWith('ia-');
export function elementoIA(item) {
  return item?.area === AREA_IA || [item?.id, item?.nodo_id, item?.nodoId].some(nodoIA)
    || (item?.abbinamenti || []).some((p) => nodoIA(p.nodo_id));
}

// Il default è sempre TW, anche per chiamanti senza storage (test e strumenti).
export function filtraPerModulo(items, includiIA = false) {
  return (Array.isArray(items) ? items : []).filter((item) => includiIA === true || !elementoIA(item));
}
