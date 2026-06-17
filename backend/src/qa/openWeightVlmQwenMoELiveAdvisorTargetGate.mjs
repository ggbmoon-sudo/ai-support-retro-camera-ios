export const OPEN_WEIGHT_VLM_QWEN_MOE_LIVE_ADVISOR_TARGET_GATE_SCHEMA_VERSION =
  "open_weight_vlm_qwen_moe_live_advisor_target_gate.v1";

export const QWEN_MOE_LIVE_ADVISOR_MODEL_CLASSES = Object.freeze([
  "qwen3_5_35b_a3b_moe_preferred",
  "qwen3_vl_moe_fallback_candidate",
  "qwen2_5_vl_reference",
  "qwen_9b_vision_fast_fallback",
  "text_only_qwen_blocked"
]);

export const QWEN_MOE_LIVE_ADVISOR_SERVING_STACKS = Object.freeze([
  "transformers_fastapi_reference",
  "vllm_primary_benchmark_candidate",
  "sglang_structured_output_challenger",
  "ollama_lmstudio_manual_only"
]);

export const QWEN_MOE_LIVE_ADVISOR_MODES = Object.freeze([
  "post_capture_only_current",
  "live_advisor_planned_blocked",
  "auto_trigger_planned_blocked",
  "wss_planned_blocked",
  "production_live_blocked"
]);

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "data:image",
  "base64",
  "rawPrompt",
  "fullPrompt",
  "\"requestPayload\":",
  "rawModelOutput",
  "modelOutput",
  "rawProviderResponse",
  "Authorization",
  "Bearer ",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CODE0_API_KEY",
  "INTENEXT_API_KEY",
  ".jpg",
  ".jpeg",
  ".png",
  "EXIF",
  "GPS",
  "secret_value",
  "provider_key_value",
  "chain-of-thought"
]);

const FORBIDDEN_PROBE_VALUE_SNIPPETS = Object.freeze([
  ...FORBIDDEN_REPORT_SNIPPETS,
  "prompt",
  "requestPayload",
  "modelOutput"
]);

export function qwenMoELiveAdvisorPreferredPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_QWEN_MOE_LIVE_ADVISOR_TARGET_GATE_SCHEMA_VERSION,
    preferredModelClass: "qwen3_5_35b_a3b_moe_preferred",
    visionCapableRequired: true,
    visionCapableVerified: true,
    multimodalServingPathVerified: true,
    nonThinkingModeRequired: true,
    nonThinkingModeSupported: true,
    structuredOutputRequired: true,
    structuredOutputSupported: true,
    deterministicStructuredMappingSupported: true,
    quantizationRequired: true,
    quantizationPlanDeclared: true,
    servingStackCandidate: "vllm_primary_benchmark_candidate",
    liveAdvisorMode: "live_advisor_planned_blocked",
    autoTriggerPolicyDeclared: true,
    autoTriggerRuntimeEnabled: false,
    autoTriggerStillnessThreshold: "gt_1s",
    noCaptureUploadWhenUnstable: true,
    maxCloudAnalysisFps: 1,
    compressionPolicyDeclared: true,
    compressionRuntimeEnabled: false,
    compressedPreviewFrameOnly: true,
    metadataStrippingRequired: true,
    wssPolicyDeclared: true,
    wssRuntimeEnabled: false,
    wssNoRawVideoStream: true,
    wssBackendMediatedOnly: true,
    localCvPolicyDeclared: true,
    localCvRuntimeEnabled: false,
    localCvLocalOnly: true,
    localCvPreservePreviewSmoothness: true,
    benchmarkRequired: true,
    benchmarkPlanDeclared: true,
    consentRequired: true,
    retentionPolicyRequired: true,
    deletionPolicyRequired: true,
    productionCandidateOnly: false,
    productionRouteEnabled: false,
    runtimeEnablementAllowed: false,
    localModelRouteEnabled: false,
    iosUploadRuntimeEnabled: false,
    directIOSModelRoute: false,
    freeFormModelTextAllowed: false,
    scoreRatingAllowed: false,
    sensitiveInferenceAllowed: false,
    chainOfThoughtAllowed: false,
    debugProviderLeakageAllowed: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    probeValues: []
  };
}

export function qwenMoELiveAdvisorReferencePolicy() {
  return {
    ...qwenMoELiveAdvisorPreferredPolicy(),
    preferredModelClass: "qwen2_5_vl_reference",
    servingStackCandidate: "transformers_fastapi_reference",
    liveAdvisorMode: "post_capture_only_current"
  };
}

