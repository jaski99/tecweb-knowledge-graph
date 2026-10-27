// Proiezione del grafo per le viste di studio; i dati completi non vengono modificati.
import { AREA_IA, filtraNodiAttivi, isModuloIAAttivo } from './modulo-ia.js';
import { topoOrder } from './topo.js';

// I metadati d'esame non hanno un campo area: conserva le sole frasi TW
// ed evita di presentare come regole del primo modulo quelle dell'integrato.
const riguardaIA = (testo) => /\bIA\b|intelligenza artificiale|apprendimento automatico|\bintegrat[oaie]\b/i.test(testo);
const frasiTW = (testo) => String(testo || '').split(/(?<=[.!?])\s+/).filter((s) => !riguardaIA(s)).join(' ');
const docentiTW = (testo) => String(testo || '').split(';').filter((s) => !riguardaIA(s)).join(';').trim();

export function grafoAttivo(completo, storage) {
  const iaAttiva = isModuloIAAttivo(storage);
  const selezionati = filtraNodiAttivi(completo.nodi, storage);
  const idAttivi = new Set(selezionati.map((n) => n.id));
  const nodiInattivi = new Set(completo.nodi.filter((n) => !idAttivi.has(n.id)).map((n) => n.id));
  const nodi = selezionati.map((n) => {
    const prerequisiti = n.prerequisiti.filter((p) => !nodiInattivi.has(p.id));
    return prerequisiti.length === n.prerequisiti.length ? n : { ...n, prerequisiti };
  });
  // Gli indici originali mantengono stabili le chiavi delle trappole già spuntate.
  const trappole = (completo.trappole || [])
    .map((t, indiceRipassoOriginale) => ({ ...t, indiceRipassoOriginale }))
    .filter((t) => iaAttiva || !riguardaIA(Object.values(t).join(' ')));
  const attivo = {
    ...completo,
    iaAttiva,
    nodiInattivi,
    nodi,
    aree: completo.aree.filter((a) => iaAttiva || a.id !== AREA_IA),
    byId: new Map(nodi.map((n) => [n.id, n])),
    order: iaAttiva ? [...completo.order] : topoOrder(nodi),
    trappole,
    corso: iaAttiva ? completo.corso : { ...completo.corso, docente: docentiTW(completo.corso?.docente) },
    nota_esame: iaAttiva ? completo.nota_esame : frasiTW(completo.nota_esame),
  };
  // loadGraph può completare la banca quiz dopo il primo render. Propaga
  // l'aggiornamento alla proiezione senza ritardare l'apertura delle lezioni.
  if (completo.quizPronto) {
    attivo.quizPronto = completo.quizPronto.then((quiz) => {
      if (quiz !== null) attivo.quiz = quiz;
      return quiz;
    });
  }
  return attivo;
}
