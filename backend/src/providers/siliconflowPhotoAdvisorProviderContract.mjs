import {
  buildOpenWeightVlmSchemaDiagnostic,
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "../qa/openWeightVlmPhotoAdvisorSchema.mjs";
import {
  PhotoAdvisorModelCandidate,
  PhotoAdvisorProviderKind,
  PhotoAdvisorProviderMode,
  PHOTO_ADVISOR_MODEL_IDS,
  isSupportedPhotoAdvisorModelCandidate,
  isSupportedPhotoAdvisorProvider
} from "./photoAdvisorProviderTypes.mjs";
import {
  mapSiliconFlowSyntheticErrorToBucket,
  sanitizedSiliconFlowError
} from "./siliconflowPhotoAdvisorErrors.mjs";

export const SILICONFLOW_CHAT_COMPLETIONS_PATH = "/chat/completions";
export const SILICONFLOW_ENDPOINT_BUCKET = "siliconflow_chat_completions";
export const SILICONFLOW_PRIMARY_MODEL_ID = PHOTO_ADVISOR_MODEL_IDS[PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct];

const DEFAULT_PLACEHOLDERS = Object.freeze({
  imageUrlOrBase64Placeholder: "<SAFE_IMAGE_URL_OR_BASE64_PLACEHOLDER>",
  systemPromptPlaceholder: "<PHOTO_ADVISOR_SYSTEM_PROMPT_PLACEHOLDER>",
  userPromptPlaceholder: "<PHOTO_ADVISOR_PROMPT_PLACEHOLDER>"
});

export function defaultSiliconFlowPhotoAdvisorConfig() {
  return {
    provider: PhotoAdvisorProviderKind.siliconflow,
    providerMode: PhotoAdvisorProviderMode.noRuntimeContract,
    modelCandidate: PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct,
    model: SILICONFLOW_PRIMARY_MODEL_ID,
    enabled: false,
    apiKeyEnvName: "SILICONFLOW_API_KEY",
    baseUrlEnvName: "SILICONFLOW_BASE_URL",
    allowNetworkCalls: false,
    allowImageUpload: false,
    allowLiveCamera: false,
    allowJsonModeForVlm: false,
    maxOutputTokens: 256,
    imageDetail: "low",
    timeoutBucketOnly: true,
    productionReady: false
  };
}

export function validateSiliconFlowPhotoAdvisorConfig(config = {}) {
  const merged = { ...defaultSiliconFlowPhotoAdvisorConfig(), ...config };
  const blockers = [];

  if (!isSupportedPhotoAdvisorProvider(merged.provider) || merged.provider !== PhotoAdvisorProviderKind.siliconflow) {
    blockers.push("provider_not_configured");
  }

  if (!isSupportedPhotoAdvisorModelCandidate(merged.modelCandidate)) {
    blockers.push("provider_model_unavailable");
  }

  if (PHOTO_ADVISOR_MODEL_IDS[merged.modelCandidate] !== merged.model) {
    blockers.push("provider_model_unavailable");
  }

  if (merged.enabled === true) {
    blockers.push("provider_runtime_not_enabled");
  }

  if (merged.allowNetworkCalls === true || merged.enabled === true && merged.allowNetworkCalls === false) {
    blockers.push("provider_network_not_approved");
  }

  if (merged.allowImageUpload === true) {
    blockers.push("provider_upload_not_approved");
  }

  if (merged.allowLiveCamera === true) {
    blockers.push("provider_upload_not_approved");
  }

  if (merged.productionReady === true) {
    blockers.push("provider_runtime_not_enabled");
  }

  if (merged.allowJsonModeForVlm === true) {
    blockers.push("provider_runtime_not_enabled");
  }

  if (merged.apiKeyEnvName !== "SILICONFLOW_API_KEY" || !isSafeEnvName(merged.apiKeyEnvName)) {
    blockers.push("provider_not_configured");
  }

  if (merged.baseUrlEnvName !== "SILICONFLOW_BASE_URL" || !isSafeEnvName(merged.baseUrlEnvName)) {
    blockers.push("provider_not_configured");
  }

  if (containsCredentialLikeConfig(merged)) {
    blockers.push("provider_auth_failed");
  }

  if (containsRawProviderUrlConfig(merged)) {
    blockers.push("provider_network_not_approved");
  }

  if (merged.imageDetail !== "low") {
    blockers.push("provider_invalid_response");
  }

  if (merged.maxOutputTokens !== 256) {
    blockers.push("provider_invalid_response");
  }

  return {
    ok: blockers.length === 0,
    config: sanitizeSiliconFlowConfigForReport(merged),
    blockers: [...new Set(blockers)],
    productionReady: false,
    networkCallsMade: false
  };
}

export function buildSiliconFlowPhotoAdvisorRequest({
  imageUrlOrBase64Placeholder = DEFAULT_PLACEHOLDERS.imageUrlOrBase64Placeholder,
  systemPromptPlaceholder = DEFAULT_PLACEHOLDERS.systemPromptPlaceholder,
  userPromptPlaceholder = DEFAULT_PLACEHOLDERS.userPromptPlaceholder,
  config = defaultSiliconFlowPhotoAdvisorConfig()
} = {}) {
  const validation = validateSiliconFlowPhotoAdvisorConfig(config);
  const safeConfig = { ...defaultSiliconFlowPhotoAdvisorConfig(), ...config };

  return {
    endpointBucket: SILICONFLOW_ENDPOINT_BUCKET,
    baseUrlEnvName: "SILICONFLOW_BASE_URL",
    apiKeyEnvName: "SILICONFLOW_API_KEY",
    request: {
      method: "POST",
      path: SILICONFLOW_CHAT_COMPLETIONS_PATH,
      model: SILICONFLOW_PRIMARY_MODEL_ID,
      headersShape: {
        Authorization: "Bearer <SILICONFLOW_API_KEY_FROM_BACKEND_ENV>",
        "Content-Type": "application/json"
      },
      body: {
        model: safeConfig.model,
        stream: false,
        temperature: 0.1,
        top_p: 0.8,
        max_tokens: safeConfig.maxOutputTokens,
        messages: [
          {
            role: "system",
            content: sanitizePlaceholder(systemPromptPlaceholder, DEFAULT_PLACEHOLDERS.systemPromptPlaceholder)
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: sanitizePlaceholder(imageUrlOrBase64Placeholder, DEFAULT_PLACEHOLDERS.imageUrlOrBase64Placeholder),
                  detail: safeConfig.imageDetail
                }
              },
              {
                type: "text",
                text: sanitizePlaceholder(userPromptPlaceholder, DEFAULT_PLACEHOLDERS.userPromptPlaceholder)
              }
            ]
          }
        ]
      }
    },
    configValid: validation.ok,
    configBlockers: validation.blockers,
    executionAllowed: false,
    networkCallsMade: false,
    productionReady: false
  };
}

