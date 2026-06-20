import {
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";
import {
  AESTHETIC_DATASET_MANIFEST_SCHEMA_VERSION,
  evaluateAestheticDatasetManifest
} from "./aestheticDatasetManifestSchema.mjs";

export const AESTHETIC_PARAMETER_MINING_BOT_DRY_RUN_SCHEMA_VERSION =
  "aesthetic_parameter_mining_bot_dry_run.v1";

const DISABLED_FLAGS = Object.freeze([
  "crawlerEnabled",
  "downloadEnabled",
  "cloudTeacherEnabled",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
]);

const FORBIDDEN_FIELD_FRAGMENTS = Object.freeze([
  "provider",
  "apikey",
  "secret",
  "token",
  "rawprompt",
  "prompttext",
  "rawresponse",
  "providerresponse",
  "requestpayload",
  "base64",
  "url",
  "path",
  "config"
]);

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
  /local[_-]?config/i
]);

export function aestheticParameterMiningBotDryRunSample() {
  const registry = aestheticParameterRegistry();
  return {
    schemaVersion: AESTHETIC_DATASET_MANIFEST_SCHEMA_VERSION,
    phase: "Phase OD-R3",
    productionReady: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    cloudTeacherEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    rawImagesCommitted: false,
    sources: [
      {
        sourceId: "src_synthetic_teacher_stub_001",
        sourceType: "synthetic",
        displayNameKey: "source.synthetic.teacher_stub.001",
        licenseStatus: "owned",
        licenseType: "synthetic_generated",
        consentStatus: "not_required_synthetic",
        allowedUses: {
          evaluation: true,
          teacherLabeling: true,
          trainingCandidate: false,
          productRuntime: false
        },
        approvalStatus: "approved_for_teacher_labeling",
        metadataPolicy: {
          stripGps: true,
          stripExif: true,
          stripCameraSerial: true,
          stripRawSensorData: true
        },
        retentionPolicy: {
          retentionBucket: "manifest_only_no_asset_commit",
          deletionPolicyKey: "retention.synthetic.teacher_stub.only"
        },
        reviewStatus: "approved",
        notesKey: "notes.synthetic.teacher_stub.safe"
      }
    ],
    images: [
      {
        imageId: "img_synthetic_teacher_stub_001",
        sourceId: "src_synthetic_teacher_stub_001",
        assetRefType: "synthetic_stub",
        assetRef: "synthetic_stub:odr3:001",
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
          teacherLabeling: true,
          trainingCandidate: false,
          productRuntime: false
        },
        notesKey: "notes.image.synthetic.teacher_stub"
      }
    ],
    labelJobs: [
      {
        jobId: "job_synthetic_teacher_stub_001",
        imageId: "img_synthetic_teacher_stub_001",
        registryVersion: registry.registryVersion,
        allowedTagSubset: [
          "ERR_COMP_RULE_OF_THIRDS_MISS",
          "ERR_COMP_EXCESSIVE_HEADROOM",
          "ERR_DEPTH_SUBJECT_BACKGROUND_MERGER"
        ],
        teacherLabelingAllowed: true,
        humanReviewRequired: true,
        status: "ready_for_teacher_stub"
      }
    ]
  };
}

