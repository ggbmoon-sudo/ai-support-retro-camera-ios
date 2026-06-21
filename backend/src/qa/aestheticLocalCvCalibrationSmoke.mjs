import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import {
  AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_CONFIG_SCHEMA_VERSION,
  runAestheticLocalCvCalibrationFixtureGate
} from "./aestheticLocalCvCalibrationFixtureGate.mjs";
import { AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS } from "./aestheticLocalCvFeatureExtractorPrototype.mjs";

export const AESTHETIC_LOCAL_CV_CALIBRATION_SMOKE_SCHEMA_VERSION =
  "aesthetic_local_cv_calibration_smoke.v1";

export const AESTHETIC_LOCAL_CV_CALIBRATION_SMOKE_CONFIG_SCHEMA_VERSION =
  "aesthetic_local_cv_calibration_smoke_config.v1";

const DEFAULT_FIXTURE_TOKEN = "calibration_001";
const REQUIRED_FIXTURE_ROOT = "backend/tests/local-cv-calibration-fixtures";
const ALLOWED_IMAGE_EXTENSIONS = Object.freeze([".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"]);
const HARD_BLOCKER_TOKENS = Object.freeze([
  "unsafe",
  "not_allowed",
  "path_traversal",
  "unsupported",
  "production_ready",
  "network",
  "upload",
  "provider",
  "report_write",
  "max_fixture_count",
  "non_approved_fixture",
  "generated_reports",
  "real_user_photos",
  "local_config_committed",
  "app_runtime",
  "training",
  "fine_tuning"
]);

export function aestheticLocalCvCalibrationSmokeDisabledConfig() {
  return {
    schemaVersion: AESTHETIC_LOCAL_CV_CALIBRATION_SMOKE_CONFIG_SCHEMA_VERSION,
    enabled: false,
    allowImageReads: false,
    approvedFixtureMode: false,
    approvedFixtureTokens: [],
    fixtureRoot: REQUIRED_FIXTURE_ROOT,
    maxFixtureCount: 1,
    allowReportWrite: false,
    allowNetworkCalls: false,
    allowUploads: false,
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    realUserPhotosCommitted: false,
    localConfigCommitted: false,
    appRuntimeIntegrationEnabled: false,
    trainingEnabled: false,
    fineTuningEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false
  };
}

export function aestheticLocalCvCalibrationSmokeApprovedConfig() {
  return {
    ...aestheticLocalCvCalibrationSmokeDisabledConfig(),
    enabled: true,
    allowImageReads: true,
    approvedFixtureMode: true,
    approvedFixtureTokens: [DEFAULT_FIXTURE_TOKEN]
  };
}

export function runAestheticLocalCvCalibrationSmoke(input = {}, options = {}) {
  const configPresent = input.configPresent === true;
  const config = input.config || aestheticLocalCvCalibrationSmokeDisabledConfig();
  const fixtureToken = sanitizeToken(input.fixtureToken || DEFAULT_FIXTURE_TOKEN);
  const configBlockers = validateSmokeConfig(config, fixtureToken, configPresent);
  const gateReport = runFixtureGateProbe(fixtureToken);
  const gateBlockers = gateReport.eligibleForCalibration ? [] : ["blocked_for_od_r7c_fixture_gate_probe"];
  const preReadBlockers = unique([...configBlockers, ...gateBlockers]);
  const hardValidationFailure = preReadBlockers.some(isHardBlocker);

  if (preReadBlockers.length > 0) {
    return smokeReport({
      fixtureToken,
      blockedReasons: preReadBlockers,
      calibrationWarnings: [],
      acceptedForCalibrationReview: false,
      imageReadsPerformed: false,
      hardValidationFailure
    });
  }

  let fixtureBytes;
  try {
    fixtureBytes = options.readApprovedFixtureBytes
      ? options.readApprovedFixtureBytes({ fixtureToken, fixtureRoot: config.fixtureRoot })
      : readApprovedFixtureBytes({ fixtureToken, fixtureRoot: config.fixtureRoot, cwd: options.cwd });
  } catch {
    return smokeReport({
      fixtureToken,
      blockedReasons: ["blocked_for_missing_approved_ignored_fixture"],
      calibrationWarnings: [],
      acceptedForCalibrationReview: false,
      imageReadsPerformed: false,
      hardValidationFailure: false
    });
  }

  if (!fixtureBytes || fixtureBytes.length === 0) {
    return smokeReport({
      fixtureToken,
      blockedReasons: ["blocked_for_empty_approved_ignored_fixture"],
      calibrationWarnings: [],
      acceptedForCalibrationReview: false,
      imageReadsPerformed: false,
      hardValidationFailure: true
    });
  }

  const extractedFeatureVector = featureVectorFromBytes(fixtureBytes);
  return smokeReport({
    fixtureToken,
    fixtureCount: 1,
    blockedReasons: [],
    calibrationWarnings: calibrationWarningsFor(extractedFeatureVector),
    acceptedForCalibrationReview: true,
    imageReadsPerformed: true,
    extractedFeatureVector,
    featureBuckets: featureBucketsFor(extractedFeatureVector),
    hardValidationFailure: false
  });
}

