import {
  XIAOYI_CHAT_COMPLETIONS_PATH,
  XIAOYI_DEEPSEEK_DEFAULT_MODEL,
  XIAOYI_ENDPOINT_BUCKET
} from "./XiaoyiDeepseekRelayProvider.mjs";
import { generatedFilterRecipeExampleCandidate } from "./generatedFilterRecipeContract.mjs";

export const XIAOYI_RELAY_BASE_URL = "https://xiaoyiapi.xyz";
export const XIAOYI_PROVIDER_CLASS = "mainland_relay_xiaoyi";

export function defaultXiaoyiDeepseekRelayConfig() {
  return {
    providerClass: XIAOYI_PROVIDER_CLASS,
    providerMode: "backend_internal_debug_only",
    endpointBucket: XIAOYI_ENDPOINT_BUCKET,
    apiStyle: "openai_compatible_chat_completions",
    apiKeyEnvName: "XIAOYI_API_KEY",
    baseUrlEnvName: "XIAOYI_BASE_URL",
    chatCompletionsPathEnvName: "XIAOYI_CHAT_COMPLETIONS_PATH",
    photoAdvisorModelEnvName: "XIAOYI_PHOTO_ADVISOR_MODEL",
    filterLabModelEnvName: "XIAOYI_FILTER_LAB_MODEL",
    photoAdvisorModel: XIAOYI_DEEPSEEK_DEFAULT_MODEL,
    filterLabModel: XIAOYI_DEEPSEEK_DEFAULT_MODEL,
    enabled: false,
    allowNetworkCalls: false,
    allowImageUpload: false,
    allowLiveCamera: false,
    stream: false,
    imageDetail: "low",
    temperature: 0.2,
    topP: 0.8,
    photoAdvisorMaxTokens: 640,
    filterLabMaxTokens: 512,
    productionReady: false
  };
}

export function validateXiaoyiDeepseekRelayConfig(config = {}) {
  const merged = { ...defaultXiaoyiDeepseekRelayConfig(), ...config };
  const blockers = [];

  if (merged.providerClass !== XIAOYI_PROVIDER_CLASS) {
    blockers.push("provider_not_configured");
  }

  if (merged.endpointBucket !== XIAOYI_ENDPOINT_BUCKET) {
    blockers.push("provider_not_configured");
  }

  if (merged.apiStyle !== "openai_compatible_chat_completions") {
    blockers.push("provider_not_configured");
  }

  if (!isSafeEnvName(merged.apiKeyEnvName) || merged.apiKeyEnvName !== "XIAOYI_API_KEY") {
    blockers.push("provider_not_configured");
  }

  if (!isSafeEnvName(merged.baseUrlEnvName) || merged.baseUrlEnvName !== "XIAOYI_BASE_URL") {
    blockers.push("provider_not_configured");
  }

  if (!isSafeEnvName(merged.chatCompletionsPathEnvName) || merged.chatCompletionsPathEnvName !== "XIAOYI_CHAT_COMPLETIONS_PATH") {
    blockers.push("provider_not_configured");
  }

  if (merged.photoAdvisorModel !== XIAOYI_DEEPSEEK_DEFAULT_MODEL || merged.filterLabModel !== XIAOYI_DEEPSEEK_DEFAULT_MODEL) {
    blockers.push("provider_model_unavailable");
  }

  if (merged.enabled === true) {
    blockers.push("provider_runtime_not_enabled");
  }

  if (merged.allowNetworkCalls === true) {
    blockers.push("provider_network_not_approved");
  }

  if (merged.allowImageUpload === true || merged.allowLiveCamera === true) {
    blockers.push("provider_upload_not_approved");
  }

  if (merged.stream !== false) {
    blockers.push("provider_invalid_request_shape");
  }

  if (merged.imageDetail !== "low") {
    blockers.push("provider_invalid_request_shape");
  }

  if (merged.productionReady === true) {
    blockers.push("provider_runtime_not_enabled");
  }

  if (containsCredentialLikeConfig(merged)) {
    blockers.push("provider_auth_failed");
  }

  if (containsRawUrlConfig(merged)) {
    blockers.push("provider_network_not_approved");
  }

  return {
    ok: blockers.length === 0,
    config: sanitizeXiaoyiDeepseekConfigForReport(merged),
    blockers: [...new Set(blockers)].sort(),
    networkCallsMade: false,
    providerRuntimeExecutionAdded: false,
    productionReady: false
  };
}

