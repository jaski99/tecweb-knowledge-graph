// Progresso per area e totale con tempo residuo.
import { h, clear } from './dom.js';
import { computeProgress, formatMinuti, masteryProgress } from '../core/progress.js';
import { areaColor } from '../config.js';

const bar = (label, r, color) => h('div', { class: 'prog' },
  h('div', { class: 'prog-label' }, h('span', {}, label), h('span', {}, `${r.fatti}/${r.totale} · ${r.perc}% · restano ${formatMinuti(r.minResidui)}`)),
  h('progress', { max: 100, value: r.perc, style: color ? `--c:${color}` : null, 'aria-label': `${label}: ${r.perc}%` }));

export function createProgressView(root, graph) {
  return {
    render({ done, mastery = new Map() }) {
      const m = masteryProgress(graph.nodi, mastery);
      const p = computeProgress(graph.nodi, graph.aree, done);
      clear(root).append(
        bar('Totale', p.totale),
        h('p', { class: 'muted', id: 'mastery-group-a' }, `Gruppo A padroneggiato: ${m.padroneggiati}/${m.totale} (${m.percentuale}%).`),
        h('details', { class: 'mastery-explanation' }, h('summary', {}, 'Come si calcola la padronanza'),
          h('p', { class: 'muted' }, 'È un indicatore di studio, non un voto. La spunta o la checklist valgono «Visto»; una risposta riuscita o una carta avviata dà «Familiare». Due quesiti distinti riusciti o due carte stabili danno «Sicuro». Per «Padroneggiato» servono tre quesiti distinti corretti in almeno due giorni e tutte le carte stabili. Un errore quiz recente o «Ancora» riporta a «Visto». Le soglie sono scelte dell’app, non garanzie d’esame.')),

        ...p.aree.map((a) => bar(`${a.area.id}. ${a.area.titolo}`, a, areaColor(a.area.id))));
    },
  };
}
