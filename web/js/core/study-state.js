// Stato manuale versionato: il vecchio insieme completati resta sincronizzato.
export const STATI_STUDIO = Object.freeze({
  'non-iniziato': 'Da studiare',
  'in-corso': 'In corso',
  completato: 'Studiato',
  'so-gia': 'So già (salto per ora)',
});
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createStudyStore(storage, key, doneStore) {
  const salvati = Object.create(null);
  try {
    const data = JSON.parse(storage.getItem(key) || 'null');
    if (data?.versione === 1 && data.stati && typeof data.stati === 'object' && !Array.isArray(data.stati)) {
      for (const [id, stato] of Object.entries(data.stati)) {
        if (ID.test(id) && Object.hasOwn(STATI_STUDIO, stato) && stato !== 'non-iniziato') salvati[id] = stato;
      }
    }
  } catch { /* migrazione dal vecchio insieme */ }
  for (const id of doneStore.values()) if (ID.test(id) && !Object.hasOwn(salvati, id)) salvati[id] = 'completato';
  // Se entrambi i formati esistono, la mappa è autorevole per stati non completati.
  for (const id of doneStore.values()) if (salvati[id] !== 'completato') doneStore.toggle(id, false);
  for (const [id, stato] of Object.entries(salvati)) if (stato === 'completato' && !doneStore.has(id)) doneStore.toggle(id, true);
  const save = () => {
    try { storage.setItem(key, JSON.stringify({ versione: 1, stati: salvati })); return true; }
    catch { return false; }
  };
  save();
  return {
    values: () => ({ ...salvati }),
    set(id, stato) {
      if (!ID.test(id) || !Object.hasOwn(STATI_STUDIO, stato)) throw new TypeError('Stato o identificativo non valido');
      if (stato === 'non-iniziato') delete salvati[id]; else salvati[id] = stato;
      doneStore.toggle(id, stato === 'completato');
      return save();
    },
  };
}

export const prerequisitiSoddisfatti = (nodo, stati) => (nodo.prerequisiti || []).every((p) =>
  p.forza !== 'hard' || ['completato', 'so-gia'].includes(stati?.[p.id]));
