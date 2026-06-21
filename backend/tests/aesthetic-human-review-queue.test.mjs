import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticHumanReviewQueueSample,
  evaluateAestheticHumanReviewQueue
} from "../src/qa/aestheticHumanReviewQueue.mjs";

function reportFor(patch) {
  const sample = structuredClone(aestheticHumanReviewQueueSample());
  patch(sample);
  return evaluateAestheticHumanReviewQueue(sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

function firstItemPatch(patch) {
  return (sample) => Object.assign(sample.reviewItems[0], patch);
}

function firstDecisionPatch(patch) {
  return (sample) => Object.assign(sample.reviewDecisions[0], patch);
}

test("valid pending review queue passes", () => {
  const report = evaluateAestheticHumanReviewQueue(aestheticHumanReviewQueueSample());

  assert.equal(report.reviewQueueValid, true);
  assert.equal(report.reviewItemCount, 4);
  assert.equal(report.acceptedForCalibrationCount, 1);
  assert.equal(report.acceptedForEvalOnlyCount, 1);
  assert.equal(report.rejectedCount, 1);
  assert.equal(report.blockedCount, 1);
  assert.equal(report.tuningCandidateCount, 1);
  assert.equal(report.appRuntimeEligibleCount, 0);
  assert.deepEqual(report.blockedReasons, []);
});

test("valid accept_for_calibration decision passes", () => {
  const report = reportFor(firstDecisionPatch({
    decision: "accept_for_calibration",
    reviewerRole: "expert_reviewer",
    acceptedUse: {
      calibration: true,
      evaluation: true,
      tuningCandidate: true,
      appRuntime: false
    }
  }));

  assert.equal(report.reviewQueueValid, true);
  assert.equal(report.tuningCandidateCount, 1);
});

test("valid accept_for_eval_only decision passes", () => {
  const report = reportFor((sample) => {
    sample.reviewDecisions[0] = {
      reviewItemId: "review_item_calibration_001",
      decision: "accept_for_eval_only",
      reviewerRole: "qa_reviewer",
      decisionReasonKey: "review.reason.eval_only",
      acceptedUse: {
        calibration: false,
        evaluation: true,
        tuningCandidate: false,
        appRuntime: false
      }
    };
  });

  assert.equal(report.reviewQueueValid, true);
  assert.equal(report.acceptedForEvalOnlyCount, 2);
});

test("reject and block decisions pass", () => {
  const report = reportFor((sample) => {
    sample.reviewDecisions[0] = {
      reviewItemId: "review_item_calibration_001",
      decision: "reject",
      reviewerRole: "internal_reviewer",
      decisionReasonKey: "review.reason.reject",
      acceptedUse: {
        calibration: false,
        evaluation: false,
        tuningCandidate: false,
        appRuntime: false
      }
    };
    sample.reviewDecisions[1] = {
      reviewItemId: "review_item_eval_001",
      decision: "block",
      reviewerRole: "qa_reviewer",
      decisionReasonKey: "review.reason.block",
      acceptedUse: {
        calibration: false,
        evaluation: false,
        tuningCandidate: false,
        appRuntime: false
      }
    };
  });

  assert.equal(report.reviewQueueValid, true);
  assert.equal(report.rejectedCount, 2);
  assert.equal(report.blockedCount, 2);
});

test("unknown tag fails", () => {
  const report = reportFor(firstItemPatch({ tag: "ERR_UNKNOWN_TAG" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "unknown_registry_tag_ERR_UNKNOWN_TAG"), true);
});

test("unknown feature key fails", () => {
  const report = reportFor(firstItemPatch({ featureKeys: ["futureFeature"] }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "unsupported_feature_key_futureFeature"), true);
});

test("unknown threshold key fails", () => {
  const report = reportFor(firstItemPatch({ thresholdKeys: ["future_threshold"] }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "unsupported_threshold_key_future_threshold"), true);
});

test("unsupported suppression key fails", () => {
  const report = reportFor(firstItemPatch({ suppressionCandidates: ["future_suppression"] }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "unsupported_suppression_candidate_future_suppression"), true);
});

test("unsupported safeActionKey fails", () => {
  const report = reportFor(firstItemPatch({ safeActionKey: "future_action" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "unsupported_safe_action_key_future_action"), true);
});

test("reviewRequired false fails", () => {
  const report = reportFor(firstItemPatch({ reviewRequired: false }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "review_required_not_true"), true);
});

test("eligibleForAppRuntime true fails", () => {
  const report = reportFor(firstItemPatch({ eligibleForAppRuntime: true }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "app_runtime_eligibility"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const report = reportFor(firstItemPatch({ appRuntimeTransferBlocked: false }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "app_runtime_transfer_not_blocked"), true);
});

test("acceptedUse appRuntime true fails", () => {
  const report = reportFor((sample) => {
    sample.reviewDecisions[0].acceptedUse.appRuntime = true;
  });

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "app_runtime_accepted_use"), true);
});

test("rejected item with tuningCandidate true fails", () => {
  const report = reportFor((sample) => {
    sample.reviewDecisions[2].acceptedUse.tuningCandidate = true;
  });

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "tuning_candidate_without_calibration_acceptance"), true);
});

test("safety issue without safety reviewer fails", () => {
  const report = reportFor((sample) => {
    sample.reviewDecisions[3].reviewerRole = "qa_reviewer";
  });

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "safety_issue_without_safety_reviewer"), true);
});

