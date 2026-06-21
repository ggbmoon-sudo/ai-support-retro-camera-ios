import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticParameterTuningDryRunFromBridgeSample,
  runAestheticParameterTuningDryRunFromBridge
} from "../src/qa/aestheticParameterTuningDryRunFromBridge.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterTuningDryRunFromBridgeSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticParameterTuningDryRunFromBridge(sample);
}

function sourcePatch(patch) {
  return (sample) => patch(sample.sourceBridge, sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("current OD-R8C bridge produces review-only proposed adjustments", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_tuning_dry_run_from_bridge.v1");
  assert.equal(report.runMode, "parameter_tuning_dry_run_from_bridge_no_export");
  assert.equal(report.acceptedForTuningDryRunReview, true);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.parameterPackExported, false);
  assert.equal(report.appRuntimeWritePerformed, false);
  assert.equal(report.proposedParameterAdjustments.length, 4);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.productionReady, false);
});

test("acceptedForTuningDryRunReview true for valid bridge", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(report.acceptedForTuningDryRunReview, true);
});

test("eligibleForParameterPackExport remains false", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(report.eligibleForParameterPackExport, false);
});

test("eligibleForAppRuntime remains false", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(report.eligibleForAppRuntime, false);
});

test("parameterPackExported false", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(report.parameterPackExported, false);
});

test("appRuntimeWritePerformed false", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(report.appRuntimeWritePerformed, false);
});

test("bridge not accepted blocks dry-run", () => {
  const report = reportFor(sourcePatch((source) => {
    source.acceptedForTuningBridgeReview = false;
  }));

  assert.equal(report.acceptedForTuningDryRunReview, false);
  assert.equal(blockedFor(report, "source_bridge_not_accepted"), true);
});

test("eligibleForParameterTuningDryRun false blocks dry-run", () => {
  const report = reportFor(sourcePatch((source) => {
    source.eligibleForParameterTuningDryRun = false;
  }));

  assert.equal(report.acceptedForTuningDryRunReview, false);
  assert.equal(blockedFor(report, "source_not_eligible_for_tuning_dry_run"), true);
});

test("unknown tuning signal blocks", () => {
  const report = reportFor(sourcePatch((source) => {
    source.proposedTuningSignals = [
      ...source.proposedTuningSignals,
      {
        signalKey: "future_signal",
        internalOnly: true,
        userFacing: false
      }
    ];
  }));

  assert.equal(report.acceptedForTuningDryRunReview, false);
  assert.equal(blockedFor(report, "unknown_tuning_signal_future_signal"), true);
});

test("candidateOnly must be true for each proposed adjustment", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  for (const adjustment of report.proposedParameterAdjustments) {
    assert.equal(adjustment.candidateOnly, true);
    assert.equal(adjustment.automaticMutationApplied, false);
    assert.equal(adjustment.productionMutationAllowed, false);
    assert.equal(adjustment.userFacing, false);
  }
});

test("any final or production threshold mutation blocks", () => {
  const report = reportFor(sourcePatch((source) => {
    source.proposedTuningSignals[0].finalThresholdValue = 0.12;
    source.proposedTuningSignals[1].productionThresholdMutation = true;
  }));

  assert.equal(report.acceptedForTuningDryRunReview, false);
  assert.equal(blockedFor(report, "finalThresholdValue"), true);
  assert.equal(blockedFor(report, "productionThresholdMutation"), true);
});

for (const flag of [
  "imageReadsPerformed",
  "cvInferencePerformed",
  "networkCallsMade",
  "uploadPerformed",
  "providerCallAttempted",
  "generatedReportsPersisted",
  "appRuntimeIntegrationEnabled",
  "parameterPackExported",
  "appRuntimeWritePerformed",
  "productionReady"
]) {
  test(`${flag} true blocks`, () => {
    const report = reportFor((sample) => {
      sample[flag] = true;
    });

    assert.equal(report.acceptedForTuningDryRunReview, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
    assert.equal(report[flag], false);
  });
}

test("eligibleForAppRuntime true blocks", () => {
  const report = reportFor((sample) => {
    sample.eligibleForAppRuntime = true;
  });

  assert.equal(report.acceptedForTuningDryRunReview, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("no score rating or aesthetic grading fields are emitted", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/score|rating|aestheticGrade|aesthetic_grade/i.test(serialized), false);
});

test("no retake-first recommendation is emitted", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.equal(/retake/i.test(report.recommendedNextStep), false);
});

test("no user-facing guidance copy is emitted", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/userGuidanceCopy|displayCopy|uiCopy|caption/i.test(serialized), false);
});

test("review-only adjustment mapping uses expected target parameters", () => {
  const report = runAestheticParameterTuningDryRunFromBridge(cloneSample());

  assert.deepEqual(
    report.proposedParameterAdjustments.map((adjustment) => adjustment.targetParameterKey).sort(),
    [
      "headroomRatio.highSoftWarningThreshold",
      "horizonAngle.softTiltThreshold",
      "sharpnessRatio.lowConfidenceThreshold",
      "visualWeightMoment.balanceWarningPolicy"
    ]
  );
});

test("CLI emits sanitized dry-run output with export and runtime blocked", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-parameter-tuning-dry-run-from-bridge.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "parameter_tuning_dry_run_from_bridge_no_export");
  assert.equal(report.acceptedForTuningDryRunReview, true);
  assert.equal(report.proposedParameterAdjustments.length, 4);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.parameterPackExported, false);
  assert.equal(report.appRuntimeWritePerformed, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.providerCallAttempted, false);
  assert.equal(report.generatedReportsPersisted, false);
  assert.equal(report.appRuntimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
