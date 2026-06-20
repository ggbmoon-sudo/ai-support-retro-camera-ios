import assert from "node:assert/strict";
import test from "node:test";
import {
  assertDepthAnythingV2SmallModelArtifactBenchmarkHarnessReportRedacted,
  depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy,
  evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate,
  evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGateSamples
} from "../src/qa/depthAnythingV2SmallModelArtifactBenchmarkHarnessGate.mjs";

test("Depth Anything artifact harness gate passes approval-only no-artifact policy", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate(
    depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy()
  );

  assert.equal(report.artifactHarnessGateEligible, true);
  assert.equal(report.modelArtifactAdded, false);
  assert.equal(report.modelDownloadAutomated, false);
  assert.equal(report.coreMlPackageAdded, false);
  assert.equal(report.depthAnythingInferenceRun, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.productionReady, false);
});

test("Depth Anything artifact harness gate blocks source and license review drift", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate({
    ...depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy(),
    sourceUrlRecorded: true,
    sourceVerificationRequired: false,
    licenseReviewRequired: false,
    modelCardReviewRequired: false
  });

  assert.equal(report.artifactHarnessGateEligible, false);
  assert.equal(report.blockers.includes("blocked_for_source_url_recorded"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_source_verification_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_license_review_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_model_card_review_requirement"), true);
});

test("Depth Anything artifact harness gate blocks artifacts runtime downloads and benchmarks", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate({
    ...depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy(),
    modelArtifactAdded: true,
    modelArtifactCommitted: true,
    modelDownloadAutomated: true,
    coreMlPackageAdded: true,
    coreMlRuntimeEnabled: true,
    depthAnythingInferenceRun: true,
    benchmarkRun: true,
    providerOrNetworkCallMade: true,
    xcodeHarnessAdded: true,
    productionReady: true
  });

  assert.equal(report.artifactHarnessGateEligible, false);
  assert.equal(report.blockers.includes("blocked_for_model_artifact_added_in_gate"), true);
  assert.equal(report.blockers.includes("blocked_for_model_artifact_committed"), true);
  assert.equal(report.blockers.includes("blocked_for_automated_model_download"), true);
  assert.equal(report.blockers.includes("blocked_for_coreml_package_added"), true);
  assert.equal(report.blockers.includes("blocked_for_coreml_runtime_enabled"), true);
  assert.equal(report.blockers.includes("blocked_for_depth_anything_inference_run"), true);
  assert.equal(report.blockers.includes("blocked_for_benchmark_run"), true);
  assert.equal(report.blockers.includes("blocked_for_network_or_provider_call"), true);
  assert.equal(report.blockers.includes("blocked_for_xcode_harness_added_in_approval_gate"), true);
  assert.equal(report.blockers.includes("blocked_for_production_flag"), true);
});

test("Depth Anything artifact harness gate blocks app boundary and privacy hazards", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate({
    ...depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy(),
    cameraRuntimeIntegrated: true,
    previewFrameUploadEnabled: true,
    uploadPayloadChanged: true,
    cameraLiveCloudEntryAdded: true,
    iOSProviderKeyAdded: true,
    rawFrameLoggingAllowed: true,
    rawDepthLoggingAllowed: true,
    rawImagePersistenceAllowed: true,
    rawDepthPersistenceAllowed: true,
    rawPathLoggingAllowed: true,
    sensitiveInferenceAllowed: true
  });

  assert.equal(report.artifactHarnessGateEligible, false);
  assert.equal(report.blockers.includes("blocked_for_camera_runtime_integration"), true);
  assert.equal(report.blockers.includes("blocked_for_preview_frame_upload"), true);
  assert.equal(report.blockers.includes("blocked_for_upload_payload_change"), true);
  assert.equal(report.blockers.includes("blocked_for_camera_live_cloud_entry"), true);
  assert.equal(report.blockers.includes("blocked_for_ios_provider_key"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_frame_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_image_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_depth_persistence"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_path_logging"), true);
  assert.equal(report.blockers.includes("blocked_for_sensitive_inference"), true);
});

test("Depth Anything artifact harness gate blocks unsafe local artifact policy", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate({
    ...depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy(),
    localArtifactPolicy: {
      artifactMustBeIgnored: false,
      artifactCommitAllowed: true,
      artifactPathLoggingAllowed: true,
      automatedDownloadAllowed: true,
      checksumBucketRequired: false,
      licenseBucketRequired: false
    }
  });

  assert.equal(report.artifactHarnessGateEligible, false);
  assert.equal(report.blockers.includes("blocked_for_missing_ignored_artifact_policy"), true);
  assert.equal(report.blockers.includes("blocked_for_artifact_commit_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_artifact_path_logging_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_automated_download_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_checksum_bucket_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_license_bucket_requirement"), true);
});

test("Depth Anything artifact harness gate blocks unsafe Xcode benchmark plan", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGate({
    ...depthAnythingV2SmallModelArtifactBenchmarkHarnessPolicy(),
    xcodeBenchmarkHarnessPlan: {
      xcodeDeviceRunRequired: false,
      simulatorBenchmarkAccepted: true,
      hardwareDepthFirstRequired: false,
      sanitizedAggregateOnly: false,
      inputSizeBuckets: ["full_resolution"],
      requiredMetricBuckets: ["model_load_time_bucket"],
      deviceTierBuckets: [],
      stopConditionBuckets: []
    }
  });

  assert.equal(report.artifactHarnessGateEligible, false);
  assert.equal(report.blockers.includes("blocked_for_missing_xcode_device_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_simulator_benchmark_acceptance"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_hardware_depth_first_requirement"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_sanitized_aggregate_policy"), true);
  assert.equal(report.blockers.includes("blocked_for_unapproved_input_size_bucket"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_required_metric_buckets"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_device_tier_buckets"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_stop_condition_buckets"), true);
});

test("Depth Anything artifact harness gate sample CLI report is sanitized", () => {
  const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGateSamples();
  const redaction = assertDepthAnythingV2SmallModelArtifactBenchmarkHarnessReportRedacted(report);

  assert.equal(report.artifactHarnessGateEligible, true);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.productionReady, false);
  assert.equal(redaction.ok, true);
});
