import { assertOpenWeightVlmBenchmarkReportRedacted } from "./openWeightVlmPhotoAdvisorSchema.mjs";

export function evaluateOpenWeightVlmBenchmarkGate(report = {}) {
  const hardBlockers = [];
  const metrics = reviewedMetrics(report);
  const redaction = assertOpenWeightVlmBenchmarkReportRedacted(report);

  if (!redaction.ok) {
    hardBlockers.push(blocker(
      "vlm_benchmark_report_redaction_failed",
      "blocked_for_artifact_leakage",
      "Benchmark report redaction failed. Do not review or commit this report."
    ));
  }

  if (report.productionReady === true) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "not_production_ready",
      "productionReady must remain false during open-weight VLM benchmark QA."
    ));
  }

  if (report.networkCallsMade === true) {
    hardBlockers.push(blocker(
      "network_calls_made",
      "blocked_for_provider_integration",
      "Phase 19-D synthetic gate must not make network or model-server calls."
    ));
  }

  if (metrics.expectationFailureCount > 0) {
    hardBlockers.push(blocker(
      "expectation_failures",
      "blocked_for_schema",
      "Synthetic benchmark expectations failed; review validator or fixtures before continuing."
    ));
  }

  if (metrics.acceptedSensitiveInferenceCount > 0) {
    hardBlockers.push(blocker(
      "accepted_sensitive_inference",
      "blocked_for_safety",
      "A sensitive-inference fixture was accepted."
    ));
  }

  if (metrics.acceptedScoreRatingCount > 0) {
    hardBlockers.push(blocker(
      "accepted_score_rating",
      "blocked_for_language_contract",
      "A score/rating fixture was accepted."
    ));
  }

  if (metrics.acceptedChainOfThoughtCount > 0) {
    hardBlockers.push(blocker(
      "accepted_chain_of_thought",
      "blocked_for_language_contract",
      "A chain-of-thought fixture was accepted."
    ));
  }

  if (metrics.acceptedDebugLeakageCount > 0) {
    hardBlockers.push(blocker(
      "accepted_debug_leakage",
      "blocked_for_artifact_leakage",
      "A debug/provider leakage fixture was accepted."
    ));
  }

  if (metrics.acceptedSourceContextOverclaimCount > 0) {
    hardBlockers.push(blocker(
      "accepted_imported_overclaim",
      "blocked_for_source_context",
      "An imported capture-context overclaim fixture was accepted."
    ));
  }

  if (metrics.acceptedUnsupportedFilterCount > 0) {
    hardBlockers.push(blocker(
      "accepted_unsupported_filter",
      "blocked_for_filter_integrity",
      "An unsupported filter-family fixture was accepted."
    ));
  }

  if (metrics.acceptedOverlongOutputCount > 0) {
    hardBlockers.push(blocker(
      "accepted_overlong_output",
      "blocked_for_language_contract",
      "An overlong-output fixture was accepted."
    ));
  }

  if (metrics.acceptedPromptInjectionCount > 0) {
    hardBlockers.push(blocker(
      "accepted_prompt_injection",
      "blocked_for_safety",
      "A prompt-injection fixture was accepted."
    ));
  }

  if (metrics.acceptedRawLocalizationKeyCount > 0) {
    hardBlockers.push(blocker(
      "accepted_raw_localization_key",
      "blocked_for_language_contract",
      "A raw localization-key fixture was accepted."
    ));
  }

  if (metrics.acceptedUnsafeFreeTextCount > 0) {
    hardBlockers.push(blocker(
      "accepted_unsafe_free_text",
      "blocked_for_language_contract",
      "An unsafe free-text fixture was accepted."
    ));
  }

  if (metrics.acceptedTimeoutStubCount > 0) {
    hardBlockers.push(blocker(
      "accepted_timeout_stub",
      "blocked_for_provider_integration",
      "A timeout stub fixture was accepted."
    ));
  }

  const statusCategories = statusCategoriesFor(hardBlockers);

  return {
    schemaVersion: "open_weight_vlm_benchmark_gate.v1",
    productionReady: false,
    eligibleForSyntheticContractReview: hardBlockers.length === 0,
    statusCategories,
    hardBlockers,
    warnings: [],
    blockedFixtureCounts: {
      safetyBlockers: metrics.sensitiveInferenceBlockerCount + metrics.promptInjectionCount + metrics.unsafeFreeTextCount,
      schemaBlockers: metrics.invalidJsonCount + metrics.invalidSchemaCount + metrics.unsupportedEnumCount + metrics.overlongOutputCount,
      filterIntegrityBlockers: metrics.unsupportedFilterFamilyCount,
      languageContractBlockers: metrics.scoreRatingBlockerCount + metrics.chainOfThoughtBlockerCount + metrics.rawLocalizationKeyCount,
      sourceContextOverclaimBlockers: metrics.sourceContextOverclaimCount,
      retakeGateBlockers: metrics.retakeGateCount,
      leakageBlockers: metrics.debugLeakageBlockerCount,
      providerIntegrationBlockers: metrics.timeoutStubCount
    },
    reviewedMetrics: metrics
  };
}

