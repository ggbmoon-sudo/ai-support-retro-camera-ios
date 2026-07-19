import { MockCloudAIProvider } from "./MockCloudAIProvider.mjs";
import { DisabledProvider } from "./DisabledProvider.mjs";
import { QwePhotoAdvisorProvider } from "./QwePhotoAdvisorProvider.mjs";
import { XiaoyiDeepseekRelayProvider } from "./XiaoyiDeepseekRelayProvider.mjs";
import { XiaoyiLunaRelayProvider } from "./XiaoyiLunaRelayProvider.mjs";
import { SiliconFlowCloudAIProvider } from "./SiliconFlowCloudAIProvider.mjs";

export const ProviderKind = Object.freeze({
  mock: "mock",
  qweInternal: "qweInternal",
  xiaoyiRelayInternal: "xiaoyiRelayInternal",
  xiaoyiLunaInternal: "xiaoyiLunaInternal",
  siliconflowInternal: "siliconflowInternal",
  disabled: "disabled"
});

export function resolveProvider(kind = ProviderKind.mock, config = {}) {
  switch (kind) {
  case ProviderKind.mock:
    return new MockCloudAIProvider();
  case ProviderKind.qweInternal:
    return new QwePhotoAdvisorProvider({
      apiKey: config.qweAPIKey,
      baseURL: config.qweBaseURL,
      model: config.qwePhotoAdvisorModel,
      path: config.qweChatCompletionsPath,
      authHeader: config.qweAuthHeader
    });
  case ProviderKind.xiaoyiRelayInternal:
    return new XiaoyiDeepseekRelayProvider({
      apiKey: config.xiaoyiAPIKey,
      baseURL: config.xiaoyiBaseURL,
      photoAdvisorModel: config.xiaoyiPhotoAdvisorModel,
      filterLabModel: config.xiaoyiFilterLabModel,
      path: config.xiaoyiChatCompletionsPath
    });
  case ProviderKind.xiaoyiLunaInternal:
    return new XiaoyiLunaRelayProvider({
      apiKey: config.xiaoyiAPIKey,
      baseURL: config.xiaoyiBaseURL,
      photoAdvisorModel: config.xiaoyiPhotoAdvisorModel,
      filterLabModel: config.xiaoyiFilterLabModel,
      path: config.xiaoyiChatCompletionsPath
    });
  case ProviderKind.siliconflowInternal:
    return new SiliconFlowCloudAIProvider({
      apiKey: config.siliconFlowAPIKey,
      baseURL: config.siliconFlowBaseURL,
      photoAdvisorModel: config.siliconFlowPhotoAdvisorModel,
      filterLabModel: config.siliconFlowFilterLabModel,
      path: config.siliconFlowChatCompletionsPath
    });
  case ProviderKind.disabled:
    return new DisabledProvider();
  default:
    return new DisabledProvider();
  }
}

export function executableProviderKinds() {
  return [
    ProviderKind.mock,
    ProviderKind.qweInternal,
    ProviderKind.xiaoyiRelayInternal,
    ProviderKind.xiaoyiLunaInternal,
    ProviderKind.siliconflowInternal,
    ProviderKind.disabled
  ];
}
