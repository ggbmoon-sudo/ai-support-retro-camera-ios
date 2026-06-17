export const OPEN_WEIGHT_VLM_IMAGE_COMPRESSION_UPLOAD_POLICY_GATE_SCHEMA_VERSION =
  "open_weight_vlm_image_compression_upload_policy_gate.v1";

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

export function imageCompressionUploadPolicyReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_IMAGE_COMPRESSION_UPLOAD_POLICY_GATE_SCHEMA_VERSION,
    uploadRuntimeEnabled: false,
    compressionRuntimeEnabled: false,
    targetLongEdgeBucket: "around_1024_px_planning_target",
    targetPayloadSizeBucket: "150kb_to_200kb_planning_target",
    metadataStrippingRequired: true,
    consentRequired: true,
    retentionPolicyRequired: true,
    deletionPolicyRequired: true,
    allowsOriginalFullResolution: false,
    allowsBase64: false,
    allowsRawPath: false,
    allowsGps: false,
    allowsRawExif: false,
    allowsRawSensor: false,
    allowsCaptureContextUpload: false,
    captureContextUploadExplicitlyApproved: false,
    allowsProviderFieldsInIos: false,
    autoTriggerPolicyLinked: true,
    autoTriggerStillnessThresholdBucket: "gt_1s",
    noCaptureUploadWhenUnstable: true,
    oneFpsPolicyRequired: true,
    maxCloudAnalysisFps: 1,
    backendMediatedOnly: true,
    appFacingEndpointEnabled: false,
    productionEndpointEnabled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    probeValues: []
  };
}

