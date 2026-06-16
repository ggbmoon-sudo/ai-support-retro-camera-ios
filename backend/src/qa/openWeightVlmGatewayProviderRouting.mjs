export const OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_ROUTING_SCHEMA_VERSION =
  "open_weight_vlm_gateway_provider_routing.v1";

export const OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_MODES = Object.freeze([
  "local_stub",
  "local_contract_echo",
  "local_model_blocked",
  "future_vllm_blocked",
  "future_sglang_blocked",
  "manual_ollama_lmstudio_blocked",
  "production_blocked"
]);

const PROVIDER_POLICIES = Object.freeze({
  local_stub: {
    selectedRoute: "local_stub_adapter",
    routeAllowed: true,
    blockReason: null,
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  },
  local_contract_echo: {
    selectedRoute: "local_private_no_model_contract_echo",
    routeAllowed: true,
    blockReason: null,
    networkCallsAllowed: true,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  },
  local_model_blocked: {
    selectedRoute: "local_model_adapter",
    routeAllowed: false,
    blockReason: "blocked_for_phase21c_local_model",
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  },
  future_vllm_blocked: {
    selectedRoute: "future_vllm_adapter",
    routeAllowed: false,
    blockReason: "blocked_for_future_serving_stack",
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  },
  future_sglang_blocked: {
    selectedRoute: "future_sglang_adapter",
    routeAllowed: false,
    blockReason: "blocked_for_future_serving_stack",
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  },
  manual_ollama_lmstudio_blocked: {
    selectedRoute: "manual_ollama_lmstudio",
    routeAllowed: false,
    blockReason: "blocked_for_manual_only_provider",
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  },
  production_blocked: {
    selectedRoute: "production_gateway",
    routeAllowed: false,
    blockReason: "blocked_for_production_endpoint",
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  }
});

const RAW_ARTIFACT_POLICY = Object.freeze({
  promptBodyAllowed: false,
  modelTextAllowed: false,
  imageLocationAllowed: false,
  encodedImageAllowed: false,
  payloadLoggingAllowed: false,
  providerTextLoggingAllowed: false,
  localConfigPrintingAllowed: false,
  fixtureRegistryPrintingAllowed: false,
  serverLogPrintingAllowed: false,
  exifPrintingAllowed: false
});

const LEGACY_RAW_ARTIFACT_POLICY_KEYS = Object.freeze([
  "rawPromptAllowed",
  "rawModelOutputAllowed",
  "rawImagePathAllowed",
  "rawImageBase64Allowed",
  "requestPayloadLoggingAllowed",
  "providerResponseLoggingAllowed"
]);

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "data:image",
  "base64",
  "image_url",
  "fullPrompt",
  "rawPrompt",
  "\"requestPayload\":",
  "rawResponse",
  "rawProviderResponse",
  "rawModelOutput",
  "modelOutput",
  "modelResponseText",
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
  "C:\\",
  "EXIF",
  "GPS",
  "chain-of-thought",
  "provider debug",
  "stack trace"
]);

