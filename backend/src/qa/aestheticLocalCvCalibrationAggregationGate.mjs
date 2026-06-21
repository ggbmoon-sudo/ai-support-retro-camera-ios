import { AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS } from "./aestheticLocalCvFeatureExtractorPrototype.mjs";
import {
  AESTHETIC_LOCAL_CV_EXPECTED_RANGE_SCHEMA_VERSION,
  aestheticLocalCvExpectedRangeComparisonSample,
  runAestheticLocalCvExpectedRangeComparison
} from "./aestheticLocalCvExpectedRangeComparison.mjs";

export const AESTHETIC_LOCAL_CV_CALIBRATION_AGGREGATION_SCHEMA_VERSION =
  "aesthetic_local_cv_calibration_aggregation_gate.v1";

export const AESTHETIC_LOCAL_CV_CALIBRATION_AGGREGATION_VERSION =
  "aesthetic_local_cv_calibration_aggregation.v1";

const RUN_MODE = "multi_fixture_aggregation_no_image_read";
const MINIMUM_RECOMMENDED_FIXTURE_COUNT = 5;

const ALLOWED_WARNING_BUCKETS = Object.freeze([
  "soft_headroom_low",
  "soft_headroom_high",
  "soft_horizon_tilt_left",
  "soft_horizon_tilt_right",
  "soft_highlight_clip_high",
  "soft_edge_margin_low",
  "soft_background_density_high",
  "soft_sharpness_low_confidence",
  "soft_spatial_balance_review",
  ...AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS.map((key) => `soft_${key}_outside_expected_range`)
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

const FORBIDDEN_FIELD_FRAGMENTS = Object.freeze([
  "rawimage",
  "imagebase64",
  "base64",
  "imagepath",
  "photopath",
  "localfilepath",
  "filepath",
  "path",
  "url",
  "exif",
  "gps",
  "metadata",
  "providerpayload",
  "providerresponse",
  "rawresponse",
  "rawprompt",
  "prompt",
  "debug",
  "apikey",
  "api_key",
  "secret",
  "score",
  "rating",
  "aestheticgrade",
  "attractiveness",
  "beauty",
  "body",
  "health"
]);

const FORBIDDEN_EXACT_FIELD_NAMES = Object.freeze([
  "gender",
  "age",
  "race",
  "emotion",
  "identity",
  "sensitiveinference"
]);

const RAW_VALUE_PATTERNS = Object.freeze([
  /^[a-zA-Z]:[\\/]/,
  /^\//,
  /^~/,
  /\\/,
  /\.(jpg|jpeg|png|heic|heif|webp|gif|mov|mp4)$/i,
  /^https?:\/\//i,
  /^file:\/\//i,
  /^data:image/i,
  /\/9j\//,
  /base64/i,
  /exif/i,
  /gps/i,
  /api[_-]?key/i,
  /secret/i
]);

export function aestheticLocalCvCalibrationAggregationSample() {
  return {
    comparisons: [
      runAestheticLocalCvExpectedRangeComparison(aestheticLocalCvExpectedRangeComparisonSample())
    ],
    allowDuplicateFixtureTokens: false,
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false,
    eligibleForAppRuntime: false,
    productionReady: false
  };
}

export function runAestheticLocalCvCalibrationAggregationGate(
  input = aestheticLocalCvCalibrationAggregationSample()
) {
  const comparisons = Array.isArray(input.comparisons) ? input.comparisons : [];
  const blockerBuckets = unique([
    ...disabledFlagBlockers(input),
    ...eligibleRuntimeBlockers(input),
    ...duplicateFixtureBlockers(comparisons, input.allowDuplicateFixtureTokens === true),
    ...comparisons.flatMap((comparison, index) => comparisonBlockers(comparison, index)),
    ...forbiddenShapeBlockers(input)
  ]);
  const aggregateableComparisons = blockerBuckets.length === 0
    ? comparisons.filter((comparison) => comparison.excludeFromAggregation !== true)
    : [];
  const fixtureTokens = aggregateableComparisons.map((comparison) => sanitizeToken(comparison.fixtureToken));
  const warningFrequencyBuckets = countWarnings(aggregateableComparisons);
  const reviewedWarningBuckets = Object.keys(warningFrequencyBuckets).sort();
  const fixtureCount = aggregateableComparisons.length;
  const insufficientSampleSize = fixtureCount < MINIMUM_RECOMMENDED_FIXTURE_COUNT;
  const acceptedForCalibrationAggregationReview = fixtureCount > 0 && blockerBuckets.length === 0;

  return {
    schemaVersion: AESTHETIC_LOCAL_CV_CALIBRATION_AGGREGATION_SCHEMA_VERSION,
    runMode: RUN_MODE,
    aggregationVersion: AESTHETIC_LOCAL_CV_CALIBRATION_AGGREGATION_VERSION,
    fixtureCount,
    fixtureTokens,
    reviewedFeatureKeys: [...AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS],
    reviewedWarningBuckets,
    blockerBuckets,
    warningFrequencyBuckets,
    featureSummaryBuckets: featureSummaryBucketsFor(aggregateableComparisons),
    insufficientSampleSize,
    minimumRecommendedFixtureCount: MINIMUM_RECOMMENDED_FIXTURE_COUNT,
    acceptedForCalibrationAggregationReview,
    eligibleForParameterTuning: false,
    eligibleForAppRuntime: false,
    recommendedNextStep: recommendedNextStepFor({ blockerBuckets, insufficientSampleSize }),
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

function comparisonBlockers(comparison, index) {
  const path = `comparison_${index}`;
  const blockers = [];
  if (!comparison || typeof comparison !== "object" || Array.isArray(comparison)) {
    return [`blocked_for_invalid_${path}`];
  }
  if (comparison.excludeFromAggregation === true) return [];
  if (comparison.schemaVersion !== AESTHETIC_LOCAL_CV_EXPECTED_RANGE_SCHEMA_VERSION) {
    blockers.push(`blocked_for_${path}_unsupported_schema`);
  }
  if (comparison.runMode !== "expected_range_comparison_no_image_read") {
    blockers.push(`blocked_for_${path}_unsupported_run_mode`);
  }
  if (comparison.comparisonPassed !== true || comparison.acceptedForRangeReview !== true) {
    blockers.push(`blocked_for_${path}_not_passed_od_r7e_comparison`);
  }
  if (Array.isArray(comparison.blockerBuckets) && comparison.blockerBuckets.length > 0) {
    blockers.push(`blocked_for_${path}_has_blocker_buckets`);
  }
  for (const flag of DISABLED_FALSE_FLAGS) {
    if (comparison[flag] === true) blockers.push(`blocked_for_${path}_${toSnake(flag)}_true`);
  }
  if (comparison.eligibleForAppRuntime === true) {
    blockers.push(`blocked_for_${path}_eligible_for_app_runtime_true`);
  }
  if (!Array.isArray(comparison.reviewedFeatureKeys)) {
    blockers.push(`blocked_for_${path}_missing_reviewed_feature_keys`);
  } else {
    for (const featureKey of comparison.reviewedFeatureKeys) {
      if (!AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS.includes(featureKey)) {
        blockers.push(`blocked_for_${path}_unknown_feature_key_${sanitizeToken(featureKey)}`);
      }
    }
  }
  const featureComparisons = Array.isArray(comparison.featureComparisons) ? comparison.featureComparisons : [];
  for (const item of featureComparisons) {
    if (!AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS.includes(item.featureKey)) {
      blockers.push(`blocked_for_${path}_unknown_feature_key_${sanitizeToken(item.featureKey)}`);
    }
  }
  const warningBuckets = Array.isArray(comparison.warningBuckets) ? comparison.warningBuckets : [];
  for (const warningBucket of warningBuckets) {
    if (!ALLOWED_WARNING_BUCKETS.includes(warningBucket)) {
      blockers.push(`blocked_for_${path}_unknown_warning_bucket_${sanitizeToken(warningBucket)}`);
    }
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FALSE_FLAGS
    .filter((flag) => input[flag] === true)
    .map((flag) => `blocked_for_${toSnake(flag)}_true`);
}

function eligibleRuntimeBlockers(input) {
  return input.eligibleForAppRuntime === true ? ["blocked_for_eligible_for_app_runtime_true"] : [];
}

function duplicateFixtureBlockers(comparisons, allowDuplicateFixtureTokens) {
  if (allowDuplicateFixtureTokens) return [];
  const counts = countBy(comparisons.map((comparison) => sanitizeToken(comparison?.fixtureToken || "missing")));
  return Object.entries(counts)
    .filter(([, count]) => count > 1)
    .map(([fixtureToken]) => `blocked_for_duplicate_fixture_token_${fixtureToken}`);
}

function countWarnings(comparisons) {
  return comparisons.reduce((counts, comparison) => {
    for (const warningBucket of comparison.warningBuckets || []) {
      counts[warningBucket] = (counts[warningBucket] || 0) + 1;
    }
    return counts;
  }, {});
}

function featureSummaryBucketsFor(comparisons) {
  const summary = {};
  for (const featureKey of AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS) {
    summary[featureKey] = {};
  }
  for (const comparison of comparisons) {
    for (const featureComparison of comparison.featureComparisons || []) {
      const key = featureComparison.featureKey;
      if (!summary[key]) continue;
      const status = sanitizeToken(featureComparison.status || "unknown");
      summary[key][status] = (summary[key][status] || 0) + 1;
    }
  }
  return summary;
}

function recommendedNextStepFor({ blockerBuckets, insufficientSampleSize }) {
  if (blockerBuckets.length > 0) {
    return "resolve aggregation blockers before calibration review";
  }
  if (insufficientSampleSize) {
    return "collect more approved ignored local calibration outputs before tuning thresholds";
  }
  return "manual review aggregation summary before any parameter tuning handoff";
}

function forbiddenShapeBlockers(value, path = "aggregation_input") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    if (
      FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment)) ||
      FORBIDDEN_EXACT_FIELD_NAMES.includes(normalizedKey)
    ) {
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

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
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
