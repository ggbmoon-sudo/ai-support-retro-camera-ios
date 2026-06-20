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

  assert.equal(report.sandboxPreflightEligible, true);
  assert.equal(report.modelFilesBundled, false);
  assert.equal(report.coreMlPackageAdded, false);
  assert.equal(report.coreMlRuntimeEnabled, false);
  assert.equal(report.depthAnythingInferenceRun, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.productionReady, false);
});

test("Depth Anything sandbox preflight blocks model files and runtime in PRE", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    modelFilesBundled: true,
    coreMlPackageAdded: true,
    coreMlRuntimeEnabled: true,
    modelDownloadEnabled: true,
    depthAnythingInferenceRun: true,
    benchmarkRun: true
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_model_file_bundled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_coreml_package_added_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_coreml_runtime_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_model_download_enabled_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_depth_anything_inference_run_in_preflight"), true);
  assert.equal(report.blockers.includes("blocked_for_benchmark_run_in_preflight"), true);
});

test("Depth Anything sandbox preflight blocks upload cloud provider and production hazards", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    providerOrNetworkCallMade: true,
    iOSProviderKeyAdded: true,
    cameraLiveCloudEntryAdded: true,
    uploadPayloadChanged: true,
    previewFrameUploadEnabled: true,
    productionReady: true
  });

  assert.equal(report.sandboxPreflightEligible, false);
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
    rawFrameLoggingAllowed: true,
    rawDepthLoggingAllowed: true,
    rawImagePersistenceAllowed: true,
    rawDepthPersistenceAllowed: true,
    sensitiveInferenceAllowed: true
  });

  assert.equal(report.sandboxPreflightEligible, false);
  assert.equal(report.blockers.includes("blocked_for_raw_frame_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_image_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_sensitive_inference"), true);
});

test("Depth Anything sandbox preflight blocks unsafe benchmark plans", () => {
  const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGate({
    ...depthAnythingV2SmallCoreMlSandboxPreflightPolicy(),
    hardwareDepthFirstRequired: false,
    phase21BDepthProbeRequired: false,
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
  assert.equal(report.blockers.includes("blocked_for_missing_hardware_depth_first_policy"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_phase_21_b_depth_probe_dependency"), true);
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

  assert.equal(report.sandboxPreflightEligible, true);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.productionReady, false);
  assert.equal(redaction.ok, true);
});
