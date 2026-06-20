import { aestheticParameterRegistry } from "./aestheticParameterRegistry.mjs";

export const AESTHETIC_DATASET_MANIFEST_SCHEMA_VERSION =
  "aesthetic_dataset_manifest.v1";

export const ALLOWED_SOURCE_TYPES = Object.freeze([
  "owned_internal",
  "consented_beta",
  "staged_internal",
  "synthetic",
  "approved_open_dataset",
  "approved_cc_dataset"
]);

export const BANNED_SOURCE_TYPES = Object.freeze([
  "google_images",
  "instagram",
  "pinterest",
  "tiktok",
  "random_web",
  "unknown_license",
  "scraped_social_media"
]);

export const ALLOWED_LICENSE_STATUSES = Object.freeze([
  "owned",
  "consented",
  "approved_license",
  "pending_review",
  "rejected"
]);

export const ALLOWED_LICENSE_TYPES = Object.freeze([
  "internal_owned",
  "explicit_beta_consent",
  "synthetic_generated",
  "open_dataset_reviewed",
  "cc_by_reviewed",
  "cc_by_sa_reviewed",
  "pending_review",
  "rejected"
]);

export const ALLOWED_CONSENT_STATUSES = Object.freeze([
  "not_required_synthetic",
  "owner_approved",
  "explicit_user_consent",
  "dataset_license_reviewed",
  "pending_review",
  "rejected"
]);

export const ALLOWED_APPROVAL_STATUSES = Object.freeze([
  "draft",
  "approved_for_eval",
  "approved_for_teacher_labeling",
  "approved_for_training_candidate",
  "rejected"
]);

export const ALLOWED_REVIEW_STATUSES = Object.freeze([
  "pending",
  "approved",
  "rejected",
  "needs_human_review"
]);

export const ALLOWED_ASSET_REF_TYPES = Object.freeze([
  "synthetic_stub",
  "owned_local_ignored",
  "consented_local_ignored",
  "approved_dataset_id",
  "redacted_external_id"
]);

export const ALLOWED_SPLITS = Object.freeze([
  "eval",
  "calibration",
  "holdout",
  "unassigned"
]);

export const ALLOWED_LABEL_STATUSES = Object.freeze([
  "draft",
  "ready_for_teacher_stub",
  "needs_human_review",
  "accepted",
  "rejected",
  "blocked"
]);

const REQUIRED_SOURCE_FIELDS = Object.freeze([
  "sourceId",
  "sourceType",
  "displayNameKey",
  "licenseStatus",
  "licenseType",
  "consentStatus",
  "allowedUses",
  "approvalStatus",
  "metadataPolicy",
  "retentionPolicy",
  "reviewStatus",
  "notesKey"
]);

const REQUIRED_IMAGE_FIELDS = Object.freeze([
  "imageId",
  "sourceId",
  "assetRefType",
  "assetRef",
  "split",
  "metadataStatus",
  "privacyReviewStatus",
  "labelReviewStatus",
  "allowedUse",
  "notesKey"
]);

const REQUIRED_LABEL_JOB_FIELDS = Object.freeze([
  "jobId",
  "imageId",
  "registryVersion",
  "allowedTagSubset",
  "teacherLabelingAllowed",
  "humanReviewRequired",
  "status"
]);

const REQUIRED_USE_FLAGS = Object.freeze([
  "evaluation",
  "teacherLabeling",
  "trainingCandidate",
  "productRuntime"
]);

const REQUIRED_METADATA_FLAGS = Object.freeze([
  "gpsRemoved",
  "exifRemoved",
  "cameraSerialRemoved",
  "rawSensorDataRemoved"
]);

const FORBIDDEN_FIELD_FRAGMENTS = Object.freeze([
  "score",
  "rating",
  "beauty",
  "attractiveness",
  "gender",
  "emotion",
  "identity",
  "ethnicity",
  "race",
  "health",
  "body",
  "rawprompt",
  "prompttext",
  "rawprovider",
  "providerresponse",
  "rawmodel",
  "debugtext",
  "requestpayload"
]);

