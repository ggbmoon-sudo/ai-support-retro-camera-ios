import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  aestheticCloudTeacherContractSample
} from "../src/qa/aestheticCloudTeacherContract.mjs";
import {
  createDisabledCloudTeacherProviderAdapter,
  createStubCloudTeacherProviderAdapter
} from "../src/qa/aestheticCloudTeacherProviderAdapter.mjs";
import {
  disabledAestheticCloudTeacherProviderGateConfig
} from "../src/qa/aestheticCloudTeacherProviderGate.mjs";
import {
  runAestheticCloudTeacherProviderSmokeHarness
} from "../src/qa/aestheticCloudTeacherProviderSmokeHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(__dirname, "..");
const repoRoot = resolve(backendRoot, "..");
const ignoredConfigPath = resolve(backendRoot, "config", "aesthetic-cloud-teacher.local.json");
const exampleConfigPath = resolve(backendRoot, "config", "aesthetic-cloud-teacher.local.example.json");

function disabledConfig(patch = {}) {
  return { ...disabledAestheticCloudTeacherProviderGateConfig(), ...patch };
}

function futureReadyConfig(patch = {}) {
  return disabledConfig({
    enabled: true,
    allowNetworkCalls: true,
    providerConfigured: true,
    providerName: "sandbox_bucket",
    modelNameBucket: "sandbox_model_bucket",
    approvedSampleMode: "approved_local_ignored_sample",
    allowImageUpload: true,
    providerSandboxGateApproved: true,
    appRuntimeTransferBlocked: true,
    ...patch
  });
}

async function harness(input = {}) {
  return runAestheticCloudTeacherProviderSmokeHarness({
    config: disabledConfig(),
    ...input
  });
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

function assertHardBlocked(report, token) {
  assert.equal(report.hardValidationFailure, true, token);
  assert.equal(report.harnessValid, false, token);
  assert.equal(blockedFor(report, token), true, token);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
}

function stubWithTeacherResponse(patch) {
  const sample = aestheticCloudTeacherContractSample();
  return createStubCloudTeacherProviderAdapter({
    teacherResponse: {
      ...sample.response,
      ...patch
    }
  });
}

test("default CLI path is blocked_no_network and succeeds safely", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/run-aesthetic-cloud-teacher-provider-smoke-harness.mjs"],
    { cwd: backendRoot, encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "blocked_no_network");
  assert.equal(report.eligibleForProviderSmoke, false);
  assert.equal(report.providerSmokeAttempted, false);
  assert.equal(report.providerResponseReceived, false);
  assert.equal(report.hardValidationFailure, false);
  assert.equal(report.harnessValid, true);
  assert.equal(report.humanReviewQueueRequired, true);
  assert.equal(report.humanReviewQueueReady, true);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.rawPromptPersisted, false);
  assert.equal(report.rawProviderResponsePersisted, false);
  assert.equal(report.rawRequestPayloadPersisted, false);
  assert.equal(report.generatedReportsPersisted, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
  assert.equal(report.productionReady, false);
});

test("disabled config does not call provider", async () => {
  const adapter = createDisabledCloudTeacherProviderAdapter();
  const report = await harness({ adapter });

  assert.equal(report.runMode, "blocked_no_network");
  assert.equal(report.adapterMode, "disabled");
  assert.equal(report.providerConfigured, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.providerSmokeAttempted, false);
  assert.equal(report.providerResponseReceived, false);
  assert.equal(report.teacherContractValid, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.hardValidationFailure, false);
});

test("stub adapter can exercise contract and human review queue without provider execution", async () => {
  const report = await harness({
    adapter: createStubCloudTeacherProviderAdapter(),
    allowStubResponse: true
  });

  assert.equal(report.runMode, "stub_contract_only");
  assert.equal(report.providerSmokeAttempted, false);
  assert.equal(report.providerResponseReceived, false);
  assert.equal(report.teacherContractValid, true);
  assert.equal(report.humanReviewQueueReady, true);
  assert.equal(report.acceptedTeacherCandidateCount > 0, true);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.hardValidationFailure, false);
});

