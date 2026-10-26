/**
 * Sliding-window in-memory rate limiter.
 * Suitable for single-instance deploys. For multi-instance, swap to Redis.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Periodically prune to prevent unbounded memory growth
let pruneTimer: ReturnType<typeof setInterval> | null = null;
function startPruner() {
  if (pruneTimer) return;
  pruneTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) {
      if (v.resetAt < now) buckets.delete(k);
    }
  }, 60_000);
  if (typeof pruneTimer.unref === 'function') pruneTimer.unref();
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  startPruner();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      resetAt,
      retryAfterSeconds: 0
    };
  }

  bucket.count += 1;
  const allowed = bucket.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - bucket.count),
    limit,
    resetAt: bucket.resetAt,
    retryAfterSeconds: allowed ? 0 : Math.ceil((bucket.resetAt - now) / 1000)
  };
}

/** Extract the best-effort client IP from an Astro Request + headers */
export function clientIp(headers: Headers, clientAddr?: string): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const real = headers.get('x-real-ip');
  if (real) return real.trim();
  return clientAddr || 'unknown';
}
