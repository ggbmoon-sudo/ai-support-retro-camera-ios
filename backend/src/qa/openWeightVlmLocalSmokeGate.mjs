export const OPEN_WEIGHT_VLM_LOCAL_SMOKE_GATE_SCHEMA_VERSION = "open_weight_vlm_local_smoke_gate.v1";

export function evaluateOpenWeightVlmLocalSmokeGate({
  configSummary = {},
  configLoadedOk = true,
  configErrorCode = null,
  syntheticBenchmarkGate = {},
  localSmokeReport = {}
} = {}) {
  const hardBlockers = [];
  const warnings = [];

  if (configSummary.productionReady === true) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "not_production_ready",
      "productionReady must remain false for local VLM smoke gate review."
    ));
  }

  if (configLoadedOk !== true || configSummary.configValid === false) {
    hardBlockers.push(blocker(
      sanitizeToken(configErrorCode || configSummary.errorCode || "invalid_config"),
      "blocked_for_local_config",
      "Ignored local VLM config is missing, unreadable, or invalid."
    ));
  }

  if (configSummary.configPresent !== true) {
    hardBlockers.push(blocker(
      "config_missing",
      "blocked_for_local_config",
      "A future real-model smoke run requires ignored local config."
    ));
  }

  if (configSummary.configPresent === true && configSummary.configPathBucket !== "local_config") {
    hardBlockers.push(blocker(
      "config_not_ignored_local_path",
      "blocked_for_local_config",
      "Real-model smoke config must use the ignored local config path."
    ));
  }

  if (configSummary.configEnabled !== true) {
    hardBlockers.push(blocker(
      "sandbox_disabled",
      "blocked_for_provider_integration",
      "Local VLM sandbox config must set enabled true before a real-model smoke run."
    ));
  }

  if (configSummary.allowNetworkCalls !== true) {
    hardBlockers.push(blocker(
      "network_opt_in_missing",
      "blocked_for_provider_integration",
      "Local VLM sandbox config must set allowNetworkCalls true before a real-model smoke run."
    ));
  }

  if (configSummary.modelServerConfigured !== true) {
    hardBlockers.push(blocker(
      "model_server_missing",
      "blocked_for_provider_integration",
      "A real-model smoke run requires a validated local/private model server URL bucket."
    ));
  }

  if (configSummary.servingStack !== "transformers_fastapi") {
    hardBlockers.push(blocker(
      "unsupported_local_serving_stack",
      "blocked_for_provider_integration",
      "Phase 20-D1 real-model smoke gate only allows the Transformers FastAPI local adapter path."
    ));
  }

  if (configSummary.fixtureMode !== "approved_local_only") {
    hardBlockers.push(blocker(
      "non_approved_fixture_mode",
      "blocked_for_artifact_leakage",
      "Real-model smoke runs require approved_local_only fixture mode."
    ));
  }

  if (syntheticBenchmarkGate.eligibleForSyntheticContractReview !== true
    || Array.isArray(syntheticBenchmarkGate.hardBlockers) && syntheticBenchmarkGate.hardBlockers.length > 0) {
    hardBlockers.push(blocker(
      "synthetic_benchmark_gate_not_passed",
      "blocked_for_schema",
      "Synthetic benchmark gate must pass before any real-model smoke run."
    ));
  }

  if (localSmokeReport.eligibleForLocalSandboxSmoke !== true
    || Array.isArray(localSmokeReport.hardBlockers) && localSmokeReport.hardBlockers.length > 0
    || localSmokeReport.networkCallsMade === true) {
    hardBlockers.push(blocker(
      "local_smoke_default_not_passed",
      "blocked_for_provider_integration",
      "Default local sandbox smoke must pass in no-network mode before any real-model smoke run."
    ));
  }

  if (configSummary.configPresent !== true) {
    warnings.push(warning(
      "local_config_expected",
      "Create ignored local VLM config only when an approved local smoke run is planned."
    ));
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SMOKE_GATE_SCHEMA_VERSION,
    runMode: "real_model_smoke_gate",
    productionReady: false,
    providerConfigured: false,
    modelServerConfigured: configSummary.modelServerConfigured === true,
    networkCallsMade: false,
    eligibleForRealModelSmoke: hardBlockers.length === 0,
    statusCategories: statusCategoriesFor(hardBlockers),
    hardBlockers: uniqueBlockers(hardBlockers),
    warnings,
    reviewedConfig: sanitizeConfigSummary(configSummary),
    prerequisites: {
      syntheticBenchmarkGatePassed: syntheticBenchmarkGate.eligibleForSyntheticContractReview === true
        && (!Array.isArray(syntheticBenchmarkGate.hardBlockers) || syntheticBenchmarkGate.hardBlockers.length === 0),
      localSmokeDefaultPassed: localSmokeReport.eligibleForLocalSandboxSmoke === true
        && (!Array.isArray(localSmokeReport.hardBlockers) || localSmokeReport.hardBlockers.length === 0)
        && localSmokeReport.networkCallsMade !== true,
      approvedLocalFixtureMode: configSummary.fixtureMode === "approved_local_only"
    },
    safetyFlags: {
      payloadLoggingDisabled: configSummary.payloadLoggingDisabled === true,
      rawPromptLoggingDisabled: configSummary.rawPromptLoggingDisabled === true,
      rawModelResponseLoggingDisabled: configSummary.rawModelResponseLoggingDisabled === true,
      rawImageLoggingDisabled: configSummary.rawImageLoggingDisabled === true,
      rawImagePathLoggingDisabled: configSummary.rawImagePathLoggingDisabled === true,
      requestPayloadLoggingDisabled: configSummary.requestPayloadLoggingDisabled === true,
      reportContainsRawUserContent: false,
      rawPromptPersisted: false,
      rawModelResponsePersisted: false,
      rawImagePersisted: false,
      rawImagePathPersisted: false,
      requestPayloadPersisted: false
    }
  };

  const redaction = assertOpenWeightVlmLocalSmokeGateReportRedacted(report);
  if (!redaction.ok) {
    report.hardBlockers.push(blocker(
      "local_smoke_gate_redaction_failed",
      "blocked_for_artifact_leakage",
      "Local VLM smoke gate output contains forbidden artifact markers."
    ));
    report.eligibleForRealModelSmoke = false;
    report.statusCategories = statusCategoriesFor(report.hardBlockers);
  }

  return report;
}

