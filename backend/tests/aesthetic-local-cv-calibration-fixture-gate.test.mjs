import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample,
  aestheticLocalCvCalibrationFixtureGateDisabledConfig,
  runAestheticLocalCvCalibrationFixtureGate
} from "../src/qa/aestheticLocalCvCalibrationFixtureGate.mjs";

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

function reportFor(patch, base = aestheticLocalCvCalibrationFixtureGateDisabledConfig()) {
  const input = structuredClone(base);
  patch(input);
  return runAestheticLocalCvCalibrationFixtureGate(input);
}

test("default no-config path is safely blocked and not a hard failure", () => {
  const report = runAestheticLocalCvCalibrationFixtureGate();

  assert.equal(report.gateName, "aesthetic_local_cv_calibration_fixture_gate");
  assert.equal(report.runMode, "fixture_gate_no_image_read");
  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.fixtureRegistryConfigured, false);
  assert.equal(report.approvedFixtureCount, 0);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(blockedFor(report, "fixture_gate_disabled"), true);
  assert.equal(blockedFor(report, "missing_ignored_fixture_registry_config"), true);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.productionReady, false);
});

test("disabled example config is safely blocked", () => {
  const config = JSON.parse(
    readFileSync(new URL("../config/aesthetic-local-cv-calibration-fixtures.local.example.json", import.meta.url), "utf8")
  );
  const report = runAestheticLocalCvCalibrationFixtureGate(config);

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(report.fixtureRegistryConfigured, false);
  assert.equal(blockedFor(report, "fixture_gate_disabled"), true);
});

test("enabled config without approved fixture mode is blocked", () => {
  const report = reportFor((input) => {
    input.enabled = true;
    input.fixtureRegistryConfigured = true;
  });

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(blockedFor(report, "approved_fixture_mode_not_enabled"), true);
});

test("approved synthetic fixture token shape passes gate structure but remains not runtime eligible", () => {
  const report = runAestheticLocalCvCalibrationFixtureGate(
    aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample()
  );

  assert.equal(report.eligibleForCalibration, true);
  assert.equal(report.approvedFixtureCount, 2);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.reviewedFeatureKeys.includes("headroomRatio"), true);
  assert.equal(report.reviewedFeatureKeys.includes("visualWeightMoment"), true);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.productionReady, false);
});

test("allowImageReads true is blocked in OD-R7C", () => {
  const report = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample(), {
      allowImageReads: true
    });
  });

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "image_reads_not_allowed_in_od_r7c"), true);
});

for (const flag of [
  "imageReadsPerformed",
  "cvInferencePerformed",
  "networkCallsMade",
  "uploadPerformed",
  "generatedReportsPersisted",
  "realUserPhotosCommitted",
  "localConfigCommitted",
  "appRuntimeIntegrationEnabled",
  "trainingEnabled",
  "fineTuningEnabled",
  "productionReady"
]) {
  test(`${flag} true fails`, () => {
    const report = reportFor((input) => {
      Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample(), {
        [flag]: true
      });
    });

    assert.equal(report.eligibleForCalibration, false);
    assert.equal(report.hardValidationFailure, true);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("unknown feature key fails", () => {
  const report = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample());
    input.fixtures[0].featureKeys = ["headroomRatio", "futureFeature"];
  });

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "unknown_feature_key_futureFeature"), true);
});

test("invalid fixture token shape fails", () => {
  const report = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample());
    input.fixtures[0].fixtureToken = "C:\\Users\\example\\photo.jpg";
  });

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "invalid_fixture_token_shape"), true);
});

test("real URL and raw image leakage fail without echoing values", () => {
  const report = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample());
    input.fixtures[0].assetUrl = "https://example.com/private.jpg";
    input.fixtures[0].rawImage = "data:image/png;base64,AAAA";
  });
  const serialized = JSON.stringify(report);

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "assetUrl"), true);
  assert.equal(blockedFor(report, "rawImage"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("app runtime flags fail", () => {
  const runtimeEligible = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample(), {
      eligibleForAppRuntime: true
    });
  });
  const transferOpen = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample(), {
      appRuntimeTransferBlocked: false
    });
  });
  const fixtureRuntime = reportFor((input) => {
    Object.assign(input, aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample());
    input.fixtures[0].runtimeEligible = true;
  });

  assert.equal(blockedFor(runtimeEligible, "app_runtime_eligibility"), true);
  assert.equal(blockedFor(transferOpen, "app_runtime_transfer_not_blocked"), true);
  assert.equal(blockedFor(fixtureRuntime, "fixture_runtime_eligible"), true);
});

test("CLI default exits zero and confirms no image read or runtime", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/check-aesthetic-local-cv-calibration-fixture-gate.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.eligibleForCalibration, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.appRuntimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
