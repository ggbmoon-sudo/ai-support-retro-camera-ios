export const OPEN_WEIGHT_VLM_LOCAL_SMOKE_REPEATABILITY_GATE_SCHEMA_VERSION = "open_weight_vlm_local_smoke_repeatability_gate.v1";
const DEFAULT_REQUIRED_FIXTURE_COUNT = 3;

export function summarizeOpenWeightVlmLocalSmokeRepeatability(results = []) {
  const normalizedResults = Array.isArray(results)
    ? results.map(normalizeFixtureResult)
    : [];
  const fixtureCount = normalizedResults.length;
  const acceptedCount = normalizedResults.reduce((count, item) => count + (item.acceptedCount === 1 ? 1 : 0), 0);
  const rejectedCount = normalizedResults.reduce((count, item) => count + (item.rejectedCount === 1 ? 1 : 0), 0);

  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SMOKE_REPEATABILITY_GATE_SCHEMA_VERSION,
    fixtureCount,
    acceptedCount,
    rejectedCount,
    acceptanceRate: fixtureCount > 0 ? roundPercentage(acceptedCount / fixtureCount) : 0,
    validationCodeCounts: countByBucket(normalizedResults, (item) => item.validationCode),
    fallbackCategoryCounts: countByBucket(normalizedResults, (item) => item.fallbackCategory),
    schemaErrorBucketCounts: countNestedBuckets(normalizedResults, "schemaDiagnostic.errorBuckets"),
    schemaFieldBucketCounts: countNestedBuckets(normalizedResults, "schemaDiagnostic.fieldBuckets"),
    latencyBucketCounts: countByBucket(normalizedResults, (item) => item.latencyBucket),
    networkCallsMade: fixtureCount > 0 && normalizedResults.every((item) => item.networkCallsMade === true),
    productionReady: normalizedResults.some((item) => item.productionReady === true),
    rawPromptPersisted: normalizedResults.some((item) => item.rawPromptPersisted === true),
    rawModelResponsePersisted: normalizedResults.some((item) => item.rawModelResponsePersisted === true),
    rawImagePersisted: normalizedResults.some((item) => item.rawImagePersisted === true),
    rawImagePathPersisted: normalizedResults.some((item) => item.rawImagePathPersisted === true),
    requestPayloadPersisted: normalizedResults.some((item) => item.requestPayloadPersisted === true)
  };
}

