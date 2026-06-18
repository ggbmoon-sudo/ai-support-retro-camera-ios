export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_EXECUTION_SCOPE_GATE_SCHEMA_VERSION =
  "open_weight_vlm_serving_benchmark_execution_scope_gate.v1";

export const SERVING_BENCHMARK_EXECUTION_ALLOWED_KINDS = Object.freeze([
  "no_model_contract",
  "one_fixture_smoke",
  "controlled_12_fixture",
  "serving_stack_comparison",
  "quantization_benchmark",
  "live_1fps_simulation"
]);

export const SERVING_BENCHMARK_EXECUTION_ALLOWED_STACKS = Object.freeze([
  "transformers_fastapi_reference",
  "vllm_candidate",
  "sglang_challenger",
  "ollama_lmstudio_manual_only"
]);

export const SERVING_BENCHMARK_EXECUTION_ALLOWED_QUANTIZATION_CLASSES = Object.freeze([
  "none",
  "fp16_bf16_baseline",
  "int8_candidate",
  "awq_candidate",
  "gptq_candidate",
  "int4_stress_candidate"
]);

const RAW_POLICY_FIELDS = Object.freeze([
  "rawOutputPrintAllowed",
  "rawOutputPersistenceAllowed",
  "rawPromptLoggingAllowed",
  "rawImageLoggingAllowed",
  "rawBase64LoggingAllowed",
  "rawImagePathLoggingAllowed",
  "requestPayloadLoggingAllowed"
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
  "secret_value"
]);

export function servingBenchmarkExecutionNoModelContractPlan() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_EXECUTION_SCOPE_GATE_SCHEMA_VERSION,
    benchmarkKind: "no_model_contract",
    servingStack: "transformers_fastapi_reference",
    modelClass: "qwen2_5_vl_reference",
    fixtureCount: 0,
    fixtureMode: "none",
    approvedFixtureTokens: [],
    callLimit: 0,
    retryLimit: 0,
    healthzRequired: false,
    rawOutputPolicy: {
      rawOutputPrintAllowed: false,
      rawOutputPersistenceAllowed: false
    },
    rawInputPolicy: {
      rawPromptLoggingAllowed: false,
      rawImageLoggingAllowed: false,
      rawBase64LoggingAllowed: false,
      rawImagePathLoggingAllowed: false,
      requestPayloadLoggingAllowed: false
    },
    outputPersistencePolicy: "sanitized_aggregate_only",
    reportSanitization: true,
    productionReady: false,
    requiresExplicitApproval: false,
    explicitApprovalRecorded: false,
    iOSIntegrationEnabled: false,
    appEndpointEnabled: false,
    productionEndpointEnabled: false,
    cameraLiveCloudEntryEnabled: false,
    autoTriggerRuntimeEnabled: false,
    wssRuntimeEnabled: false,
    uploadRuntimeEnabled: false,
    servingStackSwitchEnabled: false,
    servingStackProductionUse: false,
    endpointClass: "none",
    quantizationClass: "none",
    quantizationProductionUse: false,
    concurrencyBucket: "none",
    liveAdvisorMode: "none",
    maxFpsBucket: "none",
    autoTriggerCaptureAtOrBelowOneSecond: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    benchmarkRuntimeEnabled: false
  };
}