test("explicit provider flag without ignored config fails closed", async () => {
  const report = await harness({
    config: futureReadyConfig(),
    runProviderSmoke: true,
    explicitConfigProvided: false
  });

  assertHardBlocked(report, "run_provider_smoke_without_explicit_config");
  assert.equal(report.runMode, "blocked_provider_smoke_preflight");
  assert.equal(report.providerSmokeAttempted, false);
});

test("explicit provider flag without approved sample fails closed", async () => {
  const report = await harness({
    config: futureReadyConfig({
      approvedSampleMode: "none",
      allowImageUpload: false
    }),
    runProviderSmoke: true,
    explicitConfigProvided: true,
    configPath: ignoredConfigPath
  });

  assertHardBlocked(report, "provider_smoke_requires_approved_sample_mode");
  assert.equal(report.providerSmokeAttempted, false);
});

test("execution and persistence flags true fail hard", async () => {
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
    const report = await harness({ [flag]: true });

    assertHardBlocked(report, `${flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)}_true`);
  }
});

test("appRuntimeTransferBlocked false fails hard", async () => {
  const report = await harness({ appRuntimeTransferBlocked: false });

  assertHardBlocked(report, "app_runtime_transfer_not_blocked");
});

test("human review queue requirement false fails hard", async () => {
  const report = await harness({
    reviewQueueRequirement: {
      humanReviewRequired: false,
      reviewQueueRequired: false
    }
  });

  assertHardBlocked(report, "human_review_not_required");
  assert.equal(blockedFor(report, "review_queue_not_required"), true);
});

test("raw logging and generated report config flags fail hard", async () => {
  for (const flag of [
    "allowRawPromptLogging",
    "allowRawProviderResponseLogging",
    "allowRequestPayloadLogging",
    "allowGeneratedReports"
  ]) {
    const report = await harness({ config: disabledConfig({ [flag]: true }) });

    assertHardBlocked(report, `${flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)}_true`);
  }
});

test("API key and secret fields in config fail hard", async () => {
  for (const field of ["apiKey", "secret"]) {
    const report = await harness({
      config: disabledConfig({ [field]: "redacted-test-value" })
    });

    assertHardBlocked(report, field);
    assert.equal(JSON.stringify(report).includes("redacted-test-value"), false);
  }
});

test("committed local config path fails when provider smoke flag is used", async () => {
  const report = await harness({
    config: futureReadyConfig(),
    runProviderSmoke: true,
    explicitConfigProvided: true,
    configPath: exampleConfigPath
  });

  assertHardBlocked(report, "provider_smoke_requires_ignored_local_config");
  assert.equal(report.providerSmokeAttempted, false);
});

test("real URL raw path and base64 inputs fail hard without leaking values", async () => {
  for (const [field, value] of [
    ["realUrl", "https://example.com/private-photo.jpg"],
    ["localFilePath", "C:\\Users\\example\\private_photo.jpg"],
    ["rawImage", "data:image/png;base64,AAAA"]
  ]) {
    const report = await harness({ [field]: value });

    assertHardBlocked(report, field);
    assert.equal(JSON.stringify(report).includes(value), false);
  }
});

test("prompt text and provider payload inputs fail hard", async () => {
  for (const [field, value] of [
    ["promptText", "label this image with private prompt"],
    ["providerPayload", { messages: [{ role: "user", content: "private" }] }]
  ]) {
    const report = await harness({ [field]: value });

    assertHardBlocked(report, field);
    assert.equal(JSON.stringify(report).includes("label this image"), false);
    assert.equal(JSON.stringify(report).includes("private"), false);
  }
});

