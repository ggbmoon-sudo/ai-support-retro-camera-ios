export const OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_PROVIDER_DIAGNOSTIC_SCHEMA_VERSION =
  "open_weight_vlm_expanded_fixture_provider_diagnostic.v1";

const EXPECTED_EXPANDED_FIXTURE_COUNT = 8;

export function evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic(input = {}) {
  const reviewedSignals = sanitizeSignals(input);
  const diagnosticCategories = new Set(["not_production_ready"]);
  const hardBlockers = [];
  const warnings = [];

  if (reviewedSignals.productionReady) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "blocked_for_production_flag",
      "Provider-integration diagnosis must keep productionReady false."
    ));
  }

  if (reviewedSignals.rawPromptPersisted
    || reviewedSignals.rawModelResponsePersisted
    || reviewedSignals.rawImagePersisted
    || reviewedSignals.rawImagePathPersisted
    || reviewedSignals.requestPayloadPersisted) {
    hardBlockers.push(blocker(
      "raw_persistence_detected",
      "blocked_for_raw_persistence",
      "Provider-integration diagnosis must not include persisted prompt, model output, image, path, or request payload artifacts."
    ));
  }

  const hasProviderFallback = reviewedSignals.fallbackCategoryCounts.blocked_for_provider_integration > 0;
  const hasOnlyFastProviderFallback = hasProviderFallback
    && reviewedSignals.fixtureCount > 0
    && reviewedSignals.rejectedCount === reviewedSignals.fixtureCount
    && reviewedSignals.acceptedCount === 0
    && reviewedSignals.latencyBucketCounts.lt_1s === reviewedSignals.fixtureCount
    && !hasSchemaBuckets(reviewedSignals);

  if (hasOnlyFastProviderFallback) {
    diagnosticCategories.add("likely_pre_inference_block");
    diagnosticCategories.add("unlikely_schema_validator_issue");
    diagnosticCategories.add("unsafe_to_retry_real_smoke");
  }

  if (hasSchemaBuckets(reviewedSignals)) {
    diagnosticCategories.add("likely_server_response_contract_block");
  }

  if (reviewedSignals.backendFixtureRegistryEligible
    && (!reviewedSignals.externalServerFixtureRegistryEligible
      || reviewedSignals.serverFixtureAvailabilityBuckets.missing > 0
      || reviewedSignals.serverFixtureAvailabilityBuckets.unavailable > 0
      || reviewedSignals.serverFixtureAvailabilityBuckets.unsupported > 0)) {
    diagnosticCategories.add("likely_server_fixture_unavailable");
  }

  if (reviewedSignals.serverHealthBucket === "fixture_availability_gap"
    || reviewedSignals.serverHealthBucket === "missing_fixture_availability"
    || reviewedSignals.serverHealthBucket === "fixture_registry_missing") {
    diagnosticCategories.add("likely_healthz_fixture_availability_gap");
  }

  if (reviewedSignals.requestRoutingBucket === "fixture_token_mismatch"
    || reviewedSignals.requestRoutingBucket === "backend_server_token_mismatch") {
    diagnosticCategories.add("likely_backend_fixture_routing_mismatch");
  }

  if (reviewedSignals.requestRoutingBucket === "config_fixture_not_updated"
    || reviewedSignals.requestRoutingBucket === "single_fixture_reused"
    || reviewedSignals.blockedSourceBucket === "local_config_fixture_switch") {
    diagnosticCategories.add("likely_config_fixture_switching_issue");
  }

  if (hasOnlyFastProviderFallback && !diagnosticCategories.has("likely_server_fixture_unavailable")) {
    warnings.push(warning(
      "pre_inference_block_needs_server_fixture_check",
      "Fast provider-integration fallback with lt_1s latency should be checked against server fixture availability before another real smoke."
    ));
  }

  if (diagnosticCategories.has("likely_pre_inference_block")
    && !reviewedSignals.productionReady
    && !hasRawPersistence(reviewedSignals)) {
    diagnosticCategories.add("eligible_for_contract_echo_fixture_routing_check");
  }

  if (reviewedSignals.fixtureCount !== EXPECTED_EXPANDED_FIXTURE_COUNT) {
    warnings.push(warning(
      "unexpected_fixture_count",
      "Expanded fixture diagnosis expected the approved eight-fixture Phase 20-G aggregate."
    ));
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_PROVIDER_DIAGNOSTIC_SCHEMA_VERSION,
    runMode: "expanded_fixture_provider_integration_diagnostic",
    productionReady: false,
    networkCallsMade: reviewedSignals.networkCallsMade === true,
    eligibleForRealSmokeRetry: false,
    diagnosticCategories: Array.from(diagnosticCategories),
    hardBlockers: uniqueBlockers(hardBlockers),
    warnings,
    reviewedSignals
  };

  const redaction = assertOpenWeightVlmExpandedFixtureProviderIntegrationDiagnosticRedacted(report);
  if (!redaction.ok) {
    report.hardBlockers.push(blocker(
      "provider_diagnostic_redaction_failed",
      "blocked_for_raw_persistence",
      "Provider-integration diagnostic report contains a forbidden artifact marker."
    ));
    report.diagnosticCategories = Array.from(new Set([
      ...report.diagnosticCategories,
      "unsafe_to_retry_real_smoke"
    ]));
  }

  return report;
}

