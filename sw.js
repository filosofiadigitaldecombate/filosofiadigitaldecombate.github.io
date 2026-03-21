// ══ CREATY PAPIRO — SERVICE WORKER ══
// X-7777777-LC7° · SI° · 350 · 777
const CACHE_NAME = 'creaty-papiro-v1';
const CORE_FILES = [
  '/',
  '/index.html',
  '/salon.html',
  'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Cinzel:wght@400;600;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&family=Special+Elite&display=swap'
];

// INSTALAR — cachear archivos principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES).catch(() => {
        // Si algo falla al cachear no bloqueamos la instalación
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// ACTIVAR — limpiar caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// FETCH — Network first, cache fallback
self.addEventListener('fetch', event => {
  // Solo manejamos GET requests
  if(event.request.method !== 'GET') return;

  // Supabase y APIs externas — siempre online
  const url = event.request.url;
  if(url.includes('supabase.co') || url.includes('googleapis') || url.includes('youtube')) {
    return fetch(event.request);
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cachear respuesta fresca
        if(response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sin internet — usar cache
        return caches.match(event.request).then(cached => {
          if(cached) return cached;
          // Fallback a index.html para rutas no encontradas
          if(event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('Offline — Creaty Papiro', { status: 503 });
        });
      })
  );
});

// PUSH NOTIFICATIONS — preparado para futuro
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '▣ Creaty Papiro';
  const body = data.body || 'Hay actividad en el Salón Papiro';
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'papiro-notification',
      data: { url: data.url || '/salon.html' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/salon.html')
  );
});
