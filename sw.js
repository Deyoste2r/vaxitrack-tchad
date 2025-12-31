// Service Worker pour VaxiTrack Tchad
const CACHE_NAME = 'vaxitrack-cache-v1.0.0';
const APP_SHELL = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap'
];

// Installation et mise en cache
self.addEventListener('install', event => {
    console.log('[Service Worker] Installation...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Mise en cache des fichiers essentiels');
                return cache.addAll(APP_SHELL);
            })
            .then(() => self.skipWaiting())
    );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activation...');
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

// Stratégie: Cache First, avec fallback réseau
self.addEventListener('fetch', event => {
    // Ne pas intercepter les requêtes de synchronisation
    if (event.request.url.includes('mocky.io') || 
        event.request.url.includes('api/sync')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourner depuis le cache si disponible
                if (response) {
                    return response;
                }
                
                // Sinon, aller sur le réseau
                return fetch(event.request)
                    .then(networkResponse => {
                        // Mettre à jour le cache pour les futures requêtes
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            });
                    })
                    .catch(() => {
                        // Fallback pour les pages HTML
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Gestion des messages depuis l'application
self.addEventListener('message', event => {
    if (event.data.type === 'CACHE_DATA') {
        console.log('[Service Worker] Données à mettre en cache:', event.data.key);
        // Stocker des données dans IndexedDB via le Service Worker si nécessaire
    }
});