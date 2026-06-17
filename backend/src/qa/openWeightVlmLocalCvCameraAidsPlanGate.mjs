export const OPEN_WEIGHT_VLM_LOCAL_CV_CAMERA_AIDS_PLAN_GATE_SCHEMA_VERSION =
  "open_weight_vlm_local_cv_camera_aids_plan_gate.v1";

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
  "EXIF",
  "base64",
  "CVPixelBuffer"
]);

export function localCvCameraAidsPlanReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_CV_CAMERA_AIDS_PLAN_GATE_SCHEMA_VERSION,
    localCvRuntimeEnabled: false,
    gridAlignmentRuntimeEnabled: false,
    horizonLevelRuntimeEnabled: false,
    exposureWarningRuntimeEnabled: false,
    motionStabilityRuntimeEnabled: false,
    cameraCloudEntryEnabled: false,
    uploadRuntimeEnabled: false,
    localOnlyRequired: true,
    noBackendCallRequired: true,
    noUploadRequired: true,
    noRawFramePersistenceRequired: true,
    noRawSensorPersistenceRequired: true,
    noGpsPersistenceRequired: true,
    noRawExifPersistenceRequired: true,
    cameraSmoothnessTargetBucket: "target_60fps_smooth_preview",
    autoTriggerRelationshipBucket: "bucketed_signal_only_future_auto_trigger",
    cloudVlmRelationshipBucket: "high_level_only_after_consent_trigger_upload_gates",
    providerFieldsAllowedInIos: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    probeValues: []
  };
}

