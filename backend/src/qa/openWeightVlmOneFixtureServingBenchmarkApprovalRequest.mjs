export const OPEN_WEIGHT_VLM_ONE_FIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION =
  "open_weight_vlm_one_fixture_serving_benchmark_approval_request.v1";

export const ONE_FIXTURE_SERVING_BENCHMARK_APPROVAL_PHRASE =
  "批准跑 Phase 21-U 一次 Transformers+FastAPI reference one-fixture serving benchmark，fixture=smoke_001，call count=1，retry=0";

export const ONE_FIXTURE_SERVING_BENCHMARK_PREFLIGHT_ONLY_PHRASE =
  "只批准 Phase 21-U-preflight only";

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

export function buildOneFixtureServingBenchmarkApprovalDraft() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_ONE_FIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION,
    approvalDraftOnly: true,
    benchmarkKind: "one_fixture_serving_benchmark",
    servingStack: "transformers_fastapi_reference",
    fixtureToken: "smoke_001",
    fixtureCount: 1,
    callCount: 1,
    retryCount: 0,
    healthzRequired: true,
    endpointClass: "local_private",
    explicitUserApprovalRequired: true,
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

export function evaluateOneFixtureServingBenchmarkApprovalRequest(
  plan = buildOneFixtureServingBenchmarkApprovalDraft()
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

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_ONE_FIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION,
    approvalRequestGateEligible: eligible,
    approvalDraftOnly: plan.approvalDraftOnly === true,
    benchmarkKind: sanitizeToken(plan.benchmarkKind || "unknown"),
    proposedServingStack: sanitizeToken(plan.servingStack || "unknown"),
    proposedFixtureToken: sanitizeToken(plan.fixtureToken || "unknown"),
    proposedFixtureCount: safeCount(plan.fixtureCount),
    proposedCallCount: safeCount(plan.callCount),
    proposedRetryCount: safeCount(plan.retryCount),
    healthzRequired: plan.healthzRequired === true,
    endpointClass: sanitizeToken(plan.endpointClass || "unknown"),
    explicitUserApprovalRequired: plan.explicitUserApprovalRequired === true,
    approvalPhraseBucket: "phase_21_u_transformers_fastapi_smoke001_one_call_zero_retry",
    saferAlternativeBucket: "phase_21_u_preflight_only",
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
      ? "phase_21_u_approved_transformers_fastapi_one_fixture_serving_benchmark"
      : "resolve_one_fixture_serving_benchmark_approval_request_blockers",
    statusCategories: unique([
      eligible
        ? "pass_for_one_fixture_serving_benchmark_approval_request"
        : "blocked_for_one_fixture_serving_benchmark_approval_request",
      ...blockers,
      "phase_21_t_approval_request_draft_only",
      "future_phase_requires_separate_explicit_model_call_approval",
      "not_production_ready"
    ])
  };

  const redaction = assertOneFixtureServingBenchmarkApprovalRequestReportRedacted(report);
  if (!redaction.ok) {
    report.approvalRequestGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_one_fixture_serving_benchmark_approval_request",
      ...report.blockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOneFixtureServingBenchmarkApprovalRequestSamples() {
  const base = buildOneFixtureServingBenchmarkApprovalDraft();
  const scenarios = [
    ["safe_draft_only_approval_request", base],
    ["model_call_requested_now", { ...base, modelCallRequestedNow: true }],
    ["benchmark_requested_now", { ...base, benchmarkExecutionRequestedNow: true }],
    ["fixture_count_expanded", { ...base, fixtureCount: 2 }],
    ["call_count_expanded", { ...base, callCount: 2 }],
    ["retry_count_expanded", { ...base, retryCount: 1 }],
    ["wrong_fixture_token", { ...base, fixtureToken: "smoke_002" }],
    ["wrong_serving_stack", { ...base, servingStack: "vllm_candidate" }],
    ["approval_not_required", { ...base, explicitUserApprovalRequired: false }],
    ["raw_output_policy", { ...base, rawOutputPersisted: true, rawOutputPrinted: true }],
    ["raw_logging_policy", {
      ...base,
      rawPromptLogging: true,
      rawImageLogging: true,
      rawRequestPayloadLogging: true
    }],
    ["production_ready_true", { ...base, productionReady: true }],
    ["ios_integration", { ...base, iOSIntegrationEnabled: true }],
    ["endpoint_enabled", { ...base, appEndpointEnabled: true, productionEndpointEnabled: true }],
    ["camera_cloud_runtime", { ...base, cameraLiveCloudEntryEnabled: true }],
    ["live_upload_runtimes", {
      ...base,
      autoTriggerRuntimeEnabled: true,
      wssRuntimeEnabled: true,
      uploadRuntimeEnabled: true
    }],
    ["serving_stack_switch", { ...base, servingStackSwitchRequested: true }]
  ];

  const results = scenarios.map(([scenario, samplePlan]) => ({
    scenario,
    report: evaluateOneFixtureServingBenchmarkApprovalRequest(samplePlan)
  }));
  const pass = results.find((item) => item.scenario === "safe_draft_only_approval_request")?.report;
  const blocked = results.filter((item) => item.scenario !== "safe_draft_only_approval_request");
  const blockers = [];

  if (!pass?.approvalRequestGateEligible) {
    blockers.push("blocked_for_safe_draft_sample_failure");
  }
  if (blocked.some((item) => item.report.approvalRequestGateEligible)) {
    blockers.push("blocked_for_blocked_sample_expectation_failure");
  }

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_ONE_FIXTURE_SERVING_BENCHMARK_APPROVAL_REQUEST_SCHEMA_VERSION,
    runMode: "one_fixture_serving_benchmark_approval_request_samples",
    approvalRequestGateEligible: blockers.length === 0,
    reviewedScenarioCount: results.length,
    safeDraftOnlyRequestPassed: pass?.approvalRequestGateEligible === true,
    expectedBlockedScenarioCount: blocked.filter((item) => !item.report.approvalRequestGateEligible).length,
    expectedBlockedReasons: unique(blocked.flatMap((item) => item.report.blockers)),
    nextPhaseRecommendation: "phase_21_u_approved_transformers_fastapi_one_fixture_serving_benchmark",
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
        ? "pass_for_one_fixture_serving_benchmark_approval_request"
        : "blocked_for_one_fixture_serving_benchmark_approval_request",
      ...blockers,
      "phase_21_t_approval_request_draft_only",
      "not_production_ready"
    ])
  };

  const redaction = assertOneFixtureServingBenchmarkApprovalRequestReportRedacted(report);
  if (!redaction.ok) {
    report.approvalRequestGateEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
  }

  return report;
}

export function assertOneFixtureServingBenchmarkApprovalRequestReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "one_fixture_serving_benchmark_approval_request_not_redacted",
        message: "One-fixture serving benchmark approval request report contains a forbidden artifact marker."
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
  return blockers;
}

function futureScopeBlockers(plan) {
  const blockers = [];
  if (plan.benchmarkKind !== "one_fixture_serving_benchmark") {
    blockers.push("blocked_for_unknown_benchmark_kind");
  }
  if (plan.servingStack !== "transformers_fastapi_reference") {
    blockers.push("blocked_for_non_transformers_fastapi_reference_stack");
  }
  if (plan.fixtureToken !== "smoke_001") {
    blockers.push("blocked_for_non_smoke_001_fixture");
  }
  if (safeCount(plan.fixtureCount) !== 1) {
    blockers.push("blocked_for_fixture_count_not_one");
  }
  if (safeCount(plan.callCount) !== 1) {
    blockers.push("blocked_for_call_count_not_one");
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
