export function hasUploadConsent(consent) {
  return Boolean(
    consent &&
      consent.imageUploadAccepted === true &&
      typeof consent.consentVersion === "string" &&
      consent.consentVersion.length > 0
  );
}
