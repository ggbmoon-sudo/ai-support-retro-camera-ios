export const DEPTH_ANYTHING_V2_SMALL_COREML_SANDBOX_PREFLIGHT_SCHEMA_VERSION =
  "depth_anything_v2_small_coreml_sandbox_preflight.v1";

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
  ".mlpackage",
  ".coreml",
  ".onnx",
  ".tflite",
  ".pt",
  ".pth",
  ".safetensors",
  ".bin",
  ".gguf",
  "CVPixelBuffer",
  "AVDepthData(",
  "rawPrompt",
  "requestPayload",
  "rawProviderResponse",
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

const REQUIRED_FUTURE_GATES = Object.freeze([
  "benchmarkRequired",
  "thermalGateRequired",
  "fpsGateRequired",
  "memoryGateRequired",
  "batteryGateRequired"
]);

const ALLOWED_FRAME_SOURCE_BUCKETS = new Set([
  "debug_resized_preview_frame",
  "debug_still_frame"
]);

export function depthAnythingV2SmallCoreMlSandboxPreflightPolicy() {
  return {
    schemaVersion: DEPTH_ANYTHING_V2_SMALL_COREML_SANDBOX_PREFLIGHT_SCHEMA_VERSION,
    phase: "Phase OD-03A",
    sandboxClass: "depth_anything_v2_small_coreml_debug_benchmark_preflight",
    implementationTarget: "ios_coreml_debug_only",
    hardwareDepthPriority: true,
    hardwareDepthFirstRequired: true,
    phase21BDepthProbeRequired: true,
    debugOnly: true,
    benchmarkRequired: true,
    thermalGateRequired: true,
    fpsGateRequired: true,
    memoryGateRequired: true,
    batteryGateRequired: true,
    safetySensitiveInferenceBlocked: true,
    modelFileAdded: false,
    modelFilesBundled: false,
    coreMlPackageAdded: false,
    runtimeInferenceEnabled: false,
    coreMlRuntimeEnabled: false,
    modelDownloadEnabled: false,
    cameraPreviewIntegrationEnabled: false,
    liveFrameProcessingEnabled: false,
    depthAnythingInferenceRun: false,
    benchmarkRun: false,
    networkCallsMade: false,
    modelCallsMade: false,
    providerOrNetworkCallMade: false,
    iOSProviderKeyAdded: false,
    cameraLiveCloudEntryAdded: false,
    uploadPayloadChanged: false,
    previewFrameUploadEnabled: false,
    rawFramePersistence: false,
    rawDepthMapPersistence: false,
    rawFrameLoggingAllowed: false,
    rawDepthLoggingAllowed: false,
    rawImagePersistenceAllowed: false,
    rawDepthPersistenceAllowed: false,
    sensitiveInferenceAllowed: false,
    productionReady: false,
    explicitSandboxApprovalRequired: true,
    explicitSandboxApprovalRecorded: true,
    benchmarkPlan: {
      frameSourceBucket: "debug_resized_preview_frame",
      cadenceBucket: "debug_low_frequency_only",
      inputSizeBuckets: ["256", "384", "518_debug_only"],
      metrics: [...REQUIRED_METRICS],
      deviceTiers: [
        "tier_1_vision_only_low_fps",
        "tier_2_vision_hardware_depth",
        "tier_3_depth_anything_fallback_candidate",
        "tier_4_experimental_debug_only"
      ],
      passFailGatesDefined: true,
      xcodeDeviceRunRequired: true,
      sanitizedAggregateOnly: true
    },
    probeValues: []
  };
}

