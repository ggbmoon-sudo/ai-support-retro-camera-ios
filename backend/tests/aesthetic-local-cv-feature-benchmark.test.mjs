import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticLocalCvFeatureBenchmarkSample,
  runAestheticLocalCvFeatureBenchmark
} from "../src/qa/aestheticLocalCvFeatureBenchmark.mjs";

function cloneSample() {
  return structuredClone(aestheticLocalCvFeatureBenchmarkSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticLocalCvFeatureBenchmark(sample);
}

function firstVectorPatch(patch) {
  return (sample) => Object.assign(sample.featureVectors[0], patch);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("valid synthetic feature vectors pass the dry-run benchmark", () => {
  const report = runAestheticLocalCvFeatureBenchmark(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_local_cv_feature_benchmark_dry_run.v1");
  assert.equal(report.runMode, "local_cv_feature_benchmark_dry_run");
  assert.equal(report.featureVectorCount, 3);
  assert.equal(report.acceptedVectorCount, 2);
  assert.equal(report.rejectedVectorCount, 1);
  assert.equal(report.tagBenchmarkCounts.ERR_COMP_EXCESSIVE_HEADROOM, 1);
  assert.equal(report.featureKeyCounts.headroomRatio, 1);
  assert.equal(report.thresholdSignalCounts.headroom_soft_high, 1);
  assert.equal(report.suppressionSignalCounts.intentional_negative_space, 1);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.benchmarkSummary.tuningCandidateVectorCount, 1);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
  assert.equal(report.productionReady, false);
  assert.equal(report.benchmarkValid, true);
});

test("unknown feature key fails", () => {
  const report = reportFor(firstVectorPatch({
    featureSignals: {
      futureFeature: 0.5
    }
  }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "unknown_feature_key_futureFeature"), true);
});

test("unknown threshold key fails", () => {
  const report = reportFor(firstVectorPatch({ thresholdSignals: ["future_threshold"] }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "unknown_threshold_signal_future_threshold"), true);
});

test("unknown suppression key fails", () => {
  const report = reportFor(firstVectorPatch({ suppressionCandidates: ["future_suppression"] }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "unknown_suppression_candidate_future_suppression"), true);
});

test("unsupported safeActionKey fails", () => {
  const report = reportFor(firstVectorPatch({ safeActionKey: "future_action" }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "unsupported_safe_action_key_future_action"), true);
});

test("image path fails", () => {
  const report = reportFor(firstVectorPatch({ imagePath: "C:\\Users\\example\\private_photo.jpg" }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "imagePath"), true);
});

test("real URL fails", () => {
  const report = reportFor(firstVectorPatch({ assetRef: "https://example.com/private-photo.jpg" }));
  const serialized = JSON.stringify(report);

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "assetRef"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("base64 raw image fails", () => {
  const report = reportFor(firstVectorPatch({ rawImage: "data:image/png;base64,AAAA" }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

test("GPS and EXIF fields fail", () => {
  const report = reportFor(firstVectorPatch({ gps: "22.3,114.1", exif: "raw camera metadata" }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "gps"), true);
  assert.equal(blockedFor(report, "exif"), true);
});

test("score and rating fields fail", () => {
  const report = reportFor(firstVectorPatch({ qualityScore: 97, starRating: 5 }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "qualityScore"), true);
  assert.equal(blockedFor(report, "starRating"), true);
});

test("sensitive inference fails", () => {
  const report = reportFor(firstVectorPatch({
    ageBucket: "adult",
    genderLabel: "unknown",
    emotionLabel: "happy",
    identityLabel: "person",
    sensitiveInference: "personality"
  }));

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "ageBucket"), true);
  assert.equal(blockedFor(report, "genderLabel"), true);
  assert.equal(blockedFor(report, "emotionLabel"), true);
  assert.equal(blockedFor(report, "identityLabel"), true);
  assert.equal(blockedFor(report, "sensitiveInference"), true);
});

for (const flag of [
  "networkCallsMade",
  "imageReadsPerformed",
  "providerConfigured",
  "cloudTeacherEnabled",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
]) {
  test(`${flag} true fails closed`, () => {
    const report = reportFor((sample) => {
      sample[flag] = true;
    });

    assert.equal(report.benchmarkValid, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("eligibleForAppRuntime true fails", () => {
  const report = reportFor((sample) => {
    sample.eligibleForAppRuntime = true;
  });

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const report = reportFor((sample) => {
    sample.appRuntimeTransferBlocked = false;
  });

  assert.equal(report.benchmarkValid, false);
  assert.equal(blockedFor(report, "app_runtime_transfer_not_blocked"), true);
});

test("CLI confirms dry-run and all execution flags remain false", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-local-cv-feature-benchmark.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.benchmarkValid, true);
  assert.equal(report.runMode, "local_cv_feature_benchmark_dry_run");
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.productionReady, false);
});
