import { h } from './dom.js';
import { areaColor, TIPO_LABEL, TIPO_ICON, PRIO_LABEL } from '../config.js';
import { LIVELLI } from '../core/mastery.js';

export const areaBadge = (n, aree) => h('span', { class: 'badge area', style: `--c:${areaColor(n.area)}`, title: aree.find((a) => a.id === n.area)?.titolo }, `A${n.area}${n.area === 7 ? ' · serve per la lode [F1]' : ''}`);
export const tipoBadge = (n) => h('span', { class: 'badge tipo' }, h('span', { 'aria-hidden': 'true' }, TIPO_ICON[n.tipo] + ' '), TIPO_LABEL[n.tipo]);
export const prioBadge = (n) => h('span', { class: `badge prio prio-${n.priorita.livello}` }, 'Priorità ' + PRIO_LABEL[n.priorita.livello]);

export const masteryBadge = (livello = 'non-iniziato') => {
  const info = LIVELLI[livello] || LIVELLI['non-iniziato'];
  return h('span', { class: 'badge mastery', title: 'Indicatore di studio, non voto' }, `${info.icona} ${info.etichetta}`);
};
