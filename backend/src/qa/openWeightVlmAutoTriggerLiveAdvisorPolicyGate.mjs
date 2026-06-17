export const OPEN_WEIGHT_VLM_AUTO_TRIGGER_LIVE_ADVISOR_POLICY_GATE_SCHEMA_VERSION =
  "open_weight_vlm_auto_trigger_live_advisor_policy_gate.v1";

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "data:image",
  "/9j/",
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
  "secret_value",
  "provider_key_value"
]);

const FORBIDDEN_PROBE_VALUE_SNIPPETS = Object.freeze([
  ...FORBIDDEN_REPORT_SNIPPETS,
  "prompt",
  "requestPayload",
  "modelOutput",
  "GPS",
  "EXIF"
]);

export function autoTriggerLiveAdvisorPolicyReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_AUTO_TRIGGER_LIVE_ADVISOR_POLICY_GATE_SCHEMA_VERSION,
    autoTriggerRuntimeEnabled: false,
    liveAdvisorRuntimeEnabled: false,
    cameraCloudEntryEnabled: false,
    wssRuntimeEnabled: false,
    uploadRuntimeEnabled: false,
    stillnessThresholdBucket: "gt_1s",
    noCaptureWhenUnderOrEqualThreshold: true,
    noUploadWhenUnderOrEqualThreshold: true,
    noBackendCallWhenUnderOrEqualThreshold: true,
    noModelCallWhenUnderOrEqualThreshold: true,
    maxCloudAnalysisFpsBucket: "max_1fps",
    maxCloudAnalysisFps: 1,
    consentRequired: true,
    silentUploadBlocked: true,
    disabledStateBlocksCapture: true,
    compressionPolicyRequired: true,
    metadataStrippingRequired: true,
    backendMediatedRequired: true,
    localCvOnlyForFastAids: true,
    rawVideoStreamingAllowed: false,
    retryPolicyBucket: "no_extra_upload_retries",
    backoffPolicyRequired: true,
    serverBusyBackoffRequired: true,
    allowsProviderFieldsInIos: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    probeValues: []
  };
}

