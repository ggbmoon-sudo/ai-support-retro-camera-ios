import { hasUploadConsent } from "../security/consent.mjs";

const MAX_MOCK_IMAGE_BASE64_LENGTH = 96_000;

export function validatePhotoAdvisorRequest(request) {
  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return invalid("invalid_request", "Request must be a JSON object");
  }

  if (request.schemaVersion !== "1.0") {
    return invalid("unsupported_schema_version", "schemaVersion must be 1.0");
  }

  if (request.feature !== "photo_advisor") {
    return invalid("unsupported_feature", "feature must be photo_advisor");
  }

  if (request.mode !== "post_capture") {
    return invalid("unsupported_mode", "mode must be post_capture");
  }

  if (!hasUploadConsent(request.consent)) {
    return invalid("consent_required", "Explicit image upload consent is required");
  }

  if (request.image !== undefined) {
    const imageValidation = validateImageShape(request.image);
    if (!imageValidation.ok) {
      return imageValidation;
    }
  }

  return { ok: true };
}

function validateImageShape(image) {
  if (!image || typeof image !== "object" || Array.isArray(image)) {
    return invalid("invalid_image", "image must be an object");
  }

  if (image.contentType !== "image/jpeg") {
    return invalid("unsupported_content_type", "image contentType must be image/jpeg");
  }

  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) {
    return invalid("invalid_image_dimensions", "image width and height must be integers");
  }

  if (image.width < 1 || image.height < 1 || image.width > 4096 || image.height > 4096) {
    return invalid("invalid_image_dimensions", "image dimensions are outside the accepted mock boundary");
  }

  if (image.metadataStripped !== true) {
    return invalid("metadata_not_stripped", "image metadataStripped must be true");
  }

  if (image.dataBase64 !== undefined) {
    if (typeof image.dataBase64 !== "string") {
      return invalid("invalid_image_payload", "image dataBase64 must be a string when present");
    }

    if (image.dataBase64.length > MAX_MOCK_IMAGE_BASE64_LENGTH) {
      return invalid("payload_too_large", "mock image payload is too large");
    }
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
