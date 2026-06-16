export const OPEN_WEIGHT_VLM_DEPLOYMENT_CONFIG_ENV_PREFLIGHT_SCHEMA_VERSION =
  "open_weight_vlm_deployment_config_env_preflight.v1";

const ALLOWED_ENVIRONMENT_BUCKETS = new Set(["local", "staging", "production_blocked"]);
const ALLOWED_GATEWAY_MODE_BUCKETS = new Set([
  "local_stub",
  "local_contract_echo",
  "staging_blocked",
  "production_blocked"
]);
const ALLOWED_PROVIDER_MODE_BUCKETS = new Set([
  "local_stub",
  "local_contract_echo",
  "local_model_blocked",
  "future_self_hosted_blocked",
  "production_blocked"
]);
const ALLOWED_PROVIDER_URL_BUCKETS = new Set([
  "none",
  "local_loopback",
  "private_lan_ignored_local_only",
  "staging_secret_injected",
  "production_secret_injected_blocked"
]);
const ALLOWED_SECRET_INJECTION_MODE_BUCKETS = new Set([
  "none",
  "local_ignored_env",
  "secret_manager_required",
  "deployment_env_required"
]);
const ALLOWED_TIMEOUT_BUCKETS = new Set(["short", "medium", "long", "deployment_required"]);
const ALLOWED_MAX_IMAGE_BYTES_BUCKETS = new Set([
  "local_fixture_only",
  "future_upload_small",
  "future_upload_medium",
  "deployment_required"
]);

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "ngrok",
  "cloudflared",
  "base64",
  "data:image",
  "rawPrompt",
  "fullPrompt",
  "\"requestPayload\":",
  "rawModelOutput",
  "modelOutput",
  "rawProviderResponse",
  "Authorization",
  "Bearer ",
  "QWE_API_KEY=",
  "GEMINI_API_KEY=",
  "OPENAI_API_KEY=",
  "CODE0_API_KEY=",
  "INTENEXT_API_KEY=",
  ".jpg",
  ".jpeg",
  ".png",
  "EXIF",
  "GPS",
  "secret_value",
  "provider_key_value"
]);

const FORBIDDEN_CONFIG_VALUE_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "ngrok",
  "cloudflared",
  "data:image",
  "base64",
  "Bearer ",
  "Authorization",
  ".jpg",
  ".jpeg",
  ".png"
]);

const SECRET_FIELD_HINTS = Object.freeze([
  "apiKey",
  "secret",
  "token",
  "credential",
  "authorization",
  "password",
  "privateKey",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CODE0_API_KEY",
  "INTENEXT_API_KEY"
]);

export function deploymentConfigEnvLocalSandboxPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_DEPLOYMENT_CONFIG_ENV_PREFLIGHT_SCHEMA_VERSION,
    environmentBucket: "local",
    gatewayModeBucket: "local_stub",
    providerModeBucket: "local_stub",
    providerUrlBucket: "none",
    providerAuthModeBucket: "none",
    secretInjectionModeBucket: "none",
    timeoutBucket: "medium",
    maxImageBytesBucket: "local_fixture_only",
    rawLoggingDisabled: true,
    metadataStrippingRequired: true,
    consentRequired: true,
    retentionPolicyRequired: true,
    deletionPolicyRequired: true,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false,
    iOSDirectProviderAllowed: false,
    cameraCloudAiEntryEnabled: false,
    captureContextUploadEnabled: false,
    realUploadEnabled: false,
    committedSecretsPresent: false,
    iosProviderKeyFieldPresent: false,
    backendProviderKeyFieldPresent: false,
    hardcodedWindowsRuntimePath: false,
    hardcodedMacRuntimePath: false,
    hardcodedLanUrlInIos: false,
    committedProductionModelUrl: false,
    publicCloudTunnelLocalProviderUrl: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    productionReady: false,
    configValues: []
  };
}

export function deploymentConfigEnvStagingBlockedPolicy() {
  return {
    ...deploymentConfigEnvLocalSandboxPolicy(),
    environmentBucket: "staging",
    gatewayModeBucket: "staging_blocked",
    providerModeBucket: "future_self_hosted_blocked",
    providerUrlBucket: "staging_secret_injected",
    providerAuthModeBucket: "secret_bucket_required",
    secretInjectionModeBucket: "secret_manager_required",
    timeoutBucket: "deployment_required",
    maxImageBytesBucket: "deployment_required"
  };
}