export function phase20GBlockedProviderIntegrationSample() {
  return {
    fixtureCount: 8,
    fixtureIdBuckets: { configured: 8 },
    categoryBuckets: {
      bright_daylight_clean: 1,
      low_light_grain: 1,
      motion_blur_intentional: 1,
      high_contrast_shadow: 1,
      faded_color_retro: 1,
      imported_limited_context: 1,
      severe_blur_reject: 1,
      black_or_near_black_unreadable: 1
    },
    acceptedCount: 0,
    rejectedCount: 8,
    validationCodeCounts: { null: 8 },
    fallbackCategoryCounts: { blocked_for_provider_integration: 8 },
    schemaErrorBucketCounts: {},
    schemaFieldBucketCounts: {},
    latencyBucketCounts: { lt_1s: 8 },
    networkCallsMade: true,
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false,
    serverHealthBucket: "fixture_availability_gap",
    serverFixtureAvailabilityBuckets: { missing: 8 },
    backendFixtureRegistryEligible: true,
    externalServerFixtureRegistryEligible: false,
    requestRoutingBucket: "unknown",
    blockedSourceBucket: "unknown"
  };
}

export function assertOpenWeightVlmExpandedFixtureProviderIntegrationDiagnosticRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const forbiddenSnippets = [
    "data:image",
    "image_url",
    "fullPrompt",
    "rawResponse",
    "modelResponseText",
    "modelOutput",
    "\"requestPayload\":",
    "Authorization",
    "Bearer ",
    "apiKey",
    "QWE_API_KEY",
    "GEMINI_API_KEY",
    "OPENAI_API_KEY",
    "http://",
    "https://",
    ".jpg",
    ".jpeg",
    ".png",
    "/Users/",
    "/Volumes/",
    "/private/",
    "C:\\",
    "stack trace"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: {
          code: "expanded_fixture_provider_diagnostic_not_redacted",
          message: "Provider-integration diagnostic report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

function sanitizeSignals(input = {}) {
  return {
    fixtureCount: sanitizeNonNegativeInteger(input.fixtureCount),
    acceptedCount: sanitizeNonNegativeInteger(input.acceptedCount),
    rejectedCount: sanitizeNonNegativeInteger(input.rejectedCount),
    fixtureIdBuckets: sanitizeCountMap(input.fixtureIdBuckets),
    categoryBuckets: sanitizeCountMap(input.categoryBuckets),
    validationCodeCounts: sanitizeCountMap(input.validationCodeCounts),
    fallbackCategoryCounts: sanitizeCountMap(input.fallbackCategoryCounts),
    schemaErrorBucketCounts: sanitizeCountMap(input.schemaErrorBucketCounts),
    schemaFieldBucketCounts: sanitizeCountMap(input.schemaFieldBucketCounts),
    latencyBucketCounts: sanitizeCountMap(input.latencyBucketCounts),
    serverFixtureAvailabilityBuckets: sanitizeCountMap(input.serverFixtureAvailabilityBuckets),
    serverHealthBucket: sanitizeToken(input.serverHealthBucket || "unknown"),
    backendFixtureRegistryEligible: input.backendFixtureRegistryEligible === true,
    externalServerFixtureRegistryEligible: input.externalServerFixtureRegistryEligible === true,
    requestRoutingBucket: sanitizeToken(input.requestRoutingBucket || "unknown"),
    blockedSourceBucket: sanitizeToken(input.blockedSourceBucket || "unknown"),
    networkCallsMade: input.networkCallsMade === true,
    productionReady: input.productionReady === true,
    rawPromptPersisted: input.rawPromptPersisted === true,
    rawModelResponsePersisted: input.rawModelResponsePersisted === true,
    rawImagePersisted: input.rawImagePersisted === true,
    rawImagePathPersisted: input.rawImagePathPersisted === true,
    requestPayloadPersisted: input.requestPayloadPersisted === true
  };
}

function hasSchemaBuckets(signals) {
  return hasNonNullBuckets(signals.validationCodeCounts)
    || hasNonNullBuckets(signals.schemaErrorBucketCounts)
    || hasNonNullBuckets(signals.schemaFieldBucketCounts);
}

function hasRawPersistence(signals) {
  return signals.rawPromptPersisted
    || signals.rawModelResponsePersisted
    || signals.rawImagePersisted
    || signals.rawImagePathPersisted
    || signals.requestPayloadPersisted;
}

function hasNonNullBuckets(counts = {}) {
  return Object.entries(sanitizeCountMap(counts)).some(([key, count]) => key !== "null" && count > 0);
}

function sanitizeCountMap(value = {}) {
  if (!isPlainObject(value)) {
    return {};
  }
  const result = {};
  for (const [key, count] of Object.entries(value)) {
    if (!Number.isFinite(count)) {
      continue;
    }
    result[sanitizeToken(key)] = Math.max(0, Math.trunc(count));
  }
  return result;
}

function sanitizeNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0 ? value : 0;
}

function blocker(code, category, message) {
  return {
    code: sanitizeToken(code || "blocked"),
    category: sanitizeToken(category || "blocked_for_provider_integration"),
    message: String(message || "Provider-integration diagnosis is blocked.").slice(0, 180)
  };
}

function warning(code, message) {
  return {
    code: sanitizeToken(code || "warning"),
    message: String(message || "Review provider-integration diagnostic warning.").slice(0, 180)
  };
}

function uniqueBlockers(items = []) {
  const seen = new Set();
  const unique = [];
  for (const item of items) {
    const key = `${item.category}:${item.code}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
