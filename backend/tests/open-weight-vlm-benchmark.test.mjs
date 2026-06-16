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
  assertOpenWeightVlmLocalSmokeFailureTaxonomyReportRedacted,
  evaluateOpenWeightVlmLocalSmokeFailureTaxonomy
} from "../src/qa/openWeightVlmLocalSmokeFailureTaxonomy.mjs";
import {
  assertOpenWeightVlmExpandedFixtureRegistryReportRedacted,
  evaluateOpenWeightVlmExpandedFixtureRegistry,
  expandedFixtureRegistrySample,
  OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES
} from "../src/qa/openWeightVlmExpandedFixtureRegistry.mjs";
import {
  assertOpenWeightVlmExpandedFixtureProviderIntegrationDiagnosticRedacted,
  evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic,
  phase20GBlockedProviderIntegrationSample
} from "../src/qa/openWeightVlmExpandedFixtureProviderIntegrationDiagnostic.mjs";
import {
  evaluateOpenWeightVlmFixtureRoutingContractEchoFromList
} from "../src/qa/openWeightVlmFixtureRoutingContractEcho.mjs";
import {
  assertOpenWeightVlmServingBenchmarkPreflightReportRedacted,
  evaluateOpenWeightVlmServingBenchmarkPreflight,
  servingBenchmarkPreflightSample
} from "../src/qa/openWeightVlmServingBenchmarkPreflight.mjs";
import {
  assertOpenWeightVlmGatewayContractPreflightReportRedacted,
  evaluateOpenWeightVlmGatewayContractPreflight,
  gatewayContractPreflightSampleRequest,
  gatewayContractPreflightSampleResponse
} from "../src/qa/openWeightVlmGatewayContractPreflight.mjs";
import {
  assertOpenWeightVlmGatewayAdapterStubReportRedacted,
  evaluateOpenWeightVlmGatewayExternalContractEcho,
  gatewayAdapterStubSampleCandidate,
  gatewayAdapterStubSampleRequest,
  runOpenWeightVlmGatewayAdapterStub
} from "../src/qa/openWeightVlmGatewayAdapterStub.mjs";
import {
  assertOpenWeightVlmGatewayProviderRoutingReportRedacted,
  evaluateOpenWeightVlmGatewayProviderRoute,
  evaluateOpenWeightVlmGatewayProviderRoutingDryRun
} from "../src/qa/openWeightVlmGatewayProviderRouting.mjs";
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
const LOCAL_FAILURE_TAXONOMY_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-local-smoke-failure-taxonomy.mjs", import.meta.url);
const EXPANDED_FIXTURE_REGISTRY_SCRIPT_URL = new URL("../scripts/check-open-weight-vlm-expanded-fixture-registry.mjs", import.meta.url);
const EXPANDED_FIXTURE_PROVIDER_DIAGNOSTIC_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-expanded-fixture-provider-integration.mjs", import.meta.url);
const FIXTURE_ROUTING_CONTRACT_ECHO_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-fixture-routing-contract-echo.mjs", import.meta.url);
const SERVING_BENCHMARK_PREFLIGHT_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-serving-benchmark-preflight.mjs", import.meta.url);
const GATEWAY_CONTRACT_PREFLIGHT_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-gateway-contract-preflight.mjs", import.meta.url);
const GATEWAY_ADAPTER_STUB_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-gateway-adapter-stub.mjs", import.meta.url);
const GATEWAY_EXTERNAL_CONTRACT_ECHO_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-gateway-external-contract-echo.mjs", import.meta.url);
const GATEWAY_PROVIDER_ROUTING_SCRIPT_URL =
  new URL("../scripts/check-open-weight-vlm-gateway-provider-routing.mjs", import.meta.url);

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

test("open-weight VLM local smoke repeatability gate accepts explicit expanded fixture count", () => {
  const summary = summarizeOpenWeightVlmLocalSmokeRepeatability([
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s"),
    repeatabilityFixture("5s_to_15s")
  ]);
  const defaultGate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary);
  const expandedGate = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(summary, {
    requiredFixtureCount: 8
  });

  assert.equal(summary.fixtureCount, 8);
  assert.equal(defaultGate.eligibleForLocalRepeatabilityReview, false);
  assert.equal(defaultGate.statusCategories.includes("blocked_for_unapproved_fixture"), true);
  assert.equal(expandedGate.productionReady, false);
  assert.equal(expandedGate.eligibleForLocalRepeatabilityReview, true);
  assert.equal(expandedGate.hardBlockers.length, 0);
  assert.equal(expandedGate.reviewedAggregate.acceptedCount, 8);
  assert.equal(assertOpenWeightVlmLocalSmokeRepeatabilityGateReportRedacted(expandedGate).ok, true);
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

test("open-weight VLM local smoke failure taxonomy classifies clean pass", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate());

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForLocalSmokeReview, true);
  assert.equal(report.latencyCategory, "latency_ok");
  assert.equal(report.statusCategories.includes("pass_clean_local_smoke"), true);
  assert.equal(report.statusCategories.includes("not_production_ready"), true);
  assert.deepEqual(report.hardBlockers, []);
  assert.equal(assertOpenWeightVlmLocalSmokeFailureTaxonomyReportRedacted(report).ok, true);
});

test("open-weight VLM local smoke failure taxonomy allows accepted latency note", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    latencyBucketCounts: { gt_15s: 1, "5s_to_15s": 2 }
  }));

  assert.equal(report.eligibleForLocalSmokeReview, true);
  assert.equal(report.latencyCategory, "latency_note");
  assert.equal(report.statusCategories.includes("pass_with_latency_note"), true);
  assert.equal(report.warnings.some((item) => item.code === "latency_gt_15s_observed"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks schema regression", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    acceptedCount: 2,
    rejectedCount: 1,
    acceptanceRate: 67,
    validationCodeCounts: { null: 2, unsupported_enum: 1 },
    fallbackCategoryCounts: { null: 2, invalid_schema: 1 },
    schemaErrorBucketCounts: { unsupported_enum: 1 },
    schemaFieldBucketCounts: { visualObservationKey: 1 }
  }));

  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.statusCategories.includes("blocked_for_schema_regression"), true);
  assert.equal(report.reviewedAggregate.schemaFieldBucketCounts.visualObservationKey, 1);
});

