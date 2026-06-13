import {
  assessLatencyForQA,
  classifyFallbackCode,
  latencyBucket,
  PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS
} from "./photoAdvisorQAConfig.mjs";

export const PHOTO_ADVISOR_QA_SCHEMA_VERSION = "1.0";

export function summarizePhotoAdvisorQA({
  runMode = "provider",
  provider = "qweapi",
  providerConfigured = false,
  model = "",
  baseURL = "",
  cases = [],
  notes = []
} = {}) {
  const sanitizedCases = cases.map(sanitizePhotoAdvisorQACase);
  const latencies = sanitizedCases
    .map((item) => item.latencyMs)
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  const totalCases = sanitizedCases.length;
  const fallbackCases = sanitizedCases.filter((item) => item.source === "fallback" || item.fallbackCode);
  const cloudCases = sanitizedCases.filter((item) => item.source === "cloud");
  const fallbackByCode = fallbackCounts(fallbackCases);
  const timeoutCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "timeout").length;
  const unsafeResponseCount = sanitizedCases.filter((item) => item.validationCategory === "unsafe_response" || classifyFallbackCode(item.fallbackCode) === "unsafe_response").length;
  const invalidJSONCount = sanitizedCases.filter((item) => item.validationCategory === "invalid_json" || classifyFallbackCode(item.fallbackCode) === "invalid_json").length;
  const invalidSchemaCount = sanitizedCases.filter((item) => item.validationCategory === "invalid_schema" || classifyFallbackCode(item.fallbackCode) === "invalid_schema").length;
  const invalidFilterIdCount = sanitizedCases.filter((item) => item.validationCategory === "unsupported_filter" || classifyFallbackCode(item.fallbackCode) === "invalid_filter_id").length;
  const overlongTextCount = sanitizedCases.filter((item) => item.validationCategory === "overlong_text").length;
  const networkOrProviderErrorCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "network_or_provider_error").length;
  const unknownFallbackCount = fallbackCases.filter((item) => classifyFallbackCode(item.fallbackCode) === "unknown").length;
  const validationFailureCount = sanitizedCases.filter((item) => [
    "invalid_json",
    "invalid_schema",
    "unsupported_filter",
    "overlong_text",
    "unsafe_response"
  ].includes(item.validationCategory) || item.schemaValid === false || item.safetyValid === false).length;
  const p95LatencyMs = percentile(latencies, 0.95);
  const maxLatencyMs = latencies.at(-1) ?? null;

  return {
    schemaVersion: PHOTO_ADVISOR_QA_SCHEMA_VERSION,
    runMode: sanitizeRunMode(runMode),
    provider,
    providerConfigured: Boolean(providerConfigured),
    providerNameBucket: sanitizeProviderName(provider),
    model,
    modelNameBucket: sanitizeModelName(model),
    baseUrlHost: safeHost(baseURL),
    totalCases,
    successCount: cloudCases.length,
    cloudSuccess: cloudCases.length,
    cloudSuccessCount: cloudCases.length,
    fallback: fallbackCases.length,
    fallbackCount: fallbackCases.length,
    validationFailureCount,
    averageLatencyMs: roundedAverage(latencies),
    p50LatencyMs: percentile(latencies, 0.5),
    p90LatencyMs: percentile(latencies, 0.9),
    p95LatencyMs,
    maxLatencyMs,
    latencyThresholds: PHOTO_ADVISOR_QA_LATENCY_THRESHOLDS,
    schemaFailures: sanitizedCases.filter((item) => item.schemaValid === false).length,
    safetyFailures: sanitizedCases.filter((item) => item.safetyValid === false).length,
    invalidFilterIds: sanitizedCases.reduce((sum, item) => sum + (item.invalidFilterIds ?? 0), 0),
    fallbackByCode,
    fallbackByCategory: fallbackCategoryCounts(fallbackCases),
    providerErrors: networkOrProviderErrorCount,
    providerErrorCount: networkOrProviderErrorCount,
    providerTimeouts: timeoutCount,
    timeoutCount,
    unsafeResponseCount,
    invalidJSON: invalidJSONCount,
    invalidJsonCount: invalidJSONCount,
    invalidSchema: invalidSchemaCount,
    invalidSchemaCount,
    invalidFilterIdCount,
    unsupportedFilterCount: invalidFilterIdCount,
    overlongTextCount,
    networkOrProviderErrorCount,
    unknownFallbackCount,
    unsafeByCategory: unsafeCategoryCounts(fallbackCases),
    languageCasesNeedingManualReview: sanitizedCases.filter((item) => item.needsManualLanguageReview).length,
    payloadLoggingDisabled: true,
    rawImagePersisted: false,
    rawProviderResponsePersisted: false,
    rawPromptPersisted: false,
    reportContainsRawUserContent: false,
    productionReady: false,
    contractChecks: {
      usesCloudAIResponseValidator: true,
      usesSafeTextGuard: true,
      usesFilterWhitelist: true,
      fallbackParityRequired: true,
      copyRegressionRequired: true
    },
    latencyAssessment: assessLatencyForQA({
      p95LatencyMs,
      maxLatencyMs,
      timeoutCount,
      unsafeResponseCount,
      fallbackCount: fallbackCases.length
    }),
    notes,
    cases: sanitizedCases
  };
}

