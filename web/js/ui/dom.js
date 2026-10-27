// Helper DOM: niente innerHTML con dati, quindi niente XSS.
// I figli null, undefined o false sono "assenti": Element.append li scriverebbe
// come testo letterale ('null'), quindi ogni inserimento passa da append().
const presente = (c) => c != null && c !== false;
const nodo = (c) => (c.nodeType ? c : String(c));

export function append(el, ...children) {
  el.append(...children.flat(Infinity).filter(presente).map(nodo));
  return el;
}

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  return append(el, ...children);
}
export const clear = (el) => { el.replaceChildren(); return el; };
/** Sostituisce il contenuto di el con i figli presenti. */
export const fill = (el, ...children) => append(clear(el), ...children);
