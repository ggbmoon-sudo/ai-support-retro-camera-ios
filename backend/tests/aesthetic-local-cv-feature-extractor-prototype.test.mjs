import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import { runAestheticLocalCvFeatureBenchmark } from "../src/qa/aestheticLocalCvFeatureBenchmark.mjs";
import {
  aestheticLocalCvFeatureExtractorPrototypeSample,
  runAestheticLocalCvFeatureExtractorPrototype
} from "../src/qa/aestheticLocalCvFeatureExtractorPrototype.mjs";

function cloneSample() {
  return structuredClone(aestheticLocalCvFeatureExtractorPrototypeSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticLocalCvFeatureExtractorPrototype(sample);
}

function firstObservationPatch(patch) {
  return (sample) => Object.assign(sample.syntheticObservations[0], patch);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("valid synthetic observations emit OD-R7A-compatible feature vectors", () => {
  const report = runAestheticLocalCvFeatureExtractorPrototype(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_local_cv_feature_extractor_prototype.v1");
  assert.equal(report.runMode, "local_cv_feature_extractor_prototype");
  assert.equal(report.extractorPrototypeValid, true);
  assert.equal(report.inputObservationCount, 3);
  assert.equal(report.outputFeatureVectorCount, 5);
  assert.equal(report.extractionSummary.featureKeyCounts.headroomRatio, 1);
  assert.equal(report.extractionSummary.featureKeyCounts.horizonAngle, 1);
  assert.equal(report.extractionSummary.featureKeyCounts.highlightClipRatio, 1);
  assert.equal(report.extractionSummary.featureKeyCounts.backgroundObjectDensity, 1);
  assert.equal(report.extractionSummary.featureKeyCounts.subjectAnchor, 1);
  assert.equal(report.extractionSummary.featureKeyCounts.visualWeightMoment, 1);
  assert.equal(report.extractionSummary.benchmarkCompatible, true);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.productionReady, false);
});

test("emitted feature vectors can be consumed by the OD-R7A benchmark", () => {
  const extractorReport = runAestheticLocalCvFeatureExtractorPrototype(cloneSample());
  const benchmarkReport = runAestheticLocalCvFeatureBenchmark({
    featureVectors: extractorReport.featureVectors,
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false
  });

  assert.equal(benchmarkReport.benchmarkValid, true);
  assert.equal(benchmarkReport.featureVectorCount, 5);
  assert.equal(benchmarkReport.acceptedVectorCount, 2);
  assert.equal(benchmarkReport.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(benchmarkReport.appTransferReadiness.appRuntimeTransferBlocked, true);
});

test("unknown measurement key fails closed", () => {
  const report = reportFor(firstObservationPatch({
    measurements: {
      futureFeature: 0.5
    }
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "unknown_measurement_key_futureFeature"), true);
});

test("non-numeric measurement fails closed", () => {
  const report = reportFor(firstObservationPatch({
    measurements: {
      headroomRatio: "high"
    }
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "non_numeric_measurement_headroomRatio"), true);
});

test("unsupported bucket fails closed", () => {
  const report = reportFor(firstObservationPatch({
    subjectAnchorBucket: "beauty_pose"
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "unsupported_subject_anchor_bucket_beauty_pose"), true);
});

test("local image path fails without leaking the value", () => {
  const report = reportFor(firstObservationPatch({
    imagePath: "C:\\Users\\example\\private_photo.jpg"
  }));
  const serialized = JSON.stringify(report);

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "imagePath"), true);
  assert.equal(serialized.includes("private_photo.jpg"), false);
});

test("real URL fails without leaking the value", () => {
  const report = reportFor(firstObservationPatch({
    assetUrl: "https://example.com/private-photo.jpg"
  }));
  const serialized = JSON.stringify(report);

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "assetUrl"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("base64/raw image fails", () => {
  const report = reportFor(firstObservationPatch({
    rawImage: "data:image/png;base64,AAAA"
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

test("prompt/provider/debug leakage fails", () => {
  const report = reportFor(firstObservationPatch({
    rawPrompt: "describe this image",
    providerPayload: { promptText: "hidden" },
    debugText: "trace"
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "rawPrompt"), true);
  assert.equal(blockedFor(report, "providerPayload"), true);
  assert.equal(blockedFor(report, "debugText"), true);
});

test("score/rating fields fail", () => {
  const report = reportFor(firstObservationPatch({
    qualityScore: 91,
    starRating: 5
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "qualityScore"), true);
  assert.equal(blockedFor(report, "starRating"), true);
});

test("sensitive inference fields fail", () => {
  const report = reportFor(firstObservationPatch({
    ageBucket: "adult",
    genderLabel: "unknown",
    sensitiveInference: "identity"
  }));

  assert.equal(report.extractorPrototypeValid, false);
  assert.equal(blockedFor(report, "ageBucket"), true);
  assert.equal(blockedFor(report, "genderLabel"), true);
  assert.equal(blockedFor(report, "sensitiveInference"), true);
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

    assert.equal(report.extractorPrototypeValid, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("app runtime flags fail closed", () => {
  const runtimeEligible = reportFor((sample) => {
    sample.eligibleForAppRuntime = true;
  });
  const transferOpen = reportFor((sample) => {
    sample.appRuntimeTransferBlocked = false;
  });

  assert.equal(runtimeEligible.extractorPrototypeValid, false);
  assert.equal(blockedFor(runtimeEligible, "app_runtime_eligibility"), true);
  assert.equal(transferOpen.extractorPrototypeValid, false);
  assert.equal(blockedFor(transferOpen, "app_runtime_transfer_not_blocked"), true);
});

test("CLI confirms prototype stays local and production disabled", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-local-cv-feature-extractor-prototype.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.extractorPrototypeValid, true);
  assert.equal(report.runMode, "local_cv_feature_extractor_prototype");
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.fineTuningEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.productionReady, false);
});
