import { AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS } from "./aestheticLocalCvFeatureExtractorPrototype.mjs";

export const AESTHETIC_LOCAL_CV_EXPECTED_RANGE_SCHEMA_VERSION =
  "aesthetic_local_cv_expected_range_comparison.v1";

export const AESTHETIC_LOCAL_CV_EXPECTED_RANGE_VERSION =
  "aesthetic_local_cv_expected_ranges.v1";

const RUN_MODE = "expected_range_comparison_no_image_read";

const NUMERIC_RANGES = Object.freeze({
  headroomRatio: {
    expected: [0.08, 0.25],
    hard: [0, 1],
    warning: (value) => value < 0.08 || (value > 0.25 && value <= 0.34),
    warningBucket: (value) => value < 0.08 ? "soft_headroom_low" : "soft_headroom_high"
  },
  horizonAngle: {
    expected: [-2, 2],
    hard: [-45, 45],
    warning: (value) => (value >= -5 && value < -2) || (value > 2 && value <= 5),
    warningBucket: (value) => value < -2 ? "soft_horizon_tilt_left" : "soft_horizon_tilt_right"
  },
  highlightClipRatio: {
    expected: [0, 0.06],
    hard: [0, 1],
    warning: (value) => value > 0.06 && value <= 0.12,
    warningBucket: () => "soft_highlight_clip_high"
  },
  edgeMargin: {
    expected: [0.08, 0.35],
    hard: [0, 1],
    warning: (value) => value < 0.08,
    warningBucket: () => "soft_edge_margin_low"
  },
  backgroundObjectDensity: {
    expected: [0, 0.35],
    hard: [0, 1],
    warning: (value) => value > 0.35 && value <= 0.55,
    warningBucket: () => "soft_background_density_high"
  },
  sharpnessRatio: {
    expected: [0.2, 1],
    hard: [0, 1],
    warning: (value) => value >= 0.12 && value < 0.2,
    warningBucket: () => "soft_sharpness_low_confidence"
  }
});

const ALLOWED_SUBJECT_ANCHOR_BUCKETS = Object.freeze([
  "center",
  "left_third",
  "right_third",
  "upper_third",
  "lower_third",
  "off_center"
]);

const ALLOWED_VISUAL_WEIGHT_BUCKETS = Object.freeze([
  "balanced",
  "left_heavy",
  "right_heavy",
  "top_heavy",
  "bottom_heavy"
]);

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

