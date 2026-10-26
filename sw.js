// Service worker: solo para recibir avisos (notificaciones push). No guarda nada en caché.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))
self.addEventListener('push', e => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch (x) { d = { cuerpo: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Torneos', {
    body: d.cuerpo || '', icon: d.icon || undefined, badge: d.icon || undefined,
    tag: d.tag || undefined, renotify: !!d.tag, data: { url: d.url || self.registration.scope }
  }))
})
self.addEventListener('notificationclick', e => {
  e.notification.close()
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) if (w.url.startsWith(self.registration.scope) && 'focus' in w) return w.focus()
    return self.clients.openWindow(url)
  }))
})