export function deploymentConfigEnvProductionBlockedPolicy() {
  return {
    ...deploymentConfigEnvLocalSandboxPolicy(),
    environmentBucket: "production_blocked",
    gatewayModeBucket: "production_blocked",
    providerModeBucket: "production_blocked",
    providerUrlBucket: "production_secret_injected_blocked",
    providerAuthModeBucket: "secret_bucket_required",
    secretInjectionModeBucket: "secret_manager_required",
    timeoutBucket: "deployment_required",
    maxImageBytesBucket: "deployment_required"
  };
}

export function evaluateOpenWeightVlmDeploymentConfigEnvPreflight(
  policy = deploymentConfigEnvLocalSandboxPolicy()
) {
  const hardBlockers = unique([
    ...bucketBlockers(policy),
    ...flagBlockers(policy),
    ...configValueBlockers(policy.configValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_DEPLOYMENT_CONFIG_ENV_PREFLIGHT_SCHEMA_VERSION,
    runMode: "deployment_config_env_preflight",
    scope: "backend_internal_no_network_no_model",
    environmentBucket: sanitizeToken(policy.environmentBucket || "unknown"),
    gatewayModeBucket: sanitizeToken(policy.gatewayModeBucket || "unknown"),
    providerModeBucket: sanitizeToken(policy.providerModeBucket || "unknown"),
    providerUrlBucket: sanitizeToken(policy.providerUrlBucket || "unknown"),
    providerAuthModeBucket: sanitizeToken(policy.providerAuthModeBucket || "unknown"),
    secretInjectionModeBucket: sanitizeToken(policy.secretInjectionModeBucket || "unknown"),
    timeoutBucket: sanitizeToken(policy.timeoutBucket || "unknown"),
    maxImageBytesBucket: sanitizeToken(policy.maxImageBytesBucket || "unknown"),
    rawLoggingDisabled: policy.rawLoggingDisabled === true,
    metadataStrippingRequired: policy.metadataStrippingRequired === true,
    consentRequired: policy.consentRequired === true,
    retentionPolicyRequired: policy.retentionPolicyRequired === true,
    deletionPolicyRequired: policy.deletionPolicyRequired === true,
    appFacingEndpointAllowed: policy.appFacingEndpointAllowed === true,
    productionEndpointAllowed: policy.productionEndpointAllowed === true,
    iOSDirectProviderAllowed: policy.iOSDirectProviderAllowed === true,
    productionReady: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    eligibleForDeploymentConfigEnvReview: hardBlockers.length === 0,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      hardBlockers.length === 0
        ? "pass_for_deployment_config_env_preflight"
        : "blocked_for_deployment_config_env_preflight",
      ...hardBlockers,
      "not_production_ready"
    ]),
    blockers: hardBlockers,
    reviewedPolicy: {
      cameraCloudAiEntryEnabled: policy.cameraCloudAiEntryEnabled === true,
      captureContextUploadEnabled: policy.captureContextUploadEnabled === true,
      realUploadEnabled: policy.realUploadEnabled === true,
      committedSecretsPresent: policy.committedSecretsPresent === true,
      iosProviderKeyFieldPresent: policy.iosProviderKeyFieldPresent === true,
      backendProviderKeyFieldPresent: policy.backendProviderKeyFieldPresent === true,
      hardcodedWindowsRuntimePath: policy.hardcodedWindowsRuntimePath === true,
      hardcodedMacRuntimePath: policy.hardcodedMacRuntimePath === true,
      hardcodedLanUrlInIos: policy.hardcodedLanUrlInIos === true,
      committedProductionModelUrl: policy.committedProductionModelUrl === true,
      publicCloudTunnelLocalProviderUrl: policy.publicCloudTunnelLocalProviderUrl === true
    },
    requiredFutureUploadPolicies: {
      metadataStrippingRequired: policy.metadataStrippingRequired === true,
      consentRequired: policy.consentRequired === true,
      retentionPolicyRequired: policy.retentionPolicyRequired === true,
      deletionPolicyRequired: policy.deletionPolicyRequired === true
    },
    forbiddenRuntimePolicy: {
      committedSecretsAllowed: false,
      runtimeLocalPathsAllowed: false,
      committedProviderUrlAllowed: false,
      iOSDirectProviderAllowed: false,
      appFacingEndpointAllowed: false,
      productionEndpointAllowed: false,
      realUploadWithoutPolicyAllowed: false,
      rawLoggingAllowed: false
    },
    reviewedConfigValueBuckets: summarizeConfigValueBuckets(policy.configValues || [])
  };

  const redaction = assertOpenWeightVlmDeploymentConfigEnvPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForDeploymentConfigEnvReview = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_deployment_config_env_preflight",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmDeploymentConfigEnvPreflightSamples() {
  const reports = [
    evaluateOpenWeightVlmDeploymentConfigEnvPreflight(deploymentConfigEnvLocalSandboxPolicy()),
    evaluateOpenWeightVlmDeploymentConfigEnvPreflight(deploymentConfigEnvStagingBlockedPolicy()),
    evaluateOpenWeightVlmDeploymentConfigEnvPreflight(deploymentConfigEnvProductionBlockedPolicy())
  ];
  const blockers = unique(reports.flatMap((report) => report.blockers));

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_DEPLOYMENT_CONFIG_ENV_PREFLIGHT_SCHEMA_VERSION,
    runMode: "deployment_config_env_preflight_samples",
    scope: "backend_internal_no_network_no_model",
    productionReady: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    eligibleForDeploymentConfigEnvReview: reports.every((item) => item.eligibleForDeploymentConfigEnvReview),
    eligibleForAppIntegration: false,
    reviewedPolicyCount: reports.length,
    environmentBuckets: reports.map((item) => item.environmentBucket),
    gatewayModeBuckets: reports.map((item) => item.gatewayModeBucket),
    providerModeBuckets: reports.map((item) => item.providerModeBucket),
    providerUrlBuckets: reports.map((item) => item.providerUrlBucket),
    secretInjectionModeBuckets: reports.map((item) => item.secretInjectionModeBucket),
    statusCategories: unique([
      reports.every((item) => item.eligibleForDeploymentConfigEnvReview)
        ? "pass_for_deployment_config_env_preflight"
        : "blocked_for_deployment_config_env_preflight",
      ...blockers,
      "not_production_ready"
    ]),
    blockers,
    reviewedReports: reports
  };

  const redaction = assertOpenWeightVlmDeploymentConfigEnvPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForDeploymentConfigEnvReview = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_deployment_config_env_preflight",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmDeploymentConfigEnvPreflightReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "deployment_config_env_preflight_not_redacted",
        message: "Deployment config/env preflight report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function bucketBlockers(policy) {
  const blockers = [];
  const bucketRules = [
    ["environmentBucket", ALLOWED_ENVIRONMENT_BUCKETS, "blocked_for_unknown_environment_bucket"],
    ["gatewayModeBucket", ALLOWED_GATEWAY_MODE_BUCKETS, "blocked_for_unknown_gateway_mode_bucket"],
    ["providerModeBucket", ALLOWED_PROVIDER_MODE_BUCKETS, "blocked_for_unknown_provider_mode_bucket"],
    ["providerUrlBucket", ALLOWED_PROVIDER_URL_BUCKETS, "blocked_for_unknown_provider_url_bucket"],
    ["secretInjectionModeBucket", ALLOWED_SECRET_INJECTION_MODE_BUCKETS, "blocked_for_unknown_secret_injection_mode_bucket"],
    ["timeoutBucket", ALLOWED_TIMEOUT_BUCKETS, "blocked_for_unknown_timeout_bucket"],
    ["maxImageBytesBucket", ALLOWED_MAX_IMAGE_BYTES_BUCKETS, "blocked_for_unknown_max_image_bytes_bucket"]
  ];

  for (const [field, allowed, blocker] of bucketRules) {
    if (!allowed.has(policy[field])) {
      blockers.push(blocker);
    }
  }

  return blockers;
}

