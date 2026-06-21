import { AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS } from "./aestheticLocalCvFeatureExtractorPrototype.mjs";

export const AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_GATE_SCHEMA_VERSION =
  "aesthetic_local_cv_calibration_fixture_gate.v1";

export const AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_CONFIG_SCHEMA_VERSION =
  "aesthetic_local_cv_calibration_fixture_config.v1";

const DISABLED_FLAGS = Object.freeze([
  "imageReadsPerformed",
  "cvInferencePerformed",
  "networkCallsMade",
  "uploadPerformed",
  "generatedReportsPersisted",
  "realUserPhotosCommitted",
  "localConfigCommitted",
  "appRuntimeIntegrationEnabled",
  "trainingEnabled",
  "fineTuningEnabled",
  "productionReady"
]);

const REQUIRED_FIXTURE_FIELDS = Object.freeze([
  "fixtureToken",
  "fixtureBucket",
  "sourceType",
  "approvedForCalibration",
  "featureKeys",
  "imageRefBucket",
  "humanReviewRequired",
  "imageReadRequired",
  "runtimeEligible"
]);

const ALLOWED_SOURCE_TYPES = Object.freeze([
  "synthetic_fixture_token",
  "ignored_local_fixture_token"
]);

const ALLOWED_IMAGE_REF_BUCKETS = Object.freeze([
  "synthetic_no_image",
  "ignored_local_not_read"
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
  "rawprompt",
  "prompttext",
  "providerpayload",
  "providerresponse",
  "rawresponse",
  "debugtext",
  "requestpayload",
  "apikey",
  "secret",
  "xiaoyi",
  "relay",
  "cloudprovider",
  "modelurl",
  "rawimage",
  "imagebase64",
  "gps",
  "exif"
]);

const FORBIDDEN_EXACT_FIELDS = Object.freeze([
  "path",
  "filepath",
  "localfilepath",
  "photopath",
  "imagepath",
  "url",
  "realurl",
  "base64",
  "api_key",
  "apikey",
  "authorization",
  "bearer"
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
  /api[_-]?key/i,
  /secret/i,
  /bearer/i
]);

const ALLOWED_SCHEMA_FIELD_NAMES = new Set(
  [
    ...DISABLED_FLAGS,
    ...REQUIRED_FIXTURE_FIELDS,
    "schemaVersion",
    "enabled",
    "allowImageReads",
    "approvedFixtureMode",
    "fixtureRegistryConfigured",
    "fixtures",
    "reviewedFixturePolicies",
    "requiresIgnoredLocalRegistry",
    "requiresApprovedFixtureMode",
    "requiresNoImageReadDefault",
    "requiresSyntheticOrIgnoredTokensOnly",
    "requiresHumanReview",
    "requiresNoRuntimeEligibility",
    "eligibleForAppRuntime",
    "appRuntimeTransferBlocked"
  ].map(normalizeFieldName)
);

export function aestheticLocalCvCalibrationFixtureGateDisabledConfig() {
  return {
    schemaVersion: AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_CONFIG_SCHEMA_VERSION,
    enabled: false,
    allowImageReads: false,
    approvedFixtureMode: false,
    fixtureRegistryConfigured: false,
    fixtures: [],
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
  };
}

export function aestheticLocalCvCalibrationFixtureGateApprovedSyntheticSample() {
  return {
    ...aestheticLocalCvCalibrationFixtureGateDisabledConfig(),
    enabled: true,
    approvedFixtureMode: true,
    fixtureRegistryConfigured: true,
    fixtures: [
      {
        fixtureToken: "local_cv_calib_synthetic_headroom_001",
        fixtureBucket: "synthetic_headroom",
        sourceType: "synthetic_fixture_token",
        approvedForCalibration: true,
        featureKeys: ["headroomRatio", "horizonAngle"],
        imageRefBucket: "synthetic_no_image",
        humanReviewRequired: true,
        imageReadRequired: false,
        runtimeEligible: false
      },
      {
        fixtureToken: "local_cv_calib_ignored_weight_001",
        fixtureBucket: "ignored_local_not_read",
        sourceType: "ignored_local_fixture_token",
        approvedForCalibration: true,
        featureKeys: ["subjectAnchor", "visualWeightMoment", "backgroundObjectDensity"],
        imageRefBucket: "ignored_local_not_read",
        humanReviewRequired: true,
        imageReadRequired: false,
        runtimeEligible: false
      }
    ]
  };
}

