import {
  AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
  evaluateAestheticCloudTeacherContract
} from "./aestheticCloudTeacherContract.mjs";
import {
  createDisabledCloudTeacherProviderAdapter,
  isCloudTeacherProviderAdapter
} from "./aestheticCloudTeacherProviderAdapter.mjs";
import {
  disabledAestheticCloudTeacherProviderGateConfig,
  evaluateAestheticCloudTeacherProviderGate
} from "./aestheticCloudTeacherProviderGate.mjs";
import {
  REDACTION_POLICY,
  buildAestheticCloudTeacherRequestEnvelope
} from "./aestheticCloudTeacherRequestEnvelope.mjs";
import {
  AESTHETIC_HUMAN_REVIEW_QUEUE_SCHEMA_VERSION,
  aestheticHumanReviewQueueSample,
  evaluateAestheticHumanReviewQueue
} from "./aestheticHumanReviewQueue.mjs";
import {
  aestheticParameterMiningBotDryRunSample,
  runAestheticParameterMiningBotDryRun
} from "./aestheticParameterMiningBotDryRun.mjs";
import { aestheticParameterRegistry } from "./aestheticParameterRegistry.mjs";

export const AESTHETIC_CLOUD_TEACHER_PROVIDER_SMOKE_HARNESS_SCHEMA_VERSION =
  "aesthetic_cloud_teacher_provider_smoke_harness.v1";

const APPROVED_PROVIDER_SMOKE_SAMPLE_MODES = Object.freeze([
  "approved_local_ignored_sample",
  "approved_consented_sample"
]);

const EXECUTION_FALSE_FLAGS = Object.freeze([
  "networkCallsMade",
  "imageReadsPerformed",
  "rawPromptPersisted",
  "rawProviderResponsePersisted",
  "rawRequestPayloadPersisted",
  "generatedReportsPersisted",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "eligibleForAppRuntime",
  "productionReady"
]);

const FORBIDDEN_FIELD_FRAGMENTS = Object.freeze([
  "rawimage",
  "imagebase64",
  "base64",
  "localfilepath",
  "filepath",
  "imagepath",
  "path",
  "url",
  "signedurl",
  "realurl",
  "prompt",
  "providerpayload",
  "requestpayload",
  "providerrequest",
  "providerresponse",
  "rawresponse",
  "modelname",
  "providermodel",
  "apikey",
  "api_key",
  "secret",
  "token",
  "authorization",
  "bearer",
  "userid",
  "useridentity",
  "gps",
  "exif",
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
  "debugtext",
  "uicopy",
  "displaycopy",
  "freeformcopy",
  "caption"
].map(normalizeFieldName));

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
  /secret/i,
  /bearer\s+/i
]);

const ALLOWED_HARNESS_FIELD_NAMES = new Set([
  "config",
  "configPath",
  "explicitConfigProvided",
  "runProviderSmoke",
  "adapter",
  "adapterMode",
  "allowStubResponse",
  "reviewQueueRequirement",
  "appRuntimeTransferBlocked",
  "humanReviewRequired",
  "reviewQueueRequired",
  ...EXECUTION_FALSE_FLAGS
].map(normalizeFieldName));

