import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticParameterTuningAggregationBridgeSample,
  runAestheticParameterTuningAggregationBridge
} from "../src/qa/aestheticParameterTuningAggregationBridge.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterTuningAggregationBridgeSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticParameterTuningAggregationBridge(sample);
}

function sourcePatch(patch) {
  return (sample) => patch(sample.sourceAggregation, sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("current OD-R7F-R2 aggregation passes tuning bridge review", () => {
  const report = runAestheticParameterTuningAggregationBridge(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_tuning_aggregation_bridge.v1");
  assert.equal(report.runMode, "parameter_tuning_aggregation_bridge_no_runtime");
  assert.equal(report.fixtureCount, 5);
  assert.equal(report.minimumRecommendedFixtureCount, 5);
  assert.equal(report.sampleSizeGatePassed, true);
  assert.equal(report.blockerGatePassed, true);
  assert.equal(report.acceptedForTuningBridgeReview, true);
  assert.equal(report.eligibleForParameterTuningDryRun, true);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.warningFrequencyBuckets.soft_low_sharpness_review, 3);
  assert.equal(report.warningFrequencyBuckets.soft_spatial_balance_review, 4);
  assert.equal(report.proposedTuningSignals.length, 4);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.productionReady, false);
});

test("fixtureCount 5 passes sample size gate", () => {
  const report = runAestheticParameterTuningAggregationBridge(cloneSample());

  assert.equal(report.fixtureCount, 5);
  assert.equal(report.sampleSizeGatePassed, true);
});

test("fixtureCount below 5 blocks tuning bridge review", () => {
  const report = reportFor(sourcePatch((source) => {
    source.fixtureCount = 4;
    source.insufficientSampleSize = true;
  }));

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(report.eligibleForParameterTuningDryRun, false);
  assert.equal(blockedFor(report, "source_fixture_count_below_minimum"), true);
});

test("non-empty blockerBuckets blocks tuning bridge review", () => {
  const report = reportFor(sourcePatch((source) => {
    source.blockerBuckets = ["blocked_for_manual_review"];
  }));

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(report.blockerGatePassed, false);
  assert.equal(blockedFor(report, "source_blocker_buckets_present"), true);
});

test("unknown warning bucket blocks", () => {
  const report = reportFor(sourcePatch((source) => {
    source.warningFrequencyBuckets.soft_unknown_warning = 1;
  }));

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(blockedFor(report, "unknown_warning_bucket_soft_unknown_warning"), true);
});

test("unknown feature key blocks", () => {
  const report = reportFor(sourcePatch((source) => {
    source.reviewedFeatureKeys = [...source.reviewedFeatureKeys, "futureFeature"];
  }));

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(blockedFor(report, "unknown_feature_key_futureFeature"), true);
});

test("sampleSizeGatePassed false blocks", () => {
  const report = reportFor(sourcePatch((source) => {
    source.insufficientSampleSize = true;
  }));

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(report.sampleSizeGatePassed, false);
  assert.equal(blockedFor(report, "source_sample_size_gate_not_passed"), true);
});

test("eligibleForParameterPackExport true blocks", () => {
  const report = reportFor((sample) => {
    sample.eligibleForParameterPackExport = true;
  });

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(blockedFor(report, "parameter_pack_export_eligibility"), true);
});

test("eligibleForAppRuntime true blocks", () => {
  const report = reportFor((sample) => {
    sample.eligibleForAppRuntime = true;
  });

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("productionReady true blocks", () => {
  const report = reportFor((sample) => {
    sample.productionReady = true;
  });

  assert.equal(report.acceptedForTuningBridgeReview, false);
  assert.equal(blockedFor(report, "production_ready_true"), true);
  assert.equal(report.productionReady, false);
});

for (const flag of [
  "imageReadsPerformed",
  "cvInferencePerformed",
  "networkCallsMade",
  "uploadPerformed",
  "providerCallAttempted",
  "generatedReportsPersisted",
  "appRuntimeIntegrationEnabled"
]) {
  test(`${flag} true blocks`, () => {
    const report = reportFor((sample) => {
      sample[flag] = true;
    });

    assert.equal(report.acceptedForTuningBridgeReview, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
    assert.equal(report[flag], false);
  });
}

test("no score rating or aesthetic grading fields are emitted", () => {
  const report = runAestheticParameterTuningAggregationBridge(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/score|rating|aestheticGrade|aesthetic_grade/i.test(serialized), false);
});

test("no retake-first recommendation is emitted", () => {
  const report = runAestheticParameterTuningAggregationBridge(cloneSample());

  assert.equal(/retake/i.test(report.recommendedNextStep), false);
});

test("proposed tuning signals remain internal and non-user-facing", () => {
  const report = runAestheticParameterTuningAggregationBridge(cloneSample());

  assert.equal(report.proposedTuningSignals.length > 0, true);
  for (const signal of report.proposedTuningSignals) {
    assert.equal(signal.internalOnly, true);
    assert.equal(signal.userFacing, false);
  }
  assert.deepEqual(
    report.proposedTuningSignals.map((signal) => signal.signalKey).sort(),
    [
      "headroom_ratio_high_threshold_review",
      "horizon_angle_threshold_review",
      "sharpness_ratio_low_confidence_threshold_review",
      "visual_weight_moment_spatial_balance_review"
    ]
  );
});

test("raw path URL base64 prompt provider debug and sensitive fields block", () => {
  for (const patch of [
    { imagePath: "C:\\Users\\example\\photo.jpg" },
    { downloadUrl: "https://example.com/photo.jpg" },
    { rawImageBase64: "data:image/jpeg;base64,/9j/example" },
    { rawPrompt: "hidden prompt" },
    { providerPayload: { hidden: true } },
    { debugText: "hidden diagnostics" },
    { sensitiveInference: "identity" },
    { qualityScore: 1 },
    { starRating: 5 }
  ]) {
    const report = reportFor((sample) => {
      Object.assign(sample.sourceAggregation, patch);
    });
    assert.equal(report.acceptedForTuningBridgeReview, false);
    assert.equal(report.blockedReasons.length > 0, true);
  }
});

test("CLI emits sanitized bridge output without image read or runtime eligibility", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-parameter-tuning-aggregation-bridge.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "parameter_tuning_aggregation_bridge_no_runtime");
  assert.equal(report.fixtureCount, 5);
  assert.equal(report.sampleSizeGatePassed, true);
  assert.equal(report.blockerGatePassed, true);
  assert.equal(report.acceptedForTuningBridgeReview, true);
  assert.equal(report.eligibleForParameterTuningDryRun, true);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.providerCallAttempted, false);
  assert.equal(report.generatedReportsPersisted, false);
  assert.equal(report.appRuntimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
