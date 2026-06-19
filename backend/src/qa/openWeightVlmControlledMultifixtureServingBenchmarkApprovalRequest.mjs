export const OPEN_WEIGHT_VLM_CONTROLLED_MULTIFIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION =
  "open_weight_vlm_controlled_multifixture_serving_benchmark_approval_request.v1";

export const CONTROLLED_MULTIFIXTURE_SERVING_BENCHMARK_PILOT_APPROVAL_PHRASE =
  "批准跑 Phase 21-W 一次 Transformers+FastAPI controlled 3-fixture serving benchmark，fixtures=<explicit approved tokens>，call count=3，retry=0";

export const CONTROLLED_MULTIFIXTURE_SERVING_BENCHMARK_LARGER_APPROVAL_PHRASE =
  "批准跑 Phase 21-W 一次 Transformers+FastAPI controlled 12-fixture serving benchmark，fixtures=<explicit approved tokens>，call count=12，retry=0";

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
  "chain-of-thought",
  "secret_value",
  "model_server_url"
]);

export function buildControlledMultifixtureServingBenchmarkApprovalDraft(options = {}) {
  const fixtureCount = safeCount(options.fixtureCount) || 3;
  return {
    schemaVersion: OPEN_WEIGHT_VLM_CONTROLLED_MULTIFIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION,
    approvalDraftOnly: true,
    benchmarkKind: "controlled_multifixture_serving_benchmark",
    servingStack: "transformers_fastapi_reference",
    fixtureTokens: buildFixtureTokenBuckets(fixtureCount),
    fixtureCount,
    callCount: fixtureCount,
    retryCount: 0,
    healthzRequired: true,
    endpointClass: "local_private",
    explicitUserApprovalRequired: true,
    explicitFixtureTokensRequired: true,
    approvedFixtureRegistryRequired: true,
    modelCallRequestedNow: false,
    benchmarkExecutionRequestedNow: false,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    rawPromptLogging: false,
    rawImageLogging: false,
    rawRequestPayloadLogging: false,
    iOSIntegrationEnabled: false,
    appEndpointEnabled: false,
    productionEndpointEnabled: false,
    cameraLiveCloudEntryEnabled: false,
    autoTriggerRuntimeEnabled: false,
    wssRuntimeEnabled: false,
    uploadRuntimeEnabled: false,
    servingStackSwitchRequested: false,
    productionReady: false
  };
}