export function runAestheticParameterMiningBotDryRun(input = aestheticParameterMiningBotDryRunSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const manifest = normalizeInput(input);
  const manifestReport = evaluateAestheticDatasetManifest(manifest);
  const sources = Array.isArray(manifest.sources) ? manifest.sources : [];
  const images = Array.isArray(manifest.images) ? manifest.images : [];
  const labelJobs = Array.isArray(manifest.labelJobs) ? manifest.labelJobs : [];
  const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
  const imageById = new Map(images.map((image) => [image.imageId, image]));
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const requestedTagSubset = Array.isArray(manifest.requestedTagSubset)
    ? manifest.requestedTagSubset
    : null;

  const globalBlockedReasons = unique([
    ...disabledFlagBlockers(manifest),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...manifestReport.blockedReasons.map((reason) => `blocked_for_manifest_${reason}`),
    ...forbiddenShapeBlockers(manifest),
    ...unknownRequestedTagBlockers(requestedTagSubset, registryByTag)
  ]);

  const jobPlan = labelJobs.map((job) => {
    const image = imageById.get(job.imageId);
    const source = image ? sourceById.get(image.sourceId) : null;
    const allowedTagSubset = sanitizedAllowedTagSubset(job.allowedTagSubset, requestedTagSubset, registryByTag);
    const blockedReasons = unique([
      ...globalBlockedReasons,
      ...jobEligibilityBlockers(job, image, source, registryByTag, requestedTagSubset)
    ]);

    return {
      jobId: sanitizeToken(job.jobId || "unknown_job"),
      imageId: sanitizeToken(job.imageId || "unknown_image"),
      sourceId: sanitizeToken(source?.sourceId || image?.sourceId || "unknown_source"),
      assetRefType: sanitizeToken(image?.assetRefType || "unknown"),
      assetRefBucket: assetRefBucket(image),
      allowedTagSubset,
      humanReviewRequired: true,
      teacherMode: "stub_only",
      status: blockedReasons.length === 0 ? "eligible_for_teacher_stub_dry_run" : "blocked",
      blockedReasons
    };
  });

  const eligiblePlans = jobPlan.filter((job) => job.status === "eligible_for_teacher_stub_dry_run");
  const eligibleTags = eligiblePlans.flatMap((job) => job.allowedTagSubset);

  return {
    schemaVersion: AESTHETIC_PARAMETER_MINING_BOT_DRY_RUN_SCHEMA_VERSION,
    registryVersion: sanitizeToken(registry.registryVersion),
    sourceCount: sources.length,
    imageCount: images.length,
    requestedJobCount: labelJobs.length,
    eligibleJobCount: eligiblePlans.length,
    blockedJobCount: jobPlan.length - eligiblePlans.length,
    categoryCounts: categoryCounts(eligibleTags, registryByTag),
    tagCounts: tagCounts(eligibleTags, registryByTag),
    blockedReasons: unique(jobPlan.flatMap((job) => job.blockedReasons)),
    jobPlan,
    crawlerEnabled: false,
    downloadEnabled: false,
    cloudTeacherEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    imageReadsPerformed: false,
    networkCallsMade: false,
    rawImagesCommitted: false,
    productionReady: false,
    dryRunValid: jobPlan.length > 0 && jobPlan.every((job) => job.blockedReasons.length === 0)
  };
}

function normalizeInput(input) {
  return {
    ...input,
    sources: Array.isArray(input.sources) ? input.sources : [],
    images: Array.isArray(input.images) ? input.images : [],
    labelJobs: Array.isArray(input.labelJobs) ? input.labelJobs : []
  };
}

