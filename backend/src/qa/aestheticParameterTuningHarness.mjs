import {
  ALLOWED_FEATURE_KEYS,
  ALLOWED_SAFE_ACTION_KEYS,
  ALLOWED_SUPPRESSION_KEYS,
  ALLOWED_THRESHOLD_KEYS,
  AESTHETIC_PARAMETER_REGISTRY_VERSION,
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";
import { aestheticHumanReviewQueueSample, evaluateAestheticHumanReviewQueue } from "./aestheticHumanReviewQueue.mjs";
import { aestheticLocalCvFeatureBenchmarkSample, runAestheticLocalCvFeatureBenchmark } from "./aestheticLocalCvFeatureBenchmark.mjs";

export const AESTHETIC_PARAMETER_TUNING_HARNESS_SCHEMA_VERSION =
  "aesthetic_parameter_tuning_harness_dry_run.v1";

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
  "productionReady"
]);

const APP_TRANSFER_BLOCKED_REASONS = Object.freeze([
  "blocked_until_parameter_pack_benchmark_safety_performance_and_runtime_transfer_gates"
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
  /\.(jpg|jpeg|png|heic|webp|gif|mov|mp4)$/i,
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
    "registryVersion",
    "parameterCandidates",
    "candidateId",
    "jobId",
    "imageId",
    "tag",
    "category",
    "featureKeys",
    "thresholdKeys",
    "suppressionCandidates",
    "safeActionKey",
    "evidenceKeys",
    "confidence",
    "severity",
    "humanReviewRequired",
    "status",
    "reviewItems",
    "reviewItemId",
    "sourceType",
    "sourceId",
    "candidateSummary",
    "reviewStatus",
    "reviewRequired",
    "tuningEligible",
    "eligibleForAppRuntime",
    "appRuntimeTransferBlocked",
    "blockedReasons",
    "reviewDecisions",
    "decision",
    "reviewerRole",
    "decisionReasonKey",
    "acceptedUse",
    "calibration",
    "evaluation",
    "tuningCandidate",
    "appRuntime",
    "featureBenchmarkSignals",
    "vectorId",
    "featureSignals",
    "thresholdSignals",
    "tuningRunMode"
  ].map(normalizeFieldName)
);