test("score and rating fields fail", () => {
  const report = reportFor(firstItemPatch({ qualityScore: 97, ratingText: "top" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "qualityScore"), true);
  assert.equal(blockedFor(report, "ratingText"), true);
});

test("sensitive inference fields fail", () => {
  const report = reportFor(firstItemPatch({ sensitiveInference: "personality" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "sensitiveInference"), true);
});

test("age gender emotion identity attractiveness health and body fields fail", () => {
  const report = reportFor(firstItemPatch({
    ageBucket: "adult",
    genderLabel: "unknown",
    emotionLabel: "happy",
    identityLabel: "person",
    attractivenessScore: "high",
    healthSignal: "unknown",
    bodyShape: "unknown"
  }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "ageBucket"), true);
  assert.equal(blockedFor(report, "genderLabel"), true);
  assert.equal(blockedFor(report, "emotionLabel"), true);
  assert.equal(blockedFor(report, "identityLabel"), true);
  assert.equal(blockedFor(report, "attractivenessScore"), true);
  assert.equal(blockedFor(report, "healthSignal"), true);
  assert.equal(blockedFor(report, "bodyShape"), true);
});

test("raw prompt provider and debug leakage fails", () => {
  const report = reportFor(firstItemPatch({
    rawPrompt: "prompt",
    providerResponse: "payload",
    debugText: "debug"
  }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "rawPrompt"), true);
  assert.equal(blockedFor(report, "providerResponse"), true);
  assert.equal(blockedFor(report, "debugText"), true);
});

test("chain-of-thought fails", () => {
  const report = reportFor(firstItemPatch({ chainOfThought: "hidden reasoning" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "chainOfThought"), true);
});

test("local path fails", () => {
  const report = reportFor(firstItemPatch({ candidateSummary: "C:\\raw\\photo.jpg" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "candidateSummary"), true);
});

test("real URL fails", () => {
  const report = reportFor(firstItemPatch({ sourceId: "https://example.com/photo.jpg" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "sourceId"), true);
});

test("base64 raw image fails", () => {
  const report = reportFor(firstItemPatch({ rawImage: "data:image/png;base64,AAAA" }));

  assert.equal(report.reviewQueueValid, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

test("execution flags fail closed", () => {
  for (const flag of [
    "cloudTeacherEnabled",
    "providerConfigured",
    "networkCallsMade",
    "imageReadsPerformed",
    "crawlerEnabled",
    "downloadEnabled",
    "trainingEnabled",
    "runtimeIntegrationEnabled",
    "productionReady"
  ]) {
    const report = reportFor((sample) => {
      sample[flag] = true;
    });

    assert.equal(report.reviewQueueValid, false, flag);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true, flag);
  }
});

test("CLI confirms app runtime remains blocked and execution flags are false", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/check-aesthetic-human-review-queue.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.reviewQueueValid, true);
  assert.equal(report.appRuntimeEligibleCount, 0);
  assert.equal(report.humanReviewRequired, true);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