export function evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary = {}, options = {}) {
  const reviewedAggregate = sanitizeAggregate(summary);
  const requiredFixtureCount = Number.isInteger(options.requiredFixtureCount) && options.requiredFixtureCount > 0
    ? options.requiredFixtureCount
    : DEFAULT_REQUIRED_FIXTURE_COUNT;
  const hardBlockers = [];
  const warnings = [];

  if (reviewedAggregate.productionReady === true) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "blocked_for_production_flag",
      "productionReady must remain false for repeatability review."
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
      "Repeatability review must not include persisted prompt, model output, image, path, or request payload artifacts."
    ));
  }

  if (reviewedAggregate.fixtureCount !== requiredFixtureCount) {
    hardBlockers.push(blocker(
      "fixture_count_unapproved",
      "blocked_for_unapproved_fixture",
      "Repeatability review expects the explicitly approved fixture count for this phase."
    ));
  }

  if (reviewedAggregate.networkCallsMade !== true) {
    hardBlockers.push(blocker(
      "network_calls_missing",
      "blocked_for_provider_integration",
      "Repeatability review requires the approved local/private model path to make network calls."
    ));
  }

  if (reviewedAggregate.acceptedCount !== reviewedAggregate.fixtureCount
    || reviewedAggregate.rejectedCount !== 0
    || reviewedAggregate.acceptanceRate !== 100) {
    hardBlockers.push(blocker(
      "repeatability_baseline_not_met",
      "blocked_for_schema_regression",
      "Repeatability review requires all approved fixtures to be accepted."
    ));
  }

  if (hasNonNullBuckets(reviewedAggregate.validationCodeCounts)
    || hasNonNullBuckets(reviewedAggregate.schemaErrorBucketCounts)
    || hasNonNullBuckets(reviewedAggregate.schemaFieldBucketCounts)) {
    hardBlockers.push(blocker(
      "schema_regression_detected",
      "blocked_for_schema_regression",
      "Repeatability review found schema regression buckets."
    ));
  }

  if (hasProviderIntegrationBucket(reviewedAggregate.fallbackCategoryCounts)) {
    hardBlockers.push(blocker(
      "provider_integration_fallback_detected",
      "blocked_for_provider_integration",
      "Repeatability review found provider-integration fallback output."
    ));
  } else if (hasNonNullBuckets(reviewedAggregate.fallbackCategoryCounts)) {
    hardBlockers.push(blocker(
      "fallback_regression_detected",
      "blocked_for_schema_regression",
      "Repeatability review found non-null fallback categories."
    ));
  }

  if (reviewedAggregate.latencyBucketCounts.gt_15s > 0) {
    warnings.push(warning(
      "latency_gt_15s_observed",
      "Accepted local smoke results include gt_15s latency; review as a performance note only."
    ));
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SMOKE_REPEATABILITY_GATE_SCHEMA_VERSION,
    runMode: "repeatability_gate",
    productionReady: false,
    networkCallsMade: reviewedAggregate.networkCallsMade === true,
    eligibleForLocalRepeatabilityReview: hardBlockers.length === 0,
    statusCategories: statusCategoriesFor(hardBlockers, reviewedAggregate.latencyBucketCounts.gt_15s > 0
      ? "pass_with_latency_note"
      : "pass_for_local_repeatability_review"),
    hardBlockers: uniqueBlockers(hardBlockers),
    warnings,
    reviewedAggregate
  };

  const redaction = assertOpenWeightVlmLocalSmokeRepeatabilityGateReportRedacted(report);
  if (!redaction.ok) {
    report.hardBlockers.push(blocker(
      "repeatability_gate_redaction_failed",
      "blocked_for_raw_persistence",
      "Repeatability gate report contains a forbidden artifact marker."
    ));
    report.eligibleForLocalRepeatabilityReview = false;
    report.statusCategories = statusCategoriesFor(report.hardBlockers, "not_production_ready");
  }

  return report;
}

