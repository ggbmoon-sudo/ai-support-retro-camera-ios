export const OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_DRY_RUN_PLAN_SCHEMA_VERSION =
  "open_weight_vlm_local_model_route_dry_run_plan.v1";

const REQUIRED_ROUTE = "local_model";
const REQUIRED_SOURCE_TYPE = "synthetic_local_fixture";

const REQUIRED_PRE_RUN_GATES = Object.freeze([
  "local_model_route_approval",
  "deployment_config_env_preflight",
  "cross_platform_boundary",
  "provider_routing",
  "provider_adapter_no_model_http"
]);

const FORBIDDEN_REPORT_SNIPPETS = Object.freeze([
  "C:\\",
  "C:/",
  "/Users/",
  "/Volumes/",
  "http://",
  "https://",
  "ngrok",
  "cloudflared",
  "data:image",
  "base64",
  "rawPrompt",
  "fullPrompt",
  "\"requestPayload\":",
  "rawModelOutput",
  "modelOutput",
  "rawProviderResponse",
  "Authorization",
  "Bearer ",
  "QWE_API_KEY=",
  "GEMINI_API_KEY=",
  "OPENAI_API_KEY=",
  "CODE0_API_KEY=",
  "INTENEXT_API_KEY=",
  ".jpg",
  ".jpeg",
  ".png",
  "EXIF",
  "GPS",
  "secret_value",
  "provider_key_value",
  "chain-of-thought"
]);

const FORBIDDEN_PROBE_VALUE_SNIPPETS = Object.freeze([
  ...FORBIDDEN_REPORT_SNIPPETS,
  "prompt",
  "requestPayload",
  "modelOutput"
]);

export function localModelRouteDryRunPlanReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_DRY_RUN_PLAN_SCHEMA_VERSION,
    requestedRoute: REQUIRED_ROUTE,
    localModelRouteEnabled: false,
    routeDisabled: true,
    futureExplicitUserApprovalRequired: true,
    sourceType: REQUIRED_SOURCE_TYPE,
    fixtureCount: 1,
    fixtureTokenScopeDeclared: true,
    fixtureTokenApprovedInFuturePhase: true,
    realUserPhotoScope: false,
    oneCallOnly: true,
    maxNetworkCalls: 1,
    retriesAllowed: false,
    retryCount: 0,
    requiredPreRunGates: [...REQUIRED_PRE_RUN_GATES],
    repoCleanRequired: true,
    upstreamSyncedRequired: true,
    localArtifactsIgnoredRequired: true,
    stagedLocalConfigAllowed: false,
    stagedFixtureRegistryAllowed: false,
    stagedFixtureImagesAllowed: false,
    healthzSafeRequired: true,
    healthzModelLoadedSafeBucketRequired: true,
    publicExposure: "no",
    rawLoggingDisabledRequired: true,
    endpointScope: "local_private_only",
    providerRoutingModeRequired: "local_model_explicit_future_only",
    structuredCandidateJsonOnly: true,
    backendValidatorRequired: true,
    validatorBypassAllowed: false,
    fallbackSafetyRequired: true,
    fallbackSafetyBypassAllowed: false,
    rawArtifactPolicyLocked: true,
    rawLoggingAllowed: false,
    rawPersistenceAllowed: false,
    rawPromptAllowed: false,
    rawModelOutputAllowed: false,
    rawImagePathAllowed: false,
    rawBase64Allowed: false,
    requestPayloadLoggingAllowed: false,
    localConfigPrintingAllowed: false,
    fixtureRegistryPrintingAllowed: false,
    iOSIntegrationEnabled: false,
    iOSDirectProviderModelCall: false,
    cameraCloudAiEntryEnabled: false,
    iOSUploadPayloadChanged: false,
    captureContextUploadEnabled: false,
    appFacingEndpointEnabled: false,
    productionEndpointEnabled: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    probeValues: []
  };
}