export function evaluateControlledMultifixtureServingBenchmarkApprovalRequest(
  plan = buildControlledMultifixtureServingBenchmarkApprovalDraft()
) {
  const blockers = unique([
    ...shapeBlockers(plan),
    ...draftScopeBlockers(plan),
    ...futureScopeBlockers(plan),
    ...executionBlockers(plan),
    ...artifactBlockers(plan),
    ...boundaryBlockers(plan),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);
  const eligible = blockers.length === 0;

  const fixtureTokens = Array.isArray(plan.fixtureTokens) ? plan.fixtureTokens : [];
  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_CONTROLLED_MULTIFIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION,
    approvalRequestGateEligible: eligible,
    approvalDraftOnly: plan.approvalDraftOnly === true,
    benchmarkKind: sanitizeToken(plan.benchmarkKind || "unknown"),
    proposedServingStack: sanitizeToken(plan.servingStack || "unknown"),
    proposedFixtureTokenCount: fixtureTokens.length,
    proposedFixtureCount: safeCount(plan.fixtureCount),
    proposedCallCount: safeCount(plan.callCount),
    proposedRetryCount: safeCount(plan.retryCount),
    fixtureCountBucket: fixtureCountBucket(plan.fixtureCount),
    healthzRequired: plan.healthzRequired === true,
    endpointClass: sanitizeToken(plan.endpointClass || "unknown"),
    explicitUserApprovalRequired: plan.explicitUserApprovalRequired === true,
    explicitFixtureTokensRequired: plan.explicitFixtureTokensRequired === true,
    approvedFixtureRegistryRequired: plan.approvedFixtureRegistryRequired === true,
    approvalPhraseBuckets: [
      "phase_21_w_transformers_fastapi_controlled_3_fixture_one_call_each_zero_retry",
      "phase_21_w_transformers_fastapi_controlled_12_fixture_one_call_each_zero_retry"
    ],
    blockers,
    servingRuntimeStarted: false,
    endpointCalled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    servingStackSwitched: false,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    productionReady: false,
    eligibleForCurrentModelCall: false,
    eligibleForCurrentBenchmarkExecution: false,
    nextPhaseRecommendation: eligible
      ? "phase_21_w_approved_controlled_multifixture_transformers_fastapi_serving_benchmark"
      : "resolve_controlled_multifixture_serving_benchmark_approval_request_blockers",
    statusCategories: unique([
      eligible
        ? "pass_for_controlled_multifixture_serving_benchmark_approval_request"
        : "blocked_for_controlled_multifixture_serving_benchmark_approval_request",
      ...blockers,
      "phase_21_v_approval_request_draft_only",
      "future_phase_requires_separate_explicit_multicall_benchmark_approval",
      "not_production_ready"
    ])
  };

  const redaction = assertControlledMultifixtureServingBenchmarkApprovalRequestReportRedacted(report);
  if (!redaction.ok) {
    report.approvalRequestGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_controlled_multifixture_serving_benchmark_approval_request",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateControlledMultifixtureServingBenchmarkApprovalRequestSamples() {
  const threeFixtureDraft = buildControlledMultifixtureServingBenchmarkApprovalDraft({ fixtureCount: 3 });
  const twelveFixtureDraft = buildControlledMultifixtureServingBenchmarkApprovalDraft({ fixtureCount: 12 });
  const scenarios = [
    ["safe_draft_only_3_fixture_approval_request", threeFixtureDraft],
    ["safe_draft_only_12_fixture_approval_request", twelveFixtureDraft],
    ["model_call_requested_now", { ...threeFixtureDraft, modelCallRequestedNow: true }],
    ["benchmark_requested_now", { ...threeFixtureDraft, benchmarkExecutionRequestedNow: true }],
    ["fixture_count_not_multifixture", { ...threeFixtureDraft, fixtureCount: 1, fixtureTokens: ["approved_fixture_001"], callCount: 1 }],
    ["call_count_mismatch", { ...threeFixtureDraft, callCount: 2 }],
    ["fixture_token_count_mismatch", { ...threeFixtureDraft, fixtureTokens: ["approved_fixture_001"] }],
    ["retry_count_nonzero", { ...threeFixtureDraft, retryCount: 1 }],
    ["wrong_serving_stack", { ...threeFixtureDraft, servingStack: "vllm_candidate" }],
    ["approval_not_required", { ...threeFixtureDraft, explicitUserApprovalRequired: false }],
    ["fixture_tokens_not_required", { ...threeFixtureDraft, explicitFixtureTokensRequired: false }],
    ["registry_not_required", { ...threeFixtureDraft, approvedFixtureRegistryRequired: false }],
    ["raw_output_policy", { ...threeFixtureDraft, rawOutputPersisted: true, rawOutputPrinted: true }],
    ["raw_logging_policy", {
      ...threeFixtureDraft,
      rawPromptLogging: true,
      rawImageLogging: true,
      rawRequestPayloadLogging: true
    }],
    ["production_ready_true", { ...threeFixtureDraft, productionReady: true }],
    ["ios_integration", { ...threeFixtureDraft, iOSIntegrationEnabled: true }],
    ["endpoint_enabled", { ...threeFixtureDraft, appEndpointEnabled: true, productionEndpointEnabled: true }],
    ["camera_cloud_runtime", { ...threeFixtureDraft, cameraLiveCloudEntryEnabled: true }],
    ["live_upload_runtimes", {
      ...threeFixtureDraft,
      autoTriggerRuntimeEnabled: true,
      wssRuntimeEnabled: true,
      uploadRuntimeEnabled: true
    }],
    ["serving_stack_switch", { ...threeFixtureDraft, servingStackSwitchRequested: true }]
  ];

  const results = scenarios.map(([scenario, samplePlan]) => ({
    scenario,
    report: evaluateControlledMultifixtureServingBenchmarkApprovalRequest(samplePlan)
  }));
  const passScenarios = new Set([
    "safe_draft_only_3_fixture_approval_request",
    "safe_draft_only_12_fixture_approval_request"
  ]);
  const passing = results.filter((item) => passScenarios.has(item.scenario));
  const blocked = results.filter((item) => !passScenarios.has(item.scenario));
  const blockers = [];

  if (passing.some((item) => !item.report.approvalRequestGateEligible)) {
    blockers.push("blocked_for_safe_draft_sample_failure");
  }
  if (blocked.some((item) => item.report.approvalRequestGateEligible)) {
    blockers.push("blocked_for_blocked_sample_expectation_failure");
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_CONTROLLED_MULTIFIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION,
    runMode: "controlled_multifixture_serving_benchmark_approval_request_samples",
    approvalRequestGateEligible: blockers.length === 0,
    reviewedScenarioCount: results.length,
    safeDraftOnlyRequestPassed: passing.every((item) => item.report.approvalRequestGateEligible === true),
    safePilotDraftPassed: results.find((item) => item.scenario === "safe_draft_only_3_fixture_approval_request")?.report.approvalRequestGateEligible === true,
    safeControlled12DraftPassed: results.find((item) => item.scenario === "safe_draft_only_12_fixture_approval_request")?.report.approvalRequestGateEligible === true,
    expectedBlockedScenarioCount: blocked.filter((item) => !item.report.approvalRequestGateEligible).length,
    expectedBlockedReasons: unique(blocked.flatMap((item) => item.report.blockers)),
    nextPhaseRecommendation: "phase_21_w_approved_controlled_multifixture_transformers_fastapi_serving_benchmark",
    blockers,
    servingRuntimeStarted: false,
    endpointCalled: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    servingStackSwitched: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_controlled_multifixture_serving_benchmark_approval_request"
        : "blocked_for_controlled_multifixture_serving_benchmark_approval_request",
      ...blockers,
      "phase_21_v_approval_request_draft_only",
      "not_production_ready"
    ])
  };

  const redaction = assertControlledMultifixtureServingBenchmarkApprovalRequestReportRedacted(report);
  if (!redaction.ok) {
    report.approvalRequestGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
  }

  return report;
}

