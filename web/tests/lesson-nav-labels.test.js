import { test } from 'node:test';
import assert from 'node:assert/strict';
import { navLabel, shortTitle } from '../js/core/lesson-nav-labels.js';
import { sectionLabel } from '../js/ui/toc.js';

test('navLabel dà testo visibile e aria-label con il titolo', () => {
  const p = navLabel('prev', 'HTTP: metodi e codici di stato');
  assert.equal(p.full, 'Precedente');
  assert.equal(p.short, 'Prec.');
  assert.equal(p.aria, 'Precedente: HTTP: metodi e codici di stato');
  assert.ok(p.title.length <= 28);
  const n = navLabel('next', 'REST');
  assert.deepEqual([n.full, n.short, n.title, n.aria], ['Successivo', 'Succ.', 'REST', 'Successivo: REST']);
});

test('navLabel senza destinazione resta descrittivo', () => {
  assert.equal(navLabel('prev', null).aria, 'Nessuna lezione precedente');
  assert.equal(navLabel('next', null).title, '');
  assert.throws(() => navLabel('su', 'x'));
});

test('shortTitle taglia a parola intera con ellissi', () => {
  assert.equal(shortTitle('  Breve  '), 'Breve');
  const t = shortTitle('Cookie, sessioni e stato in un protocollo senza stato');
  assert.ok(t.endsWith('…') && t.length <= 28, t);
  assert.ok(!/[ ,]…$/.test(t));
});

test("l'indice usa la stessa etichetta del primo titolo della lezione", () => {
  assert.equal(sectionLabel('sec-intuizione'), 'Perché ti serve');
});
