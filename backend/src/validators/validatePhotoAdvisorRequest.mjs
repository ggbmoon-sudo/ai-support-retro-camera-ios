import { hasUploadConsent } from "../security/consent.mjs";
import { isKnownFilterId } from "../filters/filterWhitelist.mjs";
import { CLOUD_AI_LIMITS } from "../security/limits.mjs";

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

  if (typeof request.locale !== "string" || request.locale.trim().length === 0) {
    return invalid("invalid_locale", "locale is required");
  }

  if (
    request.selectedFilterId !== undefined &&
    request.selectedFilterId !== null &&
    !isKnownFilterId(request.selectedFilterId)
  ) {
    return invalid("invalid_filter_id", "selectedFilterId must be a known app filter");
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

export function validateImageShape(image) {
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

  if (typeof image.dataBase64 !== "string" || image.dataBase64.length === 0) {
    return invalid("invalid_image_payload", "image dataBase64 is required");
  }

  if (image.dataBase64.length > CLOUD_AI_LIMITS.maxImageBase64LengthDebug) {
    return invalid("payload_too_large", "mock image payload is too large");
  }

  const decodedBytes = decodedBase64ByteLength(image.dataBase64);
  if (decodedBytes === null) {
    return invalid("invalid_image_payload", "image dataBase64 must be valid base64");
  }

  if (decodedBytes > CLOUD_AI_LIMITS.maxImageBase64LengthDebug) {
    return invalid("payload_too_large", "decoded mock image payload is too large");
  }

  if (decodedBytes > CLOUD_AI_LIMITS.maxImageBytesInternal) {
    return invalid("payload_too_large", "image payload is too large");
  }

  if (Math.max(image.width, image.height) > CLOUD_AI_LIMITS.maxDeclaredLongEdgeInternal) {
    return invalid("invalid_image_dimensions", "image long edge exceeds the internal beta limit");
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

function isValidBase64(value) {
  if (value.length % 4 !== 0) {
    return false;
  }

  return /^[A-Za-z0-9+/]+={0,2}$/.test(value);
}

function decodedBase64ByteLength(value) {
  if (!isValidBase64(value)) {
    return null;
  }

  return Buffer.from(value, "base64").length;
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
