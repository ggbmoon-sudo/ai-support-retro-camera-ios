import {
  ALLOWED_FEATURE_KEYS,
  ALLOWED_SAFE_ACTION_KEYS,
  ALLOWED_SUPPRESSION_KEYS,
  ALLOWED_THRESHOLD_KEYS,
  AESTHETIC_PARAMETER_REGISTRY_VERSION,
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";
import {
  aestheticParameterTuningHarnessSample,
  runAestheticParameterTuningDryRun
} from "./aestheticParameterTuningHarness.mjs";

export const AESTHETIC_PARAMETER_PACK_EXPORT_GATE_SCHEMA_VERSION =
  "aesthetic_parameter_pack_export_gate.v1";

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
  "productionReady"
]);

const REQUIRED_FALLBACK_RULES = Object.freeze({
  missingReviewDecision: "keep_candidate_out_of_pack",
  missingBenchmarkSignal: "keep_candidate_out_of_pack",
  unsupportedSignal: "block_pack_generation",
  appRuntimeTransfer: "blocked_until_future_gate"
});

const REQUIRED_BENCHMARK_REQUIREMENTS = Object.freeze({
  syntheticFeatureBenchmarkRequired: true,
  realCvInferenceAllowed: false,
  realImageReadAllowed: false
});

const REQUIRED_REVIEW_REQUIREMENTS = Object.freeze({
  humanReviewRequired: true,
  acceptedCalibrationOrEvalOnlyRequired: true,
  rejectedOrBlockedItemsExcluded: true
});

const REQUIRED_SAFETY_REQUIREMENTS = Object.freeze({
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
  "uicopy",
  "displaycopy",
  "freeformcopy",
  "caption",
  "retake",
  "badphoto",
  "harsh",
  "rawteacher",
  "teachertext",
  "rawlabel",
  "labeltext",
  "appbundle",
  "swiftfile",
  "iosfile",
  "appfilewrite"
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
    "parameterPackCandidate",
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
    "blockedReasons",
    "exportRunMode"
  ].map(normalizeFieldName)
);

export function aestheticParameterPackExportGateSample() {
  const tuningReport = runAestheticParameterTuningDryRun(aestheticParameterTuningHarnessSample());

  return {
    schemaVersion: AESTHETIC_PARAMETER_PACK_EXPORT_GATE_SCHEMA_VERSION,
    parameterPackCandidate: tuningReport.parameterPackCandidate,
    registryVersion: tuningReport.parameterPackCandidate.registryVersion,
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
  };
}

export function runAestheticParameterPackExportGate(input = aestheticParameterPackExportGateSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const candidate = input.parameterPackCandidate || {};
  const gateBlockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...parameterPackBlockers(candidate, registryByTag, input.registryVersion),
    ...forbiddenShapeBlockers(input)
  ]);
  const exportGatePassed = gateBlockedReasons.length === 0;
  const tagKeys = candidateTagKeys(candidate);
  const registryItemsForTags = tagKeys
    .map((tag) => registryByTag.get(tag))
    .filter(Boolean);
  const thresholdCount = countMapArrayValues(candidate.tagThresholds);
  const suppressionRuleCount = countMapArrayValues(candidate.suppressionRules);
  const safeActionMappingCount = candidate.safeActionMappings && typeof candidate.safeActionMappings === "object"
    ? Object.keys(candidate.safeActionMappings).length
    : 0;
  const fallbackRuleCount = candidate.fallbackRules && typeof candidate.fallbackRules === "object"
    ? Object.keys(candidate.fallbackRules).length
    : 0;
  const appTransferReadiness = {
    eligibleForAppTransferCandidate: exportGatePassed,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    requiresODPGate: true,
    requiresXcodeRuntimeReview: true,
    requiresPrivacySafetyReview: true,
    requiresBenchmarkPass: true,
    blockedReasons: exportGatePassed
      ? ["blocked_until_od_p_product_integration_gate"]
      : gateBlockedReasons
  };

  return {
    schemaVersion: AESTHETIC_PARAMETER_PACK_EXPORT_GATE_SCHEMA_VERSION,
    runMode: "parameter_pack_export_gate",
    exportGatePassed,
    exportCandidateVersion: sanitizeToken(candidate.parameterPackVersion || "missing"),
    registryVersion: sanitizeToken(input.registryVersion || candidate.registryVersion || "missing"),
    tagCount: exportGatePassed ? tagKeys.length : 0,
    thresholdCount: exportGatePassed ? thresholdCount : 0,
    suppressionRuleCount: exportGatePassed ? suppressionRuleCount : 0,
    safeActionMappingCount: exportGatePassed ? safeActionMappingCount : 0,
    fallbackRuleCount: exportGatePassed ? fallbackRuleCount : 0,
    blockedReasons: gateBlockedReasons,
    exportArtifactSummary: {
      artifactKind: "parameter_pack_export_candidate",
      artifactWritePerformed: false,
      appRuntimeWritePerformed: false,
      appBundleFileCreated: false,
      iosProjectModified: false,
      swiftFilesModified: false,
      modelFilesIncluded: false,
      rawDataIncluded: false,
      tagKeys: exportGatePassed ? tagKeys.map(sanitizeToken) : [],
      featureKeyCount: exportGatePassed
        ? unique(registryItemsForTags.flatMap((item) => item.featureKeys)).length
        : 0
    },
    benchmarkRequirements: sanitizedRequirementSummary(candidate.benchmarkRequirements, REQUIRED_BENCHMARK_REQUIREMENTS),
    reviewRequirements: sanitizedRequirementSummary(candidate.reviewRequirements, REQUIRED_REVIEW_REQUIREMENTS),
    safetyRequirements: sanitizedRequirementSummary(candidate.safetyRequirements, REQUIRED_SAFETY_REQUIREMENTS),
    appTransferReadiness,
    eligibleForAppTransferCandidate: exportGatePassed,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
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
  };
}

