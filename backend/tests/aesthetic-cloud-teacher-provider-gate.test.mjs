import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  disabledAestheticCloudTeacherProviderGateConfig,
  evaluateAestheticCloudTeacherProviderGate
} from "../src/qa/aestheticCloudTeacherProviderGate.mjs";
import {
  buildAestheticCloudTeacherRequestEnvelope,
  isAllowedAestheticCloudTeacherEnvelopeShape
} from "../src/qa/aestheticCloudTeacherRequestEnvelope.mjs";
import {
  aestheticParameterMiningBotDryRunSample,
  runAestheticParameterMiningBotDryRun
} from "../src/qa/aestheticParameterMiningBotDryRun.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(__dirname, "..");
const exampleConfigPath = resolve(backendRoot, "config", "aesthetic-cloud-teacher.local.example.json");

function disabledConfig(patch = {}) {
  return { ...disabledAestheticCloudTeacherProviderGateConfig(), ...patch };
}

function reportForConfig(patch = {}, explicitConfigProvided = false) {
  return evaluateAestheticCloudTeacherProviderGate({
    config: disabledConfig(patch),
    explicitConfigProvided
  });
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

function envelopeInput(patch = {}) {
  const dryRun = runAestheticParameterMiningBotDryRun(aestheticParameterMiningBotDryRunSample());
  const jobPlanItem = { ...dryRun.jobPlan[0], ...(patch.jobPlanItem || {}) };
  const teacherRequest = {
    ...jobPlanItem,
    registryVersion: dryRun.registryVersion,
    sourceType: "synthetic",
    ...(patch.teacherRequest || {})
  };
  return {
    jobPlanItem,
    teacherRequest,
    reviewQueueRequirement: {
      humanReviewRequired: true,
      reviewQueueRequired: true,
      ...(patch.reviewQueueRequirement || {})
    },
    ...(patch.root || {})
  };
}

function assertEnvelopeBlocked(patch, token) {
  assert.throws(
    () => buildAestheticCloudTeacherRequestEnvelope(envelopeInput(patch)),
    (error) => Array.isArray(error.blockedReasons) &&
      error.blockedReasons.some((reason) => reason.includes(token))
  );
}

test("disabled example config passes as safely blocked", () => {
  const config = JSON.parse(readFileSync(exampleConfigPath, "utf8"));
  const report = evaluateAestheticCloudTeacherProviderGate({ config });

  assert.equal(report.gateValid, true);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(report.eligibleForProviderSmoke, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.allowNetworkCalls, false);
  assert.equal(report.allowImageUpload, false);
  assert.equal(blockedFor(report, "cloud_teacher_disabled"), true);
  assert.equal(blockedFor(report, "provider_not_configured"), true);
});

test("readiness gate reports eligibleForProviderSmoke false by default", () => {
  const report = reportForConfig();

  assert.equal(report.schemaVersion, "aesthetic_cloud_teacher_provider_sandbox_readiness_gate.v1");
  assert.equal(report.gateName, "cloud_teacher_provider_sandbox_readiness");
  assert.equal(report.eligibleForProviderSmoke, false);
  assert.equal(report.approvedSampleMode, "none");
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.productionReady, false);
});

test("request envelope builder emits only redacted fields", () => {
  const envelope = buildAestheticCloudTeacherRequestEnvelope(envelopeInput());

  assert.equal(isAllowedAestheticCloudTeacherEnvelopeShape(envelope), true);
  assert.deepEqual(Object.keys(envelope), [
    "schemaVersion",
    "jobId",
    "imageId",
    "registryVersion",
    "allowedTagSubset",
    "assetRefType",
    "assetRefBucket",
    "sourceType",
    "teacherMode",
    "humanReviewRequired",
    "reviewQueueRequired",
    "redactionPolicy"
  ]);
  assert.equal(envelope.teacherMode, "provider_sandbox_pending");
  assert.equal(envelope.humanReviewRequired, true);
  assert.equal(envelope.reviewQueueRequired, true);
  assert.equal(JSON.stringify(envelope).includes("https://"), false);
  assert.equal(JSON.stringify(envelope).includes("label this image"), false);
  assert.equal(JSON.stringify(envelope).includes("secret"), false);
});

