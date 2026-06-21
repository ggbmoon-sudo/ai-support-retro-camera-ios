import { hasUploadConsent } from "../security/consent.mjs";
import { validateImageShape } from "./validatePhotoAdvisorRequest.mjs";

export function validateFilterLabRequest(request) {
  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return invalid("invalid_request", "Request must be a JSON object");
  }

  if (request.schemaVersion !== "1.0") {
    return invalid("unsupported_schema_version", "schemaVersion must be 1.0");
  }

  if (request.feature !== "filter_lab") {
    return invalid("unsupported_feature", "feature must be filter_lab");
  }

  if (request.mode !== "reference_image") {
    return invalid("unsupported_mode", "mode must be reference_image");
  }

  if (!hasUploadConsent(request.consent)) {
    return invalid("consent_required", "Explicit image upload consent is required");
  }

  if (typeof request.locale !== "string" || request.locale.trim().length === 0) {
    return invalid("invalid_locale", "locale is required");
  }

  if (request.client !== undefined) {
    const clientValidation = validateClientShape(request.client);
    if (!clientValidation.ok) {
      return clientValidation;
    }
  }

  const imageValidation = validateImageShape(request.image);
  if (!imageValidation.ok) {
    return imageValidation;
  }

  return { ok: true };
}

function validateClientShape(client) {
  if (!client || typeof client !== "object" || Array.isArray(client)) {
    return invalid("invalid_client", "client must be an object");
  }

  if (client.platform !== undefined && client.platform !== "iOS") {
    return invalid("unsupported_client_platform", "client.platform must be iOS when provided");
  }

  return { ok: true };
}

function invalid(code, message) {
  return {
    ok: false,
    error: {
      code,
      message
    }
  };
}
