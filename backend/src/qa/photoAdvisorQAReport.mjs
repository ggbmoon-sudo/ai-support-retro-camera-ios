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

  return {
    schemaVersion: PHOTO_ADVISOR_QA_SCHEMA_VERSION,
    provider,
    model,
    baseUrlHost: safeHost(baseURL),
    totalCases,
    cloudSuccess: cloudCases.length,
    fallback: fallbackCases.length,
    averageLatencyMs: roundedAverage(latencies),
    p50LatencyMs: percentile(latencies, 0.5),
    p95LatencyMs: percentile(latencies, 0.95),
    schemaFailures: cases.filter((item) => item.schemaValid === false).length,
    safetyFailures: cases.filter((item) => item.safetyValid === false).length,
    invalidFilterIds: cases.reduce((sum, item) => sum + (item.invalidFilterIds ?? 0), 0),
    providerErrors: cases.filter((item) => item.fallbackCode === "provider_error").length,
    providerTimeouts: cases.filter((item) => item.fallbackCode === "provider_timeout" || item.fallbackCode === "timeout").length,
    invalidJSON: cases.filter((item) => item.fallbackCode === "provider_invalid_json" || item.fallbackCode === "invalid_json").length,
    invalidSchema: cases.filter((item) => item.fallbackCode === "provider_invalid_schema" || item.fallbackCode === "invalid_schema").length,
    languageCasesNeedingManualReview: cases.filter((item) => item.needsManualLanguageReview).length,
    notes,
    cases: cases.map(sanitizePhotoAdvisorQACase)
  };
}

export function sanitizePhotoAdvisorQACase(input = {}) {
  return {
    caseId: String(input.caseId ?? "unknown"),
    locale: String(input.locale ?? ""),
    source: input.source ?? "unknown",
    latencyMs: finiteOrNull(input.latencyMs),
    schemaValid: Boolean(input.schemaValid),
    safetyValid: Boolean(input.safetyValid),
    fallbackCode: input.fallbackCode ?? null,
    recommendedFilterIds: Array.isArray(input.recommendedFilterIds)
      ? input.recommendedFilterIds.filter((item) => typeof item === "string")
      : [],
    invalidFilterIds: Number.isFinite(input.invalidFilterIds) ? input.invalidFilterIds : 0,
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

function finiteOrNull(value) {
  return Number.isFinite(value) ? value : null;
}
