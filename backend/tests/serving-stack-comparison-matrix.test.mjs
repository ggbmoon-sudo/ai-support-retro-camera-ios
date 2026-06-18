import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  assertServingStackComparisonMatrixReportRedacted,
  buildDefaultNoModelComparisonMatrix,
  evaluateServingStackComparisonMatrixSamples,
  evaluateServingStackComparisonPlan
} from "../src/qa/openWeightVlmServingStackComparisonMatrix.mjs";

test("serving stack comparison matrix passes safe no-model matrix", () => {
  const report = evaluateServingStackComparisonPlan();
  assert.equal(report.comparisonMatrixEligible, true);
  assert.equal(report.servingRuntimeStarted, false);
  assert.equal(report.endpointCalled, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(report.servingStackSwitched, false);
  assert.equal(report.productionReady, false);
});

test("serving stack comparison matrix warns for missing comparison roles", () => {
  const report = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    includesTransformersFastapi: false,
    includesVllm: false,
    includesSglang: false,
    includesOllamaLmStudio: false
  });
  assert.equal(report.comparisonMatrixEligible, true);
  assert.ok(report.warnings.includes("warning_missing_transformers_fastapi_reference"));
  assert.ok(report.warnings.includes("warning_missing_vllm_candidate"));
  assert.ok(report.warnings.includes("warning_missing_sglang_challenger"));
  assert.ok(report.warnings.includes("warning_missing_ollama_lmstudio_manual_only"));
});

test("serving stack comparison matrix blocks execution requests", () => {
  for (const [field, blocker] of [
    ["modelCallRequested", "blocked_for_model_call_requested"],
    ["endpointCallRequested", "blocked_for_endpoint_call_requested"],
    ["benchmarkExecutionRequested", "blocked_for_benchmark_execution_requested"],
    ["servingStackSwitchRequested", "blocked_for_serving_stack_switch_requested"],
    ["modelDownloadRequested", "blocked_for_model_download_requested"],
    ["productionRouteRequested", "blocked_for_production_route_requested"]
  ]) {
    const report = evaluateServingStackComparisonPlan({
      ...buildDefaultNoModelComparisonMatrix(),
      [field]: true
    });
    assert.equal(report.comparisonMatrixEligible, false);
    assert.ok(report.blockers.includes(blocker));
  }
});

test("serving stack comparison matrix blocks production flags and unknown stacks", () => {
  const productionReport = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    productionReady: true
  });
  assert.equal(productionReport.comparisonMatrixEligible, false);
  assert.ok(productionReport.blockers.includes("blocked_for_production_flag"));

  const unknownStackReport = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    servingStacks: ["transformers_fastapi_reference", "unknown_stack"]
  });
  assert.equal(unknownStackReport.comparisonMatrixEligible, false);
  assert.ok(unknownStackReport.blockers.includes("blocked_for_unknown_serving_stack"));

  const ollamaProductionReport = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    ollamaLmStudioProductionUse: true
  });
  assert.equal(ollamaProductionReport.comparisonMatrixEligible, false);
  assert.ok(ollamaProductionReport.blockers.includes("blocked_for_ollama_lmstudio_production_role"));
});

test("serving stack comparison matrix blocks raw logging and persistence", () => {
  const report = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    rawPromptLogging: true,
    rawOutputLogging: true,
    rawImageLogging: true,
    base64Logging: true,
    pathLogging: true,
    rawRequestPayloadLogging: true,
    exifGpsSensorLogging: true,
    requestPayloadPersistenceAllowed: true,
    rawOutputPersistenceAllowed: true
  });
  assert.equal(report.comparisonMatrixEligible, false);
  for (const blocker of [
    "blocked_for_raw_prompt_logging",
    "blocked_for_raw_output_logging",
    "blocked_for_raw_image_logging",
    "blocked_for_base64_logging",
    "blocked_for_path_logging",
    "blocked_for_raw_request_payload_logging",
    "blocked_for_exif_gps_sensor_logging",
    "blocked_for_request_payload_persistence",
    "blocked_for_raw_output_persistence"
  ]) {
    assert.ok(report.blockers.includes(blocker));
  }
});

test("serving stack comparison matrix blocks missing contract controls", () => {
  const report = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    structuredJsonRequired: false,
    validatorRequired: false,
    fallbackRequired: false,
    safetyRequired: false
  });
  assert.equal(report.comparisonMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_missing_structured_json"));
  assert.ok(report.blockers.includes("blocked_for_missing_validator"));
  assert.ok(report.blockers.includes("blocked_for_missing_fallback"));
  assert.ok(report.blockers.includes("blocked_for_missing_safety"));
});

test("serving stack comparison matrix blocks iOS and endpoint boundaries", () => {
  const report = evaluateServingStackComparisonPlan({
    ...buildDefaultNoModelComparisonMatrix(),
    iOSIntegrationEnabled: true,
    appEndpointEnabled: true,
    productionEndpointEnabled: true,
    cameraLiveCloudEntryEnabled: true
  });
  assert.equal(report.comparisonMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_ios_integration"));
  assert.ok(report.blockers.includes("blocked_for_app_endpoint"));
  assert.ok(report.blockers.includes("blocked_for_production_endpoint"));
  assert.ok(report.blockers.includes("blocked_for_camera_live_cloud_entry"));
});

test("serving stack comparison matrix sample CLI report is sanitized", () => {
  const report = evaluateServingStackComparisonMatrixSamples();
  assert.equal(report.comparisonMatrixEligible, true);
  assert.equal(report.servingRuntimeStarted, false);
  assert.equal(report.endpointCalled, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.fixtureInferenceRun, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(assertServingStackComparisonMatrixReportRedacted(report).ok, true);

  const output = execFileSync("node", ["scripts/check-open-weight-vlm-serving-stack-comparison-matrix.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  assert.match(output, /"comparisonMatrixEligible": true/);
  assert.doesNotMatch(output, /rawModelOutput|requestPayload|data:image|https?:\/\//);
});