function flagBlockers(policy) {
  const blockers = [];
  const flagPairs = [
    ["committedSecretsPresent", "blocked_for_committed_secret"],
    ["iosProviderKeyFieldPresent", "blocked_for_ios_provider_key_field"],
    ["backendProviderKeyFieldPresent", "blocked_for_backend_provider_key_field"],
    ["hardcodedWindowsRuntimePath", "blocked_for_windows_runtime_path"],
    ["hardcodedMacRuntimePath", "blocked_for_mac_runtime_path"],
    ["hardcodedLanUrlInIos", "blocked_for_ios_lan_model_url"],
    ["committedProductionModelUrl", "blocked_for_committed_production_model_url"],
    ["publicCloudTunnelLocalProviderUrl", "blocked_for_public_cloud_tunnel_provider_url"],
    ["appFacingEndpointAllowed", "blocked_for_app_facing_endpoint"],
    ["productionEndpointAllowed", "blocked_for_production_endpoint"],
    ["iOSDirectProviderAllowed", "blocked_for_ios_direct_provider"],
    ["cameraCloudAiEntryEnabled", "blocked_for_camera_cloud_ai_entry"],
    ["captureContextUploadEnabled", "blocked_for_capture_context_upload"],
    ["modelCallsAllowed", "blocked_for_model_call"],
    ["qwenInferenceAllowed", "blocked_for_qwen_inference"],
    ["benchmarkAllowed", "blocked_for_benchmark_execution"]
  ];

  for (const [flag, blocker] of flagPairs) {
    if (policy[flag] === true) {
      blockers.push(blocker);
    }
  }
  if (policy.rawLoggingDisabled !== true) {
    blockers.push("blocked_for_raw_logging_enabled");
  }
  if (policy.metadataStrippingRequired !== true) {
    blockers.push("blocked_for_metadata_stripping_missing");
  }
  if (policy.consentRequired !== true) {
    blockers.push("blocked_for_consent_policy_missing");
  }
  if (policy.retentionPolicyRequired !== true) {
    blockers.push("blocked_for_retention_policy_missing");
  }
  if (policy.deletionPolicyRequired !== true) {
    blockers.push("blocked_for_deletion_policy_missing");
  }
  if (policy.realUploadEnabled === true && (
    policy.consentRequired !== true
    || policy.retentionPolicyRequired !== true
    || policy.deletionPolicyRequired !== true
    || policy.metadataStrippingRequired !== true
  )) {
    blockers.push("blocked_for_real_upload_without_policy");
  }

  return blockers;
}