test("open-weight VLM local smoke failure taxonomy blocks provider integration fallback", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    acceptedCount: 2,
    rejectedCount: 1,
    acceptanceRate: 67,
    fallbackCategoryCounts: { null: 2, blocked_for_provider_integration: 1 },
    latencyBucketCounts: { "5s_to_15s": 2, lt_1s: 1 }
  }));

  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.statusCategories.includes("blocked_for_provider_integration"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks raw persistence", () => {
  const promptReport = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    rawPromptPersisted: true
  }));
  const responseReport = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    rawModelResponsePersisted: true
  }));

  assert.equal(promptReport.statusCategories.includes("blocked_for_raw_persistence"), true);
  assert.equal(responseReport.statusCategories.includes("blocked_for_raw_persistence"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks unavailable model server", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    acceptedCount: 0,
    rejectedCount: 3,
    acceptanceRate: 0,
    fallbackCategoryCounts: { blocked_for_provider_integration: 3 },
    latencyBucketCounts: { timeout: 3 },
    modelServerAvailabilityBucketCounts: { unavailable: 1 },
    networkCallsMade: false
  }));

  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.latencyCategory, "latency_blocker");
  assert.equal(report.statusCategories.includes("blocked_for_model_server_unavailable"), true);
  assert.equal(report.statusCategories.includes("blocked_for_network_not_made_when_required"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks fixture readiness gaps", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    fixtureCount: 2,
    acceptedCount: 2,
    rejectedCount: 0,
    acceptanceRate: 100,
    validationCodeCounts: { null: 2 },
    fallbackCategoryCounts: { null: 2 },
    latencyBucketCounts: { "5s_to_15s": 2 },
    fixtureReadinessBucketCounts: { missing_approved_fixture: 1 }
  }));

  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.statusCategories.includes("blocked_for_fixture_readiness"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks repeatability drift", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    acceptedCount: 2,
    rejectedCount: 1,
    acceptanceRate: 67,
    validationCodeCounts: { null: 3 },
    fallbackCategoryCounts: { null: 3 }
  }));

  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.statusCategories.includes("blocked_for_repeatability_drift"), true);
});

test("open-weight VLM local smoke failure taxonomy classifies latency regression", () => {
  const slowReport = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    latencyBucketCounts: { gt_15s: 3 }
  }));
  const timeoutReport = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    acceptedCount: 0,
    rejectedCount: 3,
    acceptanceRate: 0,
    latencyBucketCounts: { timeout: 3 }
  }));

  assert.equal(slowReport.eligibleForLocalSmokeReview, true);
  assert.equal(slowReport.latencyCategory, "latency_regression");
  assert.equal(slowReport.statusCategories.includes("pass_with_minor_review_note"), true);
  assert.equal(timeoutReport.eligibleForLocalSmokeReview, false);
  assert.equal(timeoutReport.statusCategories.includes("blocked_for_latency_regression"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks productionReady true", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    productionReady: true
  }));

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.statusCategories.includes("blocked_for_production_flag"), true);
});

test("open-weight VLM local smoke failure taxonomy blocks unknown aggregate state", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    acceptedCount: 2,
    rejectedCount: 0,
    acceptanceRate: 100
  }));

  assert.equal(report.eligibleForLocalSmokeReview, false);
  assert.equal(report.statusCategories.includes("blocked_for_unknown_smoke_state"), true);
});

test("open-weight VLM local smoke failure taxonomy accepts explicit expanded fixture count", () => {
  const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(failureTaxonomyAggregate({
    fixtureCount: 8,
    acceptedCount: 8,
    rejectedCount: 0,
    acceptanceRate: 100,
    validationCodeCounts: { null: 8 },
    fallbackCategoryCounts: { null: 8 },
    latencyBucketCounts: { "5s_to_15s": 8 }
  }), {
    requiredFixtureCount: 8,
    baselineAcceptedCount: 8
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForLocalSmokeReview, true);
  assert.equal(report.latencyCategory, "latency_ok");
  assert.equal(report.statusCategories.includes("pass_clean_local_smoke"), true);
  assert.equal(assertOpenWeightVlmLocalSmokeFailureTaxonomyReportRedacted(report).ok, true);
});

test("open-weight VLM local smoke failure taxonomy script prints sanitized sample", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(LOCAL_FAILURE_TAXONOMY_SCRIPT_URL), "--sample=latency-note"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForLocalSmokeReview, true);
  assert.equal(report.latencyCategory, "latency_note");
  assert.equal(report.statusCategories.includes("pass_with_latency_note"), true);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("http://"), false);
  assert.equal(output.includes(".jpg"), false);
});

test("open-weight VLM expanded fixture registry passes dry-run review", () => {
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(expandedFixtureRegistrySample());

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.totalTargetFixtures, 12);
  assert.deepEqual(report.requiredCategories, OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES);
  assert.equal(report.totalFixtures, 12);
  assert.equal(report.approvedCount, 12);
  assert.equal(report.blockedCount, 0);
  assert.deepEqual(report.missingRequiredCategories, []);
  assert.deepEqual(report.blockedReasonCounts, {});
  assert.equal(report.eligibleForControlledSmoke, true);
  assert.equal(report.categoryCoverage.bright_daylight_clean, 1);
  assert.equal(assertOpenWeightVlmExpandedFixtureRegistryReportRedacted(report).ok, true);
});

