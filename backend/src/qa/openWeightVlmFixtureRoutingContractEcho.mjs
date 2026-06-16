export const OPEN_WEIGHT_VLM_FIXTURE_ROUTING_CONTRACT_ECHO_SCHEMA_VERSION =
  "open_weight_vlm_fixture_routing_contract_echo.v1";

const APPROVED_FIXTURE_TOKENS = Object.freeze([
  "smoke_001",
  "smoke_002",
  "smoke_003",
  "smoke_004",
  "smoke_005",
  "smoke_006",
  "smoke_007",
  "smoke_008"
]);

export async function evaluateOpenWeightVlmFixtureRoutingContractEcho(options = {}) {
  const endpointUrl = normalizeUrl(options.endpointUrl || "http://127.0.0.1:8025/local/vlm/fixture-routing-contract-echo");
  const fetchImpl = options.fetchImpl || fetch;
  const tokens = Array.isArray(options.fixtureTokens) && options.fixtureTokens.length > 0
    ? options.fixtureTokens.map(sanitizeToken).filter(isApprovedFixtureToken)
    : [...APPROVED_FIXTURE_TOKENS];

  const perToken = [];
  let routeableCount = 0;
  let unavailableCount = 0;
  let modelInferenceRun = false;
  let rawPersistenceFlags = false;
  let productionReady = false;
  let networkCallsMade = false;

  for (const fixtureId of tokens) {
    const response = await fetchImpl(endpointUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fixtureId })
    });
    networkCallsMade = true;
    const parsed = await response.json();
    const row = sanitizeRouteEchoRow(parsed, fixtureId);
    perToken.push(row);
    if (row.routeable) {
      routeableCount += 1;
    } else {
      unavailableCount += 1;
    }
    modelInferenceRun ||= row.modelInferenceRun === true;
    rawPersistenceFlags ||= row.rawPromptPersisted === true
      || row.rawModelResponsePersisted === true
      || row.rawImagePersisted === true
      || row.rawImagePathPersisted === true
      || row.requestPayloadPersisted === true;
    productionReady ||= row.productionReady === true;
  }

  return summarizeOpenWeightVlmFixtureRoutingContractEcho({
    tokens,
    perToken,
    networkCallsMade,
    routeableCount,
    unavailableCount,
    modelInferenceRun,
    rawPersistenceFlags,
    productionReady
  });
}

export function summarizeOpenWeightVlmFixtureRoutingContractEcho({
  tokens = APPROVED_FIXTURE_TOKENS,
  perToken = [],
  networkCallsMade = false,
  routeableCount = perToken.filter((item) => item.routeable === true).length,
  unavailableCount = perToken.filter((item) => item.routeable !== true).length,
  modelInferenceRun = perToken.some((item) => item.modelInferenceRun === true),
  rawPersistenceFlags = perToken.some((item) => item.rawPromptPersisted === true
    || item.rawModelResponsePersisted === true
    || item.rawImagePersisted === true
    || item.rawImagePathPersisted === true
    || item.requestPayloadPersisted === true),
  productionReady = perToken.some((item) => item.productionReady === true)
} = {}) {
  const hardBlockers = [];
  if (routeableCount !== tokens.length) {
    hardBlockers.push(blocker(
      "fixture_token_unavailable",
      "blocked_for_provider_integration",
      "All approved fixture tokens must route through the contract echo endpoint."
    ));
  }
  if (modelInferenceRun) {
    hardBlockers.push(blocker(
      "model_inference_detected",
      "blocked_for_model_inference",
      "Fixture routing contract echo must never run model inference."
    ));
  }
  if (rawPersistenceFlags) {
    hardBlockers.push(blocker(
      "raw_persistence_detected",
      "blocked_for_raw_persistence",
      "Fixture routing contract echo must not persist raw artifacts."
    ));
  }
  if (productionReady) {
    hardBlockers.push(blocker(
      "production_ready_true",
      "blocked_for_production_flag",
      "Fixture routing contract echo must keep productionReady false."
    ));
  }
  if (perToken.some((item) => item.publicExposure !== "no")) {
    hardBlockers.push(blocker(
      "public_exposure_unsafe",
      "blocked_for_public_exposure",
      "Fixture routing contract echo must remain local/private only."
    ));
  }

  return {
    schemaVersion: OPEN_WEIGHT_VLM_FIXTURE_ROUTING_CONTRACT_ECHO_SCHEMA_VERSION,
    runMode: "fixture_routing_contract_echo",
    productionReady: false,
    networkCallsMade,
    totalFixtureTokens: tokens.length,
    routeableCount,
    unavailableCount,
    modelInferenceRun,
    rawPersistenceFlags,
    perToken,
    hardBlockers,
    eligibleForRoutingReview: hardBlockers.length === 0
  };
}

export function evaluateOpenWeightVlmFixtureRoutingContractEchoFromList(rows = []) {
  const perToken = rows.map((row) => sanitizeRouteEchoRow(row, row.fixtureIdBucket));
  return summarizeOpenWeightVlmFixtureRoutingContractEcho({
    tokens: perToken.map((row) => row.fixtureIdBucket),
    perToken,
    networkCallsMade: false
  });
}

function sanitizeRouteEchoRow(row = {}, fallbackFixtureId = "unknown") {
  return {
    fixtureIdBucket: sanitizeToken(row.fixtureIdBucket || fallbackFixtureId),
    routeable: row.routeable === true,
    available: row.available === true,
    approvedLocalFixture: row.approvedLocalFixture === true,
    metadataStripped: row.metadataStripped === true,
    privacyReviewed: row.privacyReviewed === true,
    modelInferenceRun: row.modelInferenceRun === true,
    rawLoggingDisabled: row.rawLoggingDisabled === true,
    publicExposure: sanitizeToken(row.publicExposure || "unknown"),
    productionReady: row.productionReady === true,
    rawPromptPersisted: row.rawPromptPersisted === true,
    rawModelResponsePersisted: row.rawModelResponsePersisted === true,
    rawImagePersisted: row.rawImagePersisted === true,
    rawImagePathPersisted: row.rawImagePathPersisted === true,
    requestPayloadPersisted: row.requestPayloadPersisted === true
  };
}

function normalizeUrl(value) {
  return String(value || "").trim() || "http://127.0.0.1:8025/local/vlm/fixture-routing-contract-echo";
}

function isApprovedFixtureToken(value) {
  return APPROVED_FIXTURE_TOKENS.includes(value);
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function blocker(code, category, message) {
  return {
    code: sanitizeToken(code),
    category: sanitizeToken(category),
    message
  };
}