export function sanitizePhotoAdvisorQACase(input = {}) {
  return {
    caseId: sanitizeCaseId(input.caseId),
    sampleType: sanitizeSampleType(input.sampleType),
    locale: String(input.locale ?? ""),
    source: input.source ?? "unknown",
    latencyMs: finiteOrNull(input.latencyMs),
    latencyBucket: input.latencyBucket ?? latencyBucket(input.latencyMs),
    schemaValid: Boolean(input.schemaValid),
    safetyValid: Boolean(input.safetyValid),
    fallbackCode: input.fallbackCode ?? null,
    validationCategory: sanitizeValidationCategory(input.validationCategory ?? inferValidationCategory(input)),
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

function sanitizeCaseId(value) {
  const text = String(value ?? "unknown").trim() || "unknown";
  return text.replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 120);
}

export function assertQAReportRedacted(report) {
  const serialized = JSON.stringify(report);
  const forbiddenSnippets = [
    "dataBase64",
    "base64",
    "data:image",
    "image_url",
    "requestBody",
    "requestPayload",
    "fullRequest",
    "fullPrompt",
    "promptText",
    "systemPrompt",
    "rawResponse",
    "providerRawResponse",
    "raw_provider_response",
    "providerResponseText",
    "rawProviderText",
    "unsafeText",
    "apiKey",
    "QWE_API_KEY",
    "Authorization",
    "Bearer ",
    "EXIF",
    "GPS",
    "face data",
    "stack trace"
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

function sanitizeRunMode(value) {
  switch (value) {
  case "mock":
  case "synthetic":
  case "provider":
    return value;
  default:
    return "provider";
  }
}

function sanitizeProviderName(value) {
  switch (value) {
  case "qweapi":
  case "synthetic":
  case "mock":
    return value;
  default:
    return "configured_provider";
  }
}

function sanitizeModelName(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return "not_configured";
  }
  return text.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
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

function sanitizeValidationCategory(value) {
  switch (value) {
  case "none":
  case "invalid_json":
  case "invalid_schema":
  case "unsupported_filter":
  case "overlong_text":
  case "unsafe_response":
  case "timeout":
  case "provider_error":
  case "unknown":
    return value;
  default:
    return "unknown";
  }
}

function inferValidationCategory(input = {}) {
  const fallbackCategory = classifyFallbackCode(input.fallbackCode);
  switch (fallbackCategory) {
  case "invalid_json":
    return "invalid_json";
  case "invalid_schema":
    return "invalid_schema";
  case "invalid_filter_id":
    return "unsupported_filter";
  case "unsafe_response":
    return "unsafe_response";
  case "timeout":
    return "timeout";
  case "network_or_provider_error":
    return "provider_error";
  default:
    if (input.schemaValid === false) {
      return "invalid_schema";
    }
    if (input.safetyValid === false) {
      return "unsafe_response";
    }
    return "none";
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
