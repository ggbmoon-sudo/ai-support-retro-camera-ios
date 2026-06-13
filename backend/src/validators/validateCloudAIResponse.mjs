import { isKnownFilterId } from "../filters/filterWhitelist.mjs";
import { isKnownCloudAIErrorCode } from "../responses/cloudAIErrorCodes.mjs";
import { validateSafeTextOutput } from "../security/safetyTextGuard.mjs";

const ALLOWED_MODES = new Set([
  "post_capture",
  "pre_capture",
  "filter_recommendation",
  "filter_generation",
  "inspiration",
  "pose_guide",
  "unavailable",
  "error"
]);

const ALLOWED_SUGGESTION_ACTIONS = new Set([
  "apply_filter",
  "adjust_crop",
  "retake",
  "none"
]);

const ALLOWED_CONFIDENCE = new Set(["low", "medium", "high"]);
const ALLOWED_SOURCE = new Set(["mock", "local", "cloud", "fallback"]);

export function validateCloudAIResponse(response) {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    return invalid("invalid_response", "Response must be a JSON object");
  }

  if (response.schemaVersion !== "1.0") {
    return invalid("unsupported_schema_version", "Response schemaVersion must be 1.0");
  }

  if (!ALLOWED_MODES.has(response.mode)) {
    return invalid("unsupported_mode", "Response mode is not supported");
  }

  if (typeof response.summary !== "string" || response.summary.length > 280) {
    return invalid("invalid_summary", "Response summary must be a short string");
  }

  if (!Array.isArray(response.suggestions) || response.suggestions.length > 3) {
    return invalid("invalid_suggestions", "Response suggestions must contain at most 3 items");
  }

  for (const suggestion of response.suggestions) {
    if (!suggestion || typeof suggestion !== "object") {
      return invalid("invalid_suggestions", "Each suggestion must be an object");
    }

    if (typeof suggestion.text !== "string" || suggestion.text.length > 180) {
      return invalid("invalid_suggestion_text", "Suggestion text must be a short string");
    }

    if (suggestion.action !== undefined && !ALLOWED_SUGGESTION_ACTIONS.has(suggestion.action)) {
      return invalid("invalid_suggestion_action", "Suggestion action is not allowed");
    }
  }

  if (!Array.isArray(response.recommendedFilters) || response.recommendedFilters.length > 3) {
    return invalid("invalid_recommended_filters", "recommendedFilters must contain at most 3 items");
  }

  for (const item of response.recommendedFilters) {
    if (!isKnownFilterId(item.filterId)) {
      return invalid("unknown_filter_id", "recommendedFilters contains an unknown filterId");
    }

    if (typeof item.reason !== "string" || item.reason.length > 140) {
      return invalid("invalid_filter_reason", "recommendedFilters contains an invalid reason");
    }
  }

  if (!ALLOWED_CONFIDENCE.has(response.confidence)) {
    return invalid("invalid_confidence", "Response confidence is invalid");
  }

  if (!ALLOWED_SOURCE.has(response.source)) {
    return invalid("unsupported_source", "Response source is invalid");
  }

  if (typeof response.locale !== "string" || response.locale.trim().length === 0) {
    return invalid("invalid_locale", "Response locale must be a non-empty string");
  }

  if (response.safety?.containsSensitiveInference !== false) {
    return invalid("sensitive_inference", "Response must not contain sensitive inference");
  }

  if (response.error !== null && response.error !== undefined) {
    const errorValidation = validateErrorShape(response.error);
    if (!errorValidation.ok) {
      return errorValidation;
    }
  }

  const textValidation = validateSafeTextOutput(response);
  if (!textValidation.ok) {
    return invalid("unsafe_response", "Response contains unsafe text", {
      unsafeCategory: textValidation.error.unsafeCategory
    });
  }

  return { ok: true };
}

function validateErrorShape(error) {
  if (!error || typeof error !== "object" || Array.isArray(error)) {
    return invalid("invalid_error", "error must be an object or null");
  }

  if (!isKnownCloudAIErrorCode(error.code)) {
    return invalid("invalid_error_code", "error code is not part of the Cloud AI error contract");
  }

  if (typeof error.message !== "string" || error.message.length > 180) {
    return invalid("invalid_error_message", "error message must be a short string");
  }

  return { ok: true };
}

function invalid(code, message, details = {}) {
  return {
    ok: false,
    error: {
      code,
      message,
      ...details
    }
  };
}
