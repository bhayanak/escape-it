const CACHE_NAME = 'escape-it-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/engine/game-loop.js',
  '/js/engine/renderer.js',
  '/js/engine/input.js',
  '/js/engine/audio.js',
  '/js/engine/physics.js',
  '/js/engine/collision.js',
  '/js/engine/particles.js',
  '/js/entities/player.js',
  '/js/entities/platform.js',
  '/js/entities/spike.js',
  '/js/entities/blade.js',
  '/js/entities/crusher.js',
  '/js/entities/portal.js',
  '/js/entities/collectible.js',
  '/js/scenes/menu.js',
  '/js/scenes/level-select.js',
  '/js/scenes/gameplay.js',
  '/js/scenes/level-complete.js',
  '/js/scenes/game-over.js',
  '/js/levels/level-loader.js',
  '/js/levels/level-generator.js',
  '/js/levels/all-levels.js',
  '/js/utils/constants.js',
  '/js/utils/storage.js',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