export function extractSiliconFlowOpenAiCompatibleText(response = {}) {
  const text = response?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || text.trim().length === 0) {
    return {
      ok: false,
      bucket: "provider_invalid_response",
      rawOutputPrinted: false,
      rawOutputPersisted: false
    };
  }

  return {
    ok: true,
    text,
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}

export function parseSiliconFlowPhotoAdvisorCandidateFromText(text) {
  if (typeof text !== "string") {
    return rejected("provider_invalid_response");
  }

  const trimmed = text.trim();
  if (!looksLikeSingleJsonObject(trimmed)) {
    return rejected("provider_json_parse_failed");
  }

  const validation = validateOpenWeightVlmPhotoAdvisorCandidate(trimmed);
  if (!validation.ok) {
    const bucket = validation.error?.code === "invalid_json"
      ? "provider_json_parse_failed"
      : schemaErrorBucket(validation.error?.code);
    return {
      ok: false,
      bucket,
      diagnostic: buildOpenWeightVlmSchemaDiagnostic(trimmed, validation.error),
      rawOutputPrinted: false,
      rawOutputPersisted: false
    };
  }

  return {
    ok: true,
    candidate: validation.value,
    semanticKeysOnly: true,
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}

export function parseSiliconFlowPhotoAdvisorResponse(response = {}) {
  const extracted = extractSiliconFlowOpenAiCompatibleText(response);
  if (!extracted.ok) {
    return rejected(extracted.bucket);
  }
  return parseSiliconFlowPhotoAdvisorCandidateFromText(extracted.text);
}

export function siliconFlowNoRuntimeReadinessSummary(env = process.env, config = defaultSiliconFlowPhotoAdvisorConfig()) {
  const validation = validateSiliconFlowPhotoAdvisorConfig(config);
  const keyPresent = typeof env?.SILICONFLOW_API_KEY === "string" && env.SILICONFLOW_API_KEY.length > 0;
  const blockers = new Set([
    "provider_network_not_approved",
    "provider_terms_unverified",
    "provider_pricing_unverified",
    "provider_benchmark_not_approved",
    "provider_upload_not_approved"
  ]);

  if (!keyPresent || !validation.ok) {
    blockers.add("provider_not_configured");
  }

  for (const blocker of validation.blockers) {
    blockers.add(blocker);
  }

  return {
    schemaVersion: "siliconflow_photo_advisor_readiness.v1",
    provider: PhotoAdvisorProviderKind.siliconflow,
    providerMode: PhotoAdvisorProviderMode.noRuntimeContract,
    model: SILICONFLOW_PRIMARY_MODEL_ID,
    providerConfigured: keyPresent && validation.ok,
    apiKeyLoaded: false,
    keyPresenceBucket: keyPresent ? "present_in_env_not_loaded" : "missing",
    networkCallsMade: false,
    imageUploadAttempted: false,
    benchmarkRun: false,
    modelCallsMade: false,
    providerRuntimeExecutionAdded: false,
    productionReady: false,
    blockers: Array.from(blockers).sort(),
    rawKeyPrinted: false,
    rawProviderUrlPrinted: false,
    rawPromptPrinted: false,
    rawOutputPrinted: false,
    rawPayloadPrinted: false
  };
}

export function siliconFlowSyntheticErrorReport(error = {}) {
  return sanitizedSiliconFlowError(mapSiliconFlowSyntheticErrorToBucket(error));
}

export function validSyntheticPhotoAdvisorCandidate() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    sourceType: "imported",
    allowedContext: "imageOnly",
    moodKey: "mood.warm_calm",
    visualObservationKey: "observation.warm_indoor_light",
    creativeIntent: {
      classification: "style_positive",
      preserveSignals: ["soft_focus"]
    },
    technicalRisk: {
      level: "none",
      reasonKey: null
    },
    filterFamilyCandidate: "warm_film",
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
}