test("open-weight VLM expanded fixture registry accepts local registry object shape", () => {
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry({
    schemaVersion: "open_weight_vlm_expanded_fixture_registry.local.v1",
    fixtures: expandedFixtureRegistrySample()
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.totalTargetFixtures, 12);
  assert.equal(report.requiredCategories.length, 12);
  assert.equal(report.totalFixtures, 12);
  assert.equal(report.approvedCount, 12);
  assert.equal(report.eligibleForControlledSmoke, true);
});

test("open-weight VLM expanded fixture registry reports 8-category registry missing planned categories", () => {
  const currentEightCategories = new Set([
    "bright_daylight_clean",
    "low_light_grain",
    "motion_blur_intentional",
    "high_contrast_shadow",
    "faded_color_retro",
    "imported_limited_context",
    "severe_blur_reject",
    "black_or_near_black_unreadable"
  ]);
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(
    expandedFixtureRegistrySample().filter((entry) => currentEightCategories.has(entry.category))
  );

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.totalTargetFixtures, 12);
  assert.equal(report.totalFixtures, 8);
  assert.equal(report.approvedCount, 8);
  assert.equal(report.blockedCount, 0);
  assert.equal(report.eligibleForControlledSmoke, false);
  assert.deepEqual(report.missingRequiredCategories, [
    "warm_indoor_ambient",
    "soft_focus_dreamy",
    "street_chrome_high_contrast",
    "overexposed_unreadable"
  ]);
});

test("open-weight VLM expanded fixture registry blocks missing metadata strip", () => {
  const registry = expandedFixtureRegistrySample();
  registry[0] = { ...registry[0], metadataStripped: false };
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForControlledSmoke, false);
  assert.equal(report.blockedReasonCounts.blocked_missing_metadata_strip, 1);
});

test("open-weight VLM expanded fixture registry blocks missing privacy review", () => {
  const registry = expandedFixtureRegistrySample();
  registry[0] = { ...registry[0], privacyReviewed: false };
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

  assert.equal(report.eligibleForControlledSmoke, false);
  assert.equal(report.blockedReasonCounts.blocked_privacy_review_missing, 1);
});

test("open-weight VLM expanded fixture registry blocks face, sensitive content, and private identifiers", () => {
  const registry = expandedFixtureRegistrySample();
  registry[0] = { ...registry[0], containsFace: true };
  registry[1] = { ...registry[1], containsSensitiveContent: true };
  registry[2] = { ...registry[2], containsPrivateIdentifier: true };
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

  assert.equal(report.eligibleForControlledSmoke, false);
  assert.equal(report.blockedReasonCounts.blocked_face_presence, 1);
  assert.equal(report.blockedReasonCounts.blocked_sensitive_content, 1);
  assert.equal(report.blockedReasonCounts.blocked_private_identifier, 1);
});

test("open-weight VLM expanded fixture registry blocks unknown categories", () => {
  const registry = expandedFixtureRegistrySample();
  registry[0] = { ...registry[0], category: "portrait_private_face" };
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

  assert.equal(report.eligibleForControlledSmoke, false);
  assert.equal(report.blockedReasonCounts.blocked_unknown_category, 1);
});

test("open-weight VLM expanded fixture registry blocks productionReady entry fields", () => {
  const registry = expandedFixtureRegistrySample();
  registry[0] = { ...registry[0], productionReady: true };
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForControlledSmoke, false);
  assert.equal(report.blockedReasonCounts.blocked_invalid_schema, 1);
});

test("open-weight VLM expanded fixture registry reports missing required category coverage", () => {
  const registry = expandedFixtureRegistrySample()
    .filter((entry) => entry.category !== "bright_daylight_clean");
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForControlledSmoke, false);
  assert.equal(report.missingRequiredCategories.includes("bright_daylight_clean"), true);
  assert.equal(report.categoryCoverage.bright_daylight_clean, 0);
});

test("open-weight VLM expanded fixture registry dry-run CLI is sanitized and no-network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(EXPANDED_FIXTURE_REGISTRY_SCRIPT_URL), "--dry-run"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.eligibleForControlledSmoke, true);
  assert.equal(report.totalTargetFixtures, 12);
  assert.equal(report.requiredCategories.length, 12);
  assert.equal(report.totalFixtures, 12);
  assert.equal(report.approvedCount, 12);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("\"requestPayload\":"), false);
  assert.equal(output.includes("http://"), false);
  assert.equal(output.includes(".jpg"), false);
  assert.equal(output.includes("C:\\"), false);
});

test("open-weight VLM expanded fixture provider diagnostic classifies fast provider block", () => {
  const report = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic(
    phase20GBlockedProviderIntegrationSample()
  );

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForRealSmokeRetry, false);
  assert.equal(report.diagnosticCategories.includes("likely_pre_inference_block"), true);
  assert.equal(report.diagnosticCategories.includes("likely_server_fixture_unavailable"), true);
  assert.equal(report.diagnosticCategories.includes("unlikely_schema_validator_issue"), true);
  assert.equal(report.diagnosticCategories.includes("unsafe_to_retry_real_smoke"), true);
  assert.equal(report.diagnosticCategories.includes("eligible_for_contract_echo_fixture_routing_check"), true);
  assert.equal(report.reviewedSignals.fallbackCategoryCounts.blocked_for_provider_integration, 8);
  assert.equal(assertOpenWeightVlmExpandedFixtureProviderIntegrationDiagnosticRedacted(report).ok, true);
});

test("open-weight VLM expanded fixture provider diagnostic separates schema diagnostics", () => {
  const report = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    validationCodeCounts: { unsupported_enum: 1 },
    schemaErrorBucketCounts: { unsupported_enum: 1 },
    schemaFieldBucketCounts: { visualObservationKey: 1 }
  });

  assert.equal(report.diagnosticCategories.includes("likely_server_response_contract_block"), true);
  assert.equal(report.diagnosticCategories.includes("unlikely_schema_validator_issue"), false);
});