export function aestheticLocalCvExpectedRangeComparisonSample() {
  return {
    fixtureToken: "calibration_001",
    featureVector: {
      headroomRatio: 0.23,
      horizonAngle: -4,
      highlightClipRatio: 0.044,
      edgeMargin: 0.097,
      backgroundObjectDensity: 0.199,
      sharpnessRatio: 0.228,
      subjectAnchor: "left_third",
      visualWeightMoment: "right_heavy"
    },
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

export function runAestheticLocalCvExpectedRangeComparison(
  input = aestheticLocalCvExpectedRangeComparisonSample()
) {
  const featureVector = input.featureVector || {};
  const flagBlockers = disabledFlagBlockers(input);
  const featureComparisons = AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS.map((featureKey) =>
    compareFeature(featureKey, featureVector[featureKey])
  );
  const blockerBuckets = unique([
    ...flagBlockers,
    ...featureComparisons.flatMap((comparison) => comparison.blockerBuckets)
  ]);
  const warningBuckets = unique(featureComparisons.flatMap((comparison) => comparison.warningBuckets));
  const comparisonPassed = blockerBuckets.length === 0;

  return {
    schemaVersion: AESTHETIC_LOCAL_CV_EXPECTED_RANGE_SCHEMA_VERSION,
    runMode: RUN_MODE,
    fixtureToken: sanitizeToken(input.fixtureToken || "unknown_fixture"),
    comparisonPassed,
    acceptedForRangeReview: comparisonPassed,
    reviewedFeatureKeys: [...AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS],
    rangeVersion: AESTHETIC_LOCAL_CV_EXPECTED_RANGE_VERSION,
    featureComparisons,
    warningBuckets,
    blockerBuckets,
    recommendedCalibrationActions: recommendedCalibrationActionsFor(warningBuckets, blockerBuckets),
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

function compareFeature(featureKey, value) {
  if (featureKey in NUMERIC_RANGES) {
    return compareNumericFeature(featureKey, value, NUMERIC_RANGES[featureKey]);
  }
  if (featureKey === "subjectAnchor") {
    return compareBucketFeature(featureKey, value, ALLOWED_SUBJECT_ANCHOR_BUCKETS, () => []);
  }
  if (featureKey === "visualWeightMoment") {
    return compareBucketFeature(featureKey, value, ALLOWED_VISUAL_WEIGHT_BUCKETS, (bucket) =>
      ["left_heavy", "right_heavy"].includes(bucket) ? ["soft_spatial_balance_review"] : []
    );
  }
  return baseComparison(featureKey, value, {
    status: "blocked",
    blockerBuckets: [`blocked_for_unknown_feature_key_${sanitizeToken(featureKey)}`]
  });
}

function compareNumericFeature(featureKey, value, range) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return baseComparison(featureKey, value, {
      status: "blocked",
      expectedRange: range.expected,
      blockerBuckets: [`blocked_for_non_numeric_${featureKey}`]
    });
  }

  const [hardMin, hardMax] = range.hard;
  if (value < hardMin || value > hardMax) {
    return baseComparison(featureKey, roundFeature(value), {
      status: "blocked",
      expectedRange: range.expected,
      hardRange: range.hard,
      blockerBuckets: [`blocked_for_${featureKey}_outside_hard_range`]
    });
  }

  const [expectedMin, expectedMax] = range.expected;
  if (value >= expectedMin && value <= expectedMax) {
    return baseComparison(featureKey, roundFeature(value), {
      status: "within_expected_range",
      expectedRange: range.expected
    });
  }

  const warningBuckets = range.warning(value) ? [range.warningBucket(value)] : [`soft_${featureKey}_outside_expected_range`];
  return baseComparison(featureKey, roundFeature(value), {
    status: "soft_warning",
    expectedRange: range.expected,
    warningBuckets
  });
}

function compareBucketFeature(featureKey, value, allowedBuckets, warningBucketBuilder) {
  if (!allowedBuckets.includes(value)) {
    return baseComparison(featureKey, sanitizeToken(value), {
      status: "blocked",
      allowedBuckets,
      blockerBuckets: [`blocked_for_unknown_${featureKey}_bucket`]
    });
  }
  const warningBuckets = warningBucketBuilder(value);
  return baseComparison(featureKey, value, {
    status: warningBuckets.length > 0 ? "soft_warning" : "within_expected_range",
    allowedBuckets,
    warningBuckets
  });
}

function baseComparison(
  featureKey,
  value,
  { status, expectedRange = undefined, hardRange = undefined, allowedBuckets = undefined, warningBuckets = [], blockerBuckets = [] }
) {
  const comparison = {
    featureKey,
    value,
    status,
    warningBuckets,
    blockerBuckets
  };
  if (expectedRange) comparison.expectedRange = expectedRange;
  if (hardRange) comparison.hardRange = hardRange;
  if (allowedBuckets) comparison.allowedBuckets = allowedBuckets;
  return comparison;
}

function disabledFlagBlockers(input) {
  return DISABLED_FALSE_FLAGS
    .filter((flag) => input[flag] === true)
    .map((flag) => `blocked_for_${toSnake(flag)}_true`);
}

function recommendedCalibrationActionsFor(warningBuckets, blockerBuckets) {
  if (blockerBuckets.length > 0) {
    return ["review_schema_or_boundary_blockers_before_range_review"];
  }
  if (warningBuckets.length === 0) {
    return ["retain_current_expected_ranges_for_manual_review"];
  }
  return warningBuckets.map((bucket) => `manual_review_${bucket}`);
}

function roundFeature(value) {
  return Math.round(value * 1000) / 1000;
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
