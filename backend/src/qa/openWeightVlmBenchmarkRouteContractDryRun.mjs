import {
  loadOpenWeightVlmLocalSandboxConfig
} from "./openWeightVlmLocalSandboxConfig.mjs";

export const BENCHMARK_ROUTE_CONTRACT_DRY_RUN_SCHEMA_VERSION =
  "open_weight_vlm_benchmark_route_contract_dry_run.v1";

export const BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS = Object.freeze([
  "smoke_004",
  "smoke_005",
  "smoke_006",
  "smoke_007",
  "smoke_008",
  "smoke_009",
  "smoke_010",
  "smoke_011",
  "smoke_012",
  "smoke_013",
  "smoke_014",
  "smoke_015"
]);

const RAW_LEAK_PATTERNS = Object.freeze([
  /rawPrompt(Text|Value|Content)?["']?\s*:/i,
  /rawModelOutput(Text|Value|Content)?["']?\s*:/i,
  /rawOutput(Text|Value|Content)?["']?\s*:/i,
  /requestPayload["']?\s*:\s*[\[{"]/i,
  /imageBase64/i,
  /base64,/i,
  /serverUrl/i,
  /modelServerUrl/i,
  /fixtureRegistry/i,
  /localConfig/i,
  /api[_-]?key/i,
  /secret/i,
  /authorization/i,
  /bearer\s+[a-z0-9._-]+/i,
  /https?:\/\//i,
  /[A-Za-z]:\\/
]);

export function buildBenchmarkRouteContractDryRunRequest(fixtureToken = null, modelId = "qwen2.5-vl-7b-instruct") {
  const request = {
    schemaVersion: "open_weight_vlm_local_fastapi_request.v1",
    modelId,
    outputContract: "photo_advisor_vlm_candidate.v1",
    noModelRouteContractCheck: true
  };
  if (fixtureToken) {
    request.fixtureId = fixtureToken;
  }
  return request;
}

export async function runBenchmarkRouteContractDryRun({
  configPath,
  fetchImpl = fetch
} = {}) {
  const blockers = [];
  const loaded = await loadOpenWeightVlmLocalSandboxConfig(configPath, {
    requireConfig: true
  });

  if (!loaded.ok) {
    blockers.push("blocked_for_invalid_local_config");
  }

  const config = loaded.runtimeValue || {};
  const endpointBucket = normalizeEndpointBucket(loaded.value?.modelServerUrlBucket);
  if (!["local_loopback", "private_lan"].includes(endpointBucket)) {
    blockers.push("blocked_for_unsafe_endpoint_bucket");
  }
  if (config.enabled !== true || config.allowNetworkCalls !== true || config.servingStack !== "transformers_fastapi") {
    blockers.push("blocked_for_local_model_config_not_ready");
  }

  let responses = [];
  let unsupportedResponse = null;
  let missingResponse = null;

  if (blockers.length === 0) {
    const endpoint = dryRunEndpoint(config.modelServerUrl);
    responses = await Promise.all(BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS.map((token) => (
      postDryRun(endpoint, buildBenchmarkRouteContractDryRunRequest(token, config.modelId), config.timeoutMs, fetchImpl)
    )));
    unsupportedResponse = await postDryRun(
      endpoint,
      buildBenchmarkRouteContractDryRunRequest("smoke_999", config.modelId),
      config.timeoutMs,
      fetchImpl
    );
    missingResponse = await postDryRun(
      endpoint,
      buildBenchmarkRouteContractDryRunRequest(null, config.modelId),
      config.timeoutMs,
      fetchImpl
    );
  }

  const validation = validateBenchmarkRouteContractDryRunResult({
    approvedResponses: responses,
    unsupportedResponse,
    missingResponse
  });
  blockers.push(...validation.blockers);

  const fixtureRouteabilityBuckets = bucketCounts(
    responses.map((response) => response.fixtureRouteabilityBucket || "missing")
  );
  const modelReadinessBuckets = bucketCounts(
    responses.map((response) => response.modelReadinessBucket || "missing")
  );
  const rootCauseBucket = inferRootCauseBucket({
    blockers,
    fixtureRouteabilityBuckets,
    unsupportedResponse,
    missingResponse
  });

  return {
    schemaVersion: BENCHMARK_ROUTE_CONTRACT_DRY_RUN_SCHEMA_VERSION,
    routeContractDryRunEligible: blockers.length === 0,
    routeContractDryRun: true,
    approvedFixtureTokens: [...BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS],
    approvedFixtureCount: BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS.length,
    acceptedDryRunCount: responses.filter((response) => response.ok === true && response.accepted === true).length,
    unsupportedBucket: unsupportedResponse?.errorBucket || "missing",
    missingBucket: missingResponse?.errorBucket || "missing",
    fixtureRouteabilityBuckets,
    modelReadinessBuckets,
    rootCauseBucket,
    modelCallExecuted: false,
    inferenceEndpointCalled: false,
    benchmarkRun: false,
    retryCount: 0,
    productionReady: false,
    blockers: [...new Set(blockers)],
    statusCategories: blockers.length === 0
      ? [
          "pass_for_benchmark_route_contract_dry_run",
          rootCauseBucket,
          "not_production_ready"
        ]
      : [
          "blocked_for_benchmark_route_contract_dry_run",
          ...[...new Set(blockers)],
          "not_production_ready"
        ]
  };
}

export function validateBenchmarkRouteContractDryRunResult({
  approvedResponses = [],
  unsupportedResponse = null,
  missingResponse = null
} = {}) {
  const blockers = [];
  if (!Array.isArray(approvedResponses) || approvedResponses.length !== BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS.length) {
    blockers.push("blocked_for_approved_fixture_count_mismatch");
  }

  approvedResponses.forEach((response, index) => {
    const expectedToken = BENCHMARK_ROUTE_CONTRACT_DRY_RUN_TOKENS[index];
    if (!isPlainObject(response)) {
      blockers.push("blocked_for_invalid_dry_run_response");
      return;
    }
    if (response.fixtureIdBucket !== expectedToken || response.ok !== true || response.accepted !== true) {
      blockers.push("blocked_for_approved_fixture_contract_mismatch");
    }
    if (response.routeContractDryRun !== true) {
      blockers.push("blocked_for_missing_dry_run_flag");
    }
    if (response.modelCallExecuted === true || response.modelInferenceRun === true) {
      blockers.push("blocked_for_model_call_execution");
    }
    if (response.inferenceEndpointCalled === true) {
      blockers.push("blocked_for_inference_endpoint_call");
    }
    if (response.benchmarkRun === true) {
      blockers.push("blocked_for_benchmark_run");
    }
    if (response.productionReady === true) {
      blockers.push("blocked_for_production_ready");
    }
    if (response.errorBucket === "unknown" || response.errorBucket === "local_model_unavailable") {
      blockers.push("blocked_for_ambiguous_route_contract_bucket");
    }
  });

  if (unsupportedResponse?.errorBucket !== "unsupported_fixture_token") {
    blockers.push("blocked_for_unsupported_token_bucket");
  }
  if (missingResponse?.errorBucket !== "missing_fixture_token") {
    blockers.push("blocked_for_missing_token_bucket");
  }
  if (
    unsupportedResponse?.errorBucket === "local_model_unavailable" ||
    missingResponse?.errorBucket === "local_model_unavailable"
  ) {
    blockers.push("blocked_for_ambiguous_route_contract_bucket");
  }
  if (hasRawArtifactLeakage({ approvedResponses, unsupportedResponse, missingResponse })) {
    blockers.push("blocked_for_raw_artifact_leakage");
  }

  return {
    ok: blockers.length === 0,
    blockers: [...new Set(blockers)]
  };
}

export function inferRootCauseBucket({
  blockers = [],
  fixtureRouteabilityBuckets = {},
  unsupportedResponse = null,
  missingResponse = null
} = {}) {
  if (blockers.includes("blocked_for_unsupported_token_bucket") || blockers.includes("blocked_for_missing_token_bucket")) {
    return "external_http_error_mapping_too_ambiguous";
  }
  if (blockers.includes("blocked_for_approved_fixture_contract_mismatch")) {
    return "request_body_shape_mismatch";
  }
  if ((fixtureRouteabilityBuckets.fixture_not_available || 0) > 0) {
    return "fixture_lookup_mismatch";
  }
  if (
    unsupportedResponse?.errorBucket === "local_model_unavailable" ||
    missingResponse?.errorBucket === "local_model_unavailable"
  ) {
    return "local_model_client_error_mapping_too_broad";
  }
  if (blockers.length > 0) {
    return "unknown";
  }
  return "route_contract_ready";
}

async function postDryRun(endpoint, body, timeoutMs, fetchImpl) {
  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(Math.min(timeoutMs || 5000, 10000))
    });
  } catch {
    return {
      ok: false,
      routeContractDryRun: false,
      accepted: false,
      errorBucket: "route_contract_dry_run_unavailable",
      modelCallExecuted: false,
      inferenceEndpointCalled: false,
      benchmarkRun: false,
      productionReady: false
    };
  }

  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return {
      ok: false,
      routeContractDryRun: false,
      accepted: false,
      errorBucket: "invalid_json",
      modelCallExecuted: false,
      inferenceEndpointCalled: false,
      benchmarkRun: false,
      productionReady: false
    };
  }
  return isPlainObject(parsed) ? parsed : {
    ok: false,
    routeContractDryRun: false,
    accepted: false,
    errorBucket: "invalid_json",
    modelCallExecuted: false,
    inferenceEndpointCalled: false,
    benchmarkRun: false,
    productionReady: false
  };
}

function dryRunEndpoint(modelServerUrl) {
  return new URL("/local/vlm/benchmark-route-contract-dry-run", modelServerUrl);
}

function normalizeEndpointBucket(bucket) {
  if (bucket === "local_loopback" || bucket === "local_loopback_name" || bucket === "local_loopback_ip" || bucket === "loopback") {
    return "local_loopback";
  }
  if (bucket === "private_lan" || bucket === "private_lan_ipv4" || bucket === "approved_private_lan") {
    return "private_lan";
  }
  if (bucket === "missing") {
    return "missing";
  }
  return sanitizeToken(bucket || "unknown");
}

function bucketCounts(values) {
  const counts = {};
  for (const value of values) {
    const key = sanitizeToken(value || "missing");
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function hasRawArtifactLeakage(value) {
  const serialized = JSON.stringify(value ?? {});
  return RAW_LEAK_PATTERNS.some((pattern) => pattern.test(serialized));
}

function sanitizeToken(value) {
  return String(value ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/gu, "_")
    .replace(/^_+|_+$/gu, "")
    .slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
