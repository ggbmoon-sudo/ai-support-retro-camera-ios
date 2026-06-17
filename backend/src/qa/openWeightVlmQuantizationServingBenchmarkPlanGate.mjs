export const OPEN_WEIGHT_VLM_QUANTIZATION_SERVING_BENCHMARK_PLAN_GATE_SCHEMA_VERSION =
  "open_weight_vlm_quantization_serving_benchmark_plan_gate.v1";

export const QUANTIZATION_SERVING_BENCHMARK_MODEL_CLASSES = Object.freeze([
  "qwen3_5_35b_a3b_moe_preferred",
  "qwen2_5_vl_reference",
  "qwen3_vl_moe_fallback_candidate",
  "qwen_9b_vision_fast_fallback",
  "text_only_qwen_blocked"
]);

export const QUANTIZATION_SERVING_BENCHMARK_SERVING_STACKS = Object.freeze([
  "transformers_fastapi_reference",
  "vllm_primary_benchmark_candidate",
  "sglang_structured_output_challenger",
  "ollama_lmstudio_manual_only"
]);

export const QUANTIZATION_SERVING_BENCHMARK_QUANTIZATION_CLASSES = Object.freeze([
  "fp16_bf16_baseline",
  "int8_candidate",
  "int4_candidate",
  "awq_candidate",
  "gptq_candidate",
  "equivalent_supported_quantization_candidate"
]);

const FORBIDDEN_REPORT_VALUE_SNIPPETS = Object.freeze([
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
  "\"rawPrompt\":",
  "\"fullPrompt\":",
  "\"requestPayload\":",
  "\"rawModelOutput\":",
  "\"modelOutput\":",
  "\"rawProviderResponse\":",
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
  "secret_value",
  "provider_key_value",
  "chain-of-thought"
]);

const FORBIDDEN_PROBE_VALUE_SNIPPETS = Object.freeze([
  ...FORBIDDEN_REPORT_VALUE_SNIPPETS,
  "prompt",
  "requestPayload",
  "modelOutput",
  "raw model",
  "base64",
  "EXIF",
  "GPS"
]);

export function quantizationServingBenchmarkPlanReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_QUANTIZATION_SERVING_BENCHMARK_PLAN_GATE_SCHEMA_VERSION,
    benchmarkRuntimeEnabled: false,
    servingStackSwitchEnabled: false,
    modelDownloadEnabled: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    preferredModelClass: "qwen3_5_35b_a3b_moe_preferred",
    servingStackCandidate: "vllm_primary_benchmark_candidate",
    quantizationCandidate: "awq_candidate",
    visionCapableRequired: true,
    nonThinkingModeRequired: true,
    structuredOutputRequired: true,
    approvedFixturePolicyRequired: true,
    sanitizedMetricsRequired: true,
    rawOutputPersistenceAllowed: false,
    rawPromptPersistenceAllowed: false,
    rawPayloadLoggingAllowed: false,
    realUserPhotosAllowed: false,
    productionEndpointEnabled: false,
    iosRuntimeDependencyEnabled: false,
    networkCallsMade: false,
    productionReady: false,
    probeValues: []
  };
}

