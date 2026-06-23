import {
  AESTHETIC_PARAMETER_TUNING_DRY_RUN_FROM_BRIDGE_VERSION,
  aestheticParameterTuningDryRunFromBridgeSample,
  runAestheticParameterTuningDryRunFromBridge
} from "./aestheticParameterTuningDryRunFromBridge.mjs";

export const AESTHETIC_PARAMETER_CANDIDATE_ACCEPTANCE_GATE_SCHEMA_VERSION =
  "aesthetic_parameter_candidate_acceptance_gate.v1";

export const AESTHETIC_PARAMETER_CANDIDATE_ACCEPTANCE_GATE_VERSION =
  "aesthetic_parameter_candidate_acceptance_gate.v1";

const RUN_MODE = "reviewed_candidate_acceptance_gate_no_export";

const DECISIONS = Object.freeze([
  "accepted_for_pack_candidate",
  "needs_more_data",
  "rejected",
  "blocked"
]);

const MANUAL_REVIEW_DECISIONS = Object.freeze([
  {
    candidateKey: "visualWeightMoment.balanceWarningPolicy",
    decision: "accepted_for_pack_candidate",
    reasonKey: "spatial_balance_soft_only_internal_guidance"
  },
  {
    candidateKey: "horizonAngle.softTiltThreshold",
    decision: "accepted_for_pack_candidate",
    reasonKey: "tilt_threshold_candidate_strong_tilt_warning_only"
  },
  {
    candidateKey: "headroomRatio.highSoftWarningThreshold",
    decision: "needs_more_data",
    reasonKey: "single_high_headroom_fixture_current_set"
  },
  {
    candidateKey: "sharpnessRatio.lowConfidenceThreshold",
    decision: "needs_more_data",
    reasonKey: "sharpness_distribution_extreme_extractor_review"
  }
]);

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
    "sourceDryRun",
    "manualReviewDecisions",
    "candidateKey",
    "decision",
    "reasonKey",
    "schemaVersion",
    "runMode",
    "acceptanceGateVersion",
    "sourceDryRunVersion",
    "tuningDryRunVersion",
    "sourceBridgeVersion",
    "acceptedForTuningDryRunReview",
    "acceptedForParameterPackCandidateReview",
    "eligibleForParameterPackExport",
    "eligibleForAppRuntime",
    "reviewedCandidateCount",
    "acceptedCandidateCount",
    "needsMoreDataCount",
    "rejectedCandidateCount",
    "blockedCandidateCount",
    "acceptedCandidateKeys",
    "needsMoreDataCandidateKeys",
    "rejectedCandidateKeys",
    "blockedCandidateKeys",
    "candidateDecisions",
    "candidateOnly",
    "automaticMutationApplied",
    "productionMutationAllowed",
    "internalOnly",
    "userFacing",
    "reviewedTuningSignals",
    "proposedParameterAdjustments",
    "adjustmentId",
    "sourceSignalKey",
    "sourceWarningBuckets",
    "targetFeatureKey",
    "targetParameterKey",
    "direction",
    "rationaleBucket",
    "reviewNoteBucket",
    "observedWarningCount",
    "observedFixtureCount",
    "adjustmentRationaleBuckets",
    "blockedReasons",
    "recommendedNextStep",
    "acceptanceReviewMode"
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

