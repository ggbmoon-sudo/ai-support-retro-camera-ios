import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { evaluateOpenWeightVlmBenchmarkGate } from "../src/qa/openWeightVlmBenchmarkGate.mjs";
import { runOpenWeightVlmLocalSandboxSmoke } from "../src/qa/openWeightVlmLocalSandboxClient.mjs";
import {
  evaluateOpenWeightVlmLocalSandboxGate,
  validateOpenWeightVlmLocalSandboxConfig
} from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";
import {
  assertOpenWeightVlmLocalSmokeGateReportRedacted,
  evaluateOpenWeightVlmLocalSmokeGate
} from "../src/qa/openWeightVlmLocalSmokeGate.mjs";
import {
  assertOpenWeightVlmLocalSmokeRepeatabilityGateReportRedacted,
  evaluateOpenWeightVlmLocalSmokeRepeatabilityGate,
  summarizeOpenWeightVlmLocalSmokeRepeatability
} from "../src/qa/openWeightVlmLocalSmokeRepeatabilityGate.mjs";
import {
  assertOpenWeightVlmBenchmarkReportRedacted,
  buildOpenWeightVlmSchemaDiagnostic,
  evaluateOpenWeightVlmBenchmarkCase,
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  summarizeOpenWeightVlmBenchmark,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";

const FIXTURE_URL = new URL("./fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json", import.meta.url);
const SCRIPT_URL = new URL("../scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs", import.meta.url);
const GATE_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs", import.meta.url);
const LOCAL_SANDBOX_CONFIG_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-local-sandbox-config.mjs", import.meta.url);
const LOCAL_SANDBOX_SMOKE_SCRIPT_URL = new URL("../scripts/run-open-weight-vlm-local-sandbox-smoke.mjs", import.meta.url);
const LOCAL_SMOKE_GATE_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-local-smoke-gate.mjs", import.meta.url);
const LOCAL_REPEATABILITY_GATE_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-local-smoke-repeatability-gate.mjs", import.meta.url);

test("open-weight VLM validator accepts valid synthetic benchmark fixtures", async () => {
  const cases = await benchmarkCases();

  for (const item of cases.filter((fixture) => fixture.expectedStatus === "accepted")) {
    const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

    assert.equal(result.ok, true, item.id);
    assert.equal(result.value.schemaVersion, OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION, item.id);
    assert.equal(result.value.safety.sensitiveInferenceDetected, false, item.id);
  }
});

test("open-weight VLM validator rejects invalid benchmark fixtures with expected codes", async () => {
  const cases = await benchmarkCases();

  for (const item of cases.filter((fixture) => fixture.expectedStatus === "rejected" && !fixture.stubFailure)) {
    const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

    assert.equal(result.ok, false, item.id);
    assert.equal(result.error.code, item.expectedCode, item.id);
    assert.equal(JSON.stringify(result).includes("provider debug output"), false, item.id);
    assert.equal(JSON.stringify(result).includes("score.8/10"), false, item.id);
  }
});

test("open-weight VLM validator rejects unsupported enum values", async () => {
  const base = validFixture("valid_bright_daylight", await benchmarkCases());
  const candidate = structuredClone(base.modelOutput);
  candidate.moodKey = "mood.provider_made_this_up";

  const result = validateOpenWeightVlmPhotoAdvisorCandidate(candidate);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unsupported_enum");
});

test("open-weight VLM schema diagnostics report sanitized mismatch buckets", () => {
  const shorthandCandidate = {
    schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    sourceType: "captured",
    allowedContext: {
      captureContextAvailable: true
    },
    moodKey: "quiet_warmth",
    observationKey: "soft_window_light",
    creativeIntent: "preserve",
    technicalRisk: "mild",
    filterFamilyCandidate: "warm_film",
    optionalActionKey: "hold_steady_if_cleaner",
    retakeAllowed: false,
    safetyFlags: []
  };
  const result = validateOpenWeightVlmPhotoAdvisorCandidate(shorthandCandidate);
  const diagnostic = buildOpenWeightVlmSchemaDiagnostic(shorthandCandidate, result.error);
  const serialized = JSON.stringify(diagnostic);

  assert.equal(result.ok, false);
  assert.equal(diagnostic.category, "invalid_schema");
  assert.equal(diagnostic.errorBuckets.includes("additional_property"), true);
  assert.equal(diagnostic.errorBuckets.includes("missing_required_field"), true);
  assert.equal(diagnostic.errorBuckets.includes("wrong_type"), true);
  assert.equal(diagnostic.errorBuckets.includes("unsupported_enum"), true);
  assert.equal(diagnostic.fieldBuckets.includes("allowedContext"), true);
  assert.equal(diagnostic.fieldBuckets.includes("visualObservationKey"), true);
  assert.equal(diagnostic.fieldBuckets.includes("observationKey"), true);
  assert.equal(diagnostic.fieldBuckets.includes("creativeIntent"), true);
  assert.equal(diagnostic.fieldBuckets.includes("technicalRisk"), true);
  assert.equal(diagnostic.fieldBuckets.includes("safety"), true);
  assert.equal(diagnostic.fieldBuckets.includes("safetyFlags"), true);
  assert.equal(diagnostic.rawOutputPersisted, false);
  assert.equal(diagnostic.rawOutputPrinted, false);
  assert.equal(serialized.includes("quiet_warmth"), false);
  assert.equal(serialized.includes("soft_window_light"), false);
  assert.equal(serialized.includes("hold_steady_if_cleaner"), false);
});

test("open-weight VLM validator rejects imported capture-context overclaims", async () => {
  const item = validFixture("imported_source_context_overclaim", await benchmarkCases());
  const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "source_context_overclaim");
});