const FORBIDDEN_EXACT_FIELDS = Object.freeze([
  "age",
  "agebucket",
  "agelabel",
  "estimatedage"
]);

const RAW_REF_PATTERNS = Object.freeze([
  /^[a-zA-Z]:[\\/]/,
  /^\//,
  /^~/,
  /\\/,
  /\.(jpg|jpeg|png|heic|webp|gif|mov|mp4)$/i,
  /^https?:\/\//i,
  /^file:\/\//i,
  /^data:image/i,
  /\/9j\//
]);

export function aestheticDatasetManifestSample() {
  return {
    schemaVersion: AESTHETIC_DATASET_MANIFEST_SCHEMA_VERSION,
    phase: "Phase OD-R2",
    productionReady: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    cloudTeacherEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    rawImagesCommitted: false,
    sources: [
      {
        sourceId: "src_synthetic_stub_001",
        sourceType: "synthetic",
        displayNameKey: "source.synthetic.stub.001",
        licenseStatus: "owned",
        licenseType: "synthetic_generated",
        consentStatus: "not_required_synthetic",
        allowedUses: {
          evaluation: true,
          teacherLabeling: false,
          trainingCandidate: false,
          productRuntime: false
        },
        approvalStatus: "approved_for_eval",
        metadataPolicy: {
          stripGps: true,
          stripExif: true,
          stripCameraSerial: true,
          stripRawSensorData: true
        },
        retentionPolicy: {
          retentionBucket: "manifest_only_no_asset_commit",
          deletionPolicyKey: "retention.synthetic.stub.only"
        },
        reviewStatus: "approved",
        notesKey: "notes.synthetic.stub.safe"
      }
    ],
    images: [
      {
        imageId: "img_synthetic_stub_001",
        sourceId: "src_synthetic_stub_001",
        assetRefType: "synthetic_stub",
        assetRef: "synthetic_stub:odr2:001",
        split: "eval",
        metadataStatus: {
          gpsRemoved: "not_applicable",
          exifRemoved: "not_applicable",
          cameraSerialRemoved: "not_applicable",
          rawSensorDataRemoved: "not_applicable"
        },
        privacyReviewStatus: "approved",
        labelReviewStatus: "needs_human_review",
        allowedUse: {
          evaluation: true,
          teacherLabeling: false,
          trainingCandidate: false,
          productRuntime: false
        },
        notesKey: "notes.image.synthetic.stub"
      }
    ],
    labelJobs: [
      {
        jobId: "job_synthetic_stub_001",
        imageId: "img_synthetic_stub_001",
        registryVersion: aestheticParameterRegistry().registryVersion,
        allowedTagSubset: [
          "ERR_COMP_RULE_OF_THIRDS_MISS",
          "ERR_COMP_EXCESSIVE_HEADROOM",
          "ERR_COMP_HORIZON_TILT"
        ],
        teacherLabelingAllowed: false,
        humanReviewRequired: true,
        status: "draft"
      }
    ]
  };
}

export function evaluateAestheticDatasetManifest(manifest = aestheticDatasetManifestSample()) {
  const sources = Array.isArray(manifest.sources) ? manifest.sources : [];
  const images = Array.isArray(manifest.images) ? manifest.images : [];
  const labelJobs = Array.isArray(manifest.labelJobs) ? manifest.labelJobs : [];
  const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
  const imageById = new Map(images.map((image) => [image.imageId, image]));
  const validRegistryTags = new Set(aestheticParameterRegistry().items.map((item) => item.tag));

  const blockedReasons = unique([
    ...manifestBoundaryBlockers(manifest),
    ...sourceBlockers(sources),
    ...imageBlockers(images, sourceById),
    ...labelJobBlockers(labelJobs, imageById, sourceById, validRegistryTags),
    ...forbiddenFieldBlockers(manifest)
  ]);

  return {
    schemaVersion: sanitizeToken(manifest.schemaVersion || "unknown"),
    phase: sanitizeToken(manifest.phase || "unknown"),
    sourceCount: sources.length,
    imageCount: images.length,
    labelJobCount: labelJobs.length,
    approvalCounts: approvalCounts(sources),
    blockedReasons,
    crawlerEnabled: manifest.crawlerEnabled === true,
    downloadEnabled: manifest.downloadEnabled === true,
    cloudTeacherEnabled: manifest.cloudTeacherEnabled === true,
    trainingEnabled: manifest.trainingEnabled === true,
    runtimeIntegrationEnabled: manifest.runtimeIntegrationEnabled === true,
    rawImagesCommitted: manifest.rawImagesCommitted === true,
    productionReady: manifest.productionReady === true,
    manifestValid: blockedReasons.length === 0
  };
}