export function evaluateOpenWeightVlmQuantizationServingBenchmarkPlanGate(
  policy = quantizationServingBenchmarkPlanReadyPolicy()
) {
  const blockers = unique([
    ...runtimeBlockers(policy),
    ...candidateBlockers(policy),
    ...requirementBlockers(policy),
    ...artifactPolicyBlockers(policy),
    ...endpointBoundaryBlockers(policy),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_QUANTIZATION_SERVING_BENCHMARK_PLAN_GATE_SCHEMA_VERSION,
    benchmarkRuntimeEnabled: policy.benchmarkRuntimeEnabled === true,
    servingStackSwitchEnabled: policy.servingStackSwitchEnabled === true,
    modelDownloadEnabled: policy.modelDownloadEnabled === true,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    preferredModelClass: sanitizeToken(policy.preferredModelClass || "unknown"),
    servingStackCandidate: sanitizeToken(policy.servingStackCandidate || "unknown"),
    quantizationCandidate: sanitizeToken(policy.quantizationCandidate || "unknown"),
    visionCapableRequired: policy.visionCapableRequired === true,
    nonThinkingModeRequired: policy.nonThinkingModeRequired === true,
    structuredOutputRequired: policy.structuredOutputRequired === true,
    approvedFixturePolicyRequired: policy.approvedFixturePolicyRequired === true,
    sanitizedMetricsRequired: policy.sanitizedMetricsRequired === true,
    rawOutputPersistenceAllowed: policy.rawOutputPersistenceAllowed === true,
    rawPromptPersistenceAllowed: policy.rawPromptPersistenceAllowed === true,
    rawPayloadLoggingAllowed: policy.rawPayloadLoggingAllowed === true,
    realUserPhotosAllowed: policy.realUserPhotosAllowed === true,
    productionEndpointEnabled: policy.productionEndpointEnabled === true,
    iosRuntimeDependencyEnabled: policy.iosRuntimeDependencyEnabled === true,
    quantizationServingBenchmarkPlanEligible: blockers.length === 0,
    productionReady: false,
    blockers,
    networkCallsMade: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_quantization_serving_benchmark_plan_gate"
        : "blocked_for_quantization_serving_benchmark_plan_gate",
      ...blockers,
      "planning_phase_no_serving_benchmark_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmQuantizationServingBenchmarkPlanGateReportRedacted(report);
  if (!redaction.ok) {
    report.quantizationServingBenchmarkPlanEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_quantization_serving_benchmark_plan_gate",
      ...report.blockers,
      "planning_phase_no_serving_benchmark_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmQuantizationServingBenchmarkPlanGateSamples() {
  const valid = evaluateOpenWeightVlmQuantizationServingBenchmarkPlanGate(
    quantizationServingBenchmarkPlanReadyPolicy()
  );
  const blocked = evaluateOpenWeightVlmQuantizationServingBenchmarkPlanGate({
    ...quantizationServingBenchmarkPlanReadyPolicy(),
    benchmarkRuntimeEnabled: true,
    servingStackSwitchEnabled: true,
    modelDownloadEnabled: true,
    preferredModelClass: "text_only_qwen_blocked",
    servingStackCandidate: "unknown_stack",
    quantizationCandidate: "unknown_quantization",
    productionReady: true
  });
  const blockers = valid.quantizationServingBenchmarkPlanEligible &&
    !blocked.quantizationServingBenchmarkPlanEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_QUANTIZATION_SERVING_BENCHMARK_PLAN_GATE_SCHEMA_VERSION,
    benchmarkRuntimeEnabled: false,
    servingStackSwitchEnabled: false,
    modelDownloadEnabled: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    preferredModelClass: valid.preferredModelClass,
    servingStackCandidate: valid.servingStackCandidate,
    quantizationCandidate: valid.quantizationCandidate,
    visionCapableRequired: true,
    nonThinkingModeRequired: true,
    structuredOutputRequired: true,
    approvedFixturePolicyRequired: true,
    sanitizedMetricsRequired: true,
    rawOutputPersistenceAllowed: false,
    rawPromptPersistenceAllowed: false,
    rawPayloadLoggingAllowed: false,
    realUserPhotosAllowed: false,
    productionEndpointEnabled: false,
    iosRuntimeDependencyEnabled: false,
    quantizationServingBenchmarkPlanEligible: blockers.length === 0,
    productionReady: false,
    blockers,
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.quantizationServingBenchmarkPlanEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.quantizationServingBenchmarkPlanEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    networkCallsMade: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_quantization_serving_benchmark_plan_gate"
        : "blocked_for_quantization_serving_benchmark_plan_gate",
      ...blockers,
      "planning_phase_no_serving_benchmark_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmQuantizationServingBenchmarkPlanGateReportRedacted(report);
  if (!redaction.ok) {
    report.quantizationServingBenchmarkPlanEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_quantization_serving_benchmark_plan_gate",
      ...report.blockers,
      "planning_phase_no_serving_benchmark_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmQuantizationServingBenchmarkPlanGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_VALUE_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "quantization_serving_benchmark_plan_gate_not_redacted",
        message: "Quantization serving benchmark plan gate report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function runtimeBlockers(policy) {
  const blockers = [];
  for (const [field, code] of [
    ["benchmarkRuntimeEnabled", "blocked_for_benchmark_runtime_enabled"],
    ["servingStackSwitchEnabled", "blocked_for_serving_stack_switch_enabled"],
    ["modelDownloadEnabled", "blocked_for_model_download_enabled"],
    ["modelCallsMade", "blocked_for_model_call_in_planning_phase"],
    ["qwenInferenceRun", "blocked_for_qwen_inference_in_planning_phase"],
    ["fixtureInferenceRun", "blocked_for_fixture_inference_in_planning_phase"],
    ["servingBenchmarkRun", "blocked_for_serving_benchmark_execution"],
    ["networkCallsMade", "blocked_for_network_call_in_planning_phase"]
  ]) {
    if (policy[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function candidateBlockers(policy) {
  const blockers = [];
  if (!QUANTIZATION_SERVING_BENCHMARK_MODEL_CLASSES.includes(policy.preferredModelClass)) {
    blockers.push("blocked_for_unknown_model_class");
  }
  if (policy.preferredModelClass === "text_only_qwen_blocked") {
    blockers.push("blocked_for_text_only_model_candidate");
  }
  if (!QUANTIZATION_SERVING_BENCHMARK_SERVING_STACKS.includes(policy.servingStackCandidate)) {
    blockers.push("blocked_for_unsupported_serving_stack");
  }
  if (!QUANTIZATION_SERVING_BENCHMARK_QUANTIZATION_CLASSES.includes(policy.quantizationCandidate)) {
    blockers.push("blocked_for_unknown_quantization_candidate");
  }
  return blockers;
}

function requirementBlockers(policy) {
  const blockers = [];
  if (policy.visionCapableRequired !== true) {
    blockers.push("blocked_for_missing_vision_capable_requirement");
  }
  if (policy.nonThinkingModeRequired !== true) {
    blockers.push("blocked_for_missing_non_thinking_mode_requirement");
  }
  if (policy.structuredOutputRequired !== true) {
    blockers.push("blocked_for_missing_structured_output_requirement");
  }
  if (policy.approvedFixturePolicyRequired !== true) {
    blockers.push("blocked_for_missing_approved_fixture_policy");
  }
  if (policy.sanitizedMetricsRequired !== true) {
    blockers.push("blocked_for_missing_sanitized_metrics_policy");
  }
  return blockers;
}

function artifactPolicyBlockers(policy) {
  const blockers = [];
  if (policy.rawOutputPersistenceAllowed === true) {
    blockers.push("blocked_for_raw_output_persistence");
  }
  if (policy.rawPromptPersistenceAllowed === true) {
    blockers.push("blocked_for_raw_prompt_persistence");
  }
  if (policy.rawPayloadLoggingAllowed === true) {
    blockers.push("blocked_for_raw_payload_logging");
  }
  if (policy.realUserPhotosAllowed === true) {
    blockers.push("blocked_for_real_user_photos");
  }
  return blockers;
}

function endpointBoundaryBlockers(policy) {
  const blockers = [];
  if (policy.productionEndpointEnabled === true) {
    blockers.push("blocked_for_production_endpoint_enabled");
  }
  if (policy.iosRuntimeDependencyEnabled === true) {
    blockers.push("blocked_for_ios_runtime_dependency");
  }
  return blockers;
}

function probeValueBlockers(values) {
  const blockers = [];
  for (const value of values) {
    const serialized = String(value);
    if (FORBIDDEN_PROBE_VALUE_SNIPPETS.some((snippet) => serialized.includes(snippet))) {
      blockers.push("blocked_for_committed_raw_benchmark_plan_value");
    }
  }
  return blockers;
}

function sanitizeToken(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 96) || "unknown";
}

function unique(values) {
  return [...new Set(values)];
}
