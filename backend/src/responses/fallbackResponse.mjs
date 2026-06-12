import { CLOUD_AI_ERROR_CODES, isKnownCloudAIErrorCode } from "./cloudAIErrorCodes.mjs";

export function fallbackCloudAIResponse({
  locale = "zh-Hant-HK",
  code = CLOUD_AI_ERROR_CODES.backendUnavailable,
  message = "Cloud analysis is unavailable right now. Showing local advice instead.",
  recoverable = true
} = {}) {
  const safeCode = isKnownCloudAIErrorCode(code) ? code : CLOUD_AI_ERROR_CODES.backendUnavailable;

  return {
    schemaVersion: "1.0",
    mode: "unavailable",
    summary: "",
    suggestions: [],
    recommendedFilters: [],
    generatedFilter: null,
    poseGuide: null,
    retakeAdvice: null,
    cropAdvice: null,
    confidence: "low",
    source: "fallback",
    locale,
    safety: {
      containsSensitiveInference: false,
      requiresUserConsent: false,
      blockedReason: null
    },
    error: {
      code: safeCode,
      message,
      recoverable
    }
  };
}
