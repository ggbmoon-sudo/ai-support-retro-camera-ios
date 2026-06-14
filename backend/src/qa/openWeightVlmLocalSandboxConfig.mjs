import { readFile } from "node:fs/promises";
import path from "node:path";

export const OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CONFIG_SCHEMA_VERSION = "open_weight_vlm_local_sandbox_config.v1";
export const OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CHECK_SCHEMA_VERSION = "open_weight_vlm_local_sandbox_check.v1";

const ALLOWED_CONFIG_KEYS = new Set([
  "enabled",
  "servingStack",
  "modelId",
  "modelServerUrl",
  "timeoutMs",
  "fixtureMode",
  "allowNetworkCalls",
  "fixtureId"
]);

const ALLOWED_SERVING_STACKS = new Set(["vllm", "sglang", "transformers", "transformers_fastapi", "ollama"]);
const ALLOWED_MODEL_IDS = new Set([
  "qwen2.5-vl-7b-instruct",
  "qwen3-vl-8b-instruct",
  "minicpm-v-4.5",
  "internvl3-8b"
]);
const ALLOWED_FIXTURE_MODES = new Set(["approved_local_only"]);
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1"]);

const DEFAULT_CONFIG = Object.freeze({
  enabled: false,
  servingStack: "vllm",
  modelId: "qwen2.5-vl-7b-instruct",
  modelServerUrl: "",
  timeoutMs: 30000,
  fixtureMode: "approved_local_only",
  allowNetworkCalls: false,
  fixtureId: "local_smoke_fixture"
});

