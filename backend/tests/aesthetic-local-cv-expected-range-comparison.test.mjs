import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticLocalCvExpectedRangeComparisonSample,
  runAestheticLocalCvExpectedRangeComparison
} from "../src/qa/aestheticLocalCvExpectedRangeComparison.mjs";

function sampleWith(patch = {}) {
  const sample = aestheticLocalCvExpectedRangeComparisonSample();
  return {
    ...sample,
    ...patch,
    featureVector: {
      ...sample.featureVector,
      ...(patch.featureVector || {})
    }
  };
}

function reportFor(patch = {}) {
  return runAestheticLocalCvExpectedRangeComparison(sampleWith(patch));
}

function hasWarning(report, token) {
  return report.warningBuckets.some((bucket) => bucket.includes(token));
}

function hasBlocker(report, token) {
  return report.blockerBuckets.some((bucket) => bucket.includes(token));
}

test("OD-R7D-R1 sanitized fixture passes with soft warnings only", () => {
  const report = reportFor();

  assert.equal(report.runMode, "expected_range_comparison_no_image_read");
  assert.equal(report.fixtureToken, "calibration_001");
  assert.equal(report.comparisonPassed, true);
  assert.equal(report.acceptedForRangeReview, true);
  assert.equal(report.blockerBuckets.length, 0);
  assert.equal(hasWarning(report, "horizon"), true);
  assert.equal(hasWarning(report, "spatial_balance"), true);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.providerCallAttempted, false);
  assert.equal(report.generatedReportsPersisted, false);
  assert.equal(report.appRuntimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});

test("horizonAngle -4 creates soft warning but no blocker", () => {
  const report = reportFor({ featureVector: { horizonAngle: -4 } });
  const horizon = report.featureComparisons.find((item) => item.featureKey === "horizonAngle");

  assert.equal(report.comparisonPassed, true);
  assert.equal(horizon.status, "soft_warning");
  assert.equal(hasWarning(report, "horizon"), true);
  assert.equal(report.blockerBuckets.length, 0);
});

test("horizonAngle outside hard range blocks", () => {
  const report = reportFor({ featureVector: { horizonAngle: 46 } });

  assert.equal(report.comparisonPassed, false);
  assert.equal(report.acceptedForRangeReview, false);
  assert.equal(hasBlocker(report, "horizonAngle_outside_hard_range"), true);
});

test("headroomRatio non-numeric blocks", () => {
  const report = reportFor({ featureVector: { headroomRatio: "0.23" } });

  assert.equal(report.comparisonPassed, false);
  assert.equal(hasBlocker(report, "non_numeric_headroomRatio"), true);
});

test("highlightClipRatio outside zero to one blocks", () => {
  const report = reportFor({ featureVector: { highlightClipRatio: 1.1 } });

  assert.equal(report.comparisonPassed, false);
  assert.equal(hasBlocker(report, "highlightClipRatio_outside_hard_range"), true);
});

test("edgeMargin below expected creates soft warning", () => {
  const report = reportFor({ featureVector: { edgeMargin: 0.04 } });

  assert.equal(report.comparisonPassed, true);
  assert.equal(hasWarning(report, "edge_margin_low"), true);
});

test("backgroundObjectDensity high creates soft warning", () => {
  const report = reportFor({ featureVector: { backgroundObjectDensity: 0.42 } });

  assert.equal(report.comparisonPassed, true);
  assert.equal(hasWarning(report, "background_density_high"), true);
});

test("sharpnessRatio low creates soft warning", () => {
  const report = reportFor({ featureVector: { sharpnessRatio: 0.16 } });

  assert.equal(report.comparisonPassed, true);
  assert.equal(hasWarning(report, "sharpness_low_confidence"), true);
});

test("unknown subjectAnchor blocks", () => {
  const report = reportFor({ featureVector: { subjectAnchor: "upper_center" } });

  assert.equal(report.comparisonPassed, false);
  assert.equal(hasBlocker(report, "unknown_subjectAnchor_bucket"), true);
});

test("unknown visualWeightMoment blocks", () => {
  const report = reportFor({ featureVector: { visualWeightMoment: "diagonal_heavy" } });

  assert.equal(report.comparisonPassed, false);
  assert.equal(hasBlocker(report, "unknown_visualWeightMoment_bucket"), true);
});

test("right_heavy does not block", () => {
  const report = reportFor({ featureVector: { visualWeightMoment: "right_heavy" } });

  assert.equal(report.comparisonPassed, true);
  assert.equal(hasWarning(report, "spatial_balance"), true);
  assert.equal(report.blockerBuckets.length, 0);
});

for (const flag of [
  "imageReadsPerformed",
  "cvInferencePerformed",
  "networkCallsMade",
  "uploadPerformed",
  "providerCallAttempted",
  "generatedReportsPersisted",
  "appRuntimeIntegrationEnabled",
  "productionReady"
]) {
  test(`${flag}:true fails`, () => {
    const report = reportFor({ [flag]: true });

    assert.equal(report.comparisonPassed, false);
    assert.equal(hasBlocker(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
    assert.equal(report[flag], false);
  });
}

test("no score rating or aesthetic grading fields are emitted", () => {
  const report = reportFor();
  const serialized = JSON.stringify(report);

  assert.equal(/score|rating|aestheticGrade|aesthetic_grade/i.test(serialized), false);
});

test("CLI compares inline sanitized fixture without image read", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-local-cv-expected-range-comparison.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "expected_range_comparison_no_image_read");
  assert.equal(report.fixtureToken, "calibration_001");
  assert.equal(report.comparisonPassed, true);
  assert.equal(report.acceptedForRangeReview, true);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.providerCallAttempted, false);
  assert.equal(report.productionReady, false);
});
