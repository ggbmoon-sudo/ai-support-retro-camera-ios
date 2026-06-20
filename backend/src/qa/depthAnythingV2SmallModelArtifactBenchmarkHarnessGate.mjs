export const DEPTH_ANYTHING_V2_SMALL_MODEL_ARTIFACT_BENCHMARK_HARNESS_GATE_SCHEMA_VERSION =
  "depth_anything_v2_small_model_artifact_benchmark_harness_gate.v1";

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "data:image",
  "/9j/",
  ".jpg",
  ".jpeg",
  ".png",
  ".heic",
  ".mov",
  ".mlmodel",
  ".mlmodelc",
  ".mlpackage",
  ".onnx",
  ".tflite",
  ".safetensors",
  ".pth",
  ".pt",
  ".bin",
  "CVPixelBuffer",
  "AVDepthData(",
  "Authorization",
  "Bearer ",
  "SILICONFLOW_API_KEY",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "secret_value",
  "provider_key_value"
]);

const REQUIRED_METRICS = Object.freeze([
  "model_load_time_bucket",
  "first_inference_latency_bucket",
  "warmed_inference_latency_bucket",
  "peak_memory_bucket",
  "preview_fps_impact_bucket",
  "thermal_state_bucket",
  "battery_drain_bucket",
  "depth_stability_bucket",
  "invalid_output_rate_bucket",
  "app_size_increase_bucket"
]);

const APPROVED_INPUT_SIZE_BUCKETS = new Set([
  "short_side_256",
  "short_side_384",
  "model_native_518_debug_only"
]);

export function depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy() {
  return {
    schemaVersion: DEPTH_ANYTHING_V2_SMALL_MODEL_ARTIFACT_BENCHMARK_HARNESS_GATE_SCHEMA_VERSION,
    phase: "Phase 21-C-R1",
    gateClass: "depth_anything_model_artifact_source_and_xcode_benchmark_harness_approval_gate",
    implementationTarget: "ios_coreml_debug_only",
    sourceCandidateBucket: "apple_coreml_depth_anything_v2_small_needs_operator_verification",
    sourceUrlRecorded: false,
    sourceVerificationRequired: true,
    licenseReviewRequired: true,
    modelCardReviewRequired: true,
    modelArtifactAdded: false,
    modelArtifactCommitted: false,
    modelDownloadAutomated: false,
    coreMlPackageAdded: false,
    coreMlRuntimeEnabled: false,
    depthAnythingInferenceRun: false,
    benchmarkRun: false,
    providerOrNetworkCallMade: false,
    xcodeHarnessAdded: false,
    cameraRuntimeIntegrated: false,
    previewFrameUploadEnabled: false,
    uploadPayloadChanged: false,
    cameraLiveCloudEntryAdded: false,
    iOSProviderKeyAdded: false,
    rawFrameLoggingAllowed: false,
    rawDepthLoggingAllowed: false,
    rawImagePersistenceAllowed: false,
    rawDepthPersistenceAllowed: false,
    rawPathLoggingAllowed: false,
    sensitiveInferenceAllowed: false,
    productionReady: false,
    localArtifactPolicy: {
      artifactMustBeIgnored: true,
      artifactCommitAllowed: false,
      artifactPathLoggingAllowed: false,
      automatedDownloadAllowed: false,
      checksumBucketRequired: true,
      licenseBucketRequired: true
    },
    xcodeBenchmarkHarnessPlan: {
      xcodeDeviceRunRequired: true,
      simulatorBenchmarkAccepted: false,
      hardwareDepthFirstRequired: true,
      sanitizedAggregateOnly: true,
      inputSizeBuckets: [
        "short_side_256",
        "short_side_384",
        "model_native_518_debug_only"
      ],
      requiredMetricBuckets: [...REQUIRED_METRICS],
      deviceTierBuckets: [
        "tier_1_vision_only_low_fps",
        "tier_2_vision_hardware_depth",
        "tier_3_depth_anything_fallback_candidate",
        "tier_4_experimental_debug_only"
      ],
      stopConditionBuckets: [
        "thermal_serious_or_critical",
        "low_power_mode_enabled",
        "memory_warning",
        "preview_fps_regression",
        "raw_artifact_risk",
        "production_ready_true"
      ]
    },
    probeValues: []
  };
}

