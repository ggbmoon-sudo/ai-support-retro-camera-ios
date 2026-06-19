import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  isControlledBenchmarkEndpointBucketAllowed,
  mapControlledBenchmarkHttpErrorBucket,
  normalizeControlledBenchmarkEndpointBucket
} from "../scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs";
import {
  validateOpenWeightVlmLocalSandboxConfig
} from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";

test("Transformers FastAPI controlled multi-fixture serving benchmark script is tightly guarded", async () => {
  const script = await readFile(
    new URL("../scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs", import.meta.url),
    "utf8"
  );

  assert.match(script, /--approved-controlled-benchmark/u);
  assert.match(script, /--serving-stack/u);
  assert.match(script, /transformers_fastapi_reference/u);
  assert.match(script, /--fixtures/u);
  assert.match(script, /smoke_004/u);
  assert.match(script, /smoke_015/u);
  assert.match(script, /blocked_for_smoke001_not_allowed/u);
  assert.match(script, /blocked_for_duplicate_fixture_token/u);
  assert.match(script, /blocked_for_fixture_token_set_mismatch/u);
  assert.match(script, /--call-count/u);
  assert.match(script, /APPROVED_FIXTURE_TOKENS\.length/u);
  assert.match(script, /--no-retry/u);
  assert.match(script, /controlled_multifixture_serving_benchmark/u);
  assert.match(script, /validateOpenWeightVlmPhotoAdvisorCandidate/u);
  assert.match(script, /rawOutputPersisted:\s*false/u);
  assert.match(script, /rawOutputPrinted:\s*false/u);
  assert.match(script, /rawPromptPersisted:\s*false/u);
  assert.match(script, /rawPayloadPersisted:\s*false/u);
  assert.match(script, /productionReady:\s*false/u);
  assert.doesNotMatch(script, /console\.log\(.*modelServerUrl/u);
  assert.doesNotMatch(script, /console\.log\(.*requestBody/u);
});

test("controlled multi-fixture endpoint bucket normalization matches safe local/private policy", () => {
  for (const [input, expected] of [
    ["local_loopback", "local_loopback"],
    ["local_loopback_name", "local_loopback"],
    ["local_loopback_ip", "local_loopback"],
    ["loopback", "local_loopback"],
    ["private_lan", "private_lan"],
    ["private_lan_ipv4", "private_lan"],
    ["approved_private_lan", "private_lan"]
  ]) {
    assert.equal(normalizeControlledBenchmarkEndpointBucket(input), expected);
    assert.equal(isControlledBenchmarkEndpointBucketAllowed(input), true);
  }

  for (const blockedBucket of [
    "public_ip",
    "public_domain",
    "ngrok_or_tunnel",
    "credentialed_url",
    "query_string_secret",
    "zero_zero_zero_zero",
    "unsafe_endpoint",
    "missing",
    "unknown"
  ]) {
    assert.equal(isControlledBenchmarkEndpointBucketAllowed(blockedBucket), false);
  }
});

test("controlled multi-fixture wrapper accepts the same safe config buckets as local sandbox config", () => {
  const loopbackConfig = validateOpenWeightVlmLocalSandboxConfig({
    ...baseConfig(),
    modelServerUrl: "http://127.0.0.1:8787/v1/local-model"
  });
  assert.equal(loopbackConfig.ok, true);
  assert.equal(isControlledBenchmarkEndpointBucketAllowed(loopbackConfig.value.modelServerUrlBucket), true);
  assert.equal(normalizeControlledBenchmarkEndpointBucket(loopbackConfig.value.modelServerUrlBucket), "local_loopback");

  const privateLanConfig = validateOpenWeightVlmLocalSandboxConfig({
    ...baseConfig(),
    modelServerUrl: "http://192.168.1.10:8787/v1/local-model",
    allowPrivateLanModelServer: true
  });
  assert.equal(privateLanConfig.ok, true);
  assert.equal(privateLanConfig.value.modelServerUrlBucket, "private_lan_ipv4");
  assert.equal(isControlledBenchmarkEndpointBucketAllowed(privateLanConfig.value.modelServerUrlBucket), true);
  assert.equal(normalizeControlledBenchmarkEndpointBucket(privateLanConfig.value.modelServerUrlBucket), "private_lan");
});

test("controlled multi-fixture endpoint policy keeps unsafe config buckets blocked", () => {
  for (const [modelServerUrl, expectedCode] of [
    ["http://8.8.8.8:8787/v1/local-model", "non_local_model_server_url"],
    ["http://example.com:8787/v1/local-model", "non_local_model_server_url"],
    ["http://example.ngrok-free.app/v1/local-model", "non_local_model_server_url"],
    ["http://user:pass@127.0.0.1:8787/v1/local-model", "unsafe_model_server_url"],
    ["http://127.0.0.1:8787/v1/local-model?token=secret", "unsafe_model_server_url"],
    ["http://0.0.0.0:8787/v1/local-model", "unsafe_model_server_url"]
  ]) {
    const report = validateOpenWeightVlmLocalSandboxConfig({
      ...baseConfig(),
      modelServerUrl
    });
    assert.equal(report.ok, false);
    assert.equal(report.error.code, expectedCode);
  }
});

test("controlled multi-fixture wrapper preserves sanitized HTTP error buckets", () => {
  assert.equal(mapControlledBenchmarkHttpErrorBucket("fixture_not_available"), "fixture_not_available");
  assert.equal(mapControlledBenchmarkHttpErrorBucket("missing_fixture_token"), "missing_fixture_token");
  assert.equal(mapControlledBenchmarkHttpErrorBucket("unsupported_fixture_token"), "unsupported_fixture_token");
  assert.equal(mapControlledBenchmarkHttpErrorBucket("route_not_found"), "route_not_found");
  assert.equal(mapControlledBenchmarkHttpErrorBucket("unexpected raw server thing"), "local_model_unavailable");
});

test("controlled multi-fixture private LAN requires explicit local opt in", () => {
  const report = validateOpenWeightVlmLocalSandboxConfig({
    ...baseConfig(),
    modelServerUrl: "http://192.168.1.10:8787/v1/local-model",
    allowPrivateLanModelServer: false
  });

  assert.equal(report.ok, false);
  assert.equal(report.error.code, "private_lan_not_allowed");
});

function baseConfig() {
  return {
    enabled: true,
    servingStack: "transformers_fastapi",
    modelId: "qwen2.5-vl-7b-instruct",
    modelServerUrl: "",
    timeoutMs: 30000,
    fixtureMode: "approved_local_only",
    allowNetworkCalls: true,
    allowPrivateLanModelServer: false,
    fixtureId: "smoke_004"
  };
}
