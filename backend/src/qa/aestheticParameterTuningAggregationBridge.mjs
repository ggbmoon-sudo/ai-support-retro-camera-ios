import { AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS } from "./aestheticLocalCvFeatureExtractorPrototype.mjs";
import {
  AESTHETIC_LOCAL_CV_CALIBRATION_AGGREGATION_VERSION,
  aestheticLocalCvCalibrationAggregationSample,
  runAestheticLocalCvCalibrationAggregationGate
} from "./aestheticLocalCvCalibrationAggregationGate.mjs";

export const AESTHETIC_PARAMETER_TUNING_AGGREGATION_BRIDGE_SCHEMA_VERSION =
  "aesthetic_parameter_tuning_aggregation_bridge.v1";

export const AESTHETIC_PARAMETER_TUNING_AGGREGATION_BRIDGE_VERSION =
  "aesthetic_parameter_tuning_aggregation_bridge.v1";

const RUN_MODE = "parameter_tuning_aggregation_bridge_no_runtime";
const MINIMUM_RECOMMENDED_FIXTURE_COUNT = 5;

const WARNING_SIGNAL_MAP = Object.freeze({
  soft_horizon_tilt_left: {
    signalKey: "horizon_angle_threshold_review",
    targetFeatureKey: "horizonAngle",
    thresholdReviewKey: "horizon_angle_soft_threshold_review"
  },
  soft_horizon_tilt_right: {
    signalKey: "horizon_angle_threshold_review",
    targetFeatureKey: "horizonAngle",
    thresholdReviewKey: "horizon_angle_soft_threshold_review"
  },
  strong_horizon_tilt_review: {
    signalKey: "horizon_angle_threshold_review",
    targetFeatureKey: "horizonAngle",
    thresholdReviewKey: "horizon_angle_strong_threshold_review"
  },
  soft_low_sharpness_review: {
    signalKey: "sharpness_ratio_low_confidence_threshold_review",
    targetFeatureKey: "sharpnessRatio",
    thresholdReviewKey: "sharpness_ratio_low_confidence_review"
  },
  soft_spatial_balance_review: {
    signalKey: "visual_weight_moment_spatial_balance_review",
    targetFeatureKey: "visualWeightMoment",
    thresholdReviewKey: "visual_weight_moment_balance_review"
  },
  soft_headroom_high: {
    signalKey: "headroom_ratio_high_threshold_review",
    targetFeatureKey: "headroomRatio",
    thresholdReviewKey: "headroom_ratio_high_threshold_review"
  }
});

const DISABLED_FALSE_FLAGS = Object.freeze([
  "imageReadsPerformed",
  "cvInferencePerformed",
  "networkCallsMade",
  "uploadPerformed",
  "providerCallAttempted",
  "generatedReportsPersisted",
  "appRuntimeIntegrationEnabled",
  "productionReady"
]);

const ALLOWED_SCHEMA_FIELD_NAMES = new Set(
  [
    ...DISABLED_FALSE_FLAGS,
    "sourceAggregation",
    "schemaVersion",
    "runMode",
    "aggregationVersion",
    "bridgeVersion",
    "sourceAggregationVersion",
    "fixtureCount",
    "fixtureTokens",
    "reviewedFeatureKeys",
    "reviewedWarningBuckets",
    "blockerBuckets",
    "warningFrequencyBuckets",
    "featureSummaryBuckets",
    "insufficientSampleSize",
    "minimumRecommendedFixtureCount",
    "acceptedForCalibrationAggregationReview",
    "eligibleForParameterTuning",
    "eligibleForParameterTuningDryRun",
    "eligibleForParameterPackExport",
    "eligibleForAppRuntime",
    "recommendedNextStep",
    "sampleSizeGatePassed",
    "blockerGatePassed",
    "acceptedForTuningBridgeReview",
    "proposedTuningSignals",
    "signalKey",
    "sourceWarningBuckets",
    "targetFeatureKey",
    "thresholdReviewKey",
    "observedWarningCount",
    "observedFixtureCount",
    "internalOnly",
    "userFacing",
    "blockedReasons",
    "bridgeRunMode"
  ].map(normalizeFieldName)
);

const FORBIDDEN_FIELD_FRAGMENTS = Object.freeze([
  "score",
  "rating",
  "aestheticgrade",
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
  "rawteacher",
  "teachertext"
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
  "useridentity"
]);

