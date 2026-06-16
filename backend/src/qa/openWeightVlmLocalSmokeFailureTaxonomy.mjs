export const OPEN_WEIGHT_VLM_LOCAL_SMOKE_FAILURE_TAXONOMY_SCHEMA_VERSION = "open_weight_vlm_local_smoke_failure_taxonomy.v1";

const DEFAULT_REQUIRED_FIXTURE_COUNT = 3;

export function evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(summary = {}, options = {}) {
  const reviewedAggregate = sanitizeAggregate(summary);
  const requiredFixtureCount = Number.isInteger(options.requiredFixtureCount) && options.requiredFixtureCount > 0
    ? options.requiredFixtureCount
    : DEFAULT_REQUIRED_FIXTURE_COUNT;
  const baselineAcceptedCount = Number.isInteger(options.baselineAcceptedCount) && options.baselineAcceptedCount >= 0
    ? options.baselineAcceptedCount
    : requiredFixtureCount;
  const realModelExpected = options.realModelExpected !== false;
  const hardBlockers = [];
  const warnings = [];

  if (reviewedAggregate.productionReady === true) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "blocked_for_production_flag",
      "Local smoke taxonomy must never promote productionReady true."
    ));
  }

  if (reviewedAggregate.rawPromptPersisted
    || reviewedAggregate.rawModelResponsePersisted
    || reviewedAggregate.rawImagePersisted
    || reviewedAggregate.rawImagePathPersisted
    || reviewedAggregate.requestPayloadPersisted) {
    hardBlockers.push(blocker(
      "raw_persistence_detected",
      "blocked_for_raw_persistence",
      "Failure taxonomy review must not include persisted prompt, model output, image, path, or request payload artifacts."
    ));
  }

  if (!countsAreConsistent(reviewedAggregate)) {
    hardBlockers.push(blocker(
      "aggregate_counts_inconsistent",
      "blocked_for_unknown_smoke_state",
      "Sanitized aggregate counts are internally inconsistent."
    ));
  }

  if (reviewedAggregate.fixtureCount < requiredFixtureCount) {
    hardBlockers.push(blocker(
      "fixture_count_below_required",
      "blocked_for_fixture_readiness",
      "Approved fixture set is incomplete for local smoke review."
    ));
  } else if (reviewedAggregate.fixtureCount > requiredFixtureCount) {
    hardBlockers.push(blocker(
      "fixture_count_above_approved",
      "blocked_for_unapproved_fixture",
      "Local smoke taxonomy only reviews the approved fixture count for this phase."
    ));
  }

  if (hasProblemBucket(reviewedAggregate.fixtureReadinessBucketCounts)
    || hasProblemBucket(reviewedAggregate.fixtureAvailabilityBucketCounts)) {
    hardBlockers.push(blocker(
      "fixture_readiness_bucket_detected",
      "blocked_for_fixture_readiness",
      "Fixture readiness buckets show missing, unavailable, or unapproved local fixture state."
    ));
  }

  if (realModelExpected && reviewedAggregate.networkCallsMade !== true) {
    hardBlockers.push(blocker(
      "network_calls_missing",
      "blocked_for_network_not_made_when_required",
      "Real local model smoke review requires networkCallsMade true."
    ));
  }

  if (!realModelExpected && reviewedAggregate.networkCallsMade === true) {
    hardBlockers.push(blocker(
      "unexpected_network_call",
      "blocked_for_unexpected_network_call",
      "No-network taxonomy samples must not make network calls."
    ));
  }

  if (hasUnavailableBucket(reviewedAggregate.modelServerAvailabilityBucketCounts)
    || hasUnavailableBucket(reviewedAggregate.serverAvailabilityBucketCounts)) {
    hardBlockers.push(blocker(
      "model_server_unavailable",
      "blocked_for_model_server_unavailable",
      "Model/server availability buckets show unavailable or timeout state."
    ));
  }

  if (hasNonNullBuckets(reviewedAggregate.validationCodeCounts)
    || hasNonNullBuckets(reviewedAggregate.schemaErrorBucketCounts)
    || hasNonNullBuckets(reviewedAggregate.schemaFieldBucketCounts)) {
    hardBlockers.push(blocker(
      "schema_regression_detected",
      "blocked_for_schema_regression",
      "Sanitized validation or schema diagnostic buckets show a schema regression."
    ));
  }

  if (hasProviderIntegrationBucket(reviewedAggregate.fallbackCategoryCounts)) {
    hardBlockers.push(blocker(
      "provider_integration_fallback_detected",
      "blocked_for_provider_integration",
      "Sanitized fallback buckets show provider integration failure."
    ));
  } else if (hasNonNullBuckets(reviewedAggregate.fallbackCategoryCounts)) {
    hardBlockers.push(blocker(
      "fallback_regression_detected",
      "blocked_for_schema_regression",
      "Sanitized fallback buckets show non-null fallback categories."
    ));
  }

  if (reviewedAggregate.acceptedCount < baselineAcceptedCount
    || reviewedAggregate.rejectedCount > 0
    || reviewedAggregate.acceptanceRate < 100) {
    hardBlockers.push(blocker(
      "repeatability_drift_detected",
      "blocked_for_repeatability_drift",
      "Accepted local smoke baseline drifted below the approved sanitized aggregate."
    ));
  }

  const latencyCategory = classifyLatency(reviewedAggregate, { realModelExpected });
  if (latencyCategory === "latency_blocker") {
    hardBlockers.push(blocker(
      "latency_timeout_or_pre_inference_block",
      "blocked_for_latency_regression",
      "Latency buckets show timeout, unavailable, or pre-inference block behavior."
    ));
  } else if (latencyCategory === "latency_regression") {
    warnings.push(warning(
      "all_fixtures_gt_15s",
      "All accepted local smoke fixtures were gt_15s; review as latency regression data, not production readiness."
    ));
  } else if (latencyCategory === "latency_note") {
    warnings.push(warning(
      "latency_gt_15s_observed",
      "Accepted local smoke results include gt_15s latency; review as a sandbox latency note."
    ));
  }

  const uniqueHardBlockers = uniqueBlockers(hardBlockers);
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SMOKE_FAILURE_TAXONOMY_SCHEMA_VERSION,
    runMode: "failure_latency_taxonomy",
    productionReady: false,
    networkCallsMade: reviewedAggregate.networkCallsMade === true,
    eligibleForLocalSmokeReview: uniqueHardBlockers.length === 0,
    latencyCategory,
    statusCategories: statusCategoriesFor(uniqueHardBlockers, latencyCategory),
    hardBlockers: uniqueHardBlockers,
    warnings,
    reviewedAggregate
  };

  const redaction = assertOpenWeightVlmLocalSmokeFailureTaxonomyReportRedacted(report);
  if (!redaction.ok) {
    report.hardBlockers.push(blocker(
      "failure_taxonomy_redaction_failed",
      "blocked_for_raw_persistence",
      "Failure taxonomy report contains a forbidden artifact marker."
    ));
    report.eligibleForLocalSmokeReview = false;
    report.statusCategories = statusCategoriesFor(report.hardBlockers, "latency_blocker");
  }

  return report;
}

