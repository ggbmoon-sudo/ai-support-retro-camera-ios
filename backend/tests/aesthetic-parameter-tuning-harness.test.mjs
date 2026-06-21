import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticParameterTuningHarnessSample,
  runAestheticParameterTuningDryRun
} from "../src/qa/aestheticParameterTuningHarness.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterTuningHarnessSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticParameterTuningDryRun(sample);
}

function firstCandidatePatch(patch) {
  return (sample) => Object.assign(sample.parameterCandidates[0], patch);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("valid reviewed synthetic candidates create parameter-pack candidate", () => {
  const report = runAestheticParameterTuningDryRun(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_tuning_harness_dry_run.v1");
  assert.equal(report.runMode, "parameter_tuning_dry_run");
  assert.equal(report.inputCandidateCount, 3);
  assert.equal(report.acceptedForCalibrationCount, 1);
  assert.equal(report.acceptedForEvalOnlyCount, 1);
  assert.equal(report.rejectedCandidateCount, 1);
  assert.deepEqual(report.blockedReasons, []);
  assert.deepEqual(report.thresholdMapCandidate.ERR_COMP_EXCESSIVE_HEADROOM, ["headroom_soft_high"]);
  assert.deepEqual(report.thresholdMapCandidate.ERR_COMP_HORIZON_TILT, ["horizon_tilt_soft"]);
  assert.equal(report.thresholdMapCandidate.ERR_COMP_RULE_OF_THIRDS_MISS, undefined);
  assert.equal(report.safeActionMapCandidate.ERR_COMP_EXCESSIVE_HEADROOM, "leave_less_empty_air_above");
  assert.equal(report.parameterPackCandidate.parameterPackVersion, "aesthetic_parameter_pack_candidate.dry_run.v1");
  assert.equal(report.parameterPackCandidate.createdFromRunMode, "dry_run_only");
  assert.equal(report.parameterPackCandidate.eligibleForAppRuntime, false);
  assert.equal(report.parameterPackCandidate.appRuntimeTransferBlocked, true);
  assert.equal(report.tuningDryRunValid, true);
  assert.equal(report.productionReady, false);
});

test("rejected candidate cannot influence parameter pack", () => {
  const report = runAestheticParameterTuningDryRun(cloneSample());

  assert.equal(report.thresholdMapCandidate.ERR_COMP_RULE_OF_THIRDS_MISS, undefined);
  assert.equal(report.safeActionMapCandidate.ERR_COMP_RULE_OF_THIRDS_MISS, undefined);
});

test("blocked review item cannot influence parameter pack", () => {
  const report = reportFor((sample) => {
    sample.parameterCandidates.push({
      ...sample.parameterCandidates[1],
      candidateId: "candidate_synthetic_blocked_depth_001",
      tag: "ERR_DEPTH_SUBJECT_BACKGROUND_MERGER",
      category: "depth_spatial_relations",
      featureKeys: ["subjectBackgroundDepthDelta", "boundaryColorDelta", "sharpnessRatio"],
      thresholdKeys: ["subject_background_delta_low", "boundary_color_delta_low"],
      suppressionCandidates: ["intentional_silhouette", "contextual_environmental_portrait", "low_confidence_detection"],
      safeActionKey: "shift_angle_for_cleaner_background",
      tuningCandidate: false
    });
    sample.featureBenchmarkSignals.push({
      vectorId: "cv_vector_synthetic_depth_blocked_001",
      jobId: "job_synthetic_review_004",
      imageId: "img_synthetic_review_004",
      tag: "ERR_DEPTH_SUBJECT_BACKGROUND_MERGER",
      sourceType: "synthetic_inline_numeric_features",
      featureSignals: {
        subjectBackgroundDepthDelta: 0.1,
        boundaryColorDelta: 0.2
      },
      thresholdSignals: ["subject_background_delta_low"],
      suppressionCandidates: ["intentional_silhouette"],
      safeActionKey: "shift_angle_for_cleaner_background",
      reviewStatus: "blocked",
      humanReviewRequired: true,
      tuningCandidate: false,
      eligibleForAppRuntime: false,
      appRuntimeTransferBlocked: true
    });
  });

  assert.equal(report.tuningDryRunValid, true);
  assert.equal(report.thresholdMapCandidate.ERR_DEPTH_SUBJECT_BACKGROUND_MERGER, undefined);
  assert.equal(report.safeActionMapCandidate.ERR_DEPTH_SUBJECT_BACKGROUND_MERGER, undefined);
});

test("unknown tag fails", () => {
  const report = reportFor(firstCandidatePatch({ tag: "ERR_FUTURE_UNKNOWN" }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "unknown_registry_tag_ERR_FUTURE_UNKNOWN"), true);
});

test("unknown feature key fails", () => {
  const report = reportFor(firstCandidatePatch({ featureKeys: ["futureFeature"] }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "unknown_feature_key_futureFeature"), true);
});

test("unknown threshold key fails", () => {
  const report = reportFor(firstCandidatePatch({ thresholdKeys: ["future_threshold"] }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "unknown_threshold_key_future_threshold"), true);
});

test("unsupported suppression key fails", () => {
  const report = reportFor(firstCandidatePatch({ suppressionCandidates: ["future_suppression"] }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "unknown_suppression_candidate_future_suppression"), true);
});

test("unsupported safeActionKey fails", () => {
  const report = reportFor(firstCandidatePatch({ safeActionKey: "future_action" }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "unsupported_safe_action_key_future_action"), true);
});

test("reviewRequired false fails", () => {
  const report = reportFor(firstCandidatePatch({ humanReviewRequired: false }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "human_review_required_not_true"), true);
});

test("eligibleForAppRuntime true fails", () => {
  const report = reportFor((sample) => {
    sample.eligibleForAppRuntime = true;
  });

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const report = reportFor((sample) => {
    sample.appRuntimeTransferBlocked = false;
  });

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "app_runtime_transfer_not_blocked"), true);
});

