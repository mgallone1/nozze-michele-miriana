/**
 * SERVICE WORKER — ATELIER NOZZE M&M
 * Abilita funzionamento offline 100% su iPhone e auto-aggiornamento immediato
 */

const CACHE_NAME = 'nozze-mm-v2027-v12';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora richieste non-GET o verso le API cloud di Supabase
  if (event.request.method !== 'GET' || event.request.url.includes('supabase.co')) {
    return;
  }

  // Network-First con Cache-Busting: tenta sempre di ottenere il file fresco da internet
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
      }
      return networkResponse;
    }).catch(() => {
      // Se offline su iPhone, ripiega istantaneamente sulla versione in cache
      return caches.match(event.request);
    })
  );
});
