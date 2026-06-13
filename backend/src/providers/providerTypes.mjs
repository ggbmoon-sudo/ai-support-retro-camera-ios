export const ProviderMode = Object.freeze({
  mockOnly: "mock-only",
  providerDisabled: "provider-disabled"
});

export function providerBoundaryStatus() {
  return {
    mode: ProviderMode.mockOnly,
    executableProviders: ["mock", "qweInternal", "disabled"],
    providerCallsEnabled: false,
    providerKeyRequired: false
  };
}
