import {
  evaluateOpenWeightVlmBenchmarkGate
} from "./openWeightVlmBenchmarkGate.mjs";
import {
  assertOpenWeightVlmBenchmarkReportRedacted,
  evaluateOpenWeightVlmBenchmarkCase,
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  summarizeOpenWeightVlmBenchmark,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "./openWeightVlmPhotoAdvisorSchema.mjs";
import {
  evaluateOpenWeightVlmLocalSandboxGate,
  loadOpenWeightVlmLocalSandboxConfig,
  OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CHECK_SCHEMA_VERSION
} from "./openWeightVlmLocalSandboxConfig.mjs";

export const OPEN_WEIGHT_VLM_LOCAL_SANDBOX_SMOKE_SCHEMA_VERSION = "open_weight_vlm_local_sandbox_smoke.v1";

export async function runOpenWeightVlmLocalSandboxSmoke(options = {}) {
  const runLocalModel = options.runLocalModel === true;
  const loaded = await loadOpenWeightVlmLocalSandboxConfig(options.configPath, {
    requireConfig: runLocalModel || options.requireConfig === true
  });
  const configSummary = loaded.value;
  const runtimeConfig = loaded.runtimeValue;
  const configGate = evaluateOpenWeightVlmLocalSandboxGate(configSummary, {
    runLocalModel
  });
  const benchmarkReport = runStubbedBenchmarkReport();
  const benchmarkGate = evaluateOpenWeightVlmBenchmarkGate(benchmarkReport);
  const hardBlockers = [
    ...scopeBlockers(configGate.hardBlockers, "local_config"),
    ...scopeBlockers(benchmarkGate.hardBlockers, "stubbed_benchmark")
  ];

  if (!loaded.ok) {
    hardBlockers.unshift(blocker(
      loaded.error?.code || "invalid_config",
      "local_config",
      "blocked_for_local_config",
      "Local VLM sandbox config is invalid or unavailable."
    ));
  }

  let localModelSmoke = null;
  if (runLocalModel && hardBlockers.length === 0 && runtimeConfig?.servingStack === "transformers_fastapi") {
    localModelSmoke = await runTransformersFastApiSmoke(runtimeConfig, {
      fetchImpl: options.fetchImpl
    });
    if (localModelSmoke.acceptedCount !== 1) {
      hardBlockers.push(blocker(
        localModelSmoke.validationCode || localModelSmoke.errorCode || "local_model_smoke_rejected",
        "local_client",
        localModelSmoke.fallbackCategory || "blocked_for_schema",
        "Local Transformers FastAPI smoke output was rejected by the structured candidate validator."
      ));
    }
  } else if (runLocalModel && hardBlockers.length === 0) {
    hardBlockers.push(blocker(
      "unsupported_local_serving_stack",
      "local_client",
      "blocked_for_provider_integration",
      "Phase 20-D1 only prepares the Transformers FastAPI local adapter path."
    ));
  }

  const uniqueHardBlockers = uniqueBlockers(hardBlockers);
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_SMOKE_SCHEMA_VERSION,
    runMode: runLocalModel ? "run_local_model" : "stub_no_network",
    productionReady: false,
    providerConfigured: false,
    modelServerConfigured: configSummary.modelServerConfigured === true,
    networkCallsMade: Boolean(localModelSmoke?.networkCallsMade),
    eligibleForLocalSandboxSmoke: !runLocalModel && uniqueHardBlockers.length === 0,
    eligibleForFutureLocalModelRun: runLocalModel
      ? false
      : configGate.eligibleForFutureLocalModelRun === true
        && benchmarkGate.hardBlockers.length === 0,
    hardBlockers: uniqueHardBlockers,
    warnings: [
      ...scopeWarnings(configGate.warnings, "local_config"),
      ...scopeWarnings(benchmarkGate.warnings, "stubbed_benchmark")
    ],
    reviewedConfig: sanitizeConfig(configGate.reviewedConfig),
    stubbedBenchmark: {
      schemaVersion: benchmarkReport.schemaVersion,
      runMode: benchmarkReport.runMode,
      totalCases: benchmarkReport.totalCases,
      acceptedCount: benchmarkReport.acceptedCount,
      rejectedCount: benchmarkReport.rejectedCount,
      expectationPassCount: benchmarkReport.expectationPassCount,
      expectationFailureCount: benchmarkReport.expectationFailureCount,
      validationFailureCount: benchmarkReport.validationFailureCount,
      payloadLoggingDisabled: benchmarkReport.payloadLoggingDisabled === true,
      rawImagePersisted: benchmarkReport.rawImagePersisted === true,
      rawPromptPersisted: benchmarkReport.rawPromptPersisted === true,
      rawModelResponsePersisted: benchmarkReport.rawModelResponsePersisted === true,
      reportContainsRawUserContent: benchmarkReport.reportContainsRawUserContent === true,
      productionReady: false,
      networkCallsMade: false
    },
    benchmarkGate: {
      schemaVersion: benchmarkGate.schemaVersion,
      productionReady: false,
      eligibleForSyntheticContractReview: benchmarkGate.eligibleForSyntheticContractReview === true,
      statusCategories: Array.isArray(benchmarkGate.statusCategories)
        ? benchmarkGate.statusCategories.map(sanitizeToken)
        : [],
      hardBlockerCount: benchmarkGate.hardBlockers.length,
      reviewedMetrics: {
        totalCases: benchmarkGate.reviewedMetrics.totalCases,
        acceptedCount: benchmarkGate.reviewedMetrics.acceptedCount,
        rejectedCount: benchmarkGate.reviewedMetrics.rejectedCount,
        expectationFailureCount: benchmarkGate.reviewedMetrics.expectationFailureCount,
        networkCallsMade: benchmarkGate.reviewedMetrics.networkCallsMade === true
      }
    },
    localClient: {
      schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CHECK_SCHEMA_VERSION,
      dryRunOnly: true,
      stubResponseValidated: benchmarkReport.acceptedCount === 1 && benchmarkGate.hardBlockers.length === 0,
      approvedLocalFixtureModeRequired: true,
      rawPromptPersisted: false,
      rawModelResponsePersisted: false,
      rawImagePersisted: false,
      rawImagePathPersisted: false,
      requestPayloadPersisted: false
    },
    localModelSmoke: localModelSmoke
      ? {
        runMode: localModelSmoke.runMode,
        servingStack: localModelSmoke.servingStack,
        modelId: localModelSmoke.modelId,
        fixtureCount: localModelSmoke.fixtureCount,
        acceptedCount: localModelSmoke.acceptedCount,
        rejectedCount: localModelSmoke.rejectedCount,
        validationCode: localModelSmoke.validationCode,
        fallbackCategory: localModelSmoke.fallbackCategory,
        latencyBucket: localModelSmoke.latencyBucket,
        networkCallsMade: localModelSmoke.networkCallsMade === true,
        rawPromptPersisted: false,
        rawModelResponsePersisted: false,
        rawImagePersisted: false,
        rawImagePathPersisted: false,
        requestPayloadPersisted: false
      }
      : null
  };

  const redaction = assertOpenWeightVlmLocalSandboxSmokeReportRedacted(report);
  if (!redaction.ok) {
    report.hardBlockers.push(blocker(
      "local_sandbox_smoke_redaction_failed",
      "local_client",
      "blocked_for_artifact_leakage",
      "Local sandbox smoke report redaction failed. Do not review or commit this report."
    ));
    report.eligibleForLocalSandboxSmoke = false;
    report.eligibleForFutureLocalModelRun = false;
  }

  return report;
}

