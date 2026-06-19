import assert from "node:assert/strict";
import test from "node:test";
import {
  BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS,
  buildBenchmarkRouteContractDryRunRequest,
  inferRootCauseBucket,
  validateBenchmarkRouteContractDryRunResult
} from "../src/qa/openWeightVlmBenchmarkRouteContractDryRun.mjs";

test("benchmark route contract dry-run builds the benchmark request shape", () => {
  assert.deepEqual(buildBenchmarkRouteContractDryRunRequest("smoke_004"), {
    schemaVersion: "open_weight_vlm_local_fastapi_request.v1",
    modelId: "qwen2.5-vl-7b-instruct",
    outputContract: "photo_advisor_vlm_candidate.v1",
    noModelRouteContractCheck: true,
    fixtureId: "smoke_004"
  });
});

test("benchmark route contract dry-run accepts explicit buckets", () => {
  const approvedResponses = BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS.map((token) => ({
    ok: true,
    routeContractDryRun: true,
    accepted: true,
    fixtureIdBucket: token,
    fixtureRouteabilityBucket: "routeable",
    modelReadinessBucket: "model_loaded",
    modelCallExecuted: false,
    modelInferenceRun: false,
    inferenceEndpointCalled: false,
    benchmarkRun: false,
    productionReady: false
  }));
  const result = validateBenchmarkRouteContractDryRunResult({
    approvedResponses,
    unsupportedResponse: {
      errorBucket: "unsupported_fixture_token"
    },
    missingResponse: {
      errorBucket: "missing_fixture_token"
    }
  });
  assert.equal(result.ok, true);
});

test("benchmark route contract dry-run blocks ambiguous local unavailable buckets", () => {
  const approvedResponses = BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS.map((token) => ({
    ok: true,
    routeContractDryRun: true,
    accepted: true,
    fixtureIdBucket: token,
    errorBucket: null,
    modelCallExecuted: false,
    modelInferenceRun: false,
    inferenceEndpointCalled: false,
    benchmarkRun: false,
    productionReady: false
  }));
  const result = validateBenchmarkRouteContractDryRunResult({
    approvedResponses,
    unsupportedResponse: {
      errorBucket: "local_model_unavailable"
    },
    missingResponse: {
      errorBucket: "missing_fixture_token"
    }
  });
  assert.equal(result.ok, false);
  assert.ok(result.blockers.includes("blocked_for_unsupported_token_bucket"));
  assert.ok(result.blockers.includes("blocked_for_ambiguous_route_contract_bucket"));
});

test("benchmark route contract dry-run identifies fixture lookup mismatch", () => {
  assert.equal(inferRootCauseBucket({
    fixtureRouteabilityBuckets: {
      fixture_not_available: 12
    }
  }), "fixture_lookup_mismatch");
});