export function evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate(
  plan = servingBenchmarkExecutionNoModelContractPlan()
) {
  const blockers = unique([
    ...shapeBlockers(plan),
    ...executionBlockers(plan),
    ...approvalBlockers(plan),
    ...fixtureBlockers(plan),
    ...artifactPolicyBlockers(plan),
    ...boundaryBlockers(plan),
    ...candidateBlockers(plan),
    ...liveAdvisorBlockers(plan),
    ...quantizationBlockers(plan),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const defaultPass = blockers.length === 0 && plan.benchmarkKind === "no_model_contract";
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_EXECUTION_SCOPE_GATE_SCHEMA_VERSION,
    benchmarkKind: sanitizeToken(plan.benchmarkKind || "unknown"),
    servingStack: sanitizeToken(plan.servingStack || "unknown"),
    modelClass: sanitizeToken(plan.modelClass || "unknown"),
    fixtureCount: safeCount(plan.fixtureCount),
    fixtureMode: sanitizeToken(plan.fixtureMode || "unknown"),
    approvedFixtureTokenCount: Array.isArray(plan.approvedFixtureTokens) ? plan.approvedFixtureTokens.length : 0,
    callLimit: safeCount(plan.callLimit),
    retryLimit: safeCount(plan.retryLimit),
    healthzRequired: plan.healthzRequired === true,
    requiresExplicitApproval: plan.requiresExplicitApproval === true,
    explicitApprovalRecorded: plan.explicitApprovalRecorded === true,
    reportSanitization: plan.reportSanitization === true,
    outputPersistencePolicy: sanitizeToken(plan.outputPersistencePolicy || "unknown"),
    endpointClass: sanitizeToken(plan.endpointClass || "unknown"),
    quantizationClass: sanitizeToken(plan.quantizationClass || "unknown"),
    concurrencyBucket: sanitizeToken(plan.concurrencyBucket || "unknown"),
    liveAdvisorMode: sanitizeToken(plan.liveAdvisorMode || "unknown"),
    maxFpsBucket: sanitizeToken(plan.maxFpsBucket || "unknown"),
    scopeGateEligible: defaultPass,
    blockedPendingExplicitApproval: blockers.includes("blocked_pending_explicit_approval"),
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    productionReady: false,
    eligibleForBenchmarkExecution: false,
    statusCategories: unique([
      defaultPass
        ? "pass_for_serving_benchmark_execution_scope_gate"
        : "blocked_for_serving_benchmark_execution_scope_gate",
      ...blockers,
      plan.benchmarkKind === "no_model_contract"
        ? "no_model_contract_preflight_only"
        : "real_execution_requires_separate_approval",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmServingBenchmarkExecutionScopeGateReportRedacted(report);
  if (!redaction.ok) {
    report.scopeGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_serving_benchmark_execution_scope_gate",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmServingBenchmarkExecutionScopeGateSamples() {
  const scenarios = [
    ["default_no_model_contract", servingBenchmarkExecutionNoModelContractPlan()],
    ["one_fixture_without_approval", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "one_fixture_smoke",
      fixtureCount: 1,
      fixtureMode: "approved_ignored_local_only",
      approvedFixtureTokens: ["smoke_001"],
      callLimit: 1,
      healthzRequired: true
    }],
    ["controlled_12_without_approval", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "controlled_12_fixture",
      fixtureCount: 12,
      fixtureMode: "approved_ignored_local_only",
      approvedFixtureTokens: Array.from({ length: 12 }, (_, index) => `smoke_${String(index + 1).padStart(3, "0")}`),
      callLimit: 12,
      healthzRequired: true
    }],
    ["vllm_without_approval", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "serving_stack_comparison",
      servingStack: "vllm_candidate",
      fixtureCount: 12,
      callLimit: 12,
      healthzRequired: true
    }],
    ["sglang_without_approval", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "serving_stack_comparison",
      servingStack: "sglang_challenger",
      fixtureCount: 12,
      callLimit: 12,
      healthzRequired: true
    }],
    ["quantization_without_approval", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "quantization_benchmark",
      quantizationClass: "awq_candidate",
      fixtureCount: 12,
      callLimit: 12,
      healthzRequired: true
    }],
    ["live_1fps_without_approval", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "live_1fps_simulation",
      liveAdvisorMode: "simulation",
      maxFpsBucket: "max_1fps",
      fixtureCount: 1,
      callLimit: 1,
      healthzRequired: true
    }],
    ["live_over_1fps", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      benchmarkKind: "live_1fps_simulation",
      liveAdvisorMode: "simulation",
      maxFpsBucket: "over_1fps",
      fixtureCount: 1,
      callLimit: 1,
      requiresExplicitApproval: true,
      explicitApprovalRecorded: true
    }],
    ["raw_output_logging", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      rawOutputPolicy: {
        rawOutputPrintAllowed: true,
        rawOutputPersistenceAllowed: true
      }
    }],
    ["production_ready_true", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      productionReady: true
    }],
    ["ios_integration", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      iOSIntegrationEnabled: true
    }],
    ["endpoint_enabled", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      appEndpointEnabled: true,
      productionEndpointEnabled: true
    }],
    ["public_endpoint", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      endpointClass: "public_cloud"
    }],
    ["ollama_production", {
      ...servingBenchmarkExecutionNoModelContractPlan(),
      servingStack: "ollama_lmstudio_manual_only",
      servingStackProductionUse: true
    }]
  ];

  const results = scenarios.map(([name, plan]) => ({
    scenario: name,
    report: evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate(plan)
  }));
  const pass = results.find((item) => item.scenario === "default_no_model_contract")?.report;
  const blocked = results.filter((item) => item.scenario !== "default_no_model_contract");
  const blockers = [];
  if (!pass?.scopeGateEligible) {
    blockers.push("blocked_for_default_contract_sample_failure");
  }
  if (blocked.some((item) => item.report.scopeGateEligible)) {
    blockers.push("blocked_for_blocked_sample_expectation_failure");
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_EXECUTION_SCOPE_GATE_SCHEMA_VERSION,
    runMode: "serving_benchmark_execution_scope_gate_samples",
    scopeGateEligible: blockers.length === 0,
    reviewedScenarioCount: results.length,
    defaultNoModelContractPassed: pass?.scopeGateEligible === true,
    expectedBlockedScenarioCount: blocked.filter((item) => !item.report.scopeGateEligible).length,
    expectedBlockedReasons: unique(blocked.flatMap((item) => item.report.blockers)),
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_serving_benchmark_execution_scope_gate"
        : "blocked_for_serving_benchmark_execution_scope_gate",
      ...blockers,
      "phase_21_o_preflight_scope_only",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmServingBenchmarkExecutionScopeGateReportRedacted(report);
  if (!redaction.ok) {
    report.scopeGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
  }

  return report;
}

