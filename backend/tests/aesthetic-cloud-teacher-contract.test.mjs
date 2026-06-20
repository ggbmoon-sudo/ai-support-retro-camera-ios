import assert from "node:assert/strict";
import test from "node:test";
import {
  aestheticCloudTeacherContractSample,
  evaluateAestheticCloudTeacherContract
} from "../src/qa/aestheticCloudTeacherContract.mjs";

function cloneSample() {
  return structuredClone(aestheticCloudTeacherContractSample());
}

function evaluateWithPatch(patch) {
  return evaluateAestheticCloudTeacherContract({ ...cloneSample(), ...patch });
}

function firstLabelPatch(patch) {
  const sample = cloneSample();
  sample.response.candidateLabels[0] = {
    ...sample.response.candidateLabels[0],
    ...patch
  };
  return sample;
}

test("valid Cloud AI Teacher contract stub passes", () => {
  const report = evaluateAestheticCloudTeacherContract(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_cloud_teacher_contract.v1");
  assert.equal(report.requestValid, true);
  assert.equal(report.responseValid, true);
  assert.equal(report.contractValid, true);
  assert.equal(report.candidateLabelCount, 1);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});

test("unknown tag fails", () => {
  const sample = firstLabelPatch({ tag: "ERR_UNKNOWN_TAG" });
  sample.request.allowedTagSubset = ["ERR_UNKNOWN_TAG"];
  const report = evaluateAestheticCloudTeacherContract(sample);

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unknown_registry_tag_ERR_UNKNOWN_TAG"), true);
});

test("score or rating field fails", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({ scoreValue: 98, starRating: 5 })
  );

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("scoreValue")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("starRating")), true);
});

test("sensitive inference field fails", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({ sensitiveInferenceDetected: true })
  );

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("sensitiveInferenceDetected")), true);
});

test("age gender emotion identity attractiveness health and body fields fail", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({
      ageBucket: "adult",
      genderLabel: "unknown",
      emotionLabel: "happy",
      identityName: "person",
      attractivenessScore: "high",
      healthSignal: "unknown",
      bodyTrait: "shape"
    })
  );

  assert.equal(report.contractValid, false);
  for (const key of ["ageBucket", "genderLabel", "emotionLabel", "identityName", "attractivenessScore", "healthSignal", "bodyTrait"]) {
    assert.equal(report.blockedReasons.some((reason) => reason.includes(key)), true);
  }
});

test("chain-of-thought field fails", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({ chainOfThought: "hidden reasoning" })
  );

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("chainOfThought")), true);
});

test("raw prompt provider and debug leakage fail", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({
      rawPrompt: "hidden prompt",
      rawProviderResponse: "hidden provider response",
      debugText: "hidden debug"
    })
  );

  assert.equal(report.contractValid, false);
  for (const key of ["rawPrompt", "rawProviderResponse", "debugText"]) {
    assert.equal(report.blockedReasons.some((reason) => reason.includes(key)), true);
  }
});

test("provider model and API key fields fail", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({
      providerModelName: "future-model",
      apiKey: "secret"
    })
  );

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("providerModelName")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("apiKey")), true);
});

test("real URL or local path in request fails and is not echoed", () => {
  const sample = cloneSample();
  sample.request.assetRef = "https://example.com/private-photo.jpg";
  sample.request.localFilePath = "C:\\Users\\example\\private_photo.jpg";

  const report = evaluateAestheticCloudTeacherContract(sample);
  const serialized = JSON.stringify(report);

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("assetRef")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("localFilePath")), true);
  assert.equal(serialized.includes("https://example.com"), false);
  assert.equal(serialized.includes("private_photo.jpg"), false);
});

test("base64 or raw image field fails", () => {
  const sample = cloneSample();
  sample.request.rawImage = "/9j/base64payload";

  const report = evaluateAestheticCloudTeacherContract(sample);

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("rawImage")), true);
});

test("humanReviewRequired false fails", () => {
  const sample = cloneSample();
  sample.request.humanReviewRequired = false;
  sample.response.review.humanReviewRequired = false;
  sample.response.candidateLabels[0].needsHumanReview = false;

  const report = evaluateAestheticCloudTeacherContract(sample);

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_request_missing_human_review_requirement"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_review_missing_human_review_requirement"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_candidate_missing_human_review_ERR_COMP_EXCESSIVE_HEADROOM"), true);
});

test("free-form UI copy fails", () => {
  const report = evaluateAestheticCloudTeacherContract(
    firstLabelPatch({ uiCopy: "Retake this bad photo now." })
  );

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("uiCopy")), true);
});

test("eligibleForAppRuntime true fails", () => {
  const sample = cloneSample();
  sample.response.appTransferReadiness.eligibleForAppRuntime = true;

  const report = evaluateAestheticCloudTeacherContract(sample);

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_app_runtime_transfer_eligibility"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const sample = cloneSample();
  sample.response.appTransferReadiness.appRuntimeTransferBlocked = false;

  const report = evaluateAestheticCloudTeacherContract(sample);

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_app_runtime_transfer_not_blocked"), true);
});

test("cloudTeacherEnabled true fails", () => {
  const report = evaluateWithPatch({ cloudTeacherEnabled: true });

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_cloud_teacher_enabled_not_false"), true);
});

test("networkCallsMade true fails", () => {
  const report = evaluateWithPatch({ networkCallsMade: true });

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_network_calls_made_not_false"), true);
});

test("trainingEnabled true fails", () => {
  const report = evaluateWithPatch({ trainingEnabled: true });

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_training_enabled_not_false"), true);
});

test("runtimeIntegrationEnabled true fails", () => {
  const report = evaluateWithPatch({ runtimeIntegrationEnabled: true });

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_runtime_integration_enabled_not_false"), true);
});

test("productionReady true fails", () => {
  const report = evaluateWithPatch({ productionReady: true });

  assert.equal(report.contractValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_production_ready_not_false"), true);
});

test("CLI-shaped output confirms disabled provider cloud network image training runtime modes", () => {
  const report = evaluateAestheticCloudTeacherContract(cloneSample());

  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.rawImagesCommitted, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});

test("CLI-shaped output confirms app runtime transfer remains blocked in OD-R4", () => {
  const report = evaluateAestheticCloudTeacherContract(cloneSample());

  assert.equal(report.appTransferReadiness.eligibleForParameterTuning, false);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.requiresHumanReview, true);
  assert.equal(report.appTransferReadiness.requiresBenchmark, true);
  assert.equal(report.appTransferReadiness.requiresSafetyGate, true);
  assert.equal(report.appTransferReadiness.requiresPerformanceGate, true);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
});

test("output contains no raw image path URL prompt provider payload or base64", () => {
  const report = evaluateAestheticCloudTeacherContract(cloneSample());
  const serialized = JSON.stringify(report).toLowerCase();

  assert.equal(serialized.includes("c:\\users"), false);
  assert.equal(serialized.includes("https://"), false);
  assert.equal(serialized.includes("rawprompt"), false);
  assert.equal(serialized.includes("requestpayload"), false);
  assert.equal(serialized.includes("/9j/"), false);
});
