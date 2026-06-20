import {
  ALLOWED_FEATURE_KEYS,
  ALLOWED_SAFE_ACTION_KEYS,
  ALLOWED_SUPPRESSION_KEYS,
  ALLOWED_THRESHOLD_KEYS,
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "./aestheticParameterRegistry.mjs";

export const AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION =
  "aesthetic_cloud_teacher_contract.v1";

export const ALLOWED_CONFIDENCE_BUCKETS = Object.freeze([
  "low",
  "medium",
  "high",
  "unknown"
]);

export const ALLOWED_SEVERITY_BUCKETS = Object.freeze([
  "low",
  "medium",
  "high",
  "unknown"
]);

const REQUIRED_REQUEST_FIELDS = Object.freeze([
  "schemaVersion",
  "jobId",
  "imageId",
  "registryVersion",
  "allowedTagSubset",
  "assetRefType",
  "assetRefBucket",
  "sourceType",
  "teacherMode",
  "humanReviewRequired"
]);

const REQUIRED_RESPONSE_FIELDS = Object.freeze([
  "schemaVersion",
  "jobId",
  "imageId",
  "candidateLabels",
  "safety",
  "review",
  "appTransferReadiness"
]);

const REQUIRED_CANDIDATE_FIELDS = Object.freeze([
  "tag",
  "confidence",
  "severity",
  "evidenceKeys",
  "featureBuckets",
  "thresholdSignals",
  "suppressionCandidates",
  "safeActionKey",
  "needsHumanReview"
]);

const REQUIRED_SAFETY_FALSE_FIELDS = Object.freeze([
  "sensitiveInferenceDetected",
  "scoreOrRatingDetected",
  "chainOfThoughtDetected",
  "debugLeakageDetected",
  "rawProviderPayloadDetected",
  "rawPromptDetected",
  "identityInferenceDetected"
]);

const REQUIRED_REVIEW_FIELDS = Object.freeze([
  "humanReviewRequired",
  "reviewStatus"
]);

const REQUIRED_APP_TRANSFER_FIELDS = Object.freeze([
  "eligibleForParameterTuning",
  "eligibleForAppRuntime",
  "requiresHumanReview",
  "requiresBenchmark",
  "requiresSafetyGate",
  "requiresPerformanceGate",
  "appRuntimeTransferBlocked",
  "blockedReasons"
]);

const DISABLED_FLAGS = Object.freeze([
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
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
  "token",
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
    ...REQUIRED_REQUEST_FIELDS,
    ...REQUIRED_RESPONSE_FIELDS,
    ...REQUIRED_CANDIDATE_FIELDS,
    ...REQUIRED_SAFETY_FALSE_FIELDS,
    ...REQUIRED_REVIEW_FIELDS,
    ...REQUIRED_APP_TRANSFER_FIELDS,
    ...DISABLED_FLAGS,
    "request",
    "response",
    "rawImagesCommitted"
  ].map(normalizeFieldName)
);

export function aestheticCloudTeacherContractSample() {
  const registry = aestheticParameterRegistry();
  const allowedTagSubset = [
    "ERR_COMP_EXCESSIVE_HEADROOM",
    "ERR_DEPTH_SUBJECT_BACKGROUND_MERGER"
  ];

  return {
    request: {
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
    },
    response: {
      schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
      jobId: "job_synthetic_teacher_stub_001",
      imageId: "img_synthetic_teacher_stub_001",
      candidateLabels: [
        {
          tag: "ERR_COMP_EXCESSIVE_HEADROOM",
          confidence: "medium",
          severity: "low",
          evidenceKeys: ["bbox", "composition_bucket"],
          featureBuckets: ["subjectBox", "faceBox", "headroomRatio"],
          thresholdSignals: ["headroom_soft_high"],
          suppressionCandidates: ["intentional_negative_space", "low_confidence_detection"],
          safeActionKey: "leave_less_empty_air_above",
          needsHumanReview: true
        }
      ],
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
    },
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    rawImagesCommitted: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false
  };
}

export function evaluateAestheticCloudTeacherContract(input = aestheticCloudTeacherContractSample()) {
  const registry = aestheticParameterRegistry();
  const registryReport = evaluateAestheticParameterRegistry(registry);
  const registryByTag = new Map(registry.items.map((item) => [item.tag, item]));
  const request = input.request || {};
  const response = input.response || {};
  const requestReasons = validateTeacherRequest(request, registry, registryByTag);
  const responseReasons = validateTeacherResponse(response, request, registryByTag);
  const globalReasons = unique([
    ...disabledFlagBlockers(input),
    ...registryReport.blockedReasons.map((reason) => `blocked_for_registry_${reason}`),
    ...forbiddenShapeBlockers(input, "contract")
  ]);
  const blockedReasons = unique([...globalReasons, ...requestReasons, ...responseReasons]);
  const appTransferReadiness = sanitizedAppTransferReadiness(response.appTransferReadiness);

  return {
    schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
    requestValid: requestReasons.length === 0 && globalReasons.length === 0,
    responseValid: responseReasons.length === 0 && globalReasons.length === 0,
    candidateLabelCount: Array.isArray(response.candidateLabels) ? response.candidateLabels.length : 0,
    blockedReasons,
    appTransferReadiness,
    cloudTeacherEnabled: false,
    providerConfigured: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    rawImagesCommitted: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    productionReady: false,
    contractValid: blockedReasons.length === 0
  };
}

export function validateTeacherRequest(request, registry, registryByTag) {
  const blockers = [
    ...missingFieldBlockers(request, REQUIRED_REQUEST_FIELDS, "request"),
    ...unexpectedFieldBlockers(request, REQUIRED_REQUEST_FIELDS, "request")
  ];

  if (request.schemaVersion !== AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_request_schema_version");
  }
  if (request.registryVersion !== registry.registryVersion) {
    blockers.push("blocked_for_registry_version_mismatch");
  }
  if (request.teacherMode !== "contract_stub_only") {
    blockers.push("blocked_for_teacher_mode_not_contract_stub_only");
  }
  if (request.humanReviewRequired !== true) {
    blockers.push("blocked_for_request_missing_human_review_requirement");
  }

  const tags = Array.isArray(request.allowedTagSubset) ? request.allowedTagSubset : [];
  if (tags.length === 0) blockers.push("blocked_for_request_empty_allowed_tag_subset");
  for (const tag of tags) {
    if (!registryByTag.has(tag)) {
      blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(tag)}`);
    }
  }

  return blockers;
}

export function validateTeacherResponse(response, request, registryByTag) {
  const blockers = [
    ...missingFieldBlockers(response, REQUIRED_RESPONSE_FIELDS, "response"),
    ...unexpectedFieldBlockers(response, REQUIRED_RESPONSE_FIELDS, "response")
  ];

  if (response.schemaVersion !== AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION) {
    blockers.push("blocked_for_unsupported_response_schema_version");
  }
  if (response.jobId !== request.jobId) blockers.push("blocked_for_response_job_id_mismatch");
  if (response.imageId !== request.imageId) blockers.push("blocked_for_response_image_id_mismatch");

  const candidateLabels = Array.isArray(response.candidateLabels) ? response.candidateLabels : [];
  if (candidateLabels.length === 0) blockers.push("blocked_for_empty_candidate_labels");
  candidateLabels.forEach((label, index) => {
    blockers.push(...candidateLabelBlockers(label, index, request, registryByTag));
  });

  blockers.push(...safetyBlockers(response.safety));
  blockers.push(...reviewBlockers(response.review));
  blockers.push(...appTransferReadinessBlockers(response.appTransferReadiness));

  return blockers;
}

function candidateLabelBlockers(label, index, request, registryByTag) {
  const labelPath = `candidate_label_${index}`;
  const blockers = [
    ...missingFieldBlockers(label, REQUIRED_CANDIDATE_FIELDS, labelPath),
    ...unexpectedFieldBlockers(label, REQUIRED_CANDIDATE_FIELDS, labelPath)
  ];

  if (!registryByTag.has(label.tag)) {
    blockers.push(`blocked_for_unknown_registry_tag_${sanitizeToken(label.tag)}`);
  }
  if (!Array.isArray(request.allowedTagSubset) || !request.allowedTagSubset.includes(label.tag)) {
    blockers.push(`blocked_for_tag_outside_request_subset_${sanitizeToken(label.tag)}`);
  }
  if (!ALLOWED_CONFIDENCE_BUCKETS.includes(label.confidence)) {
    blockers.push(`blocked_for_unsupported_confidence_${sanitizeToken(label.confidence)}`);
  }
  if (!ALLOWED_SEVERITY_BUCKETS.includes(label.severity)) {
    blockers.push(`blocked_for_unsupported_severity_${sanitizeToken(label.severity)}`);
  }
  if (!Array.isArray(label.evidenceKeys) || label.evidenceKeys.length === 0) {
    blockers.push(`blocked_for_missing_evidence_keys_${sanitizeToken(label.tag)}`);
  }
  blockers.push(...unsupportedArrayValues("feature_bucket", label.featureBuckets, ALLOWED_FEATURE_KEYS));
  blockers.push(...unsupportedArrayValues("threshold_signal", label.thresholdSignals, ALLOWED_THRESHOLD_KEYS));
  blockers.push(...unsupportedArrayValues("suppression_candidate", label.suppressionCandidates, ALLOWED_SUPPRESSION_KEYS));
  if (!ALLOWED_SAFE_ACTION_KEYS.includes(label.safeActionKey)) {
    blockers.push(`blocked_for_unsupported_safe_action_key_${sanitizeToken(label.safeActionKey)}`);
  }
  if (label.needsHumanReview !== true) {
    blockers.push(`blocked_for_candidate_missing_human_review_${sanitizeToken(label.tag)}`);
  }

  return blockers;
}

function safetyBlockers(safety = {}) {
  const blockers = [
    ...missingFieldBlockers(safety, REQUIRED_SAFETY_FALSE_FIELDS, "safety"),
    ...unexpectedFieldBlockers(safety, REQUIRED_SAFETY_FALSE_FIELDS, "safety")
  ];
  for (const field of REQUIRED_SAFETY_FALSE_FIELDS) {
    if (safety[field] !== false) {
      blockers.push(`blocked_for_safety_${toSnake(field)}_not_false`);
    }
  }
  return blockers;
}

function reviewBlockers(review = {}) {
  const blockers = [
    ...missingFieldBlockers(review, REQUIRED_REVIEW_FIELDS, "review"),
    ...unexpectedFieldBlockers(review, REQUIRED_REVIEW_FIELDS, "review")
  ];
  if (review.humanReviewRequired !== true) {
    blockers.push("blocked_for_review_missing_human_review_requirement");
  }
  if (review.reviewStatus !== "pending") {
    blockers.push(`blocked_for_unsupported_review_status_${sanitizeToken(review.reviewStatus)}`);
  }
  return blockers;
}

function appTransferReadinessBlockers(readiness = {}) {
  const blockers = [
    ...missingFieldBlockers(readiness, REQUIRED_APP_TRANSFER_FIELDS, "app_transfer_readiness"),
    ...unexpectedFieldBlockers(readiness, REQUIRED_APP_TRANSFER_FIELDS, "app_transfer_readiness")
  ];

  if (readiness.eligibleForParameterTuning !== false) {
    blockers.push("blocked_for_odr4_parameter_tuning_eligibility_not_false");
  }
  if (readiness.eligibleForAppRuntime !== false) {
    blockers.push("blocked_for_app_runtime_transfer_eligibility");
  }
  if (readiness.requiresHumanReview !== true) {
    blockers.push("blocked_for_app_transfer_missing_human_review_gate");
  }
  if (readiness.requiresBenchmark !== true) {
    blockers.push("blocked_for_app_transfer_missing_benchmark_gate");
  }
  if (readiness.requiresSafetyGate !== true) {
    blockers.push("blocked_for_app_transfer_missing_safety_gate");
  }
  if (readiness.requiresPerformanceGate !== true) {
    blockers.push("blocked_for_app_transfer_missing_performance_gate");
  }
  if (readiness.appRuntimeTransferBlocked !== true) {
    blockers.push("blocked_for_app_runtime_transfer_not_blocked");
  }
  if (!Array.isArray(readiness.blockedReasons) || readiness.blockedReasons.length === 0) {
    blockers.push("blocked_for_missing_app_transfer_blocked_reasons");
  }

  return blockers;
}

function sanitizedAppTransferReadiness(readiness = {}) {
  return {
    eligibleForParameterTuning: false,
    eligibleForAppRuntime: false,
    requiresHumanReview: true,
    requiresBenchmark: true,
    requiresSafetyGate: true,
    requiresPerformanceGate: true,
    appRuntimeTransferBlocked: true,
    blockedReasons: Array.isArray(readiness.blockedReasons) && readiness.blockedReasons.length > 0
      ? readiness.blockedReasons.map(sanitizeToken)
      : ["blocked_until_human_review_benchmark_safety_and_performance_gates"]
  };
}

function disabledFlagBlockers(input) {
  return DISABLED_FLAGS
    .filter((flag) => input[flag] !== false)
    .map((flag) => `blocked_for_${toSnake(flag)}_not_false`);
}

function missingFieldBlockers(value, requiredFields, path) {
  return requiredFields
    .filter((field) => !(field in (value || {})))
    .map((field) => `blocked_for_missing_${sanitizeToken(path)}_${sanitizeToken(field)}`);
}

function unexpectedFieldBlockers(value, allowedFields, path) {
  if (!value || typeof value !== "object") return [];
  return Object.keys(value)
    .filter((field) => !allowedFields.includes(field))
    .map((field) => `blocked_for_unexpected_${sanitizeToken(path)}_field_${sanitizeToken(field)}`);
}

function unsupportedArrayValues(kind, values, allowedValues) {
  if (!Array.isArray(values) || values.length === 0) {
    return [`blocked_for_missing_${kind}s`];
  }
  return values
    .filter((value) => !allowedValues.includes(value))
    .map((value) => `blocked_for_unsupported_${kind}_${sanitizeToken(value)}`);
}

function forbiddenShapeBlockers(value, path = "contract") {
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
