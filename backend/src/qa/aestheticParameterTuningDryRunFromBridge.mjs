import {
  AESTHETIC_PARAMETER_TUNING_AGGREGATION_BRIDGE_VERSION,
  aestheticParameterTuningAggregationBridgeSample,
  runAestheticParameterTuningAggregationBridge
} from "./aestheticParameterTuningAggregationBridge.mjs";

export const AESTHETIC_PARAMETER_TUNING_DRY_RUN_FROM_BRIDGE_SCHEMA_VERSION =
  "aesthetic_parameter_tuning_dry_run_from_bridge.v1";

export const AESTHETIC_PARAMETER_TUNING_DRY_RUN_FROM_BRIDGE_VERSION =
  "aesthetic_parameter_tuning_dry_run_from_bridge.v1";

const RUN_MODE = "parameter_tuning_dry_run_from_bridge_no_export";

const SIGNAL_ADJUSTMENT_MAP = Object.freeze({
  headroom_ratio_high_threshold_review: {
    targetParameterKey: "headroomRatio.highSoftWarningThreshold",
    direction: "review_down_or_confirm",
    rationaleBucket: "headroom_high_soft_threshold_review"
  },
  horizon_angle_threshold_review: {
    targetParameterKey: "horizonAngle.softTiltThreshold",
    direction: "review_outlier_handling",
    rationaleBucket: "horizon_angle_soft_outlier_review",
    reviewNoteBucket: "calibration_005_strong_tilt_stays_warning"
  },
  sharpness_ratio_low_confidence_threshold_review: {
    targetParameterKey: "sharpnessRatio.lowConfidenceThreshold",
    direction: "review_lower_bound_or_feature_quality",
    rationaleBucket: "sharpness_low_confidence_threshold_review",
    reviewNoteBucket: "very_low_ratio_fixture_review"
  },
  visual_weight_moment_spatial_balance_review: {
    targetParameterKey: "visualWeightMoment.balanceWarningPolicy",
    direction: "keep_soft_hint_only",
    rationaleBucket: "spatial_balance_soft_policy_review",
    reviewNoteBucket: "must_remain_soft_hint"
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
  "parameterPackExported",
  "appRuntimeWritePerformed",
  "productionReady"
]);

const ALLOWED_SCHEMA_FIELD_NAMES = new Set(
  [
    ...DISABLED_FALSE_FLAGS,
    "sourceBridge",
    "schemaVersion",
    "runMode",
    "bridgeVersion",
    "sourceBridgeVersion",
    "tuningDryRunVersion",
    "sourceAggregationVersion",
    "fixtureCount",
    "minimumRecommendedFixtureCount",
    "sampleSizeGatePassed",
    "blockerGatePassed",
    "acceptedForTuningBridgeReview",
    "acceptedForTuningDryRunReview",
    "eligibleForParameterTuningDryRun",
    "eligibleForParameterPackExport",
    "eligibleForAppRuntime",
    "warningFrequencyBuckets",
    "reviewedFeatureKeys",
    "reviewedTuningSignals",
    "proposedTuningSignals",
    "proposedParameterAdjustments",
    "adjustmentId",
    "sourceSignalKey",
    "sourceWarningBuckets",
    "targetFeatureKey",
    "targetParameterKey",
    "thresholdReviewKey",
    "direction",
    "rationaleBucket",
    "reviewNoteBucket",
    "observedWarningCount",
    "observedFixtureCount",
    "candidateOnly",
    "automaticMutationApplied",
    "productionMutationAllowed",
    "internalOnly",
    "userFacing",
    "adjustmentRationaleBuckets",
    "blockedReasons",
    "recommendedNextStep",
    "tuningDryRunMode"
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
  "finalthreshold",
  "productionthreshold",
  "appliedthreshold",
  "thresholdvalue",
  "newthreshold",
  "tunedvalue",
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

export function aestheticParameterTuningDryRunFromBridgeSample() {
  return {
    sourceBridge: runAestheticParameterTuningAggregationBridge(
      aestheticParameterTuningAggregationBridgeSample()
    ),
    tuningDryRunMode: "review_only",
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false,
    parameterPackExported: false,
    appRuntimeWritePerformed: false,
    productionReady: false
  };
}

export function runAestheticParameterTuningDryRunFromBridge(
  input = aestheticParameterTuningDryRunFromBridgeSample()
) {
  const sourceBridge = input.sourceBridge || {};
  const reviewedTuningSignals = Array.isArray(sourceBridge.proposedTuningSignals)
    ? sourceBridge.proposedTuningSignals.map((signal) => sanitizeToken(signal.signalKey))
    : [];
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input, sourceBridge),
    ...sourceBridgeBlockers(sourceBridge),
    ...forbiddenShapeBlockers(input)
  ]);
  const acceptedForTuningDryRunReview = blockedReasons.length === 0;
  const proposedParameterAdjustments = acceptedForTuningDryRunReview
    ? buildProposedParameterAdjustments(sourceBridge.proposedTuningSignals || [])
    : [];

  return {
    schemaVersion: AESTHETIC_PARAMETER_TUNING_DRY_RUN_FROM_BRIDGE_SCHEMA_VERSION,
    runMode: RUN_MODE,
    tuningDryRunVersion: AESTHETIC_PARAMETER_TUNING_DRY_RUN_FROM_BRIDGE_VERSION,
    sourceBridgeVersion: sanitizeToken(sourceBridge.bridgeVersion || "missing"),
    acceptedForTuningDryRunReview,
    eligibleForParameterPackExport: false,
    eligibleForAppRuntime: false,
    productionReady: false,
    reviewedTuningSignals,
    proposedParameterAdjustments,
    adjustmentRationaleBuckets: rationaleBucketsFor(proposedParameterAdjustments),
    blockedReasons,
    recommendedNextStep: acceptedForTuningDryRunReview
      ? "manual local AI review may inspect adjustment candidates before OD-R8E acceptance gate"
      : "resolve dry-run blockers before adjustment candidate review",
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false,
    parameterPackExported: false,
    appRuntimeWritePerformed: false
  };
}

