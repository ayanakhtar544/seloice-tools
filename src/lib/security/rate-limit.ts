/**
 * In-memory sliding-window rate limiter.
 * Replace the Map store with Redis (e.g. @upstash/ratelimit) in multi-instance production.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX = 30;

const ROUTE_LIMITS: Record<string, { windowMs: number; max: number }> = {
  '/api/yt-download': { windowMs: 60_000, max: 15 },
  '/api/ig-download': { windowMs: 60_000, max: 15 },
  '/api/force-download': { windowMs: 60_000, max: 20 },
  '/api/admin': { windowMs: 60_000, max: 10 },
};

function getLimit(pathname: string) {
  const match = Object.keys(ROUTE_LIMITS).find((p) => pathname.startsWith(p));
  return match ? ROUTE_LIMITS[match] : { windowMs: DEFAULT_WINDOW_MS, max: DEFAULT_MAX };
}

export function checkRateLimit(
  ip: string,
  pathname: string,
): { limited: boolean; retryAfter: number } {
  const { windowMs, max } = getLimit(pathname);
  const key = `${ip}:${pathname.split('/').slice(0, 3).join('/')}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  entry.count += 1;
  buckets.set(key, entry);

  if (entry.count > max) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  return { limited: false, retryAfter: 0 };
}