export function evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate(
  policy = depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy()
) {
  const blockers = unique([
    ...reviewRequirementBlockers(policy),
    ...artifactRuntimeBlockers(policy),
    ...boundaryBlockers(policy),
    ...privacyBlockers(policy),
    ...localArtifactPolicyBlockers(policy.localArtifactPolicy || {}),
    ...harnessPlanBlockers(policy.xcodeBenchmarkHarnessPlan || {}),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: DEPTH_ANYTHING_V2_SMALL_MODEL_ARTIFACT_BENCHMARK_HARNESS_GATE_SCHEMA_VERSION,
    phase: sanitizeToken(policy.phase || "unknown"),
    gateClass: sanitizeToken(policy.gateClass || "unknown"),
    implementationTarget: sanitizeToken(policy.implementationTarget || "unknown"),
    sourceCandidateBucket: sanitizeToken(policy.sourceCandidateBucket || "unknown"),
    sourceUrlRecorded: policy.sourceUrlRecorded === true,
    sourceVerificationRequired: policy.sourceVerificationRequired === true,
    licenseReviewRequired: policy.licenseReviewRequired === true,
    modelCardReviewRequired: policy.modelCardReviewRequired === true,
    modelArtifactAdded: policy.modelArtifactAdded === true,
    modelArtifactCommitted: policy.modelArtifactCommitted === true,
    modelDownloadAutomated: policy.modelDownloadAutomated === true,
    coreMlPackageAdded: policy.coreMlPackageAdded === true,
    coreMlRuntimeEnabled: policy.coreMlRuntimeEnabled === true,
    depthAnythingInferenceRun: policy.depthAnythingInferenceRun === true,
    benchmarkRun: policy.benchmarkRun === true,
    xcodeHarnessAdded: policy.xcodeHarnessAdded === true,
    cameraRuntimeIntegrated: policy.cameraRuntimeIntegrated === true,
    previewFrameUploadEnabled: policy.previewFrameUploadEnabled === true,
    uploadPayloadChanged: policy.uploadPayloadChanged === true,
    cameraLiveCloudEntryAdded: policy.cameraLiveCloudEntryAdded === true,
    iOSProviderKeyAdded: policy.iOSProviderKeyAdded === true,
    rawFrameLoggingAllowed: policy.rawFrameLoggingAllowed === true,
    rawDepthLoggingAllowed: policy.rawDepthLoggingAllowed === true,
    rawImagePersistenceAllowed: policy.rawImagePersistenceAllowed === true,
    rawDepthPersistenceAllowed: policy.rawDepthPersistenceAllowed === true,
    rawPathLoggingAllowed: policy.rawPathLoggingAllowed === true,
    sensitiveInferenceAllowed: policy.sensitiveInferenceAllowed === true,
    localArtifactPolicy: summarizeLocalArtifactPolicy(policy.localArtifactPolicy || {}),
    xcodeBenchmarkHarnessPlan: summarizeHarnessPlan(policy.xcodeBenchmarkHarnessPlan || {}),
    artifactHarnessGateEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_depth_anything_artifact_harness_gate"
        : "blocked_for_depth_anything_artifact_harness_gate",
      ...blockers,
      "approval_gate_only",
      "no_model_artifact_added",
      "no_model_download",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ])
  };

  const redaction = assertDepthAnythingV2SmallModelArtifactBenchmarkHarnessReportRedacted(report);
  if (!redaction.ok) {
    report.artifactHarnessGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_depth_anything_artifact_harness_gate",
      ...report.blockers,
      "approval_gate_only",
      "no_model_artifact_added",
      "no_model_download",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGateSamples() {
  const valid = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate(
    depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy()
  );
  const blocked = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate({
    ...depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy(),
    modelArtifactAdded: true,
    modelArtifactCommitted: true,
    modelDownloadAutomated: true,
    coreMlPackageAdded: true,
    coreMlRuntimeEnabled: true,
    depthAnythingInferenceRun: true,
    benchmarkRun: true,
    productionReady: true
  });
  const blockers = valid.artifactHarnessGateEligible && !blocked.artifactHarnessGateEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: DEPTH_ANYTHING_V2_SMALL_MODEL_ARTIFACT_BENCHMARK_HARNESS_GATE_SCHEMA_VERSION,
    phase: "Phase 21-C-R1",
    gateClass: "depth_anything_model_artifact_source_and_xcode_benchmark_harness_approval_gate",
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.artifactHarnessGateEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.artifactHarnessGateEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    sourceCandidateBucket: valid.sourceCandidateBucket,
    localArtifactPolicy: valid.localArtifactPolicy,
    xcodeBenchmarkHarnessPlan: valid.xcodeBenchmarkHarnessPlan,
    artifactHarnessGateEligible: blockers.length === 0,
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_depth_anything_artifact_harness_gate"
        : "blocked_for_depth_anything_artifact_harness_gate",
      ...blockers,
      "approval_gate_only",
      "no_model_artifact_added",
      "no_model_download",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ])
  };

  const redaction = assertDepthAnythingV2SmallModelArtifactBenchmarkHarnessReportRedacted(report);
  if (!redaction.ok) {
    report.artifactHarnessGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_depth_anything_artifact_harness_gate",
      ...report.blockers,
      "approval_gate_only",
      "no_model_artifact_added",
      "no_model_download",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertDepthAnythingV2SmallModelArtifactBenchmarkHarnessReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      leakBucket: sanitizedLeakBucket(leak)
    };
  }

  return {
    ok: true,
    leakBucket: null
  };
}