function schemaBoundaryBlockers(input, sourceBridge) {
  const blockers = disabledFlagBlockers(input);
  if (input.tuningDryRunMode !== "review_only") {
    blockers.push("blocked_for_unsupported_tuning_dry_run_mode");
  }
  if (!input.sourceBridge || typeof input.sourceBridge !== "object" || Array.isArray(input.sourceBridge)) {
    blockers.push("blocked_for_missing_source_bridge");
  }
  if (input.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_input_parameter_pack_export_eligibility");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_input_app_runtime_eligibility");
  }
  if (sourceBridge.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_source_parameter_pack_export_eligibility");
  }
  if (sourceBridge.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_source_app_runtime_eligibility");
  }
  return blockers;
}

function sourceBridgeBlockers(sourceBridge) {
  const blockers = [];
  if (sourceBridge.runMode !== "parameter_tuning_aggregation_bridge_no_runtime") {
    blockers.push("blocked_for_unsupported_source_bridge_run_mode");
  }
  if (sourceBridge.bridgeVersion !== AESTHETIC_PARAMETER_TUNING_AGGREGATION_BRIDGE_VERSION) {
    blockers.push("blocked_for_unsupported_source_bridge_version");
  }
  if (sourceBridge.acceptedForTuningBridgeReview !== true) {
    blockers.push("blocked_for_source_bridge_not_accepted");
  }
  if (sourceBridge.eligibleForParameterTuningDryRun !== true) {
    blockers.push("blocked_for_source_not_eligible_for_tuning_dry_run");
  }
  if (sourceBridge.productionReady === true) {
    blockers.push("blocked_for_source_production_ready_true");
  }
  for (const flag of DISABLED_FALSE_FLAGS) {
    if (sourceBridge[flag] === true) {
      blockers.push(`blocked_for_source_${toSnake(flag)}_true`);
    }
  }
  if (!Array.isArray(sourceBridge.proposedTuningSignals) || sourceBridge.proposedTuningSignals.length === 0) {
    blockers.push("blocked_for_missing_source_tuning_signals");
  } else {
    for (const signal of sourceBridge.proposedTuningSignals) {
      if (!signal || typeof signal !== "object" || Array.isArray(signal)) {
        blockers.push("blocked_for_invalid_source_tuning_signal");
        continue;
      }
      if (!Object.hasOwn(SIGNAL_ADJUSTMENT_MAP, signal.signalKey)) {
        blockers.push(`blocked_for_unknown_tuning_signal_${sanitizeToken(signal.signalKey)}`);
      }
      if (signal.internalOnly !== true) {
        blockers.push(`blocked_for_tuning_signal_not_internal_${sanitizeToken(signal.signalKey)}`);
      }
      if (signal.userFacing !== false) {
        blockers.push(`blocked_for_tuning_signal_user_facing_${sanitizeToken(signal.signalKey)}`);
      }
    }
  }
  return blockers;
}

function buildProposedParameterAdjustments(proposedTuningSignals) {
  return proposedTuningSignals
    .map((signal, index) => {
      const mapping = SIGNAL_ADJUSTMENT_MAP[signal.signalKey];
      return {
        adjustmentId: `adjustment_candidate_${String(index + 1).padStart(3, "0")}`,
        sourceSignalKey: sanitizeToken(signal.signalKey),
        sourceWarningBuckets: Array.isArray(signal.sourceWarningBuckets)
          ? signal.sourceWarningBuckets.map(sanitizeToken)
          : [],
        targetFeatureKey: sanitizeToken(signal.targetFeatureKey || "unknown"),
        targetParameterKey: mapping.targetParameterKey,
        direction: mapping.direction,
        rationaleBucket: mapping.rationaleBucket,
        reviewNoteBucket: mapping.reviewNoteBucket || "manual_review_required",
        observedWarningCount: Number.isFinite(signal.observedWarningCount) ? signal.observedWarningCount : 0,
        observedFixtureCount: Number.isFinite(signal.observedFixtureCount) ? signal.observedFixtureCount : 0,
        candidateOnly: true,
        automaticMutationApplied: false,
        productionMutationAllowed: false,
        internalOnly: true,
        userFacing: false
      };
    })
    .sort((left, right) => left.adjustmentId.localeCompare(right.adjustmentId));
}

function rationaleBucketsFor(proposedParameterAdjustments) {
  return proposedParameterAdjustments.reduce((counts, adjustment) => {
    counts[adjustment.rationaleBucket] = (counts[adjustment.rationaleBucket] || 0) + 1;
    return counts;
  }, {});
}

function disabledFlagBlockers(input) {
  return DISABLED_FALSE_FLAGS
    .filter((flag) => input[flag] === true)
    .map((flag) => `blocked_for_${toSnake(flag)}_true`);
}

function forbiddenShapeBlockers(value, path = "parameter_tuning_dry_run_from_bridge") {
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