export function evaluateOpenWeightVlmLocalModelRouteDryRunPlan(
  plan = localModelRouteDryRunPlanReadyPolicy()
) {
  const blockers = unique([
    ...routeBlockers(plan),
    ...fixtureScopeBlockers(plan),
    ...callLimitBlockers(plan),
    ...retryBlockers(plan),
    ...preRunGateBlockers(plan),
    ...healthzBlockers(plan),
    ...configBlockers(plan),
    ...providerRoutingBlockers(plan),
    ...validatorSafetyBlockers(plan),
    ...privacyLoggingBlockers(plan),
    ...iosBoundaryBlockers(plan),
    ...endpointBoundaryBlockers(plan),
    ...executionBlockers(plan),
    ...probeValueBlockers(plan.probeValues || []),
    ...(plan.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_DRY_RUN_PLAN_SCHEMA_VERSION,
    requestedRoute: sanitizeToken(plan.requestedRoute || "unknown"),
    dryRunPlanEligible: blockers.length === 0,
    fixtureScopeBucket: fixtureScopeBucket(plan),
    callLimitBucket: callLimitBucket(plan),
    retryPolicyBucket: retryPolicyBucket(plan),
    healthzRequirementsBucket: healthzRequirementsBucket(plan),
    configRequirementsBucket: configRequirementsBucket(plan),
    providerRoutingBucket: providerRoutingBucket(plan),
    validatorSafetyBucket: validatorSafetyBucket(plan),
    privacyLoggingBucket: privacyLoggingBucket(plan),
    iOSBoundaryBucket: iOSBoundaryBucket(plan),
    endpointBoundaryBucket: endpointBoundaryBucket(plan),
    blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_local_model_route_dry_run_plan"
        : "blocked_for_local_model_route_dry_run_plan",
      ...blockers,
      "local_model_route_still_disabled",
      "planning_phase_no_model_calls",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmLocalModelRouteDryRunPlanReportRedacted(report);
  if (!redaction.ok) {
    report.dryRunPlanEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_local_model_route_dry_run_plan",
      ...report.blockers,
      "local_model_route_still_disabled",
      "planning_phase_no_model_calls",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmLocalModelRouteDryRunPlanSamples() {
  const readyReport = evaluateOpenWeightVlmLocalModelRouteDryRunPlan(
    localModelRouteDryRunPlanReadyPolicy()
  );
  const blockedReport = evaluateOpenWeightVlmLocalModelRouteDryRunPlan({
    ...localModelRouteDryRunPlanReadyPolicy(),
    fixtureCount: 12,
    retriesAllowed: true,
    rawLoggingAllowed: true,
    modelCallsMade: true,
    productionReady: true
  });
  const blockers = readyReport.dryRunPlanEligible && !blockedReport.dryRunPlanEligible
    ? []
    : ["blocked_for_sample_plan_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_DRY_RUN_PLAN_SCHEMA_VERSION,
    requestedRoute: REQUIRED_ROUTE,
    dryRunPlanEligible: blockers.length === 0,
    fixtureScopeBucket: readyReport.fixtureScopeBucket,
    callLimitBucket: readyReport.callLimitBucket,
    retryPolicyBucket: readyReport.retryPolicyBucket,
    healthzRequirementsBucket: readyReport.healthzRequirementsBucket,
    configRequirementsBucket: readyReport.configRequirementsBucket,
    providerRoutingBucket: readyReport.providerRoutingBucket,
    validatorSafetyBucket: readyReport.validatorSafetyBucket,
    privacyLoggingBucket: readyReport.privacyLoggingBucket,
    iOSBoundaryBucket: readyReport.iOSBoundaryBucket,
    endpointBoundaryBucket: readyReport.endpointBoundaryBucket,
    blockers,
    reviewedPlanCount: 2,
    eligiblePlanCount: readyReport.dryRunPlanEligible ? 1 : 0,
    expectedBlockedPlanCount: blockedReport.dryRunPlanEligible ? 0 : 1,
    expectedBlockedReasons: blockedReport.blockers,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    productionReady: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_local_model_route_dry_run_plan"
        : "blocked_for_local_model_route_dry_run_plan",
      ...blockers,
      "local_model_route_still_disabled",
      "planning_phase_no_model_calls",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmLocalModelRouteDryRunPlanReportRedacted(report);
  if (!redaction.ok) {
    report.dryRunPlanEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_local_model_route_dry_run_plan",
      ...report.blockers,
      "local_model_route_still_disabled",
      "planning_phase_no_model_calls",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmLocalModelRouteDryRunPlanReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "local_model_route_dry_run_plan_not_redacted",
        message: "Local model route dry-run plan report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function routeBlockers(plan) {
  const blockers = [];
  if (plan.requestedRoute !== REQUIRED_ROUTE) {
    blockers.push("blocked_for_unsupported_route");
  }
  if (plan.localModelRouteEnabled === true || plan.routeDisabled !== true) {
    blockers.push("blocked_for_local_model_route_enabled");
  }
  if (plan.futureExplicitUserApprovalRequired !== true) {
    blockers.push("blocked_for_missing_future_user_approval_requirement");
  }
  return blockers;
}

function fixtureScopeBlockers(plan) {
  const blockers = [];
  if (plan.sourceType !== REQUIRED_SOURCE_TYPE) {
    blockers.push(plan.realUserPhotoScope === true
      ? "blocked_for_real_user_photo_scope"
      : "blocked_for_unsupported_fixture_source");
  }
  if (plan.fixtureCount !== 1) {
    blockers.push("blocked_for_multi_fixture_plan");
  }
  if (plan.fixtureTokenScopeDeclared !== true || plan.fixtureTokenApprovedInFuturePhase !== true) {
    blockers.push("blocked_for_missing_fixture_token_scope");
  }
  if (plan.realUserPhotoScope === true) {
    blockers.push("blocked_for_real_user_photo_scope");
  }
  return blockers;
}

function callLimitBlockers(plan) {
  const blockers = [];
  if (plan.oneCallOnly !== true || plan.maxNetworkCalls !== 1) {
    blockers.push("blocked_for_non_one_call_plan");
  }
  return blockers;
}

function retryBlockers(plan) {
  const blockers = [];
  if (plan.retriesAllowed === true || Number(plan.retryCount || 0) > 0) {
    blockers.push("blocked_for_retry_enabled");
  }
  return blockers;
}

function preRunGateBlockers(plan) {
  const blockers = [];
  const gateSet = new Set(Array.isArray(plan.requiredPreRunGates) ? plan.requiredPreRunGates : []);
  for (const gate of REQUIRED_PRE_RUN_GATES) {
    if (!gateSet.has(gate)) {
      blockers.push(`blocked_for_missing_${gate}`);
    }
  }
  if (plan.repoCleanRequired !== true) {
    blockers.push("blocked_for_missing_repo_clean_requirement");
  }
  if (plan.upstreamSyncedRequired !== true) {
    blockers.push("blocked_for_missing_upstream_synced_requirement");
  }
  if (plan.localArtifactsIgnoredRequired !== true) {
    blockers.push("blocked_for_missing_ignored_artifact_requirement");
  }
  return blockers;
}

function healthzBlockers(plan) {
  const blockers = [];
  if (plan.healthzSafeRequired !== true || plan.healthzModelLoadedSafeBucketRequired !== true) {
    blockers.push("blocked_for_unsafe_healthz_requirement");
  }
  if (plan.publicExposure !== "no") {
    blockers.push("blocked_for_public_exposure");
  }
  if (plan.rawLoggingDisabledRequired !== true) {
    blockers.push("blocked_for_raw_logging_enabled");
  }
  if (plan.endpointScope !== "local_private_only") {
    blockers.push("blocked_for_public_cloud_tunnel_endpoint");
  }
  return blockers;
}

function configBlockers(plan) {
  const blockers = [];
  if (plan.stagedLocalConfigAllowed === true) {
    blockers.push("blocked_for_staged_local_config_policy");
  }
  if (plan.stagedFixtureRegistryAllowed === true) {
    blockers.push("blocked_for_staged_fixture_registry_policy");
  }
  if (plan.stagedFixtureImagesAllowed === true) {
    blockers.push("blocked_for_staged_fixture_images_policy");
  }
  return blockers;
}

function providerRoutingBlockers(plan) {
  if (plan.providerRoutingModeRequired !== "local_model_explicit_future_only") {
    return ["blocked_for_provider_routing_requirement"];
  }
  return [];
}

function validatorSafetyBlockers(plan) {
  const blockers = [];
  if (plan.structuredCandidateJsonOnly !== true) {
    blockers.push("blocked_for_free_form_model_text");
  }
  if (plan.backendValidatorRequired !== true || plan.validatorBypassAllowed === true) {
    blockers.push("blocked_for_validator_bypass");
  }
  if (plan.fallbackSafetyRequired !== true || plan.fallbackSafetyBypassAllowed === true) {
    blockers.push("blocked_for_fallback_safety_bypass");
  }
  return blockers;
}

function privacyLoggingBlockers(plan) {
  const blockers = [];
  if (plan.rawArtifactPolicyLocked !== true) {
    blockers.push("blocked_for_unlocked_raw_artifact_policy");
  }
  const rawFlags = [
    "rawLoggingAllowed",
    "rawPersistenceAllowed",
    "rawPromptAllowed",
    "rawModelOutputAllowed",
    "rawImagePathAllowed",
    "rawBase64Allowed",
    "requestPayloadLoggingAllowed",
    "localConfigPrintingAllowed",
    "fixtureRegistryPrintingAllowed"
  ];
  if (rawFlags.some((flag) => plan[flag] === true)) {
    blockers.push("blocked_for_raw_artifact_policy");
  }
  return blockers;
}

function iosBoundaryBlockers(plan) {
  const blockers = [];
  const pairs = [
    ["iOSIntegrationEnabled", "blocked_for_ios_integration"],
    ["iOSDirectProviderModelCall", "blocked_for_ios_direct_provider"],
    ["cameraCloudAiEntryEnabled", "blocked_for_camera_cloud_ai_entry"],
    ["iOSUploadPayloadChanged", "blocked_for_ios_upload_payload_change"],
    ["captureContextUploadEnabled", "blocked_for_capture_context_upload"]
  ];
  for (const [field, blocker] of pairs) {
    if (plan[field] === true) {
      blockers.push(blocker);
    }
  }
  return blockers;
}

function endpointBoundaryBlockers(plan) {
  const blockers = [];
  if (plan.appFacingEndpointEnabled === true) {
    blockers.push("blocked_for_app_facing_endpoint");
  }
  if (plan.productionEndpointEnabled === true) {
    blockers.push("blocked_for_production_endpoint");
  }
  return blockers;
}

function executionBlockers(plan) {
  const blockers = [];
  if (plan.modelCallsMade === true) {
    blockers.push("blocked_for_model_call_in_planning_phase");
  }
  if (plan.qwenInferenceRun === true) {
    blockers.push("blocked_for_qwen_inference_in_planning_phase");
  }
  if (plan.benchmarkRun === true) {
    blockers.push("blocked_for_benchmark_execution");
  }
  return blockers;
}

function probeValueBlockers(values) {
  const blockers = [];
  for (const value of values) {
    if (
      typeof value === "string" &&
      FORBIDDEN_PROBE_VALUE_SNIPPETS.some((snippet) => value.includes(snippet))
    ) {
      blockers.push("blocked_for_committed_raw_plan_value");
    }
  }
  return unique(blockers);
}

function fixtureScopeBucket(plan) {
  if (
    plan.sourceType === REQUIRED_SOURCE_TYPE &&
    plan.fixtureCount === 1 &&
    plan.fixtureTokenScopeDeclared === true &&
    plan.fixtureTokenApprovedInFuturePhase === true &&
    plan.realUserPhotoScope !== true
  ) {
    return "one_declared_synthetic_local_fixture_token";
  }
  if (plan.realUserPhotoScope === true) {
    return "blocked_real_user_photo_scope";
  }
  return "blocked_fixture_scope";
}

function callLimitBucket(plan) {
  return plan.oneCallOnly === true && plan.maxNetworkCalls === 1
    ? "one_call_only"
    : "blocked_call_limit";
}

function retryPolicyBucket(plan) {
  return plan.retriesAllowed !== true && Number(plan.retryCount || 0) === 0
    ? "no_retries"
    : "blocked_retry_policy";
}

function healthzRequirementsBucket(plan) {
  return plan.healthzSafeRequired === true &&
    plan.publicExposure === "no" &&
    plan.rawLoggingDisabledRequired === true &&
    plan.endpointScope === "local_private_only"
    ? "safe_healthz_local_private_no_raw_logging"
    : "blocked_healthz_requirement";
}

function configRequirementsBucket(plan) {
  return plan.localArtifactsIgnoredRequired === true &&
    plan.stagedLocalConfigAllowed !== true &&
    plan.stagedFixtureRegistryAllowed !== true &&
    plan.stagedFixtureImagesAllowed !== true
    ? "ignored_local_config_registry_fixtures_required"
    : "blocked_config_requirement";
}

function providerRoutingBucket(plan) {
  return plan.providerRoutingModeRequired === "local_model_explicit_future_only"
    ? "local_model_requires_future_explicit_route"
    : "blocked_provider_routing";
}

function validatorSafetyBucket(plan) {
  return plan.structuredCandidateJsonOnly === true &&
    plan.backendValidatorRequired === true &&
    plan.validatorBypassAllowed !== true &&
    plan.fallbackSafetyRequired === true &&
    plan.fallbackSafetyBypassAllowed !== true
    ? "structured_candidate_backend_validator_fallback_required"
    : "blocked_validator_safety";
}

function privacyLoggingBucket(plan) {
  return plan.rawArtifactPolicyLocked === true &&
    plan.rawLoggingAllowed !== true &&
    plan.rawPersistenceAllowed !== true &&
    plan.rawPromptAllowed !== true &&
    plan.rawModelOutputAllowed !== true &&
    plan.rawImagePathAllowed !== true &&
    plan.rawBase64Allowed !== true &&
    plan.requestPayloadLoggingAllowed !== true
    ? "raw_artifact_policy_locked"
    : "blocked_privacy_logging";
}

function iOSBoundaryBucket(plan) {
  return plan.iOSIntegrationEnabled !== true &&
    plan.iOSDirectProviderModelCall !== true &&
    plan.cameraCloudAiEntryEnabled !== true &&
    plan.iOSUploadPayloadChanged !== true &&
    plan.captureContextUploadEnabled !== true
    ? "ios_unchanged_no_direct_provider_or_upload_change"
    : "blocked_ios_boundary";
}

function endpointBoundaryBucket(plan) {
  return plan.endpointScope === "local_private_only" &&
    plan.appFacingEndpointEnabled !== true &&
    plan.productionEndpointEnabled !== true
    ? "local_private_only_no_app_or_production_endpoint"
    : "blocked_endpoint_boundary";
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
