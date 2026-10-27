// Grafo interattivo (Cytoscape.js + dagre locali). Dipende solo da dati e callback.
import { edges } from '../core/topo.js';
import { prerequisitePath } from '../core/prereq-path.js';
import { areaColor, TIPO_SHAPE, PRIO_SIZE } from '../config.js';
import { LIVELLI } from '../core/mastery.js';
import { nodiLocali, vicinoDaTastiera } from '../core/graph-navigation.js';

export function createGraphView(container, graph, { onSelect, onOpen }) {
  const cy = globalThis.cytoscape;
  if (!cy) {
    container.textContent = 'Grafo non disponibile: usa la vista elenco o la scheda Percorso.';
    return { update() {}, select() {}, resize() {}, setTheme() {}, fit() {}, zoomBy() {}, cytoscape: null };
  }
  const els = [
    ...graph.nodi.map((n) => {
      const size = PRIO_SIZE[n.priorita?.livello] || PRIO_SIZE.media;
      return { data: { id: n.id, label: `A${n.area} · ${n.title}\n○ Non iniziato`, title: n.title, area: n.area, color: areaColor(n.area), shape: TIPO_SHAPE[n.tipo], w: size, h: size } };
    }),
    ...edges(graph.nodi).map((e) => ({ data: { id: `${e.source}->${e.target}`, source: e.source, target: e.target }, classes: e.forza })),
  ];
  let hasDagre = false;
  try { hasDagre = !!cy('layout', 'dagre'); } catch { /* estensione assente */ }
  const g = cy({
    container, elements: els, wheelSensitivity: 0.3, textureOnViewport: true, hideEdgesOnViewport: true, minZoom: 0.15, maxZoom: 2,
    // Contenitore largo -> ranghi in righe (TB); stretto/alto (mobile) -> ranghi in colonne (LR).
    layout: hasDagre ? { name: 'dagre', rankDir: container.clientWidth > container.clientHeight ? 'TB' : 'LR', nodeSep: 45, rankSep: 90, avoidOverlap: true, nodeDimensionsIncludeLabels: true } : { name: 'breadthfirst', directed: true },
    style: [
      { selector: 'node', style: { 'background-color': 'data(color)', shape: 'data(shape)', label: 'data(label)', 'font-size': 15, 'min-zoomed-font-size': 0, 'text-wrap': 'wrap', 'text-max-width': 180, 'text-valign': 'bottom', 'text-margin-y': 4, width: 'data(w)', height: 'data(h)', color: '#1c1917', 'text-background-color': '#fffcf7', 'text-background-opacity': 1, 'tooltip': 'data(label)' } },
      { selector: 'node.done', style: { 'border-width': 4, 'border-color': '#15803d' } },
      { selector: 'node:selected', style: { 'border-width': 4, 'border-color': '#1c1917', 'overlay-opacity': 0.08 } },
      { selector: 'node.on-path', style: { opacity: 1, 'border-width': 4, 'border-color': '#1e3a8a', 'z-index': 10 } },
      { selector: 'edge', style: { width: 1.6, 'curve-style': 'bezier', 'target-arrow-shape': 'triangle', 'line-color': '#78716c', 'target-arrow-color': '#78716c' } },
      { selector: 'edge.soft', style: { 'line-style': 'dashed', 'line-dash-pattern': [6, 4] } },
      { selector: 'edge.on-path', style: { width: 3.2, opacity: 1, 'line-color': '#1e3a8a', 'target-arrow-color': '#1e3a8a', 'z-index': 9 } },
      { selector: '.faded, edge.hidden-edge', style: { display: 'none' } },
    ],
  });
  g.on('tap', 'node', (ev) => onSelect(ev.target.id()));
  let currentId = null, visibleIds = new Set(graph.order), initialized = false;
  const api = {
    update({ visible, done, selected, mastery = new Map(), depth = 'tutto', soloPrerequisiti = false, forze = new Set(['hard', 'soft']) }) {
      const locali = nodiLocali(graph.nodi, selected, depth, soloPrerequisiti);
      visibleIds = new Set([...visible].filter((id) => locali.has(id)));
      const path = selected ? prerequisitePath(graph.nodi, selected) : { nodeIds: new Set(), edgeIds: new Set() };
      g.batch(() => {
        g.nodes().forEach((n) => {
          const on = path.nodeIds.has(n.id());
          const livello = LIVELLI[mastery.get(n.id())] || LIVELLI['non-iniziato'];
          n.data('label', `A${n.data('area')} · ${n.data('title')}\n${livello.icona} ${livello.etichetta}`);
          n.toggleClass('faded', (!visible.has(n.id()) || !locali.has(n.id())) && n.id() !== selected);
          n.toggleClass('done', done.has(n.id()));
          n.toggleClass('on-path', on);
        });
        g.edges().forEach((e) => {
          const on = path.edgeIds.has(e.id());
          const forza = e.hasClass('soft') ? 'soft' : 'hard';
          const shown = forze.has(forza) && locali.has(e.source().id()) && locali.has(e.target().id()) && visible.has(e.source().id()) && visible.has(e.target().id());
          e.toggleClass('hidden-edge', !forze.has(forza));
          e.toggleClass('faded', !shown);
          e.toggleClass('on-path', on);
        });
      });
      this.select(selected);
    },
    select(id) {
      if ((id || null) === currentId) return;
      currentId = id || null;
      g.$(':selected').unselect();
      if (!id) return;
      const n = g.getElementById(id);
      if (n.nonempty()) { n.select(); g.animate({ center: { eles: n } }, { duration: 200 }); }
    },
    resize() {
      g.resize();
      // Una mappa intera adattata a molti nodi ha testo illeggibile. Apri al
      // livello di lettura, centrando il primo nodo; «Adatta» resta disponibile.
      if (!initialized && g.width() > 1 && g.height() > 1) {
        initialized = true;
        g.zoom(Math.min(g.maxZoom(), Math.max(0.9, g.zoom())));
        const first = graph.order[0] ? g.getElementById(graph.order[0]) : null;
        if (first?.nonempty()) g.center(first);
      }
    },
    fit() { g.resize(); g.fit(undefined, 28); },
    zoomBy(factor) {
      const level = Math.min(g.maxZoom(), Math.max(g.minZoom(), g.zoom() * factor));
      g.zoom({ level, renderedPosition: { x: g.width() / 2, y: g.height() / 2 } });
    },
    cytoscape: g,
    setTheme(theme) {
      const dark = theme === 'dark';
      g.style()
        .selector('node').style({ color: dark ? '#f5f5f4' : '#1c1917', 'text-background-color': dark ? '#1c1f27' : '#fffcf7' })
        .selector('node:selected').style({ 'border-color': dark ? '#f5f5f4' : '#1c1917' })
        .selector('edge').style({ 'line-color': dark ? '#a8a29e' : '#78716c', 'target-arrow-color': dark ? '#a8a29e' : '#78716c' })
        .selector('node.on-path').style({ 'border-color': dark ? '#fbbf24' : '#1e3a8a' })
        .selector('edge.on-path').style({ 'line-color': dark ? '#fbbf24' : '#1e3a8a', 'target-arrow-color': dark ? '#fbbf24' : '#1e3a8a' })
        .update();
    },
  };
  container.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target !== container) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      const next = vicinoDaTastiera(graph.nodi, graph.order, currentId, e.key, visibleIds);
      if (next) onSelect(next, { keepFocus: true });
    } else if (e.key === '+' || e.key === '=') api.zoomBy(1.25);
    else if (e.key === '-' || e.key === '_') api.zoomBy(1 / 1.25);
    else if (e.key === 'a' || e.key === 'A' || e.key === 'Home') api.fit();
    else if (e.key === 'Enter' && currentId && onOpen) onOpen(currentId);
    else return;
    e.preventDefault();
  });
  return api;
}
