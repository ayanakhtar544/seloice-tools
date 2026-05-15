import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  CONSENT_NPA_ADS,
  pushConsentUpdate,
  type ConsentPreferences,
} from '@/lib/consent/consent-mode';

const CONSENT_KEY = 'seloice_consent_v2';
const LEGACY_KEY = 'seloice_tracking_consent';

function migrateLegacyConsent(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(CONSENT_KEY)) return;
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (!legacy) return;
  const choice: ConsentChoice = legacy === 'granted' ? 'granted' : 'denied';
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, ts: Date.now() }));
  localStorage.removeItem(LEGACY_KEY);
}

export type ConsentChoice = 'granted' | 'denied' | 'npa';

export interface StoredConsent {
  choice: ConsentChoice;
  ts: number;
}

export const hasMadeChoice = (): boolean => {
  if (typeof window === 'undefined') return false;
  migrateLegacyConsent();
  return localStorage.getItem(CONSENT_KEY) !== null;
};

export const getConsentChoice = (): ConsentChoice | null => {
  if (typeof window === 'undefined') return null;
  migrateLegacyConsent();
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    return parsed.choice ?? null;
  } catch {
    return null;
  }
};

/** Personalized ads + analytics allowed. */
export const hasConsent = (): boolean => getConsentChoice() === 'granted';

/** Any ad fill allowed (personalized or NPA). */
export const canShowAds = (): boolean => {
  const c = getConsentChoice();
  return c === 'granted' || c === 'npa';
};

/** Use non-personalized AdSense (`data-npa="1"`). */
export const useNonPersonalizedAds = (): boolean => getConsentChoice() === 'npa';

export const getConsentPreferences = (): ConsentPreferences => {
  const choice = getConsentChoice();
  if (choice === 'granted') return CONSENT_GRANTED;
  if (choice === 'npa') return CONSENT_NPA_ADS;
  return CONSENT_DENIED;
};

function persist(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return;
  const payload: StoredConsent = { choice, ts: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  pushConsentUpdate(getConsentPreferences());
  window.dispatchEvent(new Event('consent_updated'));
}

export const acceptConsent = (): void => persist('granted');

/** Decline marketing/analytics; no ads in strict regions (handled at banner level). */
export const rejectConsent = (): void => persist('denied');

/** Limited ads without personalization (where policy allows). */
export const acceptNonPersonalizedAds = (): void => persist('npa');
