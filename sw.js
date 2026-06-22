// sw.js — Service Worker for Vault Money Manager PWA
// This enables offline functionality and caches assets

const CACHE_NAME = 'vault-v1';

// List all static assets your app needs when offline
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/Transaction.js',
  '/js/StorageManager.js',
  '/js/TransactionManager.js',
  '/js/FormValidator.js',
  '/js/UIManager.js',
  '/js/ChartManager.js',
  '/js/FilterManager.js',
  '/js/ExportManager.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // External CDN resources (optional, for offline fallback)
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Syne:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

// Install event: cache all listed assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app assets...');
      // Cache only local assets; external CDN might fail, and that's okay
      const localAssets = ASSETS_TO_CACHE.filter(asset => !asset.includes('http'));
      return cache.addAll(localAssets).catch((err) => {
        console.warn('[Service Worker] Some assets could not be cached:', err);
      });
    })
  );
  // Force the service worker to become active immediately
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

  // Skip non-GET requests and external API calls (keep them live)
  if (request.method !== 'GET') {
    return;
  }

  // For external APIs or cross-origin requests, try network first
  if (request.url.includes('http') && !request.url.includes(self.location.origin)) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Offline: return a fallback or cached version
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
          // If offline and not in cache, show a fallback page
          console.warn(`[Service Worker] Offline, and ${request.url} not in cache`);
          // Optionally: return a custom offline page
          // return caches.match('/offline.html');
        });
    })
  );
});
