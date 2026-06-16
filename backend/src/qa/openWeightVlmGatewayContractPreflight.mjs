import {
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "./openWeightVlmPhotoAdvisorSchema.mjs";

export const OPEN_WEIGHT_VLM_GATEWAY_CONTRACT_PREFLIGHT_SCHEMA_VERSION =
  "open_weight_vlm_gateway_contract_preflight.v1";

export const OPEN_WEIGHT_VLM_GATEWAY_REQUEST_CONTRACT_VERSION =
  "open_weight_vlm_gateway_request.v1";

const ALLOWED_REQUEST_KEYS = new Set([
  "schemaVersion",
  "requestIdBucket",
  "sourceType",
  "fixtureId",
  "allowedContext",
  "languageCode",
  "advisorMode",
  "outputContractVersion",
  "productionReady"
]);

const ALLOWED_RESPONSE_KEYS = new Set([
  "schemaVersion",
  "sourceType",
  "allowedContext",
  "moodKey",
  "visualObservationKey",
  "creativeIntent",
  "technicalRisk",
  "filterFamilyCandidate",
  "optionalActionKey",
  "retakeAllowed",
  "retakeReasonKey",
  "safety",
  "productionReady"
]);

const ALLOWED_REQUEST_SOURCE_TYPES = new Set([
  "captured",
  "imported",
  "synthetic_local_fixture"
]);

const ALLOWED_REQUEST_CONTEXTS = new Set([
  "captureContextAvailable",
  "imageOnly",
  "unknown"
]);

const ALLOWED_LANGUAGE_CODES = new Set([
  "en",
  "zh-Hant",
  "zh-Hans",
  "yue-Hant-HK"
]);

const FORBIDDEN_REQUEST_KEYS = Object.freeze([
  "rawImage",
  "imageBytes",
  "imageData",
  "dataBase64",
  "base64",
  "imageBase64",
  "imagePath",
  "rawFilePath",
  "filePath",
  "localPath",
  "gps",
  "GPS",
  "location",
  "rawExif",
  "EXIF",
  "exif",
  "rawSensorValues",
  "sensorValues",
  "accelerometer",
  "gyroscope",
  "rawPrompt",
  "prompt",
  "systemPrompt",
  "providerSecret",
  "providerApiKey",
  "apiKey",
  "authorization",
  "Authorization",
  "qweApiKey",
  "geminiApiKey",
  "openAIApiKey",
  "iosProviderKey",
  "iosDirectProviderCall",
  "providerUrl",
  "modelServerUrl",
  "appFacingEndpoint",
  "productionEndpoint",
  "publicEndpoint",
  "cameraCloudEntry"
]);

const FORBIDDEN_RESPONSE_KEYS = Object.freeze([
  "text",
  "freeFormText",
  "freeFormModelText",
  "modelText",
  "rawModelOutput",
  "rawProviderResponse",
  "rawResponse",
  "rawPrompt",
  "requestPayload",
  "chainOfThought",
  "reasoning",
  "providerDebug",
  "debug",
  "score",
  "rating",
  "confidenceScore",
  "appFacingEndpoint",
  "productionEndpoint"
]);

const FORBIDDEN_SNIPPETS = Object.freeze([
  "data:image",
  "base64",
  "image_url",
  "fullPrompt",
  "rawResponse",
  "modelResponseText",
  "modelOutput",
  "requestPayload",
  "Authorization",
  "Bearer ",
  "apiKey",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CODE0_API_KEY",
  "INTENEXT_API_KEY",
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

export function gatewayContractPreflightSampleRequest() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_GATEWAY_REQUEST_CONTRACT_VERSION,
    requestIdBucket: "synthetic_request_bucket",
    sourceType: "synthetic_local_fixture",
    fixtureId: "configured",
    allowedContext: "imageOnly",
    languageCode: "en",
    advisorMode: "post_capture_photo_advisor",
    outputContractVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    productionReady: false
  };
}

export function gatewayContractPreflightSampleResponse() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    sourceType: "imported",
    allowedContext: "imageOnly",
    moodKey: "mood.warm_calm",
    visualObservationKey: "observation.warm_indoor_light",
    creativeIntent: {
      classification: "style_positive",
      preserveSignals: []
    },
    technicalRisk: {
      level: "none",
      reasonKey: null
    },
    filterFamilyCandidate: "warm_film",
    optionalActionKey: "action.try_filter_first",
    retakeAllowed: false,
    retakeReasonKey: null,
    safety: {
      sensitiveInferenceDetected: false,
      forbiddenInferenceTypes: [],
      scoreOrRatingDetected: false,
      chainOfThoughtDetected: false,
      debugLeakageDetected: false
    },
    productionReady: false
  };
}

