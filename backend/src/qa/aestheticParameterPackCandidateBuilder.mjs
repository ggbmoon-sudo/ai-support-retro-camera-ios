import {
  AESTHETIC_PARAMETER_CANDIDATE_ACCEPTANCE_GATE_VERSION,
  aestheticParameterCandidateAcceptanceGateSample,
  runAestheticParameterCandidateAcceptanceGate
} from "./aestheticParameterCandidateAcceptanceGate.mjs";

export const AESTHETIC_PARAMETER_PACK_CANDIDATE_BUILDER_SCHEMA_VERSION =
  "aesthetic_parameter_pack_candidate_builder.v1";

export const AESTHETIC_PARAMETER_PACK_CANDIDATE_BUILDER_VERSION =
  "aesthetic_parameter_pack_candidate_builder.v1";

const RUN_MODE = "parameter_pack_candidate_builder_no_export";

const ACCEPTED_CANDIDATE_POLICIES = Object.freeze({
  "horizonAngle.softTiltThreshold": {
    policyKey: "horizon_angle_soft_tilt_threshold_candidate",
    policyKind: "warning_review_only",
    reviewDisposition: "keep_warning_review_only",
    hardBlockerAllowed: false,
    automaticMutationApplied: false
  },
  "visualWeightMoment.balanceWarningPolicy": {
    policyKey: "visual_weight_moment_balance_warning_policy_candidate",
    policyKind: "soft_internal_policy_only",
    reviewDisposition: "keep_soft_only_internal_guidance",
    hardBlockerAllowed: false,
    automaticMutationApplied: false
  }
});

