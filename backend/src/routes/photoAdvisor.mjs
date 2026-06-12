import { resolveProvider, ProviderKind } from "../providers/ProviderRegistry.mjs";
import { fallbackCloudAIResponse } from "../responses/fallbackResponse.mjs";
import { CLOUD_AI_ERROR_CODES } from "../responses/cloudAIErrorCodes.mjs";
import { checkDevQuota } from "../security/quota.mjs";
import { checkDevRateLimit } from "../security/rateLimit.mjs";
import { withProviderTimeout } from "../security/timeout.mjs";
import { validatePhotoAdvisorRequest } from "../validators/validatePhotoAdvisorRequest.mjs";
import { validateCloudAIResponse } from "../validators/validateCloudAIResponse.mjs";

export async function handlePhotoAdvisorRequest(requestBody, options = {}) {
  const requestValidation = validatePhotoAdvisorRequest(requestBody);
  if (!requestValidation.ok) {
    return {
      status: 400,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.invalidRequest, requestValidation.error.message)
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

  const provider = options.provider ?? resolveProvider(ProviderKind.mock);
  let response;
  try {
    response = await withProviderTimeout(
      provider.analyzePhotoAdvisor({
        locale: requestBody.locale,
        selectedFilterId: requestBody.selectedFilterId ?? null,
        image: {
          width: requestBody.image.width,
          height: requestBody.image.height,
          contentType: requestBody.image.contentType,
          metadataStripped: requestBody.image.metadataStripped
        }
      }),
      options.timeoutMs
    );
  } catch (error) {
    const code = error?.code === "timeout" ? CLOUD_AI_ERROR_CODES.timeout : CLOUD_AI_ERROR_CODES.providerError;
    return {
      status: 200,
      body: fallbackForRequest(requestBody, code, "Cloud analysis is unavailable right now. Showing local advice instead.")
    };
  }
  const responseValidation = validateCloudAIResponse(response);

  if (!responseValidation.ok) {
    return {
      status: 200,
      body: fallbackForRequest(requestBody, CLOUD_AI_ERROR_CODES.unsafeResponse, "Cloud analysis is unavailable right now. Showing local advice instead.")
    };
  }

  return {
    status: 200,
    body: response
  };
}

function fallbackForRequest(requestBody, code, message) {
  return fallbackCloudAIResponse({
    locale: requestBody?.locale ?? "zh-Hant-HK",
    code,
    message
  });
}