test("free-form provider UI copy fails contract validation", async () => {
  const report = await harness({
    adapter: stubWithTeacherResponse({ uiCopy: "Try this exact provider sentence in the app." }),
    allowStubResponse: true
  });

  assertHardBlocked(report, "teacher_contract");
  assert.equal(blockedFor(report, "uiCopy"), true);
});

test("score and rating in provider-shaped response fail contract validation", async () => {
  const report = await harness({
    adapter: stubWithTeacherResponse({ score: 98, rating: "excellent" }),
    allowStubResponse: true
  });

  assertHardBlocked(report, "teacher_contract");
  assert.equal(blockedFor(report, "score"), true);
});

test("sensitive inference in provider-shaped response fails contract validation", async () => {
  const sample = aestheticCloudTeacherContractSample();
  const report = await harness({
    adapter: stubWithTeacherResponse({
      safety: {
        ...sample.response.safety,
        sensitiveInferenceDetected: true
      }
    }),
    allowStubResponse: true
  });

  assertHardBlocked(report, "teacher_contract");
  assert.equal(blockedFor(report, "sensitive_inference_detected_not_false"), true);
});

test("chain-of-thought and debug leakage fail contract validation", async () => {
  const sample = aestheticCloudTeacherContractSample();
  const report = await harness({
    adapter: stubWithTeacherResponse({
      safety: {
        ...sample.response.safety,
        chainOfThoughtDetected: true,
        debugLeakageDetected: true
      }
    }),
    allowStubResponse: true
  });

  assertHardBlocked(report, "teacher_contract");
  assert.equal(blockedFor(report, "chain_of_thought_detected_not_false"), true);
  assert.equal(blockedFor(report, "debug_leakage_detected_not_false"), true);
});

test("provider SDK and package imports are absent from committed backend code path", () => {
  const packageJson = JSON.parse(readFileSync(resolve(backendRoot, "package.json"), "utf8"));
  const adapterSource = readFileSync(
    resolve(backendRoot, "src", "qa", "aestheticCloudTeacherProviderAdapter.mjs"),
    "utf8"
  );
  const harnessSource = readFileSync(
    resolve(backendRoot, "src", "qa", "aestheticCloudTeacherProviderSmokeHarness.mjs"),
    "utf8"
  );

  assert.deepEqual(packageJson.dependencies, {});
  assert.deepEqual(packageJson.devDependencies, {});
  assert.equal(/\b(openai|anthropic|gemini|googleai|qweapi)\b/i.test(adapterSource), false);
  assert.equal(/\b(openai|anthropic|gemini|googleai|qweapi)\b/i.test(harnessSource), false);
  assert.equal(/\bfetch\s*\(/.test(adapterSource), false);
  assert.equal(/\bfetch\s*\(/.test(harnessSource), false);
});

test("CLI provider flag without ignored config exits non-zero before network", () => {
  assert.throws(
    () => execFileSync(
      process.execPath,
      ["scripts/run-aesthetic-cloud-teacher-provider-smoke-harness.mjs", "--run-provider-smoke"],
      { cwd: backendRoot, encoding: "utf8", stdio: "pipe" }
    ),
    (error) => {
      const report = JSON.parse(error.stdout.toString("utf8"));
      assert.equal(report.runMode, "blocked_provider_smoke_preflight");
      assert.equal(report.providerSmokeAttempted, false);
      assert.equal(report.providerResponseReceived, false);
      assert.equal(report.networkCallsMade, false);
      assert.equal(report.imageReadsPerformed, false);
      assert.equal(report.trainingEnabled, false);
      assert.equal(report.runtimeIntegrationEnabled, false);
      assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
      assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
      assert.equal(report.productionReady, false);
      return report.hardValidationFailure === true;
    }
  );
});

test("ignored real local config is not committed", () => {
  assert.equal(existsSync(ignoredConfigPath), false);
  assert.equal(resolve(repoRoot, ".gitignore").endsWith(".gitignore"), true);
});