export function evaluateOpenWeightVlmGatewayProviderRoute(options = {}) {
  const requestedProviderMode = sanitizeToken(options.requestedProviderMode || "local_stub");
  const policy = PROVIDER_POLICIES[requestedProviderMode];
  const hardBlockers = [];

  if (!policy) {
    hardBlockers.push("blocked_for_unknown_provider_mode");
  }

  const route = {
    ...defaultBlockedPolicy(requestedProviderMode),
    ...(policy || {})
  };

  if (options.productionReady !== false) {
    hardBlockers.push("blocked_for_production_flag");
  }
  if (options.appFacingEndpoint === true || route.appFacingEndpointAllowed === true) {
    hardBlockers.push("blocked_for_app_facing_endpoint");
  }
  if (options.productionEndpoint === true || route.productionEndpointAllowed === true) {
    hardBlockers.push("blocked_for_production_endpoint");
  }
  if (options.modelCallsAllowed === true || route.modelCallsAllowed === true) {
    hardBlockers.push("blocked_for_model_call");
  }
  if (options.qwenInferenceAllowed === true || route.qwenInferenceAllowed === true) {
    hardBlockers.push("blocked_for_qwen_inference");
  }
  if (options.benchmarkAllowed === true || route.benchmarkAllowed === true) {
    hardBlockers.push("blocked_for_benchmark_execution");
  }
  if (hasRawArtifactPolicyViolation(options.rawArtifactPolicy)) {
    hardBlockers.push("blocked_for_raw_artifact_policy");
  }
  if (route.routeAllowed !== true && route.blockReason) {
    hardBlockers.push(route.blockReason);
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_ROUTING_SCHEMA_VERSION,
    runMode: "gateway_provider_routing_dry_run",
    scope: "backend_internal_only",
    requestedProviderMode,
    selectedRoute: sanitizeToken(route.selectedRoute),
    routeAllowed: route.routeAllowed === true && hardBlockers.length === 0,
    blockReason: primaryBlockReason(hardBlockers),
    networkCallsAllowed: route.networkCallsAllowed === true,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false,
    rawArtifactPolicy: RAW_ARTIFACT_POLICY,
    validatorRequired: true,
    safetyFallbackRequired: true,
    productionReady: false,
    hardBlockers: unique(hardBlockers),
    statusCategories: unique([
      hardBlockers.length === 0
        ? "pass_for_gateway_provider_routing_dry_run"
        : "blocked_for_gateway_provider_routing_dry_run",
      ...hardBlockers,
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmGatewayProviderRoutingReportRedacted(report);
  if (!redaction.ok) {
    report.routeAllowed = false;
    report.blockReason = "blocked_for_unsanitized_output";
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_gateway_provider_routing_dry_run",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmGatewayProviderRoutingDryRun() {
  const decisions = [
    ...OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_MODES.map((mode) =>
      evaluateOpenWeightVlmGatewayProviderRoute({
        requestedProviderMode: mode,
        productionReady: false
      })
    ),
    evaluateOpenWeightVlmGatewayProviderRoute({
      requestedProviderMode: "unknown_provider",
      productionReady: false
    })
  ];
  const allowedRoutes = decisions.filter((decision) => decision.routeAllowed);
  const blockedRoutes = decisions.filter((decision) => !decision.routeAllowed);
  const expectedBlockedReasons = unique(blockedRoutes.flatMap((decision) => decision.hardBlockers));

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_ROUTING_SCHEMA_VERSION,
    runMode: "gateway_provider_routing_dry_run",
    scope: "backend_internal_only",
    productionReady: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    eligibleForPhase21DPlanning: true,
    eligibleForAppIntegration: false,
    statusCategories: [
      "pass_for_gateway_provider_routing_policy_review",
      "not_production_ready"
    ],
    providerModeCount: decisions.length,
    allowedRouteCount: allowedRoutes.length,
    blockedRouteCount: blockedRoutes.length,
    allowedProviderModes: allowedRoutes.map((decision) => decision.requestedProviderMode),
    blockedProviderModes: blockedRoutes.map((decision) => decision.requestedProviderMode),
    expectedBlockedReasons,
    reviewedDecisions: decisions,
    hardBlockers: []
  };

  const redaction = assertOpenWeightVlmGatewayProviderRoutingReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForPhase21DPlanning = false;
    report.hardBlockers = ["blocked_for_unsanitized_output"];
    report.statusCategories = [
      "blocked_for_gateway_provider_routing_policy_review",
      ...report.hardBlockers,
      "not_production_ready"
    ];
  }

  return report;
}

export function assertOpenWeightVlmGatewayProviderRoutingReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "gateway_provider_routing_not_redacted",
        message: "Gateway provider routing report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function defaultBlockedPolicy(mode) {
  return {
    selectedRoute: `unknown_${sanitizeToken(mode)}`,
    routeAllowed: false,
    blockReason: "blocked_for_unknown_provider_mode",
    networkCallsAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    appFacingEndpointAllowed: false,
    productionEndpointAllowed: false
  };
}

function hasRawArtifactPolicyViolation(policy = {}) {
  if (!policy || typeof policy !== "object") {
    return false;
  }
  return Object.entries(policy).some(([key, value]) => {
    if (Object.hasOwn(RAW_ARTIFACT_POLICY, key)) {
      return value !== RAW_ARTIFACT_POLICY[key];
    }
    if (LEGACY_RAW_ARTIFACT_POLICY_KEYS.includes(key)) {
      return value !== false;
    }
    return false;
  });
}

function primaryBlockReason(blockers) {
  if (blockers.length === 0) {
    return null;
  }
  return sanitizeToken(blockers[0]);
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