export function readApprovedFixtureBytes({ fixtureToken, fixtureRoot, cwd = process.cwd() }) {
  if (!isApprovedFixtureToken(fixtureToken)) {
    throw new Error("invalid fixture token");
  }
  if (fixtureRoot !== REQUIRED_FIXTURE_ROOT) {
    throw new Error("unsupported fixture root");
  }
  const absoluteRoot = resolve(cwd, fixtureRoot);
  const entries = readdirSync(absoluteRoot, { withFileTypes: true });
  const match = entries.find((entry) => {
    if (!entry.isFile()) return false;
    const lowerName = entry.name.toLowerCase();
    return lowerName.startsWith(`${fixtureToken.toLowerCase()}.`) &&
      ALLOWED_IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
  });
  if (!match) {
    throw new Error("approved fixture missing");
  }
  const absoluteFixturePath = resolve(absoluteRoot, match.name);
  const stats = statSync(absoluteFixturePath);
  if (!stats.isFile() || stats.size <= 0) {
    throw new Error("approved fixture empty");
  }
  return readFileSync(absoluteFixturePath);
}

function validateSmokeConfig(config, fixtureToken, configPresent) {
  const blockers = [];
  if (!configPresent) blockers.push("blocked_for_missing_ignored_local_fixture_config");
  if (config.schemaVersion !== AESTHETIC_LOCAL_CV_CALIBRATION_SMOKE_CONFIG_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_smoke_config_schema_version");
  }
  if (config.enabled !== true) blockers.push("blocked_for_calibration_smoke_disabled");
  if (config.allowImageReads !== true) blockers.push("blocked_for_image_reads_not_approved");
  if (config.approvedFixtureMode !== true) blockers.push("blocked_for_approved_fixture_mode_not_enabled");
  if (!Array.isArray(config.approvedFixtureTokens) || config.approvedFixtureTokens.length === 0) {
    blockers.push("blocked_for_missing_approved_fixture_token");
  }
  if (!isApprovedFixtureToken(fixtureToken)) {
    blockers.push("blocked_for_path_traversal_fixture_token");
  }
  if (
    Array.isArray(config.approvedFixtureTokens) &&
    config.approvedFixtureTokens.length > 0 &&
    !config.approvedFixtureTokens.includes(fixtureToken)
  ) {
    blockers.push("blocked_for_non_approved_fixture_token");
  }
  if (config.fixtureRoot !== REQUIRED_FIXTURE_ROOT) {
    blockers.push("blocked_for_unsupported_fixture_root");
  }
  if (config.maxFixtureCount !== 1) blockers.push("blocked_for_max_fixture_count_not_one");
  if (config.allowReportWrite !== false) blockers.push("blocked_for_report_write_not_allowed");
  if (config.allowNetworkCalls !== false) blockers.push("blocked_for_network_calls_not_allowed");
  if (config.allowUploads !== false) blockers.push("blocked_for_uploads_not_allowed");
  for (const flag of [
    "networkCallsMade",
    "uploadPerformed",
    "providerCallAttempted",
    "generatedReportsPersisted",
    "realUserPhotosCommitted",
    "localConfigCommitted",
    "appRuntimeIntegrationEnabled",
    "trainingEnabled",
    "fineTuningEnabled",
    "productionReady"
  ]) {
    if (config[flag] !== false) blockers.push(`blocked_for_${toSnake(flag)}_not_false`);
  }
  if (config.cvInferencePerformed === true) blockers.push("blocked_for_cv_inference_not_allowed");
  if (config.eligibleForAppRuntime === true) blockers.push("blocked_for_app_runtime_eligibility");
  if (config.appRuntimeTransferBlocked !== true) blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  return unique(blockers);
}

function runFixtureGateProbe(fixtureToken) {
  return runAestheticLocalCvCalibrationFixtureGate({
    schemaVersion: AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_CONFIG_SCHEMA_VERSION,
    enabled: true,
    allowImageReads: false,
    approvedFixtureMode: true,
    fixtureRegistryConfigured: true,
    fixtures: [
      {
        fixtureToken: `local_cv_calib_${fixtureToken}`,
        fixtureBucket: "ignored_local_not_read",
        sourceType: "ignored_local_fixture_token",
        approvedForCalibration: true,
        featureKeys: [...AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS],
        imageRefBucket: "ignored_local_not_read",
        humanReviewRequired: true,
        imageReadRequired: false,
        runtimeEligible: false
      }
    ],
    reviewedFixturePolicies: {
      requiresIgnoredLocalRegistry: true,
      requiresApprovedFixtureMode: true,
      requiresNoImageReadDefault: true,
      requiresSyntheticOrIgnoredTokensOnly: true,
      requiresHumanReview: true,
      requiresNoRuntimeEligibility: true
    },
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    generatedReportsPersisted: false,
    realUserPhotosCommitted: false,
    localConfigCommitted: false,
    appRuntimeIntegrationEnabled: false,
    trainingEnabled: false,
    fineTuningEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false
  });
}

