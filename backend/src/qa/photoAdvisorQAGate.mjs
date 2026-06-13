import { assertQAReportRedacted } from "./photoAdvisorQAReport.mjs";

export function evaluatePhotoAdvisorQAGate(report = {}) {
  const hardBlockers = [];
  const warnings = [];
  const runMode = sanitizeRunMode(report.runMode);
  const metrics = reviewedMetrics(report);
  const redaction = assertQAReportRedacted(report);

  if (!redaction.ok) {
    hardBlockers.push(blocker(
      "qa_report_redaction_failed",
      "blocked_for_artifact_leakage",
      "QA report redaction failed. Do not review or commit this report."
    ));
  }

  if (report.productionReady === true) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "not_production_ready",
      "productionReady must remain false during provider QA."
    ));
  }

  if (report.rawImagePersisted !== false) {
    hardBlockers.push(blocker("raw_image_persisted", "blocked_for_artifact_leakage", "rawImagePersisted must be false."));
  }
  if (report.rawPromptPersisted !== false) {
    hardBlockers.push(blocker("raw_prompt_persisted", "blocked_for_artifact_leakage", "rawPromptPersisted must be false."));
  }
  if (report.rawProviderResponsePersisted !== false) {
    hardBlockers.push(blocker("raw_provider_response_persisted", "blocked_for_artifact_leakage", "rawProviderResponsePersisted must be false."));
  }
  if (report.reportContainsRawUserContent !== false) {
    hardBlockers.push(blocker("raw_user_content_in_report", "blocked_for_artifact_leakage", "reportContainsRawUserContent must be false."));
  }
  if (report.payloadLoggingDisabled !== true) {
    hardBlockers.push(blocker("payload_logging_not_disabled", "blocked_for_artifact_leakage", "payloadLoggingDisabled must be true."));
  }

  if (runMode === "synthetic") {
    if (report.providerConfigured !== false) {
      hardBlockers.push(blocker("synthetic_provider_configured", "blocked_for_provider_integration", "Synthetic-contract QA must not require configured provider credentials."));
    }
    if (metrics.totalCases <= 0) {
      hardBlockers.push(blocker("synthetic_missing_cases", "blocked_for_schema", "Synthetic-contract QA must include committed fixture cases."));
    }
    if (metrics.successCount <= 0) {
      hardBlockers.push(blocker("synthetic_missing_valid_cases", "blocked_for_schema", "Synthetic-contract QA must include accepted valid fixture cases."));
    }
    if (metrics.fallbackCount <= 0) {
      hardBlockers.push(blocker("synthetic_missing_rejection_cases", "blocked_for_schema", "Synthetic-contract QA must include rejected invalid/unsafe fixture cases."));
    }
  } else if (runMode === "provider") {
    applyProviderWarnings({ metrics, warnings });
    if (metrics.unsupportedFilterCount > 0 || metrics.invalidFilterIds > 0) {
      hardBlockers.push(blocker(
        "provider_unsupported_filter_seen",
        "blocked_for_filter_integrity",
        "Provider QA saw unsupported filter output. Review before any production planning."
      ));
    }
  } else {
    warnings.push(warning("unknown_run_mode", "Unknown QA report run mode; manual review required."));
  }

  const statusCategories = statusCategoriesFor({ runMode, hardBlockers, warnings });

  return {
    schemaVersion: "1.0",
    productionReady: false,
    eligibleForDebugInternalReview: hardBlockers.length === 0,
    statusCategories,
    hardBlockers,
    warnings,
    reviewedMetrics: metrics
  };
}