test("request envelope rejects raw URL path base64 prompt payload model key identity and GPS/EXIF inputs", () => {
  assertEnvelopeBlocked({ teacherRequest: { assetRef: "https://example.com/private-photo.jpg" } }, "assetRef");
  assertEnvelopeBlocked({ teacherRequest: { localFilePath: "C:\\Users\\example\\private_photo.jpg" } }, "localFilePath");
  assertEnvelopeBlocked({ teacherRequest: { rawImage: "data:image/png;base64,AAAA" } }, "rawImage");
  assertEnvelopeBlocked({ teacherRequest: { promptText: "label this image" } }, "promptText");
  assertEnvelopeBlocked({ teacherRequest: { providerPayload: { messages: [] } } }, "providerPayload");
  assertEnvelopeBlocked({ teacherRequest: { apiKey: "secret" } }, "apiKey");
  assertEnvelopeBlocked({ teacherRequest: { modelName: "future-real-model" } }, "modelName");
  assertEnvelopeBlocked({ teacherRequest: { userIdentity: "user@example.com" } }, "userIdentity");
  assertEnvelopeBlocked({ teacherRequest: { gps: "22.3,114.1", exif: "raw" } }, "gps");
});

test("logging and generated report flags true fail hard", () => {
  for (const flag of [
    "allowRawPromptLogging",
    "allowRawProviderResponseLogging",
    "allowRequestPayloadLogging",
    "allowGeneratedReports"
  ]) {
    const report = reportForConfig({ [flag]: true });

    assert.equal(report.gateValid, false, flag);
    assert.equal(report.hardValidationFailure, true, flag);
    assert.equal(blockedFor(report, `${flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)}_true`), true, flag);
  }
});

test("execution and persistence flags true fail hard", () => {
  for (const flag of [
    "networkCallsMade",
    "imageReadsPerformed",
    "rawPromptPersisted",
    "rawProviderResponsePersisted",
    "rawRequestPayloadPersisted",
    "generatedReportsPersisted",
    "trainingEnabled",
    "runtimeIntegrationEnabled",
    "eligibleForAppRuntime",
    "productionReady"
  ]) {
    const report = reportForConfig({ [flag]: true });

    assert.equal(report.gateValid, false, flag);
    assert.equal(report.hardValidationFailure, true, flag);
    assert.equal(report.networkCallsMade, false);
    assert.equal(report.imageReadsPerformed, false);
    assert.equal(report.trainingEnabled, false);
    assert.equal(report.runtimeIntegrationEnabled, false);
    assert.equal(report.productionReady, false);
  }
});

test("allowImageUpload true fails without approved sample mode", () => {
  const report = reportForConfig({ allowImageUpload: true });

  assert.equal(report.gateValid, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "image_upload_without_approved_sample_mode"), true);
});

test("allowImageUpload true with approved future sample mode is represented but makes no call", () => {
  const report = reportForConfig({
    allowImageUpload: true,
    approvedSampleMode: "approved_local_ignored_sample"
  }, true);

  assert.equal(report.gateValid, true);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(report.eligibleForProviderSmoke, false);
  assert.equal(report.allowImageUpload, true);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
});

test("providerConfigured true without ignored config fails", () => {
  const report = reportForConfig({ providerConfigured: true });

  assert.equal(report.gateValid, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "provider_configured_without_explicit_ignored_config"), true);
});

test("cloudTeacherEnabled true without gate approval fails", () => {
  const report = reportForConfig({ enabled: true });

  assert.equal(report.gateValid, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "cloud_teacher_enabled_without_gate_approval"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const report = reportForConfig({ appRuntimeTransferBlocked: false });

  assert.equal(report.gateValid, false);
  assert.equal(report.hardValidationFailure, true);
  assert.equal(blockedFor(report, "app_runtime_transfer_not_blocked"), true);
});

test("config rejects raw URL path base64 prompt provider payload and secrets", () => {
  for (const [field, value] of [
    ["publicUrl", "https://example.com/private-photo.jpg"],
    ["localFilePath", "C:\\Users\\example\\private_photo.jpg"],
    ["rawImage", "/9j/base64payload"],
    ["promptText", "hidden prompt"],
    ["providerPayload", "payload"],
    ["apiKey", "secret"]
  ]) {
    const report = reportForConfig({ [field]: value });

    assert.equal(report.gateValid, false, field);
    assert.equal(report.hardValidationFailure, true, field);
    assert.equal(blockedFor(report, field), true, field);
    assert.equal(JSON.stringify(report).includes("private-photo.jpg"), false);
    assert.equal(JSON.stringify(report).includes("hidden prompt"), false);
  }
});

test("CLI confirms no network image provider call and exits zero for disabled config", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/check-aesthetic-cloud-teacher-provider-gate.mjs"],
    { cwd: backendRoot, encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.eligibleForProviderSmoke, false);
  assert.equal(report.gateValid, true);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
