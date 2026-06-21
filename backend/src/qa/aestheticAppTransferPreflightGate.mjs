import {
  ALLOWED_FEATURE_KEYS,
  ALLOWED_SAFE_ACTION_KEYS,
  ALLOWED_SUPPRESSION_KEYS,
  ALLOWED_THRESHOLD_KEYS,
  AESTHETIC_PARAMETER_REGISTRY_VERSION
} from "./aestheticParameterRegistry.mjs";
import {
  AESTHETIC_PARAMETER_PACK_EXPORT_GATE_SCHEMA_VERSION,
  aestheticParameterPackExportGateSample,
  runAestheticParameterPackExportGate
} from "./aestheticParameterPackExportGate.mjs";

export const AESTHETIC_APP_TRANSFER_PREFLIGHT_GATE_SCHEMA_VERSION =
  "aesthetic_app_transfer_preflight_gate.v1";

export const AESTHETIC_APP_TRANSFER_CONTRACT_VERSION =
  "aesthetic_app_transfer_contract.preflight.v1";

const EXPECTED_PARAMETER_PACK_VERSION = "aesthetic_parameter_pack_candidate.dry_run.v1";

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
  "appRuntimeWritePerformed",
  "xcodeProjectModified",
  "appBundleArtifactWritten",
  "productionReady"
]);

const REQUIRED_FALLBACK_RULES = Object.freeze({
  missingReviewDecision: "keep_candidate_out_of_pack",
  missingBenchmarkSignal: "keep_candidate_out_of_pack",
  unsupportedSignal: "block_pack_generation",
  appRuntimeTransfer: "blocked_until_future_gate"
});

const REQUIRED_SAFETY_FLAGS = Object.freeze({
  noSensitiveInference: true,
  noScoresOrRatings: true,
  noRawTeacherText: true,
  noProviderPayload: true,
  noPromptOrRequestPayload: true
});

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
  "rawteacher",
  "teachertext",
  "rawlabel",
  "labeltext",
  "rawmetadata",
  "appbundlepath",
  "appresourcepath",
  "swiftfile",
  "iosfile"
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
  /\.(jpg|jpeg|png|heic|webp|gif|mov|mp4|swift|mlmodel|mlpackage|onnx|tflite|pt|pth|bin|gguf)$/i,
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
    "transferRunMode",
    "exportCandidate",
    "appContract",
    "contractVersion",
    "expectedParameterPackVersion",
    "supportedRegistryVersion",
    "supportedFeatureKeys",
    "supportedThresholdKeys",
    "supportedSuppressionKeys",
    "supportedSafeActionKeys",
    "requiredFallbackRules",
    "requiredSafetyFlags",
    "uiCopyMode",
    "allowsRawTeacherText",
    "allowsScores",
    "allowsSensitiveInference",
    "allowsProviderPayload",
    "requiresCreativeIntentGuard",
    "requiresOfflineFallback",
    "requiresKillSwitch",
    "parameterPackVersion",
    "registryVersion",
    "createdFromRunMode",
    "tagThresholds",
    "suppressionRules",
    "safeActionMappings",
    "tagFeatureRequirements",
    "fallbackRules",
    "missingReviewDecision",
    "missingBenchmarkSignal",
    "unsupportedSignal",
    "appRuntimeTransfer",
    "reviewRequirements",
    "humanReviewRequired",
    "acceptedCalibrationOrEvalOnlyRequired",
    "rejectedOrBlockedItemsExcluded",
    "benchmarkRequirements",
    "syntheticFeatureBenchmarkRequired",
    "realCvInferenceAllowed",
    "realImageReadAllowed",
    "safetyRequirements",
    "noSensitiveInference",
    "noScoresOrRatings",
    "noRawTeacherText",
    "noProviderPayload",
    "noPromptOrRequestPayload",
    "eligibleForAppRuntime",
    "appRuntimeTransferBlocked",
    "blockedReasons"
  ].map(normalizeFieldName)
);

