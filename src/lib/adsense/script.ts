import { ADSENSE_SCRIPT_URL } from './constants';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __adsenseScriptPromise?: Promise<void>;
  }
}

/** Loads the AdSense script once; resolves when `adsbygoogle` is available. */
export function ensureAdSenseScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('AdSense can only load in the browser'));
  }

  if (Array.isArray(window.adsbygoogle)) {
    return Promise.resolve();
  }

  if (window.__adsenseScriptPromise) {
    return window.__adsenseScriptPromise;
  }

  window.__adsenseScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`,
    );

    const onReady = () => {
      window.adsbygoogle = window.adsbygoogle || [];
      resolve();
    };

    if (existing) {
      if (Array.isArray(window.adsbygoogle)) {
        onReady();
        return;
      }
      existing.addEventListener('load', onReady, { once: true });
      existing.addEventListener('error', () => reject(new Error('AdSense script failed')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = ADSENSE_SCRIPT_URL;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = onReady;
    script.onerror = () => {
      console.warn('AdSense blocked by AdBlocker. Site will continue working.');
      resolve(false); 
    };
    document.head.appendChild(script);
  });

  return window.__adsenseScriptPromise;
}

export function isAdSenseScriptReady(): boolean {
  return typeof window !== 'undefined' && Array.isArray(window.adsbygoogle);
}
