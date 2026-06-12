export const CLOUD_AI_ERROR_CODES = Object.freeze({
  networkUnavailable: "network_unavailable",
  timeout: "timeout",
  quotaExceeded: "quota_exceeded",
  providerError: "provider_error",
  invalidJson: "invalid_json",
  invalidSchema: "invalid_schema",
  unsafeResponse: "unsafe_response",
  imageTooLarge: "image_too_large",
  userCancelled: "user_cancelled",
  consentDeclined: "consent_declined",
  unsupportedImage: "unsupported_image",
  backendUnavailable: "backend_unavailable",
  invalidRequest: "invalid_request",
  rateLimited: "rate_limited"
});

export function isKnownCloudAIErrorCode(code) {
  return Object.values(CLOUD_AI_ERROR_CODES).includes(code);
}