export async function runAestheticCloudTeacherProviderSmokeHarness(input = {}) {
  const config = input.config || disabledAestheticCloudTeacherProviderGateConfig();
  const explicitConfigProvided = input.explicitConfigProvided === true;
  const runProviderSmoke = input.runProviderSmoke === true;
  const adapter = isCloudTeacherProviderAdapter(input.adapter)
    ? input.adapter
    : createDisabledCloudTeacherProviderAdapter();
  const gateReport = evaluateAestheticCloudTeacherProviderGate({
    config,
    explicitConfigProvided
  });
  const envelopeReport = buildRequestEnvelopeProbe(input.reviewQueueRequirement);
  const baseReviewQueueReport = evaluateAestheticHumanReviewQueue(aestheticHumanReviewQueueSample());

  const harnessHardReasons = unique([
    ...executionFlagBlockers(input),
    ...forbiddenShapeBlockers(input, "provider_smoke_harness_input"),
    ...providerFlagBlockers({
      runProviderSmoke,
      explicitConfigProvided,
      config,
      configPath: input.configPath,
      gateReport
    }),
    ...envelopeReport.blockedReasons
  ]);
  const hardReasons = unique([
    ...harnessHardReasons,
    ...(gateReport.hardValidationFailure ? gateReport.blockedReasons : [])
  ]);

  const shouldUseStub = input.allowStubResponse === true && adapter.adapterMode === "stub_test_only";
  const canAskAdapter = shouldUseStub && hardReasons.length === 0;
  const adapterResult = canAskAdapter
    ? await adapter.requestTeacherLabels(envelopeReport.envelope)
    : {
        adapterMode: adapter.adapterMode,
        providerSmokeAttempted: false,
        providerResponseReceived: false,
        teacherResponse: null,
        blockedReasons: runProviderSmoke
          ? ["blocked_for_real_provider_adapter_not_implemented_in_od_r5c"]
          : ["blocked_for_provider_smoke_flag_not_set"],
        networkCallsMade: false,
        imageReadsPerformed: false
      };

  const contractReport = validateTeacherCandidate({
    response: adapterResult.teacherResponse,
    envelope: envelopeReport.envelope
  });
  const reviewQueueReport = adapterResult.teacherResponse && contractReport.contractValid
    ? evaluateAestheticHumanReviewQueue(reviewQueueFromTeacherResponse(adapterResult.teacherResponse))
    : baseReviewQueueReport;
  const contractReasons = contractReport.contractValid
    ? []
    : contractReport.blockedReasons.map((reason) => `blocked_for_teacher_contract_${reason}`);
  const adapterReasons = adapterResult.blockedReasons || [];
  const blockedReasons = unique([
    ...hardReasons,
    ...gateReport.blockedReasons,
    ...adapterReasons,
    ...(adapterResult.teacherResponse ? contractReasons : []),
    ...(reviewQueueReport.reviewQueueValid ? [] : reviewQueueReport.blockedReasons.map((reason) => `blocked_for_review_queue_${reason}`))
  ]);
  const hardValidationFailure = hardReasons.length > 0 ||
    adapterResult.networkCallsMade === true ||
    adapterResult.imageReadsPerformed === true ||
    (adapterResult.teacherResponse && contractReport.contractValid !== true) ||
    (adapterResult.teacherResponse && reviewQueueReport.reviewQueueValid !== true) ||
    (runProviderSmoke && !shouldUseStub && adapter.adapterMode !== "disabled");
  const teacherCandidateCount = Array.isArray(adapterResult.teacherResponse?.candidateLabels)
    ? adapterResult.teacherResponse.candidateLabels.length
    : 0;

  return {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_PROVIDER_SMOKE_HARNESS_SCHEMA_VERSION,
    runMode: runModeFor({ runProviderSmoke, shouldUseStub, hardValidationFailure }),
    eligibleForProviderSmoke: runProviderSmoke === true &&
      gateReport.eligibleForProviderSmoke === true &&
      hardReasons.length === 0,
    providerSmokeAttempted: false,
    providerResponseReceived: false,
    teacherContractValid: adapterResult.teacherResponse ? contractReport.contractValid : false,
    humanReviewQueueRequired: true,
    humanReviewQueueReady: reviewQueueReport.reviewQueueValid === true,
    acceptedTeacherCandidateCount: contractReport.contractValid && reviewQueueReport.reviewQueueValid
      ? teacherCandidateCount
      : 0,
    rejectedTeacherCandidateCount: adapterResult.teacherResponse && (!contractReport.contractValid || !reviewQueueReport.reviewQueueValid)
      ? Math.max(teacherCandidateCount, 1)
      : 0,
    blockedReasons,
    redactionPolicy: { ...REDACTION_POLICY },
    requestEnvelope: envelopeReport.envelope,
    appTransferReadiness: {
      eligibleForParameterTuning: false,
      eligibleForAppRuntime: false,
      requiresHumanReview: true,
      requiresReviewQueue: true,
      requiresBenchmark: true,
      requiresSafetyGate: true,
      requiresPerformanceGate: true,
      appRuntimeTransferBlocked: true,
      blockedReasons: ["blocked_until_human_review_benchmark_safety_performance_and_product_gates"]
    },
    providerConfigured: gateReport.providerConfigured === true && hardReasons.length === 0,
    cloudTeacherEnabled: gateReport.cloudTeacherEnabled === true && hardReasons.length === 0,
    adapterMode: adapter.adapterMode,
    networkCallsMade: false,
    imageReadsPerformed: false,
    rawPromptPersisted: false,
    rawProviderResponsePersisted: false,
    rawRequestPayloadPersisted: false,
    generatedReportsPersisted: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false,
    hardValidationFailure,
    harnessValid: hardValidationFailure === false
  };
}

function buildRequestEnvelopeProbe(reviewQueueRequirement = {}) {
  try {
    const dryRun = runAestheticParameterMiningBotDryRun(aestheticParameterMiningBotDryRunSample());
    const jobPlanItem = dryRun.jobPlan[0];
    const envelope = buildAestheticCloudTeacherRequestEnvelope({
      jobPlanItem,
      teacherRequest: {
        ...jobPlanItem,
        registryVersion: dryRun.registryVersion,
        sourceType: "synthetic"
      },
      reviewQueueRequirement: {
        humanReviewRequired: true,
        reviewQueueRequired: true,
        ...reviewQueueRequirement
      }
    });
    return { envelope, blockedReasons: [] };
  } catch (error) {
    return {
      envelope: null,
      blockedReasons: (error.blockedReasons || ["blocked_for_request_envelope"]).map(
        (reason) => `blocked_for_envelope_${reason}`
      )
    };
  }
}