export async function loadOpenWeightVlmLocalSandboxConfig(configPath, options = {}) {
  if (!configPath) {
    if (options.requireConfig) {
      return invalidConfig("config_missing", "Local sandbox config is required for this mode.", {
        configPathBucket: "missing"
      });
    }
    return {
      ok: true,
      value: summarizeLocalSandboxConfig(DEFAULT_CONFIG, {
        configPresent: false,
        configPathBucket: "missing"
      })
    };
  }

  let rawText;
  try {
    rawText = await readFile(configPath, "utf8");
  } catch {
    if (options.requireConfig) {
      return invalidConfig("config_missing", "Local sandbox config is missing or unreadable.", {
        configPathBucket: bucketConfigPath(configPath)
      });
    }
    return {
      ok: true,
      value: summarizeLocalSandboxConfig(DEFAULT_CONFIG, {
        configPresent: false,
        configPathBucket: bucketConfigPath(configPath)
      })
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return invalidConfig("invalid_json", "Local sandbox config is not valid JSON.", {
      configPathBucket: bucketConfigPath(configPath)
    });
  }

  return validateOpenWeightVlmLocalSandboxConfig(parsed, {
    configPresent: true,
    configPathBucket: bucketConfigPath(configPath)
  });
}

export function validateOpenWeightVlmLocalSandboxConfig(input, options = {}) {
  if (!isPlainObject(input)) {
    return invalidConfig("invalid_schema", "Local sandbox config must be a JSON object.", options);
  }

  const extraKey = Object.keys(input).find((key) => !ALLOWED_CONFIG_KEYS.has(key));
  if (extraKey) {
    return invalidConfig("invalid_schema", "Local sandbox config contains an unsupported field.", {
      ...options,
      field: sanitizeToken(extraKey)
    });
  }

  const config = {
    ...DEFAULT_CONFIG,
    ...input
  };

  if (typeof config.enabled !== "boolean") {
    return invalidConfig("invalid_schema", "enabled must be boolean.", { ...options, field: "enabled" });
  }

  if (typeof config.allowNetworkCalls !== "boolean") {
    return invalidConfig("invalid_schema", "allowNetworkCalls must be boolean.", { ...options, field: "allowNetworkCalls" });
  }

  if (!ALLOWED_SERVING_STACKS.has(config.servingStack)) {
    return invalidConfig("unsupported_serving_stack", "servingStack is not supported.", {
      ...options,
      field: "servingStack"
    });
  }

  if (!ALLOWED_MODEL_IDS.has(config.modelId)) {
    return invalidConfig("unsupported_model_id", "modelId is not supported for this sandbox preflight.", {
      ...options,
      field: "modelId"
    });
  }

  if (!ALLOWED_FIXTURE_MODES.has(config.fixtureMode)) {
    return invalidConfig("invalid_fixture_mode", "fixtureMode must be approved_local_only.", {
      ...options,
      field: "fixtureMode"
    });
  }

  if (!Number.isInteger(config.timeoutMs) || config.timeoutMs < 1000 || config.timeoutMs > 120000) {
    return invalidConfig("invalid_timeout", "timeoutMs must be an integer between 1000 and 120000.", {
      ...options,
      field: "timeoutMs"
    });
  }

  if (typeof config.fixtureId !== "string" || !/^[a-z0-9][a-z0-9_-]{0,63}$/u.test(config.fixtureId)) {
    return invalidConfig("invalid_fixture_id", "fixtureId must be a short non-sensitive fixture token.", {
      ...options,
      field: "fixtureId"
    });
  }

  const urlCheck = validateModelServerUrl(config.modelServerUrl, {
    requireConcreteUrl: config.enabled || config.allowNetworkCalls
  });
  if (!urlCheck.ok) {
    return invalidConfig(urlCheck.code, urlCheck.message, {
      ...options,
      field: "modelServerUrl"
    });
  }

  return {
    ok: true,
    runtimeValue: {
      enabled: config.enabled,
      servingStack: config.servingStack,
      modelId: config.modelId,
      modelServerUrl: config.modelServerUrl.trim(),
      timeoutMs: config.timeoutMs,
      fixtureMode: config.fixtureMode,
      allowNetworkCalls: config.allowNetworkCalls,
      fixtureId: config.fixtureId
    },
    value: summarizeLocalSandboxConfig(config, {
      ...options,
      modelServerUrlBucket: urlCheck.bucket,
      modelServerConfigured: urlCheck.configured
    })
  };
}

export function evaluateOpenWeightVlmLocalSandboxGate(summary = {}, options = {}) {
  const runLocalModel = options.runLocalModel === true;
  const hardBlockers = [];
  const warnings = [];

  if (summary.productionReady === true) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "not_production_ready",
      "productionReady must remain false for the local VLM sandbox."
    ));
  }

  if (summary.configValid === false) {
    hardBlockers.push(blocker(
      summary.errorCode || "invalid_config",
      "blocked_for_local_config",
      "Local VLM sandbox config is invalid."
    ));
  }

  if (summary.configEnabled === true && summary.allowNetworkCalls !== true) {
    hardBlockers.push(blocker(
      "network_opt_in_missing",
      "blocked_for_provider_integration",
      "Config is enabled but allowNetworkCalls is false."
    ));
  }

  if (summary.allowNetworkCalls === true && summary.configEnabled !== true) {
    hardBlockers.push(blocker(
      "enabled_false_network_true",
      "blocked_for_provider_integration",
      "allowNetworkCalls cannot be true while enabled is false."
    ));
  }

  if (summary.allowNetworkCalls === true && summary.modelServerConfigured !== true) {
    hardBlockers.push(blocker(
      "model_server_missing",
      "blocked_for_provider_integration",
      "Network calls require a concrete local model server URL in ignored local config."
    ));
  }

  if (!summary.configPresent) {
    warnings.push(warning(
      "local_config_missing",
      "No local config file was loaded; sandbox remains disabled."
    ));
  }

  if (!runLocalModel) {
    return {
      schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CHECK_SCHEMA_VERSION,
      runMode: "dry_run",
      productionReady: false,
      eligibleForFutureLocalModelRun: hardBlockers.length === 0
        && summary.configEnabled === true
        && summary.allowNetworkCalls === true
        && summary.modelServerConfigured === true,
      statusCategories: statusCategoriesFor(hardBlockers, "dry_run_checked"),
      hardBlockers,
      warnings,
      reviewedConfig: sanitizeSummary(summary),
      networkCallsMade: false
    };
  }

  if (summary.configPresent !== true) {
    hardBlockers.push(blocker(
      "config_missing",
      "blocked_for_local_config",
      "A real local-model run requires an ignored local config file."
    ));
  }

  if (summary.configEnabled !== true) {
    hardBlockers.push(blocker(
      "sandbox_disabled",
      "blocked_for_provider_integration",
      "Local VLM sandbox config must set enabled true before a real local-model run."
    ));
  }

  if (summary.allowNetworkCalls !== true) {
    hardBlockers.push(blocker(
      "network_opt_in_missing",
      "blocked_for_provider_integration",
      "Local VLM sandbox config must set allowNetworkCalls true before a real local-model run."
    ));
  }

  if (summary.modelServerConfigured !== true) {
    hardBlockers.push(blocker(
      "model_server_missing",
      "blocked_for_provider_integration",
      "A real local-model run requires a concrete local model server URL in ignored local config."
    ));
  }

  if (summary.servingStack !== "transformers_fastapi") {
    hardBlockers.push(blocker(
      "unsupported_local_serving_stack",
      "blocked_for_provider_integration",
      "Phase 20-D1 only prepares the Transformers FastAPI local adapter path."
    ));
  }

  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CHECK_SCHEMA_VERSION,
    runMode: "run_local_model",
    productionReady: false,
    eligibleForFutureLocalModelRun: false,
    statusCategories: statusCategoriesFor(hardBlockers, "not_production_ready"),
    hardBlockers,
    warnings,
    reviewedConfig: sanitizeSummary(summary),
    networkCallsMade: false
  };
}

export function localSandboxConfigPathFromRepoRoot(repoRoot = process.cwd()) {
  return path.join(repoRoot, "config", "open-weight-vlm.local.json");
}

