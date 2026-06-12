export const ProviderMode = Object.freeze({
  mockOnly: "mock-only",
  providerDisabled: "provider-disabled"
});

export function providerBoundaryStatus() {
  return {
    mode: ProviderMode.mockOnly,
    providerCallsEnabled: false,
    providerKeyRequired: false
  };
}
