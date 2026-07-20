import { hasUploadConsent } from "../security/consent.mjs";
import { validateImageShape } from "./validatePhotoAdvisorRequest.mjs";

const SUBJECT_KINDS = new Set(["face", "body", "salient_object"]);
const SUBJECT_COUNTS = new Set(["single", "multiple"]);
const LENS_BUCKETS = new Set(["wide", "standard", "telephoto"]);

export function validateCompositionPlannerRequest(request) {
  if (!request || typeof request !== "object" || Array.isArray(request)) {
    return invalid("invalid_request", "Request must be a JSON object");
  }

  if (request.schemaVersion !== "1.0") {
    return invalid("unsupported_schema_version", "schemaVersion must be 1.0");
  }

  if (request.feature !== "composition_planner") {
    return invalid("unsupported_feature", "feature must be composition_planner");
  }

  if (request.mode !== "one_shot_pre_capture") {
    return invalid("unsupported_mode", "mode must be one_shot_pre_capture");
  }

  if (!hasUploadConsent(request.consent)) {
    return invalid("consent_required", "Explicit one-shot image upload consent is required");
  }

  if (typeof request.locale !== "string" || request.locale.trim().length === 0) {
    return invalid("invalid_locale", "locale is required");
  }

  const contextValidation = validateLocalContext(request.localContext);
  if (!contextValidation.ok) {
    return contextValidation;
  }

  const imageValidation = validateImageShape(request.image);
  if (!imageValidation.ok) {
    return imageValidation;
  }

  return { ok: true };
}

function validateLocalContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    return invalid("invalid_local_context", "localContext must be an object");
  }

  const keys = Object.keys(context).sort();
  const expected = ["lensBucket", "subjectCount", "subjectKind"].sort();
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    return invalid("invalid_local_context", "localContext has missing or unsupported fields");
  }

  if (!SUBJECT_KINDS.has(context.subjectKind)) {
    return invalid("invalid_local_context", "localContext.subjectKind is unsupported");
  }
  if (!SUBJECT_COUNTS.has(context.subjectCount)) {
    return invalid("invalid_local_context", "localContext.subjectCount is unsupported");
  }
  if (!LENS_BUCKETS.has(context.lensBucket)) {
    return invalid("invalid_local_context", "localContext.lensBucket is unsupported");
  }

  return { ok: true };
}

function invalid(code, message) {
  return {
    ok: false,
    error: { code, message }
  };
}