function summarizeLocalSandboxConfig(config, options = {}) {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CONFIG_SCHEMA_VERSION,
    configValid: true,
    configPresent: options.configPresent === true,
    configPathBucket: sanitizeConfigPathBucket(options.configPathBucket),
    configEnabled: config.enabled === true,
    servingStack: config.servingStack,
    modelId: config.modelId,
    modelServerConfigured: options.modelServerConfigured === true,
    modelServerUrlBucket: options.modelServerUrlBucket || "missing",
    timeoutMs: config.timeoutMs,
    fixtureMode: config.fixtureMode,
    fixtureIdBucket: config.fixtureId ? "configured" : "missing",
    fixtureConfigured: Boolean(config.fixtureId),
    allowNetworkCalls: config.allowNetworkCalls === true,
    payloadLoggingDisabled: true,
    rawPromptLoggingDisabled: true,
    rawModelResponseLoggingDisabled: true,
    rawImageLoggingDisabled: true,
    rawImagePathLoggingDisabled: true,
    requestPayloadLoggingDisabled: true,
    reportContainsRawUserContent: false,
    productionReady: false,
    networkCallsMade: false
  };
}

function validateModelServerUrl(value, options = {}) {
  if (typeof value !== "string") {
    return {
      ok: false,
      code: "invalid_model_server_url",
      message: "modelServerUrl must be a string."
    };
  }

  const trimmed = value.trim();
  if (!trimmed) {
    if (options.requireConcreteUrl) {
      return {
        ok: false,
        code: "model_server_url_required",
        message: "modelServerUrl is required when sandbox networking is enabled."
      };
    }
    return { ok: true, configured: false, bucket: "missing" };
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      ok: false,
      code: "invalid_model_server_url",
      message: "modelServerUrl must be a valid local http URL."
    };
  }

  if (url.username || url.password || url.search || url.hash) {
    return {
      ok: false,
      code: "unsafe_model_server_url",
      message: "modelServerUrl must not include credentials, query strings, or fragments."
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return {
      ok: false,
      code: "unsupported_model_server_protocol",
      message: "modelServerUrl must use http or https."
    };
  }

  if (!LOCAL_HOSTS.has(url.hostname)) {
    return {
      ok: false,
      code: "non_local_model_server_url",
      message: "modelServerUrl must be local-only in Phase 20-A."
    };
  }

  if (url.protocol === "https:" && url.hostname !== "localhost") {
    return {
      ok: false,
      code: "unsupported_model_server_protocol",
      message: "https is only allowed for localhost in this local sandbox preflight."
    };
  }

  return {
    ok: true,
    configured: true,
    bucket: url.hostname === "localhost" ? "local_loopback_name" : "local_loopback_ip"
  };
}

function invalidConfig(code, message, options = {}) {
  return {
    ok: false,
    error: {
      code,
      message,
      field: options.field ? sanitizeToken(options.field) : undefined
    },
    value: {
      schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CONFIG_SCHEMA_VERSION,
      configValid: false,
      configPresent: options.configPresent === true,
      configPathBucket: sanitizeConfigPathBucket(options.configPathBucket),
      errorCode: code,
      field: options.field ? sanitizeToken(options.field) : undefined,
      productionReady: false,
      networkCallsMade: false
    }
  };
}

function sanitizeSummary(summary = {}) {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_SANDBOX_CONFIG_SCHEMA_VERSION,
    configValid: summary.configValid === true,
    configPresent: summary.configPresent === true,
    configPathBucket: sanitizeConfigPathBucket(summary.configPathBucket),
    configEnabled: summary.configEnabled === true,
    servingStack: sanitizeToken(summary.servingStack || "unknown"),
    modelId: sanitizeToken(summary.modelId || "unknown"),
    modelServerConfigured: summary.modelServerConfigured === true,
    modelServerUrlBucket: sanitizeToken(summary.modelServerUrlBucket || "unknown"),
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
    reportContainsRawUserContent: summary.reportContainsRawUserContent === true,
    productionReady: false,
    networkCallsMade: false
  };
}

function statusCategoriesFor(hardBlockers, successCategory) {
  const categories = new Set(["not_production_ready"]);
  for (const item of hardBlockers) {
    categories.add(item.category);
  }
  if (hardBlockers.length === 0) {
    categories.add(successCategory);
  }
  return Array.from(categories);
}

function blocker(code, category, message) {
  return { code, category, message };
}

function warning(code, message) {
  return { code, message };
}

function bucketConfigPath(configPath) {
  const basename = path.basename(String(configPath || ""));
  if (!basename) {
    return "missing";
  }
  if (basename.endsWith(".example.json")) {
    return "example_config";
  }
  if (basename === "open-weight-vlm.local.json") {
    return "local_config";
  }
  return "custom_config";
}

function sanitizeConfigPathBucket(value) {
  const bucket = sanitizeToken(value || "missing");
  return ["missing", "example_config", "local_config", "custom_config"].includes(bucket)
    ? bucket
    : "custom_config";
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
