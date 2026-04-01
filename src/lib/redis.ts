import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn("Upstash Redis not configured – ticker caching disabled");
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const TICKER_CACHE_KEY = "ticker:response";
const TICKER_CACHE_TTL = 10; // seconds

/**
 * Get cached ticker response or fetch fresh data and cache it.
 * Falls back to direct fetch if Redis is not configured.
 */
export async function getCachedTickerResponse<T>(
  fetchFresh: () => Promise<T>
): Promise<T> {
  if (!redis) return fetchFresh();

  try {
    const cached = await redis.get<T>(TICKER_CACHE_KEY);
    if (cached) return cached;
  } catch {
    // Redis down → fall through to fresh fetch
  }

  const fresh = await fetchFresh();

  try {
    await redis.set(TICKER_CACHE_KEY, fresh, { ex: TICKER_CACHE_TTL });
  } catch {
    // Cache write failed → no-op, data still returned
  }

  return fresh;
}

/**
 * Invalidate ticker cache (call after new Telegram message).
 */
export async function invalidateTickerCache() {
  if (!redis) return;
  try {
    await redis.del(TICKER_CACHE_KEY);
  } catch {
    // Best effort
  }
}
