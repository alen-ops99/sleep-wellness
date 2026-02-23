/**
 * Firebase Cloud Messaging Service Worker
 *
 * This service worker handles background push notifications for the Sleep Wellness portal.
 * It runs in the background even when the page is not open.
 *
 * SETUP:
 * 1. This file must be served from the root of the assessment directory
 * 2. Firebase Messaging SDK is imported via importScripts
 * 3. The Firebase config must match the one in firebase-config.js
 */

// Import Firebase scripts (compat versions for service worker compatibility)
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Must match the config in firebase-config.js
firebase.initializeApp({
    apiKey: "AIzaSyDk0RtuOnqQDt_6KmclVUwfOkIp_1YLdNI",
    authDomain: "sleep-wellness-48d57.firebaseapp.com",
    projectId: "sleep-wellness-48d57",
    storageBucket: "sleep-wellness-48d57.firebasestorage.app",
    messagingSenderId: "385115156051",
    appId: "1:385115156051:web:55c392a064644fd50aa0a6"
});

const messaging = firebase.messaging();

/**
 * Handle background messages (when the page is not in the foreground)
 * This is called by FCM when a data-only message or notification message
 * arrives while the page is not focused.
 */
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Background message received:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'Sleep Wellness';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'You have a new notification.',
        icon: '/assessment/images/logo-icon.png',
        badge: '/assessment/images/logo-icon.png',
        tag: payload.data?.type || 'general',
        data: {
            url: payload.data?.clickAction || payload.fcmOptions?.link || '/assessment/account.html',
            type: payload.data?.type || 'general'
        },
        // Vibration pattern: short, pause, long
        vibrate: [100, 50, 200],
        // Auto-close after 10 seconds
        requireInteraction: false
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Handle notification click — open the relevant URL
 */
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.notification.tag);

    // Close the notification
    event.notification.close();

    // Determine the target URL based on notification type
    const data = event.notification.data || {};
    let targetUrl = data.url || '/assessment/account.html';

    // Map notification types to specific dashboard sections
    const sectionMap = {
        'task_assigned': '/assessment/account.html#tasks',
        'appointment_reminder': '/assessment/account.html#appointments',
        'questionnaire_assigned': '/assessment/account.html#questionnaires',
        'new_message': '/assessment/account.html#messages'
    };

    if (data.type && sectionMap[data.type]) {
        targetUrl = sectionMap[data.type];
    }

    // Open or focus the relevant page
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if a window is already open
            for (const client of clientList) {
                if (client.url.includes('/assessment/account.html') && 'focus' in client) {
                    // Post a message to the client to navigate to the section
                    client.postMessage({
                        type: 'NOTIFICATION_CLICK',
                        notificationType: data.type,
                        url: targetUrl
                    });
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