export function evaluateOpenWeightVlmImageCompressionUploadPolicyGate(
  policy = imageCompressionUploadPolicyReadyPolicy()
) {
  const blockers = unique([
    ...runtimeBlockers(policy),
    ...payloadBlockers(policy),
    ...privacyPolicyBlockers(policy),
    ...autoTriggerPolicyBlockers(policy),
    ...endpointBlockers(policy),
    ...executionBlockers(policy),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_IMAGE_COMPRESSION_UPLOAD_POLICY_GATE_SCHEMA_VERSION,
    uploadRuntimeEnabled: policy.uploadRuntimeEnabled === true,
    compressionRuntimeEnabled: policy.compressionRuntimeEnabled === true,
    targetLongEdgeBucket: sanitizeToken(policy.targetLongEdgeBucket || "unknown"),
    targetPayloadSizeBucket: sanitizeToken(policy.targetPayloadSizeBucket || "unknown"),
    metadataStrippingRequired: policy.metadataStrippingRequired === true,
    consentRequired: policy.consentRequired === true,
    retentionPolicyRequired: policy.retentionPolicyRequired === true,
    deletionPolicyRequired: policy.deletionPolicyRequired === true,
    allowsOriginalFullResolution: policy.allowsOriginalFullResolution === true,
    allowsBase64: policy.allowsBase64 === true,
    allowsRawPath: policy.allowsRawPath === true,
    allowsGps: policy.allowsGps === true,
    allowsRawExif: policy.allowsRawExif === true,
    allowsRawSensor: policy.allowsRawSensor === true,
    allowsCaptureContextUpload: policy.allowsCaptureContextUpload === true,
    allowsProviderFieldsInIos: policy.allowsProviderFieldsInIos === true,
    autoTriggerPolicyLinked: policy.autoTriggerPolicyLinked === true,
    oneFpsPolicyRequired: policy.oneFpsPolicyRequired === true,
    uploadPolicyEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_image_compression_upload_policy_gate"
        : "blocked_for_image_compression_upload_policy_gate",
      ...blockers,
      "planning_phase_no_upload_or_compression_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmImageCompressionUploadPolicyGateReportRedacted(report);
  if (!redaction.ok) {
    report.uploadPolicyEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_image_compression_upload_policy_gate",
      ...report.blockers,
      "planning_phase_no_upload_or_compression_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmImageCompressionUploadPolicyGateSamples() {
  const valid = evaluateOpenWeightVlmImageCompressionUploadPolicyGate(
    imageCompressionUploadPolicyReadyPolicy()
  );
  const blocked = evaluateOpenWeightVlmImageCompressionUploadPolicyGate({
    ...imageCompressionUploadPolicyReadyPolicy(),
    uploadRuntimeEnabled: true,
    compressionRuntimeEnabled: true,
    allowsOriginalFullResolution: true,
    allowsRawExif: true,
    allowsCaptureContextUpload: true,
    consentRequired: false,
    autoTriggerPolicyLinked: false,
    productionReady: true
  });
  const blockers = valid.uploadPolicyEligible && !blocked.uploadPolicyEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_IMAGE_COMPRESSION_UPLOAD_POLICY_GATE_SCHEMA_VERSION,
    uploadRuntimeEnabled: false,
    compressionRuntimeEnabled: false,
    targetLongEdgeBucket: valid.targetLongEdgeBucket,
    targetPayloadSizeBucket: valid.targetPayloadSizeBucket,
    metadataStrippingRequired: true,
    consentRequired: true,
    retentionPolicyRequired: true,
    deletionPolicyRequired: true,
    allowsOriginalFullResolution: false,
    allowsBase64: false,
    allowsRawPath: false,
    allowsGps: false,
    allowsRawExif: false,
    allowsRawSensor: false,
    allowsCaptureContextUpload: false,
    allowsProviderFieldsInIos: false,
    autoTriggerPolicyLinked: true,
    oneFpsPolicyRequired: true,
    uploadPolicyEligible: blockers.length === 0,
    blockers,
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.uploadPolicyEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.uploadPolicyEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_image_compression_upload_policy_gate"
        : "blocked_for_image_compression_upload_policy_gate",
      ...blockers,
      "planning_phase_no_upload_or_compression_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmImageCompressionUploadPolicyGateReportRedacted(report);
  if (!redaction.ok) {
    report.uploadPolicyEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_image_compression_upload_policy_gate",
      ...report.blockers,
      "planning_phase_no_upload_or_compression_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmImageCompressionUploadPolicyGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "image_compression_upload_policy_gate_not_redacted",
        message: "Image compression upload policy gate report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function runtimeBlockers(policy) {
  const blockers = [];
  if (policy.uploadRuntimeEnabled === true) {
    blockers.push("blocked_for_upload_runtime_enabled");
  }
  if (policy.compressionRuntimeEnabled === true) {
    blockers.push("blocked_for_compression_runtime_enabled");
  }
  return blockers;
}

function payloadBlockers(policy) {
  const blockers = [];
  if (policy.targetLongEdgeBucket !== "around_1024_px_planning_target") {
    blockers.push("blocked_for_missing_long_edge_planning_target");
  }
  if (policy.targetPayloadSizeBucket !== "150kb_to_200kb_planning_target") {
    blockers.push("blocked_for_missing_payload_size_planning_target");
  }
  if (policy.allowsOriginalFullResolution === true) {
    blockers.push("blocked_for_original_full_resolution_upload");
  }
  if (policy.allowsBase64 === true) {
    blockers.push("blocked_for_base64_payload");
  }
  if (policy.allowsRawPath === true) {
    blockers.push("blocked_for_raw_path_payload");
  }
  if (policy.allowsGps === true) {
    blockers.push("blocked_for_gps_payload");
  }
  if (policy.allowsRawExif === true) {
    blockers.push("blocked_for_raw_exif_payload");
  }
  if (policy.allowsRawSensor === true) {
    blockers.push("blocked_for_raw_sensor_payload");
  }
  if (policy.allowsCaptureContextUpload === true ||
    policy.captureContextUploadExplicitlyApproved === true) {
    blockers.push("blocked_for_capture_context_upload");
  }
  if (policy.allowsProviderFieldsInIos === true) {
    blockers.push("blocked_for_provider_fields_in_ios");
  }
  return blockers;
}

function privacyPolicyBlockers(policy) {
  const blockers = [];
  if (policy.metadataStrippingRequired !== true) {
    blockers.push("blocked_for_missing_metadata_stripping");
  }
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

function autoTriggerPolicyBlockers(policy) {
  const blockers = [];
  if (policy.autoTriggerPolicyLinked !== true ||
    policy.autoTriggerStillnessThresholdBucket !== "gt_1s" ||
    policy.noCaptureUploadWhenUnstable !== true) {
    blockers.push("blocked_for_missing_auto_trigger_policy");
  }
  if (policy.oneFpsPolicyRequired !== true || Number(policy.maxCloudAnalysisFps) !== 1) {
    blockers.push("blocked_for_missing_one_fps_policy");
  }
  return blockers;
}

function endpointBlockers(policy) {
  const blockers = [];
  if (policy.backendMediatedOnly !== true) {
    blockers.push("blocked_for_missing_backend_mediation");
  }
  if (policy.appFacingEndpointEnabled === true) {
    blockers.push("blocked_for_app_facing_endpoint");
  }
  if (policy.productionEndpointEnabled === true) {
    blockers.push("blocked_for_production_endpoint");
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
