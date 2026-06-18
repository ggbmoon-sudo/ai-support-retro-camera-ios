import assert from "node:assert/strict";
import test from "node:test";
import {
  assertOpenWeightVlmServingBenchmarkExecutionScopeGateReportRedacted,
  evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate,
  evaluateOpenWeightVlmServingBenchmarkExecutionScopeGateSamples,
  servingBenchmarkExecutionNoModelContractPlan
} from "../src/qa/openWeightVlmServingBenchmarkExecutionScopeGate.mjs";

test("serving benchmark execution scope gate passes no-model contract plan", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate(
    servingBenchmarkExecutionNoModelContractPlan()
  );

  assert.equal(report.scopeGateEligible, true);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(report.productionReady, false);
});

test("serving benchmark execution scope gate blocks real model plan without explicit approval", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    benchmarkKind: "one_fixture_smoke",
    fixtureCount: 1,
    fixtureMode: "approved_ignored_local_only",
    approvedFixtureTokens: ["smoke_001"],
    callLimit: 1
  });

  assert.equal(report.scopeGateEligible, false);
  assert.equal(report.blockers.includes("blocked_pending_explicit_approval"), true);
});

test("serving benchmark execution scope gate blocks one-fixture scope violations", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    benchmarkKind: "one_fixture_smoke",
    fixtureCount: 2,
    fixtureMode: "approved_ignored_local_only",
    approvedFixtureTokens: ["smoke_001", "smoke_002"],
    callLimit: 2,
    requiresExplicitApproval: true,
    explicitApprovalRecorded: true
  });

  assert.equal(report.blockers.includes("blocked_for_one_fixture_scope_violation"), true);
  assert.equal(report.blockers.includes("blocked_for_multi_fixture_without_controlled_scope"), true);
});

test("serving benchmark execution scope gate blocks retry without explicit approval", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    benchmarkKind: "one_fixture_smoke",
    fixtureCount: 1,
    fixtureMode: "approved_ignored_local_only",
    approvedFixtureTokens: ["smoke_001"],
    callLimit: 1,
    retryLimit: 1
  });

  assert.equal(report.blockers.includes("blocked_for_retry_without_explicit_approval"), true);
});

test("serving benchmark execution scope gate blocks raw output and missing sanitization", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    rawOutputPolicy: {
      rawOutputPrintAllowed: true,
      rawOutputPersistenceAllowed: true
    },
    rawInputPolicy: {
      rawPromptLoggingAllowed: true,
      rawImageLoggingAllowed: true,
      rawBase64LoggingAllowed: true,
      rawImagePathLoggingAllowed: true,
      requestPayloadLoggingAllowed: true
    },
    outputPersistencePolicy: "raw_report",
    reportSanitization: false
  });

  assert.equal(report.blockers.includes("blocked_for_raw_output_print_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_output_persistence_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_prompt_logging_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_image_logging_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_base64_logging_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_raw_image_path_logging_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_request_payload_logging_allowed"), true);
  assert.equal(report.blockers.includes("blocked_for_output_persistence_policy"), true);
  assert.equal(report.blockers.includes("blocked_for_missing_report_sanitization"), true);
});

test("serving benchmark execution scope gate blocks production iOS endpoints and camera runtimes", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    productionReady: true,
    iOSIntegrationEnabled: true,
    appEndpointEnabled: true,
    productionEndpointEnabled: true,
    cameraLiveCloudEntryEnabled: true,
    autoTriggerRuntimeEnabled: true,
    wssRuntimeEnabled: true,
    uploadRuntimeEnabled: true,
    endpointClass: "public_cloud"
  });

  assert.equal(report.blockers.includes("blocked_for_production_flag"), true);
  assert.equal(report.blockers.includes("blocked_for_ios_integration"), true);
  assert.equal(report.blockers.includes("blocked_for_app_endpoint"), true);
  assert.equal(report.blockers.includes("blocked_for_production_endpoint"), true);
  assert.equal(report.blockers.includes("blocked_for_camera_live_cloud_entry"), true);
  assert.equal(report.blockers.includes("blocked_for_auto_trigger_runtime"), true);
  assert.equal(report.blockers.includes("blocked_for_wss_runtime"), true);
  assert.equal(report.blockers.includes("blocked_for_upload_runtime"), true);
  assert.equal(report.blockers.includes("blocked_for_public_endpoint_class"), true);
});

test("serving benchmark execution scope gate blocks stack live and quantization hazards", () => {
  const unknownStack = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    servingStack: "unknown"
  });
  const ollamaProduction = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    servingStack: "ollama_lmstudio_manual_only",
    servingStackProductionUse: true
  });
  const liveOverFps = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    benchmarkKind: "live_1fps_simulation",
    maxFpsBucket: "over_1fps",
    requiresExplicitApproval: true,
    explicitApprovalRecorded: true
  });
  const quantizationProduction = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGate({
    ...servingBenchmarkExecutionNoModelContractPlan(),
    benchmarkKind: "quantization_benchmark",
    quantizationClass: "awq_candidate",
    quantizationProductionUse: true,
    requiresExplicitApproval: true,
    explicitApprovalRecorded: true
  });

  assert.equal(unknownStack.blockers.includes("blocked_for_unknown_serving_stack"), true);
  assert.equal(ollamaProduction.blockers.includes("blocked_for_ollama_lmstudio_production_stack"), true);
  assert.equal(liveOverFps.blockers.includes("blocked_for_live_advisor_over_1fps"), true);
  assert.equal(quantizationProduction.blockers.includes("blocked_for_quantization_production_before_benchmark"), true);
});

test("serving benchmark execution scope gate sample CLI report is sanitized", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGateSamples();
  const redaction = assertOpenWeightVlmServingBenchmarkExecutionScopeGateReportRedacted(report);

  assert.equal(report.scopeGateEligible, true);
  assert.equal(report.defaultNoModelContractPassed, true);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(redaction.ok, true);
});
