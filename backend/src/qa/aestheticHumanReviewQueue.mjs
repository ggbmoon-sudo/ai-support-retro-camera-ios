import {
  ALLOWED_AESTHETIC_CATEGORIES,
  ALLOWED_FEATURE_KEYS,
  ALLOWED_SAFE_ACTION_KEYS,
  ALLOWED_SUPPRESSION_KEYS,
  ALLOWED_THRESHOLD_KEYS,
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";

export const AESTHETIC_HUMAN_REVIEW_QUEUE_SCHEMA_VERSION =
  "aesthetic_human_review_queue.v1";

export const ALLOWED_REVIEW_SOURCE_TYPES = Object.freeze([
  "teacher_label_candidate",
  "parameter_candidate",
  "manifest_issue",
  "safety_issue"
]);

export const ALLOWED_REVIEW_STATUS = Object.freeze([
  "pending",
  "accepted_for_calibration",
  "accepted_for_eval_only",
  "needs_more_review",
  "rejected",
  "blocked"
]);

export const ALLOWED_REVIEW_DECISIONS = Object.freeze([
  "accept_for_calibration",
  "accept_for_eval_only",
  "request_more_review",
  "reject",
  "block"
]);

export const ALLOWED_REVIEWER_ROLES = Object.freeze([
  "internal_reviewer",
  "qa_reviewer",
  "expert_reviewer",
  "safety_reviewer"
]);

const REQUIRED_REVIEW_ITEM_FIELDS = Object.freeze([
  "reviewItemId",
  "sourceType",
  "sourceId",
  "imageId",
  "jobId",
  "tag",
  "category",
  "candidateSummary",
  "evidenceKeys",
  "featureKeys",
  "thresholdKeys",
  "suppressionCandidates",
  "safeActionKey",
  "reviewStatus",
  "reviewRequired",
  "tuningEligible",
  "eligibleForAppRuntime",
  "appRuntimeTransferBlocked",
  "blockedReasons"
]);

const REQUIRED_REVIEW_DECISION_FIELDS = Object.freeze([
  "reviewItemId",
  "decision",
  "reviewerRole",
  "decisionReasonKey",
  "acceptedUse"
]);

const REQUIRED_ACCEPTED_USE_FIELDS = Object.freeze([
  "calibration",
  "evaluation",
  "tuningCandidate",
  "appRuntime"
]);

const DISABLED_FLAGS = Object.freeze([
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
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
  "chainofthought",
  "rawprompt",
  "prompttext",
  "providerpayload",
  "providerresponse",
  "rawresponse",
  "debugtext",
  "requestpayload",
  "modelname",
  "apikey",
  "secret",
  "uicopy",
  "displaycopy",
  "freeformcopy",
  "caption",
  "retake",
  "badphoto",
  "harsh"
]);

const FORBIDDEN_EXACT_FIELDS = Object.freeze([
  "age",
  "agebucket",
  "agelabel",
  "estimatedage",
  "rawimage",
  "imagebase64",
  "base64",
  "localfilepath",
  "filepath",
  "path",
  "url",
  "realurl",
  "gps",
  "exif",
  "userid",
  "useridentity",
  "providermodel",
  "model",
  "apikey",
  "api_key"
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
  /base64/i,
  /api[_-]?key/i,
  /secret/i
]);

const ALLOWED_SCHEMA_FIELD_NAMES = new Set(
  [
    ...REQUIRED_REVIEW_ITEM_FIELDS,
    ...REQUIRED_REVIEW_DECISION_FIELDS,
    ...REQUIRED_ACCEPTED_USE_FIELDS,
    ...DISABLED_FLAGS,
    "schemaVersion",
    "reviewItems",
    "reviewDecisions",
    "acceptedUse",
    "humanReviewRequired"
  ].map(normalizeFieldName)
);

export function aestheticHumanReviewQueueSample() {
  const registry = aestheticParameterRegistry();
  const calibrationItem = registry.items[1];
  const evalItem = registry.items[2];
  const rejectedItem = registry.items[3];
  const blockedItem = registry.items[4];

  return {
    schemaVersion: AESTHETIC_HUMAN_REVIEW_QUEUE_SCHEMA_VERSION,
    reviewItems: [
      reviewItemFromRegistryItem(calibrationItem, {
        reviewItemId: "review_item_calibration_001",
        sourceType: "parameter_candidate",
        sourceId: "candidate_synthetic_001",
        imageId: "img_synthetic_review_001",
        jobId: "job_synthetic_review_001"
      }),
      reviewItemFromRegistryItem(evalItem, {
        reviewItemId: "review_item_eval_001",
        sourceType: "teacher_label_candidate",
        sourceId: "teacher_label_synthetic_001",
        imageId: "img_synthetic_review_002",
        jobId: "job_synthetic_review_002"
      }),
      reviewItemFromRegistryItem(rejectedItem, {
        reviewItemId: "review_item_reject_001",
        sourceType: "manifest_issue",
        sourceId: "manifest_issue_synthetic_001",
        imageId: "img_synthetic_review_003",
        jobId: "job_synthetic_review_003"
      }),
      reviewItemFromRegistryItem(blockedItem, {
        reviewItemId: "review_item_block_001",
        sourceType: "safety_issue",
        sourceId: "safety_issue_synthetic_001",
        imageId: "img_synthetic_review_004",
        jobId: "job_synthetic_review_004",
        blockedReasons: ["blocked_for_safety_review_required"]
      })
    ],
    reviewDecisions: [
      {
        reviewItemId: "review_item_calibration_001",
        decision: "accept_for_calibration",
        reviewerRole: "expert_reviewer",
        decisionReasonKey: "review.reason.geometry_signal_consistent",
        acceptedUse: {
          calibration: true,
          evaluation: true,
          tuningCandidate: true,
          appRuntime: false
        }
      },
      {
        reviewItemId: "review_item_eval_001",
        decision: "accept_for_eval_only",
        reviewerRole: "qa_reviewer",
        decisionReasonKey: "review.reason.eval_only_candidate",
        acceptedUse: {
          calibration: false,
          evaluation: true,
          tuningCandidate: false,
          appRuntime: false
        }
      },
      {
        reviewItemId: "review_item_reject_001",
        decision: "reject",
        reviewerRole: "internal_reviewer",
        decisionReasonKey: "review.reason.manifest_issue_rejected",
        acceptedUse: {
          calibration: false,
          evaluation: false,
          tuningCandidate: false,
          appRuntime: false
        }
      },
      {
        reviewItemId: "review_item_block_001",
        decision: "block",
        reviewerRole: "safety_reviewer",
        decisionReasonKey: "review.reason.safety_blocked",
        acceptedUse: {
          calibration: false,
          evaluation: false,
          tuningCandidate: false,
          appRuntime: false
        }
      }
    ],
    humanReviewRequired: true,
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false
  };
}

export function evaluateAestheticHumanReviewQueue(input = aestheticHumanReviewQueueSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const reviewItems = Array.isArray(input.reviewItems) ? input.reviewItems : [];
  const reviewDecisions = Array.isArray(input.reviewDecisions) ? input.reviewDecisions : [];
  const decisionsByItemId = groupDecisionsByItemId(reviewDecisions);
  const globalBlockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...forbiddenShapeBlockers(input)
  ]);

  const itemBlockedReasons = reviewItems.flatMap((item) =>
    reviewItemBlockers(item, registryByTag)
  );
  const decisionBlockedReasons = reviewDecisions.flatMap((decision) =>
    reviewDecisionBlockers(decision, reviewItems, decisionsByItemId)
  );
  const blockedReasons = unique([
    ...globalBlockedReasons,
    ...itemBlockedReasons,
    ...decisionBlockedReasons
  ]);

  return {
    schemaVersion: AESTHETIC_HUMAN_REVIEW_QUEUE_SCHEMA_VERSION,
    reviewItemCount: reviewItems.length,
    acceptedForCalibrationCount: countDecisions(reviewDecisions, "accept_for_calibration"),
    acceptedForEvalOnlyCount: countDecisions(reviewDecisions, "accept_for_eval_only"),
    rejectedCount: countDecisions(reviewDecisions, "reject"),
    blockedCount: countDecisions(reviewDecisions, "block"),
    tuningCandidateCount: blockedReasons.length === 0
      ? reviewDecisions.filter((decision) => decision.acceptedUse?.tuningCandidate === true).length
      : 0,
    appRuntimeEligibleCount: 0,
    blockedReasons,
    humanReviewRequired: true,
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    reviewQueueValid: reviewItems.length > 0 && blockedReasons.length === 0
  };
}

