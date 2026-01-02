// service-worker.js
const CACHE_NAME = 'vaxitrack-v2-cache';
const OFFLINE_URL = '/vaxitrack-tchad/index.html';
const STATIC_ASSETS = [
  '/vaxitrack-tchad/',
  '/vaxitrack-tchad/index.html',
  '/vaxitrack-tchad/app.js',
  '/vaxitrack-tchad/style.css',
  '/vaxitrack-tchad/manifest.json'
];

// Installation
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Mise en cache des ressources');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  // Pas de cache pour les API
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Ressource depuis cache:', event.request.url);
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Ne cache que les succès
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Mode offline: retourne la page principale
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('Mode hors ligne');
        });
      })
  );
});