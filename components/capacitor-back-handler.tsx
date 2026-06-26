'use client';

import { useEffect } from 'react';

export function CapacitorBackHandler() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    async function setup() {
      try {
        // Only runs inside a Capacitor native WebView
        const { App } = await import('@capacitor/app');
        const handle = await App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
        cleanup = () => handle.remove();
      } catch {
        // Running in browser — no-op
      }
    }

    setup();
    return () => cleanup?.();
  }, []);

  return null;
}