export function evaluateOpenWeightVlmGatewayContractPreflight({
  request = gatewayContractPreflightSampleRequest(),
  response = gatewayContractPreflightSampleResponse()
} = {}) {
  const requestResult = validateGatewayRequestContract(request);
  const responseResult = validateGatewayResponseContract(response);
  const hardBlockers = unique([
    ...requestResult.blockers,
    ...responseResult.blockers
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_GATEWAY_CONTRACT_PREFLIGHT_SCHEMA_VERSION,
    runMode: "gateway_contract_preflight",
    scope: "backend_internal_only",
    productionReady: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    iosIntegrationScope: false,
    realUserPhotoUploadAccepted: false,
    eligibleForPhase21BPlanning: hardBlockers.length === 0,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      hardBlockers.length === 0
        ? "pass_for_backend_internal_gateway_contract_preflight"
        : "blocked_for_backend_internal_gateway_contract_preflight",
      ...hardBlockers,
      "not_production_ready"
    ]),
    hardBlockers,
    reviewedRequest: requestResult.summary,
    reviewedResponse: responseResult.summary,
    validationChain: [
      "gateway_request_shape",
      "raw_artifact_and_secret_rejection",
      "production_flag_lock",
      "structured_candidate_only",
      "open_weight_vlm_candidate_validator",
      "safety_and_fallback_gate"
    ],
    blockedFieldCategories: unique([
      ...requestResult.blockedFieldCategories,
      ...responseResult.blockedFieldCategories
    ])
  };

  const redaction = assertOpenWeightVlmGatewayContractPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForPhase21BPlanning = false;
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_backend_internal_gateway_contract_preflight",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function validateGatewayRequestContract(request = {}) {
  const blockers = [];
  const blockedFieldCategories = [];

  if (!isPlainObject(request)) {
    blockers.push("blocked_for_invalid_request_schema");
  }

  if (request.productionReady !== false) {
    blockers.push("blocked_for_production_flag");
  }

  if (request.appFacingEndpoint === true
    || request.productionEndpoint === true
    || request.publicEndpoint === true
    || request.cameraCloudEntry === true) {
    blockers.push("blocked_for_public_endpoint");
  }

  if (request.schemaVersion !== OPEN_WEIGHT_VLM_GATEWAY_REQUEST_CONTRACT_VERSION) {
    blockers.push("blocked_for_invalid_request_schema");
  }

  if (!safeBucket(request.requestIdBucket)) {
    blockers.push("blocked_for_invalid_request_bucket");
  }

  if (!ALLOWED_REQUEST_SOURCE_TYPES.has(request.sourceType)) {
    blockers.push("blocked_for_invalid_source_type");
  }

  if (!ALLOWED_REQUEST_CONTEXTS.has(request.allowedContext)) {
    blockers.push("blocked_for_invalid_allowed_context");
  }

  if (request.sourceType === "imported" && request.allowedContext !== "imageOnly") {
    blockers.push("blocked_for_source_context_overclaim");
  }

  if (!ALLOWED_LANGUAGE_CODES.has(request.languageCode)) {
    blockers.push("blocked_for_invalid_language_code");
  }

  if (request.advisorMode !== "post_capture_photo_advisor") {
    blockers.push("blocked_for_invalid_advisor_mode");
  }

  if (request.outputContractVersion !== OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION) {
    blockers.push("blocked_for_invalid_output_contract_version");
  }

  if (request.fixtureId !== undefined && !safeBucket(request.fixtureId)) {
    blockers.push("blocked_for_raw_artifact_request");
    blockedFieldCategories.push("fixtureId");
  }

  const extraKeys = Object.keys(request).filter((key) => !ALLOWED_REQUEST_KEYS.has(key));
  if (extraKeys.length > 0) {
    blockers.push("blocked_for_unsupported_request_field");
  }

  const forbidden = findForbiddenKeys(request, FORBIDDEN_REQUEST_KEYS);
  if (forbidden.length > 0) {
    blockers.push("blocked_for_raw_artifact_request");
    blockedFieldCategories.push(...forbidden.map(sanitizeFieldBucket));
  }

  const snippetLeak = containsForbiddenSnippet(request);
  if (snippetLeak) {
    blockers.push("blocked_for_unsanitized_request");
    blockedFieldCategories.push(snippetLeak);
  }

  return {
    ok: blockers.length === 0,
    blockers: unique(blockers),
    blockedFieldCategories: unique(blockedFieldCategories),
    summary: {
      schemaVersion: sanitizeToken(request.schemaVersion),
      requestIdBucket: safeBucket(request.requestIdBucket) ? "configured" : "invalid",
      sourceType: sanitizeToken(request.sourceType),
      fixtureIdBucket: request.fixtureId === undefined
        ? "not_configured"
        : safeBucket(request.fixtureId) ? "configured" : "invalid",
      allowedContext: sanitizeToken(request.allowedContext),
      languageCode: sanitizeToken(request.languageCode),
      advisorMode: sanitizeToken(request.advisorMode),
      outputContractVersion: sanitizeToken(request.outputContractVersion),
      productionReady: false,
      imageBytesAccepted: false,
      fileLocationAccepted: false,
      promptBodyAccepted: false,
      iOSDirectProviderFieldsAccepted: false,
      appFacingEndpoint: false,
      productionEndpoint: false
    }
  };
}

