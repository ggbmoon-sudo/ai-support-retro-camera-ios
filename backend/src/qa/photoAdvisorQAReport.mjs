import {
  assessLatencyForQA,
  classifyFallbackCode,
  latencyBucket,
  PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS
} from "./photoAdvisorQAConfig.mjs";

export const PHOTO_ADVISOR_QA_SCHEMA_VERSION = "1.0";

export function summarizePhotoAdvisorQA({
  provider = "qweapi",
  model = "",
  baseURL = "",
  cases = [],
  notes = []
} = {}) {
  const latencies = cases
    .map((item) => item.latencyMs)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  const totalCases = cases.length;
  const fallbackCases = cases.filter((item) => item.source === "fallback" || item.fallbackCode);
  const cloudCases = cases.filter((item) => item.source === "cloud");
  const fallbackByCode = fallbackCounts(fallbackCases);
  const timeoutCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "timeout").length;
  const unsafeResponseCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "unsafe_response").length;
  const invalidJSONCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "invalid_json").length;
  const invalidSchemaCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "invalid_schema").length;
  const invalidFilterIdCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "invalid_filter_id").length;
  const networkOrProviderErrorCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "network_or_provider_error").length;
  const unknownFallbackCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "unknown").length;
  const p95LatencyMs = percentile(latencies, 0.95);
  const maxLatencyMs = latencies.at(-1) ?? null;

  return {
    schemaVersion: PHOTO_ADVISOR_QA_SCHEMA_VERSION,
    provider,
    model,
    baseUrlHost: safeHost(baseURL),
    totalCases,
    cloudSuccess: cloudCases.length,
    cloudSuccessCount: cloudCases.length,
    fallback: fallbackCases.length,
    fallbackCount: fallbackCases.length,
    averageLatencyMs: roundedAverage(latencies),
    p50LatencyMs: percentile(latencies, 0.5),
    p90LatencyMs: percentile(latencies, 0.9),
    p95LatencyMs,
    maxLatencyMs,
    latencyThresholds: PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS,
    schemaFailures: cases.filter((item) => item.schemaValid === false).length,
    safetyFailures: cases.filter((item) => item.safetyValid === false).length,
    invalidFilterIds: cases.reduce((sum, item) => sum + (item.invalidFilterIds ?? 0), 0),
    fallbackByCode,
    fallbackByCategory: fallbackCategoryCounts(fallbackCases),
    providerErrors: networkOrProviderErrorCount,
    providerTimeouts: timeoutCount,
    timeoutCount,
    unsafeResponseCount,
    invalidJSON: invalidJSONCount,
    invalidSchema: invalidSchemaCount,
    invalidFilterIdCount,
    networkOrProviderErrorCount,
    unknownFallbackCount,
    unsafeByCategory: unsafeCategoryCounts(fallbackCases),
    languageCasesNeedingManualReview: cases.filter((item) => item.needsManualLanguageReview).length,
    latencyAssessment: assessLatencyForQA({
      p95LatencyMs,
      maxLatencyMs,
      timeoutCount,
      unsafeResponseCount,
      fallbackCount: fallbackCases.length
    }),
    notes,
    cases: cases.map(sanitizePhotoAdvisorQACase)
  };
}

export function sanitizePhotoAdvisorQACase(input = {}) {
  return {
    caseId: String(input.caseId ?? "unknown"),
    sampleType: sanitizeSampleType(input.sampleType),
    locale: String(input.locale ?? ""),
    source: input.source ?? "unknown",
    latencyMs: finiteOrNull(input.latencyMs),
    latencyBucket: input.latencyBucket ?? latencyBucket(input.latencyMs),
    schemaValid: Boolean(input.schemaValid),
    safetyValid: Boolean(input.safetyValid),
    fallbackCode: input.fallbackCode ?? null,
    recommendedFilterIds: Array.isArray(input.recommendedFilterIds)
      ? input.recommendedFilterIds.filter((item) => typeof item === "string")
      : [],
    invalidFilterIds: Number.isFinite(input.invalidFilterIds) ? input.invalidFilterIds : 0,
    fallbackCategory: classifyFallbackCode(input.fallbackCode),
    unsafeCategory: sanitizeUnsafeCategory(input.unsafeCategory),
    captionLength: Number.isFinite(input.captionLength) ? input.captionLength : 0,
    summaryLength: Number.isFinite(input.summaryLength) ? input.summaryLength : 0,
    suggestionCount: Number.isFinite(input.suggestionCount) ? input.suggestionCount : 0,
    confidence: input.confidence ?? null,
    needsManualLanguageReview: Boolean(input.needsManualLanguageReview)
  };
}

export function assertQAReportRedacted(report) {
  const serialized = JSON.stringify(report);
  const forbiddenSnippets = [
    "dataBase64",
    "base64",
    "image_url",
    "requestBody",
    "rawResponse",
    "providerRawResponse",
    "apiKey",
    "QWE_API_KEY",
    "EXIF",
    "GPS",
    "face data"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: {
          code: "qa_report_not_redacted",
          message: `QA report contains forbidden field: ${snippet}`
        }
      };
    }
  }

  return { ok: true };
}

function safeHost(baseURL) {
  try {
    return new URL(baseURL).host;
  } catch {
    return "";
  }
}

function roundedAverage(values) {
  if (values.length === 0) {
    return null;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function percentile(values, ratio) {
  if (values.length === 0) {
    return null;
  }
  const index = Math.min(values.length - 1, Math.max(0, Math.ceil(values.length * ratio) - 1));
  return values[index];
}

function fallbackCounts(cases) {
  const counts = {};
  for (const item of cases) {
    const code = item.fallbackCode ?? "unknown";
    counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}

function fallbackCategoryCounts(cases) {
  const counts = {};
  for (const item of cases) {
    const category = classifyFallbackCode(item.fallbackCode);
    counts[category] = (counts[category] ?? 0) + 1;
  }
  return counts;
}

function unsafeCategoryCounts(cases) {
  const counts = {};
  for (const item of cases) {
    if (classifyFallbackCode(item.fallbackCode) !== "unsafe_response") {
      continue;
    }
    const category = sanitizeUnsafeCategory(item.unsafeCategory) ?? "unknown_safety_guard";
    counts[category] = (counts[category] ?? 0) + 1;
  }
  return counts;
}

function finiteOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function sanitizeUnsafeCategory(value) {
  switch (value) {
  case "appearance_or_identity_guard":
  case "sensitive_attribute_guard":
  case "banned_term_guard":
  case "unknown_safety_guard":
    return value;
  default:
    return null;
  }
}

function sanitizeSampleType(value) {
  switch (value) {
  case "synthetic":
  case "approved_real_sample":
    return value;
  default:
    return "synthetic";
  }
}
