import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  aestheticLocalCvCalibrationSmokeApprovedConfig,
  aestheticLocalCvCalibrationSmokeDisabledConfig,
  runAestheticLocalCvCalibrationSmoke
} from "../src/qa/aestheticLocalCvCalibrationSmoke.mjs";

function approvedConfig(patch = {}) {
  return {
    ...aestheticLocalCvCalibrationSmokeApprovedConfig(),
    ...patch
  };
}

function reportFor({ config = approvedConfig(), configPresent = true, fixtureToken = "calibration_001", options = {} } = {}) {
  return runAestheticLocalCvCalibrationSmoke(
    { config, configPresent, fixtureToken },
    {
      readApprovedFixtureBytes: () => Buffer.from([12, 48, 96, 128, 200, 252, 18, 72, 144, 220]),
      ...options
    }
  );
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("missing ignored config safely blocked", () => {
  const report = runAestheticLocalCvCalibrationSmoke();

  assert.equal(report.runMode, "ignored_local_fixture_calibration_smoke");
  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(blockedFor(report, "missing_ignored_local_fixture_config"), true);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.productionReady, false);
});

test("disabled config safely blocked", () => {
  const report = runAestheticLocalCvCalibrationSmoke({
    config: aestheticLocalCvCalibrationSmokeDisabledConfig(),
    configPresent: true,
    fixtureToken: "calibration_001"
  });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(blockedFor(report, "calibration_smoke_disabled"), true);
  assert.equal(report.imageReadsPerformed, false);
});

test("allowImageReads false blocks smoke", () => {
  const report = reportFor({ config: approvedConfig({ allowImageReads: false }) });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(blockedFor(report, "image_reads_not_approved"), true);
  assert.equal(report.imageReadsPerformed, false);
});

test("approvedFixtureMode false blocks smoke", () => {
  const report = reportFor({ config: approvedConfig({ approvedFixtureMode: false }) });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(blockedFor(report, "approved_fixture_mode_not_enabled"), true);
});

test("missing fixture token blocks smoke", () => {
  const report = reportFor({ config: approvedConfig({ approvedFixtureTokens: [] }) });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(blockedFor(report, "missing_approved_fixture_token"), true);
});

test("maxFixtureCount greater than one blocks smoke", () => {
  const report = reportFor({ config: approvedConfig({ maxFixtureCount: 2 }) });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "max_fixture_count_not_one"), true);
});

for (const [field, token] of [
  ["allowNetworkCalls", "network_calls_not_allowed"],
  ["allowUploads", "uploads_not_allowed"],
  ["allowReportWrite", "report_write_not_allowed"],
  ["productionReady", "production_ready_not_false"]
]) {
  test(`${field} true fails`, () => {
    const report = reportFor({ config: approvedConfig({ [field]: true }) });

    assert.equal(report.acceptedForCalibrationReview, false);
    assert.equal(report.hardValidationFailure, true);
    assert.equal(blockedFor(report, token), true);
  });
}

test("path traversal fixture token fails", () => {
  const report = reportFor({ fixtureToken: "../calibration_001" });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "path_traversal_fixture_token"), true);
});

test("non-approved fixture token fails", () => {
  const report = reportFor({ fixtureToken: "calibration_002" });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "non_approved_fixture_token"), true);
});

