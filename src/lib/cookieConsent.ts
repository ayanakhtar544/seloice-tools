// File: src/lib/cookieConsent.ts

const CONSENT_KEY = 'seloice_tracking_consent';

export const hasConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) === 'granted';
};

export const hasMadeChoice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) !== null;
};

export const acceptConsent = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, 'granted');
  window.dispatchEvent(new Event('consent_updated'));
};

export const rejectConsent = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, 'denied');
  window.dispatchEvent(new Event('consent_updated'));
};
