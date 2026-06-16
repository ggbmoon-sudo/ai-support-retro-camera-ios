export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_PREFLIGHT_SCHEMA_VERSION =
  "open_weight_vlm_serving_benchmark_preflight.v1";

export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_STACKS = Object.freeze([
  "transformers_fastapi",
  "vllm",
  "sglang",
  "ollama_lm_studio"
]);

export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_METRICS = Object.freeze([
  "fixtureCount",
  "acceptedCount",
  "rejectedCount",
  "acceptanceRate",
  "validationCodeCounts",
  "fallbackCategoryCounts",
  "schemaErrorBucketCounts",
  "schemaFieldBucketCounts",
  "latencyBucketCounts",
  "p50LatencyBucket",
  "p95LatencyBucket",
  "timeoutCount",
  "providerIntegrationBlockCount",
  "modelServerUnavailableCount",
  "coldStartBucket",
  "warmRunBucket",
  "concurrencyBucket",
  "throughputBucket",
  "networkCallsMade",
  "productionReady",
  "rawPersistenceFlags"
]);

export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_STOP_CONDITIONS = Object.freeze([
  "repo_not_clean",
  "upstream_not_synced",
  "local_artifacts_staged",
  "healthz_unsafe",
  "public_exposure_detected",
  "raw_logging_enabled",
  "raw_output_would_print",
  "fixture_registry_gate_failed",
  "routing_echo_failed",
  "schema_regression",
  "raw_persistence_detected",
  "production_ready_true",
  "app_or_payload_change_detected",
  "app_facing_endpoint_added"
]);

export const OPEN_WEIGHT_VLM_SERVING_BENCHMARK_FIXTURE_RULES = Object.freeze([
  "approved_ignored_fixture_tokens_only",
  "twelve_fixture_controlled_set_first",
  "no_raw_paths",
  "no_fixture_images_committed",
  "no_local_registry_committed",
  "cold_run_requires_explicit_approval",
  "warm_run_requires_explicit_approval",
  "no_retries_without_repeatability_phase"
]);

const REQUIRED_ARTIFACT_POLICY_FLAGS = Object.freeze([
  "sanitizedAggregateOnly",
  "rawPromptAllowed",
  "rawModelOutputAllowed",
  "rawRequestPayloadAllowed",
  "rawImagePathAllowed",
  "rawLogsAllowed",
  "commitReportsByDefault"
]);

export function servingBenchmarkPreflightSample() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_PREFLIGHT_SCHEMA_VERSION,
    runMode: "serving_benchmark_preflight",
    scope: "backend_only_preflight",
    benchmarkScopeChosen: true,
    benchmarkRun: false,
    qwenInferenceRun: false,
    fixtureSetBucket: "approved_12_fixture_tokens",
    networkCallsMade: false,
    productionReady: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    iosIntegrationScope: false,
    publicEndpointAllowed: false,
    servingStacks: [
      {
        servingStack: "transformers_fastapi",
        role: "correctness_reference_baseline",
        implementationStatus: "already_working",
        benchmarkAllowed: false
      },
      {
        servingStack: "vllm",
        role: "primary_serving_benchmark_candidate",
        implementationStatus: "future_candidate",
        benchmarkAllowed: false
      },
      {
        servingStack: "sglang",
        role: "structured_output_performance_challenger",
        implementationStatus: "future_candidate",
        benchmarkAllowed: false
      },
      {
        servingStack: "ollama_lm_studio",
        role: "manual_local_smoke_only",
        implementationStatus: "manual_only",
        benchmarkAllowed: false
      }
    ],
    metrics: [...OPEN_WEIGHT_VLM_SERVING_BENCHMARK_METRICS],
    fixtureUsageRules: [...OPEN_WEIGHT_VLM_SERVING_BENCHMARK_FIXTURE_RULES],
    stopConditions: [...OPEN_WEIGHT_VLM_SERVING_BENCHMARK_STOP_CONDITIONS],
    artifactPolicy: {
      sanitizedAggregateOnly: true,
      rawPromptAllowed: false,
      rawModelOutputAllowed: false,
      rawRequestPayloadAllowed: false,
      rawImagePathAllowed: false,
      rawLogsAllowed: false,
      commitReportsByDefault: false
    },
    phase21EntryCriteria: {
      servingBenchmarkPreflightComplete: true,
      benchmarkScopeChosenExplicitly: true,
      safeBenchmarkPlanExists: true,
      twelveFixtureSmokeAcceptedAndReviewed: true,
      latencyRiskDocumented: true,
      existingGatesMustPass: true,
      noIosIntegration: true,
      noProductionEndpoint: true,
      backendGatewayValidatesStructuredCandidateJson: true,
      backendGatewayNoFreeFormModelText: true,
      backendGatewayNoRawAppUploadsUntilPolicyDefined: true,
      productionReady: false
    }
  };
}

