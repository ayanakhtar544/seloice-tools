import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * In-memory sliding-window rate limiter, enhanced with Redis support.
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

let redisCache: Map<string, any> = new Map();

export async function checkRateLimit(
  ip: string,
  pathname: string,
): Promise<{ limited: boolean; retryAfter: number }> {
  const { windowMs, max } = getLimit(pathname);
  const key = `${ip}:${pathname.split('/').slice(0, 3).join('/')}`;

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const windowStr = `${windowMs / 1000} s` as const;
      const limiter = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(max, windowStr as any),
        ephemeralCache: redisCache,
      });
      const { success, reset } = await limiter.limit(key);
      return { limited: !success, retryAfter: success ? 0 : Math.ceil((reset - Date.now()) / 1000) };
    } catch (e) {
      console.error('Redis Rate Limit Error, falling back to memory:', e);
    }
  }

  // Fallback memory rate limiter
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
