export const OPEN_WEIGHT_VLM_CONTROLLED_MULTIFIXTURE_REJECTION_DIAGNOSTICS_SCHEMA_VERSION =
  "open_weight_vlm_controlled_multifixture_rejection_diagnostics.v1";

const APPROVED_CONTROLLED_FIXTURE_TOKENS = Object.freeze([
  "smoke_004",
  "smoke_005",
  "smoke_006",
  "smoke_007",
  "smoke_008",
  "smoke_009",
  "smoke_010",
  "smoke_011",
  "smoke_012",
  "smoke_013",
  "smoke_014",
  "smoke_015"
]);

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "ws://",
  "wss://",
  "data:image",
  "/9j/",
  ".jpg",
  ".jpeg",
  ".png",
  "\"rawPrompt\":",
  "\"fullPrompt\":",
  "\"requestPayload\":",
  "\"rawModelOutput\":",
  "\"modelOutput\":",
  "\"rawProviderResponse\":",
  "Authorization",
  "Bearer ",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CODE0_API_KEY",
  "INTENEXT_API_KEY",
  "server_log",
  "model_server_url"
]);

export function buildControlledMultifixtureRejectionDiagnosticsInput(overrides = {}) {
  return {
    phase21UAcceptedReference: {
      benchmarkKind: "one_fixture_serving_benchmark",
      servingStackClass: "transformers_fastapi_reference",
      fixtureTokens: ["smoke_001"],
      fixtureCount: 1,
      callCount: 1,
      retryCount: 0,
      acceptedCount: 1,
      rejectedCount: 0,
      validationCodes: { null: 1 },
      fallbackCategories: { null: 1 },
      latencyBuckets: { gt_15s: 1 },
      endpointBucketNormalized: true,
      rawOutputPersisted: false,
      rawOutputPrinted: false,
      productionReady: false
    },
    phase21WR1BRejectedReference: {
      benchmarkKind: "controlled_multifixture_serving_benchmark_retry_after_endpoint_bucket_fix",
      servingStackClass: "transformers_fastapi_reference",
      fixtureTokens: APPROVED_CONTROLLED_FIXTURE_TOKENS,
      fixtureCount: 12,
      callCount: 12,
      retryCount: 0,
      acceptedCount: 0,
      rejectedCount: 12,
      validationCodes: { local_model_unavailable: 12 },
      fallbackCategories: { blocked_for_provider_integration: 12 },
      latencyBuckets: { lt_1s: 12 },
      endpointBucketNormalized: true,
      healthzBucket: "safe",
      rawOutputPersisted: false,
      rawOutputPrinted: false,
      productionReady: false
    },
    modelCallRequestedNow: false,
    endpointCallRequestedNow: false,
    benchmarkExecutionRequestedNow: false,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    rawPromptPersisted: false,
    rawPromptPrinted: false,
    rawPayloadPersisted: false,
    rawPayloadPrinted: false,
    productionReady: false,
    ...overrides
  };
}

