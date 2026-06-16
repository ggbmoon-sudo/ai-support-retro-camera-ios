import {
  OPEN_WEIGHT_VLM_GATEWAY_REQUEST_CONTRACT_VERSION,
  gatewayContractPreflightSampleRequest,
  gatewayContractPreflightSampleResponse,
  validateGatewayRequestContract,
  validateGatewayResponseContract
} from "./openWeightVlmGatewayContractPreflight.mjs";
import {
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "./openWeightVlmPhotoAdvisorSchema.mjs";

export const OPEN_WEIGHT_VLM_GATEWAY_ADAPTER_STUB_SCHEMA_VERSION =
  "open_weight_vlm_gateway_adapter_stub.v1";

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "data:image",
  "base64",
  "image_url",
  "fullPrompt",
  "rawPrompt",
  "\"requestPayload\":",
  "rawResponse",
  "rawProviderResponse",
  "rawModelOutput",
  "modelOutput",
  "modelResponseText",
  "Authorization",
  "Bearer ",
  "apiKey",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "http://",
  "https://",
  ".jpg",
  ".jpeg",
  ".png",
  "/Users/",
  "/Volumes/",
  "/private/",
  "C:\\",
  "EXIF",
  "GPS",
  "chain-of-thought",
  "provider debug",
  "stack trace"
]);

export function gatewayAdapterStubSampleRequest() {
  return gatewayContractPreflightSampleRequest();
}

export function gatewayAdapterStubSampleCandidate() {
  const { productionReady: _productionReady, ...candidate } = gatewayContractPreflightSampleResponse();
  return {
    ...candidate,
    sourceType: "internal",
    allowedContext: "imageOnly"
  };
}

