import { readFileSync } from "node:fs";

import {
  REDACTION_POLICY,
  buildAestheticCloudTeacherRequestEnvelope
} from "./aestheticCloudTeacherRequestEnvelope.mjs";
import {
  aestheticParameterMiningBotDryRunSample,
  runAestheticParameterMiningBotDryRun
} from "./aestheticParameterMiningBotDryRun.mjs";

export const AESTHETIC_CLOUD_TEACHER_PROVIDER_GATE_SCHEMA_VERSION =
  "aesthetic_cloud_teacher_provider_sandbox_readiness_gate.v1";

export const AESTHETIC_CLOUD_TEACHER_PROVIDER_GATE_NAME =
  "cloud_teacher_provider_sandbox_readiness";

export const ALLOWED_SAMPLE_MODES = Object.freeze([
  "none",
  "synthetic_stub_only",
  "approved_local_ignored_sample",
  "approved_consented_sample"
]);

const REQUIRED_CONFIG_FIELDS = Object.freeze([
  "enabled",
  "allowNetworkCalls",
  "providerConfigured",
  "providerName",
  "modelNameBucket",
  "approvedSampleMode",
  "allowImageUpload",
  "allowRawPromptLogging",
  "allowRawProviderResponseLogging",
  "allowRequestPayloadLogging",
  "allowGeneratedReports",
  "productionReady"
]);

const OPTIONAL_CONFIG_FIELDS = Object.freeze([
  "providerSandboxGateApproved",
  "cloudTeacherEnabled",
  "networkCallsMade",
  "imageReadsPerformed",
  "rawPromptPersisted",
  "rawProviderResponsePersisted",
  "rawRequestPayloadPersisted",
  "generatedReportsPersisted",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "eligibleForAppRuntime",
  "appRuntimeTransferBlocked"
]);

const HARD_FALSE_FIELDS = Object.freeze([
  "allowRawPromptLogging",
  "allowRawProviderResponseLogging",
  "allowRequestPayloadLogging",
  "allowGeneratedReports",
  "productionReady",
  "networkCallsMade",
  "imageReadsPerformed",
  "rawPromptPersisted",
  "rawProviderResponsePersisted",
  "rawRequestPayloadPersisted",
  "generatedReportsPersisted",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
  "eligibleForAppRuntime"
]);

