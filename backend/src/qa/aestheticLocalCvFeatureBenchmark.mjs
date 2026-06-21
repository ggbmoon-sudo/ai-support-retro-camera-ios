import {
  ALLOWED_FEATURE_KEYS,
  ALLOWED_SAFE_ACTION_KEYS,
  ALLOWED_SUPPRESSION_KEYS,
  ALLOWED_THRESHOLD_KEYS,
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";
import {
  aestheticParameterCandidateRunnerSample,
  runAestheticParameterCandidateDryRun
} from "./aestheticParameterCandidateRunner.mjs";
import {
  ALLOWED_REVIEW_STATUS,
  aestheticHumanReviewQueueSample,
  evaluateAestheticHumanReviewQueue
} from "./aestheticHumanReviewQueue.mjs";

export const AESTHETIC_LOCAL_CV_FEATURE_BENCHMARK_SCHEMA_VERSION =
  "aesthetic_local_cv_feature_benchmark_dry_run.v1";

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

const APP_TRANSFER_BLOCKED_REASONS = Object.freeze([
  "blocked_until_reviewed_benchmark_safety_performance_and_runtime_transfer_gates"
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
  "sensitive",
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
  "imagepath",
  "photopath",
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
    ...DISABLED_FLAGS,
    "schemaVersion",
    "featureVectors",
    "vectorId",
    "jobId",
    "imageId",
    "tag",
    "sourceType",
    "featureSignals",
    "thresholdSignals",
    "suppressionCandidates",
    "safeActionKey",
    "reviewStatus",
    "humanReviewRequired",
    "tuningCandidate",
    "eligibleForAppRuntime",
    "appRuntimeTransferBlocked",
    "blockedReasons",
    "candidateRunnerInput",
    "reviewQueueInput"
  ].map(normalizeFieldName)
);

export function aestheticLocalCvFeatureBenchmarkSample() {
  return {
    featureVectors: [
      {
        vectorId: "cv_vector_synthetic_headroom_001",
        jobId: "job_synthetic_review_001",
        imageId: "img_synthetic_review_001",
        tag: "ERR_COMP_EXCESSIVE_HEADROOM",
        sourceType: "synthetic_inline_numeric_features",
        featureSignals: {
          headroomRatio: 0.42
        },
        thresholdSignals: ["headroom_soft_high"],
        suppressionCandidates: ["intentional_negative_space"],
        safeActionKey: "leave_less_empty_air_above",
        reviewStatus: "accepted_for_calibration",
        humanReviewRequired: true,
        tuningCandidate: true,
        eligibleForAppRuntime: false,
        appRuntimeTransferBlocked: true
      },
      {
        vectorId: "cv_vector_synthetic_horizon_001",
        jobId: "job_synthetic_review_002",
        imageId: "img_synthetic_review_002",
        tag: "ERR_COMP_HORIZON_TILT",
        sourceType: "synthetic_inline_numeric_features",
        featureSignals: {
          horizonAngle: 3.5
        },
        thresholdSignals: ["horizon_tilt_soft"],
        suppressionCandidates: ["intentional_dutch_angle"],
        safeActionKey: "level_frame_softly",
        reviewStatus: "accepted_for_eval_only",
        humanReviewRequired: true,
        tuningCandidate: false,
        eligibleForAppRuntime: false,
        appRuntimeTransferBlocked: true
      },
      {
        vectorId: "cv_vector_synthetic_rule_of_thirds_001",
        jobId: "job_synthetic_teacher_stub_001",
        imageId: "img_synthetic_teacher_stub_001",
        tag: "ERR_COMP_RULE_OF_THIRDS_MISS",
        sourceType: "synthetic_inline_numeric_features",
        featureSignals: {
          subjectAnchor: 0.33,
          visualWeightMoment: 0.67
        },
        thresholdSignals: ["visual_weight_imbalance_soft"],
        suppressionCandidates: ["intentional_centering"],
        safeActionKey: "keep_if_intentional",
        reviewStatus: "pending",
        humanReviewRequired: true,
        tuningCandidate: false,
        eligibleForAppRuntime: false,
        appRuntimeTransferBlocked: true
      }
    ],
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

export function runAestheticLocalCvFeatureBenchmark(input = aestheticLocalCvFeatureBenchmarkSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const candidateInput = input.candidateRunnerInput || aestheticParameterCandidateRunnerSample();
  const reviewQueueInput = input.reviewQueueInput || aestheticHumanReviewQueueSample();
  const candidateReport = runAestheticParameterCandidateDryRun(candidateInput);
  const reviewQueueReport = evaluateAestheticHumanReviewQueue(reviewQueueInput);
  const featureVectors = Array.isArray(input.featureVectors) ? input.featureVectors : [];
  const candidateTags = new Set(Object.keys(candidateReport.tagCounts || {}));
  const reviewedUsesByTag = acceptedUsesByTag(reviewQueueInput);
  const globalBlockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...(candidateReport.dryRunValid
      ? []
      : candidateReport.blockedReasons.map((reason) => `blocked_for_candidate_runner_${reason}`)),
    ...(reviewQueueReport.reviewQueueValid
      ? []
      : reviewQueueReport.blockedReasons.map((reason) => `blocked_for_review_queue_${reason}`)),
    ...forbiddenShapeBlockers(input)
  ]);

  const vectorResults = featureVectors.map((vector) =>
    evaluateFeatureVector(vector, registryByTag, candidateTags, reviewedUsesByTag)
  );
  const blockedReasons = unique([
    ...globalBlockedReasons,
    ...vectorResults.flatMap((result) => result.hardBlockedReasons)
  ]);
  const acceptedVectorResults = blockedReasons.length === 0
    ? vectorResults.filter((result) => result.acceptedForBenchmark)
    : [];
  const rejectedVectorResults = blockedReasons.length === 0
    ? vectorResults.filter((result) => !result.acceptedForBenchmark)
    : vectorResults;

  return {
    schemaVersion: AESTHETIC_LOCAL_CV_FEATURE_BENCHMARK_SCHEMA_VERSION,
    runMode: "local_cv_feature_benchmark_dry_run",
    featureVectorCount: featureVectors.length,
    acceptedVectorCount: acceptedVectorResults.length,
    rejectedVectorCount: rejectedVectorResults.length,
    tagBenchmarkCounts: countBy(vectorResults, "tag"),
    featureKeyCounts: countFeatureKeys(acceptedVectorResults),
    thresholdSignalCounts: countArrayValues(acceptedVectorResults, "thresholdSignals"),
    suppressionSignalCounts: countArrayValues(acceptedVectorResults, "suppressionCandidates"),
    blockedReasons,
    benchmarkSummary: {
      candidateTagCount: candidateTags.size,
      reviewedTagCount: reviewedUsesByTag.size,
      tuningCandidateVectorCount: acceptedVectorResults.filter((result) => result.tuningCandidate === true).length,
      evalOnlyVectorCount: acceptedVectorResults.filter((result) => result.acceptedUse?.evaluation === true && result.acceptedUse?.tuningCandidate !== true).length,
      rejectedVectorReasons: rejectedVectorResults.flatMap((result) => result.rejectedReasons)
    },
    appTransferReadiness: {
      eligibleForParameterTuning: false,
      eligibleForAppRuntime: false,
      requiresHumanReview: true,
      requiresBenchmark: true,
      requiresSafetyGate: true,
      requiresPerformanceGate: true,
      appRuntimeTransferBlocked: true,
      blockedReasons: APP_TRANSFER_BLOCKED_REASONS
    },
    imageReadsPerformed: false,
    networkCallsMade: false,
    providerConfigured: false,
    cloudTeacherEnabled: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false,
    benchmarkValid: featureVectors.length > 0 && blockedReasons.length === 0
  };
}

function evaluateFeatureVector(vector, registryByTag, candidateTags, reviewedUsesByTag) {
  const registryItem = registryByTag.get(vector.tag);
  const hardBlockedReasons = [
    ...missingFieldBlockers(vector, [
      "vectorId",
      "jobId",
      "imageId",
      "tag",
      "sourceType",
      "featureSignals",
      "thresholdSignals",
      "suppressionCandidates",
      "safeActionKey",
      "reviewStatus",
      "humanReviewRequired",
      "tuningCandidate",
      "eligibleForAppRuntime",
      "appRuntimeTransferBlocked"
    ], "feature_vector"),
    ...featureVectorBoundaryBlockers(vector)
  ];

  if (!registryItem) {
    hardBlockedReasons.push(`blocked_for_unknown_registry_tag_${sanitizeToken(vector.tag)}`);
  } else {
    hardBlockedReasons.push(...featureSignalBlockers(vector.featureSignals, registryItem));
    hardBlockedReasons.push(...unsupportedArrayValues(
      "threshold_signal",
      vector.thresholdSignals,
      ALLOWED_THRESHOLD_KEYS,
      registryItem.thresholdKeys
    ));
    hardBlockedReasons.push(...unsupportedArrayValues(
      "suppression_candidate",
      vector.suppressionCandidates,
      ALLOWED_SUPPRESSION_KEYS,
      registryItem.suppressionKeys
    ));
    if (!ALLOWED_SAFE_ACTION_KEYS.includes(vector.safeActionKey)) {
      hardBlockedReasons.push(`blocked_for_unsupported_safe_action_key_${sanitizeToken(vector.safeActionKey)}`);
    } else if (vector.safeActionKey !== registryItem.safeActionKey) {
      hardBlockedReasons.push(`blocked_for_safe_action_key_not_registered_for_tag_${sanitizeToken(vector.safeActionKey)}`);
    }
  }

  const acceptedUse = reviewedUsesByTag.get(vector.tag);
  const rejectedReasons = [];
  if (!candidateTags.has(vector.tag)) {
    rejectedReasons.push(`rejected_for_missing_parameter_candidate_${sanitizeToken(vector.tag)}`);
  }
  if (!acceptedUse || (acceptedUse.calibration !== true && acceptedUse.evaluation !== true)) {
    rejectedReasons.push(`rejected_for_missing_accepted_review_decision_${sanitizeToken(vector.tag)}`);
  }
  if (vector.tuningCandidate === true && acceptedUse?.tuningCandidate !== true) {
    hardBlockedReasons.push(`blocked_for_tuning_candidate_without_calibration_acceptance_${sanitizeToken(vector.tag)}`);
  }

  return {
    vectorId: sanitizeToken(vector.vectorId),
    tag: sanitizeToken(vector.tag),
    featureKeys: Object.keys(vector.featureSignals || {}).map(sanitizeToken),
    thresholdSignals: Array.isArray(vector.thresholdSignals) ? vector.thresholdSignals.map(sanitizeToken) : [],
    suppressionCandidates: Array.isArray(vector.suppressionCandidates) ? vector.suppressionCandidates.map(sanitizeToken) : [],
    safeActionKey: sanitizeToken(vector.safeActionKey),
    reviewStatus: sanitizeToken(vector.reviewStatus),
    tuningCandidate: vector.tuningCandidate === true,
    acceptedUse,
    hardBlockedReasons,
    rejectedReasons,
    acceptedForBenchmark: hardBlockedReasons.length === 0 && rejectedReasons.length === 0
  };
}

function acceptedUsesByTag(reviewQueueInput) {
  const reviewItems = Array.isArray(reviewQueueInput.reviewItems) ? reviewQueueInput.reviewItems : [];
  const reviewDecisions = Array.isArray(reviewQueueInput.reviewDecisions) ? reviewQueueInput.reviewDecisions : [];
  const itemById = new Map(reviewItems.map((item) => [item.reviewItemId, item]));
  const uses = new Map();

  for (const decision of reviewDecisions) {
    const item = itemById.get(decision.reviewItemId);
    if (!item || !decision.acceptedUse) continue;
    uses.set(item.tag, {
      calibration: decision.acceptedUse.calibration === true,
      evaluation: decision.acceptedUse.evaluation === true,
      tuningCandidate: decision.acceptedUse.tuningCandidate === true,
      appRuntime: decision.acceptedUse.appRuntime === true,
      decision: sanitizeToken(decision.decision)
    });
  }

  return uses;
}

function schemaBoundaryBlockers(input) {
  const blockers = disabledFlagBlockers(input);
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (input.appRuntimeTransferBlocked === false) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  if (!Array.isArray(input.featureVectors) || input.featureVectors.length === 0) {
    blockers.push("blocked_for_missing_feature_vectors");
  }
  return blockers;
}

function featureVectorBoundaryBlockers(vector) {
  const blockers = [];
  if (vector.sourceType !== "synthetic_inline_numeric_features") {
    blockers.push(`blocked_for_unsupported_source_type_${sanitizeToken(vector.sourceType)}`);
  }
  if (!ALLOWED_REVIEW_STATUS.includes(vector.reviewStatus)) {
    blockers.push(`blocked_for_unsupported_review_status_${sanitizeToken(vector.reviewStatus)}`);
  }
  if (vector.humanReviewRequired !== true) {
    blockers.push("blocked_for_human_review_required_not_true");
  }
  if (typeof vector.tuningCandidate !== "boolean") {
    blockers.push("blocked_for_tuning_candidate_not_boolean");
  }
  if (vector.eligibleForAppRuntime !== false) {
    blockers.push("blocked_for_vector_app_runtime_eligibility");
  }
  if (vector.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_vector_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function featureSignalBlockers(featureSignals, registryItem) {
  if (!featureSignals || typeof featureSignals !== "object" || Array.isArray(featureSignals)) {
    return ["blocked_for_missing_feature_signals"];
  }
  const blockers = [];
  const featureKeys = Object.keys(featureSignals);
  if (featureKeys.length === 0) blockers.push("blocked_for_empty_feature_signals");
  for (const [featureKey, value] of Object.entries(featureSignals)) {
    if (!ALLOWED_FEATURE_KEYS.includes(featureKey)) {
      blockers.push(`blocked_for_unknown_feature_key_${sanitizeToken(featureKey)}`);
    } else if (!registryItem.featureKeys.includes(featureKey)) {
      blockers.push(`blocked_for_feature_key_not_registered_for_tag_${sanitizeToken(featureKey)}`);
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      blockers.push(`blocked_for_non_numeric_feature_signal_${sanitizeToken(featureKey)}`);
    }
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "local_cv_feature_benchmark") {
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

function unsupportedArrayValues(kind, values, globalAllowedValues, tagAllowedValues) {
  if (!Array.isArray(values) || values.length === 0) {
    return [`blocked_for_missing_${kind}s`];
  }
  const blockers = [];
  for (const value of values) {
    if (!globalAllowedValues.includes(value)) {
      blockers.push(`blocked_for_unknown_${kind}_${sanitizeToken(value)}`);
    } else if (!tagAllowedValues.includes(value)) {
      blockers.push(`blocked_for_${kind}_not_registered_for_tag_${sanitizeToken(value)}`);
    }
  }
  return blockers;
}

function missingFieldBlockers(value, requiredFields, path) {
  return requiredFields
    .filter((field) => !(field in (value || {})))
    .map((field) => `blocked_for_missing_${sanitizeToken(path)}_${sanitizeToken(field)}`);
}

function countBy(items, field) {
  return items.reduce((counts, item) => {
    const key = item[field];
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function countFeatureKeys(items) {
  return items.reduce((counts, item) => {
    for (const featureKey of item.featureKeys || []) {
      counts[featureKey] = (counts[featureKey] || 0) + 1;
    }
    return counts;
  }, {});
}

function countArrayValues(items, field) {
  return items.reduce((counts, item) => {
    for (const value of item[field] || []) {
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }, {});
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
