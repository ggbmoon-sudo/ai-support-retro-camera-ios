import {
  gatewayAdapterStubSampleCandidate
} from "./openWeightVlmGatewayAdapterStub.mjs";
import {
  validateGatewayResponseContract
} from "./openWeightVlmGatewayContractPreflight.mjs";
import {
  evaluateOpenWeightVlmGatewayProviderRoute
} from "./openWeightVlmGatewayProviderRouting.mjs";
import {
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION
} from "./openWeightVlmPhotoAdvisorSchema.mjs";

export const OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_ADAPTER_NO_MODEL_HTTP_SCHEMA_VERSION =
  "open_weight_vlm_gateway_provider_adapter_no_model_http.v1";

const DEFAULT_ENDPOINT = "http://127.0.0.1:8025/local/vlm/gateway-contract-echo";

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

const FORBIDDEN_ECHO_KEYS = Object.freeze([
  "rawPrompt",
  "prompt",
  "systemPrompt",
  "imagePath",
  "rawFilePath",
  "filePath",
  "localPath",
  "imageBase64",
  "base64",
  "requestPayload",
  "rawModelOutput",
  "modelOutput",
  "modelResponseText",
  "rawProviderResponse",
  "rawResponse",
  "freeFormModelText",
  "text"
]);

export async function evaluateOpenWeightVlmGatewayProviderAdapterNoModelHttp(options = {}) {
  const requestedProviderMode = options.requestedProviderMode || "local_contract_echo";
  const routeDecision = evaluateOpenWeightVlmGatewayProviderRoute({
    requestedProviderMode,
    productionReady: options.productionReady === true ? true : false,
    appFacingEndpoint: options.appFacingEndpoint === true,
    productionEndpoint: options.productionEndpoint === true,
    modelCallsAllowed: options.modelCallsAllowed === true,
    qwenInferenceAllowed: options.qwenInferenceAllowed === true,
    benchmarkAllowed: options.benchmarkAllowed === true,
    rawArtifactPolicy: options.rawArtifactPolicy
  });
  const endpoint = normalizeEndpoint(options.endpointUrl);
  const endpointGate = validateLocalPrivateGatewayEchoEndpoint(endpoint);
  const fetchImpl = options.fetchImpl || fetch;
  const hardBlockers = [
    ...routeDecision.hardBlockers,
    ...endpointGate.blockers
  ];
  const routeAllowedForHttp = routeDecision.routeAllowed === true
    && routeDecision.requestedProviderMode === "local_contract_echo"
    && routeDecision.selectedRoute === "local_private_no_model_contract_echo";

  if (!routeAllowedForHttp) {
    hardBlockers.push("blocked_for_unsupported_provider_route");
  }

  let networkCallsMade = false;
  let health = {};
  let echo = {};

  if (hardBlockers.length === 0) {
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

  const healthSummary = sanitizeHealth(health);
  hardBlockers.push(...healthBlockers(healthSummary));

  if (hardBlockers.length === 0) {
    try {
      const echoResponse = await fetchImpl(endpoint.href, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: "{}",
        signal: AbortSignal.timeout(options.timeoutMs || 2500)
      });
      networkCallsMade = true;
      echo = echoResponse.ok ? await echoResponse.json() : {};
    } catch {
      hardBlockers.push("blocked_for_external_echo_unavailable");
    }
  }

  const echoLeak = containsForbiddenSnippet(echo);
  if (echoLeak) {
    hardBlockers.push("blocked_for_unsanitized_echo_response");
  }

  const echoSummary = sanitizeEcho(echo);
  hardBlockers.push(...echoBlockers(echoSummary));

  const candidate = isPlainObject(echo?.candidate) ? echo.candidate : echo;
  const candidateResult = validateGatewayResponseContract({
    ...candidate,
    productionReady: candidate?.productionReady === true ? true : false
  });
  hardBlockers.push(...candidateResult.blockers);

  const uniqueHardBlockers = unique(hardBlockers);
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_GATEWAY_PROVIDER_ADAPTER_NO_MODEL_HTTP_SCHEMA_VERSION,
    runMode: "gateway_provider_adapter_no_model_http",
    scope: "backend_internal_only",
    requestedProviderMode: sanitizeToken(requestedProviderMode),
    selectedRoute: routeDecision.selectedRoute,
    routeAllowed: routeAllowedForHttp && uniqueHardBlockers.length === 0,
    endpointBucket: endpointGate.endpointBucket,
    productionReady: false,
    networkCallsMade,
    modelCallsMade: false,
    qwenInferenceRun: false,
    modelInferenceRun: false,
    benchmarkRun: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    eligibleForProviderAdapterNoModelHttpReview: uniqueHardBlockers.length === 0,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      uniqueHardBlockers.length === 0
        ? "pass_for_provider_adapter_no_model_http"
        : "blocked_for_provider_adapter_no_model_http",
      ...uniqueHardBlockers,
      "not_production_ready"
    ]),
    hardBlockers: uniqueHardBlockers,
    routeDecision: {
      requestedProviderMode: routeDecision.requestedProviderMode,
      selectedRoute: routeDecision.selectedRoute,
      routeAllowed: routeDecision.routeAllowed,
      networkCallsAllowed: routeDecision.networkCallsAllowed,
      modelCallsAllowed: false,
      qwenInferenceAllowed: false,
      benchmarkAllowed: false,
      productionReady: false
    },
    healthz: healthSummary,
    echo: echoSummary,
    candidateSummary: candidateResult.summary,
    rawPersistence: {
      promptPersisted: echoSummary.promptPersisted,
      modelResponsePersisted: echoSummary.modelResponsePersisted,
      imagePersisted: echoSummary.imagePersisted,
      imageLocationPersisted: echoSummary.imageLocationPersisted,
      payloadPersisted: echoSummary.payloadPersisted
    },
    adapterChain: [
      "provider_routing_decision",
      "local_private_endpoint_gate",
      "healthz_no_model_safety_gate",
      "gateway_contract_echo_no_model_call",
      "structured_candidate_validation",
      "open_weight_vlm_candidate_validator",
      "sanitized_aggregate_result"
    ]
  };

  const redaction = assertOpenWeightVlmGatewayProviderAdapterNoModelHttpReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForProviderAdapterNoModelHttpReview = false;
    report.routeAllowed = false;
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_provider_adapter_no_model_http",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function providerAdapterNoModelHttpSafeMockFetch(url) {
  if (String(url).endsWith("/healthz")) {
    return jsonResponse({
      ok: true,
      publicExposure: "no",
      rawLoggingDisabled: true,
      gatewayContractEchoAvailable: true,
      modelInferenceRun: false,
      modelCallsMade: false,
      qwenInferenceRun: false,
      productionReady: false
    });
  }
  return jsonResponse({
    ok: true,
    mode: "gateway_contract_echo",
    candidate: gatewayAdapterStubSampleCandidate(),
    modelInferenceRun: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
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

export function providerAdapterNoModelHttpUnsafeMockFetch(url) {
  if (String(url).endsWith("/healthz")) {
    return jsonResponse({
      ok: true,
      publicExposure: "public",
      rawLoggingDisabled: false,
      modelInferenceRun: true,
      modelCallsMade: true,
      qwenInferenceRun: true,
      productionReady: true
    });
  }
  return jsonResponse({
    ok: true,
    mode: "gateway_contract_echo",
    text: "free form",
    modelInferenceRun: true,
    modelCallsMade: true,
    qwenInferenceRun: true,
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

export function assertOpenWeightVlmGatewayProviderAdapterNoModelHttpReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "gateway_provider_adapter_no_model_http_not_redacted",
        message: "Gateway provider adapter no-model HTTP report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function healthBlockers(health) {
  const blockers = [];
  if (health.ok !== true || health.gatewayContractEchoAvailable !== true) {
    blockers.push("blocked_for_unsafe_healthz");
  }
  if (health.publicExposure !== "no") {
    blockers.push("blocked_for_public_exposure");
  }
  if (health.rawLoggingDisabled !== true) {
    blockers.push("blocked_for_raw_logging_enabled");
  }
  if (health.modelInferenceRun === true || health.modelCallsMade === true) {
    blockers.push("blocked_for_model_inference");
  }
  if (health.qwenInferenceRun === true) {
    blockers.push("blocked_for_qwen_inference");
  }
  if (health.productionReady === true) {
    blockers.push("blocked_for_production_flag");
  }
  return blockers;
}

function echoBlockers(echo) {
  const blockers = [];
  if (echo.ok !== true || echo.mode !== "gateway_contract_echo" || echo.candidateStructured !== true) {
    blockers.push("blocked_for_invalid_echo_response");
  }
  if (echo.publicExposure !== "no") {
    blockers.push("blocked_for_public_exposure");
  }
  if (echo.rawLoggingDisabled !== true) {
    blockers.push("blocked_for_raw_logging_enabled");
  }
  if (echo.modelInferenceRun === true || echo.modelCallsMade === true) {
    blockers.push("blocked_for_model_inference");
  }
  if (echo.qwenInferenceRun === true) {
    blockers.push("blocked_for_qwen_inference");
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

function sanitizeHealth(value = {}) {
  return {
    ok: value.ok === true,
    publicExposure: sanitizeToken(value.publicExposure || "unknown"),
    rawLoggingDisabled: value.rawLoggingDisabled === true,
    gatewayContractEchoAvailable: value.gatewayContractEchoAvailable === true,
    modelInferenceRun: value.modelInferenceRun === true,
    modelCallsMade: value.modelCallsMade === true,
    qwenInferenceRun: value.qwenInferenceRun === true,
    productionReady: value.productionReady === true
  };
}

function sanitizeEcho(value = {}) {
  return {
    ok: value.ok === true,
    mode: sanitizeToken(value.mode || "unknown"),
    candidateStructured: isPlainObject(value.candidate)
      || value.schemaVersion === OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    modelInferenceRun: value.modelInferenceRun === true,
    modelCallsMade: value.modelCallsMade === true,
    qwenInferenceRun: value.qwenInferenceRun === true,
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

function validateLocalPrivateGatewayEchoEndpoint(endpoint) {
  if (!endpoint) {
    return {
      endpointBucket: "invalid",
      blockers: ["blocked_for_invalid_external_endpoint"]
    };
  }

  const blockers = [];
  const endpointBucket = endpointBucketFor(endpoint.hostname);

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
    return new URL(value || DEFAULT_ENDPOINT);
  } catch {
    return null;
  }
}

function containsForbiddenSnippet(value = {}) {
  return findForbiddenEchoKey(value)
    || collectStringValues(value).some((item) =>
      FORBIDDEN_REPORT_SNIPPETS.some((snippet) => item.includes(snippet))
    );
}

function findForbiddenEchoKey(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_ECHO_KEYS.includes(key)) {
      return true;
    }
    if (findForbiddenEchoKey(child)) {
      return true;
    }
  }
  return false;
}

function collectStringValues(value) {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectStringValues);
  }
  if (!value || typeof value !== "object") {
    return [];
  }
  return Object.values(value).flatMap(collectStringValues);
}

function jsonResponse(value) {
  return {
    ok: true,
    json: async () => value
  };
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