export function aestheticAppTransferPreflightGateSample() {
  const exportGateInput = aestheticParameterPackExportGateSample();
  return {
    schemaVersion: AESTHETIC_APP_TRANSFER_PREFLIGHT_GATE_SCHEMA_VERSION,
    transferRunMode: "preflight_only",
    exportCandidate: exportGateInput.parameterPackCandidate,
    appContract: aestheticAppTransferContractSample(),
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
    appRuntimeWritePerformed: false,
    xcodeProjectModified: false,
    appBundleArtifactWritten: false,
    productionReady: false
  };
}

export function aestheticAppTransferContractSample() {
  return {
    contractVersion: AESTHETIC_APP_TRANSFER_CONTRACT_VERSION,
    expectedParameterPackVersion: EXPECTED_PARAMETER_PACK_VERSION,
    supportedRegistryVersion: AESTHETIC_PARAMETER_REGISTRY_VERSION,
    supportedFeatureKeys: [...ALLOWED_FEATURE_KEYS],
    supportedThresholdKeys: [...ALLOWED_THRESHOLD_KEYS],
    supportedSuppressionKeys: [...ALLOWED_SUPPRESSION_KEYS],
    supportedSafeActionKeys: [...ALLOWED_SAFE_ACTION_KEYS],
    requiredFallbackRules: { ...REQUIRED_FALLBACK_RULES },
    requiredSafetyFlags: { ...REQUIRED_SAFETY_FLAGS },
    uiCopyMode: "language_pack_only",
    allowsRawTeacherText: false,
    allowsScores: false,
    allowsSensitiveInference: false,
    allowsProviderPayload: false,
    requiresCreativeIntentGuard: true,
    requiresOfflineFallback: true,
    requiresKillSwitch: true
  };
}

export function runAestheticAppTransferPreflightGate(
  input = aestheticAppTransferPreflightGateSample()
) {
  const exportCandidate = input.exportCandidate || {};
  const appContract = input.appContract || {};
  const exportGateReport = runAestheticParameterPackExportGate({
    schemaVersion: AESTHETIC_PARAMETER_PACK_EXPORT_GATE_SCHEMA_VERSION,
    parameterPackCandidate: exportCandidate,
    registryVersion: exportCandidate.registryVersion,
    exportRunMode: "dry_run_export_gate",
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
    appRuntimeWritePerformed: false,
    productionReady: false
  });
  const missingAppContractRequirements = appContractBlockers(appContract, exportCandidate);
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...exportGateReport.blockedReasons.map((reason) => `blocked_for_export_candidate_${reason}`),
    ...missingAppContractRequirements,
    ...forbiddenShapeBlockers(input)
  ]);
  const preflightPassed = blockedReasons.length === 0;
  const contractCompatibility = buildContractCompatibility(
    appContract,
    exportCandidate,
    missingAppContractRequirements,
    exportGateReport
  );

  return {
    schemaVersion: AESTHETIC_APP_TRANSFER_PREFLIGHT_GATE_SCHEMA_VERSION,
    runMode: "app_transfer_preflight",
    preflightPassed,
    eligibleForAppTransferCandidate: preflightPassed,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    appRuntimeWritePerformed: false,
    xcodeProjectModified: false,
    appBundleArtifactWritten: false,
    contractCompatibility,
    missingAppContractRequirements,
    blockedReasons,
    appTransferChecklist: {
      exportCandidateStructurallyValidated: exportGateReport.exportGatePassed,
      appContractCompatible: missingAppContractRequirements.length === 0,
      languagePackOnlyUiCopy: appContract.uiCopyMode === "language_pack_only",
      creativeIntentGuardRequired: appContract.requiresCreativeIntentGuard === true,
      offlineFallbackRequired: appContract.requiresOfflineFallback === true,
      killSwitchRequired: appContract.requiresKillSwitch === true,
      eligibleForAppTransferCandidate: preflightPassed,
      eligibleForAppRuntime: false,
      appRuntimeTransferBlocked: true,
      requiresODP1BOrExplicitIntegrationPhase: true
    },
    xcodeReviewChecklist: {
      xcodeProjectModified: false,
      appBundleArtifactWritten: false,
      appRuntimeWritePerformed: false,
      parameterPackCopiedToAppResources: false,
      swiftRuntimeBehaviorChanged: false,
      requiresXcodeRuntimeReview: true
    },
    privacySafetyChecklist: {
      rawTeacherTextAllowed: false,
      scoreOrRatingAllowed: false,
      sensitiveInferenceAllowed: false,
      providerPayloadAllowed: false,
      promptOrDebugLeakageAllowed: false,
      imagePathUrlBase64Allowed: false,
      gpsExifRawMetadataAllowed: false,
      creativeIntentGuardRequired: true,
      offlineFallbackRequired: true,
      killSwitchRequired: true
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
    productionReady: false
  };
}