test("open-weight VLM expanded fixture provider diagnostic flags registry and healthz gaps", () => {
  const serverUnavailable = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    backendFixtureRegistryEligible: true,
    externalServerFixtureRegistryEligible: false,
    serverFixtureAvailabilityBuckets: { missing: 8 }
  });
  const healthzGap = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    serverHealthBucket: "missing_fixture_availability"
  });

  assert.equal(serverUnavailable.diagnosticCategories.includes("likely_server_fixture_unavailable"), true);
  assert.equal(healthzGap.diagnosticCategories.includes("likely_healthz_fixture_availability_gap"), true);
});

test("open-weight VLM expanded fixture provider diagnostic flags routing and config switch buckets", () => {
  const routing = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    requestRoutingBucket: "fixture_token_mismatch"
  });
  const configSwitch = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    requestRoutingBucket: "config_fixture_not_updated"
  });

  assert.equal(routing.diagnosticCategories.includes("likely_backend_fixture_routing_mismatch"), true);
  assert.equal(configSwitch.diagnosticCategories.includes("likely_config_fixture_switching_issue"), true);
});

test("open-weight VLM expanded fixture provider diagnostic blocks production flag and raw persistence", () => {
  const production = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    productionReady: true
  });
  const rawPersistence = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic({
    ...phase20GBlockedProviderIntegrationSample(),
    rawPromptPersisted: true
  });

  assert.equal(production.hardBlockers.some((item) => item.category === "blocked_for_production_flag"), true);
  assert.equal(rawPersistence.hardBlockers.some((item) => item.category === "blocked_for_raw_persistence"), true);
});

test("open-weight VLM expanded fixture provider diagnostic CLI is sanitized and no-network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(EXPANDED_FIXTURE_PROVIDER_DIAGNOSTIC_SCRIPT_URL)], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForRealSmokeRetry, false);
  assert.equal(report.diagnosticCategories.includes("likely_pre_inference_block"), true);
  assert.equal(report.diagnosticCategories.includes("unsafe_to_retry_real_smoke"), true);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("\"requestPayload\":"), false);
  assert.equal(output.includes("http://"), false);
  assert.equal(output.includes(".jpg"), false);
  assert.equal(output.includes("C:\\"), false);
});

test("open-weight VLM fixture routing contract echo accepts twelve routeable tokens", () => {
  const report = evaluateOpenWeightVlmFixtureRoutingContractEchoFromList(routeEchoRows());

  assert.equal(report.productionReady, false);
  assert.equal(report.totalFixtureTokens, 12);
  assert.equal(report.routeableCount, 12);
  assert.equal(report.unavailableCount, 0);
  assert.equal(report.modelInferenceRun, false);
  assert.equal(report.rawPersistenceFlags, false);
  assert.equal(report.eligibleForRoutingReview, true);
  assert.equal(report.hardBlockers.length, 0);
});

test("open-weight VLM fixture routing contract echo blocks missing token", () => {
  const rows = routeEchoRows();
  rows[11] = { ...rows[11], routeable: false, available: false };
  const report = evaluateOpenWeightVlmFixtureRoutingContractEchoFromList(rows);

  assert.equal(report.eligibleForRoutingReview, false);
  assert.equal(report.routeableCount, 11);
  assert.equal(report.unavailableCount, 1);
  assert.equal(report.hardBlockers.some((item) => item.code === "fixture_token_unavailable"), true);
});

test("open-weight VLM fixture routing contract echo blocks inference raw persistence production and public exposure", () => {
  const model = evaluateOpenWeightVlmFixtureRoutingContractEchoFromList([
    ...routeEchoRows().slice(0, 11),
    { ...routeEchoRows()[11], modelInferenceRun: true }
  ]);
  const raw = evaluateOpenWeightVlmFixtureRoutingContractEchoFromList([
    ...routeEchoRows().slice(0, 11),
    { ...routeEchoRows()[11], rawPromptPersisted: true }
  ]);
  const production = evaluateOpenWeightVlmFixtureRoutingContractEchoFromList([
    ...routeEchoRows().slice(0, 11),
    { ...routeEchoRows()[11], productionReady: true }
  ]);
  const publicExposure = evaluateOpenWeightVlmFixtureRoutingContractEchoFromList([
    ...routeEchoRows().slice(0, 11),
    { ...routeEchoRows()[11], publicExposure: "public" }
  ]);

  assert.equal(model.hardBlockers.some((item) => item.code === "model_inference_detected"), true);
  assert.equal(raw.hardBlockers.some((item) => item.code === "raw_persistence_detected"), true);
  assert.equal(production.hardBlockers.some((item) => item.code === "production_ready_true"), true);
  assert.equal(publicExposure.hardBlockers.some((item) => item.code === "public_exposure_unsafe"), true);
});

test("open-weight VLM fixture routing contract echo CLI output is sanitized", () => {
  const fetchCalls = [];
  const reportPromise = import("../src/qa/openWeightVlmFixtureRoutingContractEcho.mjs")
    .then(({ evaluateOpenWeightVlmFixtureRoutingContractEcho }) => evaluateOpenWeightVlmFixtureRoutingContractEcho({
      fetchImpl: async (url, options) => {
        fetchCalls.push({ url: String(url), body: options.body });
        const parsed = JSON.parse(options.body);
        return {
          json: async () => routeEchoRows().find((row) => row.fixtureIdBucket === parsed.fixtureId)
        };
      }
    }));

  return reportPromise.then((report) => {
    const output = JSON.stringify(report);

    assert.equal(report.networkCallsMade, true);
    assert.equal(report.eligibleForRoutingReview, true);
    assert.equal(fetchCalls.length, 12);
    assert.equal(output.includes("modelOutput"), false);
    assert.equal(output.includes("fullPrompt"), false);
    assert.equal(output.includes("\"requestPayload\":"), false);
    assert.equal(output.includes(".jpg"), false);
    assert.equal(output.includes("C:\\"), false);
  });
});

