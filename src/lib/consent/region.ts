/** EEA + UK + CH — require explicit consent before personalized ads/analytics. */
const EEA_UK_CH = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
  'GB', 'CH',
]);

export function isStrictConsentRegion(countryCode: string | null | undefined): boolean {
  if (!countryCode) return true;
  return EEA_UK_CH.has(countryCode.toUpperCase());
}

/** Vercel / Cloudflare geo headers when available. */
export function detectCountryFromHeaders(headers: Headers): string | null {
  return (
    headers.get('x-vercel-ip-country') ||
    headers.get('cf-ipcountry') ||
    headers.get('x-country-code') ||
    null
  );
}
