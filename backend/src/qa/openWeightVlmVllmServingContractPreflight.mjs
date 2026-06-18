export const OPEN_WEIGHT_VLM_VLLM_SERVING_CONTRACT_PREFLIGHT_SCHEMA_VERSION =
  "open_weight_vlm_vllm_serving_contract_preflight.v1";

const ALLOWED_ENDPOINT_CLASSES = Object.freeze([
  "none",
  "local_loopback_planned",
  "private_lan_planned"
]);

const VISION_CAPABLE_MODEL_CLASSES = Object.freeze([
  "qwen2_5_vl_reference",
  "qwen_vl_compatible",
  "qwen3_5_vlm_candidate"
]);

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "ws://",
  "wss://",
  "data:image",
  "/9j/",
  ".jpg",
  ".jpeg",
  ".png",
  "\"rawPrompt\":",
  "\"fullPrompt\":",
  "\"requestPayload\":",
  "\"rawModelOutput\":",
  "\"modelOutput\":",
  "\"rawProviderResponse\":",
  "Authorization",
  "Bearer ",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CODE0_API_KEY",
  "INTENEXT_API_KEY",
  "chain-of-thought",
  "secret_value",
  "model_server_url"
]);

export function vllmServingContractSafeNoModelPlan() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_VLLM_SERVING_CONTRACT_PREFLIGHT_SCHEMA_VERSION,
    servingStack: "vllm_candidate",
    modelClass: "qwen2_5_vl_reference",
    modelVisionCapable: true,
    endpointClass: "none",
    requestMode: "backend_mediated_contract_only",
    fixtureMode: "none",
    uploadMode: "none",
    outputMode: "structured_candidate_json",
    structuredJsonRequired: true,
    validatorRequired: true,
    fallbackRequired: true,
    safetyRequired: true,
    rawPromptLogging: false,
    rawOutputLogging: false,
    rawRequestPayloadLogging: false,
    rawImageLogging: false,
    base64Logging: false,
    pathLogging: false,
    exifGpsSensorLogging: false,
    providerDebugLogging: false,
    serverLogLeakageAllowed: false,
    requestPayloadPersistenceAllowed: false,
    rawOutputPersistenceAllowed: false,
    rawOutputPrinted: false,
    chainOfThoughtAllowed: false,
    scoreRatingAllowed: false,
    sensitiveInferenceAllowed: false,
    iOSDirectCallEnabled: false,
    iOSProviderKeyPresent: false,
    appEndpointEnabled: false,
    productionEndpointEnabled: false,
    cameraLiveCloudEntryEnabled: false,
    benchmarkExecutionRequested: false,
    modelCallRequested: false,
    vllmServerStartRequested: false,
    vllmEndpointCallRequested: false,
    modelDownloadRequested: false,
    servingStackSwitchRequested: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    productionReady: false,
    explicitApproval: false
  };
}

