import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluateOpenWeightVlmBenchmarkGate } from "../src/qa/openWeightVlmBenchmarkGate.mjs";
import {
  assertOpenWeightVlmBenchmarkReportRedacted,
  evaluateOpenWeightVlmBenchmarkCase,
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  summarizeOpenWeightVlmBenchmark,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";

const FIXTURE_URL = new URL("./fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json", import.meta.url);
const SCRIPT_URL = new URL("../scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs", import.meta.url);
const GATE_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs", import.meta.url);

test("open-weight VLM validator accepts valid synthetic benchmark fixtures", async () => {
  const cases = await benchmarkCases();

  for (const item of cases.filter((fixture) => fixture.expectedStatus === "accepted")) {
    const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

    assert.equal(result.ok, true, item.id);
    assert.equal(result.value.schemaVersion, OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION, item.id);
    assert.equal(result.value.safety.sensitiveInferenceDetected, false, item.id);
  }
});

test("open-weight VLM validator rejects invalid benchmark fixtures with expected codes", async () => {
  const cases = await benchmarkCases();

  for (const item of cases.filter((fixture) => fixture.expectedStatus === "rejected" && !fixture.stubFailure)) {
    const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

    assert.equal(result.ok, false, item.id);
    assert.equal(result.error.code, item.expectedCode, item.id);
    assert.equal(JSON.stringify(result).includes("provider debug output"), false, item.id);
    assert.equal(JSON.stringify(result).includes("score.8/10"), false, item.id);
  }
});

test("open-weight VLM validator rejects unsupported enum values", async () => {
  const base = validFixture("valid_bright_daylight", await benchmarkCases());
  const candidate = structuredClone(base.modelOutput);
  candidate.moodKey = "mood.provider_made_this_up";

  const result = validateOpenWeightVlmPhotoAdvisorCandidate(candidate);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unsupported_enum");
});

test("open-weight VLM validator rejects imported capture-context overclaims", async () => {
  const item = validFixture("imported_source_context_overclaim", await benchmarkCases());
  const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "source_context_overclaim");
});

test("open-weight VLM validator gates retake false positives", async () => {
  const item = validFixture("retake_false_positive", await benchmarkCases());
  const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "retake_gate");
});

test("open-weight VLM benchmark report is sanitized aggregate output", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const serialized = JSON.stringify(report);

  assert.equal(report.productionReady, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.modelServerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.expectationFailureCount, 0);
  assert.equal(report.rawImagePersisted, false);
  assert.equal(report.rawPromptPersisted, false);
  assert.equal(report.rawModelResponsePersisted, false);
  assert.equal(assertOpenWeightVlmBenchmarkReportRedacted(report).ok, true);
  assert.equal(serialized.includes("modelOutput"), false);
  assert.equal(serialized.includes("{ not valid json"), false);
  assert.equal(serialized.includes("provider debug output"), false);
  assert.equal(serialized.includes("score.8/10"), false);
});

test("open-weight VLM benchmark fixtures cover the expanded failure taxonomy", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const requiredCategories = [
    "invalid_json",
    "schema_failed",
    "unsupported_enum",
    "unsupported_filter_family",
    "sensitive_inference",
    "score_or_rating",
    "chain_of_thought",
    "debug_or_provider_leakage",
    "source_context_overclaim",
    "retake_false_positive",
    "overlong_output",
    "prompt_injection",
    "raw_localization_key",
    "unsafe_free_text",
    "timeout_stub"
  ];

  assert.equal(cases.length >= 34, true);
  assert.equal(report.totalCases, 40);
  for (const category of requiredCategories) {
    assert.equal(report.failureTaxonomyCoverage[category] > 0, true, category);
  }
});

test("open-weight VLM synthetic benchmark script prints sanitized metrics only", () => {
  const output = execFileSync(process.execPath, [SCRIPT_URL.pathname, "--synthetic"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.expectationFailureCount, 0);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("{ not valid json"), false);
  assert.equal(output.includes("provider debug output"), false);
  assert.equal(output.includes("score.8/10"), false);
});