export function assertOpenWeightVlmLocalSmokeRepeatabilityGateReportRedacted(report = {}) {
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
    "token@example",
    "stack trace"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: {
          code: "repeatability_gate_not_redacted",
          message: "Repeatability gate report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

function normalizeFixtureResult(item = {}) {
  const source = isPlainObject(item.localModelSmoke)
    ? {
      fixtureIdBucket: item.reviewedConfig?.fixtureIdBucket,
      ...item.localModelSmoke
    }
    : item;

  return {
    fixtureIdBucket: sanitizeToken(source.fixtureIdBucket || "configured"),
    acceptedCount: source.acceptedCount === 1 ? 1 : 0,
    rejectedCount: source.rejectedCount === 1 ? 1 : 0,
    validationCode: normalizeBucketValue(source.validationCode),
    fallbackCategory: normalizeBucketValue(source.fallbackCategory),
    schemaDiagnostic: normalizeSchemaDiagnostic(source.schemaDiagnostic),
    latencyBucket: normalizeBucketValue(source.latencyBucket || "unknown"),
    networkCallsMade: source.networkCallsMade === true,
    productionReady: source.productionReady === true,
    rawPromptPersisted: source.rawPromptPersisted === true,
    rawModelResponsePersisted: source.rawModelResponsePersisted === true,
    rawImagePersisted: source.rawImagePersisted === true,
    rawImagePathPersisted: source.rawImagePathPersisted === true,
    requestPayloadPersisted: source.requestPayloadPersisted === true
  };
}

function normalizeSchemaDiagnostic(value) {
  if (!isPlainObject(value)) {
    return null;
  }
  return {
    errorBuckets: Array.isArray(value.errorBuckets)
      ? value.errorBuckets.map(normalizeBucketValue)
      : [],
    fieldBuckets: Array.isArray(value.fieldBuckets)
      ? value.fieldBuckets.map(normalizeBucketValue)
      : []
  };
}

function sanitizeAggregate(summary = {}) {
  return {
    schemaVersion: sanitizeToken(summary.schemaVersion || OPEN_WEIGHT_VLM_LOCAL_SMOKE_REPEATABILITY_GATE_SCHEMA_VERSION),
    fixtureCount: Number.isInteger(summary.fixtureCount) && summary.fixtureCount >= 0 ? summary.fixtureCount : 0,
    acceptedCount: Number.isInteger(summary.acceptedCount) && summary.acceptedCount >= 0 ? summary.acceptedCount : 0,
    rejectedCount: Number.isInteger(summary.rejectedCount) && summary.rejectedCount >= 0 ? summary.rejectedCount : 0,
    acceptanceRate: Number.isFinite(summary.acceptanceRate) ? Number(summary.acceptanceRate) : 0,
    validationCodeCounts: sanitizeCountMap(summary.validationCodeCounts),
    fallbackCategoryCounts: sanitizeCountMap(summary.fallbackCategoryCounts),
    schemaErrorBucketCounts: sanitizeCountMap(summary.schemaErrorBucketCounts),
    schemaFieldBucketCounts: sanitizeCountMap(summary.schemaFieldBucketCounts),
    latencyBucketCounts: sanitizeCountMap(summary.latencyBucketCounts),
    networkCallsMade: summary.networkCallsMade === true,
    productionReady: summary.productionReady === true,
    rawPromptPersisted: summary.rawPromptPersisted === true,
    rawModelResponsePersisted: summary.rawModelResponsePersisted === true,
    rawImagePersisted: summary.rawImagePersisted === true,
    rawImagePathPersisted: summary.rawImagePathPersisted === true,
    requestPayloadPersisted: summary.requestPayloadPersisted === true
  };
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

function countByBucket(results, selector) {
  const counts = {};
  for (const item of results) {
    const key = normalizeBucketValue(selector(item));
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function countNestedBuckets(results, path) {
  const counts = {};
  for (const item of results) {
    const value = getPath(item, path);
    const buckets = Array.isArray(value) ? value : [];
    for (const bucket of buckets) {
      const key = normalizeBucketValue(bucket);
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }
  return counts;
}

function hasNonNullBuckets(counts = {}) {
  return Object.entries(sanitizeCountMap(counts)).some(([key, count]) => key !== "null" && count > 0);
}

function hasProviderIntegrationBucket(counts = {}) {
  return sanitizeCountMap(counts).blocked_for_provider_integration > 0;
}

function statusCategoriesFor(hardBlockers, successCategory) {
  const categories = new Set(["not_production_ready"]);
  for (const item of hardBlockers) {
    categories.add(item.category);
  }
  if (hardBlockers.length === 0) {
    categories.add("pass_for_local_repeatability_review");
    if (successCategory !== "pass_for_local_repeatability_review") {
      categories.add(successCategory);
    }
  }
  return Array.from(categories);
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
    category: sanitizeToken(category || "blocked_for_schema_regression"),
    message: String(message || "Repeatability gate is blocked.").slice(0, 180)
  };
}

function warning(code, message) {
  return {
    code: sanitizeToken(code || "warning"),
    message: String(message || "Review repeatability gate warning.").slice(0, 180)
  };
}

function normalizeBucketValue(value) {
  return value === null ? "null" : sanitizeToken(value || "unknown");
}

function roundPercentage(value) {
  return Math.round(value * 100);
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function getPath(value, path) {
  return path.split(".").reduce((current, key) => (isPlainObject(current) ? current[key] : undefined), value);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
