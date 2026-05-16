"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      const registerWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          if (registration.installing) {
            console.log('PWA Service worker installing.');
          } else if (registration.waiting) {
            console.log('PWA Service worker installed and waiting.');
          } else if (registration.active) {
            console.log('PWA Service worker active.');
          }
        } catch (error) {
          console.warn('PWA service worker registration failed:', error);
        }
      };

      registerWorker();
    }
  }, []);

  return null;
}
