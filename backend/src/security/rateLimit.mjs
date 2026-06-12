import { CLOUD_AI_LIMITS } from "./limits.mjs";

const requestBuckets = new Map();

export function checkDevRateLimit({ key = "local-dev", now = Date.now() } = {}) {
  const windowMs = 60_000;
  const bucket = requestBuckets.get(key);

  if (!bucket || now - bucket.windowStart >= windowMs) {
    requestBuckets.set(key, { windowStart: now, count: 1 });
    return { ok: true };
  }

  if (bucket.count >= CLOUD_AI_LIMITS.maxRequestsPerMinuteDev) {
    return {
      ok: false,
      error: {
        code: "rate_limited",
        message: "Too many local debug requests"
      }
    };
  }

  bucket.count += 1;
  return { ok: true };
}

export function resetDevRateLimitForTests() {
  requestBuckets.clear();
}
