import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticParameterCandidateAcceptanceGateSample,
  runAestheticParameterCandidateAcceptanceGate
} from "../src/qa/aestheticParameterCandidateAcceptanceGate.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterCandidateAcceptanceGateSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticParameterCandidateAcceptanceGate(sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("current OD-R8D candidates produce expected 2 accepted and 2 needs_more_data summary", () => {
  const report = runAestheticParameterCandidateAcceptanceGate(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_candidate_acceptance_gate.v1");
  assert.equal(report.runMode, "reviewed_candidate_acceptance_gate_no_export");
  assert.equal(report.reviewedCandidateCount, 4);
  assert.equal(report.acceptedCandidateCount, 2);
  assert.equal(report.needsMoreDataCount, 2);
  assert.equal(report.rejectedCandidateCount, 0);
  assert.equal(report.blockedCandidateCount, 0);
  assert.deepEqual(report.acceptedCandidateKeys, [
    "horizonAngle.softTiltThreshold",
    "visualWeightMoment.balanceWarningPolicy"
  ]);
  assert.deepEqual(report.needsMoreDataCandidateKeys, [
    "headroomRatio.highSoftWarningThreshold",
    "sharpnessRatio.lowConfidenceThreshold"
  ]);
  assert.equal(report.acceptedForParameterPackCandidateReview, true);
  assert.deepEqual(report.blockedReasons, []);
});

test("accepted_for_pack_candidate remains not exportable", () => {
  const report = runAestheticParameterCandidateAcceptanceGate(cloneSample());

  assert.equal(report.acceptedCandidateCount, 2);
  assert.equal(report.eligibleForParameterPackExport, false);
  for (const decision of report.candidateDecisions) {
    assert.equal(decision.exportEligible, false);
    assert.equal(decision.appRuntimeEligible, false);
  }
});

test("needs_more_data prevents export", () => {
  const report = runAestheticParameterCandidateAcceptanceGate(cloneSample());

  assert.equal(report.needsMoreDataCount, 2);
  assert.equal(report.eligibleForParameterPackExport, false);
});

test("unknown candidate key blocks", () => {
  const report = reportFor((sample) => {
    sample.manualReviewDecisions[0].candidateKey = "futureParameter.key";
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
  assert.equal(blockedFor(report, "unknown_candidate_key_futureParameter.key"), true);
});

test("unknown decision enum blocks", () => {
  const report = reportFor((sample) => {
    sample.manualReviewDecisions[0].decision = "accepted";
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
  assert.equal(blockedFor(report, "unknown_decision_accepted"), true);
});

test("candidateOnly false blocks", () => {
  const report = reportFor((sample) => {
    sample.sourceDryRun.proposedParameterAdjustments[0].candidateOnly = false;
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
  assert.equal(blockedFor(report, "candidate_only_false"), true);
});

test("final production threshold mutation blocks", () => {
  const report = reportFor((sample) => {
    sample.sourceDryRun.proposedParameterAdjustments[0].finalThresholdValue = 0.4;
    sample.sourceDryRun.proposedParameterAdjustments[1].productionThresholdMutation = true;
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
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

    assert.equal(report.acceptedForParameterPackCandidateReview, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
    assert.equal(report[flag], false);
  });
}

test("eligibleForParameterPackExport true blocks", () => {
  const report = reportFor((sample) => {
    sample.eligibleForParameterPackExport = true;
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
  assert.equal(report.eligibleForParameterPackExport, false);
  assert.equal(blockedFor(report, "parameter_pack_export_eligibility"), true);
});

test("eligibleForAppRuntime true blocks", () => {
  const report = reportFor((sample) => {
    sample.eligibleForAppRuntime = true;
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("source dry-run not accepted blocks", () => {
  const report = reportFor((sample) => {
    sample.sourceDryRun.acceptedForTuningDryRunReview = false;
  });

  assert.equal(report.acceptedForParameterPackCandidateReview, false);
  assert.equal(blockedFor(report, "source_dry_run_not_accepted"), true);
});

test("no score rating or aesthetic grading fields are emitted", () => {
  const report = runAestheticParameterCandidateAcceptanceGate(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/score|rating|aestheticGrade|aesthetic_grade/i.test(serialized), false);
});

test("no retake-first recommendation is emitted", () => {
  const report = runAestheticParameterCandidateAcceptanceGate(cloneSample());

  assert.equal(/retake/i.test(report.recommendedNextStep), false);
});

test("no user-facing guidance copy is emitted", () => {
  const report = runAestheticParameterCandidateAcceptanceGate(cloneSample());
  const serialized = JSON.stringify(report);

  assert.equal(/userGuidanceCopy|displayCopy|uiCopy|caption/i.test(serialized), false);
  for (const decision of report.candidateDecisions) {
    assert.equal(decision.userFacing, false);
  }
});

test("CLI emits sanitized acceptance gate output with export and runtime blocked", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-parameter-candidate-acceptance-gate.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "reviewed_candidate_acceptance_gate_no_export");
  assert.equal(report.acceptedForParameterPackCandidateReview, true);
  assert.equal(report.reviewedCandidateCount, 4);
  assert.equal(report.acceptedCandidateCount, 2);
  assert.equal(report.needsMoreDataCount, 2);
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
