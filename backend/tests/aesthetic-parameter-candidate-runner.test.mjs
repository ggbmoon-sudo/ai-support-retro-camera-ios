import assert from "node:assert/strict";
import test from "node:test";
import {
  aestheticParameterCandidateRunnerSample,
  runAestheticParameterCandidateDryRun
} from "../src/qa/aestheticParameterCandidateRunner.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterCandidateRunnerSample());
}

function firstLabelPatch(patch) {
  const sample = cloneSample();
  sample.teacherRuns[0].response.candidateLabels[0] = {
    ...sample.teacherRuns[0].response.candidateLabels[0],
    ...patch
  };
  return sample;
}

function blockedFor(report, fragment) {
  return report.blockedReasons.some((reason) => reason.includes(fragment));
}

test("valid teacher stubs produce structured parameter candidates", () => {
  const report = runAestheticParameterCandidateDryRun(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_candidate_runner_dry_run.v1");
  assert.equal(report.runMode, "dry_run");
  assert.equal(report.teacherRunCount, 1);
  assert.equal(report.parameterCandidateCount, 3);
  assert.equal(report.tagCounts.ERR_COMP_RULE_OF_THIRDS_MISS, 1);
  assert.equal(report.featureKeyCounts.subjectAnchor, 1);
  assert.equal(report.thresholdKeyCounts.visual_weight_imbalance_soft, 1);
  assert.equal(report.suppressionCandidateCounts.intentional_centering, 1);
  assert.equal(report.safeActionCounts.keep_if_intentional, 1);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
  assert.equal(report.productionReady, false);
  assert.equal(report.dryRunValid, true);
});

test("unknown tag fails through OD-R4 contract validation", () => {
  const sample = cloneSample();
  sample.teacherRuns[0].request.allowedTagSubset = ["ERR_UNKNOWN_TAG"];
  sample.teacherRuns[0].response.candidateLabels[0].tag = "ERR_UNKNOWN_TAG";

  const report = runAestheticParameterCandidateDryRun(sample);

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "blocked_for_contract_blocked_for_unknown_registry_tag_ERR_UNKNOWN_TAG"), true);
});

test("raw image and base64 fields fail closed", () => {
  const sample = cloneSample();
  sample.teacherRuns[0].request.rawImage = "/9j/base64payload";

  const report = runAestheticParameterCandidateDryRun(sample);

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

test("local path and real URL fail closed without echoing values", () => {
  const sample = cloneSample();
  sample.teacherRuns[0].request.localFilePath = "C:\\Users\\example\\private_photo.jpg";
  sample.teacherRuns[0].request.assetRef = "https://example.com/private-photo.jpg";

  const report = runAestheticParameterCandidateDryRun(sample);
  const serialized = JSON.stringify(report);

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "localFilePath"), true);
  assert.equal(blockedFor(report, "assetRef"), true);
  assert.equal(serialized.includes("private_photo.jpg"), false);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("provider model and API key fields fail", () => {
  const report = runAestheticParameterCandidateDryRun(
    firstLabelPatch({ providerModelName: "future-model", apiKey: "secret" })
  );

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "providerModelName"), true);
  assert.equal(blockedFor(report, "apiKey"), true);
});

test("score rating free-form copy and sensitive inference fail", () => {
  const report = runAestheticParameterCandidateDryRun(
    firstLabelPatch({
      scoreValue: 99,
      starRating: 5,
      uiCopy: "Retake this bad photo now.",
      ageBucket: "adult"
    })
  );

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "scoreValue"), true);
  assert.equal(blockedFor(report, "starRating"), true);
  assert.equal(blockedFor(report, "uiCopy"), true);
  assert.equal(blockedFor(report, "ageBucket"), true);
});

test("human review disabled fails", () => {
  const sample = cloneSample();
  sample.teacherRuns[0].response.review.humanReviewRequired = false;
  sample.teacherRuns[0].response.candidateLabels[0].needsHumanReview = false;

  const report = runAestheticParameterCandidateDryRun(sample);

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "blocked_for_contract_blocked_for_review_missing_human_review_requirement"), true);
});

test("app runtime transfer enabled fails", () => {
  const sample = cloneSample();
  sample.teacherRuns[0].response.appTransferReadiness.eligibleForAppRuntime = true;

  const report = runAestheticParameterCandidateDryRun(sample);

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "blocked_for_app_runtime_transfer_eligibility"), true);
});

test("app runtime transfer not blocked fails", () => {
  const sample = cloneSample();
  sample.teacherRuns[0].response.appTransferReadiness.appRuntimeTransferBlocked = false;

  const report = runAestheticParameterCandidateDryRun(sample);

  assert.equal(report.dryRunValid, false);
  assert.equal(blockedFor(report, "blocked_for_app_runtime_transfer_not_blocked"), true);
});

for (const flag of [
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
]) {
  test(`${flag} true fails closed`, () => {
    const report = runAestheticParameterCandidateDryRun({ ...cloneSample(), [flag]: true });

    assert.equal(report.dryRunValid, false);
    assert.equal(blockedFor(report, `blocked_for_${flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)}_not_false`), true);
  });
}

test("output confirms dry-run flags remain false and app transfer remains blocked", () => {
  const report = runAestheticParameterCandidateDryRun(cloneSample());

  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
});