function reviewRequirementBlockers(policy) {
  const blockers = [];
  if (policy.sourceUrlRecorded === true) blockers.push("blocked_for_source_url_recorded");
  if (policy.sourceVerificationRequired !== true) blockers.push("blocked_for_missing_source_verification_requirement");
  if (policy.licenseReviewRequired !== true) blockers.push("blocked_for_missing_license_review_requirement");
  if (policy.modelCardReviewRequired !== true) blockers.push("blocked_for_missing_model_card_review_requirement");
  return blockers;
}

function artifactRuntimeBlockers(policy) {
  const blockers = [];
  if (policy.modelArtifactAdded === true) blockers.push("blocked_for_model_artifact_added_in_gate");
  if (policy.modelArtifactCommitted === true) blockers.push("blocked_for_model_artifact_committed");
  if (policy.modelDownloadAutomated === true) blockers.push("blocked_for_automated_model_download");
  if (policy.coreMlPackageAdded === true) blockers.push("blocked_for_coreml_package_added");
  if (policy.coreMlRuntimeEnabled === true) blockers.push("blocked_for_coreml_runtime_enabled");
  if (policy.depthAnythingInferenceRun === true) blockers.push("blocked_for_depth_anything_inference_run");
  if (policy.benchmarkRun === true) blockers.push("blocked_for_benchmark_run");
  if (policy.providerOrNetworkCallMade === true) blockers.push("blocked_for_network_or_provider_call");
  if (policy.xcodeHarnessAdded === true) blockers.push("blocked_for_xcode_harness_added_in_approval_gate");
  return blockers;
}

function boundaryBlockers(policy) {
  const blockers = [];
  if (policy.cameraRuntimeIntegrated === true) blockers.push("blocked_for_camera_runtime_integration");
  if (policy.previewFrameUploadEnabled === true) blockers.push("blocked_for_preview_frame_upload");
  if (policy.uploadPayloadChanged === true) blockers.push("blocked_for_upload_payload_change");
  if (policy.cameraLiveCloudEntryAdded === true) blockers.push("blocked_for_camera_live_cloud_entry");
  if (policy.iOSProviderKeyAdded === true) blockers.push("blocked_for_ios_provider_key");
  return blockers;
}

function privacyBlockers(policy) {
  const blockers = [];
  if (policy.rawFrameLoggingAllowed === true) blockers.push("blocked_for_raw_frame_logging");
  if (policy.rawDepthLoggingAllowed === true) blockers.push("blocked_for_raw_depth_logging");
  if (policy.rawImagePersistenceAllowed === true) blockers.push("blocked_for_raw_image_persistence");
  if (policy.rawDepthPersistenceAllowed === true) blockers.push("blocked_for_raw_depth_persistence");
  if (policy.rawPathLoggingAllowed === true) blockers.push("blocked_for_raw_path_logging");
  if (policy.sensitiveInferenceAllowed === true) blockers.push("blocked_for_sensitive_inference");
  return blockers;
}

function localArtifactPolicyBlockers(policy) {
  const blockers = [];
  if (policy.artifactMustBeIgnored !== true) blockers.push("blocked_for_missing_ignored_artifact_policy");
  if (policy.artifactCommitAllowed === true) blockers.push("blocked_for_artifact_commit_allowed");
  if (policy.artifactPathLoggingAllowed === true) blockers.push("blocked_for_artifact_path_logging_allowed");
  if (policy.automatedDownloadAllowed === true) blockers.push("blocked_for_automated_download_allowed");
  if (policy.checksumBucketRequired !== true) blockers.push("blocked_for_missing_checksum_bucket_requirement");
  if (policy.licenseBucketRequired !== true) blockers.push("blocked_for_missing_license_bucket_requirement");
  return blockers;
}

