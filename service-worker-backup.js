// ============================================
// SERVICE WORKER VAXITRACK TCHAD v2.0
// Version améliorée pour compatibilité maximum
// ============================================

const APP_VERSION = 'vaxitrack-v2.0';
const CACHE_NAME = `${APP_VERSION}-cache`;
const OFFLINE_URL = 'index.html';

// Fichiers ESSENTIELS à mettre en cache (URLs relatives)
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  // jsPDF est chargé depuis CDN, pas besoin de le cacher
];

// ========== ÉVÉNEMENT : INSTALLATION ==========
self.addEventListener('install', event => {
  console.log(`[SW ${APP_VERSION}] 📦 Installation...`);
  
  // Force l'activation IMMÉDIATE (pas d'attente)
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Mise en cache des fichiers essentiels');
        // Cache seulement les fichiers CRITIQUES
        return cache.addAll(APP_SHELL)
          .then(() => {
            console.log('[SW] ✅ Tous les fichiers en cache');
            return self.skipWaiting();
          })
          .catch(err => {
            console.log('[SW] ⚠️ Certains fichiers non cachés:', err);
            // Continue même si certains fichiers échouent
            return self.skipWaiting();
          });
      })
  );
});

// ========== ÉVÉNEMENT : ACTIVATION ==========
self.addEventListener('activate', event => {
  console.log(`[SW ${APP_VERSION}] 🎯 Activation...`);
  
  event.waitUntil(
    // 1. Nettoyer les anciens caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    // 2. Prendre le contrôle IMMÉDIAT de tous les clients
    .then(() => self.clients.claim())
    .then(() => {
      console.log('[SW] ✅ Prêt pour mode offline');
      // Notifier toutes les pages ouvertes
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_READY',
            version: APP_VERSION,
            cache: CACHE_NAME
          });
        });
      });
    })
  );
});

// ========== ÉVÉNEMENT : INTERCEPTION REQUÊTES ==========
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // STRATÉGIE : Cache First, Network Fallback
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // 1. Si dans le cache → retourne immédiatement
        if (cachedResponse) {
          console.log(`[SW] 📦 Servi depuis cache: ${url.pathname}`);
          return cachedResponse;
        }
        
        // 2. Sinon, va sur le réseau
        return fetch(request)
          .then(networkResponse => {
            // Si requête réussie ET pour notre domaine → met en cache
            if (networkResponse && 
                networkResponse.status === 200 && 
                url.origin === self.location.origin) {
              
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                  console.log(`[SW] 💾 Mis en cache: ${url.pathname}`);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log(`[SW] ❌ Échec fetch: ${url.pathname}`, error);
            
            // FALLBACKS SPÉCIFIQUES :
            
            // Pour la page principale
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Pour CSS/JS
            if (request.url.includes('.css')) {
              return new Response('/* Mode offline - CSS non disponible */', {
                headers: {'Content-Type': 'text/css'}
              });
            }
            
            // Pour images
            if (request.url.includes('.png') || request.url.includes('.jpg')) {
              return new Response('', {status: 404});
            }
            
            // Message générique offline
            return new Response(`
              <!DOCTYPE html>
              <html>
                <head><title>Mode Offline</title></head>
                <body style="font-family: Arial; padding: 20px;">
                  <h1>🌐 Pas de connexion Internet</h1>
                  <p>VaxiTrack Tchad fonctionne en mode offline.</p>
                  <p>Les données sont sauvegardées localement.</p>
                  <button onclick="location.reload()">Réessayer</button>
                </body>
              </html>
            `, {
              headers: {'Content-Type': 'text/html'}
            });
          });
      })
  );
});

// ========== ÉVÉNEMENT : MESSAGES ==========
self.addEventListener('message', event => {
  console.log('[SW] 📨 Message reçu:', event.data);
  
  switch (event.data.type) {
    case 'SKIP_WAITING':
      console.log('[SW] 🔄 Activation immédiate demandée');
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      event.ports[0].postMessage({
        version: APP_VERSION,
        cacheName: CACHE_NAME
      });
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME)
        .then(() => {
          event.ports[0].postMessage({success: true});
        });
      break;
  }
});

// ========== ÉVÉNEMENT : SYNC ==========
self.addEventListener('sync', event => {
  console.log('[SW] 🔄 Synchronisation:', event.tag);
  
  if (event.tag === 'sync-vaccinations') {
    event.waitUntil(syncVaccinations());
  }
});

// Fonction de synchronisation (exemple)
function syncVaccinations() {
  console.log('[SW] Tentative de sync des données...');
  // Ici, tu pourrais sync avec ton API
  return Promise.resolve();
}