function reviewItemFromRegistryItem(registryItem, overrides = {}) {
  return {
    reviewItemId: overrides.reviewItemId,
    sourceType: overrides.sourceType,
    sourceId: overrides.sourceId,
    imageId: overrides.imageId,
    jobId: overrides.jobId,
    tag: registryItem.tag,
    category: registryItem.category,
    candidateSummary: "geometry_bucket_candidate",
    evidenceKeys: registryItem.evidenceTypes,
    featureKeys: registryItem.featureKeys,
    thresholdKeys: registryItem.thresholdKeys,
    suppressionCandidates: registryItem.suppressionKeys,
    safeActionKey: registryItem.safeActionKey,
    reviewStatus: "pending",
    reviewRequired: true,
    tuningEligible: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    blockedReasons: overrides.blockedReasons || []
  };
}

function schemaBoundaryBlockers(input) {
  const blockers = [
    ...disabledFlagBlockers(input)
  ];

  if (input.schemaVersion !== AESTHETIC_HUMAN_REVIEW_QUEUE_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_review_queue_schema_version");
  }
  if (input.humanReviewRequired !== true) {
    blockers.push("blocked_for_queue_missing_human_review_requirement");
  }
  if (!Array.isArray(input.reviewItems) || input.reviewItems.length === 0) {
    blockers.push("blocked_for_missing_review_items");
  }
  if (!Array.isArray(input.reviewDecisions)) {
    blockers.push("blocked_for_missing_review_decisions");
  }

  return blockers;
}

