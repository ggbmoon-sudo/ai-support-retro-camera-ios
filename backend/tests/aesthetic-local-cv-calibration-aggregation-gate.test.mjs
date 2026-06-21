import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticLocalCvCalibrationAggregationSample,
  reviewedCalibrationFeatureVectors,
  runAestheticLocalCvCalibrationAggregationGate
} from "../src/qa/aestheticLocalCvCalibrationAggregationGate.mjs";
import {
  aestheticLocalCvExpectedRangeComparisonSample,
  runAestheticLocalCvExpectedRangeComparison
} from "../src/qa/aestheticLocalCvExpectedRangeComparison.mjs";

function expectedRangeReportFor(index = 1, featureVectorPatch = {}) {
  const sample = aestheticLocalCvExpectedRangeComparisonSample();
  return runAestheticLocalCvExpectedRangeComparison({
    ...sample,
    fixtureToken: `calibration_${String(index).padStart(3, "0")}`,
    featureVector: {
      ...sample.featureVector,
      horizonAngle: 0,
      visualWeightMoment: "balanced",
      ...featureVectorPatch
    }
  });
}

function aggregationFor(patch = {}) {
  return runAestheticLocalCvCalibrationAggregationGate({
    ...aestheticLocalCvCalibrationAggregationSample(),
    ...patch
  });
}

function hasBlocker(report, token) {
  return report.blockerBuckets.some((bucket) => bucket.includes(token));
}

test("single calibration_001 aggregates with insufficient sample size", () => {
  const report = aggregationFor({
    comparisons: [runAestheticLocalCvExpectedRangeComparison(aestheticLocalCvExpectedRangeComparisonSample())]
  });

  assert.equal(report.runMode, "multi_fixture_aggregation_no_image_read");
  assert.equal(report.fixtureCount, 1);
  assert.deepEqual(report.fixtureTokens, ["calibration_001"]);
  assert.equal(report.insufficientSampleSize, true);
  assert.equal(report.minimumRecommendedFixtureCount, 5);
  assert.equal(report.acceptedForCalibrationAggregationReview, true);
  assert.equal(report.eligibleForParameterTuning, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.productionReady, false);
});

test("single fixture warning frequency counts both soft warning buckets", () => {
  const report = aggregationFor({
    comparisons: [runAestheticLocalCvExpectedRangeComparison(aestheticLocalCvExpectedRangeComparisonSample())]
  });

  assert.equal(report.warningFrequencyBuckets.soft_horizon_tilt_left, 1);
  assert.equal(report.warningFrequencyBuckets.soft_spatial_balance_review, 1);
  assert.deepEqual(report.blockerBuckets, []);
});

test("five reviewed sanitized fixtures aggregate by default", () => {
  const report = aggregationFor();

  assert.equal(report.runMode, "multi_fixture_aggregation_no_image_read");
  assert.equal(report.fixtureCount, 5);
  assert.deepEqual(report.fixtureTokens, [
    "calibration_001",
    "calibration_002",
    "calibration_003",
    "calibration_004",
    "calibration_005"
  ]);
  assert.equal(reviewedCalibrationFeatureVectors().length, 5);
  assert.equal(report.insufficientSampleSize, false);
  assert.equal(report.minimumRecommendedFixtureCount, 5);
  assert.equal(report.acceptedForCalibrationAggregationReview, true);
  assert.equal(report.eligibleForParameterTuning, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.productionReady, false);
  assert.deepEqual(report.blockerBuckets, []);
});

test("five reviewed fixtures emit non-judgmental warning frequencies", () => {
  const report = aggregationFor();

  assert.equal(report.warningFrequencyBuckets.soft_horizon_tilt_left, 1);
  assert.equal(report.warningFrequencyBuckets.soft_horizon_tilt_right, 1);
  assert.equal(report.warningFrequencyBuckets.strong_horizon_tilt_review, 1);
  assert.equal(report.warningFrequencyBuckets.soft_low_sharpness_review, 3);
  assert.equal(report.warningFrequencyBuckets.soft_spatial_balance_review, 4);
  assert.equal(report.warningFrequencyBuckets.soft_headroom_high, 1);
  assert.equal(report.blockerBuckets.length, 0);
});