function schemaBoundaryBlockers(input) {
  const blockers = disabledFlagBlockers(input);
  if (input.schemaVersion !== AESTHETIC_PARAMETER_PACK_EXPORT_GATE_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_export_gate_schema_version");
  }
  if (input.exportRunMode !== "dry_run_export_gate") {
    blockers.push("blocked_for_unsupported_export_run_mode");
  }
  if (!input.parameterPackCandidate || typeof input.parameterPackCandidate !== "object") {
    blockers.push("blocked_for_missing_parameter_pack_candidate");
  }
  if (!input.registryVersion) {
    blockers.push("blocked_for_missing_registry_version");
  } else if (input.registryVersion !== AESTHETIC_PARAMETER_REGISTRY_VERSION) {
    blockers.push("blocked_for_registry_version_mismatch");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (input.appRuntimeTransferBlocked === false) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  if (input.eligibleForAppTransferCandidate === true) {
    blockers.push("blocked_for_input_app_transfer_candidate_claim");
  }
  return blockers;
}

function parameterPackBlockers(candidate, registryByTag, inputRegistryVersion) {
  if (!candidate || typeof candidate !== "object") return [];
  const blockers = [];
  if (!candidate.parameterPackVersion) {
    blockers.push("blocked_for_missing_parameter_pack_version");
  }
  if (!candidate.registryVersion) {
    blockers.push("blocked_for_missing_candidate_registry_version");
  } else if (candidate.registryVersion !== inputRegistryVersion || candidate.registryVersion !== AESTHETIC_PARAMETER_REGISTRY_VERSION) {
    blockers.push("blocked_for_candidate_registry_version_mismatch");
  }
  if (candidate.createdFromRunMode !== "dry_run_only") {
    blockers.push("blocked_for_unsupported_created_from_run_mode");
  }
  if (candidate.eligibleForAppRuntime !== false) {
    blockers.push("blocked_for_candidate_app_runtime_eligibility");
  }
  if (candidate.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_candidate_app_runtime_transfer_not_blocked");
  }

  blockers.push(...tagThresholdBlockers(candidate.tagThresholds, registryByTag));
  blockers.push(...suppressionRuleBlockers(candidate.suppressionRules, registryByTag));
  blockers.push(...safeActionMappingBlockers(candidate.safeActionMappings, registryByTag));
  blockers.push(...tagFeatureRequirementBlockers(candidate.tagFeatureRequirements, registryByTag));
  blockers.push(...requiredObjectBlockers(candidate.fallbackRules, REQUIRED_FALLBACK_RULES, "fallback_rules"));
  blockers.push(...requiredObjectBlockers(candidate.benchmarkRequirements, REQUIRED_BENCHMARK_REQUIREMENTS, "benchmark_requirements"));
  blockers.push(...requiredObjectBlockers(candidate.reviewRequirements, REQUIRED_REVIEW_REQUIREMENTS, "review_requirements"));
  blockers.push(...requiredObjectBlockers(candidate.safetyRequirements, REQUIRED_SAFETY_REQUIREMENTS, "safety_requirements"));

  const allMapTags = [
    ...Object.keys(candidate.tagThresholds || {}),
    ...Object.keys(candidate.suppressionRules || {}),
    ...Object.keys(candidate.safeActionMappings || {})
  ];
  if (allMapTags.length === 0) {
    blockers.push("blocked_for_empty_parameter_pack_maps");
  }
  for (const tag of allMapTags) {
    if (!registryByTag.has(tag)) {
      blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(tag)}`);
    }
  }
  return unique(blockers);
}

function tagThresholdBlockers(tagThresholds, registryByTag) {
  if (!tagThresholds || typeof tagThresholds !== "object" || Array.isArray(tagThresholds)) {
    return ["blocked_for_missing_tag_thresholds"];
  }
  const blockers = [];
  for (const [tag, values] of Object.entries(tagThresholds)) {
    const registryItem = registryByTag.get(tag);
    blockers.push(...unsupportedArrayValues("threshold_key", values, ALLOWED_THRESHOLD_KEYS, registryItem?.thresholdKeys || []));
  }
  return blockers;
}

function suppressionRuleBlockers(suppressionRules, registryByTag) {
  if (!suppressionRules || typeof suppressionRules !== "object" || Array.isArray(suppressionRules)) {
    return ["blocked_for_missing_suppression_rules"];
  }
  const blockers = [];
  for (const [tag, values] of Object.entries(suppressionRules)) {
    const registryItem = registryByTag.get(tag);
    blockers.push(...unsupportedArrayValues("suppression_key", values, ALLOWED_SUPPRESSION_KEYS, registryItem?.suppressionKeys || []));
  }
  return blockers;
}

function safeActionMappingBlockers(safeActionMappings, registryByTag) {
  if (!safeActionMappings || typeof safeActionMappings !== "object" || Array.isArray(safeActionMappings)) {
    return ["blocked_for_missing_safe_action_mappings"];
  }
  const blockers = [];
  for (const [tag, safeActionKey] of Object.entries(safeActionMappings)) {
    const registryItem = registryByTag.get(tag);
    if (!ALLOWED_SAFE_ACTION_KEYS.includes(safeActionKey)) {
      blockers.push(`blocked_for_unsupported_safe_action_key_${sanitizeToken(safeActionKey)}`);
    } else if (registryItem && safeActionKey !== registryItem.safeActionKey) {
      blockers.push(`blocked_for_safe_action_key_not_registered_for_tag_${sanitizeToken(safeActionKey)}`);
    }
  }
  return blockers;
}

function tagFeatureRequirementBlockers(tagFeatureRequirements, registryByTag) {
  if (tagFeatureRequirements === undefined) return [];
  if (!tagFeatureRequirements || typeof tagFeatureRequirements !== "object" || Array.isArray(tagFeatureRequirements)) {
    return ["blocked_for_invalid_tag_feature_requirements"];
  }
  const blockers = [];
  for (const [tag, values] of Object.entries(tagFeatureRequirements)) {
    const registryItem = registryByTag.get(tag);
    blockers.push(...unsupportedArrayValues("feature_key", values, ALLOWED_FEATURE_KEYS, registryItem?.featureKeys || []));
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

function forbiddenShapeBlockers(value, path = "parameter_pack_export_gate") {
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

function candidateTagKeys(candidate) {
  return unique([
    ...Object.keys(candidate.tagThresholds || {}),
    ...Object.keys(candidate.suppressionRules || {}),
    ...Object.keys(candidate.safeActionMappings || {})
  ]).sort();
}

function countMapArrayValues(value) {
  if (!value || typeof value !== "object") return 0;
  return Object.values(value).reduce((count, values) =>
    count + (Array.isArray(values) ? values.length : 0), 0
  );
}

function sanitizedRequirementSummary(value, requiredValues) {
  return Object.fromEntries(
    Object.entries(requiredValues).map(([key, expectedValue]) => [
      key,
      value?.[key] === expectedValue ? expectedValue : false
    ])
  );
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