function reviewItemBlockers(item, registryByTag) {
  const blockers = [
    ...missingFieldBlockers(item, REQUIRED_REVIEW_ITEM_FIELDS, "review_item"),
    ...unexpectedFieldBlockers(item, REQUIRED_REVIEW_ITEM_FIELDS, "review_item")
  ];
  const registryItem = registryByTag.get(item.tag);

  if (!ALLOWED_REVIEW_SOURCE_TYPES.includes(item.sourceType)) {
    blockers.push(`blocked_for_unsupported_review_source_type_${sanitizeToken(item.sourceType)}`);
  }
  if (!registryItem) {
    blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(item.tag)}`);
  } else {
    if (item.category !== registryItem.category || !ALLOWED_AESTHETIC_CATEGORIES.includes(item.category)) {
      blockers.push(`blocked_for_unsupported_category_${sanitizeToken(item.category)}`);
    }
    blockers.push(...unsupportedArrayValues("feature_key", item.featureKeys, ALLOWED_FEATURE_KEYS));
    blockers.push(...unsupportedArrayValues("threshold_key", item.thresholdKeys, ALLOWED_THRESHOLD_KEYS));
    blockers.push(...unsupportedArrayValues("suppression_candidate", item.suppressionCandidates, ALLOWED_SUPPRESSION_KEYS));
  }
  if (!ALLOWED_SAFE_ACTION_KEYS.includes(item.safeActionKey)) {
    blockers.push(`blocked_for_unsupported_safe_action_key_${sanitizeToken(item.safeActionKey)}`);
  }
  if (!Array.isArray(item.evidenceKeys) || item.evidenceKeys.length === 0) {
    blockers.push(`blocked_for_missing_evidence_keys_${sanitizeToken(item.tag)}`);
  }
  if (!ALLOWED_REVIEW_STATUS.includes(item.reviewStatus)) {
    blockers.push(`blocked_for_unsupported_review_status_${sanitizeToken(item.reviewStatus)}`);
  }
  if (item.reviewRequired !== true) {
    blockers.push("blocked_for_review_required_not_true");
  }
  if (item.tuningEligible !== false) {
    blockers.push("blocked_for_initial_tuning_eligible_not_false");
  }
  if (item.eligibleForAppRuntime !== false) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (item.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  if (!Array.isArray(item.blockedReasons)) {
    blockers.push("blocked_for_review_item_missing_blocked_reasons_array");
  }

  return blockers;
}

function reviewDecisionBlockers(decision, reviewItems, decisionsByItemId) {
  const blockers = [
    ...missingFieldBlockers(decision, REQUIRED_REVIEW_DECISION_FIELDS, "review_decision"),
    ...unexpectedFieldBlockers(decision, REQUIRED_REVIEW_DECISION_FIELDS, "review_decision")
  ];
  const item = reviewItems.find((reviewItem) => reviewItem.reviewItemId === decision.reviewItemId);
  const acceptedUse = decision.acceptedUse || {};

  if (!item) blockers.push(`blocked_for_decision_unknown_review_item_${sanitizeToken(decision.reviewItemId)}`);
  if (decisionsByItemId.get(decision.reviewItemId)?.length > 1) {
    blockers.push(`blocked_for_duplicate_decision_${sanitizeToken(decision.reviewItemId)}`);
  }
  if (!ALLOWED_REVIEW_DECISIONS.includes(decision.decision)) {
    blockers.push(`blocked_for_unsupported_review_decision_${sanitizeToken(decision.decision)}`);
  }
  if (!ALLOWED_REVIEWER_ROLES.includes(decision.reviewerRole)) {
    blockers.push(`blocked_for_unsupported_reviewer_role_${sanitizeToken(decision.reviewerRole)}`);
  }
  blockers.push(...acceptedUseBlockers(acceptedUse));

  if (acceptedUse.appRuntime === true) {
    blockers.push("blocked_for_app_runtime_accepted_use");
  }
  if (acceptedUse.tuningCandidate === true && decision.decision !== "accept_for_calibration") {
    blockers.push("blocked_for_tuning_candidate_without_calibration_acceptance");
  }
  if (["reject", "block"].includes(decision.decision) && acceptedUse.tuningCandidate === true) {
    blockers.push("blocked_for_rejected_or_blocked_tuning_candidate");
  }
  if (decision.decision === "accept_for_eval_only" && acceptedUse.evaluation !== true) {
    blockers.push("blocked_for_eval_acceptance_without_evaluation_use");
  }
  if (decision.decision === "accept_for_calibration" && acceptedUse.calibration !== true) {
    blockers.push("blocked_for_calibration_acceptance_without_calibration_use");
  }
  if (item?.sourceType === "safety_issue" && decision.reviewerRole !== "safety_reviewer") {
    blockers.push("blocked_for_safety_issue_without_safety_reviewer");
  }

  return blockers;
}

function acceptedUseBlockers(acceptedUse) {
  const blockers = [
    ...missingFieldBlockers(acceptedUse, REQUIRED_ACCEPTED_USE_FIELDS, "accepted_use"),
    ...unexpectedFieldBlockers(acceptedUse, REQUIRED_ACCEPTED_USE_FIELDS, "accepted_use")
  ];
  for (const field of REQUIRED_ACCEPTED_USE_FIELDS) {
    if (typeof acceptedUse[field] !== "boolean") {
      blockers.push(`blocked_for_accepted_use_${toSnake(field)}_not_boolean`);
    }
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "review_queue") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    const allowedSchemaKey = ALLOWED_SCHEMA_FIELD_NAMES.has(normalizedKey);
    if (!allowedSchemaKey && (
      FORBIDDEN_EXACT_FIELDS.includes(normalizedKey) ||
      FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))
    )) {
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

function groupDecisionsByItemId(decisions) {
  return decisions.reduce((groups, decision) => {
    const key = decision.reviewItemId;
    groups.set(key, [...(groups.get(key) || []), decision]);
    return groups;
  }, new Map());
}

function countDecisions(decisions, decisionValue) {
  return decisions.filter((decision) => decision.decision === decisionValue).length;
}

function missingFieldBlockers(value, requiredFields, path) {
  return requiredFields
    .filter((field) => !(field in (value || {})))
    .map((field) => `blocked_for_missing_${sanitizeToken(path)}_${sanitizeToken(field)}`);
}

function unexpectedFieldBlockers(value, allowedFields, path) {
  if (!value || typeof value !== "object") return [];
  return Object.keys(value)
    .filter((field) => !allowedFields.includes(field))
    .map((field) => `blocked_for_unexpected_${sanitizeToken(path)}_field_${sanitizeToken(field)}`);
}

function unsupportedArrayValues(kind, values, allowedValues) {
  if (!Array.isArray(values) || values.length === 0) {
    return [`blocked_for_missing_${kind}s`];
  }
  return values
    .filter((value) => !allowedValues.includes(value))
    .map((value) => `blocked_for_unsupported_${kind}_${sanitizeToken(value)}`);
}

function unique(values) {
  return [...new Set(values)];
}

function toSnake(value) {
  return String(value).replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function normalizeFieldName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}
