import { sql, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { rateLimitBuckets } from "@/db/active-schema";

export function getRequestIp(headerList: Headers): string {
  const xff = headerList.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headerList.get("x-real-ip");
  if (real?.trim()) return real.trim();
  return "unknown";
}

/**
 * Fixed-window limiter: at most `max` hits per `windowMs` per (scope, IP).
 * Uses Neon; safe across serverless instances.
 */
export async function consumeRateLimit(
  scope: string,
  ip: string,
  max: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false }> {
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${scope}:${ip}:${String(bucket)}`;
  const expiresAt = new Date(Date.now() + windowMs * 3);

  const db = getDb();
  await db.delete(rateLimitBuckets).where(lt(rateLimitBuckets.expiresAt, new Date()));

  const [row] = await db
    .insert(rateLimitBuckets)
    .values({ key, count: 1, expiresAt })
    .onConflictDoUpdate({
      target: rateLimitBuckets.key,
      set: { count: sql`${rateLimitBuckets.count} + 1` },
    })
    .returning({ count: rateLimitBuckets.count });

  const count = row?.count ?? 0;
  if (count > max) {
    return { ok: false };
  }
  return { ok: true };
}
