/** Google Consent Mode v2 default + update payloads. */

export type ConsentState = 'granted' | 'denied';

export interface ConsentPreferences {
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  analytics_storage: ConsentState;
  functionality_storage: ConsentState;
  personalization_storage: ConsentState;
  security_storage: ConsentState;
}

export const CONSENT_DENIED: ConsentPreferences = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
};

export const CONSENT_GRANTED: ConsentPreferences = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'granted',
  security_storage: 'granted',
};

/** Non-personalized ads only — for users who decline marketing cookies. */
export const CONSENT_NPA_ADS: ConsentPreferences = {
  ...CONSENT_DENIED,
  ad_storage: 'granted',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

export function consentModeDefaultScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 500
    });
  `.trim();
}

export function pushConsentUpdate(prefs: ConsentPreferences): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) {
    gtag('consent', 'update', prefs);
    return;
  }
  const w = window as Window & { __pendingConsentUpdate?: ConsentPreferences };
  w.__pendingConsentUpdate = prefs;
}

export function flushPendingConsentUpdate(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __pendingConsentUpdate?: ConsentPreferences; gtag?: (...args: unknown[]) => void };
  if (w.__pendingConsentUpdate && w.gtag) {
    w.gtag('consent', 'update', w.__pendingConsentUpdate);
    delete w.__pendingConsentUpdate;
  }
}
