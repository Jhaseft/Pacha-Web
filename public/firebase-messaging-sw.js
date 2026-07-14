/* Service worker de notificaciones push.
 *
 * Corre fuera de React (sin bundler), por eso importa Firebase por script y
 * lleva la config escrita: un service worker no ve las variables NEXT_PUBLIC_*.
 * Son valores públicos, así que no hay secreto expuesto aquí.
 *
 * Recibe las notificaciones cuando la pestaña está cerrada o en segundo plano.
 */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDxxun5FkUNL9KbbzbLqD807A634cO9itg',
  authDomain: 'pachamama-f69e8.firebaseapp.com',
  projectId: 'pachamama-f69e8',
  storageBucket: 'pachamama-f69e8.firebasestorage.app',
  messagingSenderId: '646478722214',
  appId: '1:646478722214:web:6d5f2c76ea96ae7d05f067',
});

const messaging = firebase.messaging();

// A dónde lleva cada notificación al pulsarla (mismos `type` que envía el backend).
function targetUrl(data) {
  switch (data.type) {
    case 'NEW_MESSAGE':
    case 'NEW_LOCKED_MESSAGE':
    case 'MESSAGE_UNLOCKED':
    case 'IMAGE_UNLOCKED':
      return data.conversationId ? `/dashboard/chats/${data.conversationId}` : '/dashboard/chats';
    case 'INCOMING_CALL':
    case 'CALL_ACCEPTED':
    case 'CALL_REJECTED':
    case 'CALL_BILLED':
    case 'CALL_WARNING':
      return '/dashboard/chats';
    case 'WITHDRAWAL_APPROVED':
    case 'WITHDRAWAL_REJECTED':
      return '/dashboard/anfitriona/withdrawal-requests';
    case 'NEW_WITHDRAWAL_REQUEST':
      return '/admin/withdrawalRequest';
    case 'NEW_GALLERY_IMAGE':
      return data.anfitrionaId ? `/anfitrionas/${data.anfitrionaId}` : '/dashboard';
    default:
      return '/dashboard';
  }
}

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = payload.notification?.title || 'MonetizaLab';

  self.registration.showNotification(title, {
    body: payload.notification?.body || '',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: data.conversationId || data.type || 'default',
    data: { url: targetUrl(data), ...data },
  });
});

// Al pulsar la notificación: reutiliza una pestaña abierta si la hay.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