test("open-weight VLM validator gates retake false positives", async () => {
  const item = validFixture("retake_false_positive", await benchmarkCases());
  const result = validateOpenWeightVlmPhotoAdvisorCandidate(item.modelOutput);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "retake_gate");
});

test("open-weight VLM benchmark report is sanitized aggregate output", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const serialized = JSON.stringify(report);

  assert.equal(report.productionReady, false);
  assert.equal(report.providerConfigured, false);
  assert.equal(report.modelServerConfigured, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.expectationFailureCount, 0);
  assert.equal(report.rawImagePersisted, false);
  assert.equal(report.rawPromptPersisted, false);
  assert.equal(report.rawModelResponsePersisted, false);
  assert.equal(assertOpenWeightVlmBenchmarkReportRedacted(report).ok, true);
  assert.equal(serialized.includes("modelOutput"), false);
  assert.equal(serialized.includes("{ not valid json"), false);
  assert.equal(serialized.includes("provider debug output"), false);
  assert.equal(serialized.includes("score.8/10"), false);
});

test("open-weight VLM benchmark fixtures cover the expanded failure taxonomy", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const requiredCategories = [
    "invalid_json",
    "schema_failed",
    "unsupported_enum",
    "unsupported_filter_family",
    "sensitive_inference",
    "score_or_rating",
    "chain_of_thought",
    "debug_or_provider_leakage",
    "source_context_overclaim",
    "retake_false_positive",
    "overlong_output",
    "prompt_injection",
    "raw_localization_key",
    "unsafe_free_text",
    "timeout_stub"
  ];

  assert.equal(cases.length >= 34, true);
  assert.equal(report.totalCases, 40);
  for (const category of requiredCategories) {
    assert.equal(report.failureTaxonomyCoverage[category] > 0, true, category);
  }
});

test("open-weight VLM synthetic benchmark script prints sanitized metrics only", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(SCRIPT_URL), "--synthetic"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.expectationFailureCount, 0);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("{ not valid json"), false);
  assert.equal(output.includes("provider debug output"), false);
  assert.equal(output.includes("score.8/10"), false);
});

test("open-weight VLM benchmark gate passes clean synthetic report", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const gate = evaluateOpenWeightVlmBenchmarkGate(report);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForSyntheticContractReview, true);
  assert.deepEqual(gate.hardBlockers, []);
  assert.equal(gate.statusCategories.includes("pass_for_synthetic_contract"), true);
  assert.equal(gate.reviewedMetrics.totalCases, 40);
  assert.equal(gate.reviewedMetrics.expectationFailureCount, 0);
  assert.equal(gate.blockedFixtureCounts.safetyBlockers, 3);
  assert.equal(gate.blockedFixtureCounts.schemaBlockers, 4);
  assert.equal(gate.blockedFixtureCounts.sourceContextOverclaimBlockers, 1);
  assert.equal(gate.blockedFixtureCounts.retakeGateBlockers, 1);
  assert.equal(gate.blockedFixtureCounts.leakageBlockers, 1);
  assert.equal(gate.blockedFixtureCounts.providerIntegrationBlockers, 1);
});

test("open-weight VLM benchmark gate blocks synthetic regressions", async () => {
  const cases = await benchmarkCases();
  const results = cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  const gate = evaluateOpenWeightVlmBenchmarkGate({
    ...report,
    expectationFailureCount: 1,
    acceptedSensitiveInferenceCount: 1,
    acceptedScoreRatingCount: 1,
    acceptedChainOfThoughtCount: 1,
    acceptedDebugLeakageCount: 1,
    acceptedSourceContextOverclaimCount: 1,
    acceptedUnsupportedFilterCount: 1,
    acceptedOverlongOutputCount: 1,
    acceptedPromptInjectionCount: 1,
    acceptedRawLocalizationKeyCount: 1,
    acceptedUnsafeFreeTextCount: 1,
    acceptedTimeoutStubCount: 1,
    networkCallsMade: true,
    productionReady: true
  });
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForSyntheticContractReview, false);
  assert.equal(blockerCodes.has("expectation_failures"), true);
  assert.equal(blockerCodes.has("accepted_sensitive_inference"), true);
  assert.equal(blockerCodes.has("accepted_score_rating"), true);
  assert.equal(blockerCodes.has("accepted_chain_of_thought"), true);
  assert.equal(blockerCodes.has("accepted_debug_leakage"), true);
  assert.equal(blockerCodes.has("accepted_imported_overclaim"), true);
  assert.equal(blockerCodes.has("accepted_unsupported_filter"), true);
  assert.equal(blockerCodes.has("accepted_overlong_output"), true);
  assert.equal(blockerCodes.has("accepted_prompt_injection"), true);
  assert.equal(blockerCodes.has("accepted_raw_localization_key"), true);
  assert.equal(blockerCodes.has("accepted_unsafe_free_text"), true);
  assert.equal(blockerCodes.has("accepted_timeout_stub"), true);
  assert.equal(blockerCodes.has("network_calls_made"), true);
  assert.equal(blockerCodes.has("production_ready_true"), true);
});