export function evaluateOpenWeightVlmServingBenchmarkPreflight(plan = {}) {
  const blockers = [];
  const warnings = [];

  if (!isPlainObject(plan)) {
    blockers.push("blocked_for_invalid_preflight_schema");
  }

  if (plan.productionReady !== false || plan.phase21EntryCriteria?.productionReady !== false) {
    blockers.push("blocked_for_production_flag");
  }

  if (plan.networkCallsMade !== false || plan.benchmarkRun !== false || plan.qwenInferenceRun !== false) {
    blockers.push("blocked_for_execution_attempt");
  }

  if (plan.scope !== "backend_only_preflight") {
    blockers.push("blocked_for_invalid_scope");
  }

  if (plan.benchmarkScopeChosen !== true) {
    blockers.push("blocked_for_missing_benchmark_scope");
  }

  if (plan.appFacingEndpoint === true || plan.productionEndpoint === true || plan.publicEndpointAllowed === true) {
    blockers.push("blocked_for_public_endpoint");
  }

  if (plan.iosIntegrationScope === true) {
    blockers.push("blocked_for_ios_integration_scope");
  }

  if (plan.fixtureSetBucket !== "approved_12_fixture_tokens") {
    blockers.push("blocked_for_missing_fixture_set");
  }

  const servingStacks = Array.isArray(plan.servingStacks) ? plan.servingStacks : [];
  if (servingStacks.length === 0) {
    blockers.push("blocked_for_missing_serving_stack");
  }

  const stackIds = new Set(servingStacks.map((stack) => sanitizeToken(stack?.servingStack)));
  for (const stack of OPEN_WEIGHT_VLM_SERVING_BENCHMARK_STACKS) {
    if (!stackIds.has(stack)) {
      blockers.push("blocked_for_missing_serving_stack");
    }
  }

  if (servingStacks.some((stack) => stack?.benchmarkAllowed === true)) {
    blockers.push("blocked_for_execution_attempt");
  }

  const metricSet = new Set(Array.isArray(plan.metrics) ? plan.metrics.map(sanitizeToken) : []);
  const missingMetrics = OPEN_WEIGHT_VLM_SERVING_BENCHMARK_METRICS.filter((metric) => !metricSet.has(metric));
  if (missingMetrics.length > 0) {
    blockers.push("blocked_for_missing_metrics");
  }

  const fixtureRuleSet = new Set(Array.isArray(plan.fixtureUsageRules) ? plan.fixtureUsageRules.map(sanitizeToken) : []);
  const missingFixtureRules = OPEN_WEIGHT_VLM_SERVING_BENCHMARK_FIXTURE_RULES
    .filter((rule) => !fixtureRuleSet.has(rule));
  if (missingFixtureRules.length > 0) {
    blockers.push("blocked_for_missing_fixture_rules");
  }

  const stopConditionSet = new Set(Array.isArray(plan.stopConditions) ? plan.stopConditions.map(sanitizeToken) : []);
  const missingStopConditions = OPEN_WEIGHT_VLM_SERVING_BENCHMARK_STOP_CONDITIONS
    .filter((condition) => !stopConditionSet.has(condition));
  if (missingStopConditions.length > 0) {
    blockers.push("blocked_for_missing_stop_conditions");
  }

  if (!artifactPolicyIsSafe(plan.artifactPolicy)) {
    blockers.push("blocked_for_raw_artifact_policy");
  }

  if (latencyBaselineHasBenchmarkConcern(plan.latencyBaseline)) {
    warnings.push("latency_note_requires_future_benchmark");
  }

  const uniqueBlockers = unique(blockers);
  const statusCategories = unique([
    uniqueBlockers.length === 0
      ? "pass_for_serving_benchmark_preflight"
      : "blocked_for_serving_benchmark_preflight",
    ...uniqueBlockers,
    "not_production_ready"
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_PREFLIGHT_SCHEMA_VERSION,
    runMode: "serving_benchmark_preflight",
    productionReady: false,
    networkCallsMade: false,
    benchmarkRun: false,
    qwenInferenceRun: false,
    eligibleForPhase21EntryReview: uniqueBlockers.length === 0,
    eligibleForBenchmarkExecution: false,
    statusCategories,
    hardBlockers: uniqueBlockers,
    warnings: unique(warnings),
    missingServingStacks: OPEN_WEIGHT_VLM_SERVING_BENCHMARK_STACKS.filter((stack) => !stackIds.has(stack)),
    missingMetrics,
    missingFixtureRules,
    missingStopConditions,
    reviewedPlan: {
      scope: sanitizeToken(plan.scope),
      fixtureSetBucket: sanitizeToken(plan.fixtureSetBucket),
      servingStacks: servingStacks.map((stack) => ({
        servingStack: sanitizeToken(stack?.servingStack),
        role: sanitizeToken(stack?.role),
        implementationStatus: sanitizeToken(stack?.implementationStatus),
        benchmarkAllowed: stack?.benchmarkAllowed === true
      })),
      artifactPolicy: summarizeArtifactPolicy(plan.artifactPolicy)
    }
  };

  const redaction = assertOpenWeightVlmServingBenchmarkPreflightReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForPhase21EntryReview = false;
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_raw_artifact_policy"]);
    report.statusCategories = unique([
      "blocked_for_serving_benchmark_preflight",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmServingBenchmarkPreflightReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const forbiddenSnippets = [
    "data:image",
    "image_url",
    "fullPrompt",
    "rawResponse",
    "modelResponseText",
    "modelOutput",
    "requestPayload",
    "Authorization",
    "Bearer ",
    "apiKey",
    "QWE_API_KEY",
    "GEMINI_API_KEY",
    "OPENAI_API_KEY",
    "http://",
    "https://",
    ".jpg",
    ".jpeg",
    ".png",
    "/Users/",
    "/Volumes/",
    "/private/",
    "C:\\",
    "stack trace"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: {
          code: "serving_benchmark_preflight_not_redacted",
          message: "Serving benchmark preflight report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

function artifactPolicyIsSafe(policy = {}) {
  if (!isPlainObject(policy)) {
    return false;
  }

  for (const flag of REQUIRED_ARTIFACT_POLICY_FLAGS) {
    if (!(flag in policy)) {
      return false;
    }
  }

  return policy.sanitizedAggregateOnly === true
    && policy.rawPromptAllowed === false
    && policy.rawModelOutputAllowed === false
    && policy.rawRequestPayloadAllowed === false
    && policy.rawImagePathAllowed === false
    && policy.rawLogsAllowed === false
    && policy.commitReportsByDefault === false;
}

function summarizeArtifactPolicy(policy = {}) {
  return {
    sanitizedAggregateOnly: policy?.sanitizedAggregateOnly === true,
    rawPromptAllowed: policy?.rawPromptAllowed === true,
    rawModelOutputAllowed: policy?.rawModelOutputAllowed === true,
    rawRequestPayloadAllowed: policy?.rawRequestPayloadAllowed === true,
    rawImagePathAllowed: policy?.rawImagePathAllowed === true,
    rawLogsAllowed: policy?.rawLogsAllowed === true,
    commitReportsByDefault: policy?.commitReportsByDefault === true
  };
}

function latencyBaselineHasBenchmarkConcern(latencyBaseline = {}) {
  return Number(latencyBaseline?.latencyBucketCounts?.gt_15s ?? 0) > 0;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
