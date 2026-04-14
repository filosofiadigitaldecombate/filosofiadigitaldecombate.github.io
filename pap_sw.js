/* P∆P Joystick — Service Worker v1.0
   Creaxion Papiro · X-7777777-LC7° */
const CACHE = 'pap-joystick-v1';
const ARCHIVOS = [
  '/pap_joystick.html',
  '/pap_joystick_manifest.json',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARCHIVOS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

/* Push notifications para mensajes de voz */
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification('P∆P · Mensaje de voz', {
      body: data.remitente ? data.remitente + ' te envió una nota de voz' : 'Nueva nota de voz',
      icon: '/pap_icon_192.png',
      badge: '/pap_icon_192.png',
      tag: 'pap-voz',
      data: data
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/pap_joystick.html'));
});