test("open-weight VLM benchmark gate script prints sanitized pass/fail summary only", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(GATE_SCRIPT_URL), "--synthetic"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const gate = JSON.parse(output);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForSyntheticContractReview, true);
  assert.equal(gate.hardBlockers.length, 0);
  assert.equal(gate.blockedFixtureCounts.safetyBlockers, 3);
  assert.equal(gate.blockedFixtureCounts.leakageBlockers, 1);
  assert.equal(gate.reviewedMetrics.networkCallsMade, false);
  assert.equal(gate.reviewedMetrics.totalCases, 40);
  assert.equal(gate.reviewedMetrics.failureTaxonomyCoverage.timeout_stub, 1);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("{ not valid json"), false);
  assert.equal(output.includes("provider debug output"), false);
  assert.equal(output.includes("score.8/10"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
  assert.equal(output.includes("dataBase64"), false);
});

test("open-weight VLM local sandbox config dry-run prints sanitized disabled summary", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(LOCAL_SANDBOX_CONFIG_SCRIPT_URL), "--dry-run"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const gate = JSON.parse(output);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.runMode, "dry_run");
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.hardBlockers.length, 0);
  assert.equal(gate.reviewedConfig.configEnabled, false);
  assert.equal(gate.reviewedConfig.allowNetworkCalls, false);
  assert.equal(gate.reviewedConfig.modelServerUrlBucket, "local_loopback_ip");
  assert.equal(gate.reviewedConfig.servingStack, "transformers_fastapi");
  assert.equal(gate.reviewedConfig.fixtureIdBucket, "configured");
  assert.equal(output.includes("http://127.0.0.1:8000"), false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
});

test("open-weight VLM local sandbox config rejects public or unsafe model URLs", () => {
  const publicUrl = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "vllm",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://example.com/v1",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });

  const credentialUrl = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "sglang",
    modelId: "qwen3-vl-8b-instruct",
    modelServerUrl: "http://token@example.local:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });

  assert.equal(publicUrl.ok, false);
  assert.equal(publicUrl.error.code, "non_local_model_server_url");
  assert.equal(JSON.stringify(publicUrl).includes("http://example.com/v1"), false);
  assert.equal(credentialUrl.ok, false);
  assert.equal(credentialUrl.error.code, "unsafe_model_server_url");
  assert.equal(JSON.stringify(credentialUrl).includes("token@example"), false);
});

test("open-weight VLM local sandbox config allows loopback model server URLs", () => {
  const loopbackIp = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });
  const loopbackName = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://localhost:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });

  assert.equal(loopbackIp.ok, true);
  assert.equal(loopbackIp.value.modelServerUrlBucket, "local_loopback_ip");
  assert.equal(loopbackIp.value.allowPrivateLanModelServer, false);
  assert.equal(loopbackName.ok, true);
  assert.equal(loopbackName.value.modelServerUrlBucket, "local_loopback_name");
});

test("open-weight VLM local sandbox config requires explicit private LAN opt-in", () => {
  const missingOptIn = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://192.168.1.50:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });
  const explicitFalse = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://10.1.2.3:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    allowPrivateLanModelServer: false
  });
  const explicitTrue = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://172.16.5.10:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    allowPrivateLanModelServer: true
  });
  const serialized = JSON.stringify(explicitTrue.value);

  assert.equal(missingOptIn.ok, false);
  assert.equal(missingOptIn.error.code, "private_lan_not_allowed");
  assert.equal(JSON.stringify(missingOptIn).includes("192.168.1.50"), false);
  assert.equal(explicitFalse.ok, false);
  assert.equal(explicitFalse.error.code, "private_lan_not_allowed");
  assert.equal(explicitTrue.ok, true);
  assert.equal(explicitTrue.value.modelServerUrlBucket, "private_lan_ipv4");
  assert.equal(explicitTrue.value.allowPrivateLanModelServer, true);
  assert.equal(serialized.includes("172.16.5.10"), false);
});