export function assertOpenWeightVlmServingBenchmarkExecutionScopeGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "serving_benchmark_execution_scope_gate_not_redacted",
        message: "Serving benchmark execution scope gate report contains a forbidden artifact marker."
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

function executionBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["networkCallsMade", "blocked_for_network_call_in_scope_phase"],
    ["modelCallsMade", "blocked_for_model_call_in_scope_phase"],
    ["qwenInferenceRun", "blocked_for_qwen_inference_in_scope_phase"],
    ["fixtureInferenceRun", "blocked_for_fixture_inference_in_scope_phase"],
    ["servingBenchmarkRun", "blocked_for_serving_benchmark_execution"],
    ["benchmarkRuntimeEnabled", "blocked_for_benchmark_runtime_enabled"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  if (safeCount(plan.callLimit) > 0 && plan.benchmarkKind === "no_model_contract") {
    blockers.push("blocked_for_model_call_in_no_model_contract");
  }
  return blockers;
}

function approvalBlockers(plan) {
  if (plan.benchmarkKind === "no_model_contract") {
    return [];
  }
  const blockers = [];
  if (plan.requiresExplicitApproval !== true || plan.explicitApprovalRecorded !== true) {
    blockers.push("blocked_pending_explicit_approval");
  }
  return blockers;
}

function fixtureBlockers(plan) {
  const blockers = [];
  const fixtureCount = safeCount(plan.fixtureCount);
  const callLimit = safeCount(plan.callLimit);
  const tokens = Array.isArray(plan.approvedFixtureTokens) ? plan.approvedFixtureTokens : [];

  if (plan.benchmarkKind === "one_fixture_smoke" && fixtureCount !== 1) {
    blockers.push("blocked_for_one_fixture_scope_violation");
  }
  if (fixtureCount > 1 && plan.benchmarkKind !== "controlled_12_fixture") {
    blockers.push("blocked_for_multi_fixture_without_controlled_scope");
  }
  if (plan.benchmarkKind === "controlled_12_fixture" && fixtureCount !== 12) {
    blockers.push("blocked_for_controlled_12_fixture_scope_violation");
  }
  if (fixtureCount > 0 && plan.fixtureMode !== "approved_ignored_local_only") {
    blockers.push("blocked_for_unapproved_fixture_mode");
  }
  if (fixtureCount > 0 && tokens.length !== fixtureCount) {
    blockers.push("blocked_for_fixture_token_count_mismatch");
  }
  if (callLimit > fixtureCount && fixtureCount > 0) {
    blockers.push("blocked_for_call_limit_exceeds_fixture_count");
  }
  if (safeCount(plan.retryLimit) > 0 && !(plan.requiresExplicitApproval === true && plan.explicitApprovalRecorded === true)) {
    blockers.push("blocked_for_retry_without_explicit_approval");
  }
  return blockers;
}