function applyProviderWarnings({ metrics, warnings }) {
  if (metrics.invalidJsonCount > 0) {
    warnings.push(warning("invalid_json_count", "Provider QA has invalid JSON fallbacks; review prompt/parser contract."));
  }
  if (metrics.invalidSchemaCount > 0 || metrics.schemaFailures > 0) {
    warnings.push(warning("invalid_schema_count", "Provider QA has invalid schema fallbacks; review schema alignment."));
  }
  if (metrics.fallbackCount > Math.max(1, Math.ceil(metrics.totalCases * 0.2))) {
    warnings.push(warning("fallback_count_high", "Provider QA fallback count is high for the reviewed sample set."));
  }
  if (metrics.timeoutCount > 0) {
    warnings.push(warning("timeout_count", "Provider QA has timeout fallbacks; review latency and cancellation behavior."));
  }
  if (metrics.providerErrorCount > 0) {
    warnings.push(warning("provider_error_count", "Provider QA has provider/network errors; confirm fallback remains safe."));
  }
  if (metrics.overlongTextCount > 0) {
    warnings.push(warning("overlong_text_count", "Provider QA has overlong text fallbacks; tighten prompt/validator length behavior."));
  }
  if (metrics.unsafeResponseCount > 0 || metrics.safetyFailures > 0) {
    warnings.push(warning("unsafe_response_count", "Provider QA has unsafe-response fallbacks; review sanitized safety categories."));
  }
  if (metrics.languageCasesNeedingManualReview > 0) {
    warnings.push(warning("manual_language_review", "Provider QA has cases requiring manual language/filter-fit review."));
  }
  if (metrics.p95LatencyMs !== null && metrics.p95LatencyMs > 20_000) {
    warnings.push(warning("p95_latency_blocks_production_planning", "p95 latency is above 20s and blocks production planning."));
  } else if (metrics.p95LatencyMs !== null && metrics.p95LatencyMs > 10_000) {
    warnings.push(warning("p95_latency_needs_review", "p95 latency is above the internal review threshold."));
  }
  if (metrics.maxLatencyMs !== null && metrics.maxLatencyMs > 30_000) {
    warnings.push(warning("max_latency_timeout_risk", "Max latency is above 30s and should be reviewed as timeout risk."));
  }
  for (const [code, count] of Object.entries(metrics.fallbackByCode)) {
    if (count > 1) {
      warnings.push(warning("repeated_fallback_code", `Repeated fallback category requires review: ${sanitizeCode(code)}.`));
    }
  }
}

function statusCategoriesFor({ runMode, hardBlockers, warnings }) {
  const categories = new Set(["not_production_ready"]);
  for (const item of hardBlockers) {
    categories.add(item.category);
  }
  if (hardBlockers.length === 0 && runMode === "synthetic") {
    categories.add("pass_for_synthetic_contract");
  }
  if (hardBlockers.length === 0 && warnings.length > 0) {
    categories.add("needs_review");
  }
  if (hardBlockers.length > 0 && !categories.has("blocked_for_artifact_leakage")) {
    categories.add("needs_review");
  }
  return Array.from(categories);
}

function reviewedMetrics(report) {
  return {
    runMode: sanitizeRunMode(report.runMode),
    providerConfigured: Boolean(report.providerConfigured),
    totalCases: numberOrZero(report.totalCases),
    successCount: numberOrZero(report.successCount ?? report.cloudSuccessCount ?? report.cloudSuccess),
    fallbackCount: numberOrZero(report.fallbackCount ?? report.fallback),
    validationFailureCount: numberOrZero(report.validationFailureCount),
    invalidJsonCount: numberOrZero(report.invalidJsonCount ?? report.invalidJSON),
    invalidSchemaCount: numberOrZero(report.invalidSchemaCount ?? report.invalidSchema),
    unsupportedFilterCount: numberOrZero(report.unsupportedFilterCount ?? report.invalidFilterIdCount),
    invalidFilterIds: numberOrZero(report.invalidFilterIds),
    overlongTextCount: numberOrZero(report.overlongTextCount),
    timeoutCount: numberOrZero(report.timeoutCount ?? report.providerTimeouts),
    providerErrorCount: numberOrZero(report.providerErrorCount ?? report.providerErrors ?? report.networkOrProviderErrorCount),
    unsafeResponseCount: numberOrZero(report.unsafeResponseCount),
    schemaFailures: numberOrZero(report.schemaFailures),
    safetyFailures: numberOrZero(report.safetyFailures),
    languageCasesNeedingManualReview: numberOrZero(report.languageCasesNeedingManualReview),
    p50LatencyMs: numberOrNull(report.p50LatencyMs),
    p90LatencyMs: numberOrNull(report.p90LatencyMs),
    p95LatencyMs: numberOrNull(report.p95LatencyMs),
    maxLatencyMs: numberOrNull(report.maxLatencyMs),
    fallbackByCode: sanitizeCounts(report.fallbackByCode),
    fallbackByCategory: sanitizeCounts(report.fallbackByCategory),
    unsafeByCategory: sanitizeCounts(report.unsafeByCategory),
    payloadLoggingDisabled: report.payloadLoggingDisabled === true,
    rawImagePersisted: report.rawImagePersisted === true,
    rawPromptPersisted: report.rawPromptPersisted === true,
    rawProviderResponsePersisted: report.rawProviderResponsePersisted === true,
    reportContainsRawUserContent: report.reportContainsRawUserContent === true
  };
}

function blocker(code, category, message) {
  return { code, category, message };
}

function warning(code, message) {
  return { code, message };
}

function sanitizeRunMode(value) {
  switch (value) {
  case "synthetic":
  case "provider":
  case "mock":
    return value;
  default:
    return "unknown";
  }
}

function sanitizeCounts(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const output = {};
  for (const [key, count] of Object.entries(value)) {
    output[sanitizeCode(key)] = numberOrZero(count);
  }
  return output;
}

function sanitizeCode(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}

function numberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}
