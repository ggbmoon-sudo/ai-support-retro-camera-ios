export const BACKEND_CONTRACT_ECHO_SCHEMA_VERSION =
  "open_weight_vlm_backend_no_model_contract_echo_validation.v1";

export const BACKEND_CONTRACT_ECHO_APPROVED_TOKENS = Object.freeze([
  "smoke_001",
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
  /rawPrompt/i,
  /rawModelOutput/i,
  /rawOutput/i,
  /requestPayload/i,
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

export function buildBackendNoModelContractEchoValidationPlan() {
  return {
    schemaVersion: BACKEND_CONTRACT_ECHO_SCHEMA_VERSION,
    validationKind: "backend_no_model_contract_echo_validation",
    endpointPathType: "no_model_contract_echo",
    approvedFixtureTokens: [...BACKEND_CONTRACT_ECHO_APPROVED_TOKENS],
    approvedTokenCount: BACKEND_CONTRACT_ECHO_APPROVED_TOKENS.length,
    contractEchoOnly: true,
    modelCallExecuted: false,
    benchmarkExecuted: false,
    inferenceEndpointCalled: false,
    retryCount: 0,
    productionReady: false
  };
}

export function validateBackendNoModelContractEchoResult(result = {}) {
  const blockers = [];
  const approvedTokens = Array.isArray(result.approvedFixtureTokens)
    ? result.approvedFixtureTokens
    : [];
  const approvedTokenBuckets = Array.isArray(result.approvedTokenBuckets)
    ? result.approvedTokenBuckets
    : approvedTokens;

  if (!sameOrderedTokens(approvedTokens, BACKEND_CONTRACT_ECHO_APPROVED_TOKENS)) {
    blockers.push("blocked_for_approved_token_set_mismatch");
  }
  if (result.approvedTokenCount !== BACKEND_CONTRACT_ECHO_APPROVED_TOKENS.length) {
    blockers.push("blocked_for_approved_token_count_mismatch");
  }
  if (result.contractEchoOnly !== true) {
    blockers.push("blocked_for_non_contract_echo_path");
  }
  if (result.modelCallExecuted !== false) {
    blockers.push("blocked_for_model_call_execution");
  }
  if (result.modelLoaded === true) {
    blockers.push("blocked_for_model_loaded");
  }
  if (result.inferenceEndpointCalled !== false) {
    blockers.push("blocked_for_inference_endpoint_call");
  }
  if (result.benchmarkExecuted !== false) {
    blockers.push("blocked_for_benchmark_execution");
  }
  if (result.benchmarkRun === true) {
    blockers.push("blocked_for_benchmark_run");
  }
  if (result.retryCount !== 0) {
    blockers.push("blocked_for_retry_count");
  }
  if (result.productionReady !== false) {
    blockers.push("blocked_for_production_ready");
  }
  if (result.unsupportedTokenBucket !== "unsupported_fixture_token") {
    blockers.push("blocked_for_unsupported_token_bucket");
  }
  if (result.missingTokenBucket !== "missing_fixture_token") {
    blockers.push("blocked_for_missing_token_bucket");
  }
  if (
    result.unsupportedTokenBucket === "local_model_unavailable" ||
    result.missingTokenBucket === "local_model_unavailable"
  ) {
    blockers.push("blocked_for_ambiguous_contract_echo_error_mapping");
  }
  if (!responsesAreContractShaped(result.approvedResponses)) {
    blockers.push("blocked_for_contract_echo_response_shape");
  }
  if (hasRawArtifactLeakage(result)) {
    blockers.push("blocked_for_raw_artifact_leakage");
  }

  return {
    schemaVersion: BACKEND_CONTRACT_ECHO_SCHEMA_VERSION,
    contractEchoValidationEligible: blockers.length === 0,
    approvedTokenCount: result.approvedTokenCount ?? 0,
    approvedTokenBuckets,
    unsupportedTokenBucket: result.unsupportedTokenBucket || "missing",
    missingTokenBucket: result.missingTokenBucket || "missing",
    modelCallExecuted: result.modelCallExecuted === true,
    modelLoaded: result.modelLoaded === true,
    inferenceEndpointCalled: result.inferenceEndpointCalled === true,
    benchmarkExecuted: result.benchmarkExecuted === true,
    benchmarkRun: result.benchmarkRun === true,
    retryCount: Number.isInteger(result.retryCount) ? result.retryCount : null,
    rawArtifactLeakageDetected: hasRawArtifactLeakage(result),
    productionReady: result.productionReady === true,
    blockers,
    statusCategories:
      blockers.length === 0
        ? [
            "pass_for_backend_no_model_contract_echo_validation",
            "contract_echo_only",
            "not_production_ready"
          ]
        : [
            "blocked_for_backend_no_model_contract_echo_validation",
            ...blockers,
            "not_production_ready"
          ]
  };
}

export function isSchemaShapedCandidate(value) {
  return (
    value &&
    typeof value === "object" &&
    value.schemaVersion === "photo_advisor_vlm_candidate.v1" &&
    typeof value.sourceType === "string" &&
    typeof value.moodKey === "string" &&
    typeof value.visualObservationKey === "string" &&
    value.creativeIntent &&
    typeof value.creativeIntent === "object" &&
    value.technicalRisk &&
    typeof value.technicalRisk === "object" &&
    value.safety &&
    typeof value.safety === "object"
  );
}

export function isSanitizedContractEchoObject(value) {
  return (
    value &&
    typeof value === "object" &&
    value.modelInferenceRun === false &&
    value.modelLoaded !== true &&
    value.inferenceEndpointCalled !== true &&
    value.benchmarkRun !== true &&
    value.rawLoggingDisabled === true &&
    value.publicExposure === "no" &&
    value.productionReady === false &&
    (value.ok === true || value.ok === false) &&
    (value.errorBucket === null ||
      value.errorBucket === undefined ||
      value.errorBucket === "unsupported_fixture_token" ||
      value.errorBucket === "missing_fixture_token" ||
      value.errorBucket === "route_not_found" ||
      value.errorBucket === "method_not_allowed" ||
      value.errorBucket === "contract_echo_disabled" ||
      value.errorBucket === "provider_integration_blocked")
  );
}

export function responsesAreContractShaped(responses) {
  return (
    Array.isArray(responses) &&
    responses.length === BACKEND_CONTRACT_ECHO_APPROVED_TOKENS.length &&
    responses.every((response) => {
      if (!response || typeof response !== "object") {
        return false;
      }
      const routing = response.routing;
      const gateway = response.gateway;
      return (
        response.fixtureToken &&
        BACKEND_CONTRACT_ECHO_APPROVED_TOKENS.includes(response.fixtureToken) &&
        isSanitizedContractEchoObject(routing) &&
        isSanitizedContractEchoObject(gateway) &&
        isSchemaShapedCandidate(gateway.candidate)
      );
    })
  );
}

export function hasRawArtifactLeakage(value) {
  const serialized = JSON.stringify(value ?? {});
  return RAW_LEAK_PATTERNS.some((pattern) => pattern.test(serialized));
}

function sameOrderedTokens(actual, expected) {
  return (
    actual.length === expected.length &&
    actual.every((token, index) => token === expected[index])
  );
}