export function qwenMoELiveAdvisorFastFallbackPolicy() {
  return {
    ...qwenMoELiveAdvisorPreferredPolicy(),
    preferredModelClass: "qwen_9b_vision_fast_fallback",
    servingStackCandidate: "sglang_structured_output_challenger",
    productionCandidateOnly: false,
    productionRouteEnabled: false
  };
}

export function evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGate(
  policy = qwenMoELiveAdvisorPreferredPolicy()
) {
  const blockers = unique([
    ...modelBlockers(policy),
    ...servingBlockers(policy),
    ...liveAdvisorBlockers(policy),
    ...uploadCompressionBlockers(policy),
    ...wssBlockers(policy),
    ...localCvBlockers(policy),
    ...benchmarkBlockers(policy),
    ...privacyPolicyBlockers(policy),
    ...runtimeBoundaryBlockers(policy),
    ...safetyLanguageBlockers(policy),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_QWEN_MOE_LIVE_ADVISOR_TARGET_GATE_SCHEMA_VERSION,
    preferredModelClass: sanitizeToken(policy.preferredModelClass || "unknown"),
    visionCapableRequired: policy.visionCapableRequired === true,
    visionCapableVerified: policy.visionCapableVerified === true,
    nonThinkingModeRequired: policy.nonThinkingModeRequired === true,
    structuredOutputRequired: policy.structuredOutputRequired === true,
    quantizationRequired: policy.quantizationRequired === true,
    servingStackCandidate: sanitizeToken(policy.servingStackCandidate || "unknown"),
    liveAdvisorMode: sanitizeToken(policy.liveAdvisorMode || "unknown"),
    autoTriggerPolicyBucket: autoTriggerPolicyBucket(policy),
    compressionPolicyBucket: compressionPolicyBucket(policy),
    wssPolicyBucket: wssPolicyBucket(policy),
    localCvPolicyBucket: localCvPolicyBucket(policy),
    benchmarkRequired: policy.benchmarkRequired === true,
    consentRequired: policy.consentRequired === true,
    metadataStrippingRequired: policy.metadataStrippingRequired === true,
    retentionPolicyRequired: policy.retentionPolicyRequired === true,
    deletionPolicyRequired: policy.deletionPolicyRequired === true,
    targetGateEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_qwen_moe_live_advisor_target_gate"
        : "blocked_for_qwen_moe_live_advisor_target_gate",
      ...blockers,
      "planning_phase_no_runtime_enablement",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmQwenMoELiveAdvisorTargetGateReportRedacted(report);
  if (!redaction.ok) {
    report.targetGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_qwen_moe_live_advisor_target_gate",
      ...report.blockers,
      "planning_phase_no_runtime_enablement",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGateSamples() {
  const preferred = evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGate(
    qwenMoELiveAdvisorPreferredPolicy()
  );
  const reference = evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGate(
    qwenMoELiveAdvisorReferencePolicy()
  );
  const blocked = evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGate({
    ...qwenMoELiveAdvisorPreferredPolicy(),
    preferredModelClass: "text_only_qwen_blocked",
    visionCapableVerified: false,
    multimodalServingPathVerified: false,
    modelCallsMade: true,
    productionReady: true
  });
  const blockers = preferred.targetGateEligible &&
    reference.targetGateEligible &&
    !blocked.targetGateEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_QWEN_MOE_LIVE_ADVISOR_TARGET_GATE_SCHEMA_VERSION,
    preferredModelClass: preferred.preferredModelClass,
    visionCapableRequired: true,
    visionCapableVerified: preferred.visionCapableVerified,
    nonThinkingModeRequired: true,
    structuredOutputRequired: true,
    quantizationRequired: true,
    servingStackCandidate: preferred.servingStackCandidate,
    liveAdvisorMode: preferred.liveAdvisorMode,
    autoTriggerPolicyBucket: preferred.autoTriggerPolicyBucket,
    compressionPolicyBucket: preferred.compressionPolicyBucket,
    wssPolicyBucket: preferred.wssPolicyBucket,
    localCvPolicyBucket: preferred.localCvPolicyBucket,
    benchmarkRequired: true,
    consentRequired: true,
    metadataStrippingRequired: true,
    retentionPolicyRequired: true,
    deletionPolicyRequired: true,
    targetGateEligible: blockers.length === 0,
    blockers,
    reviewedPolicyCount: 3,
    eligiblePolicyCount: [preferred, reference].filter((item) => item.targetGateEligible).length,
    expectedBlockedPolicyCount: blocked.targetGateEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_qwen_moe_live_advisor_target_gate"
        : "blocked_for_qwen_moe_live_advisor_target_gate",
      ...blockers,
      "planning_phase_no_runtime_enablement",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmQwenMoELiveAdvisorTargetGateReportRedacted(report);
  if (!redaction.ok) {
    report.targetGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_qwen_moe_live_advisor_target_gate",
      ...report.blockers,
      "planning_phase_no_runtime_enablement",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmQwenMoELiveAdvisorTargetGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "qwen_moe_live_advisor_target_gate_not_redacted",
        message: "Qwen MoE Live Advisor target gate report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function modelBlockers(policy) {
  const blockers = [];
  if (!QWEN_MOE_LIVE_ADVISOR_MODEL_CLASSES.includes(policy.preferredModelClass)) {
    blockers.push("blocked_for_unknown_model_class");
  }
  if (policy.preferredModelClass === "text_only_qwen_blocked") {
    blockers.push("blocked_for_text_only_model");
  }
  if (policy.visionCapableRequired !== true) {
    blockers.push("blocked_for_missing_vision_capable_requirement");
  }
  if (policy.visionCapableVerified !== true || policy.multimodalServingPathVerified !== true) {
    blockers.push("blocked_for_unverified_vision_capability");
  }
  if (policy.preferredModelClass === "qwen3_5_35b_a3b_moe_preferred" &&
    policy.runtimeEnablementAllowed !== false) {
    blockers.push("blocked_for_runtime_enablement_in_planning_phase");
  }
  if (policy.preferredModelClass === "qwen_9b_vision_fast_fallback" &&
    policy.productionRouteEnabled === true) {
    blockers.push("blocked_for_fast_fallback_as_production_route");
  }
  if (policy.nonThinkingModeRequired !== true || policy.nonThinkingModeSupported !== true) {
    blockers.push("blocked_for_missing_non_thinking_direct_output_mode");
  }
  if (policy.structuredOutputRequired !== true ||
    (policy.structuredOutputSupported !== true &&
      policy.deterministicStructuredMappingSupported !== true)) {
    blockers.push("blocked_for_missing_structured_output");
  }
  return blockers;
}

function servingBlockers(policy) {
  const blockers = [];
  if (!QWEN_MOE_LIVE_ADVISOR_SERVING_STACKS.includes(policy.servingStackCandidate)) {
    blockers.push("blocked_for_unknown_serving_stack");
  }
  if (policy.quantizationRequired !== true || policy.quantizationPlanDeclared !== true) {
    blockers.push("blocked_for_missing_quantization_plan");
  }
  return blockers;
}

function liveAdvisorBlockers(policy) {
  const blockers = [];
  if (!QWEN_MOE_LIVE_ADVISOR_MODES.includes(policy.liveAdvisorMode)) {
    blockers.push("blocked_for_unknown_live_advisor_mode");
  }
  if (policy.liveAdvisorMode === "production_live_blocked") {
    blockers.push("blocked_for_production_live_advisor");
  }
  if (policy.autoTriggerRuntimeEnabled === true) {
    blockers.push("blocked_for_auto_trigger_runtime_enabled");
  }
  if (policy.autoTriggerPolicyDeclared !== true ||
    policy.autoTriggerStillnessThreshold !== "gt_1s" ||
    policy.noCaptureUploadWhenUnstable !== true ||
    Number(policy.maxCloudAnalysisFps) !== 1) {
    blockers.push("blocked_for_missing_auto_trigger_policy");
  }
  return blockers;
}

function uploadCompressionBlockers(policy) {
  const blockers = [];
  if (policy.compressionRuntimeEnabled === true || policy.iosUploadRuntimeEnabled === true) {
    blockers.push("blocked_for_ios_upload_runtime_enabled");
  }
  if (policy.compressionPolicyDeclared !== true ||
    policy.compressedPreviewFrameOnly !== true ||
    policy.metadataStrippingRequired !== true) {
    blockers.push("blocked_for_missing_compression_upload_policy");
  }
  return blockers;
}

function wssBlockers(policy) {
  const blockers = [];
  if (policy.wssRuntimeEnabled === true) {
    blockers.push("blocked_for_wss_runtime_enabled");
  }
  if (policy.wssPolicyDeclared !== true ||
    policy.wssNoRawVideoStream !== true ||
    policy.wssBackendMediatedOnly !== true) {
    blockers.push("blocked_for_missing_wss_policy");
  }
  return blockers;
}

function localCvBlockers(policy) {
  if (policy.localCvPolicyDeclared !== true ||
    policy.localCvLocalOnly !== true ||
    policy.localCvPreservePreviewSmoothness !== true) {
    return ["blocked_for_missing_local_cv_policy"];
  }
  return [];
}

function benchmarkBlockers(policy) {
  if (policy.benchmarkRequired !== true || policy.benchmarkPlanDeclared !== true) {
    return ["blocked_for_missing_benchmark_requirement"];
  }
  return [];
}

function privacyPolicyBlockers(policy) {
  const blockers = [];
  if (policy.consentRequired !== true) {
    blockers.push("blocked_for_missing_consent_requirement");
  }
  if (policy.retentionPolicyRequired !== true) {
    blockers.push("blocked_for_missing_retention_policy");
  }
  if (policy.deletionPolicyRequired !== true) {
    blockers.push("blocked_for_missing_deletion_policy");
  }
  return blockers;
}

function runtimeBoundaryBlockers(policy) {
  const blockers = [];
  if (policy.localModelRouteEnabled === true) {
    blockers.push("blocked_for_local_model_route_enabled");
  }
  if (policy.directIOSModelRoute === true) {
    blockers.push("blocked_for_direct_ios_model_route");
  }
  if (policy.modelCallsMade === true) {
    blockers.push("blocked_for_model_call_in_planning_phase");
  }
  if (policy.qwenInferenceRun === true) {
    blockers.push("blocked_for_qwen_inference_in_planning_phase");
  }
  if (policy.benchmarkRun === true) {
    blockers.push("blocked_for_benchmark_execution");
  }
  return blockers;
}

function safetyLanguageBlockers(policy) {
  const blockers = [];
  if (policy.freeFormModelTextAllowed === true) {
    blockers.push("blocked_for_free_form_model_text");
  }
  if (policy.scoreRatingAllowed === true) {
    blockers.push("blocked_for_score_rating");
  }
  if (policy.sensitiveInferenceAllowed === true) {
    blockers.push("blocked_for_sensitive_inference");
  }
  if (policy.chainOfThoughtAllowed === true) {
    blockers.push("blocked_for_chain_of_thought");
  }
  if (policy.debugProviderLeakageAllowed === true) {
    blockers.push("blocked_for_debug_provider_leakage");
  }
  return blockers;
}

function probeValueBlockers(values) {
  const blockers = [];
  for (const value of values) {
    if (
      typeof value === "string" &&
      FORBIDDEN_PROBE_VALUE_SNIPPETS.some((snippet) => value.includes(snippet))
    ) {
      blockers.push("blocked_for_committed_raw_policy_value");
    }
  }
  return unique(blockers);
}

function autoTriggerPolicyBucket(policy) {
  return policy.autoTriggerPolicyDeclared === true &&
    policy.autoTriggerRuntimeEnabled !== true &&
    policy.autoTriggerStillnessThreshold === "gt_1s" &&
    policy.noCaptureUploadWhenUnstable === true &&
    Number(policy.maxCloudAnalysisFps) === 1
    ? "planned_blocked_gt_1s_max_1fps_no_upload_when_unstable"
    : "blocked_auto_trigger_policy";
}

function compressionPolicyBucket(policy) {
  return policy.compressionPolicyDeclared === true &&
    policy.compressionRuntimeEnabled !== true &&
    policy.iosUploadRuntimeEnabled !== true &&
    policy.compressedPreviewFrameOnly === true &&
    policy.metadataStrippingRequired === true
    ? "planned_blocked_compressed_preview_metadata_stripped"
    : "blocked_compression_policy";
}

function wssPolicyBucket(policy) {
  return policy.wssPolicyDeclared === true &&
    policy.wssRuntimeEnabled !== true &&
    policy.wssNoRawVideoStream === true &&
    policy.wssBackendMediatedOnly === true
    ? "planned_blocked_stateful_backend_mediated_no_raw_video"
    : "blocked_wss_policy";
}

function localCvPolicyBucket(policy) {
  return policy.localCvPolicyDeclared === true &&
    policy.localCvLocalOnly === true &&
    policy.localCvPreservePreviewSmoothness === true
    ? "local_only_camera_aids_planned"
    : "blocked_local_cv_policy";
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 96) || "unknown";
}
