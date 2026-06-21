import { aestheticParameterRegistry } from "./aestheticParameterRegistry.mjs";

export const AESTHETIC_CLOUD_TEACHER_REQUEST_ENVELOPE_SCHEMA_VERSION =
  "aesthetic_cloud_teacher_request_envelope.v1";

export const REDACTION_POLICY = Object.freeze({
  rawImageIncluded: false,
  base64Included: false,
  localFilePathIncluded: false,
  realUrlIncluded: false,
  promptTextIncluded: false,
  providerPayloadIncluded: false,
  modelNameIncluded: false,
  apiKeyIncluded: false,
  userIdentityIncluded: false,
  gpsExifIncluded: false
});

const ALLOWED_ENVELOPE_FIELDS = Object.freeze([
  "schemaVersion",
  "jobId",
  "imageId",
  "registryVersion",
  "allowedTagSubset",
  "assetRefType",
  "assetRefBucket",
  "sourceType",
  "teacherMode",
  "humanReviewRequired",
  "reviewQueueRequired",
  "redactionPolicy"
]);

const SAFE_ASSET_REF_TYPES = Object.freeze([
  "synthetic_stub",
  "approved_dataset_id",
  "redacted_external_id",
  "owned_local_ignored",
  "consented_local_ignored"
]);

const SAFE_ASSET_REF_BUCKETS = Object.freeze([
  "synthetic_stub",
  "approved_dataset_id",
  "redacted_external_id",
  "local_ignored_reference",
  "approved_consented_reference",
  "unknown"
]);

const FORBIDDEN_FIELD_FRAGMENTS = Object.freeze([
  "rawimage",
  "imagebase64",
  "base64",
  "localfilepath",
  "filepath",
  "imagepath",
  "path",
  "url",
  "signedurl",
  "realurl",
  "prompt",
  "systemmessage",
  "usermessage",
  "providerpayload",
  "requestpayload",
  "providerrequest",
  "providerresponse",
  "rawresponse",
  "modelname",
  "providermodel",
  "apikey",
  "api_key",
  "secret",
  "token",
  "authorization",
  "userid",
  "useridentity",
  "email",
  "gps",
  "exif",
  "cameraSerial"
].map(normalizeFieldName));

const RAW_VALUE_PATTERNS = Object.freeze([
  /^[a-zA-Z]:[\\/]/,
  /^\//,
  /^~/,
  /\\/,
  /\.(jpg|jpeg|png|heic|webp|gif|mov|mp4)$/i,
  /^https?:\/\//i,
  /^file:\/\//i,
  /^data:image/i,
  /\/9j\//,
  /base64/i,
  /api[_-]?key/i,
  /secret/i,
  /bearer\s+/i
]);

export function buildAestheticCloudTeacherRequestEnvelope(input = {}) {
  const registry = aestheticParameterRegistry();
  const jobPlanItem = input.jobPlanItem || input.job || {};
  const teacherRequest = input.teacherRequest || input.request || {};
  const reviewQueueRequirement = input.reviewQueueRequirement || input.review || {};
  const rootReasons = forbiddenShapeBlockers(input, "envelope_input");
  const jobReasons = sourceShapeBlockers(jobPlanItem, "job_plan_item");
  const requestReasons = sourceShapeBlockers(teacherRequest, "teacher_request");
  const reviewReasons = sourceShapeBlockers(reviewQueueRequirement, "review_queue_requirement");

  const candidate = {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_REQUEST_ENVELOPE_SCHEMA_VERSION,
    jobId: sanitizeToken(teacherRequest.jobId || jobPlanItem.jobId || "unknown_job"),
    imageId: sanitizeToken(teacherRequest.imageId || jobPlanItem.imageId || "unknown_image"),
    registryVersion: sanitizeToken(teacherRequest.registryVersion || jobPlanItem.registryVersion || registry.registryVersion),
    allowedTagSubset: sanitizedTags(teacherRequest.allowedTagSubset || jobPlanItem.allowedTagSubset, registry),
    assetRefType: sanitizeToken(teacherRequest.assetRefType || jobPlanItem.assetRefType || "unknown"),
    assetRefBucket: sanitizeToken(teacherRequest.assetRefBucket || jobPlanItem.assetRefBucket || "unknown"),
    sourceType: sanitizeToken(teacherRequest.sourceType || jobPlanItem.sourceType || "unknown"),
    teacherMode: "provider_sandbox_pending",
    humanReviewRequired: true,
    reviewQueueRequired: true,
    redactionPolicy: { ...REDACTION_POLICY }
  };

  const blockedReasons = unique([
    ...rootReasons,
    ...jobReasons,
    ...requestReasons,
    ...reviewReasons,
    ...envelopeBlockers(candidate, reviewQueueRequirement)
  ]);

  if (blockedReasons.length > 0) {
    throw Object.assign(
      new Error(`blocked_request_envelope:${blockedReasons.join(",")}`),
      { blockedReasons }
    );
  }

  return Object.fromEntries(
    ALLOWED_ENVELOPE_FIELDS.map((field) => [field, candidate[field]])
  );
}

export function isAllowedAestheticCloudTeacherEnvelopeShape(envelope) {
  if (!envelope || typeof envelope !== "object") return false;
  const keys = Object.keys(envelope);
  return keys.length === ALLOWED_ENVELOPE_FIELDS.length &&
    keys.every((key) => ALLOWED_ENVELOPE_FIELDS.includes(key));
}

function envelopeBlockers(envelope, reviewQueueRequirement) {
  const blockers = [];
  if (envelope.registryVersion !== aestheticParameterRegistry().registryVersion) {
    blockers.push("blocked_for_registry_version_mismatch");
  }
  if (!Array.isArray(envelope.allowedTagSubset) || envelope.allowedTagSubset.length === 0) {
    blockers.push("blocked_for_empty_allowed_tag_subset");
  }
  if (!SAFE_ASSET_REF_TYPES.includes(envelope.assetRefType)) {
    blockers.push(`blocked_for_unsupported_asset_ref_type_${sanitizeToken(envelope.assetRefType)}`);
  }
  if (!SAFE_ASSET_REF_BUCKETS.includes(envelope.assetRefBucket)) {
    blockers.push(`blocked_for_unsupported_asset_ref_bucket_${sanitizeToken(envelope.assetRefBucket)}`);
  }
  if (reviewQueueRequirement.reviewQueueRequired === false) {
    blockers.push("blocked_for_review_queue_not_required");
  }
  if (reviewQueueRequirement.humanReviewRequired === false) {
    blockers.push("blocked_for_human_review_not_required");
  }
  return blockers;
}

function sourceShapeBlockers(value, path) {
  if (!value || typeof value !== "object") return [];
  return forbiddenShapeBlockers(value, path);
}

function forbiddenShapeBlockers(value, path = "input") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    if (FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))) {
      blockers.push(`blocked_for_forbidden_field_${sanitizeToken(keyPath)}`);
    }
    if (typeof nested === "string" && RAW_VALUE_PATTERNS.some((pattern) => pattern.test(nested))) {
      blockers.push(`blocked_for_forbidden_value_${sanitizeToken(keyPath)}`);
    }
    if (nested && typeof nested === "object") {
      blockers.push(...forbiddenShapeBlockers(nested, keyPath));
    }
  }
  return blockers;
}

function sanitizedTags(tags, registry) {
  const registryTags = new Set(registry.items.map((item) => item.tag));
  return Array.isArray(tags)
    ? tags.filter((tag) => registryTags.has(tag)).map(sanitizeToken)
    : [];
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeFieldName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}