export function runOpenWeightVlmGatewayAdapterStub({
  request = gatewayAdapterStubSampleRequest(),
  candidate = gatewayAdapterStubSampleCandidate()
} = {}) {
  const requestResult = validateGatewayRequestContract(request);
  const sandboxResult = validateFixtureTokenSandboxRequest(request);
  const candidateValidation = validateOpenWeightVlmPhotoAdvisorCandidate(candidate);
  const responseResult = validateGatewayResponseContract({
    ...candidate,
    productionReady: candidate.productionReady === true ? true : false
  });

  const hardBlockers = unique([
    ...requestResult.blockers,
    ...sandboxResult.blockers,
    ...responseResult.blockers,
    ...(candidateValidation.ok ? [] : [blockerForCandidateError(candidateValidation.error?.code)])
  ]);

  const accepted = hardBlockers.length === 0 && candidateValidation.ok;
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_GATEWAY_ADAPTER_STUB_SCHEMA_VERSION,
    runMode: "gateway_adapter_stub",
    scope: "backend_internal_only",
    adapterMode: "fixture_token_stub",
    productionReady: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    externalServerCalled: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    iosIntegrationScope: false,
    realUserPhotoUploadAccepted: false,
    acceptedCount: accepted ? 1 : 0,
    rejectedCount: accepted ? 0 : 1,
    eligibleForPhase21CPlanning: accepted,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      accepted
        ? "pass_for_backend_internal_gateway_adapter_stub"
        : "blocked_for_backend_internal_gateway_adapter_stub",
      ...hardBlockers,
      "not_production_ready"
    ]),
    hardBlockers,
    reviewedRequest: {
      ...requestResult.summary,
      fixtureTokenSandboxOnly: true,
      rawImageAccepted: false,
      encodedImageAccepted: false,
      rawPathAccepted: false,
      gpsExifSensorAccepted: false,
      providerSecretsAccepted: false
    },
    adapterChain: [
      "gateway_request_contract_validation",
      "fixture_token_sandbox_mode_only",
      "adapter_stub_candidate_mapping",
      "structured_candidate_validation",
      "open_weight_vlm_candidate_validator",
      "safety_and_fallback_gate",
      "sanitized_aggregate_result"
    ],
    candidateSummary: {
      schemaVersion: sanitizeToken(candidate.schemaVersion),
      sourceType: sanitizeToken(candidate.sourceType),
      allowedContext: sanitizeToken(candidate.allowedContext),
      candidateValidatorPassed: candidateValidation.ok,
      safetyPassed: candidateValidation.ok,
      structuredCandidateJsonOnly: true,
      freeFormModelTextReturned: false,
      scoreOrRatingReturned: false,
      sensitiveInferenceReturned: false,
      chainOfThoughtReturned: false,
      debugProviderLeakageReturned: false,
      providerResponseReturned: false,
      promptBodyReturned: false,
      productionReady: false
    },
    rawPersistence: {
      promptPersisted: false,
      modelResponsePersisted: false,
      imagePersisted: false,
      imageLocationPersisted: false,
      payloadPersisted: false,
      providerResponsePersisted: false
    },
    blockedFieldCategories: unique([
      ...requestResult.blockedFieldCategories,
      ...responseResult.blockedFieldCategories
    ])
  };

  const redaction = assertOpenWeightVlmGatewayAdapterStubReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForPhase21CPlanning = false;
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_backend_internal_gateway_adapter_stub",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export async function evaluateOpenWeightVlmGatewayExternalContractEcho(options = {}) {
  const endpoint = normalizeEndpoint(options.endpointUrl);
  const fetchImpl = options.fetchImpl || fetch;
  const hardBlockers = [];
  const endpointGate = validateLocalPrivateEndpoint(endpoint);
  hardBlockers.push(...endpointGate.blockers);

  let networkCallsMade = false;
  let health = {};
  let echo = {};

  if (endpointGate.blockers.length === 0) {
    try {
      const healthResponse = await fetchImpl(`${endpoint.origin}/healthz`, {
        method: "GET",
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(options.timeoutMs || 2500)
      });
      networkCallsMade = true;
      health = healthResponse.ok ? await healthResponse.json() : {};
    } catch {
      hardBlockers.push("blocked_for_external_server_unavailable");
    }
  }

  if (endpointGate.blockers.length === 0 && !hardBlockers.includes("blocked_for_external_server_unavailable")) {
    try {
      const echoResponse = await fetchImpl(endpoint.href, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify(gatewayAdapterStubSampleRequest()),
        signal: AbortSignal.timeout(options.timeoutMs || 2500)
      });
      networkCallsMade = true;
      echo = echoResponse.ok ? await echoResponse.json() : {};
    } catch {
      hardBlockers.push("blocked_for_external_echo_unavailable");
    }
  }

  const healthSummary = sanitizeExternalHealth(health);
  const echoSummary = sanitizeExternalEcho(echo);
  hardBlockers.push(...externalSafetyBlockers(healthSummary, echoSummary));

  const candidate = isPlainObject(echo?.candidate) ? echo.candidate : echo;
  const candidateResult = validateGatewayResponseContract({
    ...candidate,
    productionReady: false
  });
  hardBlockers.push(...candidateResult.blockers);

  const uniqueHardBlockers = unique(hardBlockers);
  const report = {
    schemaVersion: "open_weight_vlm_gateway_external_contract_echo.v1",
    runMode: "gateway_external_contract_echo",
    scope: "local_private_no_model_only",
    endpointBucket: endpointGate.endpointBucket,
    productionReady: false,
    networkCallsMade,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    eligibleForExternalContractEchoReview: uniqueHardBlockers.length === 0,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      uniqueHardBlockers.length === 0
        ? "pass_for_external_no_model_contract_echo"
        : "blocked_for_external_no_model_contract_echo",
      ...uniqueHardBlockers,
      "not_production_ready"
    ]),
    hardBlockers: uniqueHardBlockers,
    healthz: healthSummary,
    echo: echoSummary,
    candidateSummary: candidateResult.summary,
    rawPersistence: {
      promptPersisted: echoSummary.promptPersisted,
      modelResponsePersisted: echoSummary.modelResponsePersisted,
      imagePersisted: echoSummary.imagePersisted,
      imageLocationPersisted: echoSummary.imageLocationPersisted,
      payloadPersisted: echoSummary.payloadPersisted
    }
  };

  const redaction = assertOpenWeightVlmGatewayAdapterStubReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForExternalContractEchoReview = false;
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_external_no_model_contract_echo",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmGatewayAdapterStubReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "gateway_adapter_stub_not_redacted",
        message: "Gateway adapter stub report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function validateFixtureTokenSandboxRequest(request = {}) {
  const blockers = [];
  if (request.schemaVersion !== OPEN_WEIGHT_VLM_GATEWAY_REQUEST_CONTRACT_VERSION) {
    blockers.push("blocked_for_invalid_request_schema");
  }
  if (request.sourceType !== "synthetic_local_fixture") {
    blockers.push("blocked_for_non_fixture_sandbox_request");
  }
  if (!safeBucket(request.fixtureId)) {
    blockers.push("blocked_for_missing_fixture_token");
  }
  if (request.outputContractVersion !== OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION) {
    blockers.push("blocked_for_invalid_output_contract_version");
  }
  return { blockers: unique(blockers) };
}

