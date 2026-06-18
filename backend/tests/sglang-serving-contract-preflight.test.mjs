import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  assertOpenWeightVlmSglangServingContractPreflightReportRedacted,
  evaluateOpenWeightVlmSglangServingContractPreflight,
  evaluateOpenWeightVlmSglangServingContractPreflightSamples,
  sglangServingContractSafeNoModelPlan
} from "../src/qa/openWeightVlmSglangServingContractPreflight.mjs";

test("SGLang serving contract preflight passes safe no-model contract", () => {
  const report = evaluateOpenWeightVlmSglangServingContractPreflight();
  assert.equal(report.sglangContractPreflightEligible, true);
  assert.equal(report.sglangRuntimeStarted, false);
  assert.equal(report.sglangEndpointCalled, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(report.productionReady, false);
});

test("SGLang serving contract preflight blocks execution requests", () => {
  for (const [field, blocker] of [
    ["modelCallRequested", "blocked_for_model_call_requested"],
    ["benchmarkExecutionRequested", "blocked_for_benchmark_execution_requested"],
    ["sglangServerStartRequested", "blocked_for_sglang_server_start_requested"],
    ["sglangEndpointCallRequested", "blocked_for_sglang_endpoint_call_requested"],
    ["modelDownloadRequested", "blocked_for_model_download_requested"],
    ["servingStackSwitchRequested", "blocked_for_serving_stack_switch_requested"]
  ]) {
    const report = evaluateOpenWeightVlmSglangServingContractPreflight({
      ...sglangServingContractSafeNoModelPlan(),
      [field]: true
    });
    assert.equal(report.sglangContractPreflightEligible, false);
    assert.ok(report.blockers.includes(blocker));
  }
});

test("SGLang serving contract preflight blocks production and public endpoints", () => {
  for (const endpointClass of ["public_cloud", "ngrok", "tunnel", "unknown"]) {
    const report = evaluateOpenWeightVlmSglangServingContractPreflight({
      ...sglangServingContractSafeNoModelPlan(),
      endpointClass
    });
    assert.equal(report.sglangContractPreflightEligible, false);
    assert.ok(report.blockers.includes("blocked_for_unsafe_endpoint_class"));
  }

  const productionReport = evaluateOpenWeightVlmSglangServingContractPreflight({
    ...sglangServingContractSafeNoModelPlan(),
    productionReady: true
  });
  assert.equal(productionReport.sglangContractPreflightEligible, false);
  assert.ok(productionReport.blockers.includes("blocked_for_production_flag"));
});

test("SGLang serving contract preflight blocks raw logging and persistence", () => {
  const report = evaluateOpenWeightVlmSglangServingContractPreflight({
    ...sglangServingContractSafeNoModelPlan(),
    rawPromptLogging: true,
    rawOutputLogging: true,
    rawRequestPayloadLogging: true,
    rawImageLogging: true,
    base64Logging: true,
    pathLogging: true,
    exifGpsSensorLogging: true,
    providerDebugLogging: true,
    requestPayloadPersistenceAllowed: true,
    rawOutputPersistenceAllowed: true
  });
  assert.equal(report.sglangContractPreflightEligible, false);
  for (const blocker of [
    "blocked_for_raw_prompt_logging",
    "blocked_for_raw_output_logging",
    "blocked_for_raw_request_payload_logging",
    "blocked_for_raw_image_logging",
    "blocked_for_base64_logging",
    "blocked_for_path_logging",
    "blocked_for_exif_gps_sensor_logging",
    "blocked_for_provider_debug_logging",
    "blocked_for_request_payload_persistence",
    "blocked_for_raw_output_persistence"
  ]) {
    assert.ok(report.blockers.includes(blocker));
  }
});

test("SGLang serving contract preflight blocks missing contract controls", () => {
  const report = evaluateOpenWeightVlmSglangServingContractPreflight({
    ...sglangServingContractSafeNoModelPlan(),
    structuredJsonRequired: false,
    validatorRequired: false,
    fallbackRequired: false,
    safetyRequired: false,
    outputMode: "free_form_raw_model_text"
  });
  assert.equal(report.sglangContractPreflightEligible, false);
  assert.ok(report.blockers.includes("blocked_for_missing_structured_json"));
  assert.ok(report.blockers.includes("blocked_for_missing_validator"));
  assert.ok(report.blockers.includes("blocked_for_missing_fallback"));
  assert.ok(report.blockers.includes("blocked_for_missing_safety"));
  assert.ok(report.blockers.includes("blocked_for_free_form_raw_model_text_output"));
});

test("SGLang serving contract preflight blocks iOS and camera cloud boundaries", () => {
  const report = evaluateOpenWeightVlmSglangServingContractPreflight({
    ...sglangServingContractSafeNoModelPlan(),
    iOSDirectCallEnabled: true,
    iOSProviderKeyPresent: true,
    appEndpointEnabled: true,
    productionEndpointEnabled: true,
    cameraLiveCloudEntryEnabled: true
  });
  assert.equal(report.sglangContractPreflightEligible, false);
  assert.ok(report.blockers.includes("blocked_for_ios_direct_sglang_call"));
  assert.ok(report.blockers.includes("blocked_for_ios_provider_key"));
  assert.ok(report.blockers.includes("blocked_for_app_endpoint"));
  assert.ok(report.blockers.includes("blocked_for_production_endpoint"));
  assert.ok(report.blockers.includes("blocked_for_camera_live_cloud_entry"));
});

test("SGLang serving contract preflight blocks text-only and unsafe language controls", () => {
  const report = evaluateOpenWeightVlmSglangServingContractPreflight({
    ...sglangServingContractSafeNoModelPlan(),
    modelClass: "qwen_text_only",
    modelVisionCapable: false,
    scoreRatingAllowed: true,
    sensitiveInferenceAllowed: true,
    chainOfThoughtAllowed: true
  });
  assert.equal(report.sglangContractPreflightEligible, false);
  assert.ok(report.blockers.includes("blocked_for_text_only_model_class"));
  assert.ok(report.blockers.includes("blocked_for_model_not_vision_capable"));
  assert.ok(report.blockers.includes("blocked_for_score_rating_allowed"));
  assert.ok(report.blockers.includes("blocked_for_sensitive_inference_allowed"));
  assert.ok(report.blockers.includes("blocked_for_chain_of_thought_allowed"));
});

test("SGLang serving contract preflight sample CLI report is sanitized", () => {
  const report = evaluateOpenWeightVlmSglangServingContractPreflightSamples();
  assert.equal(report.sglangContractPreflightEligible, true);
  assert.equal(report.sglangRuntimeStarted, false);
  assert.equal(report.sglangEndpointCalled, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.fixtureInferenceRun, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(assertOpenWeightVlmSglangServingContractPreflightReportRedacted(report).ok, true);

  const output = execFileSync("node", ["scripts/check-open-weight-vlm-sglang-serving-contract-preflight.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  assert.match(output, /"sglangContractPreflightEligible": true/);
  assert.doesNotMatch(output, /rawModelOutput|requestPayload|data:image|https?:\/\//);
});
