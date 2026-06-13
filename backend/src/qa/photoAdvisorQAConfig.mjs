import { CLOUD_AI_LIMITS } from "../security/limits.mjs";

export const PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS = Object.freeze({
  debugQAOkP95Ms: 15_000,
  internalReviewP95Ms: 25_000,
  productionBlockerP95Ms: 25_000,
  slowCaseMs: 20_000,
  providerTimeoutMs: CLOUD_AI_LIMITS.providerTimeoutMs
});

export function latencyBucket(latencyMs) {
  if (!Number.isFinite(latencyMs)) {
    return "unknown";
  }
  if (latencyMs < 5_000) {
    return "under_5s";
  }
  if (latencyMs < 10_000) {
    return "5s_to_10s";
  }
  if (latencyMs < 20_000) {
    return "10s_to_20s";
  }
  if (latencyMs < PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS.providerTimeoutMs) {
    return "20s_to_timeout";
  }
  return "timeout_or_over";
}

export function classifyFallbackCode(code) {
  switch (code) {
  case null:
  case undefined:
    return "none";
  case "provider_timeout":
  case "timeout":
    return "timeout";
  case "unsafe_response":
    return "unsafe_response";
  case "provider_invalid_json":
  case "invalid_json":
    return "invalid_json";
  case "provider_invalid_schema":
  case "invalid_schema":
    return "invalid_schema";
  case "unknown_filter_id":
  case "invalid_filter_id":
    return "invalid_filter_id";
  case "provider_error":
  case "provider_unavailable":
  case "backend_unavailable":
  case "network_unavailable":
    return "network_or_provider_error";
  default:
    return "unknown";
  }
}

export function assessLatencyForQA({
  p95LatencyMs,
  maxLatencyMs,
  timeoutCount = 0,
  unsafeResponseCount = 0,
  fallbackCount = 0
} = {}) {
  const p95 = Number.isFinite(p95LatencyMs) ? p95LatencyMs : null;
  const max = Number.isFinite(maxLatencyMs) ? maxLatencyMs : null;
  const productionBlocked = timeoutCount > 0
    || fallbackCount > 0
    || unsafeResponseCount > 0
    || (p95 !== null && p95 > PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS.productionBlockerP95Ms);

  let debugQA = "acceptable";
  if (timeoutCount > 0 || (p95 !== null && p95 > PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS.internalReviewP95Ms)) {
    debugQA = "needs_latency_review";
  } else if (fallbackCount > 0 || (p95 !== null && p95 > PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS.debugQAOkP95Ms)) {
    debugQA = "usable_with_review";
  }

  return {
    providerTimeoutMs: PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS.providerTimeoutMs,
    debugQA,
    internalTesting: productionBlocked ? "needs_review" : "acceptable",
    productionRollout: productionBlocked ? "blocked" : "not_assessed",
    recommendation: productionBlocked
      ? "Keep provider path internal/debug only. Review latency, fallback reasons, unsafe-response triggers, and approved sample-image quality before production."
      : "Latency is acceptable for internal QA, but production rollout still requires explicit approval, cost guard, abuse controls, monitoring, and privacy review.",
    p95LatencyMs: p95,
    maxLatencyMs: max
  };
}