test("open-weight VLM local sandbox config rejects public, tunnel, wildcard, credentialed, and secret URLs", () => {
  const cases = [
    ["public_ip", "http://8.8.8.8:8025/local/vlm/photo-advisor", "non_local_model_server_url"],
    ["public_domain", "http://models.example.com/local/vlm/photo-advisor", "non_local_model_server_url"],
    ["tunnel_domain", "http://photo-advisor.ngrok-free.app/local/vlm/photo-advisor", "non_local_model_server_url"],
    ["wildcard_host", "http://0.0.0.0:8025/local/vlm/photo-advisor", "unsafe_model_server_url"],
    ["credentialed", "http://user:secret@127.0.0.1:8025/local/vlm/photo-advisor", "unsafe_model_server_url"],
    ["query_secret", "http://127.0.0.1:8025/local/vlm/photo-advisor?token=secret", "unsafe_model_server_url"],
    ["https_private_lan", "https://192.168.1.50:8025/local/vlm/photo-advisor", "unsupported_model_server_protocol"]
  ];

  for (const [name, modelServerUrl, expectedCode] of cases) {
    const result = validateOpenWeightVlmLocalSandboxConfig({
      enabled: true,
      servingStack: "transformers_fastapi",
      modelId: "qwen2.5-vl-7b-instruct",
      modelServerUrl,
      timeoutMs: 30000,
      fixtureMode: "approved_local_only",
      allowNetworkCalls: true,
      allowPrivateLanModelServer: true
    });
    const serialized = JSON.stringify(result);

    assert.equal(result.ok, false, name);
    assert.equal(result.error.code, expectedCode, name);
    assert.equal(serialized.includes("secret"), false, name);
    assert.equal(serialized.includes("ngrok-free"), false, name);
    assert.equal(serialized.includes("8.8.8.8"), false, name);
    assert.equal(serialized.includes("192.168.1.50"), false, name);
  }
});

test("open-weight VLM local sandbox gate fails closed without explicit network opt-in", () => {
  const validation = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers",
    modelId: "minicpm-v-4.5",
    modelServerUrl: "http://localhost:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: false
  });
  const gate = evaluateOpenWeightVlmLocalSandboxGate(validation.value);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(validation.ok, true);
  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForFutureLocalModelRun, false);
  assert.equal(blockerCodes.has("network_opt_in_missing"), true);
  assert.equal(JSON.stringify(gate).includes("http://localhost:8000"), false);
});

test("open-weight VLM future local model config gate blocks unsupported serving stacks", () => {
  const result = spawnSync(process.execPath, [fileURLToPath(LOCAL_SANDBOX_CONFIG_SCRIPT_URL), "--run-local-model"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const gate = JSON.parse(result.stdout);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.notEqual(result.status, 0);
  assert.equal(gate.productionReady, false);
  assert.equal(gate.runMode, "run_local_model");
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForFutureLocalModelRun, false);
  assert.equal(blockerCodes.has("sandbox_disabled"), true);
  assert.equal(result.stdout.includes("http://127.0.0.1:8000"), false);
  assert.equal(result.stdout.includes("modelOutput"), false);
  assert.equal(result.stdout.includes("Authorization"), false);
  assert.equal(result.stdout.includes("Bearer "), false);
});

test("open-weight VLM local sandbox smoke script validates stubbed output without network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(LOCAL_SANDBOX_SMOKE_SCRIPT_URL), "--dry-run"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.runMode, "stub_no_network");
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForLocalSandboxSmoke, true);
  assert.equal(report.hardBlockers.length, 0);
  assert.equal(report.stubbedBenchmark.totalCases, 1);
  assert.equal(report.stubbedBenchmark.acceptedCount, 1);
  assert.equal(report.stubbedBenchmark.expectationFailureCount, 0);
  assert.equal(report.benchmarkGate.eligibleForSyntheticContractReview, true);
  assert.equal(report.localClient.stubResponseValidated, true);
  assert.equal(output.includes("http://127.0.0.1:8000"), false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
  assert.equal(output.includes("base64"), false);
});

test("open-weight VLM local sandbox smoke client fails closed when config is missing", () => {
  const result = spawnSync(process.execPath, [
    fileURLToPath(LOCAL_SANDBOX_SMOKE_SCRIPT_URL),
    "--run-local-model",
    "--config",
    missingTempConfigPath()
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(result.stdout);
  const blockerCodes = new Set(report.hardBlockers.map((item) => item.code));

  assert.notEqual(result.status, 0);
  assert.equal(report.productionReady, false);
  assert.equal(report.runMode, "run_local_model");
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForLocalSandboxSmoke, false);
  assert.equal(report.eligibleForFutureLocalModelRun, false);
  assert.equal(blockerCodes.has("config_missing"), true);
  assert.equal(blockerCodes.has("unsupported_local_serving_stack"), true);
  assert.equal(result.stdout.includes("open-weight-vlm.local.json"), false);
  assert.equal(result.stdout.includes("http://127.0.0.1:8000"), false);
  assert.equal(result.stdout.includes("modelOutput"), false);
});

test("open-weight VLM local sandbox smoke client fails closed for disabled config", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: false,
    servingStack: "vllm",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://localhost:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: false
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true
  });
  const blockerCodes = new Set(report.hardBlockers.map((item) => item.code));

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForFutureLocalModelRun, false);
  assert.equal(report.reviewedConfig.configEnabled, false);
  assert.equal(blockerCodes.has("sandbox_disabled"), true);
  assert.equal(blockerCodes.has("network_opt_in_missing"), true);
  assert.equal(JSON.stringify(report).includes("http://localhost:8000"), false);
});

