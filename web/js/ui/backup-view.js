import { h, clear } from './dom.js';
import { creaBackup, importaBackup, validaBackup } from '../core/backup.js';
import { scaricaFile } from './download.js';

export function createBackupView(root, { storage, getEsitiReader, confirm, reload }) {
  let status = '';
  const draw = () => {
    clear(root).append(h('summary', {}, 'I tuoi dati'),
      h('p', { class: 'muted' }, 'I dati restano nel browser. Il backup contiene progresso, ripasso, checklist, preferenze e, se disponibili, esiti e simulatore.'),
      h('div', { class: 'data-actions' },
        h('button', { type: 'button', class: 'btn', id: 'backup-export', onclick: () => {
          try {
            const backup = creaBackup(storage, getEsitiReader());
            scaricaFile(root.ownerDocument, 'tecweb-backup.json', JSON.stringify(backup, null, 2), 'application/json');
            status = 'Backup esportato.';
          } catch (e) { status = e.message; }
          draw();
        } }, 'Esporta backup JSON'),
        h('label', { class: 'btn backup-import-label' }, 'Importa backup JSON', h('input', {
          id: 'backup-import', type: 'file', accept: '.json,application/json',
          onchange: async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) { status = 'File troppo grande.'; draw(); return; }
            try {
              const text = await file.text();
              // Il contenuto è controllato prima di chiedere conferma e di scrivere.
              const backup = validaBackup(text);
              if (!confirm('Importare il backup? Le chiavi presenti nel file sovrascriveranno quelle attuali; le altre resteranno invariate.')) return;
              const numero = importaBackup(storage, backup, getEsitiReader());
              status = `Importate ${numero} chiavi. Ricarico l’applicazione.`; draw(); reload();
            } catch (err) { status = err.message; draw(); }
          },
        }))),
      h('p', { role: 'status', class: 'muted' }, status));
  };
  draw();
}
