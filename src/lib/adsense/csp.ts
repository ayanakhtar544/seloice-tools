/**
 * AdSense-compatible Content-Security-Policy.
 * @see https://support.google.com/adsense/answer/16283098
 */
export function buildAdSenseCsp(): string {
  const googleAds = [
    'https://pagead2.googlesyndication.com',
    'https://*.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
    'https://*.doubleclick.net',
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://adservice.google.com',
    'https://www.googletagservices.com',
    'https://www.googleadservices.com',
    'https://tpc.googlesyndication.com',
    'https://www.googletagmanager.com',
    'https://ep1.adtrafficquality.google',
    'https://ep2.adtrafficquality.google',
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://analytics.google.com',
  ].join(' ');

  const thirdParty = [
    'https://www.clarity.ms',
    'https://*.clarity.ms',
    'https://c.clarity.ms',
    'https://vitals.vercel-insights.com',
    'https://va.vercel-scripts.com',
    'https://firebase.googleapis.com',
    'https://firebaseinstallations.googleapis.com',
    'https://*.googleapis.com',
    'https://*.firebaseio.com',
    'https://*.firebaseapp.com',
    'https://firestore.googleapis.com',
    'https://identitytoolkit.googleapis.com',
    'https://securetoken.googleapis.com',
    'https://storage.googleapis.com',
    'https://*.rapidapi.com',
    'https://img.youtube.com',
    'https://*.instagram.com',
    'https://*.cdninstagram.com',
    'https://images.unsplash.com',
    'https://i.pravatar.cc',
    'https://i.ibb.co',
    'https://unpkg.com',
    'https://cdn.jsdelivr.net',
    'https://raw.githubusercontent.com',
  ].join(' ');

  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${googleAds} ${thirdParty}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `img-src 'self' blob: data: ${googleAds} ${thirdParty}`,
    "font-src 'self' https://fonts.gstatic.com data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    `frame-src 'self' ${googleAds} https://www.youtube.com https://www.youtube-nocookie.com`,
    `connect-src 'self' blob: wss: ${googleAds} ${thirdParty}`,
    "worker-src 'self' blob:",
    "media-src 'self' blob: https:",
    'upgrade-insecure-requests',
  ].join('; ');
}
