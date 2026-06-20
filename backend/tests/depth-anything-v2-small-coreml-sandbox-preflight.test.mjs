import assert from "node:assert/strict";
import test from "node:test";
import {
  assertDepthAnythingV2SmallCoreMlSandboxPreflightReportRedacted,
  depthAnythingV2SmallCoreMlSandboxPreflightPolicy,
  evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate,
  evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGateSamples
} from "../src/qa/depthAnythingV2SmallCoreMlSandboxPreflightGate.mjs";

test("Depth Anything sandbox preflight passes default approved no-runtime gate", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate(
    depthAnythingV2SmallCoreMlSandboxPreflightPolicy()
  );

  assert.equal(report.phase, "Phase_OD-03A");
  assert.equal(report.sandboxPreflightEligible, true);
  assert.equal(report.eligibleForFutureBenchmark, true);
  assert.equal(report.modelFileAdded, false);
  assert.equal(report.modelFilesBundled, false);
  assert.equal(report.coreMlPackageAdded, false);
  assert.equal(report.runtimeInferenceEnabled, false);
  assert.equal(report.coreMlRuntimeEnabled, false);
  assert.equal(report.cameraPreviewIntegrationEnabled, false);
  assert.equal(report.liveFrameProcessingEnabled, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.depthAnythingInferenceRun, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.productionReady, false);
  assert.deepEqual(report.blockedReasons, []);
  assert.deepEqual(report.requiredFutureGates, [
    "benchmarkRequired",
    "thermalGateRequired",
    "fpsGateRequired",
    "memoryGateRequired",
    "batteryGateRequired"
  ]);
});

test("Depth Anything sandbox preflight blocks model files and runtime in PRE", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
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
    benchmarkRun: true
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_model_file_added_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_model_file_bundled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_coreml_package_added_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_runtime_inference_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_coreml_runtime_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_model_download_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_camera_preview_integration_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_live_frame_processing_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_depth_anything_inference_run_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_benchmark_run_in_preflight"), true);
});

test("Depth Anything sandbox preflight blocks upload cloud provider and production hazards", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    networkCallsMade: true,
    modelCallsMade: true,
    providerOrNetworkCallMade: true,
    iOSProviderKeyAdded: true,
    cameraLiveCloudEntryAdded: true,
    uploadPayloadChanged: true,
    previewFrameUploadEnabled: true,
    productionReady: true
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_network_call"), true);
  assert.equal(report.blockers.includes("blocked_for_model_call"), true);
  assert.equal(report.blockers.includes("blocked_for_network_or_provider_call"), true);
  assert.equal(report.blockers.includes("blocked_for_ios_provider_key"), true);
  assert.equal(report.blockers.includes("blocked_for_camera_live_cloud_entry"), true);
  assert.equal(report.blockers.includes("blocked_for_upload_payload_change"), true);
  assert.equal(report.blockers.includes("blocked_for_preview_frame_upload"), true);
  assert.equal(report.blockers.includes("blocked_for_production_flag"), true);
});

test("Depth Anything sandbox preflight blocks raw logging persistence and sensitive inference", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    rawFramePersistence: true,
    rawDepthMapPersistence: true,
    rawFrameLoggingAllowed: true,
    rawDepthLoggingAllowed: true,
    rawImagePersistenceAllowed: true,
    rawDepthPersistenceAllowed: true,
    sensitiveInferenceAllowed: true
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_raw_frame_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_map_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_frame_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_image_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_sensitive_inference"), true);
});

test("Depth Anything sandbox preflight blocks unsafe benchmark plans", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    hardwareDepthPriority: false,
    hardwareDepthFirstRequired: false,
    phase21BDepthProbeRequired: false,
    debugOnly: false,
    benchmarkRequired: false,
    thermalGateRequired: false,
    fpsGateRequired: false,
    memoryGateRequired: false,
    batteryGateRequired: false,
    safetySensitiveInferenceBlocked: false,
    benchmarkPlan: {
      frameSourceBucket: "raw_camera_frame",
      cadenceBucket: "every_frame",
      inputSizeBuckets: [],
      metrics: ["warmed_inference_latency_bucket"],
      passFailGatesDefined: false,
      xcodeDeviceRunRequired: false,
      sanitizedAggregateOnly: false
    }
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_missing_hardware_depth_priority"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_hardware_depth_first_policy"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_phase_21_b_depth_probe_dependency"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_debug_only_policy"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_benchmark_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_thermal_gate_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_fps_gate_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_memory_gate_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_battery_gate_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_sensitive_inference_block"), true);
  assert.equal(report.blockers.includes("blocked_for_unapproved_frame_source_bucket"), true);
  assert.equal(report.blockers.includes("blocked_for_unapproved_cadence_bucket"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_input_size_buckets"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_benchmark_metrics"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_pass_fail_gates"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_xcode_device_run_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_sanitized_aggregate_policy"), true);
});

test("Depth Anything sandbox preflight report is sanitized", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGateSamples();
  const redaction = assertDepthAnythingV2SmallCoreMlSandboxPreflightReportRedacted(report);

  assert.equal(report.phase, "Phase OD-03A");
  assert.equal(report.sandboxPreflightEligible, true);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.productionReady, false);
  assert.equal(redaction.ok, true);
});

test("Depth Anything sandbox preflight redacts model and weight artifact references", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    probeValues: [
      { artifact: "DepthAnythingV2Small.coreml" },
      { artifact: "weights.safetensors" },
      { artifact: "model.gguf" }
    ]
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_probe_value_leak_model_artifact_reference"), true);
});

test("Depth Anything sandbox preflight does not require provider model or cloud fields", () => {
  const {
    providerOrNetworkCallMade,
    iOSProviderKeyAdded,
    cameraLiveCloudEntryAdded,
    networkCallsMade,
    modelCallsMade,
    ...policyWithoutProviderModelCloudFields
  } = depthAnythingV2SmallCoreMlSandboxPreflightPolicy();

  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate(
    policyWithoutProviderModelCloudFields
  );

  assert.equal(providerOrNetworkCallMade, false);
  assert.equal(iOSProviderKeyAdded, false);
  assert.equal(cameraLiveCloudEntryAdded, false);
  assert.equal(networkCallsMade, false);
  assert.equal(modelCallsMade, false);
  assert.equal(report.sandboxPreflightEligible, true);
  assert.equal(report.eligibleForFutureBenchmark, true);
  assert.deepEqual(report.blockers, []);
});