const RAW_VALUE_PATTERNS = Object.freeze([
  /^[a-zA-Z]:[\\/]/,
  /^\//,
  /^~/,
  /\\/,
  /\.(jpg|jpeg|png|heic|heif|webp|gif|mov|mp4|mlmodel|mlpackage|onnx|tflite|pt|pth|bin|gguf)$/i,
  /^https?:\/\//i,
  /^file:\/\//i,
  /^data:image/i,
  /\/9j\//,
  /base64/i,
  /api[_-]?key/i,
  /secret/i
]);

export function aestheticParameterTuningAggregationBridgeSample() {
  return {
    sourceAggregation: runAestheticLocalCvCalibrationAggregationGate(
      aestheticLocalCvCalibrationAggregationSample()
    ),
    bridgeRunMode: "review_only",
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false,
    productionReady: false
  };
}

export function runAestheticParameterTuningAggregationBridge(
  input = aestheticParameterTuningAggregationBridgeSample()
) {
  const sourceAggregation = input.sourceAggregation || {};
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input, sourceAggregation),
    ...sourceAggregationBlockers(sourceAggregation),
    ...forbiddenShapeBlockers(input)
  ]);
  const sampleSizeGatePassed = sourceAggregation.fixtureCount >= MINIMUM_RECOMMENDED_FIXTURE_COUNT &&
    sourceAggregation.insufficientSampleSize === false;
  const blockerGatePassed = Array.isArray(sourceAggregation.blockerBuckets) &&
    sourceAggregation.blockerBuckets.length === 0;
  const acceptedForTuningBridgeReview = blockedReasons.length === 0 &&
    sampleSizeGatePassed &&
    blockerGatePassed &&
    sourceAggregation.acceptedForCalibrationAggregationReview === true;

  const proposedTuningSignals = acceptedForTuningBridgeReview
    ? buildProposedTuningSignals(sourceAggregation.warningFrequencyBuckets || {}, sourceAggregation.fixtureCount)
    : [];

  return {
    schemaVersion: AESTHETIC_PARAMETER_TUNING_AGGREGATION_BRIDGE_SCHEMA_VERSION,
    runMode: RUN_MODE,
    bridgeVersion: AESTHETIC_PARAMETER_TUNING_AGGREGATION_BRIDGE_VERSION,
    sourceAggregationVersion: sanitizeToken(sourceAggregation.aggregationVersion || "missing"),
    fixtureCount: Number.isFinite(sourceAggregation.fixtureCount) ? sourceAggregation.fixtureCount : 0,
    minimumRecommendedFixtureCount: MINIMUM_RECOMMENDED_FIXTURE_COUNT,
    sampleSizeGatePassed,
    blockerGatePassed,
    acceptedForTuningBridgeReview,
    eligibleForParameterTuningDryRun: acceptedForTuningBridgeReview,
    eligibleForParameterPackExport: false,
    eligibleForAppRuntime: false,
    warningFrequencyBuckets: sanitizeCountMap(sourceAggregation.warningFrequencyBuckets || {}),
    reviewedFeatureKeys: Array.isArray(sourceAggregation.reviewedFeatureKeys)
      ? sourceAggregation.reviewedFeatureKeys.map(sanitizeToken)
      : [],
    proposedTuningSignals,
    blockedReasons,
    recommendedNextStep: acceptedForTuningBridgeReview
      ? "manual local AI review may hand this bridge summary to OD-R8D dry-run tuning"
      : "resolve bridge blockers before any tuning dry-run review",
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false,
    productionReady: false
  };
}

function schemaBoundaryBlockers(input, sourceAggregation) {
  const blockers = disabledFlagBlockers(input);
  if (input.bridgeRunMode !== "review_only") {
    blockers.push("blocked_for_unsupported_bridge_run_mode");
  }
  if (!input.sourceAggregation || typeof input.sourceAggregation !== "object" || Array.isArray(input.sourceAggregation)) {
    blockers.push("blocked_for_missing_source_aggregation");
  }
  if (input.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_input_parameter_pack_export_eligibility");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_input_app_runtime_eligibility");
  }
  if (sourceAggregation.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_source_parameter_pack_export_eligibility");
  }
  if (sourceAggregation.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_source_app_runtime_eligibility");
  }
  return blockers;
}

