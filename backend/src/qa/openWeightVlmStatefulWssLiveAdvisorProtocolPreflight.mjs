export const OPEN_WEIGHT_VLM_STATEFUL_WSS_LIVE_ADVISOR_PROTOCOL_PREFLIGHT_SCHEMA_VERSION =
  "open_weight_vlm_stateful_wss_live_advisor_protocol_preflight.v1";

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
  "fullPrompt",
  "\"rawPrompt\":",
  "\"requestPayload\":",
  "\"rawModelOutput\":",
  "\"modelOutput\":",
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
  "EXIF",
  "base64"
]);

export function statefulWssLiveAdvisorProtocolReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_STATEFUL_WSS_LIVE_ADVISOR_PROTOCOL_PREFLIGHT_SCHEMA_VERSION,
    wssRuntimeEnabled: false,
    webSocketServerRuntimeEnabled: false,
    iosWebSocketClientRuntimeEnabled: false,
    liveAdvisorRuntimeEnabled: false,
    cameraCloudEntryEnabled: false,
    uploadRuntimeEnabled: false,
    backendMediatedRequired: true,
    rawVideoStreamingAllowed: false,
    maxCloudAnalysisFpsBucket: "max_1fps",
    maxCloudAnalysisFps: 1,
    autoTriggerPolicyRequired: true,
    compressionPolicyRequired: true,
    consentRequired: true,
    silentUploadBlocked: true,
    disabledStateBlocksSession: true,
    disabledStateBlocksCapture: true,
    disabledStateBlocksUpload: true,
    backoffPolicyRequired: true,
    serverBusyBackoffRequired: true,
    retryPolicyBucket: "no_extra_upload_retries",
    providerFieldsAllowedInIos: false,
    rawPayloadAllowed: false,
    rawPromptAllowed: false,
    rawModelOutputAllowed: false,
    chainOfThoughtAllowed: false,
    debugLeakageAllowed: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    probeValues: []
  };
}

