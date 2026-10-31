/**
 * SERVICE WORKER — ATELIER NOZZE M&M
 * Abilita funzionamento offline 100% su iPhone e caching intelligente
 */

const CACHE_NAME = 'nozze-mm-v2027-v11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/data.js',
  './js/domain/entities.js',
  './js/services/formatters.js',
  './js/repositories/expense-repository.js',
  './js/usecases/usecases.js',
  './js/ui/views.js',
  './js/main.js'
];

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
  // Network-first: prova sempre a prendere la versione fresca dal server (GitHub)
  // Se sei offline, ripiega sulla cache
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
      }
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