export function buildXiaoyiDeepseekPhotoAdvisorRequestShape({
  imagePlaceholder = "<SAFE_IMAGE_BASE64_PLACEHOLDER>",
  textPromptPlaceholder = "<PHOTO_ADVISOR_PROMPT_PLACEHOLDER>",
  config = defaultXiaoyiDeepseekRelayConfig()
} = {}) {
  const validation = validateXiaoyiDeepseekRelayConfig(config);
  const merged = { ...defaultXiaoyiDeepseekRelayConfig(), ...config };

  return {
    productSurface: "photo_analysis",
    endpointBucket: XIAOYI_ENDPOINT_BUCKET,
    baseUrlEnvName: "XIAOYI_BASE_URL",
    apiKeyEnvName: "XIAOYI_API_KEY",
    request: {
      method: "POST",
      path: XIAOYI_CHAT_COMPLETIONS_PATH,
      headersShape: {
        Authorization: "Bearer <XIAOYI_API_KEY_FROM_BACKEND_ENV>",
        "Content-Type": "application/json"
      },
      body: {
        model: XIAOYI_DEEPSEEK_DEFAULT_MODEL,
        stream: false,
        temperature: merged.temperature,
        top_p: merged.topP,
        max_tokens: merged.photoAdvisorMaxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "<PHOTO_ADVISOR_SYSTEM_PROMPT_PLACEHOLDER>"
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: sanitizePlaceholder(textPromptPlaceholder, "<PHOTO_ADVISOR_PROMPT_PLACEHOLDER>")
              },
              {
                type: "image_url",
                image_url: {
                  url: sanitizePlaceholder(imagePlaceholder, "<SAFE_IMAGE_BASE64_PLACEHOLDER>"),
                  detail: "low"
                }
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

export function buildXiaoyiDeepseekFilterLabRequestShape({
  imagePlaceholder = "<SAFE_REFERENCE_IMAGE_BASE64_PLACEHOLDER>",
  schemaPromptPlaceholder = "<FILTER_LAB_SCHEMA_PROMPT_PLACEHOLDER>",
  config = defaultXiaoyiDeepseekRelayConfig()
} = {}) {
  const validation = validateXiaoyiDeepseekRelayConfig(config);
  const merged = { ...defaultXiaoyiDeepseekRelayConfig(), ...config };

  return {
    productSurface: "generated_filter",
    endpointBucket: XIAOYI_ENDPOINT_BUCKET,
    baseUrlEnvName: "XIAOYI_BASE_URL",
    apiKeyEnvName: "XIAOYI_API_KEY",
    request: {
      method: "POST",
      path: XIAOYI_CHAT_COMPLETIONS_PATH,
      headersShape: {
        Authorization: "Bearer <XIAOYI_API_KEY_FROM_BACKEND_ENV>",
        "Content-Type": "application/json"
      },
      body: {
        model: XIAOYI_DEEPSEEK_DEFAULT_MODEL,
        stream: false,
        temperature: merged.temperature,
        top_p: merged.topP,
        max_tokens: merged.filterLabMaxTokens,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "<FILTER_LAB_SYSTEM_PROMPT_PLACEHOLDER>"
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: sanitizePlaceholder(schemaPromptPlaceholder, "<FILTER_LAB_SCHEMA_PROMPT_PLACEHOLDER>")
              },
              {
                type: "image_url",
                image_url: {
                  url: sanitizePlaceholder(imagePlaceholder, "<SAFE_REFERENCE_IMAGE_BASE64_PLACEHOLDER>"),
                  detail: "low"
                }
              }
            ]
          }
        ]
      }
    },
    expectedOutputShape: generatedFilterRecipeExampleCandidate(),
    configValid: validation.ok,
    configBlockers: validation.blockers,
    executionAllowed: false,
    networkCallsMade: false,
    productionReady: false
  };
}