test("open-weight VLM serving benchmark preflight passes valid no-network plan", () => {
  const report = evaluateOpenWeightVlmServingBenchmarkPreflight(servingBenchmarkPreflightSample());

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.eligibleForPhase21EntryReview, true);
  assert.equal(report.eligibleForBenchmarkExecution, false);
  assert.equal(report.statusCategories.includes("pass_for_serving_benchmark_preflight"), true);
  assert.equal(assertOpenWeightVlmServingBenchmarkPreflightReportRedacted(report).ok, true);
});

test("open-weight VLM serving benchmark preflight blocks missing serving stack", () => {
  const plan = servingBenchmarkPreflightSample();
  plan.servingStacks = plan.servingStacks.filter((stack) => stack.servingStack !== "vllm");
  const report = evaluateOpenWeightVlmServingBenchmarkPreflight(plan);

  assert.equal(report.eligibleForPhase21EntryReview, false);
  assert.equal(report.hardBlockers.includes("blocked_for_missing_serving_stack"), true);
  assert.equal(report.missingServingStacks.includes("vllm"), true);
});

test("open-weight VLM serving benchmark preflight blocks productionReady true", () => {
  const plan = servingBenchmarkPreflightSample();
  plan.productionReady = true;
  const report = evaluateOpenWeightVlmServingBenchmarkPreflight(plan);

  assert.equal(report.eligibleForPhase21EntryReview, false);
  assert.equal(report.hardBlockers.includes("blocked_for_production_flag"), true);
  assert.equal(report.productionReady, false);
});

test("open-weight VLM serving benchmark preflight blocks raw artifact policy", () => {
  const plan = servingBenchmarkPreflightSample();
  plan.artifactPolicy.rawPromptAllowed = true;
  plan.artifactPolicy.rawModelOutputAllowed = true;
  const report = evaluateOpenWeightVlmServingBenchmarkPreflight(plan);

  assert.equal(report.eligibleForPhase21EntryReview, false);
  assert.equal(report.hardBlockers.includes("blocked_for_raw_artifact_policy"), true);
});

test("open-weight VLM serving benchmark preflight blocks public endpoint and iOS scope", () => {
  const publicPlan = servingBenchmarkPreflightSample();
  publicPlan.publicEndpointAllowed = true;
  const publicReport = evaluateOpenWeightVlmServingBenchmarkPreflight(publicPlan);
  const iosPlan = servingBenchmarkPreflightSample();
  iosPlan.iosIntegrationScope = true;
  const iosReport = evaluateOpenWeightVlmServingBenchmarkPreflight(iosPlan);

  assert.equal(publicReport.hardBlockers.includes("blocked_for_public_endpoint"), true);
  assert.equal(iosReport.hardBlockers.includes("blocked_for_ios_integration_scope"), true);
});

test("open-weight VLM serving benchmark preflight blocks missing fixture set", () => {
  const plan = servingBenchmarkPreflightSample();
  plan.fixtureSetBucket = "unknown";
  const report = evaluateOpenWeightVlmServingBenchmarkPreflight(plan);

  assert.equal(report.eligibleForPhase21EntryReview, false);
  assert.equal(report.hardBlockers.includes("blocked_for_missing_fixture_set"), true);
});

test("open-weight VLM serving benchmark preflight blocks missing stop condition", () => {
  const plan = servingBenchmarkPreflightSample();
  plan.stopConditions = plan.stopConditions.filter((condition) => condition !== "schema_regression");
  const report = evaluateOpenWeightVlmServingBenchmarkPreflight(plan);

  assert.equal(report.eligibleForPhase21EntryReview, false);
  assert.equal(report.hardBlockers.includes("blocked_for_missing_stop_conditions"), true);
  assert.equal(report.missingStopConditions.includes("schema_regression"), true);
});

test("open-weight VLM serving benchmark preflight CLI is sanitized and no-network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(SERVING_BENCHMARK_PREFLIGHT_SCRIPT_URL)], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.eligibleForPhase21EntryReview, true);
  assert.equal(report.eligibleForBenchmarkExecution, false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("\"requestPayload\":"), false);
  assert.equal(output.includes("http://"), false);
  assert.equal(output.includes(".jpg"), false);
  assert.equal(output.includes("C:\\"), false);
});

