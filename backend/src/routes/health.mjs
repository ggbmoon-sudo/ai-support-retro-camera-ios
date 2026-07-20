import { cloudAIConfig } from "../config/cloudAIConfig.mjs";
import { ProviderKind } from "../providers/ProviderRegistry.mjs";

export function healthResponse(env = process.env) {
  const config = cloudAIConfig(env);
  const photoAdvisorReady = isPhotoAdvisorReady(config);
  const filterLabReady = isFilterLabReady(config);
  const compositionPlannerReady = isCompositionPlannerReady(config);

  return {
    ok: true,
    service: "cloud-ai-boundary",
    mode: config.providerMode,
    providerMode: config.providerMode,
    internalCloudAIAllowed: config.allowInternalCloudAI === true,
    photoAdvisorReady,
    filterLabReady,
    compositionPlannerReady,
    productionReady: false
  };
}

function isCompositionPlannerReady(config) {
  return Boolean(
    config.allowInternalCloudAI === true &&
    config.providerMode === ProviderKind.xiaoyiLunaInternal &&
    config.xiaoyiAPIKey &&
    config.xiaoyiBaseURL &&
    config.xiaoyiChatCompletionsPath &&
    config.xiaoyiCompositionPlannerModel
  );
}

function isPhotoAdvisorReady(config) {
  if (config.allowInternalCloudAI !== true) {
    return false;
  }

  switch (config.providerMode) {
  case ProviderKind.qweInternal:
    return Boolean(
      config.qweAPIKey &&
      config.qweBaseURL &&
      config.qweChatCompletionsPath &&
      config.qwePhotoAdvisorModel
    );
  case ProviderKind.xiaoyiRelayInternal:
  case ProviderKind.xiaoyiLunaInternal:
    return Boolean(
      config.xiaoyiAPIKey &&
      config.xiaoyiBaseURL &&
      config.xiaoyiChatCompletionsPath &&
      config.xiaoyiPhotoAdvisorModel
    );
  case ProviderKind.siliconflowInternal:
    return Boolean(
      config.siliconFlowAPIKey &&
      config.siliconFlowBaseURL &&
      config.siliconFlowChatCompletionsPath &&
      config.siliconFlowPhotoAdvisorModel
    );
  default:
    return false;
  }
}

function isFilterLabReady(config) {
  if (config.allowInternalCloudAI !== true) {
    return false;
  }

  switch (config.providerMode) {
  case ProviderKind.xiaoyiRelayInternal:
  case ProviderKind.xiaoyiLunaInternal:
    return Boolean(
      config.xiaoyiAPIKey &&
      config.xiaoyiBaseURL &&
      config.xiaoyiChatCompletionsPath &&
      config.xiaoyiFilterLabModel
    );
  case ProviderKind.siliconflowInternal:
    return Boolean(
      config.siliconFlowAPIKey &&
      config.siliconFlowBaseURL &&
      config.siliconFlowChatCompletionsPath &&
      config.siliconFlowFilterLabModel
    );
  default:
    return false;
  }
}
