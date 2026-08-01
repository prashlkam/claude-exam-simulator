/**
 * In-memory fixed-window rate limiter (PLAN.md §13).
 *
 * Sized for the single App Service instance this app targets. If it is ever scaled out,
 * swap the Map for Redis — the call sites do not change.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Entry>();

/** Drop expired buckets so the Map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 5_000) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  entry.count++;
  if (entry.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { ok: true, remaining: limit - entry.count, retryAfterSeconds: 0 };
}

/** Clear a bucket after a successful login so honest users aren't penalised. */
export const resetRateLimit = (key: string) => buckets.delete(key);

/**
 * Client IP behind the App Service proxy. `x-forwarded-for` may hold a chain;
 * the left-most entry is the original client.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

export const AUTH_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 } as const;
