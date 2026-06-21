import {
  ALLOWED_FEATURE_KEYS,
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";
import {
  aestheticLocalCvFeatureBenchmarkSample,
  runAestheticLocalCvFeatureBenchmark
} from "./aestheticLocalCvFeatureBenchmark.mjs";

export const AESTHETIC_LOCAL_CV_FEATURE_EXTRACTOR_SCHEMA_VERSION =
  "aesthetic_local_cv_feature_extractor_prototype.v1";

const DISABLED_FLAGS = Object.freeze([
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
  "cvInferencePerformed",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "fineTuningEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
]);

const ALLOWED_OBSERVATION_SOURCE_TYPE = "synthetic_inline_local_cv_observation";

const ALLOWED_MEASUREMENT_KEYS = Object.freeze([
  "headroomRatio",
  "horizonAngle",
  "highlightClipRatio",
  "edgeMargin",
  "backgroundObjectDensity",
  "sharpnessRatio",
  "subjectAnchor",
  "visualWeightMoment"
]);

const ALLOWED_SUBJECT_ANCHOR_BUCKETS = Object.freeze([
  "center",
  "left_third",
  "right_third",
  "upper_center",
  "lower_center",
  "unknown"
]);

const ALLOWED_VISUAL_WEIGHT_BUCKETS = Object.freeze([
  "balanced",
  "left_heavy",
  "right_heavy",
  "top_heavy",
  "bottom_heavy",
  "unknown"
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
  "harsh",
  "rawteacher",
  "teachertext",
  "xiaoyi",
  "relaycredential"
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
    "extractorRunMode",
    "syntheticObservations",
    "observationId",
    "jobId",
    "imageId",
    "sourceType",
    "measurements",
    "subjectAnchorBucket",
    "visualWeightMomentBucket",
    "eligibleForAppRuntime",
    "appRuntimeTransferBlocked"
  ].map(normalizeFieldName)
);

export function aestheticLocalCvFeatureExtractorPrototypeSample() {
  return {
    schemaVersion: AESTHETIC_LOCAL_CV_FEATURE_EXTRACTOR_SCHEMA_VERSION,
    extractorRunMode: "synthetic_feature_extractor_prototype",
    syntheticObservations: [
      {
        observationId: "local_cv_observation_synthetic_headroom_001",
        jobId: "job_synthetic_review_001",
        imageId: "img_synthetic_review_001",
        sourceType: ALLOWED_OBSERVATION_SOURCE_TYPE,
        measurements: {
          headroomRatio: 0.42,
          edgeMargin: 0.22,
          sharpnessRatio: 0.72
        },
        subjectAnchorBucket: "upper_center",
        visualWeightMomentBucket: "balanced"
      },
      {
        observationId: "local_cv_observation_synthetic_horizon_001",
        jobId: "job_synthetic_review_002",
        imageId: "img_synthetic_review_002",
        sourceType: ALLOWED_OBSERVATION_SOURCE_TYPE,
        measurements: {
          horizonAngle: 3.5,
          highlightClipRatio: 0.08
        },
        subjectAnchorBucket: "center",
        visualWeightMomentBucket: "balanced"
      },
      {
        observationId: "local_cv_observation_synthetic_weight_001",
        jobId: "job_synthetic_teacher_stub_001",
        imageId: "img_synthetic_teacher_stub_001",
        sourceType: ALLOWED_OBSERVATION_SOURCE_TYPE,
        measurements: {
          subjectAnchor: 0.33,
          visualWeightMoment: 0.67,
          backgroundObjectDensity: 0.72,
          highlightClipRatio: 0.22
        },
        subjectAnchorBucket: "left_third",
        visualWeightMomentBucket: "right_heavy"
      }
    ],
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    fineTuningEnabled: false,
    runtimeIntegrationEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false
  };
}

export function runAestheticLocalCvFeatureExtractorPrototype(
  input = aestheticLocalCvFeatureExtractorPrototypeSample()
) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const observations = Array.isArray(input.syntheticObservations) ? input.syntheticObservations : [];
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...observations.flatMap((observation) => observationBlockers(observation)),
    ...forbiddenShapeBlockers(input)
  ]);
  const featureVectors = blockedReasons.length === 0
    ? observations.flatMap((observation) => vectorsFromObservation(observation, registryByTag))
    : [];
  const benchmarkReport = runAestheticLocalCvFeatureBenchmark({
    ...aestheticLocalCvFeatureBenchmarkSample(),
    featureVectors,
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false
  });
  const compatibilityBlockedReasons = featureVectors.length > 0 && !benchmarkReport.benchmarkValid
    ? benchmarkReport.blockedReasons.map((reason) => `blocked_for_benchmark_${reason}`)
    : [];
  const allBlockedReasons = unique([...blockedReasons, ...compatibilityBlockedReasons]);
  const extractorPrototypeValid = observations.length > 0 &&
    featureVectors.length > 0 &&
    allBlockedReasons.length === 0;

  return {
    schemaVersion: AESTHETIC_LOCAL_CV_FEATURE_EXTRACTOR_SCHEMA_VERSION,
    runMode: "local_cv_feature_extractor_prototype",
    extractorPrototypeValid,
    inputObservationCount: observations.length,
    outputFeatureVectorCount: extractorPrototypeValid ? featureVectors.length : 0,
    featureVectors: extractorPrototypeValid ? featureVectors : [],
    extractionSummary: {
      featureKeyCounts: extractorPrototypeValid ? countFeatureKeys(featureVectors) : {},
      emittedTagCounts: extractorPrototypeValid ? countBy(featureVectors, "tag") : {},
      subjectAnchorBucketCounts: countBy(observations, "subjectAnchorBucket"),
      visualWeightMomentBucketCounts: countBy(observations, "visualWeightMomentBucket"),
      benchmarkCompatible: extractorPrototypeValid && benchmarkReport.benchmarkValid,
      benchmarkAcceptedVectorCount: extractorPrototypeValid ? benchmarkReport.acceptedVectorCount : 0,
      benchmarkRejectedVectorCount: extractorPrototypeValid ? benchmarkReport.rejectedVectorCount : 0
    },
    blockedReasons: allBlockedReasons,
    appTransferReadiness: {
      eligibleForParameterTuning: false,
      eligibleForAppRuntime: false,
      requiresHumanReview: true,
      requiresBenchmark: true,
      requiresSafetyGate: true,
      requiresPerformanceGate: true,
      appRuntimeTransferBlocked: true,
      blockedReasons: ["blocked_until_od_r8_od_p_benchmark_safety_and_runtime_transfer_gates"]
    },
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    fineTuningEnabled: false,
    runtimeIntegrationEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false
  };
}