function externalSafetyBlockers(health, echo) {
  const blockers = [];
  if (health.publicExposure !== "no" || echo.publicExposure !== "no") {
    blockers.push("blocked_for_public_exposure");
  }
  if (health.rawLoggingDisabled !== true || echo.rawLoggingDisabled !== true) {
    blockers.push("blocked_for_raw_logging_enabled");
  }
  if (health.modelInferenceRun === true || echo.modelInferenceRun === true) {
    blockers.push("blocked_for_model_inference");
  }
  if (echo.productionReady === true) {
    blockers.push("blocked_for_production_flag");
  }
  if (echo.promptPersisted
    || echo.modelResponsePersisted
    || echo.imagePersisted
    || echo.imageLocationPersisted
    || echo.payloadPersisted) {
    blockers.push("blocked_for_raw_persistence");
  }
  return blockers;
}

function sanitizeExternalHealth(value = {}) {
  return {
    ok: value.ok === true,
    publicExposure: sanitizeToken(value.publicExposure || "unknown"),
    rawLoggingDisabled: value.rawLoggingDisabled === true,
    modelInferenceRun: value.modelInferenceRun === true,
    gatewayContractEchoAvailable: value.gatewayContractEchoAvailable === true,
    productionReady: value.productionReady === true
  };
}

function sanitizeExternalEcho(value = {}) {
  return {
    ok: value.ok === true,
    mode: sanitizeToken(value.mode || "unknown"),
    candidateStructured: isPlainObject(value.candidate) || value.schemaVersion === OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    modelInferenceRun: value.modelInferenceRun === true,
    rawLoggingDisabled: value.rawLoggingDisabled === true,
    publicExposure: sanitizeToken(value.publicExposure || "unknown"),
    productionReady: value.productionReady === true,
    promptPersisted: value.rawPromptPersisted === true,
    modelResponsePersisted: value.rawModelResponsePersisted === true,
    imagePersisted: value.rawImagePersisted === true,
    imageLocationPersisted: value.rawImagePathPersisted === true,
    payloadPersisted: value.requestPayloadPersisted === true
  };
}

function validateLocalPrivateEndpoint(endpoint) {
  if (!endpoint) {
    return {
      endpointBucket: "invalid",
      blockers: ["blocked_for_invalid_external_endpoint"]
    };
  }

  const blockers = [];
  const hostname = endpoint.hostname;
  const endpointBucket = endpointBucketFor(hostname);

  if (endpoint.protocol !== "http:") {
    blockers.push("blocked_for_invalid_external_endpoint");
  }
  if (!["local_loopback", "private_lan_ipv4"].includes(endpointBucket)) {
    blockers.push("blocked_for_public_endpoint");
  }
  if (endpoint.pathname !== "/local/vlm/gateway-contract-echo") {
    blockers.push("blocked_for_invalid_external_endpoint");
  }

  return { endpointBucket, blockers: unique(blockers) };
}

function endpointBucketFor(hostname) {
  if (hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1") {
    return "local_loopback";
  }
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
    || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)
    || /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return "private_lan_ipv4";
  }
  return "public_or_unknown";
}

function normalizeEndpoint(value) {
  try {
    return new URL(value || "http://127.0.0.1:8025/local/vlm/gateway-contract-echo");
  } catch {
    return null;
  }
}

function blockerForCandidateError(code) {
  switch (code) {
  case "unsafe_response":
    return "blocked_for_candidate_safety";
  case "unsupported_filter_family":
    return "blocked_for_candidate_filter_family";
  case "source_context_overclaim":
    return "blocked_for_candidate_source_context";
  case "retake_gate":
    return "blocked_for_candidate_retake_gate";
  case "invalid_json":
  case "invalid_schema":
  case "unsupported_enum":
  default:
    return "blocked_for_candidate_validation";
  }
}

function safeBucket(value) {
  return typeof value === "string"
    && /^[a-zA-Z0-9._:-]{3,80}$/.test(value)
    && !value.includes("/")
    && !value.includes("\\");
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
