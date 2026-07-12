// sw.js — Service Worker for Vault Money Manager PWA
// Fixed: Proper local vs external asset filtering for GitHub Pages deployment

const CACHE_NAME = 'vault-v1';

// List all static assets your app needs when offline
// Local paths use absolute URLs (will be relative to deployment root)
const ASSETS_TO_CACHE = [
  '/Vault/',
  '/Vault/index.html',
  '/Vault/css/style.css',
  '/Vault/js/app.js',
  '/Vault/js/Transaction.js',
  '/Vault/js/StorageManager.js',
  '/Vault/js/TransactionManager.js',
  '/Vault/js/FormValidator.js',
  '/Vault/js/UIManager.js',
  '/Vault/js/ChartManager.js',
  '/Vault/js/FilterManager.js',
  '/Vault/js/ExportManager.js',
  '/Vault/manifest.json',
  '/Vault/icon-192.png',
  '/Vault/icon-512.png',
  // External CDNs - these will be network-first, not cached on install
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Syne:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

// Install event: cache all local assets safely
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app assets...');

      // FIX: Correctly separate local paths from external CDNs
      const localAssets = ASSETS_TO_CACHE.filter(asset => {
        // If it starts with '/' it's definitely a local absolute path
        if (asset.startsWith('/')) return true;
        
        // If it's a URL, check if it matches our deployment domain origin
        try {
          const url = new URL(asset);
          return url.origin === self.location.origin;
        } catch (e) {
          return false;
        }
      });

      console.log('[Service Worker] Local assets to cache:', localAssets.length);
      console.log('[Service Worker] External CDNs (will use network):', ASSETS_TO_CACHE.length - localAssets.length);

      return cache.addAll(localAssets).catch((err) => {
        console.error('[Service Worker] CRITICAL: Core local assets failed to cache!', err);
        throw err; // Re-throw so installation fails properly if locals fail
      });
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old cache versions
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For external APIs or cross-origin requests, try network first
  if (request.url.includes('http') && !request.url.includes(self.location.origin)) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache successful responses from external sources
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline: return cached version if available
          return caches.match(request);
        })
    );
    return;
  }

  // For local resources: cache first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      // Return cached version if available
      if (response) {
        console.log(`[Service Worker] Serving from cache: ${request.url}`);
        return response;
      }

      // Otherwise, try to fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Cache the new response if it's successful
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and not in cache
          console.warn(`[Service Worker] Offline, and ${request.url} not in cache`);
        });
    })
  );
});
