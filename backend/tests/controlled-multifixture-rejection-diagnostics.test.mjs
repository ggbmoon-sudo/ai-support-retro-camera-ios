import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  assertControlledMultifixtureRejectionDiagnosticsReportRedacted,
  buildControlledMultifixtureRejectionDiagnosticsInput,
  diagnoseControlledMultifixtureRejectionPath
} from "../src/qa/openWeightVlmControlledMultifixtureRejectionDiagnostics.mjs";

test("controlled multi-fixture rejection diagnostics detects all-12 local unavailable pattern", () => {
  const report = diagnoseControlledMultifixtureRejectionPath();

  assert.equal(report.diagnosticEligible, true);
  assert.equal(report.likelyFailureLayer, "external_route_error_mapping_or_fixture_token_contract");
  assert.equal(report.rootCauseFound, true);
  assert.equal(report.phase21WR1BRejectedReference.acceptedCount, 0);
  assert.equal(report.phase21WR1BRejectedReference.rejectedCount, 12);
  assert.equal(report.phase21WR1BRejectedReference.validationCodes.local_model_unavailable, 12);
  assert.equal(report.phase21WR1BRejectedReference.fallbackCategories.blocked_for_provider_integration, 12);
});

test("controlled multi-fixture rejection diagnostics flags lt1s as pre-model provider integration failure", () => {
  const report = diagnoseControlledMultifixtureRejectionPath();

  assert.equal(report.phase21WR1BRejectedReference.latencyBuckets.lt_1s, 12);
  assert.equal(report.comparedPaths.controlledMultifixtureFastRejectBucket, true);
  assert.equal(report.comparedPaths.modelQualityFailureUnlikely, true);
  assert.ok(report.possibleRootCauses.includes("external_server_fixture_token_contract_mismatch"));
  assert.ok(report.possibleRootCauses.includes("controlled_wrapper_maps_fetch_or_http_non_ok_to_local_model_unavailable"));
});

test("controlled multi-fixture rejection diagnostics compares accepted one-fixture path", () => {
  const report = diagnoseControlledMultifixtureRejectionPath();

  assert.equal(report.phase21UAcceptedReference.fixtureTokens.includes("smoke_001"), true);
  assert.equal(report.phase21UAcceptedReference.acceptedCount, 1);
  assert.equal(report.comparedPaths.sameServingStack, true);
  assert.equal(report.comparedPaths.oneFixtureAcceptedReference, true);
  assert.equal(report.comparedPaths.endpointBucketNormalizationRuledOut, true);
  assert.equal(report.comparedPaths.schemaValidatorMismatchRuledOut, true);
});

test("controlled multi-fixture rejection diagnostics recommends no immediate benchmark retry", () => {
  const report = diagnoseControlledMultifixtureRejectionPath();

  assert.equal(report.immediateBenchmarkRetryJustified, false);
  assert.equal(report.nextSafeAction, "phase_21_w_r2c_external_server_fixture_token_contract_fix");
  assert.equal(report.modelCallRequiredForNextAction, false);
  assert.equal(report.endpointCallRequiredForNextAction, false);
  assert.equal(report.benchmarkRequiredForNextAction, false);
});

test("controlled multi-fixture rejection diagnostics blocks current execution requests", () => {
  for (const [field, blocker] of [
    ["modelCallRequestedNow", "blocked_for_current_model_call_request"],
    ["endpointCallRequestedNow", "blocked_for_current_endpoint_call_request"],
    ["benchmarkExecutionRequestedNow", "blocked_for_current_benchmark_execution_request"]
  ]) {
    const report = diagnoseControlledMultifixtureRejectionPath(
      buildControlledMultifixtureRejectionDiagnosticsInput({ [field]: true })
    );
    assert.equal(report.diagnosticEligible, false);
    assert.ok(report.blockers.includes(blocker));
  }
});

test("controlled multi-fixture rejection diagnostics blocks raw artifacts and production", () => {
  const report = diagnoseControlledMultifixtureRejectionPath(
    buildControlledMultifixtureRejectionDiagnosticsInput({
      rawOutputPersisted: true,
      rawOutputPrinted: true,
      rawPromptPersisted: true,
      rawPromptPrinted: true,
      rawPayloadPersisted: true,
      rawPayloadPrinted: true,
      productionReady: true
    })
  );

  assert.equal(report.diagnosticEligible, false);
  for (const blocker of [
    "blocked_for_raw_output_persistence",
    "blocked_for_raw_output_printing",
    "blocked_for_raw_prompt_persistence",
    "blocked_for_raw_prompt_printing",
    "blocked_for_raw_payload_persistence",
    "blocked_for_raw_payload_printing",
    "blocked_for_production_flag"
  ]) {
    assert.ok(report.blockers.includes(blocker));
  }
});

test("controlled multi-fixture rejection diagnostics output is sanitized", () => {
  const report = diagnoseControlledMultifixtureRejectionPath({
    phase21WR1BRejectedReference: {
      fixtureTokens: ["smoke_004", "C:\\raw\\image.jpg"],
      validationCodes: { local_model_unavailable: 12 },
      fallbackCategories: { blocked_for_provider_integration: 12 },
      latencyBuckets: { lt_1s: 12 },
      acceptedCount: 0,
      rejectedCount: 12,
      fixtureCount: 12,
      callCount: 12,
      retryCount: 0,
      endpointBucketNormalized: true
    }
  });
  const serialized = JSON.stringify(report);

  assert.equal(assertControlledMultifixtureRejectionDiagnosticsReportRedacted(report).ok, true);
  assert.equal(serialized.includes("C:\\raw"), false);
  assert.equal(serialized.includes(".jpg"), false);
  assert.equal(serialized.includes("requestPayload"), false);
  assert.equal(serialized.includes("rawModelOutput"), false);
  assert.equal(report.productionReady, false);
});

test("controlled multi-fixture rejection diagnostics CLI is no-network and sanitized", () => {
  const output = execFileSync("node", ["scripts/check-open-weight-vlm-controlled-multifixture-rejection-diagnostics.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.diagnosticEligible, true);
  assert.equal(report.endpointCalled, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.fixtureInferenceRun, false);
  assert.equal(report.servingBenchmarkRun, false);
  assert.equal(report.productionReady, false);
  assert.doesNotMatch(output, /rawModelOutput|requestPayload|data:image|https?:\/\//);
});
