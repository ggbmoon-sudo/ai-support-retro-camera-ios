export const SILICONFLOW_PHOTO_ADVISOR_ERROR_BUCKETS = Object.freeze([
  "provider_timeout",
  "provider_rate_limited",
  "provider_auth_failed",
  "provider_quota_exceeded",
  "provider_network_error",
  "provider_invalid_response",
  "provider_json_parse_failed",
  "provider_schema_invalid",
  "provider_safety_rejected",
  "provider_model_unavailable",
  "provider_image_too_large",
  "provider_unsupported_image_format",
  "provider_budget_cap_reached",
  "provider_disabled",
  "provider_not_configured",
  "provider_region_latency_unknown",
  "provider_pricing_unverified",
  "provider_terms_unverified",
  "provider_runtime_not_enabled",
  "provider_network_not_approved",
  "provider_benchmark_not_approved",
  "provider_upload_not_approved"
]);

const SILICONFLOW_ERROR_BUCKET_SET = new Set(SILICONFLOW_PHOTO_ADVISOR_ERROR_BUCKETS);

export function sanitizeSiliconFlowErrorBucket(value) {
  return SILICONFLOW_ERROR_BUCKET_SET.has(value) ? value : "provider_invalid_response";
}

export function mapSiliconFlowSyntheticErrorToBucket(error = {}) {
  if (error.bucket) {
    return sanitizeSiliconFlowErrorBucket(error.bucket);
  }

  if (error.timeout === true || error.name === "TimeoutError" || error.code === "ETIMEDOUT") {
    return "provider_timeout";
  }

  if (error.network === true || ["ECONNRESET", "ENOTFOUND", "ECONNREFUSED"].includes(error.code)) {
    return "provider_network_error";
  }

  switch (error.status) {
  case 400:
    return "provider_invalid_response";
  case 401:
  case 403:
    return "provider_auth_failed";
  case 404:
    return "provider_model_unavailable";
  case 408:
  case 504:
    return "provider_timeout";
  case 413:
    return "provider_image_too_large";
  case 415:
    return "provider_unsupported_image_format";
  case 429:
    return "provider_rate_limited";
  case 402:
    return "provider_quota_exceeded";
  default:
    break;
  }

  return "provider_invalid_response";
}

export function sanitizedSiliconFlowError(bucket, detail = {}) {
  return {
    bucket: sanitizeSiliconFlowErrorBucket(bucket),
    retryable: Boolean(detail.retryable),
    rawBodyIncluded: false,
    rawUrlIncluded: false,
    stackTraceIncluded: false,
    credentialIncluded: false,
    providerOutputIncluded: false
  };
}
