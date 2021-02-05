"use strict";

/*
Based on https://developers.google.com/web/ilt/pwa/introduction-to-service-worker
https://web.dev/offline-cookbook/#on-activate
*/

const CACHE_VERSION = '2021-01-31-a'; // Change version to force cache refresh on clients
const CACHE_FILES = [
    '/app/index.html',
    '/app/page2.html',
    '/app/offline.html',
    '/app/main.js'
];
const OFFLINE_URL = '/app/offline.html';

console.error('[service-worker.js] loaded');

self.addEventListener('install', function (event) {
    /* Cache files ready for offline use */
    console.error('[service-worker.js] install: start');
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return cache.addAll(CACHE_FILES)
            .then(function(res) {
                console.error('[service-worker.js] install: successful');
            })
            .catch(function (error) {
                console.error('[service-worker.js] install: error: ',error);
            });
        }),
    );
});


self.addEventListener('activate', function (event) {
    /* Once activated, the service worker controls all pages that load within its scope, 
    and starts listening for events from those pages. During activation, other events 
    such as fetch are put into a queue, so a long activation could potentially block 
    page loads. Keep your activation as lean as possible, and only use it for things
    you couldn't do while the old version was active. */
    console.error('[service-worker.js] activated');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    // Delete any caches that don't match the current version
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    /* FROM https://googlechrome.github.io/samples/service-worker/custom-offline-page/ */
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    console.log("[service-worker.js] fetch: event.request.mode = "+event.request.mode)
    if (event.request.mode === 'navigate') {
      event.respondWith((async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
  
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.log('Fetch failed; returning offline page instead.', error);
  
          const cache = await caches.open(CACHE_VERSION);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })());
    }
  
    // If our if() condition is false, then this fetch handler won't intercept the
    // request. If there are any other fetch handlers registered, they will get a
    // chance to call event.respondWith(). If no fetch handlers call
    // event.respondWith(), the request will be handled by the browser as if there
    // were no service worker involvement.
  });
