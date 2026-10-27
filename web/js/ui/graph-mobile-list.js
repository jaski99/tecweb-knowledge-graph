import { h, clear, append } from './dom.js';
import { LIVELLI } from '../core/mastery.js';

export function graphMobileEntries(nodes, visible, done) {
  return nodes
    .filter((node) => visible.has(node.id))
    .map((node) => ({ id: node.id, title: node.title, area: node.area, done: done.has(node.id) }));
}

export function createGraphMobileList(container, graph, { onSelect, onOpen }) {
  return {
    update({ visible, done, selected, mastery = new Map() }) {
      const active = container.ownerDocument.activeElement?.dataset?.nodeId;
      clear(container);
      const entries = graphMobileEntries(graph.nodi, visible, done);
      append(container,
        h('h3', {}, `Elenco dei concetti (${entries.length})`),
        h('p', { class: 'muted' }, 'Alternativa testuale al grafo: seleziona un elemento per i dettagli o apri direttamente la lezione.'),
        h('ul', { class: 'graph-mobile-items' }, entries.map((entry) =>
          h('li', { class: entry.done ? 'graph-mobile-row done' : 'graph-mobile-row' },
            h('button', {
              type: 'button', class: 'graph-mobile-item',
              'aria-pressed': entry.id === selected ? 'true' : 'false', 'data-node-id': entry.id,
              onclick: () => onSelect(entry.id),
            }, h('span', { class: 'list-area' }, `A${entry.area}${entry.area === 7 ? ' · serve per la lode [F1]' : ''}`), ' ', entry.title,
              h('span', { class: 'list-mastery' }, ` · ${(LIVELLI[mastery.get(entry.id)] || LIVELLI['non-iniziato']).etichetta}`)),
            h('button', {
              type: 'button', class: 'graph-mobile-open btn',
              'aria-label': `Apri la lezione: ${entry.title}`,
              onclick: () => onOpen(entry.id),
            }, 'Lezione')))));
      if (active) container.querySelector(`[data-node-id="${CSS.escape(active)}"]`)?.focus({ preventScroll: true });
    },
  };
}