export function evaluateOpenWeightVlmVllmServingContractPreflight(
  plan = vllmServingContractSafeNoModelPlan()
) {
  const blockers = unique([
    ...shapeBlockers(plan),
    ...servingContractBlockers(plan),
    ...executionBlockers(plan),
    ...endpointBlockers(plan),
    ...loggingAndPersistenceBlockers(plan),
    ...validatorSafetyBlockers(plan),
    ...iosAndEndpointBoundaryBlockers(plan),
    ...languageSafetyBlockers(plan),
    ...modelCapabilityBlockers(plan),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const preflightEligible = blockers.length === 0;
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_VLLM_SERVING_CONTRACT_PREFLIGHT_SCHEMA_VERSION,
    servingStack: sanitizeToken(plan.servingStack || "unknown"),
    modelClass: sanitizeToken(plan.modelClass || "unknown"),
    modelVisionCapable: plan.modelVisionCapable === true,
    endpointClass: sanitizeToken(plan.endpointClass || "unknown"),
    requestMode: sanitizeToken(plan.requestMode || "unknown"),
    fixtureMode: sanitizeToken(plan.fixtureMode || "unknown"),
    uploadMode: sanitizeToken(plan.uploadMode || "unknown"),
    outputMode: sanitizeToken(plan.outputMode || "unknown"),
    structuredJsonRequired: plan.structuredJsonRequired === true,
    validatorRequired: plan.validatorRequired === true,
    fallbackRequired: plan.fallbackRequired === true,
    safetyRequired: plan.safetyRequired === true,
    vllmContractPreflightEligible: preflightEligible,
    blockers,
    vllmRuntimeStarted: false,
    vllmEndpointCalled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    servingStackSwitched: false,
    productionReady: false,
    eligibleForFutureVllmExecution: false,
    statusCategories: unique([
      preflightEligible
        ? "pass_for_vllm_no_model_serving_contract_preflight"
        : "blocked_for_vllm_no_model_serving_contract_preflight",
      ...blockers,
      "phase_21_q_no_model_contract_only",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmVllmServingContractPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.vllmContractPreflightEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_vllm_no_model_serving_contract_preflight",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmVllmServingContractPreflightSamples() {
  const base = vllmServingContractSafeNoModelPlan();
  const scenarios = [
    ["safe_no_model_vllm_contract", base],
    ["model_call_requested", { ...base, modelCallRequested: true }],
    ["benchmark_requested", { ...base, benchmarkExecutionRequested: true }],
    ["vllm_server_start_requested", { ...base, vllmServerStartRequested: true }],
    ["vllm_endpoint_call_requested", { ...base, vllmEndpointCallRequested: true }],
    ["model_download_requested", { ...base, modelDownloadRequested: true }],
    ["serving_switch_requested", { ...base, servingStackSwitchRequested: true }],
    ["production_ready_true", { ...base, productionReady: true }],
    ["public_endpoint", { ...base, endpointClass: "public_cloud" }],
    ["ngrok_endpoint", { ...base, endpointClass: "ngrok" }],
    ["raw_prompt_logging", { ...base, rawPromptLogging: true }],
    ["raw_output_logging", { ...base, rawOutputLogging: true }],
    ["raw_image_base64_path_logging", { ...base, rawImageLogging: true, base64Logging: true, pathLogging: true }],
    ["raw_request_payload_logging", { ...base, rawRequestPayloadLogging: true }],
    ["exif_gps_sensor_logging", { ...base, exifGpsSensorLogging: true }],
    ["missing_validator_fallback_safety", {
      ...base,
      structuredJsonRequired: false,
      validatorRequired: false,
      fallbackRequired: false,
      safetyRequired: false
    }],
    ["free_form_raw_model_text", { ...base, outputMode: "free_form_raw_model_text" }],
    ["ios_direct_call_key", { ...base, iOSDirectCallEnabled: true, iOSProviderKeyPresent: true }],
    ["app_prod_endpoint", { ...base, appEndpointEnabled: true, productionEndpointEnabled: true }],
    ["camera_live_cloud_entry", { ...base, cameraLiveCloudEntryEnabled: true }],
    ["text_only_model", { ...base, modelClass: "qwen_text_only", modelVisionCapable: false }],
    ["score_rating_allowed", { ...base, scoreRatingAllowed: true }],
    ["sensitive_inference_allowed", { ...base, sensitiveInferenceAllowed: true }],
    ["chain_of_thought_allowed", { ...base, chainOfThoughtAllowed: true }]
  ];

  const results = scenarios.map(([name, plan]) => ({
    scenario: name,
    report: evaluateOpenWeightVlmVllmServingContractPreflight(plan)
  }));
  const pass = results.find((item) => item.scenario === "safe_no_model_vllm_contract")?.report;
  const blocked = results.filter((item) => item.scenario !== "safe_no_model_vllm_contract");
  const blockers = [];
  if (!pass?.vllmContractPreflightEligible) {
    blockers.push("blocked_for_safe_contract_sample_failure");
  }
  if (blocked.some((item) => item.report.vllmContractPreflightEligible)) {
    blockers.push("blocked_for_blocked_sample_expectation_failure");
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_VLLM_SERVING_CONTRACT_PREFLIGHT_SCHEMA_VERSION,
    runMode: "vllm_no_model_serving_contract_preflight_samples",
    vllmContractPreflightEligible: blockers.length === 0,
    reviewedScenarioCount: results.length,
    safeNoModelContractPassed: pass?.vllmContractPreflightEligible === true,
    expectedBlockedScenarioCount: blocked.filter((item) => !item.report.vllmContractPreflightEligible).length,
    expectedBlockedReasons: unique(blocked.flatMap((item) => item.report.blockers)),
    nextPhaseRecommendation: "phase_21_r_sglang_no_model_serving_contract_preflight",
    blockers,
    vllmRuntimeStarted: false,
    vllmEndpointCalled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    servingStackSwitched: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_vllm_no_model_serving_contract_preflight"
        : "blocked_for_vllm_no_model_serving_contract_preflight",
      ...blockers,
      "phase_21_q_no_model_contract_only",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmVllmServingContractPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.vllmContractPreflightEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
  }

  return report;
}

export function assertOpenWeightVlmVllmServingContractPreflightReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "vllm_serving_contract_preflight_not_redacted",
        message: "vLLM serving contract preflight report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function shapeBlockers(plan) {
  if (!isPlainObject(plan)) {
    return ["blocked_for_invalid_plan_schema"];
  }
  return [];
}

function servingContractBlockers(plan) {
  const blockers = [];
  if (plan.servingStack !== "vllm_candidate") {
    blockers.push("blocked_for_non_vllm_candidate_stack");
  }
  if (plan.requestMode !== "backend_mediated_contract_only") {
    blockers.push("blocked_for_non_backend_mediated_request_mode");
  }
  return blockers;
}

function executionBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["modelCallRequested", "blocked_for_model_call_requested"],
    ["benchmarkExecutionRequested", "blocked_for_benchmark_execution_requested"],
    ["vllmServerStartRequested", "blocked_for_vllm_server_start_requested"],
    ["vllmEndpointCallRequested", "blocked_for_vllm_endpoint_call_requested"],
    ["modelDownloadRequested", "blocked_for_model_download_requested"],
    ["servingStackSwitchRequested", "blocked_for_serving_stack_switch_requested"],
    ["qwenInferenceRun", "blocked_for_qwen_inference_run"],
    ["fixtureInferenceRun", "blocked_for_fixture_inference_run"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function endpointBlockers(plan) {
  if (!ALLOWED_ENDPOINT_CLASSES.includes(plan.endpointClass)) {
    return ["blocked_for_unsafe_endpoint_class"];
  }
  return [];
}

function loggingAndPersistenceBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["rawPromptLogging", "blocked_for_raw_prompt_logging"],
    ["rawOutputLogging", "blocked_for_raw_output_logging"],
    ["rawRequestPayloadLogging", "blocked_for_raw_request_payload_logging"],
    ["rawImageLogging", "blocked_for_raw_image_logging"],
    ["base64Logging", "blocked_for_base64_logging"],
    ["pathLogging", "blocked_for_path_logging"],
    ["exifGpsSensorLogging", "blocked_for_exif_gps_sensor_logging"],
    ["providerDebugLogging", "blocked_for_provider_debug_logging"],
    ["serverLogLeakageAllowed", "blocked_for_server_log_leakage"],
    ["requestPayloadPersistenceAllowed", "blocked_for_request_payload_persistence"],
    ["rawOutputPersistenceAllowed", "blocked_for_raw_output_persistence"],
    ["rawOutputPrinted", "blocked_for_raw_output_printing"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function validatorSafetyBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["structuredJsonRequired", "blocked_for_missing_structured_json"],
    ["validatorRequired", "blocked_for_missing_validator"],
    ["fallbackRequired", "blocked_for_missing_fallback"],
    ["safetyRequired", "blocked_for_missing_safety"]
  ]) {
    if (plan[field] !== true) {
      blockers.push(code);
    }
  }
  if (plan.outputMode !== "structured_candidate_json") {
    blockers.push("blocked_for_free_form_raw_model_text_output");
  }
  return blockers;
}

function iosAndEndpointBoundaryBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["iOSDirectCallEnabled", "blocked_for_ios_direct_vllm_call"],
    ["iOSProviderKeyPresent", "blocked_for_ios_provider_key"],
    ["appEndpointEnabled", "blocked_for_app_endpoint"],
    ["productionEndpointEnabled", "blocked_for_production_endpoint"],
    ["cameraLiveCloudEntryEnabled", "blocked_for_camera_live_cloud_entry"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function languageSafetyBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["scoreRatingAllowed", "blocked_for_score_rating_allowed"],
    ["sensitiveInferenceAllowed", "blocked_for_sensitive_inference_allowed"],
    ["chainOfThoughtAllowed", "blocked_for_chain_of_thought_allowed"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function modelCapabilityBlockers(plan) {
  const blockers = [];
  if (VISION_CAPABLE_MODEL_CLASSES.includes(plan.modelClass) === false) {
    blockers.push("blocked_for_text_only_model_class");
  }
  if (plan.modelVisionCapable !== true) {
    blockers.push("blocked_for_model_not_vision_capable");
  }
  return blockers;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "_")
    .slice(0, 96) || "unknown";
}