test("score and rating fail", () => {
  const report = reportFor(firstCandidatePatch({ qualityScore: 0.92, starRating: 5 }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "qualityScore"), true);
  assert.equal(blockedFor(report, "starRating"), true);
});

test("sensitive inference fails", () => {
  const report = reportFor(firstCandidatePatch({
    ageBucket: "adult",
    genderLabel: "unknown",
    emotionLabel: "happy",
    identityLabel: "person",
    sensitiveInference: "personality"
  }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "ageBucket"), true);
  assert.equal(blockedFor(report, "genderLabel"), true);
  assert.equal(blockedFor(report, "emotionLabel"), true);
  assert.equal(blockedFor(report, "identityLabel"), true);
  assert.equal(blockedFor(report, "sensitiveInference"), true);
});

test("free-form UI copy fails", () => {
  const report = reportFor(firstCandidatePatch({ uiCopy: "Move closer for a better photo." }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "uiCopy"), true);
});

test("raw teacher text fails", () => {
  const report = reportFor(firstCandidatePatch({ rawTeacherText: "unredacted teacher text" }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "rawTeacherText"), true);
});

test("raw provider, debug, and prompt leakage fails", () => {
  const report = reportFor(firstCandidatePatch({
    providerPayload: { hidden: true },
    debugText: "provider diagnostic text",
    promptText: "raw prompt"
  }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "providerPayload"), true);
  assert.equal(blockedFor(report, "debugText"), true);
  assert.equal(blockedFor(report, "promptText"), true);
});

test("local path fails", () => {
  const report = reportFor(firstCandidatePatch({ imagePath: "C:\\Users\\example\\private_photo.jpg" }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "imagePath"), true);
});

test("real URL fails", () => {
  const report = reportFor(firstCandidatePatch({ assetRef: "https://example.com/private-photo.jpg" }));
  const serialized = JSON.stringify(report);

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "assetRef"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("base64 raw image fails", () => {
  const report = reportFor(firstCandidatePatch({ rawImage: "data:image/png;base64,AAAA" }));

  assert.equal(report.tuningDryRunValid, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

for (const flag of [
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
  "cvInferencePerformed",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "fineTuningEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
]) {
  test(`${flag} true fails closed`, () => {
    const report = reportFor((sample) => {
      sample[flag] = true;
    });

    assert.equal(report.tuningDryRunValid, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("CLI confirms dry-run and all execution flags remain false", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-parameter-tuning-dry-run.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.tuningDryRunValid, true);
  assert.equal(report.runMode, "parameter_tuning_dry_run");
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.fineTuningEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.parameterPackCandidate.eligibleForAppRuntime, false);
  assert.equal(report.parameterPackCandidate.appRuntimeTransferBlocked, true);
  assert.equal(report.productionReady, false);
});