function harnessPlanBlockers(plan) {
  const blockers = [];
  if (plan.xcodeDeviceRunRequired !== true) blockers.push("blocked_for_missing_xcode_device_requirement");
  if (plan.simulatorBenchmarkAccepted === true) blockers.push("blocked_for_simulator_benchmark_acceptance");
  if (plan.hardwareDepthFirstRequired !== true) blockers.push("blocked_for_missing_hardware_depth_first_requirement");
  if (plan.sanitizedAggregateOnly !== true) blockers.push("blocked_for_missing_sanitized_aggregate_policy");

  const inputSizeBuckets = plan.inputSizeBuckets || [];
  if (!Array.isArray(inputSizeBuckets) || inputSizeBuckets.length === 0) {
    blockers.push("blocked_for_missing_input_size_buckets");
  } else if (inputSizeBuckets.some((bucket) => !APPROVED_INPUT_SIZE_BUCKETS.has(bucket))) {
    blockers.push("blocked_for_unapproved_input_size_bucket");
  }

  const metrics = new Set(plan.requiredMetricBuckets || []);
  const missingMetrics = REQUIRED_METRICS.filter((metric) => !metrics.has(metric));
  if (missingMetrics.length > 0) {
    blockers.push("blocked_for_missing_required_metric_buckets");
  }

  if (!Array.isArray(plan.deviceTierBuckets) || plan.deviceTierBuckets.length === 0) {
    blockers.push("blocked_for_missing_device_tier_buckets");
  }

  if (!Array.isArray(plan.stopConditionBuckets) || plan.stopConditionBuckets.length === 0) {
    blockers.push("blocked_for_missing_stop_condition_buckets");
  }

  return blockers;
}

function probeValueBlockers(values) {
  return values.flatMap((value) => {
    const serialized = JSON.stringify(value);
    const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
    return leak ? [`blocked_for_probe_value_leak_${sanitizedLeakBucket(leak)}`] : [];
  });
}

function summarizeLocalArtifactPolicy(policy) {
  return {
    artifactMustBeIgnored: policy.artifactMustBeIgnored === true,
    artifactCommitAllowed: policy.artifactCommitAllowed === true,
    artifactPathLoggingAllowed: policy.artifactPathLoggingAllowed === true,
    automatedDownloadAllowed: policy.automatedDownloadAllowed === true,
    checksumBucketRequired: policy.checksumBucketRequired === true,
    licenseBucketRequired: policy.licenseBucketRequired === true
  };
}

function summarizeHarnessPlan(plan) {
  return {
    xcodeDeviceRunRequired: plan.xcodeDeviceRunRequired === true,
    simulatorBenchmarkAccepted: plan.simulatorBenchmarkAccepted === true,
    hardwareDepthFirstRequired: plan.hardwareDepthFirstRequired === true,
    sanitizedAggregateOnly: plan.sanitizedAggregateOnly === true,
    inputSizeBuckets: sanitizeStringArray(plan.inputSizeBuckets || []),
    requiredMetricBuckets: sanitizeStringArray(plan.requiredMetricBuckets || []),
    deviceTierBuckets: sanitizeStringArray(plan.deviceTierBuckets || []),
    stopConditionBuckets: sanitizeStringArray(plan.stopConditionBuckets || [])
  };
}

function sanitizeStringArray(values) {
  return values.map((value) => sanitizeToken(String(value)));
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 96);
}

function sanitizedLeakBucket(snippet) {
  if (snippet.includes("API_KEY") || snippet === "Authorization" || snippet === "Bearer ") {
    return "secret_or_auth_header";
  }
  if (snippet.includes(".ml") || snippet.includes(".onnx") || snippet.includes(".tflite")) {
    return "model_artifact_reference";
  }
  if (snippet.includes(".jpg") || snippet.includes(".png") || snippet.includes(".heic")) {
    return "image_artifact_reference";
  }
  if (snippet.includes("raw") || snippet.includes("CVPixelBuffer") || snippet.includes("AVDepthData")) {
    return "raw_artifact_reference";
  }
  if (snippet.includes("http") || snippet.includes("data:image")) {
    return "url_or_base64_reference";
  }
  return "local_path_or_unsafe_reference";
}

function unique(values) {
  return [...new Set(values)];
}