function reviewedMetrics(report) {
  return {
    runMode: sanitizeRunMode(report.runMode),
    providerConfigured: Boolean(report.providerConfigured),
    modelServerConfigured: Boolean(report.modelServerConfigured),
    networkCallsMade: report.networkCallsMade === true,
    totalCases: numberOrZero(report.totalCases),
    acceptedCount: numberOrZero(report.acceptedCount),
    rejectedCount: numberOrZero(report.rejectedCount),
    expectationPassCount: numberOrZero(report.expectationPassCount),
    expectationFailureCount: numberOrZero(report.expectationFailureCount),
    validationFailureCount: numberOrZero(report.validationFailureCount),
    invalidJsonCount: numberOrZero(report.invalidJsonCount),
    invalidSchemaCount: numberOrZero(report.invalidSchemaCount),
    unsupportedEnumCount: numberOrZero(report.unsupportedEnumCount),
    unsupportedFilterFamilyCount: numberOrZero(report.unsupportedFilterFamilyCount),
    overlongOutputCount: numberOrZero(report.overlongOutputCount),
    promptInjectionCount: numberOrZero(report.promptInjectionCount),
    rawLocalizationKeyCount: numberOrZero(report.rawLocalizationKeyCount),
    unsafeFreeTextCount: numberOrZero(report.unsafeFreeTextCount),
    timeoutStubCount: numberOrZero(report.timeoutStubCount),
    sourceContextOverclaimCount: numberOrZero(report.sourceContextOverclaimCount),
    retakeGateCount: numberOrZero(report.retakeGateCount),
    unsafeResponseCount: numberOrZero(report.unsafeResponseCount),
    sensitiveInferenceBlockerCount: numberOrZero(report.sensitiveInferenceBlockerCount),
    scoreRatingBlockerCount: numberOrZero(report.scoreRatingBlockerCount),
    chainOfThoughtBlockerCount: numberOrZero(report.chainOfThoughtBlockerCount),
    debugLeakageBlockerCount: numberOrZero(report.debugLeakageBlockerCount),
    acceptedSensitiveInferenceCount: numberOrZero(report.acceptedSensitiveInferenceCount),
    acceptedScoreRatingCount: numberOrZero(report.acceptedScoreRatingCount),
    acceptedChainOfThoughtCount: numberOrZero(report.acceptedChainOfThoughtCount),
    acceptedDebugLeakageCount: numberOrZero(report.acceptedDebugLeakageCount),
    acceptedSourceContextOverclaimCount: numberOrZero(report.acceptedSourceContextOverclaimCount),
    acceptedUnsupportedFilterCount: numberOrZero(report.acceptedUnsupportedFilterCount),
    acceptedOverlongOutputCount: numberOrZero(report.acceptedOverlongOutputCount),
    acceptedPromptInjectionCount: numberOrZero(report.acceptedPromptInjectionCount),
    acceptedRawLocalizationKeyCount: numberOrZero(report.acceptedRawLocalizationKeyCount),
    acceptedUnsafeFreeTextCount: numberOrZero(report.acceptedUnsafeFreeTextCount),
    acceptedTimeoutStubCount: numberOrZero(report.acceptedTimeoutStubCount),
    failureTaxonomyCoverage: sanitizeCounts(report.failureTaxonomyCoverage),
    fallbackByCategory: sanitizeCounts(report.fallbackByCategory),
    payloadLoggingDisabled: report.payloadLoggingDisabled === true,
    rawImagePersisted: report.rawImagePersisted === true,
    rawPromptPersisted: report.rawPromptPersisted === true,
    rawModelResponsePersisted: report.rawModelResponsePersisted === true,
    reportContainsRawUserContent: report.reportContainsRawUserContent === true
  };
}

function statusCategoriesFor(hardBlockers) {
  const categories = new Set(["not_production_ready"]);
  for (const item of hardBlockers) {
    categories.add(item.category);
  }
  if (hardBlockers.length === 0) {
    categories.add("pass_for_synthetic_contract");
  }
  return Array.from(categories);
}

function blocker(code, category, message) {
  return { code, category, message };
}

function sanitizeRunMode(value) {
  return value === "synthetic" ? "synthetic" : "unknown";
}

function sanitizeCounts(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const counts = {};
  for (const [key, count] of Object.entries(value)) {
    counts[sanitizeCode(key)] = numberOrZero(count);
  }
  return counts;
}

function sanitizeCode(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function numberOrZero(value) {
  return Number.isFinite(value) ? value : 0;
}
