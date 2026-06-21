import { cloudAIConfig } from "../config/cloudAIConfig.mjs";
import { resolveProvider, ProviderKind } from "../providers/ProviderRegistry.mjs";
import { fallbackCloudAIResponse } from "../responses/fallbackResponse.mjs";
import { CLOUD_AI_ERROR_CODES } from "../responses/cloudAIErrorCodes.mjs";
import { isInternalCloudAIAllowed } from "../security/internalDebugGuard.mjs";
import { checkDevQuota } from "../security/quota.mjs";
import { checkDevRateLimit } from "../security/rateLimit.mjs";
import { withProviderTimeout } from "../security/timeout.mjs";
import { elapsedMs, nowMs } from "../utils/latency.mjs";
import { validatePhotoAdvisorRequest } from "../validators/validatePhotoAdvisorRequest.mjs";
import { validateCloudAIResponse } from "../validators/validateCloudAIResponse.mjs";

export async function handlePhotoAdvisorRequest(requestBody, options = {}) {
  const startedAt = nowMs();
  const config = options.config ?? cloudAIConfig();
  const headers = options.headers ?? {};
  const requestValidation = validatePhotoAdvisorRequest(requestBody);
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
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.rateLimited, "Cloud analysis is temporarily rate limited.")
    };
  }

  const quota = checkDevQuota();
  if (!quota.ok) {
    return {
      status: 429,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.quotaExceeded, "Cloud analysis quota is temporarily unavailable.")
    };
  }

  const providerKind = resolveProviderKind({ config, headers });
  if (providerKind === ProviderKind.disabled) {
    return {
      status: 200,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.internalCloudDisabled, "Cloud analysis is unavailable right now. Showing local advice instead.")
    };
  }

  const provider = options.provider ?? resolveProvider(providerKind, config);
  let providerResult;
  try {
    providerResult = await analyzeWithRetry({
      provider,
      providerKind,
      input: providerInputFromRequest(requestBody),
      timeoutMs: options.timeoutMs
    });
  } catch (error) {
    const code = mapProviderErrorCode(error?.code);
    return {
      status: 200,
      body: fallbackForRequest(requestBody, code, "Cloud analysis is unavailable right now. Showing local advice instead."),
      metadata: {
        providerKind,
        latencyMs: elapsedMs(startedAt),
        attempts: error?.attempts ?? null,
        unsafeCategory: error?.unsafeCategory ?? null
      }
    };
  }

  const responseValidation = validateCloudAIResponse(providerResult.response);

  if (!responseValidation.ok) {
    const code = responseValidation.error.code === "unsafe_response"
      ? CLOUD_AI_ERROR_CODES.unsafeResponse
      : CLOUD_AI_ERROR_CODES.providerInvalidSchema;
    return {
      status: 200,
      body: fallbackForRequest(requestBody, code, "Cloud analysis is unavailable right now. Showing local advice instead."),
      metadata: {
        providerKind,
        latencyMs: elapsedMs(startedAt),
        attempts: providerResult.attempts,
        unsafeCategory: responseValidation.error.unsafeCategory ?? null
      }
    };
  }

  return {
    status: 200,
    body: responseValidation.response ?? providerResult.response,
    metadata: {
      providerKind,
      latencyMs: elapsedMs(startedAt),
      attempts: providerResult.attempts
    }
  };
}

export function resolveProviderKind({ config, headers = {} }) {
  if (config.providerMode === ProviderKind.qweInternal) {
    if (!isInternalCloudAIAllowed({ headers, config })) {
      return ProviderKind.mock;
    }
    if (!config.qweAPIKey || !config.qweBaseURL || !config.qwePhotoAdvisorModel || !config.qweChatCompletionsPath) {
      return ProviderKind.disabled;
    }
    return ProviderKind.qweInternal;
  }

  if (config.providerMode === ProviderKind.xiaoyiRelayInternal) {
    if (!isInternalCloudAIAllowed({ headers, config })) {
      return ProviderKind.mock;
    }
    if (
      !config.xiaoyiAPIKey ||
      !config.xiaoyiBaseURL ||
      !config.xiaoyiChatCompletionsPath ||
      !config.xiaoyiPhotoAdvisorModel
    ) {
      return ProviderKind.disabled;
    }
    return ProviderKind.xiaoyiRelayInternal;
  }

  if (config.providerMode === ProviderKind.siliconflowInternal) {
    if (!isInternalCloudAIAllowed({ headers, config })) {
      return ProviderKind.mock;
    }
    if (
      !config.siliconFlowAPIKey ||
      !config.siliconFlowBaseURL ||
      !config.siliconFlowChatCompletionsPath ||
      !config.siliconFlowPhotoAdvisorModel
    ) {
      return ProviderKind.disabled;
    }
    return ProviderKind.siliconflowInternal;
  }

  if (config.providerMode === ProviderKind.disabled) {
    return ProviderKind.disabled;
  }

  return ProviderKind.mock;
}

async function analyzeWithRetry({ provider, providerKind, input, timeoutMs }) {
  let lastError;
  const maxAttempts = providerKind === ProviderKind.mock ? 1 : 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await withProviderTimeout(provider.analyzePhotoAdvisor(input), timeoutMs);
      const validation = validateCloudAIResponse(response);
      if (!validation.ok) {
        if (validation.error.code === "unsafe_response") {
          const error = new Error("Unsafe provider output");
          error.code = "unsafe_response";
          error.unsafeCategory = validation.error.unsafeCategory ?? null;
          error.attempts = attempt;
          throw error;
        }

        const error = new Error("Provider response failed schema validation");
        error.code = "provider_invalid_schema";
        error.attempts = attempt;
        lastError = error;
        if (attempt < maxAttempts) {
          continue;
        }
        throw error;
      }

      return { response, attempts: attempt };
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
    selectedFilterId: requestBody.selectedFilterId ?? null,
    image: {
      width: requestBody.image.width,
      height: requestBody.image.height,
      contentType: requestBody.image.contentType,
      metadataStripped: requestBody.image.metadataStripped,
      dataBase64: requestBody.image.dataBase64
    }
  };
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
  case "unsafe_response":
    return CLOUD_AI_ERROR_CODES.unsafeResponse;
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
