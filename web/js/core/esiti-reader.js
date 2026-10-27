// X6 può non essere ancora presente: non effettuare una richiesta a un file assente.
// Il flag è generato dalla build; quando il modulo esiste, questa è l'unica
// dipendenza applicativa X5 -> X6 e si usa esclusivamente leggiEsiti(storage).
export async function caricaLettoreEsiti(disponibile, importa = () => import('../../modules/simulatore/esiti.js')) {
  if (!disponibile) return null;
  try {
    const modulo = await importa();
    return typeof modulo.leggiEsiti === 'function' ? modulo.leggiEsiti : null;
  } catch {
    return null; // lezioni e grafo restano sempre accessibili
  }
}