export function aestheticParameterCandidateAcceptanceGateSample() {
  return {
    sourceDryRun: runAestheticParameterTuningDryRunFromBridge(
      aestheticParameterTuningDryRunFromBridgeSample()
    ),
    manualReviewDecisions: structuredClone(MANUAL_REVIEW_DECISIONS),
    acceptanceReviewMode: "manual_reviewed_candidates_only",
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

export function runAestheticParameterCandidateAcceptanceGate(
  input = aestheticParameterCandidateAcceptanceGateSample()
) {
  const sourceDryRun = input.sourceDryRun || {};
  const candidateKeys = candidateKeysFor(sourceDryRun);
  const blockedReasons = unique([
    ...schemaBoundaryBlockers(input, sourceDryRun),
    ...sourceDryRunBlockers(sourceDryRun),
    ...manualDecisionBlockers(input.manualReviewDecisions, candidateKeys),
    ...candidateBlockers(sourceDryRun.proposedParameterAdjustments || []),
    ...forbiddenShapeBlockers(input)
  ]);
  const candidateDecisions = buildCandidateDecisions(
    input.manualReviewDecisions || [],
    candidateKeys,
    blockedReasons.length > 0
  );
  const acceptedCandidateKeys = keysForDecision(candidateDecisions, "accepted_for_pack_candidate");
  const needsMoreDataCandidateKeys = keysForDecision(candidateDecisions, "needs_more_data");
  const rejectedCandidateKeys = keysForDecision(candidateDecisions, "rejected");
  const blockedCandidateKeys = keysForDecision(candidateDecisions, "blocked");
  const acceptedForParameterPackCandidateReview =
    blockedReasons.length === 0 &&
    acceptedCandidateKeys.length > 0 &&
    candidateDecisions.length === candidateKeys.length;

  return {
    schemaVersion: AESTHETIC_PARAMETER_CANDIDATE_ACCEPTANCE_GATE_SCHEMA_VERSION,
    runMode: RUN_MODE,
    acceptanceGateVersion: AESTHETIC_PARAMETER_CANDIDATE_ACCEPTANCE_GATE_VERSION,
    sourceDryRunVersion: sanitizeToken(sourceDryRun.tuningDryRunVersion || "missing"),
    reviewedCandidateCount: candidateDecisions.length,
    acceptedCandidateCount: acceptedCandidateKeys.length,
    needsMoreDataCount: needsMoreDataCandidateKeys.length,
    rejectedCandidateCount: rejectedCandidateKeys.length,
    blockedCandidateCount: blockedCandidateKeys.length,
    acceptedCandidateKeys,
    needsMoreDataCandidateKeys,
    rejectedCandidateKeys,
    blockedCandidateKeys,
    candidateDecisions,
    acceptedForParameterPackCandidateReview,
    eligibleForParameterPackExport: false,
    eligibleForAppRuntime: false,
    parameterPackExported: false,
    appRuntimeWritePerformed: false,
    productionReady: false,
    blockedReasons,
    recommendedNextStep: acceptedForParameterPackCandidateReview
      ? "manual local AI review may prepare an OD-R8F pack-candidate scaffold from accepted internal candidates"
      : "resolve acceptance gate blockers before pack-candidate review",
    imageReadsPerformed: false,
    cvInferencePerformed: false,
    networkCallsMade: false,
    uploadPerformed: false,
    providerCallAttempted: false,
    generatedReportsPersisted: false,
    appRuntimeIntegrationEnabled: false
  };
}

function schemaBoundaryBlockers(input, sourceDryRun) {
  const blockers = disabledFlagBlockers(input);
  if (input.acceptanceReviewMode !== "manual_reviewed_candidates_only") {
    blockers.push("blocked_for_unsupported_acceptance_review_mode");
  }
  if (!input.sourceDryRun || typeof input.sourceDryRun !== "object" || Array.isArray(input.sourceDryRun)) {
    blockers.push("blocked_for_missing_source_dry_run");
  }
  if (input.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_input_parameter_pack_export_eligibility");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_input_app_runtime_eligibility");
  }
  if (sourceDryRun.eligibleForParameterPackExport === true) {
    blockers.push("blocked_for_source_parameter_pack_export_eligibility");
  }
  if (sourceDryRun.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_source_app_runtime_eligibility");
  }
  return blockers;
}

function sourceDryRunBlockers(sourceDryRun) {
  const blockers = [];
  if (sourceDryRun.runMode !== "parameter_tuning_dry_run_from_bridge_no_export") {
    blockers.push("blocked_for_unsupported_source_dry_run_run_mode");
  }
  if (sourceDryRun.tuningDryRunVersion !== AESTHETIC_PARAMETER_TUNING_DRY_RUN_FROM_BRIDGE_VERSION) {
    blockers.push("blocked_for_unsupported_source_dry_run_version");
  }
  if (sourceDryRun.acceptedForTuningDryRunReview !== true) {
    blockers.push("blocked_for_source_dry_run_not_accepted");
  }
  if (sourceDryRun.productionReady === true) {
    blockers.push("blocked_for_source_production_ready_true");
  }
  for (const flag of DISABLED_FALSE_FLAGS) {
    if (sourceDryRun[flag] === true) {
      blockers.push(`blocked_for_source_${toSnake(flag)}_true`);
    }
  }
  if (!Array.isArray(sourceDryRun.proposedParameterAdjustments) ||
    sourceDryRun.proposedParameterAdjustments.length === 0) {
    blockers.push("blocked_for_missing_source_adjustment_candidates");
  }
  return blockers;
}

function manualDecisionBlockers(manualReviewDecisions, candidateKeys) {
  const blockers = [];
  if (!Array.isArray(manualReviewDecisions) || manualReviewDecisions.length === 0) {
    return ["blocked_for_missing_manual_review_decisions"];
  }
  const seen = new Set();
  for (const decision of manualReviewDecisions) {
    if (!decision || typeof decision !== "object" || Array.isArray(decision)) {
      blockers.push("blocked_for_invalid_manual_review_decision");
      continue;
    }
    const candidateKey = sanitizeToken(decision.candidateKey || "missing");
    if (!candidateKeys.includes(candidateKey)) {
      blockers.push(`blocked_for_unknown_candidate_key_${candidateKey}`);
    }
    if (seen.has(candidateKey)) {
      blockers.push(`blocked_for_duplicate_candidate_key_${candidateKey}`);
    }
    seen.add(candidateKey);
    if (!DECISIONS.includes(decision.decision)) {
      blockers.push(`blocked_for_unknown_decision_${sanitizeToken(decision.decision || "missing")}`);
    }
    if (!decision.reasonKey || typeof decision.reasonKey !== "string") {
      blockers.push(`blocked_for_missing_reason_key_${candidateKey}`);
    }
  }
  for (const candidateKey of candidateKeys) {
    if (!seen.has(candidateKey)) {
      blockers.push(`blocked_for_unreviewed_candidate_key_${candidateKey}`);
    }
  }
  return blockers;
}

function candidateBlockers(candidates) {
  const blockers = [];
  for (const candidate of candidates) {
    const candidateKey = sanitizeToken(candidate?.targetParameterKey || "missing");
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      blockers.push("blocked_for_invalid_candidate_shape");
      continue;
    }
    if (candidate.candidateOnly !== true) {
      blockers.push(`blocked_for_candidate_only_false_${candidateKey}`);
    }
    if (candidate.automaticMutationApplied === true) {
      blockers.push(`blocked_for_automatic_mutation_${candidateKey}`);
    }
    if (candidate.productionMutationAllowed === true) {
      blockers.push(`blocked_for_production_mutation_${candidateKey}`);
    }
    if (candidate.userFacing !== false) {
      blockers.push(`blocked_for_user_facing_candidate_${candidateKey}`);
    }
  }
  return blockers;
}