function artifactPolicyBlockers(plan) {
  const blockers = [];
  const rawPolicy = {
    ...plan.rawOutputPolicy,
    ...plan.rawInputPolicy
  };
  for (const field of RAW_POLICY_FIELDS) {
    if (rawPolicy[field] === true) {
      blockers.push(`blocked_for_${field.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)}`);
    }
  }
  if (plan.outputPersistencePolicy !== "sanitized_aggregate_only") {
    blockers.push("blocked_for_output_persistence_policy");
  }
  if (plan.reportSanitization !== true) {
    blockers.push("blocked_for_missing_report_sanitization");
  }
  return blockers;
}

function boundaryBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["iOSIntegrationEnabled", "blocked_for_ios_integration"],
    ["appEndpointEnabled", "blocked_for_app_endpoint"],
    ["productionEndpointEnabled", "blocked_for_production_endpoint"],
    ["cameraLiveCloudEntryEnabled", "blocked_for_camera_live_cloud_entry"],
    ["autoTriggerRuntimeEnabled", "blocked_for_auto_trigger_runtime"],
    ["wssRuntimeEnabled", "blocked_for_wss_runtime"],
    ["uploadRuntimeEnabled", "blocked_for_upload_runtime"],
    ["servingStackSwitchEnabled", "blocked_for_serving_stack_switch"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  if (["public", "public_cloud", "ngrok", "tunnel", "cloud"].includes(plan.endpointClass)) {
    blockers.push("blocked_for_public_endpoint_class");
  }
  return blockers;
}

function candidateBlockers(plan) {
  const blockers = [];
  if (!SERVING_BENCHMARK_EXECUTION_ALLOWED_KINDS.includes(plan.benchmarkKind)) {
    blockers.push("blocked_for_unknown_benchmark_kind");
  }
  if (!SERVING_BENCHMARK_EXECUTION_ALLOWED_STACKS.includes(plan.servingStack)) {
    blockers.push("blocked_for_unknown_serving_stack");
  }
  if (plan.servingStack === "ollama_lmstudio_manual_only" && plan.servingStackProductionUse === true) {
    blockers.push("blocked_for_ollama_lmstudio_production_stack");
  }
  return blockers;
}

function liveAdvisorBlockers(plan) {
  const blockers = [];
  if (plan.benchmarkKind === "live_1fps_simulation" && plan.maxFpsBucket !== "max_1fps") {
    blockers.push("blocked_for_live_advisor_over_1fps");
  }
  if (plan.autoTriggerCaptureAtOrBelowOneSecond === true) {
    blockers.push("blocked_for_lte_1s_auto_trigger_capture_upload");
  }
  return blockers;
}

function quantizationBlockers(plan) {
  const blockers = [];
  if (!SERVING_BENCHMARK_EXECUTION_ALLOWED_QUANTIZATION_CLASSES.includes(plan.quantizationClass || "none")) {
    blockers.push("blocked_for_unknown_quantization_class");
  }
  if (plan.quantizationProductionUse === true) {
    blockers.push("blocked_for_quantization_production_before_benchmark");
  }
  if (plan.quantizationClass === "int4_stress_candidate" && plan.benchmarkKind !== "quantization_benchmark") {
    blockers.push("blocked_for_int4_without_quantization_benchmark_scope");
  }
  return blockers;
}

function safeCount(value) {
  return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
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
