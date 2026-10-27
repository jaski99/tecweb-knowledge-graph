import { filtraPerModulo } from './modulo-ia.js';
// Correzione per identificatori stabili. Nessuna esecuzione di codice dell'utente.
export function rispostaCompleta(item, risposta) {
  if (item.tipo === 'abbinamento') return item.abbinamenti.every((_, i) => Boolean(risposta?.[i]));
  if (item.tipo === 'completamento_codice') return Object.keys(item.soluzioni).every((k) => String(risposta?.[k] || '').trim());
  return risposta !== undefined && risposta !== null && String(risposta).trim() !== '';
}
export function correggi(item, risposta) {
  if (item.tipo === 'aperta' || !item.tipo) return null;
  if (!rispostaCompleta(item, risposta)) return false;
  if (item.tipo === 'abbinamento') return item.abbinamenti.every((p, i) => risposta[i] === p.risposta_id);
  if (item.tipo === 'completamento_codice') return Object.entries(item.soluzioni)
    .every(([k, varianti]) => varianti.some((v) => v.trim() === String(risposta[k]).trim()));
  return risposta === item.risposta_corretta;
}
export function esitiItem(item, risposta, modalita, ts) {
  if (item.tipo === 'abbinamento') return item.abbinamenti.map((p, i) => ({
    item_id: item.id, nodo_id: p.nodo_id, corretto: risposta?.[i] === p.risposta_id, modalita, ts,
  }));
  const corretto = correggi(item, risposta);
  return corretto === null ? [] : [{ item_id: item.id, nodo_id: item.nodoId, corretto, modalita, ts }];
}
export function reportAree(items, risposte, { includiIA = false } = {}) {
  const areas = new Map();
  for (const item of filtraPerModulo(items, includiIA)) {
    if (!areas.has(item.area)) areas.set(item.area, { area: item.area, totale: 0, corretti: 0, aperte: 0, nodi: new Set() });
    const row = areas.get(item.area);
    row.totale += 1;
    const result = correggi(item, risposte[item.id]);
    if (result === null) row.aperte += 1;
    else if (result) row.corretti += 1;
    else if (item.tipo === 'abbinamento') item.abbinamenti.forEach((p, i) => {
      if (risposte[item.id]?.[i] !== p.risposta_id) row.nodi.add(p.nodo_id);
    });
    else if (item.nodoId) row.nodi.add(item.nodoId);
  }
  return [...areas.values()].sort((a, b) => a.area - b.area).map((r) => ({ ...r, nodi: [...r.nodi] }));
}
