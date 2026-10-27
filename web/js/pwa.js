// Stato della rete e registrazione PWA, con dipendenze iniettabili.
export function testoRete(online) {
  return online ? '' : 'Sei offline: puoi usare i contenuti già salvati su questo dispositivo.';
}

export function avviaPWA({ win, nav, status }) {
  const aggiorna = () => {
    status.textContent = testoRete(nav.onLine);
    status.hidden = Boolean(nav.onLine);
  };
  aggiorna();
  win.addEventListener('online', aggiorna);
  win.addEventListener('offline', aggiorna);
  if ('serviceWorker' in nav) {
    // La pagina resta utilizzabile anche se la registrazione è rifiutata.
    nav.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).catch(() => {});
  }
  return () => { win.removeEventListener('online', aggiorna); win.removeEventListener('offline', aggiorna); };
}
