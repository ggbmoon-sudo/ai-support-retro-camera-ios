import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  assertOpenWeightVlmServingBenchmarkApprovalMatrixReportRedacted,
  evaluateOpenWeightVlmServingBenchmarkApprovalMatrix,
  evaluateOpenWeightVlmServingBenchmarkApprovalMatrixSamples,
  servingBenchmarkApprovalMatrixNoModelPlan
} from "../src/qa/openWeightVlmServingBenchmarkApprovalMatrix.mjs";

const fixtureTokens = Array.from({ length: 12 }, (_, index) => `smoke_${String(index + 1).padStart(3, "0")}`);

test("serving benchmark approval matrix passes no-model contract", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix();
  assert.equal(report.approvalMatrixEligible, true);
  assert.equal(report.benchmarkKind, "no_model_contract");
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(report.productionReady, false);
});

test("serving benchmark approval matrix requires explicit one-fixture model approval", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    benchmarkKind: "one_fixture_smoke",
    fixtureCount: 1,
    approvedFixtureTokens: ["smoke_001"],
    callLimit: 1
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_missing_explicit_model_call_approval"));
});

test("serving benchmark approval matrix blocks one-fixture multiple fixtures", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    benchmarkKind: "one_fixture_smoke",
    fixtureCount: 2,
    approvedFixtureTokens: ["smoke_001", "smoke_002"],
    callLimit: 1,
    explicitModelCallApproval: true
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_one_fixture_scope_violation"));
});

test("serving benchmark approval matrix blocks retry without explicit retry approval", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    benchmarkKind: "one_fixture_smoke",
    fixtureCount: 1,
    approvedFixtureTokens: ["smoke_001"],
    callLimit: 1,
    retryLimit: 1,
    explicitModelCallApproval: true
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_retry_without_explicit_retry_approval"));
});

test("serving benchmark approval matrix requires explicit benchmark approvals", () => {
  for (const benchmarkKind of ["controlled_12_fixture", "serving_stack_comparison", "quantization_benchmark"]) {
    const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
      ...servingBenchmarkApprovalMatrixNoModelPlan(),
      benchmarkKind,
      servingStack: benchmarkKind === "serving_stack_comparison" ? "vllm_candidate" : "transformers_fastapi_reference",
      fixtureCount: 12,
      approvedFixtureTokens: fixtureTokens,
      callLimit: 12
    });
    assert.equal(report.approvalMatrixEligible, false);
    assert.ok(report.blockers.includes("blocked_for_missing_explicit_benchmark_approval"));
  }
});

test("serving benchmark approval matrix requires explicit live advisor approval", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    benchmarkKind: "live_1fps_simulation",
    fixtureCount: 1,
    approvedFixtureTokens: ["smoke_001"],
    callLimit: 1,
    liveAdvisorMode: "simulation",
    maxFpsBucket: "max_1fps"
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_missing_explicit_live_advisor_approval"));
});

test("serving benchmark approval matrix blocks Live Advisor over 1 FPS", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    benchmarkKind: "live_1fps_simulation",
    fixtureCount: 1,
    approvedFixtureTokens: ["smoke_001"],
    callLimit: 1,
    explicitLiveAdvisorApproval: true,
    liveAdvisorMode: "simulation",
    maxFpsBucket: "over_1fps"
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_live_advisor_over_1fps"));
});

test("serving benchmark approval matrix blocks raw output and missing sanitized policy", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    rawOutputPolicy: {
      rawOutputPrintAllowed: true,
      rawOutputPersistenceAllowed: true
    },
    reportSanitization: false
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_raw_output_print_allowed"));
  assert.ok(report.blockers.includes("blocked_for_raw_output_persistence_allowed"));
  assert.ok(report.blockers.includes("blocked_for_missing_sanitized_report_policy"));
});

test("serving benchmark approval matrix blocks production iOS endpoints and camera runtime", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    productionReady: true,
    iOSIntegrationEnabled: true,
    appEndpointEnabled: true,
    productionEndpointEnabled: true,
    cameraLiveCloudEntryEnabled: true
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_production_flag"));
  assert.ok(report.blockers.includes("blocked_for_ios_integration"));
  assert.ok(report.blockers.includes("blocked_for_app_endpoint"));
  assert.ok(report.blockers.includes("blocked_for_production_endpoint"));
  assert.ok(report.blockers.includes("blocked_for_camera_live_cloud_entry"));
});

test("serving benchmark approval matrix blocks public endpoint and runtime hazards", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    endpointClass: "public_cloud",
    autoTriggerRuntimeEnabled: true,
    wssRuntimeEnabled: true,
    uploadRuntimeEnabled: true
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_public_endpoint_class"));
  assert.ok(report.blockers.includes("blocked_for_auto_trigger_runtime"));
  assert.ok(report.blockers.includes("blocked_for_wss_runtime"));
  assert.ok(report.blockers.includes("blocked_for_upload_runtime"));
});

test("serving benchmark approval matrix blocks Ollama production and unknown stack or kind", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    benchmarkKind: "unknown_kind",
    servingStack: "unknown_stack"
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_unknown_benchmark_kind"));
  assert.ok(report.blockers.includes("blocked_for_unknown_serving_stack"));

  const ollamaReport = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    servingStack: "ollama_lmstudio_manual_only",
    servingStackProductionUse: true
  });
  assert.equal(ollamaReport.approvalMatrixEligible, false);
  assert.ok(ollamaReport.blockers.includes("blocked_for_ollama_lmstudio_production_stack"));
});

test("serving benchmark approval matrix blocks quantization production claims", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrix({
    ...servingBenchmarkApprovalMatrixNoModelPlan(),
    quantizationProductionUse: true,
    visionEncoderQuantizationProductionClaim: true
  });
  assert.equal(report.approvalMatrixEligible, false);
  assert.ok(report.blockers.includes("blocked_for_quantization_production_before_benchmark"));
  assert.ok(report.blockers.includes("blocked_for_vision_encoder_quantization_production_claim_without_evidence"));
});

test("serving benchmark approval matrix sample CLI report is sanitized", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrixSamples();
  assert.equal(report.approvalMatrixEligible, true);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.fixtureInferenceRun, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(assertOpenWeightVlmServingBenchmarkApprovalMatrixReportRedacted(report).ok, true);

  const output = execFileSync("node", ["scripts/check-open-weight-vlm-serving-benchmark-approval-matrix.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  assert.match(output, /"approvalMatrixEligible": true/);
  assert.doesNotMatch(output, /rawModelOutput|requestPayload|data:image|https?:\/\//);
});