export function evaluateOpenWeightVlmLocalCvCameraAidsPlanGate(
  policy = localCvCameraAidsPlanReadyPolicy()
) {
  const blockers = unique([
    ...runtimeFlagBlockers(policy),
    ...localOnlyBlockers(policy),
    ...privacyPersistenceBlockers(policy),
    ...relationshipBlockers(policy),
    ...iosBoundaryBlockers(policy),
    ...executionBlockers(policy),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_CV_CAMERA_AIDS_PLAN_GATE_SCHEMA_VERSION,
    localCvRuntimeEnabled: policy.localCvRuntimeEnabled === true,
    gridAlignmentRuntimeEnabled: policy.gridAlignmentRuntimeEnabled === true,
    horizonLevelRuntimeEnabled: policy.horizonLevelRuntimeEnabled === true,
    exposureWarningRuntimeEnabled: policy.exposureWarningRuntimeEnabled === true,
    motionStabilityRuntimeEnabled: policy.motionStabilityRuntimeEnabled === true,
    cameraCloudEntryEnabled: policy.cameraCloudEntryEnabled === true,
    uploadRuntimeEnabled: policy.uploadRuntimeEnabled === true,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    localOnlyRequired: policy.localOnlyRequired === true,
    noBackendCallRequired: policy.noBackendCallRequired === true,
    noUploadRequired: policy.noUploadRequired === true,
    noRawFramePersistenceRequired: policy.noRawFramePersistenceRequired === true,
    noRawSensorPersistenceRequired: policy.noRawSensorPersistenceRequired === true,
    noGpsPersistenceRequired: policy.noGpsPersistenceRequired === true,
    noRawExifPersistenceRequired: policy.noRawExifPersistenceRequired === true,
    cameraSmoothnessTargetBucket: sanitizeToken(policy.cameraSmoothnessTargetBucket || "unknown"),
    autoTriggerRelationshipBucket: sanitizeToken(policy.autoTriggerRelationshipBucket || "unknown"),
    cloudVlmRelationshipBucket: sanitizeToken(policy.cloudVlmRelationshipBucket || "unknown"),
    providerFieldsAllowedInIos: policy.providerFieldsAllowedInIos === true,
    localCvPlanEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_local_cv_camera_aids_plan_gate"
        : "blocked_for_local_cv_camera_aids_plan_gate",
      ...blockers,
      "planning_phase_no_local_cv_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmLocalCvCameraAidsPlanGateReportRedacted(report);
  if (!redaction.ok) {
    report.localCvPlanEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_local_cv_camera_aids_plan_gate",
      ...report.blockers,
      "planning_phase_no_local_cv_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmLocalCvCameraAidsPlanGateSamples() {
  const valid = evaluateOpenWeightVlmLocalCvCameraAidsPlanGate(
    localCvCameraAidsPlanReadyPolicy()
  );
  const blocked = evaluateOpenWeightVlmLocalCvCameraAidsPlanGate({
    ...localCvCameraAidsPlanReadyPolicy(),
    localCvRuntimeEnabled: true,
    gridAlignmentRuntimeEnabled: true,
    horizonLevelRuntimeEnabled: true,
    exposureWarningRuntimeEnabled: true,
    motionStabilityRuntimeEnabled: true,
    cameraCloudEntryEnabled: true,
    uploadRuntimeEnabled: true,
    productionReady: true
  });
  const blockers = valid.localCvPlanEligible && !blocked.localCvPlanEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_CV_CAMERA_AIDS_PLAN_GATE_SCHEMA_VERSION,
    localCvRuntimeEnabled: false,
    gridAlignmentRuntimeEnabled: false,
    horizonLevelRuntimeEnabled: false,
    exposureWarningRuntimeEnabled: false,
    motionStabilityRuntimeEnabled: false,
    cameraCloudEntryEnabled: false,
    uploadRuntimeEnabled: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    localOnlyRequired: true,
    noBackendCallRequired: true,
    noUploadRequired: true,
    noRawFramePersistenceRequired: true,
    noRawSensorPersistenceRequired: true,
    noGpsPersistenceRequired: true,
    noRawExifPersistenceRequired: true,
    cameraSmoothnessTargetBucket: valid.cameraSmoothnessTargetBucket,
    autoTriggerRelationshipBucket: valid.autoTriggerRelationshipBucket,
    cloudVlmRelationshipBucket: valid.cloudVlmRelationshipBucket,
    productionReady: false,
    localCvPlanEligible: blockers.length === 0,
    blockers,
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.localCvPlanEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.localCvPlanEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    networkCallsMade: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_local_cv_camera_aids_plan_gate"
        : "blocked_for_local_cv_camera_aids_plan_gate",
      ...blockers,
      "planning_phase_no_local_cv_runtime",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmLocalCvCameraAidsPlanGateReportRedacted(report);
  if (!redaction.ok) {
    report.localCvPlanEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_local_cv_camera_aids_plan_gate",
      ...report.blockers,
      "planning_phase_no_local_cv_runtime",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmLocalCvCameraAidsPlanGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "local_cv_camera_aids_plan_gate_not_redacted",
        message: "Local CV camera aids plan gate report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function runtimeFlagBlockers(policy) {
  const blockers = [];
  for (const [field, code] of [
    ["localCvRuntimeEnabled", "blocked_for_local_cv_runtime_enabled"],
    ["gridAlignmentRuntimeEnabled", "blocked_for_grid_alignment_runtime_enabled"],
    ["horizonLevelRuntimeEnabled", "blocked_for_horizon_level_runtime_enabled"],
    ["exposureWarningRuntimeEnabled", "blocked_for_exposure_warning_runtime_enabled"],
    ["motionStabilityRuntimeEnabled", "blocked_for_motion_stability_runtime_enabled"],
    ["cameraCloudEntryEnabled", "blocked_for_camera_cloud_entry_enabled"],
    ["uploadRuntimeEnabled", "blocked_for_upload_runtime_enabled"]
  ]) {
    if (policy[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function localOnlyBlockers(policy) {
  const blockers = [];
  if (policy.localOnlyRequired !== true) {
    blockers.push("blocked_for_missing_local_only_requirement");
  }
  if (policy.noBackendCallRequired !== true) {
    blockers.push("blocked_for_backend_call_allowed");
  }
  if (policy.noUploadRequired !== true) {
    blockers.push("blocked_for_upload_allowed");
  }
  return blockers;
}

function privacyPersistenceBlockers(policy) {
  const blockers = [];
  if (policy.noRawFramePersistenceRequired !== true) {
    blockers.push("blocked_for_raw_frame_persistence");
  }
  if (policy.noRawSensorPersistenceRequired !== true) {
    blockers.push("blocked_for_raw_sensor_persistence");
  }
  if (policy.noGpsPersistenceRequired !== true) {
    blockers.push("blocked_for_gps_persistence");
  }
  if (policy.noRawExifPersistenceRequired !== true) {
    blockers.push("blocked_for_raw_exif_persistence");
  }
  return blockers;
}

function relationshipBlockers(policy) {
  const blockers = [];
  if (policy.cameraSmoothnessTargetBucket !== "target_60fps_smooth_preview") {
    blockers.push("blocked_for_missing_camera_smoothness_target");
  }
  if (policy.autoTriggerRelationshipBucket !== "bucketed_signal_only_future_auto_trigger") {
    blockers.push("blocked_for_missing_auto_trigger_relationship");
  }
  if (policy.cloudVlmRelationshipBucket !== "high_level_only_after_consent_trigger_upload_gates") {
    blockers.push("blocked_for_missing_cloud_vlm_boundary");
  }
  return blockers;
}

function iosBoundaryBlockers(policy) {
  if (policy.providerFieldsAllowedInIos === true) {
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
    const serialized = String(value);
    if (FORBIDDEN_PROBE_VALUE_SNIPPETS.some((snippet) => serialized.includes(snippet))) {
      blockers.push("blocked_for_committed_raw_cv_plan_value");
    }
  }
  return blockers;
}

function sanitizeToken(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .slice(0, 80) || "unknown";
}

function unique(values) {
  return [...new Set(values)];
}