test("open-weight VLM gateway contract preflight accepts a valid internal fixture-token request", () => {
  const report = evaluateOpenWeightVlmGatewayContractPreflight({
    request: gatewayContractPreflightSampleRequest(),
    response: gatewayContractPreflightSampleResponse()
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.eligibleForPhase21BPlanning, true);
  assert.equal(report.eligibleForAppIntegration, false);
  assert.equal(report.validationChain.includes("open_weight_vlm_candidate_validator"), true);
  assert.equal(assertOpenWeightVlmGatewayContractPreflightReportRedacted(report).ok, true);
});

test("open-weight VLM gateway contract preflight blocks raw image base64 path prompt and provider leakage", () => {
  const report = evaluateOpenWeightVlmGatewayContractPreflight({
    request: {
      ...gatewayContractPreflightSampleRequest(),
      rawImage: "data:image/png;base64,AAAA",
      imageBase64: "AAAA",
      imagePath: "C:\\Users\\lamch\\Desktop\\real.jpg",
      rawPrompt: "full prompt",
      providerApiKey: "secret",
      iosProviderKey: "secret",
      iosDirectProviderCall: true,
      appFacingEndpoint: true,
      productionEndpoint: true
    },
    response: gatewayContractPreflightSampleResponse()
  });
  const blockerCodes = new Set(report.hardBlockers);
  const serialized = JSON.stringify(report);

  assert.equal(report.eligibleForPhase21BPlanning, false);
  assert.equal(blockerCodes.has("blocked_for_raw_artifact_request"), true);
  assert.equal(blockerCodes.has("blocked_for_unsupported_request_field"), true);
  assert.equal(blockerCodes.has("blocked_for_unsanitized_request"), true);
  assert.equal(blockerCodes.has("blocked_for_public_endpoint"), true);
  assert.equal(serialized.includes("AAAA"), false);
  assert.equal(serialized.includes("C:\\Users\\lamch\\Desktop\\real.jpg"), false);
  assert.equal(serialized.includes("full prompt"), false);
});

test("open-weight VLM gateway contract preflight blocks gps exif sensor production free-form and score leakage", () => {
  const badRequest = {
    ...gatewayContractPreflightSampleRequest(),
    sourceType: "captured",
    gps: "1,2",
    rawExif: "foo",
    rawSensorValues: [1, 2, 3]
  };
  const badResponse = {
    ...gatewayContractPreflightSampleResponse(),
    text: "free form answer",
    score: 9,
    rating: 4.5,
    chainOfThought: "hidden reasoning",
    providerDebug: "debug"
  };
  const report = evaluateOpenWeightVlmGatewayContractPreflight({
    request: badRequest,
    response: badResponse
  });
  const blockerCodes = new Set(report.hardBlockers);

  assert.equal(report.eligibleForPhase21BPlanning, false);
  assert.equal(blockerCodes.has("blocked_for_raw_artifact_request"), true);
  assert.equal(blockerCodes.has("blocked_for_free_form_or_leaky_response"), true);
  assert.equal(blockerCodes.has("blocked_for_candidate_validation"), true);
});

test("open-weight VLM gateway contract preflight blocks productionReady true and app-facing or iOS direct provider fields", () => {
  const report = evaluateOpenWeightVlmGatewayContractPreflight({
    request: {
      ...gatewayContractPreflightSampleRequest(),
      productionReady: true,
      iosProviderKey: "secret",
      iosDirectProviderCall: true,
      cameraCloudEntry: true
    },
    response: {
      ...gatewayContractPreflightSampleResponse(),
      productionReady: true,
      appFacingEndpoint: true
    }
  });
  const blockerCodes = new Set(report.hardBlockers);

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForPhase21BPlanning, false);
  assert.equal(blockerCodes.has("blocked_for_production_flag"), true);
  assert.equal(blockerCodes.has("blocked_for_unsupported_request_field"), true);
  assert.equal(blockerCodes.has("blocked_for_unsupported_response_field"), true);
  assert.equal(blockerCodes.has("blocked_for_public_endpoint"), true);
});

test("open-weight VLM gateway contract preflight blocks sensitive inference chain of thought debug provider leakage and raw response leakage", () => {
  const report = evaluateOpenWeightVlmGatewayContractPreflight({
    request: gatewayContractPreflightSampleRequest(),
    response: {
      ...gatewayContractPreflightSampleResponse(),
      visualObservationKey: "observation.bright_daylight",
      safety: {
        sensitiveInferenceDetected: true,
        forbiddenInferenceTypes: ["face"],
        scoreOrRatingDetected: true,
        chainOfThoughtDetected: true,
        debugLeakageDetected: true
      }
    }
  });
  const blockerCodes = new Set(report.hardBlockers);

  assert.equal(report.eligibleForPhase21BPlanning, false);
  assert.equal(blockerCodes.has("blocked_for_candidate_safety"), true);
});

test("open-weight VLM gateway contract preflight CLI is sanitized and no-network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(GATEWAY_CONTRACT_PREFLIGHT_SCRIPT_URL)], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.eligibleForPhase21BPlanning, true);
  assert.equal(report.eligibleForAppIntegration, false);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("rawPrompt"), false);
  assert.equal(output.includes("requestPayload"), false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
  assert.equal(output.includes("C:\\"), false);
  assert.equal(output.includes("data:image"), false);
});