function manifestBoundaryBlockers(manifest) {
  const blockers = [];
  if (manifest.productionReady !== false) blockers.push("blocked_for_production_ready_not_false");
  if (manifest.crawlerEnabled !== false) blockers.push("blocked_for_crawler_enabled");
  if (manifest.downloadEnabled !== false) blockers.push("blocked_for_download_enabled");
  if (manifest.cloudTeacherEnabled !== false) blockers.push("blocked_for_cloud_teacher_enabled");
  if (manifest.trainingEnabled !== false) blockers.push("blocked_for_training_enabled");
  if (manifest.runtimeIntegrationEnabled !== false) blockers.push("blocked_for_runtime_integration_enabled");
  if (manifest.rawImagesCommitted !== false) blockers.push("blocked_for_raw_images_committed");
  return blockers;
}

function sourceBlockers(sources) {
  const blockers = [];
  const seenSourceIds = new Set();

  for (const source of sources) {
    blockers.push(...missingFieldBlockers(source, REQUIRED_SOURCE_FIELDS, "source"));
    if (seenSourceIds.has(source.sourceId)) {
      blockers.push(`blocked_for_duplicate_source_id_${sanitizeToken(source.sourceId)}`);
    }
    seenSourceIds.add(source.sourceId);

    if (BANNED_SOURCE_TYPES.includes(source.sourceType)) {
      blockers.push(`blocked_for_banned_source_type_${sanitizeToken(source.sourceType)}`);
    } else if (!ALLOWED_SOURCE_TYPES.includes(source.sourceType)) {
      blockers.push(`blocked_for_unsupported_source_type_${sanitizeToken(source.sourceType)}`);
    }
    if (!ALLOWED_LICENSE_STATUSES.includes(source.licenseStatus)) {
      blockers.push(`blocked_for_unsupported_license_status_${sanitizeToken(source.licenseStatus)}`);
    }
    if (!ALLOWED_LICENSE_TYPES.includes(source.licenseType)) {
      blockers.push(`blocked_for_unsupported_license_type_${sanitizeToken(source.licenseType)}`);
    }
    if (!ALLOWED_CONSENT_STATUSES.includes(source.consentStatus)) {
      blockers.push(`blocked_for_unsupported_consent_status_${sanitizeToken(source.consentStatus)}`);
    }
    if (!ALLOWED_APPROVAL_STATUSES.includes(source.approvalStatus)) {
      blockers.push(`blocked_for_unsupported_approval_status_${sanitizeToken(source.approvalStatus)}`);
    }
    if (!ALLOWED_REVIEW_STATUSES.includes(source.reviewStatus)) {
      blockers.push(`blocked_for_unsupported_review_status_${sanitizeToken(source.reviewStatus)}`);
    }

    blockers.push(...useFlagBlockers(source.allowedUses, `source_${sanitizeToken(source.sourceId)}`));
    if (source.allowedUses?.productRuntime === true) {
      blockers.push(`blocked_for_product_runtime_use_${sanitizeToken(source.sourceId)}`);
    }

    const approvedForUse = source.approvalStatus !== "draft" && source.approvalStatus !== "rejected";
    const pendingOrRejected =
      source.licenseStatus === "pending_review" ||
      source.licenseStatus === "rejected" ||
      source.consentStatus === "pending_review" ||
      source.consentStatus === "rejected" ||
      source.reviewStatus === "pending" ||
      source.reviewStatus === "rejected" ||
      source.approvalStatus === "rejected";

    if (pendingOrRejected && anyUseEnabled(source.allowedUses)) {
      blockers.push(`blocked_for_pending_or_rejected_source_use_${sanitizeToken(source.sourceId)}`);
    }
    if (source.allowedUses?.teacherLabeling === true && !approvedForUse) {
      blockers.push(`blocked_for_teacher_labeling_without_source_approval_${sanitizeToken(source.sourceId)}`);
    }
    if (
      source.allowedUses?.trainingCandidate === true &&
      !isTrainingApprovedSource(source)
    ) {
      blockers.push(`blocked_for_training_candidate_without_approved_license_consent_review_${sanitizeToken(source.sourceId)}`);
    }
  }

  return blockers;
}

