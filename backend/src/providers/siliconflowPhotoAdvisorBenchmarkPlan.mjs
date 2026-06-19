import {
  PhotoAdvisorModelCandidate,
  PHOTO_ADVISOR_MODEL_IDS
} from "./photoAdvisorProviderTypes.mjs";

export const SILICONFLOW_BENCHMARK_DRY_RUN_PHASE = "Phase 21-Z2C-SF-RUN-PRE";
export const SILICONFLOW_BENCHMARK_FUTURE_RUN_PHASE = "Phase 21-Z2C-SF-RUN";
export const SILICONFLOW_BENCHMARK_FIXTURE_TOKENS = Object.freeze([
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

export const SILICONFLOW_BENCHMARK_DEFAULT_BLOCKERS = Object.freeze([
  "benchmark_not_approved",
  "provider_network_not_approved",
  "provider_credentials_not_loaded",
  "provider_upload_not_approved",
  "api_runtime_disabled"
]);

export function buildSiliconFlowBenchmarkDryRunPlan(overrides = {}) {
  return {
    phase: SILICONFLOW_BENCHMARK_DRY_RUN_PHASE,
    futureRunPhase: SILICONFLOW_BENCHMARK_FUTURE_RUN_PHASE,
    providerClass: "siliconflow",
    modelClass: PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct,
    modelId: PHOTO_ADVISOR_MODEL_IDS[PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct],
    fixtureTokens: [...SILICONFLOW_BENCHMARK_FIXTURE_TOKENS],
    expectedFixtureCount: 12,
    plannedCallCount: 12,
    actualCallCount: 0,
    retryCount: 0,
    imageDetail: "low",
    stream: false,
    maxOutputTokens: 256,
    temperature: 0.1,
    benchmarkApproved: false,
    executionAllowed: false,
    networkCallsMade: false,
    apiKeyRead: false,
    fixtureImagesOpened: false,
    productionReady: false,
    ...overrides
  };
}

export function evaluateSiliconFlowBenchmarkDryRunPlan(plan = buildSiliconFlowBenchmarkDryRunPlan()) {
  const blockers = new Set(SILICONFLOW_BENCHMARK_DEFAULT_BLOCKERS);

  if (!matchesFixtureTokens(plan.fixtureTokens)) {
    blockers.add("fixture_token_list_mismatch");
  }

  if (plan.expectedFixtureCount !== SILICONFLOW_BENCHMARK_FIXTURE_TOKENS.length) {
    blockers.add("fixture_count_mismatch");
  }

  if (!Array.isArray(plan.fixtureTokens) || plan.fixtureTokens.length !== plan.expectedFixtureCount) {
    blockers.add("fixture_count_mismatch");
  }

  if (plan.plannedCallCount !== 12) {
    blockers.add("planned_call_count_mismatch");
  }

  if (plan.actualCallCount !== 0) {
    blockers.add("actual_call_count_not_zero");
  }

  if (plan.retryCount !== 0) {
    blockers.add("retry_count_not_zero");
  }

  if (plan.benchmarkApproved !== false) {
    blockers.add("benchmark_approval_must_be_false_in_preflight");
  }

  if (plan.executionAllowed !== false) {
    blockers.add("execution_must_be_disabled");
  }

  if (plan.networkCallsMade !== false) {
    blockers.add("network_call_detected");
  }

  if (plan.apiKeyRead !== false) {
    blockers.add("api_key_read_detected");
  }

  if (plan.fixtureImagesOpened !== false) {
    blockers.add("fixture_image_read_detected");
  }

  if (plan.productionReady !== false) {
    blockers.add("production_ready_must_be_false");
  }

  if (plan.imageDetail !== "low") {
    blockers.add("image_detail_mismatch");
  }

  if (plan.stream !== false) {
    blockers.add("stream_must_be_false");
  }

  if (plan.maxOutputTokens !== 256) {
    blockers.add("max_output_tokens_mismatch");
  }

  if (plan.temperature !== 0.1) {
    blockers.add("temperature_mismatch");
  }

  if (plan.modelClass !== PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct) {
    blockers.add("model_class_mismatch");
  }

  if (plan.modelId !== PHOTO_ADVISOR_MODEL_IDS[PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct]) {
    blockers.add("model_id_mismatch");
  }

  return {
    ok: false,
    safeToExecute: false,
    blockers: Array.from(blockers).sort(),
    productionReady: false,
    networkCallsMade: false,
    apiKeyRead: false,
    fixtureImagesOpened: false
  };
}

export function siliconFlowBenchmarkDryRunReport(plan = buildSiliconFlowBenchmarkDryRunPlan()) {
  const evaluation = evaluateSiliconFlowBenchmarkDryRunPlan(plan);

  return {
    phase: String(plan.phase ?? SILICONFLOW_BENCHMARK_DRY_RUN_PHASE),
    futureRunPhase: String(plan.futureRunPhase ?? SILICONFLOW_BENCHMARK_FUTURE_RUN_PHASE),
    providerClass: plan.providerClass === "siliconflow" ? "siliconflow" : "unknown",
    modelClass: plan.modelClass === PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct
      ? PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct
      : "unknown",
    fixtureCount: Array.isArray(plan.fixtureTokens) ? plan.fixtureTokens.length : 0,
    plannedCallCount: Number.isInteger(plan.plannedCallCount) ? plan.plannedCallCount : 0,
    actualCallCount: 0,
    retryCount: Number.isInteger(plan.retryCount) ? plan.retryCount : 0,
    benchmarkApproved: false,
    executionAllowed: false,
    networkCallsMade: false,
    apiKeyRead: false,
    fixtureImagesOpened: false,
    blockers: evaluation.blockers,
    productionReady: false
  };
}

function matchesFixtureTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length !== SILICONFLOW_BENCHMARK_FIXTURE_TOKENS.length) {
    return false;
  }

  return tokens.every((token, index) => token === SILICONFLOW_BENCHMARK_FIXTURE_TOKENS[index]);
}
