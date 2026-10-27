import { h, clear } from './dom.js';
import { areaColor, TIPO_ICON, TIPO_LABEL } from '../config.js';
import { LIVELLI } from '../core/mastery.js';

export function legendaAttiva(key, value, filters, forze) {
  if (key === 'forze') return forze.has(value);
  if (key === 'soloNonPadroneggiati') return Boolean(filters.soloNonPadroneggiati);
  return Boolean(filters[key]?.has(key === 'aree' ? Number(value) : value));
}

/** Legenda con pulsanti che pilotano gli stessi filtri della barra laterale. */
export function createGraphLegend(root, graph, { onFilter, onEdge, onDepth, onPrereq, onCenter }) {
  const button = (key, val, label, extra = {}) => h('button', { type: 'button', class: 'btn legend-item',
    'data-legend': key, 'data-value': String(val), 'aria-pressed': 'false', onclick: () => key === 'forze' ? onEdge(val) : onFilter(key, val), ...extra }, label);
  clear(root).append(
    h('summary', {}, 'Legenda e filtri del grafo'),
    h('p', { class: 'muted' }, 'I pulsanti filtrano il grafo, il percorso e l’elenco. Le forme indicano il tipo; le etichette mostrano area e padronanza.'),
    h('p', { class: 'muted' }, '[F1] Fonte ufficiale documentata in docs/research/R3-programma-esame.md.'),
    h('div', { class: 'legend-group' }, h('strong', {}, 'Aree'),
      ...graph.aree.map((a) => button('aree', a.id, `A${a.id} · ${a.titolo}${a.id === 7 ? ' — serve per la lode [F1]' : ''}`, { style: `--legend-color:${areaColor(a.id)}` }))),
    h('div', { class: 'legend-group' }, h('strong', {}, 'Tipi'), ...Object.entries(TIPO_LABEL).map(([id, label]) => button('tipi', id, `${TIPO_ICON[id]} ${label}`))),
    h('div', { class: 'legend-group' }, h('strong', {}, 'Archi'), button('forze', 'hard', 'Linea continua: indispensabile'), button('forze', 'soft', 'Linea tratteggiata: utile')),
    h('div', { class: 'legend-group' }, h('strong', {}, 'Padronanza'),
      h('span', {}, Object.values(LIVELLI).map((l) => `${l.icona} ${l.etichetta}`).join(' · ')),
      button('soloNonPadroneggiati', 'true', 'Solo non padroneggiati')),
    h('div', { class: 'legend-group' },
      h('label', {}, 'Intorno al nodo selezionato ', h('select', { id: 'graph-depth', onchange: (e) => onDepth(e.target.value) },
        h('option', { value: 'tutto' }, 'Tutto'), h('option', { value: '1' }, 'Profondità 1'), h('option', { value: '2' }, 'Profondità 2'))),
      h('label', { class: 'check' }, h('input', { id: 'graph-prereq-only', type: 'checkbox', onchange: (e) => onPrereq(e.target.checked) }), ' Solo catena dei prerequisiti'),
      h('button', { type: 'button', class: 'btn', id: 'graph-center-next', onclick: onCenter }, 'Centra il prossimo da studiare')),
  );
  return { update({ filters, forze }) {
    for (const b of root.querySelectorAll('[data-legend]')) {
      const { legend: key, value } = b.dataset;
      const active = legendaAttiva(key, value, filters, forze);
      b.setAttribute('aria-pressed', String(Boolean(active)));
    }
  } };
}
