import {
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";
import {
  aestheticParameterMiningBotDryRunSample,
  runAestheticParameterMiningBotDryRun
} from "./aestheticParameterMiningBotDryRun.mjs";
import {
  AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
  evaluateAestheticCloudTeacherContract
} from "./aestheticCloudTeacherContract.mjs";

export const AESTHETIC_CLOUD_TEACHER_SANDBOX_SCHEMA_VERSION =
  "aesthetic_cloud_teacher_sandbox_preflight.v1";

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
    "jobPlan",
    "registryVersion",
    "sourceType",
    "appTransferReadiness",
    "eligibleForParameterTuning",
    "eligibleForAppRuntime",
    "requiresHumanReview",
    "requiresBenchmark",
    "requiresSafetyGate",
    "requiresPerformanceGate",
    "appRuntimeTransferBlocked",
    "blockedReasons",
    "jobId",
    "imageId",
    "sourceId",
    "assetRefType",
    "assetRefBucket",
    "allowedTagSubset",
    "humanReviewRequired",
    "teacherMode",
    "status"
  ].map(normalizeFieldName)
);

export function aestheticCloudTeacherSandboxSample() {
  const dryRun = runAestheticParameterMiningBotDryRun(aestheticParameterMiningBotDryRunSample());
  return {
    registryVersion: dryRun.registryVersion,
    jobPlan: dryRun.jobPlan,
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

export function runAestheticCloudTeacherSandboxPreflight(input = aestheticCloudTeacherSandboxSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const jobPlan = Array.isArray(input.jobPlan) ? input.jobPlan : [];
  const globalBlockedReasons = unique([
    ...disabledFlagBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...forbiddenShapeBlockers(input),
    ...appTransferFlagBlockers(input.appTransferReadiness)
  ]);

  const stubResults = jobPlan.map((job) => buildStubResult(job, input, registry, registryByTag, globalBlockedReasons));
  const accepted = stubResults.filter((result) => result.status === "accepted_stub_response");
  const rejected = stubResults.filter((result) => result.status === "rejected_stub_response");

  return {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_SANDBOX_SCHEMA_VERSION,
    runMode: "stub_only",
    inputJobCount: jobPlan.length,
    acceptedStubResponseCount: accepted.length,
    rejectedStubResponseCount: rejected.length,
    blockedReasons: unique(stubResults.flatMap((result) => result.blockedReasons)),
    candidateLabelCounts: candidateLabelCounts(accepted),
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
    stubResponses: stubResults.map((result) => ({
      jobId: result.jobId,
      imageId: result.imageId,
      candidateLabelCount: result.candidateLabelCount,
      status: result.status,
      blockedReasons: result.blockedReasons,
      contractValid: result.contractValid
    })),
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false,
    preflightValid: jobPlan.length > 0 && rejected.length === 0 && globalBlockedReasons.length === 0
  };
}

function buildStubResult(job, input, registry, registryByTag, globalBlockedReasons) {
  const jobReasons = unique([
    ...globalBlockedReasons,
    ...jobPlanBlockers(job, registry, registryByTag),
    ...appTransferFlagBlockers(job.appTransferReadiness)
  ]);
  const request = teacherRequestFromJob(job, input, registry);
  const response = teacherResponseFromJob(job, registryByTag);
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
  const contractReasons = contractReport.contractValid
    ? []
    : contractReport.blockedReasons.map((reason) => `blocked_for_contract_${reason}`);
  const blockedReasons = unique([...jobReasons, ...contractReasons]);

  return {
    jobId: sanitizeToken(job.jobId || "unknown_job"),
    imageId: sanitizeToken(job.imageId || "unknown_image"),
    candidateLabelCount: Array.isArray(response.candidateLabels) ? response.candidateLabels.length : 0,
    status: blockedReasons.length === 0 ? "accepted_stub_response" : "rejected_stub_response",
    blockedReasons,
    contractValid: contractReport.contractValid
  };
}

function teacherRequestFromJob(job, input, registry) {
  return {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
    jobId: sanitizeToken(job.jobId || "unknown_job"),
    imageId: sanitizeToken(job.imageId || "unknown_image"),
    registryVersion: sanitizeToken(input.registryVersion || registry.registryVersion),
    allowedTagSubset: sanitizedTags(job.allowedTagSubset),
    assetRefType: sanitizeToken(job.assetRefType || "unknown"),
    assetRefBucket: sanitizeToken(job.assetRefBucket || "unknown"),
    sourceType: sanitizeToken(job.sourceType || input.sourceType || "synthetic"),
    teacherMode: "contract_stub_only",
    humanReviewRequired: true
  };
}

function teacherResponseFromJob(job, registryByTag) {
  const candidateLabels = sanitizedTags(job.allowedTagSubset)
    .filter((tag) => registryByTag.has(tag))
    .map((tag) => {
      const registryItem = registryByTag.get(tag);
      return {
        tag,
        confidence: "unknown",
        severity: "unknown",
        evidenceKeys: registryItem.evidenceTypes,
        featureBuckets: registryItem.featureKeys,
        thresholdSignals: registryItem.thresholdKeys,
        suppressionCandidates: registryItem.suppressionKeys,
        safeActionKey: registryItem.safeActionKey,
        needsHumanReview: true
      };
    });

  return {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
    jobId: sanitizeToken(job.jobId || "unknown_job"),
    imageId: sanitizeToken(job.imageId || "unknown_image"),
    candidateLabels,
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
}

function jobPlanBlockers(job, registry, registryByTag) {
  const blockers = [];
  if (job.status !== "eligible_for_teacher_stub_dry_run") {
    blockers.push(`blocked_for_job_not_eligible_${sanitizeToken(job.jobId)}`);
  }
  if (job.teacherMode !== "stub_only") {
    blockers.push(`blocked_for_job_teacher_mode_not_stub_only_${sanitizeToken(job.jobId)}`);
  }
  if (job.humanReviewRequired !== true) {
    blockers.push(`blocked_for_missing_human_review_requirement_${sanitizeToken(job.jobId)}`);
  }
  if (job.registryVersion && job.registryVersion !== registry.registryVersion) {
    blockers.push(`blocked_for_registry_version_mismatch_${sanitizeToken(job.jobId)}`);
  }

  const tags = Array.isArray(job.allowedTagSubset) ? job.allowedTagSubset : [];
  if (tags.length === 0) {
    blockers.push(`blocked_for_empty_allowed_tag_subset_${sanitizeToken(job.jobId)}`);
  }
  for (const tag of tags) {
    if (!registryByTag.has(tag)) {
      blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(tag)}`);
    }
  }

  return blockers;
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

function forbiddenShapeBlockers(value, path = "sandbox") {
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

function candidateLabelCounts(results) {
  return {
    total: results.reduce((sum, result) => sum + result.candidateLabelCount, 0)
  };
}

function sanitizedTags(tags) {
  return Array.isArray(tags) ? tags.map(sanitizeToken) : [];
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