function vectorsFromObservation(observation, registryByTag) {
  const vectors = [];
  const measurements = observation.measurements || {};
  const pushVector = (tag, featureSignals, thresholdSignals, suppressionCandidates, safeActionKey, reviewStatus, tuningCandidate) => {
    if (!registryByTag.has(tag)) return;
    vectors.push({
      vectorId: sanitizeToken(`cv_vector_${observation.observationId}_${tag.toLowerCase()}`),
      jobId: sanitizeToken(observation.jobId),
      imageId: sanitizeToken(observation.imageId),
      tag,
      sourceType: "synthetic_inline_numeric_features",
      featureSignals,
      thresholdSignals,
      suppressionCandidates,
      safeActionKey,
      reviewStatus,
      humanReviewRequired: true,
      tuningCandidate,
      eligibleForAppRuntime: false,
      appRuntimeTransferBlocked: true
    });
  };

  if (measurements.headroomRatio >= 0.38) {
    pushVector(
      "ERR_COMP_EXCESSIVE_HEADROOM",
      { headroomRatio: roundFeature(measurements.headroomRatio) },
      [measurements.headroomRatio >= 0.55 ? "headroom_strong_high" : "headroom_soft_high"],
      ["intentional_negative_space"],
      "leave_less_empty_air_above",
      "accepted_for_calibration",
      true
    );
  }
  if (Math.abs(measurements.horizonAngle || 0) >= 2.5) {
    pushVector(
      "ERR_COMP_HORIZON_TILT",
      { horizonAngle: roundFeature(measurements.horizonAngle) },
      [Math.abs(measurements.horizonAngle) >= 7 ? "horizon_tilt_strong" : "horizon_tilt_soft"],
      ["intentional_dutch_angle"],
      "level_frame_softly",
      "accepted_for_eval_only",
      false
    );
  }
  if (measurements.subjectAnchor !== undefined && measurements.visualWeightMoment !== undefined) {
    const imbalancedBucket = !["center", "balanced"].includes(observation.subjectAnchorBucket) ||
      !["balanced"].includes(observation.visualWeightMomentBucket);
    if (imbalancedBucket || Math.abs(measurements.visualWeightMoment - 0.5) >= 0.15) {
      pushVector(
        "ERR_COMP_RULE_OF_THIRDS_MISS",
        {
          subjectAnchor: roundFeature(measurements.subjectAnchor),
          visualWeightMoment: roundFeature(measurements.visualWeightMoment)
        },
        ["visual_weight_imbalance_soft"],
        ["intentional_centering"],
        "keep_if_intentional",
        "pending",
        false
      );
    }
  }
  if (measurements.edgeMargin !== undefined && measurements.edgeMargin <= 0.09) {
    pushVector(
      "ERR_FRAME_ANKLE_CUT",
      { edgeMargin: roundFeature(measurements.edgeMargin) },
      ["edge_margin_soft_low"],
      ["intentional_centering"],
      "give_subject_more_breathing_room",
      "pending",
      false
    );
  }
  if (measurements.highlightClipRatio !== undefined && measurements.highlightClipRatio >= 0.18) {
    pushVector(
      "ERR_EXP_HIGHLIGHT_CLIPPING",
      { highlightClipRatio: roundFeature(measurements.highlightClipRatio) },
      ["highlight_clip_ratio_high"],
      ["intentional_retro_flash"],
      "keep_if_intentional",
      "pending",
      false
    );
  }
  if (measurements.backgroundObjectDensity !== undefined && measurements.backgroundObjectDensity >= 0.65) {
    pushVector(
      "ERR_CLUTTER_BACKGROUND_OBJECT_DENSITY",
      { backgroundObjectDensity: roundFeature(measurements.backgroundObjectDensity) },
      ["background_object_density_high"],
      ["contextual_environmental_portrait"],
      "shift_angle_for_cleaner_background",
      "pending",
      false
    );
  }

  return vectors;
}