test("open-weight VLM benchmark gate passes clean synthetic report", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const gate = evaluateOpenWeightVlmBenchmarkGate(report);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForSyntheticContractReview, true);
  assert.deepEqual(gate.hardBlockers, []);
  assert.equal(gate.statusCategories.includes("pass_for_synthetic_contract"), true);
  assert.equal(gate.reviewedMetrics.totalCases, 40);
  assert.equal(gate.reviewedMetrics.expectationFailureCount, 0);
  assert.equal(gate.blockedFixtureCounts.safetyBlockers, 3);
  assert.equal(gate.blockedFixtureCounts.schemaBlockers, 4);
  assert.equal(gate.blockedFixtureCounts.sourceContextOverclaimBlockers, 1);
  assert.equal(gate.blockedFixtureCounts.retakeGateBlockers, 1);
  assert.equal(gate.blockedFixtureCounts.leakageBlockers, 1);
  assert.equal(gate.blockedFixtureCounts.providerIntegrationBlockers, 1);
});

test("open-weight VLM benchmark gate blocks synthetic regressions", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const gate = evaluateOpenWeightVlmBenchmarkGate({
    ...report,
    expectationFailureCount: 1,
    acceptedSensitiveInferenceCount: 1,
    acceptedScoreRatingCount: 1,
    acceptedChainOfThoughtCount: 1,
    acceptedDebugLeakageCount: 1,
    acceptedSourceContextOverclaimCount: 1,
    acceptedUnsupportedFilterCount: 1,
    acceptedOverlongOutputCount: 1,
    acceptedPromptInjectionCount: 1,
    acceptedRawLocalizationKeyCount: 1,
    acceptedUnsafeFreeTextCount: 1,
    acceptedTimeoutStubCount: 1,
    networkCallsMade: true,
    productionReady: true
  });
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForSyntheticContractReview, false);
  assert.equal(blockerCodes.has("expectation_failures"), true);
  assert.equal(blockerCodes.has("accepted_sensitive_inference"), true);
  assert.equal(blockerCodes.has("accepted_score_rating"), true);
  assert.equal(blockerCodes.has("accepted_chain_of_thought"), true);
  assert.equal(blockerCodes.has("accepted_debug_leakage"), true);
  assert.equal(blockerCodes.has("accepted_imported_overclaim"), true);
  assert.equal(blockerCodes.has("accepted_unsupported_filter"), true);
  assert.equal(blockerCodes.has("accepted_overlong_output"), true);
  assert.equal(blockerCodes.has("accepted_prompt_injection"), true);
  assert.equal(blockerCodes.has("accepted_raw_localization_key"), true);
  assert.equal(blockerCodes.has("accepted_unsafe_free_text"), true);
  assert.equal(blockerCodes.has("accepted_timeout_stub"), true);
  assert.equal(blockerCodes.has("network_calls_made"), true);
  assert.equal(blockerCodes.has("production_ready_true"), true);
});

test("open-weight VLM benchmark gate script prints sanitized pass/fail summary only", () => {
  const output = execFileSync(process.execPath, [GATE_SCRIPT_URL.pathname, "--synthetic"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const gate = JSON.parse(output);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForSyntheticContractReview, true);
  assert.equal(gate.hardBlockers.length, 0);
  assert.equal(gate.blockedFixtureCounts.safetyBlockers, 3);
  assert.equal(gate.blockedFixtureCounts.leakageBlockers, 1);
  assert.equal(gate.reviewedMetrics.networkCallsMade, false);
  assert.equal(gate.reviewedMetrics.totalCases, 40);
  assert.equal(gate.reviewedMetrics.failureTaxonomyCoverage.timeout_stub, 1);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("{ not valid json"), false);
  assert.equal(output.includes("provider debug output"), false);
  assert.equal(output.includes("score.8/10"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
  assert.equal(output.includes("dataBase64"), false);
});

async function benchmarkCases() {
  const fixture = JSON.parse(await readFile(FIXTURE_URL, "utf8"));
  return fixture.cases;
}

function validFixture(id, cases) {
  const item = cases.find((fixture) => fixture.id === id);
  assert.ok(item, `Missing fixture ${id}`);
  return item;
}
