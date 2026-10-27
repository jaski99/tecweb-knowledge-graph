// Adattatore della banca v1/v2 e selezione stratificata, senza punteggi d'esame.
import { DURATA_ESAME_MS } from './timer.js';
export { DURATA_ESAME_MS };

function seedRandom(seed) {
  let state = seed >>> 0;
  return () => { state = (1664525 * state + 1013904223) >>> 0; return state / 0x100000000; };
}
function mescola(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function catalogoEsercizi(nodi, quiz = null) {
  const nodes = Array.isArray(nodi) ? nodi : [];
  const banca = Array.isArray(quiz) ? quiz : quiz?.elementi || [];
  const items = banca.map((item) => ({
    ...item, nodoId: item.nodo_id || item.abbinamenti?.[0]?.nodo_id, nodoTitolo: item.titolo,
    testo: item.domanda || item.affermazione || item.istruzioni || item.codice_con_buchi,
    soluzione: item.spiegazione || item.abbinamenti?.map((p) => `${p.elemento}: ${p.spiegazione}`).join('\n'),
    tipoEsame: item.tipo,
  }));
  for (const node of nodes) {
    for (const [index, exercise] of (node.esercizi || []).entries()) {
      if (!exercise?.testo?.trim() || !exercise?.soluzione?.trim()) continue;
      items.push({ id: `${node.id}#${index}`, nodoId: node.id, nodoTitolo: node.title || node.id,
        area: node.area, tipo: 'aperta', tipoEsame: exercise.tipo_esame || 'Esercizio',
        testo: exercise.testo, soluzione: exercise.soluzione });
    }
  }
  return items;
}

export function generaProva(nodi, { seed = Date.now(), quiz = null, quanti = 12,
  now = Date.now(), durataMs = DURATA_ESAME_MS, modalita = 'simulazione' } = {}) {
  const random = seedRandom(seed);
  const pool = catalogoEsercizi(nodi, quiz);
  const buckets = new Map();
  // La banca precede le aperte: ogni area usa quesiti reali prima degli esempi del grafo.
  for (const area of [...new Set(pool.map((e) => e.area))].sort((a, b) => a - b)) {
    const areaItems = pool.filter((e) => e.area === area);
    buckets.set(area, [...mescola(areaItems.filter((e) => e.tipo !== 'aperta'), random),
      ...mescola(areaItems.filter((e) => e.tipo === 'aperta'), random)]);
  }
  const esercizi = [];
  const count = Number.isFinite(quanti) ? Math.max(1, Math.min(100, Math.floor(quanti))) : 12;
  while (esercizi.length < count && [...buckets.values()].some((b) => b.length)) {
    for (const area of mescola([...buckets.keys()], random)) {
      if (esercizi.length >= count) break;
      const item = buckets.get(area).shift();
      if (!item) continue;
      esercizi.push({ ...item,
        ...(item.opzioni ? { opzioni: mescola([...item.opzioni, ...(item.tipo === 'abbinamento' ? (item.distrattori || []).map((d, i) => ({ ...d, id: `distrattore-${i}` })) : [])], random) } : {}),
        ...(item.distrattori ? { distrattori: mescola(item.distrattori, random) } : {}),
      });
    }
  }
  return { versione: 1, generataIl: now, seed, modalita,
    durataMs: Number.isFinite(durataMs) && durataMs > 0 ? durataMs : DURATA_ESAME_MS,
    esercizi };
}