export function diagnoseControlledMultifixtureRejectionPath(
  input = buildControlledMultifixtureRejectionDiagnosticsInput()
) {
  const plan = buildControlledMultifixtureRejectionDiagnosticsInput(input);
  const phase21U = sanitizeReference(plan.phase21UAcceptedReference);
  const phase21WR1B = sanitizeReference(plan.phase21WR1BRejectedReference);
  const blockers = unique([
    ...executionBlockers(plan),
    ...rawArtifactBlockers(plan),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const allLocalUnavailable = countBucket(phase21WR1B.validationCodes, "local_model_unavailable") === 12
    && phase21WR1B.acceptedCount === 0
    && phase21WR1B.rejectedCount === 12;
  const allFastRejected = countBucket(phase21WR1B.latencyBuckets, "lt_1s") === 12;
  const acceptedOneFixtureReference = phase21U.acceptedCount === 1
    && phase21U.fixtureCount === 1
    && phase21U.fixtureTokens.includes("smoke_001");
  const sameServingStack = phase21U.servingStackClass === phase21WR1B.servingStackClass
    && phase21WR1B.servingStackClass === "transformers_fastapi_reference";

  const likelyFailureLayer = allLocalUnavailable && allFastRejected
    ? "external_route_error_mapping_or_fixture_token_contract"
    : "unclear_requires_no_network_instrumentation";
  const nextSafeAction = likelyFailureLayer === "external_route_error_mapping_or_fixture_token_contract"
    ? "phase_21_w_r2c_external_server_fixture_token_contract_fix"
    : "phase_21_w_r2d_no_network_instrumentation_for_local_model_unavailable";

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_CONTROLLED_MULTIFIXTURE_REJECTION_DIAGNOSTICS_SCHEMA_VERSION,
    diagnosticEligible: blockers.length === 0,
    likelyFailureLayer,
    rootCauseFound: likelyFailureLayer === "external_route_error_mapping_or_fixture_token_contract",
    comparedPaths: {
      sameServingStack,
      oneFixtureAcceptedReference: acceptedOneFixtureReference,
      controlledMultifixtureAllRejected: allLocalUnavailable,
      controlledMultifixtureFastRejectBucket: allFastRejected,
      endpointBucketNormalizationRuledOut: phase21WR1B.endpointBucketNormalized === true,
      dryRunNoNetworkRuledOut: phase21WR1B.callCount === 12,
      schemaValidatorMismatchRuledOut: allLocalUnavailable,
      modelQualityFailureUnlikely: allFastRejected
    },
    phase21UAcceptedReference: phase21U,
    phase21WR1BRejectedReference: phase21WR1B,
    emittedByComponentBuckets: [
      "controlled_multifixture_wrapper_fetch_or_http_non_ok_mapping",
      "local_sandbox_client_uses_same_mapping_for_fetch_or_http_non_ok",
      "schema_validator_not_reached_for_local_model_unavailable_bucket"
    ],
    possibleRootCauses: allLocalUnavailable
      ? [
        "external_server_fixture_token_contract_mismatch",
        "external_route_returned_http_non_ok_for_controlled_fixture_tokens",
        "controlled_wrapper_maps_fetch_or_http_non_ok_to_local_model_unavailable",
        "server_can_report_safe_healthz_while_fixture_inference_route_rejects_tokens"
      ]
      : ["insufficient_sanitized_evidence"],
    ruledOutCauses: unique([
      sameServingStack ? "serving_stack_switch" : null,
      phase21WR1B.endpointBucketNormalized ? "endpoint_bucket_policy_mismatch" : null,
      phase21WR1B.retryCount === 0 ? "retry_expansion" : null,
      phase21WR1B.fixtureCount === 12 ? "fixture_count_mismatch" : null,
      phase21WR1B.callCount === 12 ? "controlled_wrapper_dry_run_no_network_path" : null,
      allLocalUnavailable ? "response_schema_validation_failure_after_json_parse" : null,
      allFastRejected ? "model_quality_or_slow_generation_failure" : null
    ].filter(Boolean)),
    nextSafeAction,
    immediateBenchmarkRetryJustified: false,
    modelCallRequiredForNextAction: false,
    endpointCallRequiredForNextAction: false,
    benchmarkRequiredForNextAction: false,
    blockers,
    servingRuntimeStarted: false,
    endpointCalled: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_controlled_multifixture_rejection_diagnostics"
        : "blocked_for_controlled_multifixture_rejection_diagnostics",
      ...blockers,
      likelyFailureLayer,
      "diagnostics_only_no_network",
      "not_production_ready"
    ])
  };

  const redaction = assertControlledMultifixtureRejectionDiagnosticsReportRedacted(report);
  if (!redaction.ok) {
    report.diagnosticEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_controlled_multifixture_rejection_diagnostics",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertControlledMultifixtureRejectionDiagnosticsReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "controlled_multifixture_rejection_diagnostics_not_redacted",
        message: "Controlled multi-fixture rejection diagnostics report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function sanitizeReference(reference = {}) {
  return {
    benchmarkKind: sanitizeToken(reference.benchmarkKind || "unknown"),
    servingStackClass: sanitizeToken(reference.servingStackClass || "unknown"),
    fixtureTokens: Array.isArray(reference.fixtureTokens)
      ? reference.fixtureTokens.map(sanitizeToken).filter(isSafeFixtureToken)
      : [],
    fixtureCount: safeCount(reference.fixtureCount),
    callCount: safeCount(reference.callCount),
    retryCount: safeCount(reference.retryCount),
    acceptedCount: safeCount(reference.acceptedCount),
    rejectedCount: safeCount(reference.rejectedCount),
    validationCodes: sanitizeBucketCounts(reference.validationCodes),
    fallbackCategories: sanitizeBucketCounts(reference.fallbackCategories),
    latencyBuckets: sanitizeBucketCounts(reference.latencyBuckets),
    endpointBucketNormalized: reference.endpointBucketNormalized === true,
    healthzBucket: reference.healthzBucket ? sanitizeToken(reference.healthzBucket) : null,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    productionReady: false
  };
}

function executionBlockers(plan) {
  const blockers = [];
  if (plan.modelCallRequestedNow === true) {
    blockers.push("blocked_for_current_model_call_request");
  }
  if (plan.endpointCallRequestedNow === true) {
    blockers.push("blocked_for_current_endpoint_call_request");
  }
  if (plan.benchmarkExecutionRequestedNow === true) {
    blockers.push("blocked_for_current_benchmark_execution_request");
  }
  return blockers;
}

function rawArtifactBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["rawOutputPersisted", "blocked_for_raw_output_persistence"],
    ["rawOutputPrinted", "blocked_for_raw_output_printing"],
    ["rawPromptPersisted", "blocked_for_raw_prompt_persistence"],
    ["rawPromptPrinted", "blocked_for_raw_prompt_printing"],
    ["rawPayloadPersisted", "blocked_for_raw_payload_persistence"],
    ["rawPayloadPrinted", "blocked_for_raw_payload_printing"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function sanitizeBucketCounts(value = {}) {
  if (!isPlainObject(value)) {
    return {};
  }
  const result = {};
  for (const [key, count] of Object.entries(value)) {
    result[sanitizeToken(key)] = safeCount(count);
  }
  return result;
}

function countBucket(counts = {}, key) {
  return safeCount(counts[sanitizeToken(key)]);
}

function isSafeFixtureToken(value) {
  return /^smoke_\d{3}$/u.test(value);
}

function safeCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function sanitizeToken(value) {
  return String(value ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "_")
    .slice(0, 96) || "unknown";
}

function unique(values) {
  return Array.from(new Set(values));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