function sourceAggregationBlockers(sourceAggregation) {
  const blockers = [];
  if (sourceAggregation.runMode !== "multi_fixture_aggregation_no_image_read") {
    blockers.push("blocked_for_unsupported_source_aggregation_run_mode");
  }
  if (sourceAggregation.aggregationVersion !== AESTHETIC_LOCAL_CV_CALIBRATION_AGGREGATION_VERSION) {
    blockers.push("blocked_for_unsupported_source_aggregation_version");
  }
  if (!Number.isFinite(sourceAggregation.fixtureCount) || sourceAggregation.fixtureCount < MINIMUM_RECOMMENDED_FIXTURE_COUNT) {
    blockers.push("blocked_for_source_fixture_count_below_minimum");
  }
  if (sourceAggregation.insufficientSampleSize !== false) {
    blockers.push("blocked_for_source_sample_size_gate_not_passed");
  }
  if (sourceAggregation.acceptedForCalibrationAggregationReview !== true) {
    blockers.push("blocked_for_source_not_accepted_for_calibration_aggregation_review");
  }
  if (!Array.isArray(sourceAggregation.blockerBuckets)) {
    blockers.push("blocked_for_missing_source_blocker_buckets");
  } else if (sourceAggregation.blockerBuckets.length > 0) {
    blockers.push("blocked_for_source_blocker_buckets_present");
  }
  if (sourceAggregation.eligibleForParameterTuning !== false) {
    blockers.push("blocked_for_source_parameter_tuning_eligibility_not_false");
  }
  for (const flag of DISABLED_FALSE_FLAGS) {
    if (sourceAggregation[flag] === true) {
      blockers.push(`blocked_for_source_${toSnake(flag)}_true`);
    }
  }
  if (!Array.isArray(sourceAggregation.reviewedFeatureKeys)) {
    blockers.push("blocked_for_missing_reviewed_feature_keys");
  } else {
    for (const featureKey of sourceAggregation.reviewedFeatureKeys) {
      if (!AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS.includes(featureKey)) {
        blockers.push(`blocked_for_unknown_feature_key_${sanitizeToken(featureKey)}`);
      }
    }
  }
  const warningFrequencyBuckets = sourceAggregation.warningFrequencyBuckets || {};
  if (!warningFrequencyBuckets || typeof warningFrequencyBuckets !== "object" || Array.isArray(warningFrequencyBuckets)) {
    blockers.push("blocked_for_invalid_warning_frequency_buckets");
  } else {
    for (const [bucket, count] of Object.entries(warningFrequencyBuckets)) {
      if (!Object.hasOwn(WARNING_SIGNAL_MAP, bucket)) {
        blockers.push(`blocked_for_unknown_warning_bucket_${sanitizeToken(bucket)}`);
      }
      if (!Number.isInteger(count) || count < 0) {
        blockers.push(`blocked_for_invalid_warning_count_${sanitizeToken(bucket)}`);
      }
    }
  }
  return blockers;
}

function buildProposedTuningSignals(warningFrequencyBuckets, fixtureCount) {
  const groupedSignals = new Map();
  for (const [bucket, count] of Object.entries(warningFrequencyBuckets)) {
    if (count <= 0 || !Object.hasOwn(WARNING_SIGNAL_MAP, bucket)) continue;
    const mapping = WARNING_SIGNAL_MAP[bucket];
    const existing = groupedSignals.get(mapping.signalKey) || {
      signalKey: mapping.signalKey,
      sourceWarningBuckets: [],
      targetFeatureKey: mapping.targetFeatureKey,
      thresholdReviewKey: mapping.thresholdReviewKey,
      observedWarningCount: 0,
      observedFixtureCount: fixtureCount,
      internalOnly: true,
      userFacing: false
    };
    existing.sourceWarningBuckets.push(sanitizeToken(bucket));
    existing.observedWarningCount += count;
    groupedSignals.set(mapping.signalKey, existing);
  }
  return [...groupedSignals.values()].sort((left, right) => left.signalKey.localeCompare(right.signalKey));
}

function disabledFlagBlockers(input) {
  return DISABLED_FALSE_FLAGS
    .filter((flag) => input[flag] === true)
    .map((flag) => `blocked_for_${toSnake(flag)}_true`);
}

function forbiddenShapeBlockers(value, path = "parameter_tuning_aggregation_bridge") {
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

function sanitizeCountMap(value) {
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, count]) => [sanitizeToken(key), Number.isFinite(count) ? count : 0])
  );
}

function normalizeFieldName(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}

function toSnake(value) {
  return String(value).replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function unique(values) {
  return [...new Set(values)];
}
