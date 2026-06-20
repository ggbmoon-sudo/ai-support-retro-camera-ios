import {
  AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
  evaluateAestheticCloudTeacherContract
} from "./aestheticCloudTeacherContract.mjs";
import {
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";

export const AESTHETIC_PARAMETER_CANDIDATE_RUNNER_SCHEMA_VERSION =
  "aesthetic_parameter_candidate_runner_dry_run.v1";

const DISABLED_FLAGS = Object.freeze([
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "productionReady"
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
  "harsh"
]);

const FORBIDDEN_EXACT_FIELDS = Object.freeze([
  "age",
  "agebucket",
  "agelabel",
  "estimatedage",
  "rawimage",
  "imagebase64",
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
    "teacherRuns",
    "request",
    "response",
    "schemaVersion",
    "jobId",
    "imageId",
    "registryVersion",
    "allowedTagSubset",
    "assetRefType",
    "assetRefBucket",
    "sourceType",
    "teacherMode",
    "humanReviewRequired",
    "candidateLabels",
    "tag",
    "confidence",
    "severity",
    "evidenceKeys",
    "featureBuckets",
    "thresholdSignals",
    "suppressionCandidates",
    "safeActionKey",
    "needsHumanReview",
    "safety",
    "sensitiveInferenceDetected",
    "scoreOrRatingDetected",
    "chainOfThoughtDetected",
    "debugLeakageDetected",
    "rawProviderPayloadDetected",
    "rawPromptDetected",
    "identityInferenceDetected",
    "review",
    "reviewStatus",
    "appTransferReadiness",
    "eligibleForParameterTuning",
    "eligibleForAppRuntime",
    "requiresHumanReview",
    "requiresBenchmark",
    "requiresSafetyGate",
    "requiresPerformanceGate",
    "appRuntimeTransferBlocked",
    "blockedReasons"
  ].map(normalizeFieldName)
);

export function aestheticParameterCandidateRunnerSample() {
  const registry = aestheticParameterRegistry();
  const selectedItems = registry.items.slice(0, 3);
  const allowedTagSubset = selectedItems.map((item) => item.tag);
  const request = {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
    jobId: "job_synthetic_teacher_stub_001",
    imageId: "img_synthetic_teacher_stub_001",
    registryVersion: registry.registryVersion,
    allowedTagSubset,
    assetRefType: "synthetic_stub",
    assetRefBucket: "synthetic_stub",
    sourceType: "synthetic",
    teacherMode: "contract_stub_only",
    humanReviewRequired: true
  };
  const response = {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
    jobId: request.jobId,
    imageId: request.imageId,
    candidateLabels: selectedItems.map((item) => ({
      tag: item.tag,
      confidence: "unknown",
      severity: "unknown",
      evidenceKeys: item.evidenceTypes,
      featureBuckets: item.featureKeys,
      thresholdSignals: item.thresholdKeys,
      suppressionCandidates: item.suppressionKeys,
      safeActionKey: item.safeActionKey,
      needsHumanReview: true
    })),
    safety: {
      sensitiveInferenceDetected: false,
      scoreOrRatingDetected: false,
      chainOfThoughtDetected: false,
      debugLeakageDetected: false,
      rawProviderPayloadDetected: false,
      rawPromptDetected: false,
      identityInferenceDetected: false
    },
    review: {
      humanReviewRequired: true,
      reviewStatus: "pending"
    },
    appTransferReadiness: {
      eligibleForParameterTuning: false,
      eligibleForAppRuntime: false,
      requiresHumanReview: true,
      requiresBenchmark: true,
      requiresSafetyGate: true,
      requiresPerformanceGate: true,
      appRuntimeTransferBlocked: true,
      blockedReasons: ["blocked_until_human_review_benchmark_safety_and_performance_gates"]
    }
  };

  return {
    teacherRuns: [{ request, response }],
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false
  };
}

export function runAestheticParameterCandidateDryRun(input = aestheticParameterCandidateRunnerSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const teacherRuns = Array.isArray(input.teacherRuns) ? input.teacherRuns : [];
  const globalBlockedReasons = unique([
    ...disabledFlagBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...forbiddenShapeBlockers(input)
  ]);

  const runResults = teacherRuns.map((teacherRun) => evaluateTeacherRun(teacherRun, registryByTag, globalBlockedReasons));
  const acceptedCandidates = runResults.flatMap((run) => run.parameterCandidates);
  const blockedReasons = unique(runResults.flatMap((run) => run.blockedReasons));

  return {
    schemaVersion: AESTHETIC_PARAMETER_CANDIDATE_RUNNER_SCHEMA_VERSION,
    runMode: "dry_run",
    teacherRunCount: teacherRuns.length,
    parameterCandidateCount: acceptedCandidates.length,
    categoryCounts: countBy(acceptedCandidates, "category"),
    tagCounts: countBy(acceptedCandidates, "tag"),
    featureKeyCounts: countArrayValues(acceptedCandidates, "featureKeys"),
    thresholdKeyCounts: countArrayValues(acceptedCandidates, "thresholdKeys"),
    suppressionCandidateCounts: countArrayValues(acceptedCandidates, "suppressionCandidates"),
    safeActionCounts: countBy(acceptedCandidates, "safeActionKey"),
    blockedReasons,
    appTransferReadiness: {
      eligibleForParameterTuning: false,
      eligibleForAppRuntime: false,
      requiresHumanReview: true,
      requiresBenchmark: true,
      requiresSafetyGate: true,
      requiresPerformanceGate: true,
      appRuntimeTransferBlocked: true,
      blockedReasons: ["blocked_until_human_review_benchmark_safety_and_performance_gates"]
    },
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false,
    eligibleForAppRuntime: false,
    appRuntimeTransferBlocked: true,
    dryRunValid: teacherRuns.length > 0 && blockedReasons.length === 0
  };
}

function evaluateTeacherRun(teacherRun, registryByTag, globalBlockedReasons) {
  const request = teacherRun.request || {};
  const response = teacherRun.response || {};
  const contractReport = evaluateAestheticCloudTeacherContract({
    request,
    response,
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    rawImagesCommitted: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false
  });
  const runBlockedReasons = unique([
    ...globalBlockedReasons,
    ...(contractReport.contractValid
      ? []
      : contractReport.blockedReasons.map((reason) => `blocked_for_contract_${reason}`)),
    ...appTransferFlagBlockers(response.appTransferReadiness)
  ]);

  return {
    blockedReasons: runBlockedReasons,
    parameterCandidates: runBlockedReasons.length === 0
      ? response.candidateLabels.map((label) => parameterCandidateFromLabel(label, request, registryByTag))
      : []
  };
}

function parameterCandidateFromLabel(label, request, registryByTag) {
  const registryItem = registryByTag.get(label.tag);
  return {
    candidateId: sanitizeToken(`${request.jobId}:${label.tag}`),
    jobId: sanitizeToken(request.jobId),
    imageId: sanitizeToken(request.imageId),
    tag: sanitizeToken(label.tag),
    category: sanitizeToken(registryItem.category),
    featureKeys: registryItem.featureKeys.map(sanitizeToken),
    thresholdKeys: registryItem.thresholdKeys.map(sanitizeToken),
    suppressionCandidates: label.suppressionCandidates.map(sanitizeToken),
    safeActionKey: sanitizeToken(label.safeActionKey),
    evidenceKeys: label.evidenceKeys.map(sanitizeToken),
    confidence: sanitizeToken(label.confidence),
    severity: sanitizeToken(label.severity),
    humanReviewRequired: true,
    status: "parameter_candidate_dry_run_only"
  };
}

function appTransferFlagBlockers(readiness) {
  if (!readiness || typeof readiness !== "object") return [];
  const blockers = [];
  if (readiness.eligibleForAppRuntime !== false) {
    blockers.push("blocked_for_app_runtime_transfer_eligibility");
  }
  if (readiness.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function forbiddenShapeBlockers(value, path = "candidate_runner") {
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

function countBy(items, field) {
  return items.reduce((counts, item) => {
    const key = item[field];
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function countArrayValues(items, field) {
  return items.reduce((counts, item) => {
    for (const value of item[field] || []) {
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }, {});
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
