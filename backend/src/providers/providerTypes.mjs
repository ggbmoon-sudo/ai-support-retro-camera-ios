export const ProviderMode = Object.freeze({
  mockOnly: "mock-only",
  providerDisabled: "provider-disabled"
});

export function providerBoundaryStatus() {
  return {
    mode: ProviderMode.mockOnly,
    executableProviders: ["mock", "disabled"],
    providerCallsEnabled: false,
    providerKeyRequired: false
  };
}
