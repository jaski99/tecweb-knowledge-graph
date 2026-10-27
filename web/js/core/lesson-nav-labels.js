// Etichette della navigazione precedente/successivo della lezione (logica pura, testabile in Node).
const WORDS = {
  prev: { full: 'Precedente', short: 'Prec.', none: 'Nessuna lezione precedente' },
  next: { full: 'Successivo', short: 'Succ.', none: 'Nessuna lezione successiva' },
};

/** Titolo accorciato a parola intera, con ellissi, per stare in un pulsante. */
export function shortTitle(text, max = 28) {
  const t = String(text ?? '').trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return (space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.–—-]+$/, '') + '…';
}

/** Testi visibili e aria-label per una direzione ('prev' | 'next'); targetTitle null = nessuna lezione. */
export function navLabel(dir, targetTitle) {
  const w = WORDS[dir];
  if (!w) throw new Error(`Direzione sconosciuta: ${dir}`);
  if (targetTitle == null) return { full: w.full, short: w.short, title: '', aria: w.none };
  return { full: w.full, short: w.short, title: shortTitle(targetTitle), aria: `${w.full}: ${targetTitle}` };
}