test("open-weight VLM gateway adapter stub accepts valid fixture-token request", () => {
  const report = runOpenWeightVlmGatewayAdapterStub({
    request: gatewayAdapterStubSampleRequest(),
    candidate: gatewayAdapterStubSampleCandidate()
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.acceptedCount, 1);
  assert.equal(report.rejectedCount, 0);
  assert.equal(report.eligibleForPhase21CPlanning, true);
  assert.equal(report.adapterChain.includes("open_weight_vlm_candidate_validator"), true);
  assert.equal(report.candidateSummary.candidateValidatorPassed, true);
  assert.equal(assertOpenWeightVlmGatewayAdapterStubReportRedacted(report).ok, true);
});

test("open-weight VLM gateway adapter stub blocks raw request fields and provider secrets", () => {
  const blockedRequests = [
    { rawImage: "data:image/png;base64,AAAA" },
    { imageBase64: "AAAA" },
    { imagePath: "C:\\Users\\lamch\\Desktop\\real.jpg" },
    { gps: "1,2", rawExif: "foo", rawSensorValues: [1, 2, 3] },
    { rawPrompt: "full prompt" },
    { providerApiKey: "secret", modelServerUrl: "http://127.0.0.1:8025" }
  ];

  for (const extra of blockedRequests) {
    const report = runOpenWeightVlmGatewayAdapterStub({
      request: {
        ...gatewayAdapterStubSampleRequest(),
        ...extra
      }
    });
    const serialized = JSON.stringify(report);

    assert.equal(report.eligibleForPhase21CPlanning, false);
    assert.equal(report.hardBlockers.includes("blocked_for_raw_artifact_request")
      || report.hardBlockers.includes("blocked_for_unsanitized_request"), true);
    assert.equal(serialized.includes("AAAA"), false);
    assert.equal(serialized.includes("C:\\Users\\lamch\\Desktop\\real.jpg"), false);
    assert.equal(serialized.includes("full prompt"), false);
    assert.equal(serialized.includes("http://127.0.0.1:8025"), false);
  }
});

test("open-weight VLM gateway adapter stub blocks endpoint flags and productionReady true", () => {
  const report = runOpenWeightVlmGatewayAdapterStub({
    request: {
      ...gatewayAdapterStubSampleRequest(),
      appFacingEndpoint: true,
      productionEndpoint: true,
      productionReady: true
    },
    candidate: {
      ...gatewayAdapterStubSampleCandidate(),
      productionReady: true
    }
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForPhase21CPlanning, false);
  assert.equal(report.hardBlockers.includes("blocked_for_public_endpoint"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_production_flag"), true);
});

test("open-weight VLM gateway adapter stub blocks free-form score sensitive chain-of-thought and debug leakage", () => {
  const report = runOpenWeightVlmGatewayAdapterStub({
    request: gatewayAdapterStubSampleRequest(),
    candidate: {
      ...gatewayAdapterStubSampleCandidate(),
      text: "free form",
      score: 9,
      rating: 4.5,
      chainOfThought: "hidden reasoning",
      providerDebug: "debug",
      safety: {
        sensitiveInferenceDetected: true,
        forbiddenInferenceTypes: ["face"],
        scoreOrRatingDetected: true,
        chainOfThoughtDetected: true,
        debugLeakageDetected: true
      }
    }
  });

  assert.equal(report.eligibleForPhase21CPlanning, false);
  assert.equal(report.hardBlockers.includes("blocked_for_free_form_or_leaky_response"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_candidate_safety")
    || report.hardBlockers.includes("blocked_for_candidate_validation"), true);
});

test("open-weight VLM gateway adapter stub CLI is sanitized and no-network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(GATEWAY_ADAPTER_STUB_SCRIPT_URL)], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.acceptedCount, 1);
  assert.equal(report.eligibleForPhase21CPlanning, true);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("rawPrompt"), false);
  assert.equal(output.includes("requestPayload"), false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
  assert.equal(output.includes("C:\\"), false);
  assert.equal(output.includes("data:image"), false);
});

test("open-weight VLM external gateway contract echo accepts mocked safe no-model response", async () => {
  const report = await evaluateOpenWeightVlmGatewayExternalContractEcho({
    fetchImpl: safeGatewayExternalEchoFetch
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, true);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.eligibleForExternalContractEchoReview, true);
  assert.equal(report.healthz.publicExposure, "no");
  assert.equal(report.healthz.rawLoggingDisabled, true);
  assert.equal(report.echo.modelInferenceRun, false);
  assert.equal(report.candidateSummary.candidateValidatorPassed, true);
});

test("open-weight VLM external gateway contract echo blocks unsafe mocked response", async () => {
  const report = await evaluateOpenWeightVlmGatewayExternalContractEcho({
    fetchImpl: unsafeGatewayExternalEchoFetch
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.eligibleForExternalContractEchoReview, false);
  assert.equal(report.hardBlockers.includes("blocked_for_public_exposure"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_raw_logging_enabled"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_model_inference"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_raw_persistence"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_free_form_or_leaky_response"), true);
});

test("open-weight VLM external gateway contract echo CLI can use mocked safe response", () => {
  const output = execFileSync(process.execPath, [
    fileURLToPath(GATEWAY_EXTERNAL_CONTRACT_ECHO_SCRIPT_URL),
    "--mock-safe"
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, true);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.eligibleForExternalContractEchoReview, true);
  assert.equal(output.includes("rawPrompt"), false);
  assert.equal(output.includes("requestPayload"), false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("C:\\"), false);
  assert.equal(output.includes("data:image"), false);
});

test("open-weight VLM gateway provider routing allows local stub dry-run", () => {
  const report = evaluateOpenWeightVlmGatewayProviderRoute({
    requestedProviderMode: "local_stub",
    productionReady: false
  });

  assert.equal(report.productionReady, false);
  assert.equal(report.routeAllowed, true);
  assert.equal(report.selectedRoute, "local_stub_adapter");
  assert.equal(report.networkCallsAllowed, false);
  assert.equal(report.modelCallsAllowed, false);
  assert.equal(report.qwenInferenceAllowed, false);
  assert.equal(assertOpenWeightVlmGatewayProviderRoutingReportRedacted(report).ok, true);
});

test("open-weight VLM gateway provider routing allows local contract echo policy only", () => {
  const report = evaluateOpenWeightVlmGatewayProviderRoute({
    requestedProviderMode: "local_contract_echo",
    productionReady: false
  });

  assert.equal(report.routeAllowed, true);
  assert.equal(report.selectedRoute, "local_private_no_model_contract_echo");
  assert.equal(report.networkCallsAllowed, true);
  assert.equal(report.modelCallsAllowed, false);
  assert.equal(report.qwenInferenceAllowed, false);
  assert.equal(report.benchmarkAllowed, false);
});

test("open-weight VLM gateway provider routing blocks non-approved provider modes", () => {
  const blockedModes = [
    "local_model_blocked",
    "future_vllm_blocked",
    "future_sglang_blocked",
    "manual_ollama_lmstudio_blocked",
    "production_blocked",
    "unknown_provider"
  ];

  for (const mode of blockedModes) {
    const report = evaluateOpenWeightVlmGatewayProviderRoute({
      requestedProviderMode: mode,
      productionReady: false
    });

    assert.equal(report.productionReady, false, mode);
    assert.equal(report.routeAllowed, false, mode);
    assert.equal(report.hardBlockers.length > 0, true, mode);
  }
});

test("open-weight VLM gateway provider routing blocks production endpoint and execution flags", () => {
  const report = evaluateOpenWeightVlmGatewayProviderRoute({
    requestedProviderMode: "local_stub",
    productionReady: true,
    appFacingEndpoint: true,
    productionEndpoint: true,
    modelCallsAllowed: true,
    qwenInferenceAllowed: true,
    benchmarkAllowed: true
  });

  assert.equal(report.routeAllowed, false);
  assert.equal(report.hardBlockers.includes("blocked_for_production_flag"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_app_facing_endpoint"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_production_endpoint"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_model_call"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_qwen_inference"), true);
  assert.equal(report.hardBlockers.includes("blocked_for_benchmark_execution"), true);
});

test("open-weight VLM gateway provider routing blocks raw artifact policy violations", () => {
  const report = evaluateOpenWeightVlmGatewayProviderRoute({
    requestedProviderMode: "local_stub",
    productionReady: false,
    rawArtifactPolicy: {
      rawPromptAllowed: true,
      rawModelOutputAllowed: true,
      rawImagePathAllowed: true,
      rawImageBase64Allowed: true,
      requestPayloadLoggingAllowed: true,
      providerResponseLoggingAllowed: true
    }
  });

  assert.equal(report.routeAllowed, false);
  assert.equal(report.hardBlockers.includes("blocked_for_raw_artifact_policy"), true);
});

test("open-weight VLM gateway provider routing dry-run reviews allowed and blocked modes", () => {
  const report = evaluateOpenWeightVlmGatewayProviderRoutingDryRun();

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.eligibleForPhase21DPlanning, true);
  assert.deepEqual(report.allowedProviderModes, ["local_stub", "local_contract_echo"]);
  assert.equal(report.blockedProviderModes.includes("local_model_blocked"), true);
  assert.equal(report.blockedProviderModes.includes("future_vllm_blocked"), true);
  assert.equal(report.blockedProviderModes.includes("future_sglang_blocked"), true);
  assert.equal(report.blockedProviderModes.includes("manual_ollama_lmstudio_blocked"), true);
  assert.equal(report.blockedProviderModes.includes("production_blocked"), true);
  assert.equal(report.blockedProviderModes.includes("unknown_provider"), true);
  assert.equal(assertOpenWeightVlmGatewayProviderRoutingReportRedacted(report).ok, true);
});

test("open-weight VLM gateway provider routing CLI is sanitized and no-network", () => {
  const output = execFileSync(process.execPath, [fileURLToPath(GATEWAY_PROVIDER_ROUTING_SCRIPT_URL)], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });
  const report = JSON.parse(output);

  assert.equal(report.productionReady, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.qwenInferenceRun, false);
  assert.equal(report.benchmarkRun, false);
  assert.equal(report.allowedProviderModes.includes("local_stub"), true);
  assert.equal(report.allowedProviderModes.includes("local_contract_echo"), true);
  assert.equal(output.includes("fullPrompt"), false);
  assert.equal(output.includes("rawPrompt"), false);
  assert.equal(output.includes("requestPayload"), false);
  assert.equal(output.includes("modelOutput"), false);
  assert.equal(output.includes("Authorization"), false);
  assert.equal(output.includes("Bearer "), false);
  assert.equal(output.includes("C:\\"), false);
  assert.equal(output.includes("data:image"), false);
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

function failureTaxonomyAggregate(overrides = {}) {
  return {
    schemaVersion: "open_weight_vlm_local_smoke_failure_taxonomy.test.v1",
    fixtureCount: 3,
    acceptedCount: 3,
    rejectedCount: 0,
    acceptanceRate: 100,
    validationCodeCounts: { null: 3 },
    fallbackCategoryCounts: { null: 3 },
    schemaErrorBucketCounts: {},
    schemaFieldBucketCounts: {},
    latencyBucketCounts: { "5s_to_15s": 3 },
    networkCallsMade: true,
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false,
    ...overrides
  };
}

function routeEchoRows() {
  return Array.from({ length: 12 }, (_, index) => ({
    fixtureIdBucket: `smoke_${String(index + 4).padStart(3, "0")}`,
    routeable: true,
    available: true,
    approvedLocalFixture: true,
    metadataStripped: true,
    privacyReviewed: true,
    modelInferenceRun: false,
    rawLoggingDisabled: true,
    publicExposure: "no",
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false
  }));
}

async function safeGatewayExternalEchoFetch(url) {
  if (String(url).endsWith("/healthz")) {
    return jsonResponse({
      ok: true,
      publicExposure: "no",
      rawLoggingDisabled: true,
      gatewayContractEchoAvailable: true,
      modelInferenceRun: false,
      productionReady: false
    });
  }
  return jsonResponse({
    ok: true,
    mode: "gateway_contract_echo",
    candidate: gatewayAdapterStubSampleCandidate(),
    modelInferenceRun: false,
    rawLoggingDisabled: true,
    publicExposure: "no",
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false
  });
}

async function unsafeGatewayExternalEchoFetch(url) {
  if (String(url).endsWith("/healthz")) {
    return jsonResponse({
      ok: true,
      publicExposure: "public",
      rawLoggingDisabled: false,
      modelInferenceRun: true,
      productionReady: true
    });
  }
  return jsonResponse({
    ok: true,
    mode: "gateway_contract_echo",
    text: "free form",
    modelInferenceRun: true,
    rawLoggingDisabled: false,
    publicExposure: "public",
    productionReady: true,
    rawPromptPersisted: true,
    rawModelResponsePersisted: true,
    rawImagePersisted: true,
    rawImagePathPersisted: true,
    requestPayloadPersisted: true
  });
}

function jsonResponse(value) {
  return {
    ok: true,
    json: async () => value
  };
}
