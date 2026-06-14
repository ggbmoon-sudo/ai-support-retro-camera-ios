import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  assertOpenWeightVlmBenchmarkReportRedacted,
  evaluateOpenWeightVlmBenchmarkCase,
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  summarizeOpenWeightVlmBenchmark,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";

const FIXTURE_URL = new URL("./fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json", import.meta.url);
const SCRIPT_URL = new URL("../scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs", import.meta.url);

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

  for (const item of cases.filter((fixture) => fixture.expectedStatus === "rejected")) {
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

async function benchmarkCases() {
  const fixture = JSON.parse(await readFile(FIXTURE_URL, "utf8"));
  return fixture.cases;
}

function validFixture(id, cases) {
  const item = cases.find((fixture) => fixture.id === id);
  assert.ok(item, `Missing fixture ${id}`);
  return item;
}
