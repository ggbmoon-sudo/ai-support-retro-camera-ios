import { cloudAIConfig } from "../config/cloudAIConfig.mjs";
import { resolveProvider, ProviderKind } from "../providers/ProviderRegistry.mjs";
import { validateCompositionPlanCandidate } from "../providers/compositionPlannerContract.mjs";
import { isInternalCloudAIAllowed } from "../security/internalDebugGuard.mjs";
import { checkDevQuota } from "../security/quota.mjs";
import { checkDevRateLimit } from "../security/rateLimit.mjs";
import { withProviderTimeout } from "../security/timeout.mjs";
import { validateCompositionPlannerRequest } from "../validators/validateCompositionPlannerRequest.mjs";
import { XIAOYI_LUNA_TOTAL_TIMEOUT_MS } from "../providers/XiaoyiLunaRelayProvider.mjs";

export async function handleCompositionPlannerRequest(requestBody, options = {}) {
  const config = options.config ?? cloudAIConfig();
  const headers = options.headers ?? {};
  const requestValidation = validateCompositionPlannerRequest(requestBody);
  if (!requestValidation.ok) {
    return {
      status: requestValidation.error.code === "payload_too_large" ? 413 : 400,
      body: fallbackResponse(requestValidation.error.code)
    };
  }

  const rateLimit = checkDevRateLimit();
  if (!rateLimit.ok) {
    return { status: 429, body: fallbackResponse("rate_limited") };
  }

  const quota = checkDevQuota();
  if (!quota.ok) {
    return { status: 429, body: fallbackResponse("quota_exceeded") };
  }

  const providerKind = resolveCompositionPlannerProviderKind({ config, headers });
  if (providerKind === ProviderKind.disabled) {
    return { status: 200, body: fallbackResponse("internal_cloud_disabled") };
  }

  const provider = options.provider ?? resolveProvider(providerKind, config);
  try {
    const candidate = await withProviderTimeout(
      provider.analyzeCompositionPlan(providerInputFromRequest(requestBody)),
      options.timeoutMs ?? XIAOYI_LUNA_TOTAL_TIMEOUT_MS
    );
    const validation = validateCompositionPlanCandidate(candidate);
    if (!validation.ok) {
      return { status: 200, body: fallbackResponse("provider_invalid_schema") };
    }

    return {
      status: 200,
      body: {
        schemaVersion: "1.0",
        mode: "composition_plan",
        plan: validation.value,
        source: "cloud",
        safety: {
          containsSensitiveInference: false,
          requiresUserConsent: true,
          blockedReason: null
        },
        error: null
      },
      metadata: {
        providerKind,
        productionReady: false
      }
    };
  } catch (error) {
    return {
      status: 200,
      body: fallbackResponse(mapProviderError(error?.code)),
      metadata: {
        providerKind,
        productionReady: false
      }
    };
  }
}

export function resolveCompositionPlannerProviderKind({ config, headers = {} }) {
  if (config.providerMode !== ProviderKind.xiaoyiLunaInternal) {
    return ProviderKind.disabled;
  }

  if (!isInternalCloudAIAllowed({ headers, config })) {
    return ProviderKind.disabled;
  }

  if (
    !config.xiaoyiAPIKey ||
    !config.xiaoyiBaseURL ||
    !config.xiaoyiChatCompletionsPath ||
    !config.xiaoyiCompositionPlannerModel
  ) {
    return ProviderKind.disabled;
  }

  return ProviderKind.xiaoyiLunaInternal;
}

function providerInputFromRequest(requestBody) {
  return {
    locale: requestBody.locale,
    localContext: requestBody.localContext,
    image: {
      width: requestBody.image.width,
      height: requestBody.image.height,
      contentType: requestBody.image.contentType,
      metadataStripped: requestBody.image.metadataStripped,
      dataBase64: requestBody.image.dataBase64
    }
  };
}

function fallbackResponse(code) {
  return {
    schemaVersion: "1.0",
    mode: "composition_plan",
    plan: null,
    source: "fallback",
    safety: {
      containsSensitiveInference: false,
      requiresUserConsent: true,
      blockedReason: code
    },
    error: {
      code,
      message: "Cloud composition planning is unavailable; local composition remains active."
    }
  };
}

function mapProviderError(code) {
  switch (code) {
  case "timeout":
    return "provider_timeout";
  case "provider_invalid_json":
  case "invalid_json":
    return "provider_invalid_json";
  case "provider_invalid_schema":
    return "provider_invalid_schema";
  case "provider_unavailable":
    return "provider_unavailable";
  default:
    return "provider_error";
  }
}
