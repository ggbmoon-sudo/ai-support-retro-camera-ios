import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  SILICONFLOW_BENCHMARK_DEFAULT_BLOCKERS,
  SILICONFLOW_BENCHMARK_FIXTURE_TOKENS,
  buildSiliconFlowBenchmarkDryRunPlan,
  evaluateSiliconFlowBenchmarkDryRunPlan,
  siliconFlowBenchmarkDryRunReport
} from "../src/providers/siliconflowPhotoAdvisorBenchmarkPlan.mjs";

test("SiliconFlow dry-run plan pins exactly smoke_004 through smoke_015", () => {
  const plan = buildSiliconFlowBenchmarkDryRunPlan();

  assert.equal(plan.fixtureTokens.length, 12);
  assert.deepEqual(plan.fixtureTokens, [
    "smoke_004",
    "smoke_005",
    "smoke_006",
    "smoke_007",
    "smoke_008",
    "smoke_009",
    "smoke_010",
    "smoke_011",
    "smoke_012",
    "smoke_013",
    "smoke_014",
    "smoke_015"
  ]);
  assert.deepEqual(plan.fixtureTokens, [...SILICONFLOW_BENCHMARK_FIXTURE_TOKENS]);
});

test("SiliconFlow dry-run plan stays no-runtime and fail-closed", () => {
  const plan = buildSiliconFlowBenchmarkDryRunPlan();

  assert.equal(plan.expectedFixtureCount, 12);
  assert.equal(plan.plannedCallCount, 12);
  assert.equal(plan.actualCallCount, 0);
  assert.equal(plan.retryCount, 0);
  assert.equal(plan.benchmarkApproved, false);
  assert.equal(plan.executionAllowed, false);
  assert.equal(plan.networkCallsMade, false);
  assert.equal(plan.apiKeyRead, false);
  assert.equal(plan.fixtureImagesOpened, false);
  assert.equal(plan.productionReady, false);
  assert.equal(plan.imageDetail, "low");
  assert.equal(plan.stream, false);
  assert.equal(plan.maxOutputTokens, 256);
  assert.equal(plan.temperature, 0.1);

  const evaluation = evaluateSiliconFlowBenchmarkDryRunPlan(plan);
  assert.equal(evaluation.ok, false);
  assert.equal(evaluation.safeToExecute, false);
  assert.deepEqual(
    SILICONFLOW_BENCHMARK_DEFAULT_BLOCKERS.every((blocker) => evaluation.blockers.includes(blocker)),
    true
  );
});

test("SiliconFlow dry-run does not read API key env, fixture files, images, or fetch", () => {
  const originalFetch = globalThis.fetch;
  let fetchCalled = false;
  globalThis.fetch = () => {
    fetchCalled = true;
    throw new Error("fetch must not be called");
  };

  try {
    const report = siliconFlowBenchmarkDryRunReport(buildSiliconFlowBenchmarkDryRunPlan());
    const output = JSON.stringify(report);

    assert.equal(fetchCalled, false);
    assert.equal(report.apiKeyRead, false);
    assert.equal(report.fixtureImagesOpened, false);
    assert.equal(report.networkCallsMade, false);
    assert.doesNotMatch(output, /SILICONFLOW_API_KEY|Bearer |https?:\/\/|data:image|base64|fixturePath|rawPrompt|rawOutput|requestPayload/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("SiliconFlow dry-run report contains sanitized blockers only", () => {
  const report = siliconFlowBenchmarkDryRunReport();

  assert.equal(report.phase, "Phase 21-Z2C-SF-RUN-PRE");
  assert.equal(report.futureRunPhase, "Phase 21-Z2C-SF-RUN");
  assert.equal(report.providerClass, "siliconflow");
  assert.equal(report.modelClass, "qwen3_vl_30b_a3b_instruct");
  assert.equal(report.fixtureCount, 12);
  assert.equal(report.plannedCallCount, 12);
  assert.equal(report.actualCallCount, 0);
  assert.equal(report.retryCount, 0);
  assert.equal(report.benchmarkApproved, false);
  assert.equal(report.executionAllowed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.apiKeyRead, false);
  assert.equal(report.fixtureImagesOpened, false);
  assert.equal(report.productionReady, false);
  assert.ok(report.blockers.includes("benchmark_not_approved"));
  assert.ok(report.blockers.includes("provider_network_not_approved"));
  assert.ok(report.blockers.includes("provider_credentials_not_loaded"));
  assert.ok(report.blockers.includes("provider_upload_not_approved"));
  assert.ok(report.blockers.includes("api_runtime_disabled"));
});

test("SiliconFlow dry-run fails closed for invalid plan mutations", () => {
  const cases = [
    [buildSiliconFlowBenchmarkDryRunPlan({ fixtureTokens: ["smoke_004"] }), "fixture_token_list_mismatch"],
    [buildSiliconFlowBenchmarkDryRunPlan({ expectedFixtureCount: 11 }), "fixture_count_mismatch"],
    [buildSiliconFlowBenchmarkDryRunPlan({ plannedCallCount: 11 }), "planned_call_count_mismatch"],
    [buildSiliconFlowBenchmarkDryRunPlan({ actualCallCount: 1 }), "actual_call_count_not_zero"],
    [buildSiliconFlowBenchmarkDryRunPlan({ retryCount: 1 }), "retry_count_not_zero"],
    [buildSiliconFlowBenchmarkDryRunPlan({ benchmarkApproved: true }), "benchmark_approval_must_be_false_in_preflight"],
    [buildSiliconFlowBenchmarkDryRunPlan({ executionAllowed: true }), "execution_must_be_disabled"],
    [buildSiliconFlowBenchmarkDryRunPlan({ networkCallsMade: true }), "network_call_detected"],
    [buildSiliconFlowBenchmarkDryRunPlan({ apiKeyRead: true }), "api_key_read_detected"],
    [buildSiliconFlowBenchmarkDryRunPlan({ fixtureImagesOpened: true }), "fixture_image_read_detected"],
    [buildSiliconFlowBenchmarkDryRunPlan({ productionReady: true }), "production_ready_must_be_false"]
  ];

  for (const [plan, blocker] of cases) {
    const evaluation = evaluateSiliconFlowBenchmarkDryRunPlan(plan);
    assert.equal(evaluation.ok, false, blocker);
    assert.equal(evaluation.safeToExecute, false, blocker);
    assert.ok(evaluation.blockers.includes(blocker), blocker);
  }
});

test("SiliconFlow dry-run CLI prints sanitized JSON only", () => {
  const output = execFileSync("node", ["scripts/check-siliconflow-photo-advisor-benchmark-dry-run.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {
      PATH: process.env.PATH ?? "",
      SILICONFLOW_API_KEY: "fake-key-that-must-not-be-read-or-printed"
    }
  });
  const report = JSON.parse(output);

  assert.equal(report.networkCallsMade, false);
  assert.equal(report.apiKeyRead, false);
  assert.equal(report.fixtureImagesOpened, false);
  assert.equal(report.productionReady, false);
  assert.doesNotMatch(output, /fake-key|Bearer |https?:\/\/|data:image|base64|rawPrompt|rawOutput|requestPayload|fixturePath/);
});
