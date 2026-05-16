const BLOCKED_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^\[::1\]$/,
  /^\[fc/i,
  /^\[fd/i,
];

/** Hosts commonly returned by YouTube / Instagram downloader APIs. */
const ALLOWED_DOWNLOAD_HOSTS = [
  /\.googlevideo\.com$/i,
  /\.youtube\.com$/i,
  /\.ytimg\.com$/i,
  /\.fbcdn\.net$/i,
  /\.cdninstagram\.com$/i,
  /\.cdninstagram\.com$/i,
  /\.instagram\.com$/i,
  /\.scontent.*\.fbcdn\.net$/i,
  /\.scontent.*\.cdninstagram\.com$/i,
  /\.akamaized\.net$/i,
  /\.cloudfront\.net$/i,
  /\.rapidcdn\.com$/i,
];

export function isSafeExternalUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    const host = parsed.hostname.toLowerCase();
    if (BLOCKED_HOST_PATTERNS.some((p) => p.test(host))) return false;
    if (host === 'metadata.google.internal') return false;

    return ALLOWED_DOWNLOAD_HOSTS.some((p) => p.test(host));
  } catch {
    return false;
  }
}