test("calibration_005 strong horizon tilt review is not a hard blocker", () => {
  const report = aggregationFor();

  assert.equal(report.fixtureTokens.includes("calibration_005"), true);
  assert.equal(report.warningFrequencyBuckets.strong_horizon_tilt_review, 1);
  assert.equal(report.blockerBuckets.length, 0);
  assert.equal(report.acceptedForCalibrationAggregationReview, true);
});

test("five clean synthetic reviewed fixtures clear insufficient sample size", () => {
  const comparisons = [1, 2, 3, 4, 5].map((index) => expectedRangeReportFor(index));
  const report = aggregationFor({ comparisons });

  assert.equal(report.fixtureCount, 5);
  assert.equal(report.insufficientSampleSize, false);
  assert.equal(report.acceptedForCalibrationAggregationReview, true);
  assert.equal(report.eligibleForParameterTuning, false);
  assert.deepEqual(report.warningFrequencyBuckets, {});
  assert.equal(report.productionReady, false);
});

test("duplicate fixture token blocks aggregation", () => {
  const comparison = expectedRangeReportFor(1);
  const report = aggregationFor({ comparisons: [comparison, comparison] });

  assert.equal(report.acceptedForCalibrationAggregationReview, false);
  assert.equal(hasBlocker(report, "duplicate_fixture_token_calibration_001"), true);
});

test("unknown feature key blocks aggregation", () => {
  const comparison = expectedRangeReportFor(1);
  comparison.reviewedFeatureKeys = [...comparison.reviewedFeatureKeys, "unknownFeature"];
  const report = aggregationFor({ comparisons: [comparison] });

  assert.equal(hasBlocker(report, "unknown_feature_key_unknownFeature"), true);
});

test("unknown warning bucket blocks aggregation", () => {
  const comparison = expectedRangeReportFor(1);
  comparison.warningBuckets = ["soft_unknown_warning"];
  const report = aggregationFor({ comparisons: [comparison] });

  assert.equal(hasBlocker(report, "unknown_warning_bucket_soft_unknown_warning"), true);
});

test("raw path base64 EXIF GPS and raw metadata fields block aggregation", () => {
  for (const patch of [
    { imagePath: "C:\\Users\\example\\photo.jpg" },
    { rawImageBase64: "data:image/jpeg;base64,/9j/example" },
    { exif: { camera: "hidden" } },
    { gps: "22.3,114.1" },
    { rawMetadata: { anything: true } }
  ]) {
    const report = aggregationFor(patch);
    assert.equal(report.acceptedForCalibrationAggregationReview, false);
    assert.equal(report.blockerBuckets.length > 0, true);
  }
});

for (const flag of [
  "providerCallAttempted",
  "networkCallsMade",
  "uploadPerformed",
  "imageReadsPerformed",
  "cvInferencePerformed",
  "generatedReportsPersisted",
  "appRuntimeIntegrationEnabled",
  "productionReady"
]) {
  test(`${flag}:true blocks aggregation`, () => {
    const report = aggregationFor({ [flag]: true });

    assert.equal(report.acceptedForCalibrationAggregationReview, false);
    assert.equal(hasBlocker(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
    assert.equal(report[flag], false);
  });
}

test("eligibleForAppRuntime true blocks aggregation", () => {
  const report = aggregationFor({ eligibleForAppRuntime: true });

  assert.equal(report.acceptedForCalibrationAggregationReview, false);
  assert.equal(hasBlocker(report, "eligible_for_app_runtime_true"), true);
  assert.equal(report.eligibleForAppRuntime, false);
});

test("no score rating or aesthetic grading fields are emitted", () => {
  const report = aggregationFor();
  const serialized = JSON.stringify(report);

  assert.equal(/score|rating|aestheticGrade|aesthetic_grade/i.test(serialized), false);
});

test("no retake-first recommendation is emitted", () => {
  const report = aggregationFor();

  assert.equal(/retake/i.test(report.recommendedNextStep), false);
});

test("CLI aggregates inline sanitized comparison without image read", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-local-cv-calibration-aggregation-gate.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "multi_fixture_aggregation_no_image_read");
  assert.equal(report.fixtureCount, 5);
  assert.equal(report.insufficientSampleSize, false);
  assert.equal(report.acceptedForCalibrationAggregationReview, true);
  assert.equal(report.eligibleForParameterTuning, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.providerCallAttempted, false);
  assert.equal(report.productionReady, false);
});
