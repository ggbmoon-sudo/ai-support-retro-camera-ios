export const OPEN_WEIGHT_VLM_SERVING_STACK_COMPARISON_MATRIX_SCHEMA_VERSION =
  "open_weight_vlm_serving_stack_comparison_matrix.v1";

export const allowedServingStacks = Object.freeze([
  "transformers_fastapi_reference",
  "vllm_candidate",
  "sglang_challenger",
  "ollama_lmstudio_manual_only"
]);

export const servingStackRoles = Object.freeze({
  transformers_fastapi_reference: Object.freeze({
    role: "correctness_reference_baseline",
    photoAdvisorFit: "strong_reference_fit",
    liveAdvisorFit: "latency_blocked_until_benchmarked",
    qwenSuitability: "known_local_private_reference_path",
    structuredJsonStrategy: "backend_validator_required",
    productionSuitability: "not_production_ready_reference_only"
  }),
  vllm_candidate: Object.freeze({
    role: "primary_future_benchmark_candidate",
    photoAdvisorFit: "candidate_after_contract_and_benchmark",
    liveAdvisorFit: "candidate_for_latency_and_concurrency_benchmark",
    qwenSuitability: "future_vlm_serving_candidate",
    structuredJsonStrategy: "structured_candidate_json_required",
    productionSuitability: "blocked_until_explicit_benchmark_and_rollout"
  }),
  sglang_challenger: Object.freeze({
    role: "structured_output_performance_challenger",
    photoAdvisorFit: "candidate_after_contract_and_benchmark",
    liveAdvisorFit: "challenger_for_json_control_and_latency",
    qwenSuitability: "future_vlm_serving_challenger",
    structuredJsonStrategy: "structured_candidate_json_required",
    productionSuitability: "blocked_until_explicit_benchmark_and_rollout"
  }),
  ollama_lmstudio_manual_only: Object.freeze({
    role: "manual_local_operator_only",
    photoAdvisorFit: "manual_debug_only",
    liveAdvisorFit: "not_a_production_live_path",
    qwenSuitability: "manual_smoke_only",
    structuredJsonStrategy: "not_production_contract",
    productionSuitability: "blocked_for_production_route"
  })
});

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

export function buildDefaultNoModelComparisonMatrix() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_STACK_COMPARISON_MATRIX_SCHEMA_VERSION,
    comparisonMode: "no_model_serving_stack_matrix",
    servingStacks: [...allowedServingStacks],
    includesTransformersFastapi: true,
    includesVllm: true,
    includesSglang: true,
    includesOllamaLmStudio: true,
    ollamaLmStudioProductionUse: false,
    modelCallRequested: false,
    endpointCallRequested: false,
    benchmarkExecutionRequested: false,
    servingStackSwitchRequested: false,
    modelDownloadRequested: false,
    productionRouteRequested: false,
    iOSIntegrationEnabled: false,
    appEndpointEnabled: false,
    productionEndpointEnabled: false,
    cameraLiveCloudEntryEnabled: false,
    rawPromptLogging: false,
    rawOutputLogging: false,
    rawImageLogging: false,
    base64Logging: false,
    pathLogging: false,
    rawRequestPayloadLogging: false,
    exifGpsSensorLogging: false,
    requestPayloadPersistenceAllowed: false,
    rawOutputPersistenceAllowed: false,
    structuredJsonRequired: true,
    validatorRequired: true,
    fallbackRequired: true,
    safetyRequired: true,
    productionReady: false
  };
}