function smokeReport({
  fixtureToken,
  fixtureCount = 0,
  blockedReasons,
  calibrationWarnings,
  acceptedForCalibrationReview,
  imageReadsPerformed,
  extractedFeatureVector = null,
  featureBuckets = {},
  hardValidationFailure
}) {
  return {
    schemaVersion: AESTHETIC_LOCAL_CV_CALIBRATION_SMOKE_SCHEMA_VERSION,
    runMode: "ignored_local_fixture_calibration_smoke",
    fixtureToken,
    fixtureCount,
    reviewedFeatureKeys: [...AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS],
    extractedFeatureVector,
    featureBuckets,
    calibrationWarnings,
    acceptedForCalibrationReview,
    blockedReasons,
    hardValidationFailure,
    imageReadsPerformed,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    realUserPhotosCommitted: false,
    localConfigCommitted: false,
    appRuntimeIntegrationEnabled: false,
    trainingEnabled: false,
    fineTuningEnabled: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false
  };
}

function featureVectorFromBytes(bytes) {
  const values = [...bytes];
  const byteLength = values.length;
  const sum = values.reduce((total, value) => total + value, 0);
  const average = sum / byteLength;
  const brightCount = values.filter((value) => value >= 245).length;
  const uniqueCount = new Set(values).size;
  const edgeSample = values.slice(0, Math.min(32, byteLength));
  const edgeAverage = edgeSample.reduce((total, value) => total + value, 0) / edgeSample.length;
  const diffAverage = values.slice(1).reduce((total, value, index) => total + Math.abs(value - values[index]), 0) /
    Math.max(1, byteLength - 1);

  return {
    headroomRatio: roundFeature(((values[0] ?? 37) % 58) / 100),
    horizonAngle: roundFeature((((values[byteLength - 1] ?? 128) % 41) - 20) / 2),
    highlightClipRatio: roundFeature(brightCount / byteLength),
    edgeMargin: roundFeature(Math.max(0.02, Math.min(0.42, edgeAverage / 640))),
    backgroundObjectDensity: roundFeature(uniqueCount / 256),
    sharpnessRatio: roundFeature(Math.max(0, Math.min(1, diffAverage / 96))),
    subjectAnchor: subjectAnchorBucket(average),
    visualWeightMoment: visualWeightBucket(sum, byteLength)
  };
}

function featureBucketsFor(vector) {
  if (!vector) return {};
  return {
    headroomRatio: vector.headroomRatio >= 0.38 ? "high" : "balanced",
    horizonAngle: Math.abs(vector.horizonAngle) >= 2.5 ? "tilted" : "level",
    highlightClipRatio: vector.highlightClipRatio >= 0.18 ? "high_clip" : "contained",
    edgeMargin: vector.edgeMargin <= 0.09 ? "tight_edge" : "comfortable",
    backgroundObjectDensity: vector.backgroundObjectDensity >= 0.65 ? "dense" : "open",
    sharpnessRatio: vector.sharpnessRatio >= 0.55 ? "crisp" : "soft",
    subjectAnchor: vector.subjectAnchor,
    visualWeightMoment: vector.visualWeightMoment
  };
}

function calibrationWarningsFor(vector) {
  const warnings = [];
  if (vector.highlightClipRatio >= 0.35) warnings.push("fixture_has_high_highlight_clip_bucket");
  if (vector.sharpnessRatio <= 0.12) warnings.push("fixture_has_low_sharpness_bucket");
  return warnings;
}

function subjectAnchorBucket(average) {
  if (average < 70) return "left_third";
  if (average > 185) return "right_third";
  if (average > 145) return "upper_center";
  if (average < 105) return "lower_center";
  return "center";
}

function visualWeightBucket(sum, byteLength) {
  const bucket = (sum + byteLength) % 5;
  return ["balanced", "left_heavy", "right_heavy", "top_heavy", "bottom_heavy"][bucket];
}

function isApprovedFixtureToken(value) {
  return /^calibration_[0-9]{3}$/.test(String(value || ""));
}

function isHardBlocker(reason) {
  return HARD_BLOCKER_TOKENS.some((token) => reason.includes(token));
}

function toSnake(value) {
  return String(value).replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}

function roundFeature(value) {
  return Math.round(value * 1000) / 1000;
}

function unique(values) {
  return [...new Set(values)];
}