export function evaluateOpenWeightVlmAutoTriggerLiveAdvisorPolicyGate(
  policy = autoTriggerLiveAdvisorPolicyReadyPolicy()
) {
  const blockers = unique([
    ...runtimeFlagBlockers(policy),
    ...stillnessBlockers(policy),
    ...fpsBlockers(policy),
    ...consentAndStateBlockers(policy),
    ...compressionUploadBlockers(policy),
    ...localCvAndWssBlockers(policy),
    ...retryBackoffBlockers(policy),
    ...iosBoundaryBlockers(policy),
    ...executionBlockers(policy),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_AUTO_TRIGGER_LIVE_ADVISOR_POLICY_GATE_SCHEMA_VERSION,
    autoTriggerRuntimeEnabled: policy.autoTriggerRuntimeEnabled === true,
    liveAdvisorRuntimeEnabled: policy.liveAdvisorRuntimeEnabled === true,
    cameraCloudEntryEnabled: policy.cameraCloudEntryEnabled === true,
    wssRuntimeEnabled: policy.wssRuntimeEnabled === true,
    uploadRuntimeEnabled: policy.uploadRuntimeEnabled === true,
    stillnessThresholdBucket: sanitizeToken(policy.stillnessThresholdBucket || "unknown"),
    noCaptureWhenUnderOrEqualThreshold: policy.noCaptureWhenUnderOrEqualThreshold === true,
    maxCloudAnalysisFpsBucket: sanitizeToken(policy.maxCloudAnalysisFpsBucket || "unknown"),
    consentRequired: policy.consentRequired === true,
    silentUploadBlocked: policy.silentUploadBlocked === true,
    disabledStateBlocksCapture: policy.disabledStateBlocksCapture === true,
    compressionPolicyRequired: policy.compressionPolicyRequired === true,
    metadataStrippingRequired: policy.metadataStrippingRequired === true,
    backendMediatedRequired: policy.backendMediatedRequired === true,
    localCvOnlyForFastAids: policy.localCvOnlyForFastAids === true,
    rawVideoStreamingAllowed: policy.rawVideoStreamingAllowed === true,
    retryPolicyBucket: sanitizeToken(policy.retryPolicyBucket || "unknown"),
    backoffPolicyRequired: policy.backoffPolicyRequired === true,
    autoTriggerPolicyEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_auto_trigger_live_advisor_policy_gate"
        : "blocked_for_auto_trigger_live_advisor_policy_gate",
      ...blockers,
      "planning_phase_no_live_advisor_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmAutoTriggerLiveAdvisorPolicyGateReportRedacted(report);
  if (!redaction.ok) {
    report.autoTriggerPolicyEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_auto_trigger_live_advisor_policy_gate",
      ...report.blockers,
      "planning_phase_no_live_advisor_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmAutoTriggerLiveAdvisorPolicyGateSamples() {
  const valid = evaluateOpenWeightVlmAutoTriggerLiveAdvisorPolicyGate(
    autoTriggerLiveAdvisorPolicyReadyPolicy()
  );
  const blocked = evaluateOpenWeightVlmAutoTriggerLiveAdvisorPolicyGate({
    ...autoTriggerLiveAdvisorPolicyReadyPolicy(),
    autoTriggerRuntimeEnabled: true,
    liveAdvisorRuntimeEnabled: true,
    stillnessThresholdBucket: "lte_1s",
    noCaptureWhenUnderOrEqualThreshold: false,
    maxCloudAnalysisFps: 30,
    maxCloudAnalysisFpsBucket: "over_1fps",
    silentUploadBlocked: false,
    productionReady: true
  });
  const blockers = valid.autoTriggerPolicyEligible && !blocked.autoTriggerPolicyEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_AUTO_TRIGGER_LIVE_ADVISOR_POLICY_GATE_SCHEMA_VERSION,
    autoTriggerRuntimeEnabled: false,
    liveAdvisorRuntimeEnabled: false,
    cameraCloudEntryEnabled: false,
    wssRuntimeEnabled: false,
    uploadRuntimeEnabled: false,
    stillnessThresholdBucket: valid.stillnessThresholdBucket,
    noCaptureWhenUnderOrEqualThreshold: true,
    maxCloudAnalysisFpsBucket: valid.maxCloudAnalysisFpsBucket,
    consentRequired: true,
    silentUploadBlocked: true,
    disabledStateBlocksCapture: true,
    compressionPolicyRequired: true,
    metadataStrippingRequired: true,
    backendMediatedRequired: true,
    localCvOnlyForFastAids: true,
    rawVideoStreamingAllowed: false,
    retryPolicyBucket: valid.retryPolicyBucket,
    backoffPolicyRequired: true,
    autoTriggerPolicyEligible: blockers.length === 0,
    blockers,
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.autoTriggerPolicyEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.autoTriggerPolicyEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_auto_trigger_live_advisor_policy_gate"
        : "blocked_for_auto_trigger_live_advisor_policy_gate",
      ...blockers,
      "planning_phase_no_live_advisor_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmAutoTriggerLiveAdvisorPolicyGateReportRedacted(report);
  if (!redaction.ok) {
    report.autoTriggerPolicyEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_auto_trigger_live_advisor_policy_gate",
      ...report.blockers,
      "planning_phase_no_live_advisor_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmAutoTriggerLiveAdvisorPolicyGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "auto_trigger_live_advisor_policy_gate_not_redacted",
        message: "Auto-Trigger Live Advisor policy gate report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function runtimeFlagBlockers(policy) {
  const blockers = [];
  for (const [field, code] of [
    ["autoTriggerRuntimeEnabled", "blocked_for_auto_trigger_runtime_enabled"],
    ["liveAdvisorRuntimeEnabled", "blocked_for_live_advisor_runtime_enabled"],
    ["cameraCloudEntryEnabled", "blocked_for_camera_cloud_entry_enabled"],
    ["wssRuntimeEnabled", "blocked_for_wss_runtime_enabled"],
    ["uploadRuntimeEnabled", "blocked_for_upload_runtime_enabled"]
  ]) {
    if (policy[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function stillnessBlockers(policy) {
  const blockers = [];
  if (policy.stillnessThresholdBucket !== "gt_1s") {
    blockers.push("blocked_for_missing_gt_1s_stillness_threshold");
  }
  if (policy.noCaptureWhenUnderOrEqualThreshold !== true ||
    policy.noUploadWhenUnderOrEqualThreshold !== true ||
    policy.noBackendCallWhenUnderOrEqualThreshold !== true ||
    policy.noModelCallWhenUnderOrEqualThreshold !== true) {
    blockers.push("blocked_for_missing_lte_1s_no_capture_no_upload_rule");
  }
  return blockers;
}

function fpsBlockers(policy) {
  if (policy.maxCloudAnalysisFpsBucket !== "max_1fps" || Number(policy.maxCloudAnalysisFps) > 1) {
    return ["blocked_for_cloud_analysis_over_1fps"];
  }
  return [];
}

function consentAndStateBlockers(policy) {
  const blockers = [];
  if (policy.consentRequired !== true) {
    blockers.push("blocked_for_missing_consent_requirement");
  }
  if (policy.silentUploadBlocked !== true) {
    blockers.push("blocked_for_silent_upload_allowed");
  }
  if (policy.disabledStateBlocksCapture !== true) {
    blockers.push("blocked_for_disabled_state_not_blocking_capture");
  }
  return blockers;
}

function compressionUploadBlockers(policy) {
  const blockers = [];
  if (policy.compressionPolicyRequired !== true) {
    blockers.push("blocked_for_missing_compression_policy");
  }
  if (policy.metadataStrippingRequired !== true) {
    blockers.push("blocked_for_missing_metadata_stripping");
  }
  if (policy.backendMediatedRequired !== true) {
    blockers.push("blocked_for_missing_backend_mediation");
  }
  return blockers;
}

function localCvAndWssBlockers(policy) {
  const blockers = [];
  if (policy.localCvOnlyForFastAids !== true) {
    blockers.push("blocked_for_missing_local_cv_boundary");
  }
  if (policy.rawVideoStreamingAllowed === true) {
    blockers.push("blocked_for_raw_video_streaming");
  }
  return blockers;
}

function retryBackoffBlockers(policy) {
  const blockers = [];
  if (policy.retryPolicyBucket !== "no_extra_upload_retries") {
    blockers.push("blocked_for_unsafe_retry_policy");
  }
  if (policy.backoffPolicyRequired !== true || policy.serverBusyBackoffRequired !== true) {
    blockers.push("blocked_for_missing_backoff_policy");
  }
  return blockers;
}

function iosBoundaryBlockers(policy) {
  if (policy.allowsProviderFieldsInIos === true) {
    return ["blocked_for_provider_fields_in_ios"];
  }
  return [];
}

function executionBlockers(policy) {
  const blockers = [];
  if (policy.networkCallsMade === true) {
    blockers.push("blocked_for_network_call_in_planning_phase");
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

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 96) || "unknown";
}