export function evaluateServingStackComparisonPlan(
  plan = buildDefaultNoModelComparisonMatrix()
) {
  const blockers = unique([
    ...shapeBlockers(plan),
    ...stackBlockers(plan),
    ...executionBlockers(plan),
    ...boundaryBlockers(plan),
    ...artifactBlockers(plan),
    ...contractBlockers(plan),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);
  const warnings = unique(stackWarnings(plan));
  const eligible = blockers.length === 0;
  const stackList = Array.isArray(plan.servingStacks) ? plan.servingStacks : [];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_STACK_COMPARISON_MATRIX_SCHEMA_VERSION,
    comparisonMode: sanitizeToken(plan.comparisonMode || "unknown"),
    comparisonMatrixEligible: eligible,
    stackCount: stackList.length,
    includesTransformersFastapi: plan.includesTransformersFastapi === true,
    includesVllm: plan.includesVllm === true,
    includesSglang: plan.includesSglang === true,
    includesOllamaLmStudio: plan.includesOllamaLmStudio === true,
    reviewedServingStacks: stackList.map(sanitizeToken),
    warnings,
    blockers,
    roleBuckets: buildRoleBuckets(stackList),
    requiredConclusions: {
      transformersFastapiRole: "correctness_reference_baseline",
      vllmRole: "primary_future_benchmark_candidate",
      sglangRole: "structured_output_performance_challenger",
      ollamaLmStudioRole: "manual_only_not_production_route",
      r1eProductionReadiness: "not_production_ready",
      r1eLatencyBucket: "gt_15s_blocker_for_ios_live_readiness",
      futureExecutionApproval: "separate_explicit_approval_required",
      productionReady: false
    },
    servingRuntimeStarted: false,
    endpointCalled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    servingStackSwitched: false,
    productionReady: false,
    eligibleForBenchmarkExecution: false,
    nextPhaseRecommendation: eligible
      ? "phase_21_t_one_fixture_serving_benchmark_approval_request_draft"
      : "resolve_serving_stack_comparison_matrix_blockers",
    statusCategories: unique([
      eligible
        ? "pass_for_serving_stack_no_model_comparison_matrix"
        : "blocked_for_serving_stack_no_model_comparison_matrix",
      ...blockers,
      ...warnings,
      "phase_21_s_no_model_matrix_only",
      "not_production_ready"
    ])
  };

  const redaction = assertServingStackComparisonMatrixReportRedacted(report);
  if (!redaction.ok) {
    report.comparisonMatrixEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_serving_stack_no_model_comparison_matrix",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateServingStackComparisonMatrixSamples() {
  const base = buildDefaultNoModelComparisonMatrix();
  const scenarios = [
    ["safe_no_model_comparison_matrix", base],
    ["missing_transformers_reference", { ...base, includesTransformersFastapi: false }],
    ["missing_vllm_candidate", { ...base, includesVllm: false }],
    ["missing_sglang_challenger", { ...base, includesSglang: false }],
    ["ollama_lmstudio_production", { ...base, ollamaLmStudioProductionUse: true }],
    ["model_call_requested", { ...base, modelCallRequested: true }],
    ["endpoint_call_requested", { ...base, endpointCallRequested: true }],
    ["benchmark_requested", { ...base, benchmarkExecutionRequested: true }],
    ["serving_switch_requested", { ...base, servingStackSwitchRequested: true }],
    ["model_download_requested", { ...base, modelDownloadRequested: true }],
    ["production_ready_true", { ...base, productionReady: true }],
    ["raw_logging", {
      ...base,
      rawPromptLogging: true,
      rawOutputLogging: true,
      rawImageLogging: true,
      base64Logging: true,
      pathLogging: true,
      rawRequestPayloadLogging: true,
      exifGpsSensorLogging: true
    }],
    ["ios_integration", { ...base, iOSIntegrationEnabled: true }],
    ["app_prod_endpoint", { ...base, appEndpointEnabled: true, productionEndpointEnabled: true }],
    ["camera_live_cloud_runtime", { ...base, cameraLiveCloudEntryEnabled: true }],
    ["missing_validator_fallback_safety", {
      ...base,
      structuredJsonRequired: false,
      validatorRequired: false,
      fallbackRequired: false,
      safetyRequired: false
    }],
    ["unknown_stack", { ...base, servingStacks: [...allowedServingStacks, "unknown_stack"] }]
  ];

  const results = scenarios.map(([name, samplePlan]) => ({
    scenario: name,
    report: evaluateServingStackComparisonPlan(samplePlan)
  }));
  const pass = results.find((item) => item.scenario === "safe_no_model_comparison_matrix")?.report;
  const blocked = results.filter((item) => ![
    "safe_no_model_comparison_matrix",
    "missing_transformers_reference",
    "missing_vllm_candidate",
    "missing_sglang_challenger"
  ].includes(item.scenario));
  const warningOnlyScenarioNames = [
    "missing_transformers_reference",
    "missing_vllm_candidate",
    "missing_sglang_challenger"
  ];
  const warningOnly = results.filter((item) => warningOnlyScenarioNames.includes(item.scenario));
  const blockers = [];

  if (!pass?.comparisonMatrixEligible) {
    blockers.push("blocked_for_safe_matrix_sample_failure");
  }
  if (blocked.some((item) => item.report.comparisonMatrixEligible)) {
    blockers.push("blocked_for_blocked_sample_expectation_failure");
  }
  if (warningOnly.some((item) => !item.report.comparisonMatrixEligible || item.report.warnings.length === 0)) {
    blockers.push("blocked_for_warning_sample_expectation_failure");
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_STACK_COMPARISON_MATRIX_SCHEMA_VERSION,
    runMode: "serving_stack_no_model_comparison_matrix_samples",
    comparisonMatrixEligible: blockers.length === 0,
    reviewedScenarioCount: results.length,
    safeNoModelComparisonPassed: pass?.comparisonMatrixEligible === true,
    warningOnlyScenarioCount: warningOnly.filter((item) => item.report.comparisonMatrixEligible).length,
    expectedBlockedScenarioCount: blocked.filter((item) => !item.report.comparisonMatrixEligible).length,
    expectedBlockedReasons: unique(blocked.flatMap((item) => item.report.blockers)),
    expectedWarningReasons: unique(warningOnly.flatMap((item) => item.report.warnings)),
    nextPhaseRecommendation: "phase_21_t_one_fixture_serving_benchmark_approval_request_draft",
    blockers,
    servingRuntimeStarted: false,
    endpointCalled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    servingStackSwitched: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_serving_stack_no_model_comparison_matrix"
        : "blocked_for_serving_stack_no_model_comparison_matrix",
      ...blockers,
      "phase_21_s_no_model_matrix_only",
      "not_production_ready"
    ])
  };

  const redaction = assertServingStackComparisonMatrixReportRedacted(report);
  if (!redaction.ok) {
    report.comparisonMatrixEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
  }

  return report;
}

export function assertServingStackComparisonMatrixReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "serving_stack_comparison_matrix_not_redacted",
        message: "Serving stack comparison matrix report contains a forbidden artifact marker."
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

function stackBlockers(plan) {
  const blockers = [];
  const stackList = Array.isArray(plan.servingStacks) ? plan.servingStacks : [];
  if (plan.comparisonMode !== "no_model_serving_stack_matrix") {
    blockers.push("blocked_for_unknown_comparison_mode");
  }
  if (!Array.isArray(plan.servingStacks)) {
    blockers.push("blocked_for_missing_serving_stack_list");
  }
  for (const stack of stackList) {
    if (!allowedServingStacks.includes(stack)) {
      blockers.push("blocked_for_unknown_serving_stack");
    }
  }
  if (plan.ollamaLmStudioProductionUse === true || plan.servingStackProductionUse === true) {
    blockers.push("blocked_for_ollama_lmstudio_production_role");
  }
  return blockers;
}

function stackWarnings(plan) {
  const warnings = [];
  if (plan.includesTransformersFastapi !== true) {
    warnings.push("warning_missing_transformers_fastapi_reference");
  }
  if (plan.includesVllm !== true) {
    warnings.push("warning_missing_vllm_candidate");
  }
  if (plan.includesSglang !== true) {
    warnings.push("warning_missing_sglang_challenger");
  }
  if (plan.includesOllamaLmStudio !== true) {
    warnings.push("warning_missing_ollama_lmstudio_manual_only");
  }
  return warnings;
}

function executionBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["modelCallRequested", "blocked_for_model_call_requested"],
    ["endpointCallRequested", "blocked_for_endpoint_call_requested"],
    ["benchmarkExecutionRequested", "blocked_for_benchmark_execution_requested"],
    ["servingStackSwitchRequested", "blocked_for_serving_stack_switch_requested"],
    ["modelDownloadRequested", "blocked_for_model_download_requested"],
    ["productionRouteRequested", "blocked_for_production_route_requested"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function boundaryBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["iOSIntegrationEnabled", "blocked_for_ios_integration"],
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

function artifactBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["rawPromptLogging", "blocked_for_raw_prompt_logging"],
    ["rawOutputLogging", "blocked_for_raw_output_logging"],
    ["rawImageLogging", "blocked_for_raw_image_logging"],
    ["base64Logging", "blocked_for_base64_logging"],
    ["pathLogging", "blocked_for_path_logging"],
    ["rawRequestPayloadLogging", "blocked_for_raw_request_payload_logging"],
    ["exifGpsSensorLogging", "blocked_for_exif_gps_sensor_logging"],
    ["requestPayloadPersistenceAllowed", "blocked_for_request_payload_persistence"],
    ["rawOutputPersistenceAllowed", "blocked_for_raw_output_persistence"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function contractBlockers(plan) {
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
  return blockers;
}

function buildRoleBuckets(stackList) {
  return stackList
    .filter((stack) => allowedServingStacks.includes(stack))
    .map((stack) => ({
      servingStack: stack,
      role: servingStackRoles[stack].role,
      photoAdvisorFit: servingStackRoles[stack].photoAdvisorFit,
      liveAdvisorFit: servingStackRoles[stack].liveAdvisorFit,
      qwenSuitability: servingStackRoles[stack].qwenSuitability,
      structuredJsonStrategy: servingStackRoles[stack].structuredJsonStrategy,
      productionSuitability: servingStackRoles[stack].productionSuitability
    }));
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