export function xiaoyiDeepseekRelayReadinessSummary(env = process.env, config = defaultXiaoyiDeepseekRelayConfig()) {
  const validation = validateXiaoyiDeepseekRelayConfig(config);
  const apiKeyPresent = typeof env?.XIAOYI_API_KEY === "string" && env.XIAOYI_API_KEY.length > 0;
  const blockers = new Set([
    "provider_network_not_approved_for_readiness_cli",
    "provider_runtime_not_enabled_by_default",
    "provider_terms_and_pricing_need_operator_review",
    "provider_model_vision_support_needs_runtime_verification"
  ]);

  if (!apiKeyPresent || !validation.ok) {
    blockers.add("provider_not_configured");
  }

  for (const blocker of validation.blockers) {
    blockers.add(blocker);
  }

  return {
    schemaVersion: "xiaoyi_deepseek_relay_readiness.v1",
    providerClass: XIAOYI_PROVIDER_CLASS,
    endpointBucket: XIAOYI_ENDPOINT_BUCKET,
    apiStyle: "openai_compatible_chat_completions",
    modelClass: "deepseek_v4_flash",
    productSurfaces: ["photo_analysis", "generated_filter"],
    providerConfigured: apiKeyPresent && validation.ok,
    apiKeyLoaded: false,
    keyPresenceBucket: apiKeyPresent ? "present_in_env_not_loaded" : "missing",
    baseUrlBucket: "xiaoyiapi_xyz",
    pathBucket: "v1_chat_completions",
    networkCallsMade: false,
    imageUploadAttempted: false,
    modelCallsMade: false,
    benchmarkRun: false,
    providerRuntimeExecutionAdded: false,
    iOSRuntimeChanged: false,
    uploadPayloadChanged: false,
    productionReady: false,
    blockers: Array.from(blockers).sort(),
    rawKeyPrinted: false,
    rawProviderUrlPrinted: false,
    rawPromptPrinted: false,
    rawOutputPrinted: false,
    rawPayloadPrinted: false,
    rawImagePrinted: false
  };
}

function sanitizeXiaoyiDeepseekConfigForReport(config) {
  return {
    providerClass: config.providerClass === XIAOYI_PROVIDER_CLASS ? XIAOYI_PROVIDER_CLASS : "invalid_provider",
    providerMode: config.providerMode,
    endpointBucket: config.endpointBucket === XIAOYI_ENDPOINT_BUCKET ? XIAOYI_ENDPOINT_BUCKET : "invalid_endpoint",
    apiStyle: config.apiStyle,
    apiKeyEnvName: config.apiKeyEnvName === "XIAOYI_API_KEY" ? "XIAOYI_API_KEY" : "invalid_env_name",
    baseUrlEnvName: config.baseUrlEnvName === "XIAOYI_BASE_URL" ? "XIAOYI_BASE_URL" : "invalid_env_name",
    photoAdvisorModel: config.photoAdvisorModel === XIAOYI_DEEPSEEK_DEFAULT_MODEL ? "deepseek-v4-flash" : "unsupported",
    filterLabModel: config.filterLabModel === XIAOYI_DEEPSEEK_DEFAULT_MODEL ? "deepseek-v4-flash" : "unsupported",
    enabled: config.enabled === true,
    allowNetworkCalls: config.allowNetworkCalls === true,
    allowImageUpload: config.allowImageUpload === true,
    allowLiveCamera: config.allowLiveCamera === true,
    stream: config.stream === true,
    imageDetail: config.imageDetail === "low" ? "low" : "unsupported",
    temperature: Number.isFinite(config.temperature) ? config.temperature : 0,
    topP: Number.isFinite(config.topP) ? config.topP : 0,
    photoAdvisorMaxTokens: Number.isInteger(config.photoAdvisorMaxTokens) ? config.photoAdvisorMaxTokens : 0,
    filterLabMaxTokens: Number.isInteger(config.filterLabMaxTokens) ? config.filterLabMaxTokens : 0,
    productionReady: false
  };
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

function containsRawUrlConfig(config) {
  for (const [key, value] of Object.entries(config)) {
    if (["baseUrlEnvName"].includes(key)) {
      continue;
    }
    if (typeof value === "string" && /^https?:\/\//i.test(value)) {
      return true;
    }
  }
  return false;
}

function sanitizePlaceholder(value, fallback) {
  if (typeof value !== "string" || value.length === 0 || value.length > 140) {
    return fallback;
  }
  if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value) || /base64,/i.test(value)) {
    return fallback;
  }
  return value;
}