function schemaBoundaryBlockers(input) {
  const blockers = disabledFlagBlockers(input);
  if (input.schemaVersion !== AESTHETIC_LOCAL_CV_FEATURE_EXTRACTOR_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_extractor_schema_version");
  }
  if (input.extractorRunMode !== "synthetic_feature_extractor_prototype") {
    blockers.push("blocked_for_unsupported_extractor_run_mode");
  }
  if (!Array.isArray(input.syntheticObservations) || input.syntheticObservations.length === 0) {
    blockers.push("blocked_for_missing_synthetic_observations");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (input.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function observationBlockers(observation) {
  const blockers = missingFieldBlockers(observation, [
    "observationId",
    "jobId",
    "imageId",
    "sourceType",
    "measurements",
    "subjectAnchorBucket",
    "visualWeightMomentBucket"
  ], "observation");

  if (observation.sourceType !== ALLOWED_OBSERVATION_SOURCE_TYPE) {
    blockers.push(`blocked_for_unsupported_observation_source_type_${sanitizeToken(observation.sourceType)}`);
  }
  if (!ALLOWED_SUBJECT_ANCHOR_BUCKETS.includes(observation.subjectAnchorBucket)) {
    blockers.push(`blocked_for_unsupported_subject_anchor_bucket_${sanitizeToken(observation.subjectAnchorBucket)}`);
  }
  if (!ALLOWED_VISUAL_WEIGHT_BUCKETS.includes(observation.visualWeightMomentBucket)) {
    blockers.push(`blocked_for_unsupported_visual_weight_moment_bucket_${sanitizeToken(observation.visualWeightMomentBucket)}`);
  }
  if (!observation.measurements || typeof observation.measurements !== "object" || Array.isArray(observation.measurements)) {
    blockers.push("blocked_for_missing_measurements");
    return blockers;
  }
  for (const [key, value] of Object.entries(observation.measurements)) {
    if (!ALLOWED_MEASUREMENT_KEYS.includes(key) || !ALLOWED_FEATURE_KEYS.includes(key)) {
      blockers.push(`blocked_for_unknown_measurement_key_${sanitizeToken(key)}`);
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      blockers.push(`blocked_for_non_numeric_measurement_${sanitizeToken(key)}`);
    }
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "local_cv_feature_extractor") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    const allowedSchemaKey = ALLOWED_SCHEMA_FIELD_NAMES.has(normalizedKey) ||
      ALLOWED_MEASUREMENT_KEYS.map(normalizeFieldName).includes(normalizedKey);
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

function missingFieldBlockers(value, requiredFields, path) {
  return requiredFields
    .filter((field) => !(field in (value || {})))
    .map((field) => `blocked_for_missing_${sanitizeToken(path)}_${sanitizeToken(field)}`);
}

function countBy(items, field) {
  return items.reduce((counts, item) => {
    const key = sanitizeToken(item[field] || "missing");
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function countFeatureKeys(vectors) {
  return vectors.reduce((counts, vector) => {
    for (const key of Object.keys(vector.featureSignals || {})) {
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, {});
}

function roundFeature(value) {
  return Math.round(value * 1000) / 1000;
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