function schemaBoundaryBlockers(input) {
  const blockers = disabledFlagBlockers(input);
  if (input.schemaVersion !== AESTHETIC_APP_TRANSFER_PREFLIGHT_GATE_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_app_transfer_preflight_schema_version");
  }
  if (input.transferRunMode !== "preflight_only") {
    blockers.push("blocked_for_unsupported_transfer_run_mode");
  }
  if (!input.exportCandidate || typeof input.exportCandidate !== "object") {
    blockers.push("blocked_for_missing_export_candidate");
  }
  if (!input.appContract || typeof input.appContract !== "object") {
    blockers.push("blocked_for_missing_app_contract");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (input.appRuntimeTransferBlocked === false) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function appContractBlockers(appContract, exportCandidate) {
  if (!appContract || typeof appContract !== "object") {
    return ["blocked_for_missing_app_contract"];
  }
  const blockers = [];
  if (!appContract.contractVersion) {
    blockers.push("blocked_for_missing_app_contract_version");
  } else if (appContract.contractVersion !== AESTHETIC_APP_TRANSFER_CONTRACT_VERSION) {
    blockers.push("blocked_for_unsupported_app_contract_version");
  }
  if (appContract.expectedParameterPackVersion !== exportCandidate.parameterPackVersion) {
    blockers.push("blocked_for_expected_parameter_pack_version_mismatch");
  }
  if (appContract.supportedRegistryVersion !== exportCandidate.registryVersion ||
    appContract.supportedRegistryVersion !== AESTHETIC_PARAMETER_REGISTRY_VERSION) {
    blockers.push("blocked_for_supported_registry_version_mismatch");
  }

  blockers.push(...unsupportedSetBlockers(
    "feature_key",
    candidateFeatureKeys(exportCandidate),
    appContract.supportedFeatureKeys,
    ALLOWED_FEATURE_KEYS
  ));
  blockers.push(...unsupportedSetBlockers(
    "threshold_key",
    mapArrayValues(exportCandidate.tagThresholds),
    appContract.supportedThresholdKeys,
    ALLOWED_THRESHOLD_KEYS
  ));
  blockers.push(...unsupportedSetBlockers(
    "suppression_key",
    mapArrayValues(exportCandidate.suppressionRules),
    appContract.supportedSuppressionKeys,
    ALLOWED_SUPPRESSION_KEYS
  ));
  blockers.push(...unsupportedSetBlockers(
    "safe_action_key",
    Object.values(exportCandidate.safeActionMappings || {}),
    appContract.supportedSafeActionKeys,
    ALLOWED_SAFE_ACTION_KEYS
  ));

  blockers.push(...requiredObjectBlockers(
    appContract.requiredFallbackRules,
    REQUIRED_FALLBACK_RULES,
    "app_contract_fallback_rules"
  ));
  blockers.push(...requiredObjectBlockers(
    appContract.requiredSafetyFlags,
    REQUIRED_SAFETY_FLAGS,
    "app_contract_safety_flags"
  ));

  if (appContract.uiCopyMode !== "language_pack_only") {
    blockers.push("blocked_for_app_contract_ui_copy_not_language_pack_only");
  }
  if (appContract.allowsRawTeacherText !== false) {
    blockers.push("blocked_for_app_contract_allows_raw_teacher_text");
  }
  if (appContract.allowsScores !== false) {
    blockers.push("blocked_for_app_contract_allows_scores");
  }
  if (appContract.allowsSensitiveInference !== false) {
    blockers.push("blocked_for_app_contract_allows_sensitive_inference");
  }
  if (appContract.allowsProviderPayload !== false) {
    blockers.push("blocked_for_app_contract_allows_provider_payload");
  }
  if (appContract.requiresCreativeIntentGuard !== true) {
    blockers.push("blocked_for_app_contract_missing_creative_intent_guard");
  }
  if (appContract.requiresOfflineFallback !== true) {
    blockers.push("blocked_for_app_contract_missing_offline_fallback");
  }
  if (appContract.requiresKillSwitch !== true) {
    blockers.push("blocked_for_app_contract_missing_kill_switch");
  }

  return unique(blockers);
}

function buildContractCompatibility(appContract, exportCandidate, blockers, exportGateReport) {
  return {
    contractVersion: sanitizeToken(appContract.contractVersion || "missing"),
    expectedParameterPackVersion: sanitizeToken(appContract.expectedParameterPackVersion || "missing"),
    expectedParameterPackVersionMatched:
      appContract.expectedParameterPackVersion === exportCandidate.parameterPackVersion,
    supportedRegistryVersion: sanitizeToken(appContract.supportedRegistryVersion || "missing"),
    registryVersionMatched:
      appContract.supportedRegistryVersion === exportCandidate.registryVersion &&
      exportCandidate.registryVersion === AESTHETIC_PARAMETER_REGISTRY_VERSION,
    exportCandidateStructurallyValidated: exportGateReport.exportGatePassed,
    featureKeysSupported: !blockers.some((reason) => reason.includes("feature_key")),
    thresholdKeysSupported: !blockers.some((reason) => reason.includes("threshold_key")),
    suppressionKeysSupported: !blockers.some((reason) => reason.includes("suppression_key")),
    safeActionKeysSupported: !blockers.some((reason) => reason.includes("safe_action_key")),
    fallbackRulesSupported: !blockers.some((reason) => reason.includes("fallback_rules")),
    safetyFlagsSupported: !blockers.some((reason) => reason.includes("safety_flags")),
    uiCopyMode: appContract.uiCopyMode === "language_pack_only"
      ? "language_pack_only"
      : "blocked",
    rawTeacherTextAllowed: false,
    scoresAllowed: false,
    sensitiveInferenceAllowed: false,
    providerPayloadAllowed: false
  };
}

function unsupportedSetBlockers(kind, values, supportedValues, globallyAllowedValues) {
  if (!Array.isArray(supportedValues) || supportedValues.length === 0) {
    return [`blocked_for_missing_supported_${kind}s`];
  }
  const blockers = [];
  for (const value of unique(values)) {
    if (!globallyAllowedValues.includes(value)) {
      blockers.push(`blocked_for_unknown_${kind}_${sanitizeToken(value)}`);
    } else if (!supportedValues.includes(value)) {
      blockers.push(`blocked_for_app_contract_unsupported_${kind}_${sanitizeToken(value)}`);
    }
  }
  return blockers;
}

function requiredObjectBlockers(value, requiredValues, kind) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [`blocked_for_missing_${kind}`];
  }
  const blockers = [];
  for (const [field, expectedValue] of Object.entries(requiredValues)) {
    if (!(field in value)) {
      blockers.push(`blocked_for_missing_${kind}_${toSnake(field)}`);
    } else if (value[field] !== expectedValue) {
      blockers.push(`blocked_for_invalid_${kind}_${toSnake(field)}`);
    }
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "app_transfer_preflight") {
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

function candidateFeatureKeys(exportCandidate) {
  return unique([
    ...mapArrayValues(exportCandidate.tagFeatureRequirements),
    ...Object.keys(exportCandidate.tagThresholds || {})
      .flatMap((tag) => tagFeatureKeysFromThresholds(tag, exportCandidate))
  ]);
}

function tagFeatureKeysFromThresholds(tag, exportCandidate) {
  const thresholdKeys = exportCandidate.tagThresholds?.[tag] || [];
  if (thresholdKeys.includes("headroom_soft_high") || thresholdKeys.includes("headroom_strong_high")) {
    return ["subjectBox", "faceBox", "headroomRatio"];
  }
  if (thresholdKeys.includes("horizon_tilt_soft") || thresholdKeys.includes("horizon_tilt_strong")) {
    return ["horizonAngle"];
  }
  return [];
}

function mapArrayValues(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.values(value).flatMap((item) => Array.isArray(item) ? item : []);
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
