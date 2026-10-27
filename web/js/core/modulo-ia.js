// Preferenza condivisa con il simulatore: senza consenso il secondo modulo è spento.
export const CHIAVE_MODULO_IA = 'tecweb.moduloIA';
export const AREA_IA = 7;

const storageBrowser = () => {
  try { return globalThis.localStorage; } catch { return null; }
};

export function isModuloIAAttivo(storage = storageBrowser()) {
  try { return storage?.getItem(CHIAVE_MODULO_IA) === '1'; } catch { return false; }
}

/** Ritorna false se il browser non permette di salvare la preferenza. */
export function setModuloIA(attivo, storage = storageBrowser()) {
  if (typeof attivo !== 'boolean') throw new TypeError('La preferenza deve essere booleana.');
  try {
    if (!storage) return false;
    storage.setItem(CHIAVE_MODULO_IA, attivo ? '1' : '0');
    return true;
  } catch { return false; }
}

/** Il grafo originale resta intatto; la lista restituita contiene solo i nodi attivi. */
export function filtraNodiAttivi(nodi, storage = storageBrowser()) {
  return isModuloIAAttivo(storage) ? [...nodi] : nodi.filter((n) => n.area !== AREA_IA);
}
