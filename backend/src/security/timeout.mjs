import { CLOUD_AI_LIMITS } from "./limits.mjs";

export function providerTimeoutMs() {
  return CLOUD_AI_LIMITS.providerTimeoutMs;
}

export async function withProviderTimeout(promise, timeoutMs = providerTimeoutMs()) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error("Provider timed out");
      error.code = "timeout";
      reject(error);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}