const EXCLUDED_CANDIDATE_REASONS = Object.freeze({
  "headroomRatio.highSoftWarningThreshold": "needs_more_data",
  "sharpnessRatio.lowConfidenceThreshold": "needs_more_data"
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
    "sourceAcceptanceGate",
    "packCandidateBuildMode",
    "schemaVersion",
    "runMode",
    "candidateBuilderVersion",
    "sourceAcceptanceGateVersion",
    "acceptanceGateVersion",
    "sourceDryRunVersion",
    "reviewedCandidateCount",
    "acceptedCandidateCount",
    "needsMoreDataCount",
    "rejectedCandidateCount",
    "blockedCandidateCount",
    "acceptedCandidateKeys",
    "needsMoreDataCandidateKeys",
    "rejectedCandidateKeys",
    "blockedCandidateKeys",
    "excludedCandidateKeys",
    "candidateDecisions",
    "candidateKey",
    "decision",
    "reasonKey",
    "exportEligible",
    "appRuntimeEligible",
    "candidateParameterPack",
    "candidatePackVersion",
    "createdFromRunMode",
    "candidateOnly",
    "internalOnly",
    "userFacing",
    "policyCandidates",
    "parameterKey",
    "policyKey",
    "policyKind",
    "reviewDisposition",
    "hardBlockerAllowed",
    "automaticMutationApplied",
    "productionMutationAllowed",
    "productionValueApplied",
    "exportAllowed",
    "appRuntimeAllowed",
    "excludedCandidates",
    "exclusionReason",
    "reviewRequirements",
    "manualAcceptanceRequired",
    "needsMoreDataExcluded",
    "exportGateRequired",
    "safetyRequirements",
    "noUserFacingAdvice",
    "noNumericJudgmentLanguage",
    "noRawImageOrProviderData",
    "acceptedForPackCandidateReview",
    "eligibleForParameterPackExport",
    "eligibleForAppRuntime",
    "runtimeEligibility",
    "blockedReasons",
    "recommendedNextStep",
    "acceptedForParameterPackCandidateReview"
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
  "debugpayload",
  "debugtext",
  "requestpayload",
  "modelname",
  "apikey",
  "secret",
  "uicopy",
  "displaycopy",
  "freeformcopy",
  "guidancecopy",
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
  "rawpath",
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

export function aestheticParameterPackCandidateBuilderSample() {
  return {
    sourceAcceptanceGate: runAestheticParameterCandidateAcceptanceGate(
      aestheticParameterCandidateAcceptanceGateSample()
    ),
    packCandidateBuildMode: "accepted_candidates_only_review_scaffold",
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

export function runAestheticParameterPackCandidateBuilder(
  input = aestheticParameterPackCandidateBuilderSample()
) {
  const sourceAcceptanceGate = input.sourceAcceptanceGate || {};
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input, sourceAcceptanceGate),
    ...sourceAcceptanceGateBlockers(sourceAcceptanceGate),
    ...candidateDecisionBlockers(sourceAcceptanceGate.candidateDecisions || []),
    ...forbiddenShapeBlockers(input)
  ]);
  const acceptedCandidateKeys = acceptedKeysFor(sourceAcceptanceGate);
  const excludedCandidateKeys = excludedKeysFor(sourceAcceptanceGate);
  const acceptedForPackCandidateReview =
    blockedReasons.length === 0 &&
    acceptedCandidateKeys.length === Object.keys(ACCEPTED_CANDIDATE_POLICIES).length &&
    excludedCandidateKeys.length === Object.keys(EXCLUDED_CANDIDATE_REASONS).length;
  const candidateParameterPack = acceptedForPackCandidateReview
    ? buildCandidateParameterPack(sourceAcceptanceGate, acceptedCandidateKeys, excludedCandidateKeys)
    : null;

  return {
    schemaVersion: AESTHETIC_PARAMETER_PACK_CANDIDATE_BUILDER_SCHEMA_VERSION,
    runMode: RUN_MODE,
    candidateBuilderVersion: AESTHETIC_PARAMETER_PACK_CANDIDATE_BUILDER_VERSION,
    sourceAcceptanceGateVersion: sanitizeToken(sourceAcceptanceGate.acceptanceGateVersion || "missing"),
    acceptedCandidateKeys,
    excludedCandidateKeys,
    candidateParameterPack,
    candidateOnly: true,
    acceptedForPackCandidateReview,
    eligibleForParameterPackExport: false,
    eligibleForAppRuntime: false,
    parameterPackExported: false,
    appRuntimeWritePerformed: false,
    productionReady: false,
    blockedReasons,
    recommendedNextStep: acceptedForPackCandidateReview
      ? "manual local AI review may inspect this OD-R8F candidate scaffold before a future export preflight gate"
      : "resolve pack-candidate builder blockers before scaffold review",
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false
  };
}

function schemaBoundaryBlockers(input, sourceAcceptanceGate) {
  const blockers = disabledFlagBlockers(input);
  if (input.packCandidateBuildMode !== "accepted_candidates_only_review_scaffold") {
    blockers.push("blocked_for_unsupported_pack_candidate_build_mode");
  }
  if (!input.sourceAcceptanceGate ||
    typeof input.sourceAcceptanceGate !== "object" ||
    Array.isArray(input.sourceAcceptanceGate)) {
    blockers.push("blocked_for_missing_source_acceptance_gate");
  }
  if (input.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_input_parameter_pack_export_eligibility");
  }
  if (input.eligibleForAppRuntime === true || input.runtimeEligibility === true) {
    blockers.push("blocked_for_input_app_runtime_eligibility");
  }
  if (sourceAcceptanceGate.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_source_parameter_pack_export_eligibility");
  }
  if (sourceAcceptanceGate.eligibleForAppRuntime === true || sourceAcceptanceGate.runtimeEligibility === true) {
    blockers.push("blocked_for_source_app_runtime_eligibility");
  }
  return blockers;
}

function sourceAcceptanceGateBlockers(sourceAcceptanceGate) {
  const blockers = [];
  if (sourceAcceptanceGate.runMode !== "reviewed_candidate_acceptance_gate_no_export") {
    blockers.push("blocked_for_unsupported_source_acceptance_gate_run_mode");
  }
  if (sourceAcceptanceGate.acceptanceGateVersion !== AESTHETIC_PARAMETER_CANDIDATE_ACCEPTANCE_GATE_VERSION) {
    blockers.push("blocked_for_unsupported_source_acceptance_gate_version");
  }
  if (sourceAcceptanceGate.acceptedForParameterPackCandidateReview !== true) {
    blockers.push("blocked_for_source_acceptance_gate_not_accepted");
  }
  if (sourceAcceptanceGate.productionReady === true) {
    blockers.push("blocked_for_source_production_ready_true");
  }
  for (const flag of DISABLED_FALSE_FLAGS) {
    if (sourceAcceptanceGate[flag] === true) {
      blockers.push(`blocked_for_source_${toSnake(flag)}_true`);
    }
  }
  if (!Array.isArray(sourceAcceptanceGate.candidateDecisions) ||
    sourceAcceptanceGate.candidateDecisions.length === 0) {
    blockers.push("blocked_for_missing_source_candidate_decisions");
  }
  return blockers;
}

function candidateDecisionBlockers(candidateDecisions) {
  const blockers = [];
  const seen = new Set();
  for (const decision of candidateDecisions) {
    if (!decision || typeof decision !== "object" || Array.isArray(decision)) {
      blockers.push("blocked_for_invalid_candidate_decision");
      continue;
    }
    const candidateKey = sanitizeToken(decision.candidateKey || "missing");
    if (seen.has(candidateKey)) {
      blockers.push(`blocked_for_duplicate_candidate_key_${candidateKey}`);
    }
    seen.add(candidateKey);
    if (decision.exportEligible === true) {
      blockers.push(`blocked_for_export_eligible_candidate_${candidateKey}`);
    }
    if (decision.appRuntimeEligible === true) {
      blockers.push(`blocked_for_runtime_eligible_candidate_${candidateKey}`);
    }
    if (decision.userFacing !== false) {
      blockers.push(`blocked_for_user_facing_candidate_${candidateKey}`);
    }
    if (decision.decision === "accepted_for_pack_candidate" &&
      !Object.hasOwn(ACCEPTED_CANDIDATE_POLICIES, candidateKey)) {
      blockers.push(`blocked_for_unsupported_accepted_candidate_${candidateKey}`);
    }
    if (Object.hasOwn(EXCLUDED_CANDIDATE_REASONS, candidateKey) &&
      decision.decision !== EXCLUDED_CANDIDATE_REASONS[candidateKey]) {
      blockers.push(`blocked_for_excluded_candidate_not_needs_more_data_${candidateKey}`);
    }
    if (!Object.hasOwn(ACCEPTED_CANDIDATE_POLICIES, candidateKey) &&
      !Object.hasOwn(EXCLUDED_CANDIDATE_REASONS, candidateKey)) {
      blockers.push(`blocked_for_unknown_candidate_key_${candidateKey}`);
    }
  }
  for (const candidateKey of Object.keys(ACCEPTED_CANDIDATE_POLICIES)) {
    if (!seen.has(candidateKey)) {
      blockers.push(`blocked_for_missing_accepted_candidate_key_${candidateKey}`);
    }
  }
  for (const candidateKey of Object.keys(EXCLUDED_CANDIDATE_REASONS)) {
    if (!seen.has(candidateKey)) {
      blockers.push(`blocked_for_missing_excluded_candidate_key_${candidateKey}`);
    }
  }
  return blockers;
}

function buildCandidateParameterPack(sourceAcceptanceGate, acceptedCandidateKeys, excludedCandidateKeys) {
  return {
    candidatePackVersion: AESTHETIC_PARAMETER_PACK_CANDIDATE_BUILDER_VERSION,
    sourceAcceptanceGateVersion: sanitizeToken(sourceAcceptanceGate.acceptanceGateVersion),
    createdFromRunMode: RUN_MODE,
    candidateOnly: true,
    internalOnly: true,
    userFacing: false,
    policyCandidates: acceptedCandidateKeys.map((parameterKey) => ({
      parameterKey,
      ...ACCEPTED_CANDIDATE_POLICIES[parameterKey],
      candidateOnly: true,
      internalOnly: true,
      userFacing: false,
      productionMutationAllowed: false,
      productionValueApplied: false,
      exportAllowed: false,
      appRuntimeAllowed: false
    })),
    excludedCandidates: excludedCandidateKeys.map((parameterKey) => ({
      parameterKey,
      exclusionReason: EXCLUDED_CANDIDATE_REASONS[parameterKey],
      candidateOnly: true,
      exportAllowed: false,
      appRuntimeAllowed: false
    })),
    reviewRequirements: {
      manualAcceptanceRequired: true,
      needsMoreDataExcluded: true,
      exportGateRequired: true
    },
    safetyRequirements: {
      noUserFacingAdvice: true,
      noNumericJudgmentLanguage: true,
      noRawImageOrProviderData: true
    },
    eligibleForParameterPackExport: false,
    eligibleForAppRuntime: false,
    parameterPackExported: false,
    appRuntimeWritePerformed: false,
    productionReady: false
  };
}

function acceptedKeysFor(sourceAcceptanceGate) {
  return Array.isArray(sourceAcceptanceGate.acceptedCandidateKeys)
    ? sourceAcceptanceGate.acceptedCandidateKeys
      .map(sanitizeToken)
      .filter((candidateKey) => Object.hasOwn(ACCEPTED_CANDIDATE_POLICIES, candidateKey))
      .sort((left, right) => left.localeCompare(right))
    : [];
}

function excludedKeysFor(sourceAcceptanceGate) {
  return Array.isArray(sourceAcceptanceGate.needsMoreDataCandidateKeys)
    ? sourceAcceptanceGate.needsMoreDataCandidateKeys
      .map(sanitizeToken)
      .filter((candidateKey) => Object.hasOwn(EXCLUDED_CANDIDATE_REASONS, candidateKey))
      .sort((left, right) => left.localeCompare(right))
    : [];
}

function disabledFlagBlockers(input) {
  return DISABLED_FALSE_FLAGS
    .filter((flag) => input[flag] === true)
    .map((flag) => `blocked_for_${toSnake(flag)}_true`);
}

function forbiddenShapeBlockers(value, path = "parameter_pack_candidate_builder") {
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
