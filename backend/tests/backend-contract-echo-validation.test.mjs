import assert from "node:assert/strict";
import test from "node:test";
import {
  BACKEND_CONTRACT_ECHO_APPROVED_TOKENS,
  buildBackendNoModelContractEchoValidationPlan,
  validateBackendNoModelContractEchoResult
} from "../src/qa/openWeightVlmBackendContractEchoValidation.mjs";

function safeCandidate() {
  return {
    schemaVersion: "photo_advisor_vlm_candidate.v1",
    sourceType: "captured",
    moodKey: "mood.bright_clean",
    visualObservationKey: "observation.bright_daylight",
    creativeIntent: {
      classification: "style_positive",
      preserveSignals: []
    },
    technicalRisk: {
      level: "mild",
      reasonKey: null
    },
    safety: {
      sensitiveInference: false,
      identityInference: false,
      faceRecognition: false,
      rawProviderLeakage: false
    }
  };
}

function contractObject(token, candidate = safeCandidate()) {
  return {
    ok: true,
    mode: "gateway_contract_echo",
    fixtureIdBucket: token,
    errorBucket: null,
    modelInferenceRun: false,
    rawLoggingDisabled: true,
    publicExposure: "no",
    productionReady: false,
    candidate
  };
}

function validResult(overrides = {}) {
  const plan = buildBackendNoModelContractEchoValidationPlan();
  return {
    ...plan,
    approvedResponses: BACKEND_CONTRACT_ECHO_APPROVED_TOKENS.map((fixtureToken) => ({
      fixtureToken,
      routing: contractObject(fixtureToken, null),
      gateway: contractObject(fixtureToken)
    })),
    unsupportedTokenBucket: "unsupported_fixture_token",
    missingTokenBucket: "missing_fixture_token",
    approvedTokenBuckets: [...BACKEND_CONTRACT_ECHO_APPROVED_TOKENS],
    rawArtifactLeakageDetected: false,
    ...overrides
  };
}

test("backend contract echo validation accepts exact approved 13-token set", () => {
  const result = validateBackendNoModelContractEchoResult(validResult());
  assert.equal(result.contractEchoValidationEligible, true);
  assert.equal(result.approvedTokenCount, 13);
  assert.deepEqual(result.blockers, []);
});

test("backend contract echo validation rejects missing smoke_004 through smoke_015", () => {
  const tokens = ["smoke_001"];
  const result = validateBackendNoModelContractEchoResult(validResult({
    approvedFixtureTokens: tokens,
    approvedTokenCount: tokens.length,
    approvedResponses: []
  }));
  assert.equal(result.contractEchoValidationEligible, false);
  assert.match(result.blockers.join(","), /approved_token_set_mismatch/);
});

test("backend contract echo validation rejects extra token", () => {
  const tokens = [...BACKEND_CONTRACT_ECHO_APPROVED_TOKENS, "smoke_999"];
  const result = validateBackendNoModelContractEchoResult(validResult({
    approvedFixtureTokens: tokens,
    approvedTokenCount: tokens.length
  }));
  assert.equal(result.contractEchoValidationEligible, false);
  assert.match(result.blockers.join(","), /approved_token_set_mismatch/);
});

test("backend contract echo validation rejects ambiguous local model unavailable buckets", () => {
  const result = validateBackendNoModelContractEchoResult(validResult({
    unsupportedTokenBucket: "local_model_unavailable"
  }));
  assert.equal(result.contractEchoValidationEligible, false);
  assert.match(result.blockers.join(","), /ambiguous_contract_echo_error_mapping/);
});

test("backend contract echo validation accepts sanitized unsupported and missing buckets", () => {
  const result = validateBackendNoModelContractEchoResult(validResult({
    unsupportedTokenBucket: "unsupported_fixture_token",
    missingTokenBucket: "missing_fixture_token"
  }));
  assert.equal(result.contractEchoValidationEligible, true);
});

test("backend contract echo validation blocks execution flags", () => {
  for (const override of [
    { modelCallExecuted: true },
    { inferenceEndpointCalled: true },
    { benchmarkExecuted: true },
    { productionReady: true }
  ]) {
    const result = validateBackendNoModelContractEchoResult(validResult(override));
    assert.equal(result.contractEchoValidationEligible, false);
  }
});

test("backend contract echo validation blocks raw artifact leakage", () => {
  const result = validateBackendNoModelContractEchoResult(validResult({
    rawPrompt: "leak"
  }));
  assert.equal(result.contractEchoValidationEligible, false);
  assert.match(result.blockers.join(","), /raw_artifact_leakage/);
});