export function assertOpenWeightVlmLocalSmokeGateReportRedacted(report = {}) {
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
          code: "local_smoke_gate_not_redacted",
          message: "Local VLM smoke gate report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

function sanitizeConfigSummary(summary = {}) {
  return {
    schemaVersion: sanitizeToken(summary.schemaVersion || "unknown"),
    configValid: summary.configValid === true,
    configPresent: summary.configPresent === true,
    configPathBucket: sanitizeToken(summary.configPathBucket || "missing"),
    configEnabled: summary.configEnabled === true,
    servingStack: sanitizeToken(summary.servingStack || "unknown"),
    modelId: sanitizeToken(summary.modelId || "unknown"),
    modelServerConfigured: summary.modelServerConfigured === true,
    modelServerUrlBucket: sanitizeToken(summary.modelServerUrlBucket || "missing"),
    timeoutMs: Number.isFinite(summary.timeoutMs) ? summary.timeoutMs : 0,
    fixtureMode: sanitizeToken(summary.fixtureMode || "unknown"),
    fixtureIdBucket: sanitizeToken(summary.fixtureIdBucket || "missing"),
    fixtureConfigured: summary.fixtureConfigured === true,
    allowNetworkCalls: summary.allowNetworkCalls === true,
    payloadLoggingDisabled: summary.payloadLoggingDisabled === true,
    rawPromptLoggingDisabled: summary.rawPromptLoggingDisabled === true,
    rawModelResponseLoggingDisabled: summary.rawModelResponseLoggingDisabled === true,
    rawImageLoggingDisabled: summary.rawImageLoggingDisabled === true,
    rawImagePathLoggingDisabled: summary.rawImagePathLoggingDisabled === true,
    requestPayloadLoggingDisabled: summary.requestPayloadLoggingDisabled === true,
    reportContainsRawUserContent: false,
    productionReady: false,
    networkCallsMade: false
  };
}

function statusCategoriesFor(hardBlockers) {
  const categories = new Set(["not_production_ready"]);
  for (const item of hardBlockers) {
    categories.add(item.category);
  }
  if (hardBlockers.length === 0) {
    categories.add("pass_for_real_model_smoke_gate");
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
    category: sanitizeToken(category || "blocked_for_provider_integration"),
    message: String(message || "Local VLM smoke gate is blocked.").slice(0, 180)
  };
}

function warning(code, message) {
  return {
    code: sanitizeToken(code || "warning"),
    message: String(message || "Review local VLM smoke gate warning.").slice(0, 180)
  };
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
