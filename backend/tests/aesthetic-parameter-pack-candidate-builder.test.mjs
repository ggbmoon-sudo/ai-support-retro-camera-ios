import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticParameterPackCandidateBuilderSample,
  runAestheticParameterPackCandidateBuilder
} from "../src/qa/aestheticParameterPackCandidateBuilder.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterPackCandidateBuilderSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticParameterPackCandidateBuilder(sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("current OD-R8E accepted candidates build review-only scaffold", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_pack_candidate_builder.v1");
  assert.equal(report.runMode, "parameter_pack_candidate_builder_no_export");
  assert.deepEqual(report.acceptedCandidateKeys, [
    "horizonAngle.softTiltThreshold",
    "visualWeightMoment.balanceWarningPolicy"
  ]);
  assert.deepEqual(report.excludedCandidateKeys, [
    "headroomRatio.highSoftWarningThreshold",
    "sharpnessRatio.lowConfidenceThreshold"
  ]);
  assert.equal(report.acceptedForPackCandidateReview, true);
  assert.equal(report.candidateParameterPack.policyCandidates.length, 2);
  assert.deepEqual(report.blockedReasons, []);
});

test("candidate scaffold remains candidateOnly and internal", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());

  assert.equal(report.candidateOnly, true);
  assert.equal(report.candidateParameterPack.candidateOnly, true);
  assert.equal(report.candidateParameterPack.internalOnly, true);
  assert.equal(report.candidateParameterPack.userFacing, false);
  for (const policy of report.candidateParameterPack.policyCandidates) {
    assert.equal(policy.candidateOnly, true);
    assert.equal(policy.internalOnly, true);
    assert.equal(policy.userFacing, false);
    assert.equal(policy.hardBlockerAllowed, false);
    assert.equal(policy.productionMutationAllowed, false);
    assert.equal(policy.productionValueApplied, false);
  }
});

test("export runtime and writes remain blocked", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());

  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.parameterPackExported, false);
  assert.equal(report.appRuntimeWritePerformed, false);
  assert.equal(report.candidateParameterPack.eligibleForParameterPackExport, false);
  assert.equal(report.candidateParameterPack.eligibleForAppRuntime, false);
});

test("needs_more_data candidates are excluded", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());
  const policyKeys = report.candidateParameterPack.policyCandidates.map((policy) => policy.parameterKey);

  assert.equal(policyKeys.includes("headroomRatio.highSoftWarningThreshold"), false);
  assert.equal(policyKeys.includes("sharpnessRatio.lowConfidenceThreshold"), false);
  assert.deepEqual(
    report.candidateParameterPack.excludedCandidates.map((candidate) => candidate.parameterKey),
    [
      "headroomRatio.highSoftWarningThreshold",
      "sharpnessRatio.lowConfidenceThreshold"
    ]
  );
});

test("including headroomRatio.highSoftWarningThreshold blocks", () => {
  const report = reportFor((sample) => {
    const decision = sample.sourceAcceptanceGate.candidateDecisions
      .find((candidate) => candidate.candidateKey === "headroomRatio.highSoftWarningThreshold");
    decision.decision = "accepted_for_pack_candidate";
    sample.sourceAcceptanceGate.acceptedCandidateKeys.push("headroomRatio.highSoftWarningThreshold");
    sample.sourceAcceptanceGate.needsMoreDataCandidateKeys =
      sample.sourceAcceptanceGate.needsMoreDataCandidateKeys.filter(
        (candidateKey) => candidateKey !== "headroomRatio.highSoftWarningThreshold"
      );
  });

  assert.equal(report.acceptedForPackCandidateReview, false);
  assert.equal(blockedFor(report, "excluded_candidate_not_needs_more_data_headroomRatio.highSoftWarningThreshold"), true);
});

test("including sharpnessRatio.lowConfidenceThreshold blocks", () => {
  const report = reportFor((sample) => {
    const decision = sample.sourceAcceptanceGate.candidateDecisions
      .find((candidate) => candidate.candidateKey === "sharpnessRatio.lowConfidenceThreshold");
    decision.decision = "accepted_for_pack_candidate";
    sample.sourceAcceptanceGate.acceptedCandidateKeys.push("sharpnessRatio.lowConfidenceThreshold");
    sample.sourceAcceptanceGate.needsMoreDataCandidateKeys =
      sample.sourceAcceptanceGate.needsMoreDataCandidateKeys.filter(
        (candidateKey) => candidateKey !== "sharpnessRatio.lowConfidenceThreshold"
      );
  });

  assert.equal(report.acceptedForPackCandidateReview, false);
  assert.equal(blockedFor(report, "excluded_candidate_not_needs_more_data_sharpnessRatio.lowConfidenceThreshold"), true);
});

test("runtimeEligibility true blocks", () => {
  const report = reportFor((sample) => {
    sample.runtimeEligibility = true;
  });

  assert.equal(report.acceptedForPackCandidateReview, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
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

    assert.equal(report.acceptedForPackCandidateReview, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
    assert.equal(report[flag], false);
  });
}

test("eligible flags true block", () => {
  const report = reportFor((sample) => {
    sample.eligibleForParameterPackExport = true;
    sample.eligibleForAppRuntime = true;
  });

  assert.equal(report.acceptedForPackCandidateReview, false);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(blockedFor(report, "parameter_pack_export_eligibility"), true);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("raw image path base64 EXIF GPS provider and debug fields block", () => {
  const report = reportFor((sample) => {
    sample.rawImage = "data:image/jpeg;base64,/9j/not-real";
    sample.rawPath = "C:\\Users\\example\\photo.jpg";
    sample.exif = { gps: "0,0" };
    sample.providerPayload = { debugPayload: "raw provider text" };
    sample.rawPrompt = "describe this image";
  });

  assert.equal(report.acceptedForPackCandidateReview, false);
  assert.equal(blockedFor(report, "rawImage"), true);
  assert.equal(blockedFor(report, "rawPath"), true);
  assert.equal(blockedFor(report, "exif"), true);
  assert.equal(blockedFor(report, "gps"), true);
  assert.equal(blockedFor(report, "providerPayload"), true);
  assert.equal(blockedFor(report, "debugPayload"), true);
  assert.equal(blockedFor(report, "rawPrompt"), true);
});

test("no score rating or aesthetic grading fields are emitted", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/score|rating|aestheticGrade|aesthetic_grade/i.test(serialized), false);
});

test("no retake-first recommendation is emitted", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/retake/i.test(serialized), false);
});

test("no user-facing guidance copy is emitted", () => {
  const report = runAestheticParameterPackCandidateBuilder(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/userGuidanceCopy|displayCopy|uiCopy|caption/i.test(serialized), false);
  assert.equal(report.candidateParameterPack.userFacing, false);
});

test("CLI emits sanitized candidate builder output with export and runtime blocked", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-parameter-pack-candidate-builder.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "parameter_pack_candidate_builder_no_export");
  assert.equal(report.acceptedForPackCandidateReview, true);
  assert.deepEqual(report.acceptedCandidateKeys, [
    "horizonAngle.softTiltThreshold",
    "visualWeightMoment.balanceWarningPolicy"
  ]);
  assert.deepEqual(report.excludedCandidateKeys, [
    "headroomRatio.highSoftWarningThreshold",
    "sharpnessRatio.lowConfidenceThreshold"
  ]);
  assert.equal(report.candidateOnly, true);
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