test("open-weight VLM local sandbox smoke client fails closed when network opt-in is missing", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "sglang",
    modelId: "qwen3-vl-8b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: false
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true
  });
  const blockerCodes = new Set(report.hardBlockers.map((item) => item.code));

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForFutureLocalModelRun, false);
  assert.equal(report.reviewedConfig.configEnabled, true);
  assert.equal(report.reviewedConfig.allowNetworkCalls, false);
  assert.equal(blockerCodes.has("network_opt_in_missing"), true);
  assert.equal(JSON.stringify(report).includes("http://127.0.0.1:8000"), false);
});

test("open-weight VLM local sandbox smoke client rejects public URL without leaking secrets", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "ollama",
    modelId: "minicpm-v-4.5",
    modelServerUrl: "https://token@example.com/v1?debug=true",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true
  });
  const serialized = JSON.stringify(report);
  const blockerCodes = new Set(report.hardBlockers.map((item) => item.code));

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(blockerCodes.has("unsafe_model_server_url"), true);
  assert.equal(serialized.includes("token@example"), false);
  assert.equal(serialized.includes("https://example.com/v1"), false);
  assert.equal(serialized.includes("debug=true"), false);
  assert.equal(serialized.includes(configPath), false);
});

test("open-weight VLM local smoke gate blocks missing config without network", () => {
  const result = spawnSync(process.execPath, [
    fileURLToPath(LOCAL_SMOKE_GATE_SCRIPT_URL),
    "--dry-run",
    "--config",
    missingTempConfigPath()
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const gate = JSON.parse(result.stdout);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.notEqual(result.status, 0);
  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, false);
  assert.equal(blockerCodes.has("config_missing"), true);
  assert.equal(blockerCodes.has("sandbox_disabled"), true);
  assert.equal(blockerCodes.has("network_opt_in_missing"), true);
  assert.equal(gate.prerequisites.syntheticBenchmarkGatePassed, true);
  assert.equal(gate.prerequisites.localSmokeDefaultPassed, true);
  assert.equal(result.stdout.includes("open-weight-vlm.local.json"), false);
  assert.equal(result.stdout.includes("http://127.0.0.1:8000"), false);
  assert.equal(result.stdout.includes("modelOutput"), false);
  assert.equal(result.stdout.includes("Authorization"), false);
});

test("open-weight VLM local smoke gate blocks disabled config", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: false,
    servingStack: "vllm",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://localhost:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: false
  });
  const gate = await localSmokeGateForConfig(configPath);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, false);
  assert.equal(blockerCodes.has("sandbox_disabled"), true);
  assert.equal(blockerCodes.has("network_opt_in_missing"), true);
  assert.equal(JSON.stringify(gate).includes("http://localhost:8000"), false);
});

test("open-weight VLM local smoke gate blocks network opt-in missing", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "sglang",
    modelId: "qwen3-vl-8b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: false
  });
  const gate = await localSmokeGateForConfig(configPath);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, false);
  assert.equal(blockerCodes.has("network_opt_in_missing"), true);
  assert.equal(JSON.stringify(gate).includes("http://127.0.0.1:8000"), false);
});

test("open-weight VLM local sandbox gate blocks productionReady true", () => {
  const validation = validateOpenWeightVlmLocalSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });
  const gate = evaluateOpenWeightVlmLocalSandboxGate({
    ...validation.value,
    productionReady: true
  });
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(validation.ok, true);
  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForFutureLocalModelRun, false);
  assert.equal(blockerCodes.has("production_ready_true"), true);
});

test("open-weight VLM local smoke gate blocks public or unsafe URL without leakage", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "ollama",
    modelId: "minicpm-v-4.5",
    modelServerUrl: "https://token@example.com/v1?debug=true",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });
  const gate = await localSmokeGateForConfig(configPath);
  const serialized = JSON.stringify(gate);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, false);
  assert.equal(blockerCodes.has("unsafe_model_server_url"), true);
  assert.equal(serialized.includes("token@example"), false);
  assert.equal(serialized.includes("https://example.com/v1"), false);
  assert.equal(serialized.includes("debug=true"), false);
  assert.equal(serialized.includes(configPath), false);
});

test("open-weight VLM local smoke gate blocks non-approved fixture mode", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "transformers",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://localhost:8000",
    timeoutMs: 30000,
    fixtureMode: "user_photos",
    allowNetworkCalls: true
  });
  const gate = await localSmokeGateForConfig(configPath);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, false);
  assert.equal(blockerCodes.has("invalid_fixture_mode"), true);
  assert.equal(blockerCodes.has("non_approved_fixture_mode"), true);
});