const OUTPUT_FALSE_FLAGS = Object.freeze([
  "networkCallsMade",
  "imageReadsPerformed",
  "rawPromptPersisted",
  "rawProviderResponsePersisted",
  "rawRequestPayloadPersisted",
  "generatedReportsPersisted",
  "trainingEnabled",
  "runtimeIntegrationEnabled",
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
  "userid",
  "useridentity",
  "gps",
  "exif"
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

const SAFE_MODEL_BUCKETS = Object.freeze([
  "not_configured",
  "redacted_provider_model_bucket",
  "sandbox_model_bucket",
  "approved_internal_bucket"
]);

const ALLOWED_CONFIG_FIELD_NAMES = new Set(
  [...REQUIRED_CONFIG_FIELDS, ...OPTIONAL_CONFIG_FIELDS].map(normalizeFieldName)
);

export function disabledAestheticCloudTeacherProviderGateConfig() {
  return {
    enabled: false,
    allowNetworkCalls: false,
    providerConfigured: false,
    providerName: "disabled",
    modelNameBucket: "not_configured",
    approvedSampleMode: "none",
    allowImageUpload: false,
    allowRawPromptLogging: false,
    allowRawProviderResponseLogging: false,
    allowRequestPayloadLogging: false,
    allowGeneratedReports: false,
    productionReady: false
  };
}

export function readAestheticCloudTeacherProviderGateConfig(filePath) {
  const parsed = JSON.parse(readFileSync(filePath, "utf8"));
  return parsed;
}

export function evaluateAestheticCloudTeacherProviderGate(input = {}) {
  const config = input.config || disabledAestheticCloudTeacherProviderGateConfig();
  const explicitConfigProvided = input.explicitConfigProvided === true;
  const configBlockers = configShapeBlockers(config);
  const boundaryBlockers = boundaryBlockersFor(config, explicitConfigProvided);
  const forbiddenBlockers = forbiddenShapeBlockers(config, "provider_gate_config");
  const sample = sampleSummary(config.approvedSampleMode);
  const envelopeReport = buildEnvelopeProbe();

  const hardValidationReasons = unique([
    ...configBlockers,
    ...boundaryBlockers.hard,
    ...forbiddenBlockers,
    ...envelopeReport.blockedReasons
  ]);
  const safeBlockedReasons = providerSmokeSafeBlockers(config, explicitConfigProvided);
  const blockedReasons = unique([...hardValidationReasons, ...safeBlockedReasons]);
  const eligibleForProviderSmoke = hardValidationReasons.length === 0 &&
    providerSmokeReadinessPassed(config, explicitConfigProvided);

  return {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_PROVIDER_GATE_SCHEMA_VERSION,
    gateName: AESTHETIC_CLOUD_TEACHER_PROVIDER_GATE_NAME,
    eligibleForProviderSmoke,
    providerConfigured: config.providerConfigured === true && hardValidationReasons.length === 0,
    cloudTeacherEnabled: config.enabled === true && hardValidationReasons.length === 0,
    allowNetworkCalls: config.allowNetworkCalls === true && hardValidationReasons.length === 0,
    allowImageUpload: config.allowImageUpload === true && hardValidationReasons.length === 0,
    approvedSampleMode: ALLOWED_SAMPLE_MODES.includes(config.approvedSampleMode)
      ? config.approvedSampleMode
      : "invalid",
    blockedReasons,
    configBucket: configBucket(config, explicitConfigProvided),
    sampleBucket: sample,
    redactionPolicy: { ...REDACTION_POLICY },
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
    networkCallsMade: false,
    imageReadsPerformed: false,
    rawPromptPersisted: false,
    rawProviderResponsePersisted: false,
    rawRequestPayloadPersisted: false,
    generatedReportsPersisted: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false,
    hardValidationFailure: hardValidationReasons.length > 0,
    gateValid: hardValidationReasons.length === 0,
    requestEnvelopeProbe: envelopeReport.envelope
  };
}

function buildEnvelopeProbe() {
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
        reviewQueueRequired: true
      }
    });
    return { envelope, blockedReasons: [] };
  } catch (error) {
    return {
      envelope: null,
      blockedReasons: (error.blockedReasons || ["blocked_for_request_envelope_probe"]).map(
        (reason) => `blocked_for_envelope_${reason}`
      )
    };
  }
}

function configShapeBlockers(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return ["blocked_for_config_not_object"];
  }
  const allowed = new Set([...REQUIRED_CONFIG_FIELDS, ...OPTIONAL_CONFIG_FIELDS]);
  const blockers = [
    ...REQUIRED_CONFIG_FIELDS
      .filter((field) => !(field in config))
      .map((field) => `blocked_for_missing_config_${sanitizeToken(field)}`),
    ...Object.keys(config)
      .filter((field) => !allowed.has(field))
      .map((field) => `blocked_for_unexpected_config_field_${sanitizeToken(field)}`)
  ];

  for (const field of REQUIRED_CONFIG_FIELDS) {
    if (field === "providerName" || field === "modelNameBucket" || field === "approvedSampleMode") continue;
    if (field in config && typeof config[field] !== "boolean") {
      blockers.push(`blocked_for_config_${toSnake(field)}_not_boolean`);
    }
  }
  for (const field of ["providerName", "modelNameBucket", "approvedSampleMode"]) {
    if (field in config && typeof config[field] !== "string") {
      blockers.push(`blocked_for_config_${toSnake(field)}_not_string`);
    }
  }
  if (typeof config.approvedSampleMode === "string" && !ALLOWED_SAMPLE_MODES.includes(config.approvedSampleMode)) {
    blockers.push(`blocked_for_unsupported_sample_mode_${sanitizeToken(config.approvedSampleMode)}`);
  }
  if (typeof config.modelNameBucket === "string" && !SAFE_MODEL_BUCKETS.includes(config.modelNameBucket)) {
    blockers.push("blocked_for_unapproved_model_name_bucket");
  }
  if (config.providerName && normalizeFieldName(config.providerName) !== "disabled" && !/^[a-z0-9_-]{1,40}$/i.test(config.providerName)) {
    blockers.push("blocked_for_unsafe_provider_name_bucket");
  }

  return blockers;
}