function imageBlockers(images, sourceById) {
  const blockers = [];
  const seenImageIds = new Set();

  for (const image of images) {
    blockers.push(...missingFieldBlockers(image, REQUIRED_IMAGE_FIELDS, "image"));
    if (seenImageIds.has(image.imageId)) {
      blockers.push(`blocked_for_duplicate_image_id_${sanitizeToken(image.imageId)}`);
    }
    seenImageIds.add(image.imageId);

    const source = sourceById.get(image.sourceId);
    if (!source) {
      blockers.push(`blocked_for_unknown_image_source_${sanitizeToken(image.sourceId)}`);
    }
    if (!ALLOWED_ASSET_REF_TYPES.includes(image.assetRefType)) {
      blockers.push(`blocked_for_unsupported_asset_ref_type_${sanitizeToken(image.assetRefType)}`);
    }
    if (RAW_REF_PATTERNS.some((pattern) => pattern.test(String(image.assetRef || "")))) {
      blockers.push(`blocked_for_raw_or_external_asset_ref_${sanitizeToken(image.imageId)}`);
    }
    if (!ALLOWED_SPLITS.includes(image.split)) {
      blockers.push(`blocked_for_unsupported_split_${sanitizeToken(image.split)}`);
    }
    if (!ALLOWED_REVIEW_STATUSES.includes(image.privacyReviewStatus)) {
      blockers.push(`blocked_for_unsupported_privacy_review_status_${sanitizeToken(image.privacyReviewStatus)}`);
    }
    if (!["pending", "accepted", "rejected", "needs_human_review"].includes(image.labelReviewStatus)) {
      blockers.push(`blocked_for_unsupported_label_review_status_${sanitizeToken(image.labelReviewStatus)}`);
    }

    blockers.push(...useFlagBlockers(image.allowedUse, `image_${sanitizeToken(image.imageId)}`));
    if (image.allowedUse?.productRuntime === true) {
      blockers.push(`blocked_for_product_runtime_image_use_${sanitizeToken(image.imageId)}`);
    }
    if (anyUseEnabled(image.allowedUse) && image.privacyReviewStatus !== "approved") {
      blockers.push(`blocked_for_image_use_without_privacy_review_${sanitizeToken(image.imageId)}`);
    }
    if (anyUseEnabled(image.allowedUse) && !metadataRemoved(image.metadataStatus)) {
      blockers.push(`blocked_for_missing_metadata_removal_${sanitizeToken(image.imageId)}`);
    }
    if (image.allowedUse?.trainingCandidate === true) {
      if (!source || source.allowedUses?.trainingCandidate !== true || !isTrainingApprovedSource(source)) {
        blockers.push(`blocked_for_image_training_without_source_training_approval_${sanitizeToken(image.imageId)}`);
      }
      if (image.privacyReviewStatus !== "approved") {
        blockers.push(`blocked_for_image_training_without_privacy_review_${sanitizeToken(image.imageId)}`);
      }
    }
  }

  return blockers;
}