test("open-weight VLM local smoke gate can pass for safe ignored local config prerequisites", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true
  });
  const gate = await localSmokeGateForConfig(configPath);
  const serialized = JSON.stringify(gate);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, true);
  assert.equal(gate.hardBlockers.length, 0);
  assert.equal(gate.statusCategories.includes("pass_for_real_model_smoke_gate"), true);
  assert.equal(gate.reviewedConfig.modelServerUrlBucket, "local_loopback_ip");
  assert.equal(gate.prerequisites.syntheticBenchmarkGatePassed, true);
  assert.equal(gate.prerequisites.localSmokeDefaultPassed, true);
  assert.equal(assertOpenWeightVlmLocalSmokeGateReportRedacted(gate).ok, true);
  assert.equal(serialized.includes("http://127.0.0.1:8000"), false);
  assert.equal(serialized.includes(configPath), false);
  assert.equal(serialized.includes("modelOutput"), false);
  assert.equal(serialized.includes("base64"), false);
});

test("open-weight VLM local smoke gate can pass for explicit private LAN model server", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://192.168.1.50:8025/local/vlm/photo-advisor",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    allowPrivateLanModelServer: true
  });
  const gate = await localSmokeGateForConfig(configPath);
  const serialized = JSON.stringify(gate);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.networkCallsMade, false);
  assert.equal(gate.eligibleForRealModelSmoke, true);
  assert.equal(gate.hardBlockers.length, 0);
  assert.equal(gate.reviewedConfig.modelServerUrlBucket, "private_lan_ipv4");
  assert.equal(gate.reviewedConfig.allowPrivateLanModelServer, true);
  assert.equal(assertOpenWeightVlmLocalSmokeGateReportRedacted(gate).ok, true);
  assert.equal(serialized.includes("192.168.1.50"), false);
  assert.equal(serialized.includes(configPath), false);
  assert.equal(serialized.includes("http://"), false);
  assert.equal(serialized.includes("modelOutput"), false);
});

test("open-weight VLM local smoke repeatability gate passes B2 aggregate with latency note", () => {
  const summary = summarizeOpenWeightVlmLocalSmokeRepeatability(b2RepeatabilityFixtureResults());
  const gate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary);
  const serialized = JSON.stringify(gate);

  assert.equal(summary.fixtureCount, 3);
  assert.equal(summary.acceptedCount, 3);
  assert.equal(summary.rejectedCount, 0);
  assert.equal(summary.acceptanceRate, 100);
  assert.deepEqual(summary.validationCodeCounts, { null: 3 });
  assert.deepEqual(summary.fallbackCategoryCounts, { null: 3 });
  assert.deepEqual(summary.schemaErrorBucketCounts, {});
  assert.deepEqual(summary.schemaFieldBucketCounts, {});
  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForLocalRepeatabilityReview, true);
  assert.equal(gate.hardBlockers.length, 0);
  assert.equal(gate.statusCategories.includes("pass_for_local_repeatability_review"), true);
  assert.equal(gate.statusCategories.includes("pass_with_latency_note"), true);
  assert.equal(gate.warnings.some((item) => item.code === "latency_gt_15s_observed"), true);
  assert.equal(assertOpenWeightVlmLocalSmokeRepeatabilityGateReportRedacted(gate).ok, true);
  assert.equal(serialized.includes("modelOutput"), false);
  assert.equal(serialized.includes("fullPrompt"), false);
});

test("open-weight VLM local smoke repeatability gate blocks schema diagnostics", () => {
  const summary = summarizeOpenWeightVlmLocalSmokeRepeatability([
    ...b2RepeatabilityFixtureResults().slice(0, 2),
    {
      ...repeatabilityFixture("5s_to_15s"),
      acceptedCount: 0,
      rejectedCount: 1,
      validationCode: "invalid_schema",
      fallbackCategory: "invalid_schema",
      schemaDiagnostic: {
        errorBuckets: ["unsupported_enum"],
        fieldBuckets: ["visualObservationKey"]
      }
    }
  ]);
  const gate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary);
  const blockerCategories = new Set(gate.hardBlockers.map((item) => item.category));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForLocalRepeatabilityReview, false);
  assert.equal(blockerCategories.has("blocked_for_schema_regression"), true);
  assert.equal(gate.reviewedAggregate.schemaErrorBucketCounts.unsupported_enum, 1);
  assert.equal(gate.reviewedAggregate.schemaFieldBucketCounts.visualObservationKey, 1);
});

test("open-weight VLM local smoke repeatability gate blocks provider integration fallback", () => {
  const summary = summarizeOpenWeightVlmLocalSmokeRepeatability([
    ...b2RepeatabilityFixtureResults().slice(0, 2),
    {
      ...repeatabilityFixture("lt_1s"),
      acceptedCount: 0,
      rejectedCount: 1,
      fallbackCategory: "blocked_for_provider_integration"
    }
  ]);
  const gate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary);
  const blockerCodes = new Set(gate.hardBlockers.map((item) => item.code));

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForLocalRepeatabilityReview, false);
  assert.equal(blockerCodes.has("provider_integration_fallback_detected"), true);
  assert.equal(gate.statusCategories.includes("blocked_for_provider_integration"), true);
});