function boundaryBlockersFor(config, explicitConfigProvided) {
  const hard = [];
  for (const field of HARD_FALSE_FIELDS) {
    if (config[field] === true) {
      hard.push(`blocked_for_${toSnake(field)}_true`);
    }
  }
  if (config.appRuntimeTransferBlocked === false) {
    hard.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  if (config.allowNetworkCalls === true && explicitConfigProvided !== true) {
    hard.push("blocked_for_network_opt_in_without_explicit_ignored_config");
  }
  if (config.providerConfigured === true && explicitConfigProvided !== true) {
    hard.push("blocked_for_provider_configured_without_explicit_ignored_config");
  }
  if (config.enabled === true && config.providerSandboxGateApproved !== true) {
    hard.push("blocked_for_cloud_teacher_enabled_without_gate_approval");
  }
  if (config.allowImageUpload === true && !["approved_local_ignored_sample", "approved_consented_sample"].includes(config.approvedSampleMode)) {
    hard.push("blocked_for_image_upload_without_approved_sample_mode");
  }
  if (config.productionReady === true) {
    hard.push("blocked_for_production_ready_true");
  }

  return { hard };
}

function providerSmokeSafeBlockers(config, explicitConfigProvided) {
  const blockers = [];
  if (config.enabled !== true) blockers.push("blocked_for_cloud_teacher_disabled");
  if (config.providerConfigured !== true) blockers.push("blocked_for_provider_not_configured");
  if (config.allowNetworkCalls !== true) blockers.push("blocked_for_network_calls_disabled");
  if (explicitConfigProvided !== true) blockers.push("blocked_for_explicit_ignored_local_config_required");
  if (config.providerSandboxGateApproved !== true) blockers.push("blocked_for_provider_sandbox_gate_approval_missing");
  if (!["approved_local_ignored_sample", "approved_consented_sample"].includes(config.approvedSampleMode)) {
    blockers.push("blocked_for_approved_sample_required");
  }
  if (config.modelNameBucket === "not_configured") blockers.push("blocked_for_model_bucket_not_configured");
  if (config.allowImageUpload !== true) blockers.push("blocked_for_image_upload_disabled");
  return unique(blockers);
}

function providerSmokeReadinessPassed(config, explicitConfigProvided) {
  return explicitConfigProvided === true &&
    config.enabled === true &&
    config.providerSandboxGateApproved === true &&
    config.providerConfigured === true &&
    config.allowNetworkCalls === true &&
    config.allowImageUpload === true &&
    ["approved_local_ignored_sample", "approved_consented_sample"].includes(config.approvedSampleMode) &&
    config.allowRawPromptLogging === false &&
    config.allowRawProviderResponseLogging === false &&
    config.allowRequestPayloadLogging === false &&
    config.allowGeneratedReports === false &&
    config.productionReady === false &&
    config.modelNameBucket !== "not_configured";
}

function configBucket(config, explicitConfigProvided) {
  return {
    configSource: explicitConfigProvided ? "explicit_config_argument" : "committed_example_or_inline_disabled",
    providerNameBucket: config.providerName === "disabled" ? "disabled" : "configured_redacted",
    modelNameBucket: sanitizeToken(config.modelNameBucket || "not_configured"),
    localIgnoredConfigRequired: true,
    realSecretsAllowedInRepo: false
  };
}

function sampleSummary(approvedSampleMode) {
  return {
    approvedSampleMode: ALLOWED_SAMPLE_MODES.includes(approvedSampleMode) ? approvedSampleMode : "invalid",
    realImageReadAllowedByCli: false,
    localSampleDirectoryIgnored: true,
    committedSampleAllowed: false
  };
}

function forbiddenShapeBlockers(value, path = "input") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];
  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    const normalizedKey = normalizeFieldName(key);
    const isAllowedConfigKey = path === "provider_gate_config" && ALLOWED_CONFIG_FIELD_NAMES.has(normalizedKey);
    if (!isAllowedConfigKey && FORBIDDEN_FIELD_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))) {
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