function labelJobBlockers(labelJobs, imageById, sourceById, validRegistryTags) {
  const blockers = [];
  const seenJobIds = new Set();

  for (const job of labelJobs) {
    blockers.push(...missingFieldBlockers(job, REQUIRED_LABEL_JOB_FIELDS, "label_job"));
    if (seenJobIds.has(job.jobId)) {
      blockers.push(`blocked_for_duplicate_label_job_id_${sanitizeToken(job.jobId)}`);
    }
    seenJobIds.add(job.jobId);

    const image = imageById.get(job.imageId);
    const source = image ? sourceById.get(image.sourceId) : null;
    if (!image) {
      blockers.push(`blocked_for_unknown_label_job_image_${sanitizeToken(job.imageId)}`);
    }
    if (!ALLOWED_LABEL_STATUSES.includes(job.status)) {
      blockers.push(`blocked_for_unsupported_label_job_status_${sanitizeToken(job.status)}`);
    }
    if (!Array.isArray(job.allowedTagSubset) || job.allowedTagSubset.length === 0) {
      blockers.push(`blocked_for_missing_allowed_tag_subset_${sanitizeToken(job.jobId)}`);
    } else {
      for (const tag of job.allowedTagSubset) {
        if (!validRegistryTags.has(tag)) {
          blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(tag)}`);
        }
      }
    }
    if (job.teacherLabelingAllowed === true) {
      if (!image?.allowedUse?.teacherLabeling || !source?.allowedUses?.teacherLabeling) {
        blockers.push(`blocked_for_teacher_labeling_without_manifest_approval_${sanitizeToken(job.jobId)}`);
      }
    }
    if (job.humanReviewRequired !== true) {
      blockers.push(`blocked_for_missing_human_review_requirement_${sanitizeToken(job.jobId)}`);
    }
  }

  return blockers;
}

function missingFieldBlockers(item, fields, prefix) {
  return fields
    .filter((field) => !(field in (item || {})))
    .map((field) => `blocked_for_missing_${prefix}_field_${field}`);
}

function useFlagBlockers(uses, bucket) {
  if (!uses || typeof uses !== "object") {
    return [`blocked_for_missing_allowed_uses_${bucket}`];
  }
  return REQUIRED_USE_FLAGS
    .filter((flag) => typeof uses[flag] !== "boolean")
    .map((flag) => `blocked_for_invalid_use_flag_${bucket}_${flag}`);
}

function metadataRemoved(metadataStatus) {
  if (!metadataStatus || typeof metadataStatus !== "object") return false;
  return REQUIRED_METADATA_FLAGS.every((flag) => {
    const value = metadataStatus[flag];
    return value === true || value === "not_applicable";
  });
}

function anyUseEnabled(uses = {}) {
  return REQUIRED_USE_FLAGS.some((flag) => uses[flag] === true);
}

function isTrainingApprovedSource(source) {
  return (
    source.approvalStatus === "approved_for_training_candidate" &&
    source.reviewStatus === "approved" &&
    ["owned", "consented", "approved_license"].includes(source.licenseStatus) &&
    ["owner_approved", "explicit_user_consent", "dataset_license_reviewed", "not_required_synthetic"].includes(
      source.consentStatus
    )
  );
}

function approvalCounts(sources) {
  return Object.fromEntries(
    ALLOWED_APPROVAL_STATUSES.map((status) => [
      status,
      sources.filter((source) => source.approvalStatus === status).length
    ])
  );
}

function forbiddenFieldBlockers(value, path = "manifest") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    if (isForbiddenFieldKey(key)) {
      blockers.push(`blocked_for_forbidden_field_${sanitizeToken(keyPath)}`);
    }
    if (nested && typeof nested === "object") {
      blockers.push(...forbiddenFieldBlockers(nested, keyPath));
    }
  }
  return blockers;
}

function isForbiddenFieldKey(key) {
  const normalized = String(key).toLowerCase();
  return (
    FORBIDDEN_EXACT_FIELDS.includes(normalized) ||
    FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalized.includes(fragment))
  );
}

function unique(values) {
  return [...new Set(values)];
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}