function validateTeacherCandidate({ response, envelope }) {
  if (!response || !envelope) {
    return {
      contractValid: false,
      blockedReasons: ["blocked_for_missing_teacher_response"]
    };
  }

  return evaluateAestheticCloudTeacherContract({
    request: {
      schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
      jobId: envelope.jobId,
      imageId: envelope.imageId,
      registryVersion: envelope.registryVersion,
      allowedTagSubset: envelope.allowedTagSubset,
      assetRefType: envelope.assetRefType,
      assetRefBucket: envelope.assetRefBucket,
      sourceType: envelope.sourceType,
      teacherMode: "contract_stub_only",
      humanReviewRequired: true
    },
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
}

function reviewQueueFromTeacherResponse(response) {
  const registry = aestheticParameterRegistry();
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const reviewItems = (response.candidateLabels || []).map((label, index) => {
    const registryItem = registryByTag.get(label.tag);
    return {
      reviewItemId: `review_item_provider_smoke_${sanitizeToken(response.jobId)}_${index}`,
      sourceType: "teacher_label_candidate",
      sourceId: `teacher_label_${sanitizeToken(response.jobId)}_${index}`,
      imageId: sanitizeToken(response.imageId),
      jobId: sanitizeToken(response.jobId),
      tag: sanitizeToken(label.tag),
      category: registryItem?.category || "composition",
      candidateSummary: "provider_smoke_candidate_pending_review",
      evidenceKeys: Array.isArray(label.evidenceKeys) ? label.evidenceKeys.map(sanitizeToken) : [],
      featureKeys: Array.isArray(label.featureBuckets) ? label.featureBuckets.map(sanitizeToken) : [],
      thresholdKeys: Array.isArray(label.thresholdSignals) ? label.thresholdSignals.map(sanitizeToken) : [],
      suppressionCandidates: Array.isArray(label.suppressionCandidates) ? label.suppressionCandidates.map(sanitizeToken) : [],
      safeActionKey: sanitizeToken(label.safeActionKey || "keep_retro_intent_if_uncertain"),
      reviewStatus: "pending",
      reviewRequired: true,
      tuningEligible: false,
      eligibleForAppRuntime: false,
      appRuntimeTransferBlocked: true,
      blockedReasons: []
    };
  });

  return {
    schemaVersion: AESTHETIC_HUMAN_REVIEW_QUEUE_SCHEMA_VERSION,
    reviewItems,
    reviewDecisions: [],
    humanReviewRequired: true,
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

function providerFlagBlockers({ runProviderSmoke, explicitConfigProvided, config, configPath, gateReport }) {
  if (!runProviderSmoke) return [];
  const blockers = [];
  if (explicitConfigProvided !== true) {
    blockers.push("blocked_for_run_provider_smoke_without_explicit_config");
  }
  if (!isIgnoredLocalConfigPath(configPath)) {
    blockers.push("blocked_for_provider_smoke_requires_ignored_local_config");
  }
  if (!APPROVED_PROVIDER_SMOKE_SAMPLE_MODES.includes(config.approvedSampleMode)) {
    blockers.push("blocked_for_provider_smoke_requires_approved_sample_mode");
  }
  if (gateReport.eligibleForProviderSmoke !== true) {
    blockers.push("blocked_for_provider_smoke_readiness_gate_not_passed");
  }
  return blockers;
}

function isIgnoredLocalConfigPath(configPath) {
  return typeof configPath === "string" &&
    /backend[\\/]+config[\\/]+aesthetic-cloud-teacher\.local\.json$/i.test(configPath.replace(/\//g, "\\"));
}

function executionFlagBlockers(input) {
  const blockers = EXECUTION_FALSE_FLAGS
    .filter((field) => input[field] === true)
    .map((field) => `blocked_for_${toSnake(field)}_true`);
  if (input.appRuntimeTransferBlocked === false) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  return blockers;
}

function forbiddenShapeBlockers(value, path = "input") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    const isAllowedHarnessKey = path === "provider_smoke_harness_input" &&
      ALLOWED_HARNESS_FIELD_NAMES.has(normalizedKey);
    const isRootConfig = path === "provider_smoke_harness_input" && normalizedKey === "config";
    const isRootConfigPath = path === "provider_smoke_harness_input" && normalizedKey === "configpath";
    if (!isAllowedHarnessKey && FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))) {
      blockers.push(`blocked_for_forbidden_field_${sanitizeToken(keyPath)}`);
    }
    if (!isRootConfigPath && typeof nested === "string" && RAW_VALUE_PATTERNS.some((pattern) => pattern.test(nested))) {
      blockers.push(`blocked_for_forbidden_value_${sanitizeToken(keyPath)}`);
    }
    if (nested && typeof nested === "object" && normalizedKey !== "adapter" && !isRootConfig) {
      blockers.push(...forbiddenShapeBlockers(nested, keyPath));
    }
  }
  return blockers;
}

function runModeFor({ runProviderSmoke, shouldUseStub, hardValidationFailure }) {
  if (shouldUseStub) return "stub_contract_only";
  if (runProviderSmoke && hardValidationFailure) return "blocked_provider_smoke_preflight";
  if (runProviderSmoke) return "blocked_provider_adapter_unimplemented";
  return "blocked_no_network";
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