export function aestheticParameterTuningHarnessSample() {
  const registry = aestheticParameterRegistry();
  const reviewQueue = aestheticHumanReviewQueueSample();
  const benchmark = aestheticLocalCvFeatureBenchmarkSample();
  const selectedTags = [
    "ERR_COMP_RULE_OF_THIRDS_MISS",
    "ERR_COMP_EXCESSIVE_HEADROOM",
    "ERR_COMP_HORIZON_TILT"
  ];
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));

  return {
    schemaVersion: AESTHETIC_PARAMETER_TUNING_HARNESS_SCHEMA_VERSION,
    registryVersion: registry.registryVersion,
    parameterCandidates: selectedTags.map((tag, index) =>
      parameterCandidateFromRegistryItem(registryByTag.get(tag), index + 1)
    ),
    reviewItems: reviewQueue.reviewItems,
    reviewDecisions: reviewQueue.reviewDecisions,
    featureBenchmarkSignals: benchmark.featureVectors,
    tuningRunMode: "dry_run_only",
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

export function runAestheticParameterTuningDryRun(input = aestheticParameterTuningHarnessSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const parameterCandidates = Array.isArray(input.parameterCandidates) ? input.parameterCandidates : [];
  const reviewItems = Array.isArray(input.reviewItems) ? input.reviewItems : [];
  const reviewDecisions = Array.isArray(input.reviewDecisions) ? input.reviewDecisions : [];
  const featureBenchmarkSignals = Array.isArray(input.featureBenchmarkSignals) ? input.featureBenchmarkSignals : [];
  const reviewQueueInput = reviewQueueInputFrom(input, reviewItems, reviewDecisions);
  const reviewQueueReport = evaluateAestheticHumanReviewQueue(reviewQueueInput);
  const benchmarkInput = benchmarkInputFrom(input, featureBenchmarkSignals, reviewQueueInput);
  const benchmarkReport = runAestheticLocalCvFeatureBenchmark(benchmarkInput);
  const reviewedUsesByTag = acceptedUsesByTag(reviewItems, reviewDecisions);
  const acceptedBenchmarkByTag = acceptedBenchmarkSignalsByTag(featureBenchmarkSignals, benchmarkReport);

  const globalBlockedReasons = unique([
    ...schemaBoundaryBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...(reviewQueueReport.reviewQueueValid
      ? []
      : reviewQueueReport.blockedReasons.map((reason) => `blocked_for_review_queue_${reason}`)),
    ...(benchmarkReport.benchmarkValid
      ? []
      : benchmarkReport.blockedReasons.map((reason) => `blocked_for_feature_benchmark_${reason}`)),
    ...forbiddenShapeBlockers(input)
  ]);

  const candidateResults = parameterCandidates.map((candidate) =>
    evaluateParameterCandidate(candidate, registryByTag, reviewedUsesByTag, acceptedBenchmarkByTag)
  );
  const blockedReasons = unique([
    ...globalBlockedReasons,
    ...candidateResults.flatMap((result) => result.hardBlockedReasons)
  ]);
  const packEligibleResults = blockedReasons.length === 0
    ? candidateResults.filter((result) => result.acceptedForParameterPack)
    : [];
  const rejectedCandidateResults = blockedReasons.length === 0
    ? candidateResults.filter((result) => !result.acceptedForParameterPack)
    : candidateResults;

  const thresholdMapCandidate = mapCandidateArrayValues(packEligibleResults, "thresholdKeys");
  const suppressionRuleMapCandidate = mapCandidateArrayValues(packEligibleResults, "suppressionCandidates");
  const safeActionMapCandidate = Object.fromEntries(
    packEligibleResults.map((result) => [result.tag, result.safeActionKey])
  );
  const parameterPackCandidate = buildParameterPackCandidate({
    registryVersion: sanitizeToken(input.registryVersion || "unknown"),
    thresholdMapCandidate,
    suppressionRuleMapCandidate,
    safeActionMapCandidate,
    blockedReasons
  });

  return {
    schemaVersion: AESTHETIC_PARAMETER_TUNING_HARNESS_SCHEMA_VERSION,
    runMode: "parameter_tuning_dry_run",
    inputCandidateCount: parameterCandidates.length,
    acceptedForCalibrationCount: packEligibleResults.filter((result) => result.acceptedUse?.calibration === true).length,
    acceptedForEvalOnlyCount: packEligibleResults.filter((result) =>
      result.acceptedUse?.evaluation === true && result.acceptedUse?.calibration !== true
    ).length,
    rejectedCandidateCount: rejectedCandidateResults.length,
    parameterPackCandidate,
    thresholdMapCandidate,
    suppressionRuleMapCandidate,
    safeActionMapCandidate,
    blockedReasons,
    benchmarkReadiness: {
      benchmarkValid: benchmarkReport.benchmarkValid,
      acceptedVectorCount: benchmarkReport.acceptedVectorCount,
      rejectedVectorCount: benchmarkReport.rejectedVectorCount,
      requiresSyntheticFeatureSignals: true,
      cvInferencePerformed: false
    },
    appTransferReadiness: {
      eligibleForParameterTuning: false,
      eligibleForAppRuntime: false,
      requiresHumanReview: true,
      requiresBenchmark: true,
      requiresSafetyGate: true,
      requiresPerformanceGate: true,
      appRuntimeTransferBlocked: true,
      blockedReasons: APP_TRANSFER_BLOCKED_REASONS
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
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    productionReady: false,
    tuningDryRunValid: parameterCandidates.length > 0 && blockedReasons.length === 0
  };
}

function parameterCandidateFromRegistryItem(registryItem, index) {
  return {
    candidateId: `candidate_synthetic_tuning_${String(index).padStart(3, "0")}`,
    jobId: `job_synthetic_tuning_${String(index).padStart(3, "0")}`,
    imageId: `img_synthetic_tuning_${String(index).padStart(3, "0")}`,
    tag: registryItem.tag,
    category: registryItem.category,
    featureKeys: registryItem.featureKeys,
    thresholdKeys: registryItem.thresholdKeys,
    suppressionCandidates: registryItem.suppressionKeys,
    safeActionKey: registryItem.safeActionKey,
    evidenceKeys: registryItem.evidenceTypes,
    confidence: "unknown",
    severity: "unknown",
    humanReviewRequired: true,
    status: "parameter_candidate_dry_run_only"
  };
}

function reviewQueueInputFrom(input, reviewItems, reviewDecisions) {
  return {
    schemaVersion: "aesthetic_human_review_queue.v1",
    reviewItems,
    reviewDecisions,
    humanReviewRequired: true,
    cloudTeacherEnabled: input.cloudTeacherEnabled === false ? false : input.cloudTeacherEnabled,
    providerConfigured: input.providerConfigured === false ? false : input.providerConfigured,
    networkCallsMade: input.networkCallsMade === false ? false : input.networkCallsMade,
    imageReadsPerformed: input.imageReadsPerformed === false ? false : input.imageReadsPerformed,
    crawlerEnabled: input.crawlerEnabled === false ? false : input.crawlerEnabled,
    downloadEnabled: input.downloadEnabled === false ? false : input.downloadEnabled,
    trainingEnabled: input.trainingEnabled === false ? false : input.trainingEnabled,
    runtimeIntegrationEnabled: input.runtimeIntegrationEnabled === false ? false : input.runtimeIntegrationEnabled,
    productionReady: input.productionReady === false ? false : input.productionReady
  };
}

function benchmarkInputFrom(input, featureBenchmarkSignals, reviewQueueInput) {
  return {
    featureVectors: featureBenchmarkSignals,
    reviewQueueInput,
    cloudTeacherEnabled: input.cloudTeacherEnabled === false ? false : input.cloudTeacherEnabled,
    providerConfigured: input.providerConfigured === false ? false : input.providerConfigured,
    networkCallsMade: input.networkCallsMade === false ? false : input.networkCallsMade,
    imageReadsPerformed: input.imageReadsPerformed === false ? false : input.imageReadsPerformed,
    crawlerEnabled: input.crawlerEnabled === false ? false : input.crawlerEnabled,
    downloadEnabled: input.downloadEnabled === false ? false : input.downloadEnabled,
    trainingEnabled: input.trainingEnabled === false ? false : input.trainingEnabled,
    runtimeIntegrationEnabled: input.runtimeIntegrationEnabled === false ? false : input.runtimeIntegrationEnabled,
    eligibleForAppRuntime: input.eligibleForAppRuntime === true ? true : false,
    appRuntimeTransferBlocked: input.appRuntimeTransferBlocked === false ? false : true,
    productionReady: input.productionReady === false ? false : input.productionReady
  };
}

function evaluateParameterCandidate(candidate, registryByTag, reviewedUsesByTag, acceptedBenchmarkByTag) {
  const registryItem = registryByTag.get(candidate.tag);
  const hardBlockedReasons = [
    ...missingFieldBlockers(candidate, [
      "candidateId",
      "jobId",
      "imageId",
      "tag",
      "category",
      "featureKeys",
      "thresholdKeys",
      "suppressionCandidates",
      "safeActionKey",
      "evidenceKeys",
      "humanReviewRequired",
      "status"
    ], "parameter_candidate"),
    ...candidateBoundaryBlockers(candidate)
  ];

  if (!registryItem) {
    hardBlockedReasons.push(`blocked_for_unknown_registry_tag_${sanitizeToken(candidate.tag)}`);
  } else {
    if (candidate.category !== registryItem.category) {
      hardBlockedReasons.push(`blocked_for_category_not_registered_for_tag_${sanitizeToken(candidate.category)}`);
    }
    hardBlockedReasons.push(...unsupportedArrayValues("feature_key", candidate.featureKeys, ALLOWED_FEATURE_KEYS, registryItem.featureKeys));
    hardBlockedReasons.push(...unsupportedArrayValues("threshold_key", candidate.thresholdKeys, ALLOWED_THRESHOLD_KEYS, registryItem.thresholdKeys));
    hardBlockedReasons.push(...unsupportedArrayValues("suppression_candidate", candidate.suppressionCandidates, ALLOWED_SUPPRESSION_KEYS, registryItem.suppressionKeys));
    if (!ALLOWED_SAFE_ACTION_KEYS.includes(candidate.safeActionKey)) {
      hardBlockedReasons.push(`blocked_for_unsupported_safe_action_key_${sanitizeToken(candidate.safeActionKey)}`);
    } else if (candidate.safeActionKey !== registryItem.safeActionKey) {
      hardBlockedReasons.push(`blocked_for_safe_action_key_not_registered_for_tag_${sanitizeToken(candidate.safeActionKey)}`);
    }
  }

  const acceptedUse = reviewedUsesByTag.get(candidate.tag);
  const benchmarkSignal = acceptedBenchmarkByTag.get(candidate.tag);
  const rejectedReasons = [];
  if (!acceptedUse || (acceptedUse.calibration !== true && acceptedUse.evaluation !== true)) {
    rejectedReasons.push(`rejected_for_missing_accepted_review_decision_${sanitizeToken(candidate.tag)}`);
  }
  if (!benchmarkSignal) {
    rejectedReasons.push(`rejected_for_missing_accepted_benchmark_signal_${sanitizeToken(candidate.tag)}`);
  }
  if (candidate.tuningCandidate === true && acceptedUse?.tuningCandidate !== true) {
    hardBlockedReasons.push(`blocked_for_tuning_candidate_without_calibration_acceptance_${sanitizeToken(candidate.tag)}`);
  }
  if (["reject", "block"].includes(acceptedUse?.decision) && candidate.tuningCandidate === true) {
    hardBlockedReasons.push(`blocked_for_rejected_or_blocked_candidate_used_for_tuning_${sanitizeToken(candidate.tag)}`);
  }

  return {
    tag: sanitizeToken(candidate.tag),
    thresholdKeys: Array.isArray(benchmarkSignal?.thresholdSignals)
      ? benchmarkSignal.thresholdSignals.map(sanitizeToken)
      : [],
    suppressionCandidates: Array.isArray(benchmarkSignal?.suppressionCandidates)
      ? benchmarkSignal.suppressionCandidates.map(sanitizeToken)
      : [],
    safeActionKey: sanitizeToken(benchmarkSignal?.safeActionKey || candidate.safeActionKey),
    acceptedUse,
    hardBlockedReasons,
    rejectedReasons,
    acceptedForParameterPack: hardBlockedReasons.length === 0 && rejectedReasons.length === 0
  };
}

function candidateBoundaryBlockers(candidate) {
  const blockers = [];
  if (candidate.humanReviewRequired !== true) {
    blockers.push("blocked_for_human_review_required_not_true");
  }
  if (candidate.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_candidate_app_runtime_eligibility");
  }
  if (candidate.appRuntimeTransferBlocked === false) {
    blockers.push("blocked_for_candidate_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function acceptedUsesByTag(reviewItems, reviewDecisions) {
  const itemById = new Map(reviewItems.map((item) => [item.reviewItemId, item]));
  const uses = new Map();

  for (const decision of reviewDecisions) {
    const item = itemById.get(decision.reviewItemId);
    if (!item || !decision.acceptedUse) continue;
    uses.set(item.tag, {
      calibration: decision.acceptedUse.calibration === true,
      evaluation: decision.acceptedUse.evaluation === true,
      tuningCandidate: decision.acceptedUse.tuningCandidate === true,
      appRuntime: decision.acceptedUse.appRuntime === true,
      decision: sanitizeToken(decision.decision)
    });
  }

  return uses;
}

function acceptedBenchmarkSignalsByTag(featureBenchmarkSignals, benchmarkReport) {
  if (!benchmarkReport.benchmarkValid) return new Map();
  const acceptedTags = new Set(
    Object.entries(benchmarkReport.tagBenchmarkCounts || {})
      .filter(([, count]) => count > 0)
      .map(([tag]) => tag)
  );
  const map = new Map();

  for (const signal of featureBenchmarkSignals) {
    if (!acceptedTags.has(signal.tag)) continue;
    if (["accepted_for_calibration", "accepted_for_eval_only"].includes(signal.reviewStatus)) {
      map.set(signal.tag, signal);
    }
  }

  return map;
}

function buildParameterPackCandidate({
  registryVersion,
  thresholdMapCandidate,
  suppressionRuleMapCandidate,
  safeActionMapCandidate,
  blockedReasons
}) {
  return {
    parameterPackVersion: "aesthetic_parameter_pack_candidate.dry_run.v1",
    registryVersion,
    createdFromRunMode: "dry_run_only",
    tagThresholds: thresholdMapCandidate,
    suppressionRules: suppressionRuleMapCandidate,
    safeActionMappings: safeActionMapCandidate,
    fallbackRules: {
      missingReviewDecision: "keep_candidate_out_of_pack",
      missingBenchmarkSignal: "keep_candidate_out_of_pack",
      unsupportedSignal: "block_pack_generation",
      appRuntimeTransfer: "blocked_until_future_gate"
    },
    reviewRequirements: {
      humanReviewRequired: true,
      acceptedCalibrationOrEvalOnlyRequired: true,
      rejectedOrBlockedItemsExcluded: true
    },
    benchmarkRequirements: {
      syntheticFeatureBenchmarkRequired: true,
      realCvInferenceAllowed: false,
      realImageReadAllowed: false
    },
    safetyRequirements: {
      noSensitiveInference: true,
      noScoresOrRatings: true,
      noRawTeacherText: true,
      noProviderPayload: true,
      noPromptOrRequestPayload: true
    },
    appRuntimeTransferBlocked: true,
    eligibleForAppRuntime: false,
    blockedReasons: blockedReasons.length > 0
      ? blockedReasons
      : APP_TRANSFER_BLOCKED_REASONS
  };
}

function schemaBoundaryBlockers(input) {
  const blockers = [
    ...disabledFlagBlockers(input)
  ];
  if (input.schemaVersion !== AESTHETIC_PARAMETER_TUNING_HARNESS_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_tuning_harness_schema_version");
  }
  if (input.registryVersion !== AESTHETIC_PARAMETER_REGISTRY_VERSION) {
    blockers.push("blocked_for_registry_version_mismatch");
  }
  if (input.tuningRunMode !== "dry_run_only") {
    blockers.push("blocked_for_unsupported_tuning_run_mode");
  }
  if (!Array.isArray(input.parameterCandidates) || input.parameterCandidates.length === 0) {
    blockers.push("blocked_for_missing_parameter_candidates");
  }
  if (!Array.isArray(input.reviewItems) || input.reviewItems.length === 0) {
    blockers.push("blocked_for_missing_review_items");
  }
  if (!Array.isArray(input.reviewDecisions)) {
    blockers.push("blocked_for_missing_review_decisions");
  }
  if (!Array.isArray(input.featureBenchmarkSignals) || input.featureBenchmarkSignals.length === 0) {
    blockers.push("blocked_for_missing_feature_benchmark_signals");
  }
  if (input.eligibleForAppRuntime === true) {
    blockers.push("blocked_for_app_runtime_eligibility");
  }
  if (input.appRuntimeTransferBlocked === false) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "parameter_tuning_harness") {
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

function mapCandidateArrayValues(candidateResults, field) {
  return Object.fromEntries(
    candidateResults.map((result) => [result.tag, unique(result[field] || [])])
  );
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
