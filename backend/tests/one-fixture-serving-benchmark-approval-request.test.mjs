import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  assertOneFixtureServingBenchmarkApprovalRequestReportRedacted,
  buildOneFixtureServingBenchmarkApprovalDraft,
  evaluateOneFixtureServingBenchmarkApprovalRequest,
  evaluateOneFixtureServingBenchmarkApprovalRequestSamples
} from "../src/qa/openWeightVlmOneFixtureServingBenchmarkApprovalRequest.mjs";

test("one-fixture serving benchmark approval request passes safe draft-only request", () => {
  const report = evaluateOneFixtureServingBenchmarkApprovalRequest();
  assert.equal(report.approvalRequestGateEligible, true);
  assert.equal(report.approvalDraftOnly, true);
  assert.equal(report.proposedServingStack, "transformers_fastapi_reference");
  assert.equal(report.proposedFixtureToken, "smoke_001");
  assert.equal(report.proposedFixtureCount, 1);
  assert.equal(report.proposedCallCount, 1);
  assert.equal(report.proposedRetryCount, 0);
  assert.equal(report.servingRuntimeStarted, false);
  assert.equal(report.endpointCalled, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(report.productionReady, false);
});

test("one-fixture serving benchmark approval request blocks current execution", () => {
  for (const [field, blocker] of [
    ["modelCallRequestedNow", "blocked_for_current_model_call_request"],
    ["benchmarkExecutionRequestedNow", "blocked_for_current_benchmark_execution_request"],
    ["servingStackSwitchRequested", "blocked_for_serving_stack_switch_request"]
  ]) {
    const report = evaluateOneFixtureServingBenchmarkApprovalRequest({
      ...buildOneFixtureServingBenchmarkApprovalDraft(),
      [field]: true
    });
    assert.equal(report.approvalRequestGateEligible, false);
    assert.ok(report.blockers.includes(blocker));
  }
});

test("one-fixture serving benchmark approval request blocks future scope expansion", () => {
  for (const [field, value, blocker] of [
    ["fixtureCount", 2, "blocked_for_fixture_count_not_one"],
    ["callCount", 2, "blocked_for_call_count_not_one"],
    ["retryCount", 1, "blocked_for_retry_count_not_zero"],
    ["fixtureToken", "smoke_002", "blocked_for_non_smoke_001_fixture"],
    ["servingStack", "vllm_candidate", "blocked_for_non_transformers_fastapi_reference_stack"],
    ["explicitUserApprovalRequired", false, "blocked_for_missing_explicit_user_approval_requirement"],
    ["healthzRequired", false, "blocked_for_missing_healthz_requirement"],
    ["endpointClass", "public_cloud", "blocked_for_unsafe_endpoint_class"]
  ]) {
    const report = evaluateOneFixtureServingBenchmarkApprovalRequest({
      ...buildOneFixtureServingBenchmarkApprovalDraft(),
      [field]: value
    });
    assert.equal(report.approvalRequestGateEligible, false);
    assert.ok(report.blockers.includes(blocker));
  }
});

test("one-fixture serving benchmark approval request blocks raw artifacts", () => {
  const report = evaluateOneFixtureServingBenchmarkApprovalRequest({
    ...buildOneFixtureServingBenchmarkApprovalDraft(),
    rawOutputPersisted: true,
    rawOutputPrinted: true,
    rawPromptLogging: true,
    rawImageLogging: true,
    rawRequestPayloadLogging: true
  });
  assert.equal(report.approvalRequestGateEligible, false);
  for (const blocker of [
    "blocked_for_raw_output_persistence",
    "blocked_for_raw_output_printing",
    "blocked_for_raw_prompt_logging",
    "blocked_for_raw_image_logging",
    "blocked_for_raw_request_payload_logging"
  ]) {
    assert.ok(report.blockers.includes(blocker));
  }
});

test("one-fixture serving benchmark approval request blocks production and app boundaries", () => {
  const report = evaluateOneFixtureServingBenchmarkApprovalRequest({
    ...buildOneFixtureServingBenchmarkApprovalDraft(),
    productionReady: true,
    iOSIntegrationEnabled: true,
    appEndpointEnabled: true,
    productionEndpointEnabled: true,
    cameraLiveCloudEntryEnabled: true,
    autoTriggerRuntimeEnabled: true,
    wssRuntimeEnabled: true,
    uploadRuntimeEnabled: true
  });
  assert.equal(report.approvalRequestGateEligible, false);
  for (const blocker of [
    "blocked_for_production_flag",
    "blocked_for_ios_integration",
    "blocked_for_app_endpoint",
    "blocked_for_production_endpoint",
    "blocked_for_camera_live_cloud_entry",
    "blocked_for_auto_trigger_runtime",
    "blocked_for_wss_runtime",
    "blocked_for_upload_runtime"
  ]) {
    assert.ok(report.blockers.includes(blocker));
  }
});

test("one-fixture serving benchmark approval request sample CLI report is sanitized", () => {
  const report = evaluateOneFixtureServingBenchmarkApprovalRequestSamples();
  assert.equal(report.approvalRequestGateEligible, true);
  assert.equal(report.safeDraftOnlyRequestPassed, true);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.fixtureInferenceRun, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(assertOneFixtureServingBenchmarkApprovalRequestReportRedacted(report).ok, true);

  const output = execFileSync("node", ["scripts/check-open-weight-vlm-one-fixture-serving-benchmark-approval-request.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  assert.match(output, /"approvalRequestGateEligible": true/);
  assert.doesNotMatch(output, /rawModelOutput|requestPayload|data:image|https?:\/\//);
});
