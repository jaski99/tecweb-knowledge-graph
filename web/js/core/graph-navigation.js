// Operazioni sul grafo accessibili anche senza Cytoscape.
import { edges } from './topo.js';

/** Prerequisiti/successori seguendo gli archi; ordinamento stabile topologico. */
export function vicinoDaTastiera(nodes, order, corrente, tasto, visible) {
  const allowed = new Set(visible || nodes.map((n) => n.id));
  if (!corrente || !allowed.has(corrente)) return order.find((id) => allowed.has(id)) || null;
  const es = edges(nodes);
  const aMonte = tasto === 'ArrowLeft' || tasto === 'ArrowUp';
  const aValle = tasto === 'ArrowRight' || tasto === 'ArrowDown';
  if (!aMonte && !aValle) return null;
  const candidati = new Set(es.filter((e) => aMonte ? e.target === corrente : e.source === corrente)
    .map((e) => aMonte ? e.source : e.target).filter((id) => allowed.has(id)));
  const ordered = order.filter((id) => candidati.has(id));
  return (aMonte ? ordered.at(-1) : ordered[0]) || corrente;
}

/** Intorno fino alla profondità scelta; solo prerequisiti segue gli archi a monte. */
export function nodiLocali(nodes, id, depth = 'tutto', soloPrerequisiti = false) {
  const all = new Set(nodes.map((n) => n.id));
  if (!id || !all.has(id)) return all;
  if (depth === 'tutto' && !soloPrerequisiti) return all;
  const limit = depth === 'tutto' ? Infinity : Math.max(0, Number(depth) || 0);
  const es = edges(nodes), visitati = new Set([id]);
  let livello = [id];
  for (let d = 0; livello.length && d < limit; d++) {
    const next = [];
    for (const current of livello) for (const e of es) {
      const other = e.target === current ? e.source : !soloPrerequisiti && e.source === current ? e.target : null;
      if (other && all.has(other) && !visitati.has(other)) { visitati.add(other); next.push(other); }
    }
    livello = next;
  }
  return visitati;
}
