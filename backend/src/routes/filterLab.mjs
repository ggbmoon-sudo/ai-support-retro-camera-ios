import { cloudAIConfig } from "../config/cloudAIConfig.mjs";
import { resolveProvider, ProviderKind } from "../providers/ProviderRegistry.mjs";
import { validateGeneratedFilterRecipeCandidate } from "../providers/generatedFilterRecipeContract.mjs";
import { fallbackCloudAIResponse } from "../responses/fallbackResponse.mjs";
import { CLOUD_AI_ERROR_CODES } from "../responses/cloudAIErrorCodes.mjs";
import { isInternalCloudAIAllowed } from "../security/internalDebugGuard.mjs";
import { checkDevQuota } from "../security/quota.mjs";
import { checkDevRateLimit } from "../security/rateLimit.mjs";
import { withProviderTimeout } from "../security/timeout.mjs";
import { elapsedMs, nowMs } from "../utils/latency.mjs";
import { validateFilterLabRequest } from "../validators/validateFilterLabRequest.mjs";

export async function handleFilterLabRequest(requestBody, options = {}) {
  const startedAt = nowMs();
  const config = options.config ?? cloudAIConfig();
  const headers = options.headers ?? {};
  const requestValidation = validateFilterLabRequest(requestBody);
  if (!requestValidation.ok) {
    const code = errorCodeForRequestValidation(requestValidation.error.code);
    return {
      status: code === CLOUD_AI_ERROR_CODES.imageTooLarge ? 413 : 400,
      body: fallbackForRequest(requestBody, code, requestValidation.error.message)
    };
  }

  const rateLimit = checkDevRateLimit();
  if (!rateLimit.ok) {
    return {
      status: 429,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.rateLimited, "Cloud filter generation is temporarily rate limited.")
    };
  }

  const quota = checkDevQuota();
  if (!quota.ok) {
    return {
      status: 429,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.quotaExceeded, "Cloud filter generation quota is temporarily unavailable.")
    };
  }

  const providerKind = resolveFilterLabProviderKind({ config, headers });
  if (providerKind === ProviderKind.disabled) {
    return {
      status: 200,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.internalCloudDisabled, "Cloud filter generation is unavailable right now. Showing local filters instead.")
    };
  }

  const provider = options.provider ?? resolveProvider(providerKind, config);
  let providerResult;
  try {
    providerResult = await generateWithRetry({
      provider,
      input: providerInputFromRequest(requestBody),
      timeoutMs: options.timeoutMs
    });
  } catch (error) {
    const code = mapProviderErrorCode(error?.code);
    return {
      status: 200,
      body: fallbackForRequest(requestBody, code, "Cloud filter generation is unavailable right now. Showing local filters instead."),
      metadata: {
        providerKind,
        latencyMs: elapsedMs(startedAt),
        attempts: error?.attempts ?? null
      }
    };
  }

  return {
    status: 200,
    body: filterLabResponse({
      locale: requestBody.locale,
      recipe: providerResult.recipe
    }),
    metadata: {
      providerKind,
      latencyMs: elapsedMs(startedAt),
      attempts: providerResult.attempts
    }
  };
}

export function resolveFilterLabProviderKind({ config, headers = {} }) {
  if (config.providerMode !== ProviderKind.xiaoyiRelayInternal) {
    return ProviderKind.disabled;
  }

  if (!isInternalCloudAIAllowed({ headers, config })) {
    return ProviderKind.disabled;
  }

  if (
    !config.xiaoyiAPIKey ||
    !config.xiaoyiBaseURL ||
    !config.xiaoyiChatCompletionsPath ||
    !config.xiaoyiFilterLabModel
  ) {
    return ProviderKind.disabled;
  }

  return ProviderKind.xiaoyiRelayInternal;
}

async function generateWithRetry({ provider, input, timeoutMs }) {
  let lastError;
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const candidate = await withProviderTimeout(provider.generateFilterRecipe(input), timeoutMs);
      const validation = validateGeneratedFilterRecipeCandidate(candidate);
      if (!validation.ok) {
        const error = new Error("Provider filter recipe failed schema validation");
        error.code = "provider_invalid_schema";
        error.attempts = attempt;
        lastError = error;
        if (attempt < maxAttempts) {
          continue;
        }
        throw error;
      }

      return { recipe: validation.value, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (error && typeof error === "object" && !error.attempts) {
        error.attempts = attempt;
      }
      if (!shouldRetryProviderError(error?.code) || attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw lastError;
}

function shouldRetryProviderError(code) {
  return [
    "invalid_json",
    "provider_invalid_json",
    "provider_invalid_schema",
    "provider_transient_error",
    "timeout"
  ].includes(code);
}

function providerInputFromRequest(requestBody) {
  return {
    locale: requestBody.locale,
    image: {
      width: requestBody.image.width,
      height: requestBody.image.height,
      contentType: requestBody.image.contentType,
      metadataStripped: requestBody.image.metadataStripped,
      dataBase64: requestBody.image.dataBase64
    }
  };
}

function filterLabResponse({ locale, recipe }) {
  return {
    schemaVersion: "1.0",
    mode: "filter_generation",
    summary: "",
    suggestions: [],
    recommendedFilters: [],
    generatedFilter: recipe,
    poseGuide: null,
    retakeAdvice: null,
    cropAdvice: null,
    confidence: confidenceBucket(recipe.confidence),
    source: "cloud",
    locale,
    safety: {
      containsSensitiveInference: false,
      requiresUserConsent: true,
      blockedReason: null
    },
    error: null
  };
}

function confidenceBucket(value) {
  if (value >= 0.75) {
    return "high";
  }
  if (value >= 0.45) {
    return "medium";
  }
  return "low";
}

function mapProviderErrorCode(code) {
  switch (code) {
  case "timeout":
    return CLOUD_AI_ERROR_CODES.providerTimeout;
  case "provider_invalid_json":
  case "invalid_json":
    return CLOUD_AI_ERROR_CODES.providerInvalidJson;
  case "provider_invalid_schema":
    return CLOUD_AI_ERROR_CODES.providerInvalidSchema;
  case "provider_unavailable":
  case "provider_disabled":
    return CLOUD_AI_ERROR_CODES.providerUnavailable;
  default:
    return CLOUD_AI_ERROR_CODES.providerError;
  }
}

function errorCodeForRequestValidation(code) {
  switch (code) {
  case "consent_required":
    return CLOUD_AI_ERROR_CODES.missingConsent;
  case "payload_too_large":
    return CLOUD_AI_ERROR_CODES.imageTooLarge;
  default:
    return CLOUD_AI_ERROR_CODES.invalidRequest;
  }
}

function fallbackForRequest(requestBody, code, message) {
  return fallbackCloudAIResponse({
    locale: requestBody?.locale ?? "zh-Hant-HK",
    code,
    message
  });
}