async function runTransformersFastApiSmoke(config, options = {}) {
  const startedAt = Date.now();
  const timeoutMs = config.timeoutMs;
  const fetchImpl = options.fetchImpl || fetch;
  const requestBody = {
    schemaVersion: "open_weight_vlm_local_fastapi_request.v1",
    fixtureId: config.fixtureId,
    modelId: config.modelId,
    outputContract: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION
  };

  let response;
  try {
    response = await fetchImpl(config.modelServerUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch {
    return localSmokeResult({
      accepted: false,
      errorCode: "local_model_unavailable",
      fallbackCategory: "blocked_for_provider_integration",
      latencyMs: Date.now() - startedAt
    });
  }

  if (!response.ok) {
    return localSmokeResult({
      accepted: false,
      errorCode: "local_model_unavailable",
      fallbackCategory: "blocked_for_provider_integration",
      latencyMs: Date.now() - startedAt
    });
  }

  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return localSmokeResult({
      accepted: false,
      errorCode: "invalid_json",
      fallbackCategory: "invalid_json",
      latencyMs: Date.now() - startedAt
    });
  }

  const candidate = isPlainObject(parsed) && "candidate" in parsed ? parsed.candidate : parsed;
  const validation = validateOpenWeightVlmPhotoAdvisorCandidate(candidate);
  return localSmokeResult({
    accepted: validation.ok,
    errorCode: validation.ok ? null : validation.error.code,
    fallbackCategory: validation.ok ? null : validation.error.fallbackCategory,
    validationCode: validation.ok ? null : validation.error.code,
    latencyMs: Date.now() - startedAt
  });

  function localSmokeResult({
    accepted,
    errorCode = null,
    fallbackCategory = null,
    validationCode = null,
    latencyMs = 0
  }) {
    return {
      runMode: "local_model_smoke",
      servingStack: "transformers_fastapi",
      modelId: config.modelId,
      fixtureCount: 1,
      acceptedCount: accepted ? 1 : 0,
      rejectedCount: accepted ? 0 : 1,
      errorCode,
      validationCode,
      fallbackCategory,
      latencyBucket: latencyBucket(latencyMs),
      networkCallsMade: true
    };
  }
}

export function assertOpenWeightVlmLocalSandboxSmokeReportRedacted(report = {}) {
  const benchmarkRedaction = assertOpenWeightVlmBenchmarkReportRedacted(report.stubbedBenchmark || {});
  if (!benchmarkRedaction.ok) {
    return benchmarkRedaction;
  }

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
          code: "local_sandbox_smoke_not_redacted",
          message: "Local sandbox smoke report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

function runStubbedBenchmarkReport() {
  const result = evaluateOpenWeightVlmBenchmarkCase(stubbedSmokeCase());
  return summarizeOpenWeightVlmBenchmark([result]);
}

function stubbedSmokeCase() {
  return {
    id: "local_sandbox_stub_bright_daylight",
    scenario: "bright_daylight",
    expectedStatus: "accepted",
    sourceType: "internal",
    allowedContext: "imageOnly",
    modelOutput: {
      schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
      sourceType: "internal",
      allowedContext: "imageOnly",
      moodKey: "mood.bright_clean",
      visualObservationKey: "observation.bright_daylight",
      creativeIntent: {
        classification: "style_positive",
        preserveSignals: []
      },
      technicalRisk: {
        level: "none",
        reasonKey: null
      },
      filterFamilyCandidate: "classic_film",
      optionalActionKey: "action.try_filter_first",
      retakeAllowed: false,
      retakeReasonKey: null,
      safety: {
        sensitiveInferenceDetected: false,
        forbiddenInferenceTypes: [],
        scoreOrRatingDetected: false,
        chainOfThoughtDetected: false,
        debugLeakageDetected: false
      }
    }
  };
}

function scopeBlockers(items = [], scope) {
  return Array.isArray(items)
    ? items.map((item) => blocker(item.code, scope, item.category, item.message))
    : [];
}

function scopeWarnings(items = [], scope) {
  return Array.isArray(items)
    ? items.map((item) => ({
      code: sanitizeToken(item.code || "warning"),
      scope,
      message: String(item.message || "Review local sandbox warning.").slice(0, 160)
    }))
    : [];
}

function uniqueBlockers(items = []) {
  const seen = new Set();
  const unique = [];
  for (const item of items) {
    const key = `${item.scope}:${item.category}:${item.code}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

function blocker(code, scope, category, message) {
  return {
    code: sanitizeToken(code || "blocked"),
    scope,
    category: sanitizeToken(category || "blocked_for_provider_integration"),
    message: String(message || "Local sandbox smoke path is blocked.").slice(0, 180)
  };
}

function sanitizeConfig(value = {}) {
  return {
    schemaVersion: sanitizeToken(value.schemaVersion || "unknown"),
    configValid: value.configValid === true,
    configPresent: value.configPresent === true,
    configPathBucket: sanitizeToken(value.configPathBucket || "missing"),
    configEnabled: value.configEnabled === true,
    servingStack: sanitizeToken(value.servingStack || "unknown"),
    modelId: sanitizeToken(value.modelId || "unknown"),
    modelServerConfigured: value.modelServerConfigured === true,
    modelServerUrlBucket: sanitizeToken(value.modelServerUrlBucket || "unknown"),
    timeoutMs: Number.isFinite(value.timeoutMs) ? value.timeoutMs : 0,
    fixtureMode: sanitizeToken(value.fixtureMode || "unknown"),
    fixtureIdBucket: sanitizeToken(value.fixtureIdBucket || "missing"),
    fixtureConfigured: value.fixtureConfigured === true,
    allowNetworkCalls: value.allowNetworkCalls === true,
    payloadLoggingDisabled: value.payloadLoggingDisabled === true,
    rawPromptLoggingDisabled: value.rawPromptLoggingDisabled === true,
    rawModelResponseLoggingDisabled: value.rawModelResponseLoggingDisabled === true,
    rawImageLoggingDisabled: value.rawImageLoggingDisabled === true,
    rawImagePathLoggingDisabled: value.rawImagePathLoggingDisabled === true,
    requestPayloadLoggingDisabled: value.requestPayloadLoggingDisabled === true,
    reportContainsRawUserContent: value.reportContainsRawUserContent === true,
    productionReady: false,
    networkCallsMade: false
  };
}

function latencyBucket(latencyMs) {
  if (!Number.isFinite(latencyMs)) {
    return "unknown";
  }
  if (latencyMs < 1000) {
    return "lt_1s";
  }
  if (latencyMs < 5000) {
    return "1s_to_5s";
  }
  if (latencyMs < 15000) {
    return "5s_to_15s";
  }
  return "gt_15s";
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