export function runAestheticLocalCvCalibrationFixtureGate(
  input = aestheticLocalCvCalibrationFixtureGateDisabledConfig()
) {
  const fixtures = Array.isArray(input.fixtures) ? input.fixtures : [];
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...fixtures.flatMap((fixture) => fixtureBlockers(fixture)),
    ...forbiddenShapeBlockers(input)
  ]);
  const missingRequirements = missingFixtureRequirements(input, fixtures);
  const hardValidationFailure = blockedReasons.some((reason) =>
    ![
      "blocked_for_fixture_gate_disabled",
      "blocked_for_missing_ignored_fixture_registry_config",
      "blocked_for_approved_fixture_mode_not_enabled",
      "blocked_for_missing_approved_fixtures"
    ].includes(reason)
  );
  const approvedFixtures = blockedReasons.length === 0
    ? fixtures.filter((fixture) => fixture.approvedForCalibration === true)
    : [];
  const eligibleForCalibration = blockedReasons.length === 0 && approvedFixtures.length > 0;

  return {
    schemaVersion: AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_GATE_SCHEMA_VERSION,
    gateName: "aesthetic_local_cv_calibration_fixture_gate",
    runMode: "fixture_gate_no_image_read",
    eligibleForCalibration,
    fixtureRegistryConfigured: input.fixtureRegistryConfigured === true,
    approvedFixtureCount: eligibleForCalibration ? approvedFixtures.length : 0,
    approvedFixtureBuckets: eligibleForCalibration
      ? unique(approvedFixtures.map((fixture) => sanitizeToken(fixture.fixtureBucket))).sort()
      : [],
    missingRequirements,
    blockedReasons,
    reviewedFeatureKeys: eligibleForCalibration
      ? unique(approvedFixtures.flatMap((fixture) => fixture.featureKeys).map(sanitizeToken)).sort()
      : [],
    reviewedFixturePolicies: {
      requiresIgnoredLocalRegistry: input.reviewedFixturePolicies?.requiresIgnoredLocalRegistry === true,
      requiresApprovedFixtureMode: input.reviewedFixturePolicies?.requiresApprovedFixtureMode === true,
      requiresNoImageReadDefault: input.reviewedFixturePolicies?.requiresNoImageReadDefault === true,
      requiresSyntheticOrIgnoredTokensOnly: input.reviewedFixturePolicies?.requiresSyntheticOrIgnoredTokensOnly === true,
      requiresHumanReview: input.reviewedFixturePolicies?.requiresHumanReview === true,
      requiresNoRuntimeEligibility: input.reviewedFixturePolicies?.requiresNoRuntimeEligibility === true
    },
    hardValidationFailure,
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
  };
}

function schemaBoundaryBlockers(input) {
  const blockers = disabledFlagBlockers(input);
  if (input.schemaVersion !== AESTHETIC_LOCAL_CV_CALIBRATION_FIXTURE_CONFIG_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_fixture_config_schema_version");
  }
  if (input.enabled !== true) {
    blockers.push("blocked_for_fixture_gate_disabled");
  }
  if (input.fixtureRegistryConfigured !== true) {
    blockers.push("blocked_for_missing_ignored_fixture_registry_config");
  }
  if (input.approvedFixtureMode !== true) {
    blockers.push("blocked_for_approved_fixture_mode_not_enabled");
  }
  if (input.allowImageReads !== false) {
    blockers.push("blocked_for_image_reads_not_allowed_in_od_r7c");
  }
  if (!Array.isArray(input.fixtures) || input.fixtures.length === 0) {
    blockers.push("blocked_for_missing_approved_fixtures");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (input.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function fixtureBlockers(fixture) {
  const blockers = missingFieldBlockers(fixture, REQUIRED_FIXTURE_FIELDS, "fixture");
  if (typeof fixture.fixtureToken !== "string" || !/^local_cv_calib_[a-z0-9_]{3,80}$/.test(fixture.fixtureToken)) {
    blockers.push("blocked_for_invalid_fixture_token_shape");
  }
  if (!ALLOWED_SOURCE_TYPES.includes(fixture.sourceType)) {
    blockers.push(`blocked_for_unsupported_fixture_source_type_${sanitizeToken(fixture.sourceType)}`);
  }
  if (!ALLOWED_IMAGE_REF_BUCKETS.includes(fixture.imageRefBucket)) {
    blockers.push(`blocked_for_unsupported_image_ref_bucket_${sanitizeToken(fixture.imageRefBucket)}`);
  }
  if (fixture.approvedForCalibration !== true) {
    blockers.push("blocked_for_fixture_not_approved_for_calibration");
  }
  if (fixture.humanReviewRequired !== true) {
    blockers.push("blocked_for_fixture_human_review_not_required");
  }
  if (fixture.imageReadRequired !== false) {
    blockers.push("blocked_for_fixture_image_read_required");
  }
  if (fixture.runtimeEligible !== false) {
    blockers.push("blocked_for_fixture_runtime_eligible");
  }
  if (!Array.isArray(fixture.featureKeys) || fixture.featureKeys.length === 0) {
    blockers.push("blocked_for_missing_fixture_feature_keys");
  } else {
    for (const featureKey of fixture.featureKeys) {
      if (!AESTHETIC_LOCAL_CV_EXTRACTOR_FEATURE_KEYS.includes(featureKey)) {
        blockers.push(`blocked_for_unknown_feature_key_${sanitizeToken(featureKey)}`);
      }
    }
  }
  return blockers;
}

function missingFixtureRequirements(input, fixtures) {
  const missing = [];
  if (input.enabled !== true) missing.push("enable_fixture_gate_in_ignored_local_config");
  if (input.fixtureRegistryConfigured !== true) missing.push("configure_ignored_local_fixture_registry");
  if (input.approvedFixtureMode !== true) missing.push("approve_fixture_mode_in_ignored_local_config");
  if (input.allowImageReads !== false) missing.push("keep_image_reads_disabled_for_od_r7c");
  if (!Array.isArray(fixtures) || fixtures.length === 0) missing.push("add_approved_synthetic_or_ignored_fixture_tokens");
  return missing;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "local_cv_calibration_fixture_gate") {
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

function missingFieldBlockers(value, requiredFields, path) {
  return requiredFields
    .filter((field) => !(field in (value || {})))
    .map((field) => `blocked_for_missing_${sanitizeToken(path)}_${sanitizeToken(field)}`);
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
