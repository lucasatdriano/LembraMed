const CACHE_NAME = 'notifications-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    let data = {};

    try {
        data = event.data.json();
    } catch (e) {
        data = {
            title: 'Notificação',
            body: event.data.text(),
        };
    }

    const options = {
        body: data.body || 'Você tem uma nova notificação',
        icon: data.icon || '/icons/icon-192x192.png',
        badge: data.badge || '/icons/icon-192x192.png',
        tag: data.tag || 'default',
        data: {
            url: data.url || '/',
            notificationId: data.notificationId,
            ...data,
        },
        vibrate: data.vibrate || [200, 100, 200, 100, 200],
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Abrir',
            },
            {
                action: 'close',
                title: 'Fechar',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Notificação',
            options,
        ),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            }),
    );
});

self.addEventListener('notificationclose', (event) => {
    console.error('❌ Notificação fechada:', event);
});
