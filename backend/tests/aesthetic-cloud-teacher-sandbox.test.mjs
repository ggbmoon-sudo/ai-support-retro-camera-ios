import assert from "node:assert/strict";
import test from "node:test";
import {
  aestheticCloudTeacherSandboxSample,
  runAestheticCloudTeacherSandboxPreflight
} from "../src/qa/aestheticCloudTeacherSandbox.mjs";

function cloneSample() {
  return structuredClone(aestheticCloudTeacherSandboxSample());
}

function firstJobPatch(patch) {
  const sample = cloneSample();
  sample.jobPlan[0] = {
    ...sample.jobPlan[0],
    ...patch
  };
  return sample;
}

function blockedFor(report, fragment) {
  return report.blockedReasons.some((reason) => reason.includes(fragment));
}

test("valid synthetic job plan produces valid stub teacher responses", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_cloud_teacher_sandbox_preflight.v1");
  assert.equal(report.runMode, "stub_only");
  assert.equal(report.inputJobCount, 1);
  assert.equal(report.acceptedStubResponseCount, 1);
  assert.equal(report.rejectedStubResponseCount, 0);
  assert.equal(report.candidateLabelCounts.total, 3);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.stubResponses[0].contractValid, true);
  assert.equal(report.stubResponses[0].status, "accepted_stub_response");
  assert.equal(report.preflightValid, true);
});

test("unknown tag blocks job", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ allowedTagSubset: ["ERR_UNKNOWN_TAG"] })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_unknown_registry_tag_ERR_UNKNOWN_TAG"), true);
});

test("raw image or base64 blocks", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ rawImage: "/9j/base64payload" })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

test("local path blocks", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ localFilePath: "C:\\Users\\example\\private_photo.jpg" })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "localFilePath"), true);
  assert.equal(JSON.stringify(report).includes("private_photo.jpg"), false);
});

test("real URL blocks", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ assetRef: "https://example.com/private-photo.jpg" })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "assetRef"), true);
  assert.equal(JSON.stringify(report).includes("https://example.com"), false);
});

test("provider model and API key field blocks", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ providerModelName: "future-model", apiKey: "secret" })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "providerModelName"), true);
  assert.equal(blockedFor(report, "apiKey"), true);
});

test("cloudTeacherEnabled true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), cloudTeacherEnabled: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_cloud_teacher_enabled_not_false"), true);
});

test("providerConfigured true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), providerConfigured: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_provider_configured_not_false"), true);
});

test("networkCallsMade true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), networkCallsMade: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_network_calls_made_not_false"), true);
});

test("imageReadsPerformed true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), imageReadsPerformed: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_image_reads_performed_not_false"), true);
});

test("crawlerEnabled true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), crawlerEnabled: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_crawler_enabled_not_false"), true);
});

test("downloadEnabled true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), downloadEnabled: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_download_enabled_not_false"), true);
});

test("trainingEnabled true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), trainingEnabled: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_training_enabled_not_false"), true);
});

test("runtimeIntegrationEnabled true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), runtimeIntegrationEnabled: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_runtime_integration_enabled_not_false"), true);
});

test("productionReady true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({ ...cloneSample(), productionReady: true });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_production_ready_not_false"), true);
});

test("eligibleForAppRuntime true fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({
    ...cloneSample(),
    appTransferReadiness: { eligibleForAppRuntime: true, appRuntimeTransferBlocked: true }
  });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_app_runtime_transfer_eligibility"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight({
    ...cloneSample(),
    appTransferReadiness: { eligibleForAppRuntime: false, appRuntimeTransferBlocked: false }
  });

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_app_runtime_transfer_not_blocked"), true);
});

test("humanReviewRequired false fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ humanReviewRequired: false })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "blocked_for_missing_human_review_requirement"), true);
});

test("free-form UI copy fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ uiCopy: "Retake this bad photo now." })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "uiCopy"), true);
});

test("score or rating fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ scoreValue: 99, starRating: 5 })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "scoreValue"), true);
  assert.equal(blockedFor(report, "starRating"), true);
});

test("sensitive inference fails", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(
    firstJobPatch({ ageBucket: "adult", emotionLabel: "happy", identityName: "person" })
  );

  assert.equal(report.preflightValid, false);
  assert.equal(blockedFor(report, "ageBucket"), true);
  assert.equal(blockedFor(report, "emotionLabel"), true);
  assert.equal(blockedFor(report, "identityName"), true);
});

test("CLI output confirms stub_only and all disabled flags remain false", () => {
  const report = runAestheticCloudTeacherSandboxPreflight(cloneSample());

  assert.equal(report.runMode, "stub_only");
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
});
