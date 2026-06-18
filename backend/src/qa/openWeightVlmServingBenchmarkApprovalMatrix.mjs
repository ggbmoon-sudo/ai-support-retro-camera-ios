export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_APPROVAL_MATRIX_SCHEMA_VERSION =
  "open_weight_vlm_serving_benchmark_approval_matrix.v1";

export const SERVING_BENCHMARK_APPROVAL_MATRIX_KINDS = Object.freeze([
  "no_model_contract",
  "one_fixture_smoke",
  "controlled_12_fixture",
  "serving_stack_comparison",
  "quantization_benchmark",
  "live_1fps_simulation"
]);

export const SERVING_BENCHMARK_APPROVAL_MATRIX_STACKS = Object.freeze([
  "transformers_fastapi_reference",
  "vllm_candidate",
  "sglang_challenger",
  "ollama_lmstudio_manual_only"
]);

export const SERVING_BENCHMARK_APPROVAL_MATRIX_APPROVAL_CLASSES = Object.freeze({
  no_model_contract: "no_model_preflight",
  one_fixture_smoke: "explicit_model_call_approval",
  controlled_12_fixture: "explicit_benchmark_approval",
  serving_stack_comparison: "explicit_benchmark_approval",
  quantization_benchmark: "explicit_benchmark_approval",
  live_1fps_simulation: "explicit_live_advisor_approval"
});

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

export function servingBenchmarkApprovalMatrixNoModelPlan() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_APPROVAL_MATRIX_SCHEMA_VERSION,
    benchmarkKind: "no_model_contract",
    approvalClass: "no_model_preflight",
    servingStack: "transformers_fastapi_reference",
    fixtureCount: 0,
    approvedFixtureTokens: [],
    callLimit: 0,
    retryLimit: 0,
    explicitModelCallApproval: false,
    explicitBenchmarkApproval: false,
    explicitLiveAdvisorApproval: false,
    explicitRetryApproval: false,
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
    sanitizedReportRequired: true,
    endpointClass: "none",
    productionReady: false,
    iOSIntegrationEnabled: false,
    appEndpointEnabled: false,
    productionEndpointEnabled: false,
    cameraLiveCloudEntryEnabled: false,
    autoTriggerRuntimeEnabled: false,
    wssRuntimeEnabled: false,
    uploadRuntimeEnabled: false,
    servingStackSwitchEnabled: false,
    servingStackProductionUse: false,
    quantizationProductionUse: false,
    visionEncoderQuantizationProductionClaim: false,
    liveAdvisorMode: "none",
    maxFpsBucket: "none",
    autoTriggerCaptureAtOrBelowOneSecond: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false
  };
}

