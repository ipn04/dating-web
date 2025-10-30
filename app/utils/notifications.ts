import toast from 'react-hot-toast';

export function requestNotificationPermission() {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      console.log('[Notifications] Permission:', permission);
    });
  }
}

export function showNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }

  toast(`${title}: ${body}`, {
    icon: '💬',
    duration: 4000,
  });
}