export function evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate(
  policy = depthAnythingV2SmallCoreMlSandboxPreflightPolicy()
) {
  const blockers = unique([
    ...approvalBlockers(policy),
    ...runtimeBlockers(policy),
    ...boundaryBlockers(policy),
    ...privacyBlockers(policy),
    ...benchmarkPlanBlockers(policy.benchmarkPlan || {}),
    ...probeValueBlockers(policy.probeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: DEPTH_ANYTHING_V2_SMALL_COREML_SANDBOX_PREFLIGHT_SCHEMA_VERSION,
    phase: sanitizeToken(policy.phase || "unknown"),
    sandboxClass: sanitizeToken(policy.sandboxClass || "unknown"),
    implementationTarget: sanitizeToken(policy.implementationTarget || "unknown"),
    hardwareDepthPriority: policy.hardwareDepthPriority === true,
    hardwareDepthFirstRequired: policy.hardwareDepthFirstRequired === true,
    phase21BDepthProbeRequired: policy.phase21BDepthProbeRequired === true,
    debugOnly: policy.debugOnly === true,
    benchmarkRequired: policy.benchmarkRequired === true,
    thermalGateRequired: policy.thermalGateRequired === true,
    fpsGateRequired: policy.fpsGateRequired === true,
    memoryGateRequired: policy.memoryGateRequired === true,
    batteryGateRequired: policy.batteryGateRequired === true,
    safetySensitiveInferenceBlocked: policy.safetySensitiveInferenceBlocked === true,
    explicitSandboxApprovalRequired: policy.explicitSandboxApprovalRequired === true,
    explicitSandboxApprovalRecorded: policy.explicitSandboxApprovalRecorded === true,
    modelFileAdded: policy.modelFileAdded === true,
    modelFilesBundled: policy.modelFilesBundled === true,
    coreMlPackageAdded: policy.coreMlPackageAdded === true,
    runtimeInferenceEnabled: policy.runtimeInferenceEnabled === true,
    coreMlRuntimeEnabled: policy.coreMlRuntimeEnabled === true,
    modelDownloadEnabled: policy.modelDownloadEnabled === true,
    cameraPreviewIntegrationEnabled: policy.cameraPreviewIntegrationEnabled === true,
    liveFrameProcessingEnabled: policy.liveFrameProcessingEnabled === true,
    depthAnythingInferenceRun: policy.depthAnythingInferenceRun === true,
    benchmarkRun: policy.benchmarkRun === true,
    networkCallsMade: policy.networkCallsMade === true,
    modelCallsMade: policy.modelCallsMade === true,
    providerOrNetworkCallMade: policy.providerOrNetworkCallMade === true,
    iOSProviderKeyAdded: policy.iOSProviderKeyAdded === true,
    cameraLiveCloudEntryAdded: policy.cameraLiveCloudEntryAdded === true,
    uploadPayloadChanged: policy.uploadPayloadChanged === true,
    previewFrameUploadEnabled: policy.previewFrameUploadEnabled === true,
    rawFramePersistence: policy.rawFramePersistence === true,
    rawDepthMapPersistence: policy.rawDepthMapPersistence === true,
    rawFrameLoggingAllowed: policy.rawFrameLoggingAllowed === true,
    rawDepthLoggingAllowed: policy.rawDepthLoggingAllowed === true,
    rawImagePersistenceAllowed: policy.rawImagePersistenceAllowed === true,
    rawDepthPersistenceAllowed: policy.rawDepthPersistenceAllowed === true,
    sensitiveInferenceAllowed: policy.sensitiveInferenceAllowed === true,
    benchmarkPlan: summarizeBenchmarkPlan(policy.benchmarkPlan || {}),
    sandboxPreflightEligible: blockers.length === 0,
    eligibleForFutureBenchmark: blockers.length === 0,
    blockers,
    blockedReasons: blockers,
    requiredFutureGates: [...REQUIRED_FUTURE_GATES],
    productionReady: policy.productionReady === true,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_depth_anything_v2_small_coreml_sandbox_preflight"
        : "blocked_for_depth_anything_v2_small_coreml_sandbox_preflight",
      ...blockers,
      "no_model_file_added",
      "no_coreml_runtime_added",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ])
  };

  const redaction = assertDepthAnythingV2SmallCoreMlSandboxPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.sandboxPreflightEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_depth_anything_v2_small_coreml_sandbox_preflight",
      ...report.blockers,
      "no_model_file_added",
      "no_coreml_runtime_added",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGateSamples() {
  const valid = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate(
    depthAnythingV2SmallCoreMlSandboxPreflightPolicy()
  );
  const blocked = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    modelFileAdded: true,
    modelFilesBundled: true,
    coreMlPackageAdded: true,
    runtimeInferenceEnabled: true,
    coreMlRuntimeEnabled: true,
    modelDownloadEnabled: true,
    cameraPreviewIntegrationEnabled: true,
    liveFrameProcessingEnabled: true,
    depthAnythingInferenceRun: true,
    benchmarkRun: true,
    productionReady: true
  });
  const blockers = valid.sandboxPreflightEligible && !blocked.sandboxPreflightEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: DEPTH_ANYTHING_V2_SMALL_COREML_SANDBOX_PREFLIGHT_SCHEMA_VERSION,
    phase: "Phase OD-03A",
    sandboxClass: "depth_anything_v2_small_coreml_debug_benchmark_preflight",
    implementationTarget: "ios_coreml_debug_only",
    reviewedPolicyCount: 2,
    eligiblePolicyCount: valid.sandboxPreflightEligible ? 1 : 0,
    expectedBlockedPolicyCount: blocked.sandboxPreflightEligible ? 0 : 1,
    expectedBlockedReasons: blocked.blockers,
    benchmarkPlan: valid.benchmarkPlan,
    sandboxPreflightEligible: blockers.length === 0,
    eligibleForFutureBenchmark: blockers.length === 0,
    blockers,
    blockedReasons: blockers,
    requiredFutureGates: [...REQUIRED_FUTURE_GATES],
    networkCallsMade: false,
    modelCallsMade: false,
    runtimeInferenceEnabled: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_depth_anything_v2_small_coreml_sandbox_preflight"
        : "blocked_for_depth_anything_v2_small_coreml_sandbox_preflight",
      ...blockers,
      "no_model_file_added",
      "no_coreml_runtime_added",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ])
  };

  const redaction = assertDepthAnythingV2SmallCoreMlSandboxPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.sandboxPreflightEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_depth_anything_v2_small_coreml_sandbox_preflight",
      ...report.blockers,
      "no_model_file_added",
      "no_coreml_runtime_added",
      "no_depth_anything_inference_run",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertDepthAnythingV2SmallCoreMlSandboxPreflightReportRedacted(report = {}) {
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

function approvalBlockers(policy) {
  const blockers = [];
  if (policy.explicitSandboxApprovalRequired !== true) {
    blockers.push("blocked_for_missing_explicit_sandbox_approval_requirement");
  }
  if (policy.explicitSandboxApprovalRecorded !== true) {
    blockers.push("blocked_pending_explicit_sandbox_approval");
  }
  return blockers;
}

function runtimeBlockers(policy) {
  const blockers = [];
  if (policy.modelFileAdded === true) blockers.push("blocked_for_model_file_added_in_preflight");
  if (policy.modelFilesBundled === true) blockers.push("blocked_for_model_file_bundled_in_preflight");
  if (policy.coreMlPackageAdded === true) blockers.push("blocked_for_coreml_package_added_in_preflight");
  if (policy.runtimeInferenceEnabled === true) blockers.push("blocked_for_runtime_inference_enabled_in_preflight");
  if (policy.coreMlRuntimeEnabled === true) blockers.push("blocked_for_coreml_runtime_enabled_in_preflight");
  if (policy.modelDownloadEnabled === true) blockers.push("blocked_for_model_download_enabled_in_preflight");
  if (policy.cameraPreviewIntegrationEnabled === true) blockers.push("blocked_for_camera_preview_integration_enabled_in_preflight");
  if (policy.liveFrameProcessingEnabled === true) blockers.push("blocked_for_live_frame_processing_enabled_in_preflight");
  if (policy.depthAnythingInferenceRun === true) blockers.push("blocked_for_depth_anything_inference_run_in_preflight");
  if (policy.benchmarkRun === true) blockers.push("blocked_for_benchmark_run_in_preflight");
  if (policy.networkCallsMade === true) blockers.push("blocked_for_network_call");
  if (policy.modelCallsMade === true) blockers.push("blocked_for_model_call");
  if (policy.providerOrNetworkCallMade === true) blockers.push("blocked_for_network_or_provider_call");
  return blockers;
}

function boundaryBlockers(policy) {
  const blockers = [];
  if (policy.hardwareDepthPriority !== true) blockers.push("blocked_for_missing_hardware_depth_priority");
  if (policy.hardwareDepthFirstRequired !== true) blockers.push("blocked_for_missing_hardware_depth_first_policy");
  if (policy.phase21BDepthProbeRequired !== true) blockers.push("blocked_for_missing_phase_21_b_depth_probe_dependency");
  if (policy.debugOnly !== true) blockers.push("blocked_for_missing_debug_only_policy");
  if (policy.benchmarkRequired !== true) blockers.push("blocked_for_missing_benchmark_requirement");
  if (policy.thermalGateRequired !== true) blockers.push("blocked_for_missing_thermal_gate_requirement");
  if (policy.fpsGateRequired !== true) blockers.push("blocked_for_missing_fps_gate_requirement");
  if (policy.memoryGateRequired !== true) blockers.push("blocked_for_missing_memory_gate_requirement");
  if (policy.batteryGateRequired !== true) blockers.push("blocked_for_missing_battery_gate_requirement");
  if (policy.safetySensitiveInferenceBlocked !== true) blockers.push("blocked_for_missing_sensitive_inference_block");
  if (policy.iOSProviderKeyAdded === true) blockers.push("blocked_for_ios_provider_key");
  if (policy.cameraLiveCloudEntryAdded === true) blockers.push("blocked_for_camera_live_cloud_entry");
  if (policy.uploadPayloadChanged === true) blockers.push("blocked_for_upload_payload_change");
  if (policy.previewFrameUploadEnabled === true) blockers.push("blocked_for_preview_frame_upload");
  return blockers;
}

function privacyBlockers(policy) {
  const blockers = [];
  if (policy.rawFramePersistence === true) blockers.push("blocked_for_raw_frame_persistence");
  if (policy.rawDepthMapPersistence === true) blockers.push("blocked_for_raw_depth_map_persistence");
  if (policy.rawFrameLoggingAllowed === true) blockers.push("blocked_for_raw_frame_logging");
  if (policy.rawDepthLoggingAllowed === true) blockers.push("blocked_for_raw_depth_logging");
  if (policy.rawImagePersistenceAllowed === true) blockers.push("blocked_for_raw_image_persistence");
  if (policy.rawDepthPersistenceAllowed === true) blockers.push("blocked_for_raw_depth_persistence");
  if (policy.sensitiveInferenceAllowed === true) blockers.push("blocked_for_sensitive_inference");
  return blockers;
}

function benchmarkPlanBlockers(plan) {
  const blockers = [];
  if (!ALLOWED_FRAME_SOURCE_BUCKETS.has(plan.frameSourceBucket)) {
    blockers.push("blocked_for_unapproved_frame_source_bucket");
  }
  if (plan.cadenceBucket !== "debug_low_frequency_only") {
    blockers.push("blocked_for_unapproved_cadence_bucket");
  }
  if (!Array.isArray(plan.inputSizeBuckets) || plan.inputSizeBuckets.length === 0) {
    blockers.push("blocked_for_missing_input_size_buckets");
  }
  const metrics = new Set(plan.metrics || []);
  const missingMetrics = REQUIRED_METRICS.filter((metric) => !metrics.has(metric));
  if (missingMetrics.length > 0) {
    blockers.push("blocked_for_missing_benchmark_metrics");
  }
  if (plan.passFailGatesDefined !== true) {
    blockers.push("blocked_for_missing_pass_fail_gates");
  }
  if (plan.xcodeDeviceRunRequired !== true) {
    blockers.push("blocked_for_missing_xcode_device_run_requirement");
  }
  if (plan.sanitizedAggregateOnly !== true) {
    blockers.push("blocked_for_missing_sanitized_aggregate_policy");
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

function summarizeBenchmarkPlan(plan) {
  return {
    frameSourceBucket: sanitizeToken(plan.frameSourceBucket || "unknown"),
    cadenceBucket: sanitizeToken(plan.cadenceBucket || "unknown"),
    inputSizeBuckets: sanitizeStringArray(plan.inputSizeBuckets || []),
    metrics: sanitizeStringArray(plan.metrics || []),
    deviceTiers: sanitizeStringArray(plan.deviceTiers || []),
    passFailGatesDefined: plan.passFailGatesDefined === true,
    xcodeDeviceRunRequired: plan.xcodeDeviceRunRequired === true,
    sanitizedAggregateOnly: plan.sanitizedAggregateOnly === true
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
  if (snippet.includes("raw") || snippet.includes("CVPixelBuffer") || snippet.includes("AVDepthData")) {
    return "raw_artifact_reference";
  }
  if (snippet.includes("http") || snippet.includes("data:image")) {
    return "url_or_base64_reference";
  }
  if (
    snippet.includes(".ml") ||
    snippet.includes(".onnx") ||
    snippet.includes(".tflite") ||
    snippet.includes(".pt") ||
    snippet.includes(".pth") ||
    snippet.includes(".safetensors") ||
    snippet.includes(".bin") ||
    snippet.includes(".gguf")
  ) {
    return "model_artifact_reference";
  }
  if (snippet.includes(".jpg") || snippet.includes(".png") || snippet.includes(".heic")) {
    return "image_artifact_reference";
  }
  return "local_path_or_unsafe_reference";
}

function unique(values) {
  return [...new Set(values)];
}