export function evaluateOpenWeightVlmServingBenchmarkApprovalMatrix(
  plan = servingBenchmarkApprovalMatrixNoModelPlan()
) {
  const blockers = unique([
    ...shapeBlockers(plan),
    ...kindAndStackBlockers(plan),
    ...executionBlockers(plan),
    ...approvalBlockers(plan),
    ...fixtureAndCallBlockers(plan),
    ...artifactPolicyBlockers(plan),
    ...boundaryBlockers(plan),
    ...liveAdvisorBlockers(plan),
    ...quantizationBlockers(plan),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const approvalClass = approvalClassForKind(plan.benchmarkKind);
  const defaultPass = blockers.length === 0 && plan.benchmarkKind === "no_model_contract";
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_APPROVAL_MATRIX_SCHEMA_VERSION,
    benchmarkKind: sanitizeToken(plan.benchmarkKind || "unknown"),
    approvalClass: sanitizeToken(approvalClass),
    servingStack: sanitizeToken(plan.servingStack || "unknown"),
    fixtureCount: safeCount(plan.fixtureCount),
    approvedFixtureTokenCount: Array.isArray(plan.approvedFixtureTokens) ? plan.approvedFixtureTokens.length : 0,
    callLimit: safeCount(plan.callLimit),
    retryLimit: safeCount(plan.retryLimit),
    explicitModelCallApproval: plan.explicitModelCallApproval === true,
    explicitBenchmarkApproval: plan.explicitBenchmarkApproval === true,
    explicitLiveAdvisorApproval: plan.explicitLiveAdvisorApproval === true,
    explicitRetryApproval: plan.explicitRetryApproval === true,
    reportSanitization: plan.reportSanitization === true,
    sanitizedReportRequired: plan.sanitizedReportRequired === true,
    outputPersistencePolicy: sanitizeToken(plan.outputPersistencePolicy || "unknown"),
    endpointClass: sanitizeToken(plan.endpointClass || "unknown"),
    liveAdvisorMode: sanitizeToken(plan.liveAdvisorMode || "unknown"),
    maxFpsBucket: sanitizeToken(plan.maxFpsBucket || "unknown"),
    approvalMatrixEligible: defaultPass,
    blockedPendingExplicitApproval: blockers.some((blocker) => blocker.includes("approval")),
    nextPhaseRecommendation: nextPhaseRecommendationForReport(defaultPass),
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    productionReady: false,
    eligibleForModelCall: false,
    eligibleForBenchmarkExecution: false,
    statusCategories: unique([
      defaultPass
        ? "pass_for_serving_benchmark_approval_matrix"
        : "blocked_for_serving_benchmark_approval_matrix",
      ...blockers,
      plan.benchmarkKind === "no_model_contract"
        ? "no_model_contract_preflight_only"
        : "future_execution_requires_separate_explicit_approval",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmServingBenchmarkApprovalMatrixReportRedacted(report);
  if (!redaction.ok) {
    report.approvalMatrixEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_serving_benchmark_approval_matrix",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmServingBenchmarkApprovalMatrixSamples() {
  const base = servingBenchmarkApprovalMatrixNoModelPlan();
  const scenarios = [
    ["no_model_contract", base],
    ["one_fixture_without_approval", {
      ...base,
      benchmarkKind: "one_fixture_smoke",
      approvalClass: "explicit_model_call_approval",
      fixtureCount: 1,
      approvedFixtureTokens: ["smoke_001"],
      callLimit: 1
    }],
    ["one_fixture_multi_fixture_with_approval", {
      ...base,
      benchmarkKind: "one_fixture_smoke",
      approvalClass: "explicit_model_call_approval",
      fixtureCount: 2,
      approvedFixtureTokens: ["smoke_001", "smoke_002"],
      callLimit: 1,
      explicitModelCallApproval: true
    }],
    ["one_fixture_retry_without_approval", {
      ...base,
      benchmarkKind: "one_fixture_smoke",
      approvalClass: "explicit_model_call_approval",
      fixtureCount: 1,
      approvedFixtureTokens: ["smoke_001"],
      callLimit: 1,
      retryLimit: 1,
      explicitModelCallApproval: true
    }],
    ["controlled_12_without_approval", {
      ...base,
      benchmarkKind: "controlled_12_fixture",
      approvalClass: "explicit_benchmark_approval",
      fixtureCount: 12,
      approvedFixtureTokens: fixtureTokens(12),
      callLimit: 12
    }],
    ["vllm_comparison_without_approval", {
      ...base,
      benchmarkKind: "serving_stack_comparison",
      approvalClass: "explicit_benchmark_approval",
      servingStack: "vllm_candidate",
      fixtureCount: 12,
      approvedFixtureTokens: fixtureTokens(12),
      callLimit: 12
    }],
    ["sglang_comparison_without_approval", {
      ...base,
      benchmarkKind: "serving_stack_comparison",
      approvalClass: "explicit_benchmark_approval",
      servingStack: "sglang_challenger",
      fixtureCount: 12,
      approvedFixtureTokens: fixtureTokens(12),
      callLimit: 12
    }],
    ["quantization_without_approval", {
      ...base,
      benchmarkKind: "quantization_benchmark",
      approvalClass: "explicit_benchmark_approval",
      fixtureCount: 12,
      approvedFixtureTokens: fixtureTokens(12),
      callLimit: 12
    }],
    ["live_1fps_without_approval", {
      ...base,
      benchmarkKind: "live_1fps_simulation",
      approvalClass: "explicit_live_advisor_approval",
      fixtureCount: 1,
      approvedFixtureTokens: ["smoke_001"],
      callLimit: 1,
      liveAdvisorMode: "simulation",
      maxFpsBucket: "max_1fps"
    }],
    ["live_over_1fps", {
      ...base,
      benchmarkKind: "live_1fps_simulation",
      approvalClass: "explicit_live_advisor_approval",
      fixtureCount: 1,
      approvedFixtureTokens: ["smoke_001"],
      callLimit: 1,
      explicitLiveAdvisorApproval: true,
      liveAdvisorMode: "simulation",
      maxFpsBucket: "over_1fps"
    }],
    ["raw_output_policy", {
      ...base,
      rawOutputPolicy: {
        rawOutputPrintAllowed: true,
        rawOutputPersistenceAllowed: true
      }
    }],
    ["production_ready_true", {
      ...base,
      productionReady: true
    }],
    ["ios_integration", {
      ...base,
      iOSIntegrationEnabled: true
    }],
    ["endpoint_enabled", {
      ...base,
      appEndpointEnabled: true,
      productionEndpointEnabled: true
    }],
    ["public_endpoint", {
      ...base,
      endpointClass: "public_cloud"
    }],
    ["ollama_production", {
      ...base,
      servingStack: "ollama_lmstudio_manual_only",
      servingStackProductionUse: true
    }]
  ];

  const results = scenarios.map(([name, plan]) => ({
    scenario: name,
    report: evaluateOpenWeightVlmServingBenchmarkApprovalMatrix(plan)
  }));
  const pass = results.find((item) => item.scenario === "no_model_contract")?.report;
  const blocked = results.filter((item) => item.scenario !== "no_model_contract");
  const blockers = [];
  if (!pass?.approvalMatrixEligible) {
    blockers.push("blocked_for_no_model_contract_sample_failure");
  }
  if (blocked.some((item) => item.report.approvalMatrixEligible)) {
    blockers.push("blocked_for_blocked_sample_expectation_failure");
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_APPROVAL_MATRIX_SCHEMA_VERSION,
    runMode: "serving_benchmark_approval_matrix_samples",
    approvalMatrixEligible: blockers.length === 0,
    reviewedScenarioCount: results.length,
    defaultNoModelContractPassed: pass?.approvalMatrixEligible === true,
    expectedBlockedScenarioCount: blocked.filter((item) => !item.report.approvalMatrixEligible).length,
    expectedBlockedReasons: unique(blocked.flatMap((item) => item.report.blockers)),
    nextPhaseRecommendation: "phase_21_q_vllm_no_model_serving_contract_preflight",
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_serving_benchmark_approval_matrix"
        : "blocked_for_serving_benchmark_approval_matrix",
      ...blockers,
      "phase_21_p_approval_matrix_only",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmServingBenchmarkApprovalMatrixReportRedacted(report);
  if (!redaction.ok) {
    report.approvalMatrixEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
  }

  return report;
}

export function assertOpenWeightVlmServingBenchmarkApprovalMatrixReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "serving_benchmark_approval_matrix_not_redacted",
        message: "Serving benchmark approval matrix report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

export function nextPhaseRecommendationForReport(defaultPass) {
  return defaultPass
    ? "phase_21_q_vllm_no_model_serving_contract_preflight"
    : "resolve_serving_benchmark_approval_matrix_blockers";
}

function approvalClassForKind(kind) {
  return SERVING_BENCHMARK_APPROVAL_MATRIX_APPROVAL_CLASSES[kind] || "unknown";
}

function shapeBlockers(plan) {
  if (!isPlainObject(plan)) {
    return ["blocked_for_invalid_plan_schema"];
  }
  return [];
}

function kindAndStackBlockers(plan) {
  const blockers = [];
  if (!SERVING_BENCHMARK_APPROVAL_MATRIX_KINDS.includes(plan.benchmarkKind)) {
    blockers.push("blocked_for_unknown_benchmark_kind");
  }
  if (!SERVING_BENCHMARK_APPROVAL_MATRIX_STACKS.includes(plan.servingStack)) {
    blockers.push("blocked_for_unknown_serving_stack");
  }
  if (plan.servingStack === "ollama_lmstudio_manual_only" && plan.servingStackProductionUse === true) {
    blockers.push("blocked_for_ollama_lmstudio_production_stack");
  }
  return blockers;
}

function executionBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["networkCallsMade", "blocked_for_network_call_in_approval_matrix_phase"],
    ["modelCallsMade", "blocked_for_model_call_in_approval_matrix_phase"],
    ["qwenInferenceRun", "blocked_for_qwen_inference_in_approval_matrix_phase"],
    ["fixtureInferenceRun", "blocked_for_fixture_inference_in_approval_matrix_phase"],
    ["servingBenchmarkRun", "blocked_for_serving_benchmark_execution"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function approvalBlockers(plan) {
  if (plan.benchmarkKind === "no_model_contract") {
    return [];
  }
  if (plan.benchmarkKind === "one_fixture_smoke" && plan.explicitModelCallApproval !== true) {
    return ["blocked_for_missing_explicit_model_call_approval"];
  }
  if (
    ["controlled_12_fixture", "serving_stack_comparison", "quantization_benchmark"].includes(plan.benchmarkKind) &&
    plan.explicitBenchmarkApproval !== true
  ) {
    return ["blocked_for_missing_explicit_benchmark_approval"];
  }
  if (plan.benchmarkKind === "live_1fps_simulation" && plan.explicitLiveAdvisorApproval !== true) {
    return ["blocked_for_missing_explicit_live_advisor_approval"];
  }
  return [];
}

function fixtureAndCallBlockers(plan) {
  const blockers = [];
  const fixtureCount = safeCount(plan.fixtureCount);
  const callLimit = safeCount(plan.callLimit);
  const retryLimit = safeCount(plan.retryLimit);
  const tokens = Array.isArray(plan.approvedFixtureTokens) ? plan.approvedFixtureTokens : [];

  if (plan.benchmarkKind === "no_model_contract" && (fixtureCount > 0 || callLimit > 0)) {
    blockers.push("blocked_for_no_model_contract_fixture_or_call_scope");
  }
  if (plan.benchmarkKind === "one_fixture_smoke" && fixtureCount !== 1) {
    blockers.push("blocked_for_one_fixture_scope_violation");
  }
  if (plan.benchmarkKind === "one_fixture_smoke" && callLimit !== 1) {
    blockers.push("blocked_for_one_fixture_call_limit_violation");
  }
  if (plan.benchmarkKind === "controlled_12_fixture" && fixtureCount !== 12) {
    blockers.push("blocked_for_controlled_12_fixture_scope_violation");
  }
  if (fixtureCount > 1 && !["controlled_12_fixture", "serving_stack_comparison", "quantization_benchmark"].includes(plan.benchmarkKind)) {
    blockers.push("blocked_for_fixture_count_beyond_approved_scope");
  }
  if (fixtureCount > 0 && tokens.length !== fixtureCount) {
    blockers.push("blocked_for_fixture_token_count_mismatch");
  }
  if (callLimit > fixtureCount && fixtureCount > 0) {
    blockers.push("blocked_for_call_limit_exceeds_fixture_count");
  }
  if (retryLimit > 0 && plan.explicitRetryApproval !== true) {
    blockers.push("blocked_for_retry_without_explicit_retry_approval");
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
  if (plan.reportSanitization !== true || plan.sanitizedReportRequired !== true) {
    blockers.push("blocked_for_missing_sanitized_report_policy");
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
  if (plan.quantizationProductionUse === true) {
    blockers.push("blocked_for_quantization_production_before_benchmark");
  }
  if (plan.visionEncoderQuantizationProductionClaim === true) {
    blockers.push("blocked_for_vision_encoder_quantization_production_claim_without_evidence");
  }
  return blockers;
}

function fixtureTokens(count) {
  return Array.from({ length: count }, (_, index) => `smoke_${String(index + 1).padStart(3, "0")}`);
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
