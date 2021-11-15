var CACHE_NAME = 'stock-boy-pwa';
var urlsToCache = [
  '/'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Network first update, then use cache
self.addEventListener('fetch', (event) => {
  event.respondWith(async function () {
    try {
      return await fetch(event.request).then(
        function(response) {
          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have 2 stream.
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    } catch (err) {
      return caches.match(event.request);
    }
  }());
});

// Update a service worker
self.addEventListener('activate', event => {
  var cacheWhitelist = ['stock-boy-pwa'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});