test("successful approved smoke reads one temp ignored fixture and emits sanitized features", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "od-r7d-local-cv-"));
  const fixtureDir = join(tempRoot, "backend", "tests", "local-cv-calibration-fixtures");
  mkdirSync(fixtureDir, { recursive: true });
  writeFileSync(join(fixtureDir, "calibration_001.png"), Buffer.from([9, 44, 88, 132, 176, 250, 251, 21, 63, 105, 147]));

  try {
    const report = runAestheticLocalCvCalibrationSmoke(
      {
        config: approvedConfig(),
        configPresent: true,
        fixtureToken: "calibration_001"
      },
      { cwd: tempRoot }
    );
    const serialized = JSON.stringify(report);

    assert.equal(report.acceptedForCalibrationReview, true);
    assert.equal(report.fixtureToken, "calibration_001");
    assert.equal(report.fixtureCount, 1);
    assert.equal(report.imageReadsPerformed, true);
    assert.equal(report.cvInferencePerformed, false);
    assert.equal(report.networkCallsMade, false);
    assert.equal(report.uploadPerformed, false);
    assert.equal(report.providerCallAttempted, false);
    assert.equal(report.generatedReportsPersisted, false);
    assert.equal(report.appRuntimeIntegrationEnabled, false);
    assert.equal(report.productionReady, false);
    assert.equal(typeof report.extractedFeatureVector.headroomRatio, "number");
    assert.equal(report.reviewedFeatureKeys.includes("visualWeightMoment"), true);
    assert.equal(serialized.includes(tempRoot), false);
    assert.equal(serialized.includes("calibration_001.png"), false);
    assert.equal(/base64|exif|gps|metadata/i.test(serialized), false);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("backend-relative fixtureRoot resolves from backend npm script context", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "od-r7d-backend-cwd-"));
  const backendDir = join(tempRoot, "backend");
  const fixtureDir = join(backendDir, "tests", "local-cv-calibration-fixtures");
  mkdirSync(fixtureDir, { recursive: true });
  writeFileSync(join(fixtureDir, "calibration_001.jpg"), Buffer.from([23, 120, 120, 24]));

  try {
    const report = runAestheticLocalCvCalibrationSmoke(
      {
        config: approvedConfig(),
        configPresent: true,
        fixtureToken: "calibration_001"
      },
      { cwd: backendDir }
    );
    const serialized = JSON.stringify(report);

    assert.equal(report.acceptedForCalibrationReview, true);
    assert.equal(report.fixtureCount, 1);
    assert.equal(report.imageReadsPerformed, true);
    assert.equal(serialized.includes(tempRoot), false);
    assert.equal(serialized.includes("calibration_001.jpg"), false);
    assert.equal(/base64|exif|gps|metadata/i.test(serialized), false);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("unsupported fixtureRoot path traversal is blocked before read", () => {
  const report = reportFor({ config: approvedConfig({ fixtureRoot: "../backend/tests/local-cv-calibration-fixtures" }) });

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(blockedFor(report, "unsupported_fixture_root"), true);
});

test("imageReadsPerformed true is allowed only for successful approved smoke result", () => {
  const blocked = reportFor({ config: approvedConfig({ allowUploads: true }) });
  const accepted = reportFor();

  assert.equal(blocked.imageReadsPerformed, false);
  assert.equal(accepted.acceptedForCalibrationReview, true);
  assert.equal(accepted.imageReadsPerformed, true);
});

for (const flag of [
  "networkCallsMade",
  "uploadPerformed",
  "providerCallAttempted",
  "generatedReportsPersisted",
  "realUserPhotosCommitted",
  "localConfigCommitted",
  "appRuntimeIntegrationEnabled",
  "trainingEnabled",
  "fineTuningEnabled"
]) {
  test(`${flag} true fails`, () => {
    const report = reportFor({ config: approvedConfig({ [flag]: true }) });

    assert.equal(report.acceptedForCalibrationReview, false);
    assert.equal(report.hardValidationFailure, true);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("CLI default safely blocks without ignored config", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-local-cv-calibration-smoke.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.acceptedForCalibrationReview, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(blockedFor(report, "missing_ignored_local_fixture_config"), true);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.uploadPerformed, false);
  assert.equal(report.providerCallAttempted, false);
  assert.equal(report.appRuntimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});

test("CLI unsafe config exits non-zero before fixture read", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "od-r7d-unsafe-config-"));
  const configPath = join(tempRoot, "aesthetic-local-cv-calibration-fixtures.local.json");
  writeFileSync(configPath, JSON.stringify(approvedConfig({ allowNetworkCalls: true }), null, 2));

  try {
    const result = spawnSync(
      process.execPath,
      ["scripts/run-aesthetic-local-cv-calibration-smoke.mjs", `--config=${configPath}`],
      { cwd: new URL("../", import.meta.url), encoding: "utf8" }
    );
    const report = JSON.parse(result.stdout);

    assert.notEqual(result.status, 0);
    assert.equal(report.imageReadsPerformed, false);
    assert.equal(blockedFor(report, "network_calls_not_allowed"), true);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