test("open-weight VLM local smoke repeatability gate blocks raw persistence", () => {
  const promptSummary = summarizeOpenWeightVlmLocalSmokeRepeatability([
    ...b2RepeatabilityFixtureResults().slice(0, 2),
    {
      ...repeatabilityFixture("5s_to_15s"),
      rawPromptPersisted: true
    }
  ]);
  const responseSummary = summarizeOpenWeightVlmLocalSmokeRepeatability([
    ...b2RepeatabilityFixtureResults().slice(0, 2),
    {
      ...repeatabilityFixture("5s_to_15s"),
      rawModelResponsePersisted: true
    }
  ]);
  const promptGate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(promptSummary);
  const responseGate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(responseSummary);

  assert.equal(promptGate.productionReady, false);
  assert.equal(promptGate.eligibleForLocalRepeatabilityReview, false);
  assert.equal(promptGate.statusCategories.includes("blocked_for_raw_persistence"), true);
  assert.equal(responseGate.productionReady, false);
  assert.equal(responseGate.eligibleForLocalRepeatabilityReview, false);
  assert.equal(responseGate.statusCategories.includes("blocked_for_raw_persistence"), true);
});

test("open-weight VLM local smoke repeatability gate blocks productionReady true", () => {
  const summary = summarizeOpenWeightVlmLocalSmokeRepeatability([
    ...b2RepeatabilityFixtureResults().slice(0, 2),
    {
      ...repeatabilityFixture("5s_to_15s"),
      productionReady: true
    }
  ]);
  const gate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForLocalRepeatabilityReview, false);
  assert.equal(gate.statusCategories.includes("blocked_for_production_flag"), true);
  assert.equal(gate.hardBlockers.some((item) => item.code === "production_ready_true"), true);
});

test("open-weight VLM local smoke repeatability gate script prints sanitized baseline", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(LOCAL_REPEATABILITY_GATE_SCRIPT_URL), "--baseline"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const gate = JSON.parse(output);

  assert.equal(gate.productionReady, false);
  assert.equal(gate.eligibleForLocalRepeatabilityReview, true);
  assert.equal(gate.reviewedAggregate.fixtureCount, 3);
  assert.equal(gate.reviewedAggregate.acceptedCount, 3);
  assert.equal(gate.reviewedAggregate.rejectedCount, 0);
  assert.equal(gate.statusCategories.includes("pass_for_local_repeatability_review"), true);
  assert.equal(gate.statusCategories.includes("pass_with_latency_note"), true);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("http://"), false);
  assert.equal(output.includes(".jpg"), false);
});

test("open-weight VLM local sandbox smoke rejects non FastAPI serving stacks without network", async () => {
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "vllm",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    fixtureId: "fixture_one"
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true
  });
  const blockerCodes = new Set(report.hardBlockers.map((item) => item.code));

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForFutureLocalModelRun, false);
  assert.equal(blockerCodes.has("unsupported_local_serving_stack"), true);
  assert.equal(JSON.stringify(report).includes("http://127.0.0.1:8000"), false);
});

test("open-weight VLM local sandbox smoke validates Transformers FastAPI candidate output", async () => {
  const received = [];
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    fixtureId: "fixture_one"
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true,
    fetchImpl: async (_url, request) => {
      received.push(JSON.parse(request.body));
      return jsonResponse(validFixture("valid_bright_daylight", await benchmarkCases()).modelOutput);
    }
  });
  const serialized = JSON.stringify(report);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, true);
  assert.equal(report.localModelSmoke.acceptedCount, 1);
  assert.equal(report.localModelSmoke.rejectedCount, 0);
  assert.equal(report.hardBlockers.length, 0);
  assert.equal(received.length, 1);
  assert.equal(received[0].fixtureId, "fixture_one");
  assert.equal(received[0].outputContract, OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION);
  assert.equal(serialized.includes("http://127.0.0.1:8000"), false);
  assert.equal(serialized.includes(configPath), false);
  assert.equal(serialized.includes("modelOutput"), false);
  assert.equal(serialized.includes("fixture_one"), false);
  assert.equal(serialized.includes("base64"), false);
});