export function validateGatewayResponseContract(response = {}) {
  const blockers = [];
  const blockedFieldCategories = [];

  if (!isPlainObject(response)) {
    blockers.push("blocked_for_invalid_response_schema");
  }

  if (response.productionReady !== false) {
    blockers.push("blocked_for_production_flag");
  }

  if (response.appFacingEndpoint === true || response.productionEndpoint === true) {
    blockers.push("blocked_for_public_endpoint");
  }

  const extraKeys = Object.keys(response).filter((key) => !ALLOWED_RESPONSE_KEYS.has(key));
  if (extraKeys.length > 0) {
    blockers.push("blocked_for_unsupported_response_field");
  }

  const forbidden = findForbiddenKeys(response, FORBIDDEN_RESPONSE_KEYS);
  if (forbidden.length > 0) {
    blockers.push("blocked_for_free_form_or_leaky_response");
    blockedFieldCategories.push(...forbidden.map(sanitizeFieldBucket));
  }

  const snippetLeak = containsForbiddenSnippet(response);
  if (snippetLeak) {
    blockers.push("blocked_for_unsanitized_response");
    blockedFieldCategories.push(snippetLeak);
  }

  const candidate = stripGatewayResponseWrapper(response);
  const validation = validateOpenWeightVlmPhotoAdvisorCandidate(candidate);
  if (!validation.ok) {
    blockers.push(blockerForCandidateError(validation.error?.code));
    if (validation.error?.field) {
      blockedFieldCategories.push(sanitizeFieldBucket(validation.error.field));
    }
  }

  return {
    ok: blockers.length === 0,
    blockers: unique(blockers),
    blockedFieldCategories: unique(blockedFieldCategories),
    summary: {
      schemaVersion: sanitizeToken(response.schemaVersion),
      sourceType: sanitizeToken(response.sourceType),
      allowedContext: sanitizeToken(response.allowedContext),
      structuredCandidateJsonOnly: true,
      candidateValidatorPassed: validation.ok,
      safetyPassed: validation.ok,
      productionReady: false,
      freeFormModelTextReturned: false,
      scoreOrRatingReturned: false,
      sensitiveInferenceReturned: false,
      chainOfThoughtReturned: false,
      debugProviderLeakageReturned: false,
      providerResponseReturned: false,
      promptBodyReturned: false
    }
  };
}

export function assertOpenWeightVlmGatewayContractPreflightReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "gateway_contract_preflight_not_redacted",
        message: "Gateway contract preflight report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function stripGatewayResponseWrapper(response = {}) {
  const { productionReady: _productionReady, ...candidate } = response;
  return candidate;
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

function findForbiddenKeys(value, forbiddenKeys, path = []) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const matches = [];
  for (const [key, child] of Object.entries(value)) {
    const nextPath = [...path, key];
    if (forbiddenKeys.includes(key)) {
      matches.push(nextPath.join("."));
    }
    matches.push(...findForbiddenKeys(child, forbiddenKeys, nextPath));
  }
  return matches;
}

function containsForbiddenSnippet(value) {
  const serialized = JSON.stringify(value);
  const snippet = FORBIDDEN_SNIPPETS.find((item) => serialized.includes(item));
  return snippet ? sanitizeFieldBucket(snippet) : null;
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

function sanitizeFieldBucket(value) {
  return sanitizeToken(value).replace(/^C:$/, "windows_path");
}