export function evaluateOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflight(
  policy = statefulWssLiveAdvisorProtocolReadyPolicy()
) {
  const blockers = unique([
    ...runtimeFlagBlockers(policy),
    ...protocolBoundaryBlockers(policy),
    ...rateAndDependencyBlockers(policy),
    ...consentAndStateBlockers(policy),
    ...retryBackoffBlockers(policy),
    ...payloadLeakageBlockers(policy),
    ...executionBlockers(policy),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_STATEFUL_WSS_LIVE_ADVISOR_PROTOCOL_PREFLIGHT_SCHEMA_VERSION,
    wssRuntimeEnabled: policy.wssRuntimeEnabled === true,
    webSocketServerRuntimeEnabled: policy.webSocketServerRuntimeEnabled === true,
    iosWebSocketClientRuntimeEnabled: policy.iosWebSocketClientRuntimeEnabled === true,
    liveAdvisorRuntimeEnabled: policy.liveAdvisorRuntimeEnabled === true,
    cameraCloudEntryEnabled: policy.cameraCloudEntryEnabled === true,
    uploadRuntimeEnabled: policy.uploadRuntimeEnabled === true,
    backendMediatedRequired: policy.backendMediatedRequired === true,
    rawVideoStreamingAllowed: policy.rawVideoStreamingAllowed === true,
    maxCloudAnalysisFpsBucket: sanitizeToken(policy.maxCloudAnalysisFpsBucket || "unknown"),
    autoTriggerPolicyRequired: policy.autoTriggerPolicyRequired === true,
    compressionPolicyRequired: policy.compressionPolicyRequired === true,
    consentRequired: policy.consentRequired === true,
    silentUploadBlocked: policy.silentUploadBlocked === true,
    disabledStateBlocksSession: policy.disabledStateBlocksSession === true,
    backoffPolicyRequired: policy.backoffPolicyRequired === true,
    retryPolicyBucket: sanitizeToken(policy.retryPolicyBucket || "unknown"),
    providerFieldsAllowedInIos: policy.providerFieldsAllowedInIos === true,
    rawPayloadAllowed: policy.rawPayloadAllowed === true,
    rawPromptAllowed: policy.rawPromptAllowed === true,
    rawModelOutputAllowed: policy.rawModelOutputAllowed === true,
    chainOfThoughtAllowed: policy.chainOfThoughtAllowed === true,
    debugLeakageAllowed: policy.debugLeakageAllowed === true,
    protocolPreflightEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_stateful_wss_live_advisor_protocol_preflight"
        : "blocked_for_stateful_wss_live_advisor_protocol_preflight",
      ...blockers,
      "planning_phase_no_wss_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.protocolPreflightEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_stateful_wss_live_advisor_protocol_preflight",
      ...report.blockers,
      "planning_phase_no_wss_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflightSamples() {
  const valid = evaluateOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflight(
    statefulWssLiveAdvisorProtocolReadyPolicy()
  );
  const blocked = evaluateOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflight({
    ...statefulWssLiveAdvisorProtocolReadyPolicy(),
    wssRuntimeEnabled: true,
    webSocketServerRuntimeEnabled: true,
    iosWebSocketClientRuntimeEnabled: true,
    maxCloudAnalysisFps: 30,
    maxCloudAnalysisFpsBucket: "over_1fps",
    rawVideoStreamingAllowed: true,
    productionReady: true
  });
  const blockers = valid.protocolPreflightEligible && !blocked.protocolPreflightEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_STATEFUL_WSS_LIVE_ADVISOR_PROTOCOL_PREFLIGHT_SCHEMA_VERSION,
    wssRuntimeEnabled: false,
    webSocketServerRuntimeEnabled: false,
    iosWebSocketClientRuntimeEnabled: false,
    liveAdvisorRuntimeEnabled: false,
    cameraCloudEntryEnabled: false,
    uploadRuntimeEnabled: false,
    backendMediatedRequired: true,
    rawVideoStreamingAllowed: false,
    maxCloudAnalysisFpsBucket: valid.maxCloudAnalysisFpsBucket,
    autoTriggerPolicyRequired: true,
    compressionPolicyRequired: true,
    consentRequired: true,
    silentUploadBlocked: true,
    disabledStateBlocksSession: true,
    backoffPolicyRequired: true,
    retryPolicyBucket: valid.retryPolicyBucket,
    providerFieldsAllowedInIos: false,
    rawPayloadAllowed: false,
    rawPromptAllowed: false,
    rawModelOutputAllowed: false,
    chainOfThoughtAllowed: false,
    debugLeakageAllowed: false,
    protocolPreflightEligible: blockers.length === 0,
    blockers,
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.protocolPreflightEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.protocolPreflightEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_stateful_wss_live_advisor_protocol_preflight"
        : "blocked_for_stateful_wss_live_advisor_protocol_preflight",
      ...blockers,
      "planning_phase_no_wss_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.protocolPreflightEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_stateful_wss_live_advisor_protocol_preflight",
      ...report.blockers,
      "planning_phase_no_wss_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflightReportRedacted(
  report = {}
) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "stateful_wss_live_advisor_protocol_preflight_not_redacted",
        message: "Stateful WSS Live Advisor protocol preflight report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function runtimeFlagBlockers(policy) {
  const blockers = [];
  for (const [field, code] of [
    ["wssRuntimeEnabled", "blocked_for_wss_runtime_enabled"],
    ["webSocketServerRuntimeEnabled", "blocked_for_websocket_server_runtime_enabled"],
    ["iosWebSocketClientRuntimeEnabled", "blocked_for_ios_websocket_client_runtime_enabled"],
    ["liveAdvisorRuntimeEnabled", "blocked_for_live_advisor_runtime_enabled"],
    ["cameraCloudEntryEnabled", "blocked_for_camera_cloud_entry_enabled"],
    ["uploadRuntimeEnabled", "blocked_for_upload_runtime_enabled"]
  ]) {
    if (policy[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function protocolBoundaryBlockers(policy) {
  const blockers = [];
  if (policy.backendMediatedRequired !== true) {
    blockers.push("blocked_for_missing_backend_mediation");
  }
  if (policy.rawVideoStreamingAllowed === true) {
    blockers.push("blocked_for_raw_video_streaming");
  }
  return blockers;
}

function rateAndDependencyBlockers(policy) {
  const blockers = [];
  if (policy.maxCloudAnalysisFpsBucket !== "max_1fps" || Number(policy.maxCloudAnalysisFps) > 1) {
    blockers.push("blocked_for_cloud_analysis_over_1fps");
  }
  if (policy.autoTriggerPolicyRequired !== true) {
    blockers.push("blocked_for_missing_auto_trigger_policy");
  }
  if (policy.compressionPolicyRequired !== true) {
    blockers.push("blocked_for_missing_compression_policy");
  }
  return blockers;
}

function consentAndStateBlockers(policy) {
  const blockers = [];
  if (policy.consentRequired !== true) {
    blockers.push("blocked_for_missing_consent_requirement");
  }
  if (policy.silentUploadBlocked !== true) {
    blockers.push("blocked_for_silent_upload_allowed");
  }
  if (policy.disabledStateBlocksSession !== true ||
    policy.disabledStateBlocksCapture !== true ||
    policy.disabledStateBlocksUpload !== true) {
    blockers.push("blocked_for_disabled_state_not_blocking_session_capture_upload");
  }
  return blockers;
}

function retryBackoffBlockers(policy) {
  const blockers = [];
  if (policy.backoffPolicyRequired !== true || policy.serverBusyBackoffRequired !== true) {
    blockers.push("blocked_for_missing_backoff_policy");
  }
  if (policy.retryPolicyBucket !== "no_extra_upload_retries") {
    blockers.push("blocked_for_unsafe_retry_policy");
  }
  return blockers;
}

function payloadLeakageBlockers(policy) {
  const blockers = [];
  for (const [field, code] of [
    ["providerFieldsAllowedInIos", "blocked_for_provider_fields_in_ios"],
    ["rawPayloadAllowed", "blocked_for_raw_payload_allowed"],
    ["rawPromptAllowed", "blocked_for_raw_prompt_allowed"],
    ["rawModelOutputAllowed", "blocked_for_raw_model_output_allowed"],
    ["chainOfThoughtAllowed", "blocked_for_chain_of_thought"],
    ["debugLeakageAllowed", "blocked_for_debug_provider_leakage"]
  ]) {
    if (policy[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
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
    const serialized = String(value);
    if (FORBIDDEN_PROBE_VALUE_SNIPPETS.some((snippet) => serialized.includes(snippet))) {
      blockers.push("blocked_for_committed_raw_protocol_value");
    }
  }
  return blockers;
}

function sanitizeToken(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 64) || "unknown";
}

function unique(values) {
  return [...new Set(values)];
}
