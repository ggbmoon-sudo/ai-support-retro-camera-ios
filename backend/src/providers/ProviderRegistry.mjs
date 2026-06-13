import { MockCloudAIProvider } from "./MockCloudAIProvider.mjs";
import { DisabledProvider } from "./DisabledProvider.mjs";
import { QwePhotoAdvisorProvider } from "./QwePhotoAdvisorProvider.mjs";

export const ProviderKind = Object.freeze({
  mock: "mock",
  qweInternal: "qweInternal",
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
  case ProviderKind.disabled:
    return new DisabledProvider();
  default:
    return new DisabledProvider();
  }
}

export function executableProviderKinds() {
  return [ProviderKind.mock, ProviderKind.qweInternal, ProviderKind.disabled];
}
