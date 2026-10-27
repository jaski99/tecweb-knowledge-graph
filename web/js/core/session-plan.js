// Piano indicativo, puro e deterministico. Date, esiti e preferenze sono iniettati.
import { diffDaysIso, isIsoDay } from '../../modules/ripasso/giorni.js';
import { codaStudio, interleaving } from '../../modules/ripasso/mazzo.js';
import { nuoveDisponibili } from '../../modules/ripasso/store.js';
import { prerequisitiSoddisfatti } from './study-state.js';

export const BUDGET_SESSIONE = [25, 50, 90];

export function pianoOggi({ nodi = [], ordine = [], padronanza = new Map(), statiStudio = {}, carte = [], datiRipasso, oggi, dataEsame = '', budget = 25 }) {
  if (!isIsoDay(oggi)) throw new TypeError('Il piano richiede una data valida');
  const dati = datiRipasso || { carte: {}, limiteNuove: 20, nuovePerGiorno: {}, versione: 1 };
  const byId = new Map(nodi.map((n) => [n.id, n]));
  const disponibili = ordine.map((id) => byId.get(id)).filter((n) => n && padronanza.get(n.id) !== 'padroneggiato' && prerequisitiSoddisfatti(n, statiStudio));
  const prossimo = disponibili.find((n) => !['completato', 'so-gia'].includes(statiStudio[n.id]))
    || disponibili.find((n) => statiStudio[n.id] !== 'so-gia') || null;
  const coda = codaStudio(carte, dati.carte, oggi, { maxNuove: nuoveDisponibili(dati, oggi, carte) });
  const dovute = coda.filter((c) => dati.carte?.[c.id]?.revisioni > 0);
  const nuove = coda.length - dovute.length;
  const viste = new Set(nodi.filter((n) => (padronanza.get(n.id) || 'non-iniziato') !== 'non-iniziato' || statiStudio[n.id]).map((n) => n.id));
  for (const c of carte) if (dati.carte?.[c.id]?.revisioni > 0) viste.add(c.nodoId);
  const candidati = carte.filter((c) => viste.has(c.nodoId) && c.domanda && c.risposta)
    .slice().sort((a, b) => (a.area ?? Infinity) - (b.area ?? Infinity) || a.nodoId.localeCompare(b.nodoId) || a.id.localeCompare(b.id));
  const limite = budget === 90 ? 6 : budget === 50 ? 4 : 3;
  // Una carta per nodo: mai due consecutive dello stesso nodo, anche con poche aree.
  const nodiScelti = new Set();
  const spirale = interleaving(candidati).filter((c) => {
    if (nodiScelti.has(c.nodoId)) return false;
    nodiScelti.add(c.nodoId); return true;
  }).slice(0, limite);
  const rimanenti = nodi.filter((n) => !['completato', 'so-gia'].includes(statiStudio[n.id]));
  const minuti = (ns) => ns.reduce((sum, n) => sum + (Number.isFinite(n.tempo_studio_min) ? n.tempo_studio_min : 0), 0);
  const minResidui = minuti(rimanenti);
  const minA = minuti(rimanenti.filter((n) => n.gruppo === 'A'));
  const giorni = isIsoDay(dataEsame) ? diffDaysIso(oggi, dataEsame) : null;
  return { prossimo, dovute, nuove, spirale, minResidui, minA, giorni,
    ritmo: giorni > 0 ? Math.ceil(minResidui / giorni) : null,
    avvisoA: giorni > 0 && minA > giorni * budget };
}
