self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'New appointment created';
  const options = {
    body: payload.body || 'A new appointment has been added to Smart Schedule.',
    tag: payload.appointment_id ? `smart-schedule-${payload.appointment_id}` : 'smart-schedule-appointment',
    data: { appointment_id: payload.appointment_id || null }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if (client.url.startsWith(self.registration.scope) && 'focus' in client) return client.focus();
    }
    return self.clients.openWindow(self.registration.scope);
  })());
});