function configValueBlockers(values) {
  const blockers = [];
  for (const entry of values) {
    const fieldBucket = sanitizeToken(entry?.fieldBucket || "unknown");
    const valueBucket = sanitizeToken(entry?.valueBucket || "unknown");
    const actualValue = typeof entry?.value === "string" ? entry.value : "";
    const normalizedFieldBucket = fieldBucket.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (
      SECRET_FIELD_HINTS.some((hint) =>
        normalizedFieldBucket.includes(String(hint).toLowerCase().replace(/[^a-z0-9]/g, ""))
      )
    ) {
      blockers.push("blocked_for_secret_field");
    }
    if (["secret_value", "api_key_value", "credential_value", "bearer_token_value"].includes(valueBucket)) {
      blockers.push("blocked_for_committed_secret");
    }
    if (["windows_runtime_path", "mac_runtime_path", "ios_lan_model_url", "production_model_url", "public_cloud_tunnel_url"].includes(valueBucket)) {
      blockers.push(blockerForValueBucket(valueBucket));
    }
    if (actualValue && FORBIDDEN_CONFIG_VALUE_SNIPPETS.some((snippet) => actualValue.includes(snippet))) {
      blockers.push("blocked_for_committed_raw_config_value");
    }
  }
  return unique(blockers);
}

function blockerForValueBucket(bucket) {
  const blockers = {
    windows_runtime_path: "blocked_for_windows_runtime_path",
    mac_runtime_path: "blocked_for_mac_runtime_path",
    ios_lan_model_url: "blocked_for_ios_lan_model_url",
    production_model_url: "blocked_for_committed_production_model_url",
    public_cloud_tunnel_url: "blocked_for_public_cloud_tunnel_provider_url"
  };
  return blockers[bucket] || "blocked_for_committed_raw_config_value";
}

function summarizeConfigValueBuckets(values) {
  const counts = {};
  for (const entry of values) {
    const fieldBucket = sanitizeToken(entry?.fieldBucket || "unknown");
    const valueBucket = sanitizeToken(entry?.valueBucket || "unknown");
    const bucket = sanitizedConfigValueSummaryBucket(fieldBucket, valueBucket);
    counts[bucket] = (counts[bucket] || 0) + 1;
  }
  return counts;
}

function sanitizedConfigValueSummaryBucket(fieldBucket, valueBucket) {
  const blockers = configValueBlockers([{ fieldBucket, valueBucket }]);
  if (blockers.includes("blocked_for_secret_field") || blockers.includes("blocked_for_committed_secret")) {
    return "blocked_secret_config_value";
  }
  if (blockers.includes("blocked_for_windows_runtime_path") || blockers.includes("blocked_for_mac_runtime_path")) {
    return "blocked_runtime_path_config_value";
  }
  if (
    blockers.includes("blocked_for_ios_lan_model_url") ||
    blockers.includes("blocked_for_committed_production_model_url") ||
    blockers.includes("blocked_for_public_cloud_tunnel_provider_url")
  ) {
    return "blocked_provider_url_config_value";
  }
  return "reviewed_config_value";
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
