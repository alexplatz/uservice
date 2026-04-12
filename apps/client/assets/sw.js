// Service Worker (sw.js)
const VERSION = '1.0.0'
const CACHE_NAME = `app-cache-v${VERSION}`

// Assets to cache-first
const STATIC_ASSETS = [/*'/', '/index.html',*/ '/src/styles.css']

console.log('in service worker')

self.addEventListener('install',
  (event) => {
    console.log('adding static assets to service worker cache')
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(cache => cache.addAll(STATIC_ASSETS))
    )
  })


self.addEventListener('activate',
  (event) => {
    console.log('invalidating old caches')
    event.waitUntil(
      caches
        .keys()
        .then(keys => Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        ))
    )
  })

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  // Cache-first for static, network-first for rest
  if (STATIC_ASSETS.includes(url.pathname)) {
    console.log('serving cached assets')
    event.respondWith(
      caches
        .match(event.request)
        .then(res => res || fetch(event.request))
    )
  } else {
    console.log('serving dynamic assets')
    event.respondWith(
      fetch(event.request)
        .then(res =>
          caches
            .open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, res.clone())
              return res
            }))
        .catch(() => caches.match(event.request))
    )
  }
})

