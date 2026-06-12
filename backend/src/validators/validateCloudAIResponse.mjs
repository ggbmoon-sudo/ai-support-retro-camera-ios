const KNOWN_FILTER_IDS = new Set([
  "original",
  "soft_warm_400",
  "summer_gold_200",
  "street_chrome",
  "soft_sun_portrait",
  "cinema_flat",
  "silver_gradation",
  "everyday_color_400",
  "amber_night_800",
  "vivid_landscape_100",
  "slide_pop",
  "memory_negative",
  "amber_nostalgia",
  "tri_grit_400",
  "neon_tungsten_800",
  "instant_dream",
  "metro_pop",
  "diana_soft",
  "flash_party",
  "ccd_party_2008",
  "editor_classic",
  "classic_film",
  "warm_vintage",
  "faded_chrome"
]);

export function validateCloudAIResponse(response) {
  if (!response || typeof response !== "object" || Array.isArray(response)) {
    return invalid("invalid_response", "Response must be a JSON object");
  }

  if (response.schemaVersion !== "1.0") {
    return invalid("unsupported_schema_version", "Response schemaVersion must be 1.0");
  }

  if (response.mode !== "post_capture" && response.mode !== "unavailable" && response.mode !== "error") {
    return invalid("unsupported_mode", "Response mode is not supported for Phase 17A");
  }

  if (typeof response.summary !== "string" || response.summary.length > 280) {
    return invalid("invalid_summary", "Response summary must be a short string");
  }

  if (!Array.isArray(response.suggestions) || response.suggestions.length > 3) {
    return invalid("invalid_suggestions", "Response suggestions must contain at most 3 items");
  }

  if (!Array.isArray(response.recommendedFilters) || response.recommendedFilters.length > 3) {
    return invalid("invalid_recommended_filters", "recommendedFilters must contain at most 3 items");
  }

  for (const item of response.recommendedFilters) {
    if (!KNOWN_FILTER_IDS.has(item.filterId)) {
      return invalid("unknown_filter_id", "recommendedFilters contains an unknown filterId");
    }
  }

  if (response.safety?.containsSensitiveInference !== false) {
    return invalid("sensitive_inference", "Response must not contain sensitive inference");
  }

  if (response.source !== "mock") {
    return invalid("unsupported_source", "Phase 17A backend must return mock source only");
  }

  return { ok: true };
}

function invalid(code, message) {
  return {
    ok: false,
    error: {
      code,
      message
    }
  };
}