test("open-weight VLM local sandbox smoke rejects invalid FastAPI candidate output", async () => {
  const invalidCandidate = {
    schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    sourceType: "imported",
    allowedContext: "imageOnly",
    moodKey: "mood.low_light_night",
    visualObservationKey: "observation.motion_blur",
    creativeIntent: {
      classification: "style_positive",
      preserveSignals: ["motion"]
    },
    technicalRisk: {
      level: "none",
      reasonKey: null
    },
    filterFamilyCandidate: "night_grain",
    optionalActionKey: "action.keep_style",
    retakeAllowed: false,
    retakeReasonKey: null,
    safety: {
      sensitiveInferenceDetected: false,
      forbiddenInferenceTypes: [],
      scoreOrRatingDetected: false,
      chainOfThoughtDetected: false,
      debugLeakageDetected: false
    }
  };
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    fixtureId: "fixture_one"
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true,
    fetchImpl: async () => jsonResponse({ candidate: invalidCandidate })
  });
  const blockerCodes = new Set(report.hardBlockers.map((item) => item.code));

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, true);
  assert.equal(report.localModelSmoke.acceptedCount, 0);
  assert.equal(report.localModelSmoke.validationCode, "source_context_overclaim");
  assert.equal(blockerCodes.has("source_context_overclaim"), true);
  assert.equal(JSON.stringify(report).includes("http://127.0.0.1:8000"), false);
});

test("open-weight VLM local sandbox smoke includes sanitized schema diagnostics", async () => {
  const shorthandCandidate = {
    schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    sourceType: "captured",
    allowedContext: {
      captureContextAvailable: true
    },
    moodKey: "quiet_warmth",
    observationKey: "soft_window_light",
    creativeIntent: "preserve",
    technicalRisk: "mild",
    filterFamilyCandidate: "warm_film",
    optionalActionKey: "hold_steady_if_cleaner",
    retakeAllowed: false,
    safetyFlags: []
  };
  const configPath = await writeTempSandboxConfig({
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "http://127.0.0.1:8000",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    fixtureId: "fixture_one"
  });
  const report = await runOpenWeightVlmLocalSandboxSmoke({
    configPath,
    requireConfig: true,
    runLocalModel: true,
    fetchImpl: async () => jsonResponse({ candidate: shorthandCandidate })
  });
  const diagnostic = report.localModelSmoke.schemaDiagnostic;
  const serialized = JSON.stringify(report);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, true);
  assert.equal(report.localModelSmoke.acceptedCount, 0);
  assert.equal(report.localModelSmoke.validationCode, "invalid_schema");
  assert.equal(diagnostic.category, "invalid_schema");
  assert.equal(diagnostic.errorBuckets.includes("missing_required_field"), true);
  assert.equal(diagnostic.errorBuckets.includes("wrong_type"), true);
  assert.equal(diagnostic.fieldBuckets.includes("visualObservationKey"), true);
  assert.equal(diagnostic.fieldBuckets.includes("safety"), true);
  assert.equal(diagnostic.rawOutputPersisted, false);
  assert.equal(diagnostic.rawOutputPrinted, false);
  assert.equal(serialized.includes("quiet_warmth"), false);
  assert.equal(serialized.includes("soft_window_light"), false);
  assert.equal(serialized.includes("hold_steady_if_cleaner"), false);
  assert.equal(serialized.includes("http://127.0.0.1:8000"), false);
  assert.equal(serialized.includes("fixture_one"), false);
});

async function benchmarkCases() {
  const fixture = JSON.parse(await readFile(FIXTURE_URL, "utf8"));
  return fixture.cases;
}

function validFixture(id, cases) {
  const item = cases.find((fixture) => fixture.id === id);
  assert.ok(item, `Missing fixture ${id}`);
  return item;
}

async function writeTempSandboxConfig(value) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "vlm-local-sandbox-"));
  const filePath = path.join(dir, "open-weight-vlm.local.json");
  await writeFile(filePath, JSON.stringify(value), "utf8");
  return filePath;
}

function missingTempConfigPath() {
  return path.join(os.tmpdir(), `missing-vlm-local-config-${Date.now()}-${Math.random().toString(16).slice(2)}.json`);
}

async function localSmokeGateForConfig(configPath) {
  const loaded = validateOpenWeightVlmLocalSandboxConfig(
    JSON.parse(await readFile(configPath, "utf8")),
    {
      configPresent: true,
      configPathBucket: "local_config"
    }
  );
  const cases = await benchmarkCases();
  const syntheticReport = summarizeOpenWeightVlmBenchmark(cases.map(evaluateOpenWeightVlmBenchmarkCase));
  const syntheticBenchmarkGate = evaluateOpenWeightVlmBenchmarkGate(syntheticReport);
  const localSmokeReport = await runOpenWeightVlmLocalSandboxSmoke({ runLocalModel: false });

  return evaluateOpenWeightVlmLocalSmokeGate({
    configSummary: loaded.value,
    configLoadedOk: loaded.ok,
    configErrorCode: loaded.error?.code,
    syntheticBenchmarkGate,
    localSmokeReport
  });
}

function b2RepeatabilityFixtureResults() {
  return [
    repeatabilityFixture("gt_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s")
  ];
}

function repeatabilityFixture(latencyBucket) {
  return {
    fixtureIdBucket: "configured",
    acceptedCount: 1,
    rejectedCount: 0,
    validationCode: null,
    fallbackCategory: null,
    schemaDiagnostic: null,
    latencyBucket,
    networkCallsMade: true,
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false
  };
}

function jsonResponse(value) {
  return {
    ok: true,
    json: async () => value
  };
}