function disabledFlagBlockers(manifest) {
  return DISABLED_FLAGS
    .filter((flag) => manifest[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function jobEligibilityBlockers(job, image, source, registryByTag, requestedTagSubset) {
  const blockers = [];

  if (!image) blockers.push(`blocked_for_unknown_job_image_${sanitizeToken(job.imageId)}`);
  if (!source) blockers.push(`blocked_for_unknown_job_source_${sanitizeToken(job.imageId)}`);
  if (source && source.approvalStatus !== "approved_for_teacher_labeling") {
    blockers.push(`blocked_for_source_not_approved_for_teacher_stub_${sanitizeToken(source.sourceId)}`);
  }
  if (source && source.reviewStatus !== "approved") {
    blockers.push(`blocked_for_source_review_not_approved_${sanitizeToken(source.sourceId)}`);
  }
  if (source && source.allowedUses?.teacherLabeling !== true) {
    blockers.push(`blocked_for_source_teacher_labeling_not_allowed_${sanitizeToken(source.sourceId)}`);
  }
  if (image && image.allowedUse?.teacherLabeling !== true) {
    blockers.push(`blocked_for_image_teacher_labeling_not_allowed_${sanitizeToken(image.imageId)}`);
  }
  if (image && image.privacyReviewStatus !== "approved") {
    blockers.push(`blocked_for_image_privacy_review_not_approved_${sanitizeToken(image.imageId)}`);
  }
  if (image && !metadataRemoved(image.metadataStatus)) {
    blockers.push(`blocked_for_missing_metadata_removal_${sanitizeToken(image.imageId)}`);
  }
  if (image && RAW_VALUE_PATTERNS.some((pattern) => pattern.test(String(image.assetRef || "")))) {
    blockers.push(`blocked_for_raw_or_external_asset_ref_${sanitizeToken(image.imageId)}`);
  }
  if (job.teacherLabelingAllowed !== true) {
    blockers.push(`blocked_for_teacher_stub_not_allowed_${sanitizeToken(job.jobId)}`);
  }
  if (job.humanReviewRequired !== true) {
    blockers.push(`blocked_for_missing_human_review_requirement_${sanitizeToken(job.jobId)}`);
  }
  if (job.status !== "ready_for_teacher_stub") {
    blockers.push(`blocked_for_job_not_ready_for_teacher_stub_${sanitizeToken(job.jobId)}`);
  }

  const tags = Array.isArray(job.allowedTagSubset) ? job.allowedTagSubset : [];
  if (tags.length === 0) {
    blockers.push(`blocked_for_empty_allowed_tag_subset_${sanitizeToken(job.jobId)}`);
  }
  for (const tag of tags) {
    if (!registryByTag.has(tag)) {
      blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(tag)}`);
    }
    if (requestedTagSubset && !requestedTagSubset.includes(tag)) {
      blockers.push(`blocked_for_tag_outside_requested_subset_${sanitizeToken(tag)}`);
    }
  }

  return blockers;
}

function sanitizedAllowedTagSubset(jobTags, requestedTagSubset, registryByTag) {
  const tags = Array.isArray(jobTags) ? jobTags : [];
  return tags
    .filter((tag) => registryByTag.has(tag))
    .filter((tag) => !requestedTagSubset || requestedTagSubset.includes(tag))
    .map(sanitizeToken);
}

function unknownRequestedTagBlockers(tags, registryByTag) {
  if (!tags) return [];
  if (tags.length === 0) return ["blocked_for_empty_requested_tag_subset"];
  return tags
    .filter((tag) => !registryByTag.has(tag))
    .map((tag) => `blocked_for_unknown_requested_registry_tag_${sanitizeToken(tag)}`);
}

function forbiddenShapeBlockers(value, path = "input") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = String(key).toLowerCase();
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

function assetRefBucket(image) {
  if (!image) return "unknown";
  if (image.assetRefType === "synthetic_stub") return "synthetic_stub";
  if (image.assetRefType === "approved_dataset_id") return "approved_dataset_id";
  if (image.assetRefType === "redacted_external_id") return "redacted_external_id";
  if (image.assetRefType === "owned_local_ignored" || image.assetRefType === "consented_local_ignored") {
    return "local_ignored_reference";
  }
  return "unknown";
}

function categoryCounts(tags, registryByTag) {
  const counts = {};
  for (const tag of tags) {
    const category = registryByTag.get(tag)?.category;
    if (category) counts[category] = (counts[category] || 0) + 1;
  }
  return counts;
}

function tagCounts(tags, registryByTag) {
  const counts = {};
  for (const tag of tags) {
    if (registryByTag.has(tag)) counts[tag] = (counts[tag] || 0) + 1;
  }
  return counts;
}

function metadataRemoved(metadataStatus) {
  if (!metadataStatus || typeof metadataStatus !== "object") return false;
  return ["gpsRemoved", "exifRemoved", "cameraSerialRemoved", "rawSensorDataRemoved"].every((flag) => {
    const value = metadataStatus[flag];
    return value === true || value === "not_applicable";
  });
}

function toSnake(value) {
  return String(value).replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function unique(values) {
  return [...new Set(values)];
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}
