import { MockCloudAIProvider } from "./MockCloudAIProvider.mjs";
import { DisabledProvider } from "./DisabledProvider.mjs";

export const ProviderKind = Object.freeze({
  mock: "mock",
  disabled: "disabled"
});

export function resolveProvider(kind = ProviderKind.mock) {
  switch (kind) {
  case ProviderKind.mock:
    return new MockCloudAIProvider();
  case ProviderKind.disabled:
    return new DisabledProvider();
  default:
    return new DisabledProvider();
  }
}

export function executableProviderKinds() {
  return [ProviderKind.mock, ProviderKind.disabled];
}