export function assertControlledMultifixtureServingBenchmarkApprovalRequestReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "controlled_multifixture_serving_benchmark_approval_request_not_redacted",
        message: "Controlled multi-fixture serving benchmark approval request report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function shapeBlockers(plan) {
  if (!isPlainObject(plan)) {
    return ["blocked_for_invalid_plan_schema"];
  }
  return [];
}

function draftScopeBlockers(plan) {
  const blockers = [];
  if (plan.approvalDraftOnly !== true) {
    blockers.push("blocked_for_non_draft_phase");
  }
  if (plan.explicitUserApprovalRequired !== true) {
    blockers.push("blocked_for_missing_explicit_user_approval_requirement");
  }
  if (plan.explicitFixtureTokensRequired !== true) {
    blockers.push("blocked_for_missing_explicit_fixture_tokens_requirement");
  }
  if (plan.approvedFixtureRegistryRequired !== true) {
    blockers.push("blocked_for_missing_approved_fixture_registry_requirement");
  }
  return blockers;
}

function futureScopeBlockers(plan) {
  const blockers = [];
  const fixtureCount = safeCount(plan.fixtureCount);
  const callCount = safeCount(plan.callCount);
  const fixtureTokens = Array.isArray(plan.fixtureTokens) ? plan.fixtureTokens : [];
  if (plan.benchmarkKind !== "controlled_multifixture_serving_benchmark") {
    blockers.push("blocked_for_unknown_benchmark_kind");
  }
  if (plan.servingStack !== "transformers_fastapi_reference") {
    blockers.push("blocked_for_non_transformers_fastapi_reference_stack");
  }
  if (fixtureCount <= 1) {
    blockers.push("blocked_for_fixture_count_not_multifixture");
  }
  if (callCount !== fixtureCount) {
    blockers.push("blocked_for_call_count_fixture_count_mismatch");
  }
  if (fixtureTokens.length !== fixtureCount) {
    blockers.push("blocked_for_fixture_token_count_mismatch");
  }
  if (safeCount(plan.retryCount) !== 0) {
    blockers.push("blocked_for_retry_count_not_zero");
  }
  if (plan.healthzRequired !== true) {
    blockers.push("blocked_for_missing_healthz_requirement");
  }
  if (!["local_private", "local_loopback", "private_lan"].includes(plan.endpointClass)) {
    blockers.push("blocked_for_unsafe_endpoint_class");
  }
  return blockers;
}

function executionBlockers(plan) {
  const blockers = [];
  if (plan.modelCallRequestedNow === true) {
    blockers.push("blocked_for_current_model_call_request");
  }
  if (plan.benchmarkExecutionRequestedNow === true) {
    blockers.push("blocked_for_current_benchmark_execution_request");
  }
  if (plan.servingStackSwitchRequested === true) {
    blockers.push("blocked_for_serving_stack_switch_request");
  }
  return blockers;
}

function artifactBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["rawOutputPersisted", "blocked_for_raw_output_persistence"],
    ["rawOutputPrinted", "blocked_for_raw_output_printing"],
    ["rawPromptLogging", "blocked_for_raw_prompt_logging"],
    ["rawImageLogging", "blocked_for_raw_image_logging"],
    ["rawRequestPayloadLogging", "blocked_for_raw_request_payload_logging"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function boundaryBlockers(plan) {
  const blockers = [];
  for (const [field, code] of [
    ["iOSIntegrationEnabled", "blocked_for_ios_integration"],
    ["appEndpointEnabled", "blocked_for_app_endpoint"],
    ["productionEndpointEnabled", "blocked_for_production_endpoint"],
    ["cameraLiveCloudEntryEnabled", "blocked_for_camera_live_cloud_entry"],
    ["autoTriggerRuntimeEnabled", "blocked_for_auto_trigger_runtime"],
    ["wssRuntimeEnabled", "blocked_for_wss_runtime"],
    ["uploadRuntimeEnabled", "blocked_for_upload_runtime"]
  ]) {
    if (plan[field] === true) {
      blockers.push(code);
    }
  }
  return blockers;
}

function fixtureCountBucket(value) {
  const count = safeCount(value);
  if (count <= 1) {
    return "not_multifixture";
  }
  if (count <= 3) {
    return "pilot_3_or_less";
  }
  if (count <= 12) {
    return "controlled_12_or_less";
  }
  return "more_than_12";
}

function buildFixtureTokenBuckets(count) {
  return Array.from({ length: count }, (_, index) => `approved_fixture_${String(index + 1).padStart(3, "0")}`);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeCount(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9._:-]/g, "_")
    .slice(0, 96) || "unknown";
}