export function assertOpenWeightVlmLocalSmokeFailureTaxonomyReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const forbiddenSnippets = [
    "data:image",
    "image_url",
    "fullPrompt",
    "rawResponse",
    "modelResponseText",
    "modelOutput",
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
    "token@example",
    "stack trace"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: {
          code: "failure_taxonomy_not_redacted",
          message: "Failure taxonomy report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

function sanitizeAggregate(summary = {}) {
  return {
    schemaVersion: sanitizeToken(summary.schemaVersion || OPEN_WEIGHT_VLM_LOCAL_SMOKE_FAILURE_TAXONOMY_SCHEMA_VERSION),
    fixtureCount: sanitizeNonNegativeInteger(summary.fixtureCount),
    acceptedCount: sanitizeNonNegativeInteger(summary.acceptedCount),
    rejectedCount: sanitizeNonNegativeInteger(summary.rejectedCount),
    acceptanceRate: Number.isFinite(summary.acceptanceRate) ? Number(summary.acceptanceRate) : 0,
    validationCodeCounts: sanitizeCountMap(summary.validationCodeCounts),
    fallbackCategoryCounts: sanitizeCountMap(summary.fallbackCategoryCounts),
    schemaErrorBucketCounts: sanitizeCountMap(summary.schemaErrorBucketCounts),
    schemaFieldBucketCounts: sanitizeCountMap(summary.schemaFieldBucketCounts),
    latencyBucketCounts: sanitizeCountMap(summary.latencyBucketCounts),
    modelServerAvailabilityBucketCounts: sanitizeCountMap(summary.modelServerAvailabilityBucketCounts),
    serverAvailabilityBucketCounts: sanitizeCountMap(summary.serverAvailabilityBucketCounts),
    fixtureReadinessBucketCounts: sanitizeCountMap(summary.fixtureReadinessBucketCounts),
    fixtureAvailabilityBucketCounts: sanitizeCountMap(summary.fixtureAvailabilityBucketCounts),
    networkCallsMade: summary.networkCallsMade === true,
    productionReady: summary.productionReady === true,
    rawPromptPersisted: summary.rawPromptPersisted === true,
    rawModelResponsePersisted: summary.rawModelResponsePersisted === true,
    rawImagePersisted: summary.rawImagePersisted === true,
    rawImagePathPersisted: summary.rawImagePathPersisted === true,
    requestPayloadPersisted: summary.requestPayloadPersisted === true
  };
}

function countsAreConsistent(summary) {
  if (summary.acceptedCount + summary.rejectedCount !== summary.fixtureCount) {
    return false;
  }
  const expectedRate = summary.fixtureCount > 0
    ? Math.round((summary.acceptedCount / summary.fixtureCount) * 100)
    : 0;
  return summary.acceptanceRate === expectedRate;
}

function classifyLatency(summary, { realModelExpected }) {
  const counts = summary.latencyBucketCounts;
  if (hasAnyBucket(counts, ["timeout", "timed_out", "unavailable", "unknown_timeout"])) {
    return "latency_blocker";
  }
  if (realModelExpected && summary.acceptedCount === 0 && counts.lt_1s > 0) {
    return "latency_blocker";
  }
  if (summary.fixtureCount > 0 && counts.gt_15s >= summary.fixtureCount) {
    return "latency_regression";
  }
  if (counts.gt_15s > 0) {
    return "latency_note";
  }
  return "latency_ok";
}

function statusCategoriesFor(hardBlockers, latencyCategory) {
  const categories = new Set(["not_production_ready"]);
  for (const item of hardBlockers) {
    categories.add(item.category);
  }
  if (hardBlockers.length === 0) {
    if (latencyCategory === "latency_note") {
      categories.add("pass_with_latency_note");
    } else if (latencyCategory === "latency_regression") {
      categories.add("pass_with_minor_review_note");
    } else {
      categories.add("pass_clean_local_smoke");
    }
  }
  return Array.from(categories);
}

function hasNonNullBuckets(counts = {}) {
  return Object.entries(sanitizeCountMap(counts)).some(([key, count]) => key !== "null" && count > 0);
}

function hasProviderIntegrationBucket(counts = {}) {
  return sanitizeCountMap(counts).blocked_for_provider_integration > 0;
}

function hasUnavailableBucket(counts = {}) {
  return hasAnyBucket(sanitizeCountMap(counts), [
    "unavailable",
    "model_unavailable",
    "server_unavailable",
    "timeout",
    "timed_out",
    "not_loaded",
    "missing",
    "healthz_failed"
  ]);
}

function hasProblemBucket(counts = {}) {
  return hasAnyBucket(sanitizeCountMap(counts), [
    "missing",
    "unavailable",
    "unapproved",
    "not_configured",
    "not_found",
    "fixture_missing",
    "missing_approved_fixture"
  ]);
}

function hasAnyBucket(counts = {}, keys = []) {
  return keys.some((key) => counts[key] > 0);
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

function blocker(code, category, message) {
  return {
    code: sanitizeToken(code || "blocked"),
    category: sanitizeToken(category || "blocked_for_unknown_smoke_state"),
    message: String(message || "Local smoke taxonomy is blocked.").slice(0, 180)
  };
}

function warning(code, message) {
  return {
    code: sanitizeToken(code || "warning"),
    message: String(message || "Review local smoke taxonomy warning.").slice(0, 180)
  };
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