function rejected(bucket) {
  return {
    ok: false,
    bucket,
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}

function schemaErrorBucket(code) {
  switch (code) {
  case "unsafe_response":
  case "unsafe_free_text":
  case "prompt_injection":
  case "raw_localization_key":
  case "retake_gate":
  case "source_context_overclaim":
    return "provider_safety_rejected";
  case "invalid_json":
    return "provider_json_parse_failed";
  default:
    return "provider_schema_invalid";
  }
}

function isSafeEnvName(value) {
  return typeof value === "string" && /^[A-Z][A-Z0-9_]{2,80}$/.test(value);
}

function containsCredentialLikeConfig(config) {
  for (const [key, value] of Object.entries(config)) {
    if (/^(apiKey|token|secret|authorization|bearer)$/i.test(key) && typeof value === "string" && value.length > 0) {
      return true;
    }
  }
  return false;
}

function containsRawProviderUrlConfig(config) {
  for (const [key, value] of Object.entries(config)) {
    if (key === "baseUrlEnvName") {
      continue;
    }
    if (typeof value === "string" && /^https?:\/\//i.test(value)) {
      return true;
    }
  }
  return false;
}

function sanitizeSiliconFlowConfigForReport(config) {
  return {
    provider: config.provider,
    providerMode: config.providerMode,
    modelCandidate: config.modelCandidate,
    model: config.model,
    enabled: config.enabled === true,
    apiKeyEnvName: config.apiKeyEnvName === "SILICONFLOW_API_KEY" ? "SILICONFLOW_API_KEY" : "invalid_env_name",
    baseUrlEnvName: config.baseUrlEnvName === "SILICONFLOW_BASE_URL" ? "SILICONFLOW_BASE_URL" : "invalid_env_name",
    allowNetworkCalls: config.allowNetworkCalls === true,
    allowImageUpload: config.allowImageUpload === true,
    allowLiveCamera: config.allowLiveCamera === true,
    allowJsonModeForVlm: config.allowJsonModeForVlm === true,
    maxOutputTokens: Number.isFinite(config.maxOutputTokens) ? config.maxOutputTokens : 0,
    imageDetail: config.imageDetail === "low" ? "low" : "unsupported",
    timeoutBucketOnly: config.timeoutBucketOnly === true,
    productionReady: false
  };
}

function sanitizePlaceholder(value, fallback) {
  if (typeof value !== "string" || value.length === 0 || value.length > 120) {
    return fallback;
  }
  if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value) || /base64,/i.test(value)) {
    return fallback;
  }
  return value;
}

function looksLikeSingleJsonObject(value) {
  return value.startsWith("{") && value.endsWith("}");
}