function buildCandidateDecisions(manualReviewDecisions, candidateKeys, forceBlocked) {
  const decisionByKey = new Map(
    (Array.isArray(manualReviewDecisions) ? manualReviewDecisions : []).map((decision) => [
      sanitizeToken(decision?.candidateKey || "missing"),
      decision
    ])
  );

  return candidateKeys.map((candidateKey) => {
    const review = decisionByKey.get(candidateKey) || {};
    const decision = forceBlocked ? "blocked" : sanitizeToken(review.decision || "blocked");
    return {
      candidateKey,
      decision,
      reasonKey: sanitizeToken(review.reasonKey || "schema_or_safety_gate_blocked"),
      exportEligible: false,
      appRuntimeEligible: false,
      internalOnly: true,
      userFacing: false
    };
  });
}

function candidateKeysFor(sourceDryRun) {
  if (!Array.isArray(sourceDryRun.proposedParameterAdjustments)) return [];
  return sourceDryRun.proposedParameterAdjustments
    .map((candidate) => sanitizeToken(candidate?.targetParameterKey || "missing"))
    .sort((left, right) => left.localeCompare(right));
}

function keysForDecision(candidateDecisions, decision) {
  return candidateDecisions
    .filter((candidateDecision) => candidateDecision.decision === decision)
    .map((candidateDecision) => candidateDecision.candidateKey)
    .sort((left, right) => left.localeCompare(right));
}

function disabledFlagBlockers(input) {
  return DISABLED_FALSE_FLAGS
    .filter((flag) => input[flag] === true)
    .map((flag) => `blocked_for_${toSnake(flag)}_true`);
}

function forbiddenShapeBlockers(value, path = "parameter_candidate_acceptance_gate") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    if (!ALLOWED_SCHEMA_FIELD_NAMES.has(normalizedKey) &&
      FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))) {
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
