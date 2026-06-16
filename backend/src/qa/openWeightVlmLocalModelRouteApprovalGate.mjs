export const OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_APPROVAL_GATE_SCHEMA_VERSION =
  "open_weight_vlm_local_model_route_approval_gate.v1";

const REQUIRED_REQUESTED_ROUTE = "local_model";

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

const FORBIDDEN_POLICY_VALUE_SNIPPETS = Object.freeze([
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
  "Bearer ",
  "Authorization",
  ".jpg",
  ".jpeg",
  ".png",
  "rawPrompt",
  "requestPayload",
  "modelOutput"
]);

export function localModelRouteApprovalReadyPolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_APPROVAL_GATE_SCHEMA_VERSION,
    requestedRoute: REQUIRED_REQUESTED_ROUTE,
    localModelRouteEnabled: false,
    repoClean: true,
    upstreamSynced: true,
    phase21GCommittedAndPushed: true,
    deploymentConfigEnvPreflightPassed: true,
    crossPlatformBoundaryGatePassed: true,
    providerRoutingGatePassed: true,
    providerAdapterNoModelHttpGatePassed: true,
    healthzSafe: true,
    publicExposure: "no",
    rawLoggingDisabled: true,
    endpointLocalPrivateOnly: true,
    rawPersistenceDetected: false,
    fixtureRegistryIgnored: true,
    localConfigIgnored: true,
    fixtureImagesIgnored: true,
    stagedLocalConfig: false,
    stagedFixtureRegistry: false,
    stagedFixtureImages: false,
    futureExplicitUserApprovalRequired: true,
    scopedFixtureTokensDeclared: true,
    realUserPhotoUploadEnabled: false,
    consentRequired: true,
    retentionPolicyRequired: true,
    deletionPolicyRequired: true,
    iosIntegrationEnabled: false,
    directIOSProviderModelCall: false,
    cameraCloudAiEntryEnabled: false,
    backendIosPayloadChanged: false,
    appFacingEndpointEnabled: false,
    productionEndpointEnabled: false,
    structuredCandidateJsonMandatory: true,
    backendValidatorRequired: true,
    schemaValidatorBypassed: false,
    fallbackSafetyRequired: true,
    fallbackSafetyBypassed: false,
    freeFormModelTextExposed: false,
    scoreOrRatingAllowed: false,
    sensitiveInferenceAllowed: false,
    chainOfThoughtAllowed: false,
    debugProviderLeakageAllowed: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    productionReady: false,
    policyProbeValues: []
  };
}

export function evaluateOpenWeightVlmLocalModelRouteApprovalGate(
  policy = localModelRouteApprovalReadyPolicy()
) {
  const blockers = unique([
    ...routeBlockers(policy),
    ...requiredGateBlockers(policy),
    ...healthzBlockers(policy),
    ...configBlockers(policy),
    ...privacyLoggingBlockers(policy),
    ...iosEndpointBlockers(policy),
    ...validatorSafetyBlockers(policy),
    ...executionBlockers(policy),
    ...policyProbeValueBlockers(policy.policyProbeValues || []),
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_APPROVAL_GATE_SCHEMA_VERSION,
    runMode: "local_model_route_approval_gate",
    scope: "backend_internal_no_network_no_model",
    requestedRoute: sanitizeToken(policy.requestedRoute || "unknown"),
    approvalEligible: blockers.length === 0,
    blockerCount: blockers.length,
    blockers,
    requiredGateBuckets: requiredGateBuckets(policy),
    healthzBucket: healthzBucket(policy),
    configBucket: configBucket(policy),
    privacyLoggingBucket: privacyLoggingBucket(policy),
    validatorSafetyBucket: validatorSafetyBucket(policy),
    iOSBoundaryBucket: iOSBoundaryBucket(policy),
    endpointBoundaryBucket: endpointBoundaryBucket(policy),
    localModelRouteEnabled: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    networkCallsMade: false,
    productionReady: false,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      blockers.length === 0
        ? "pass_for_local_model_route_approval_review"
        : "blocked_for_local_model_route_approval_review",
      ...blockers,
      "local_model_route_still_disabled",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmLocalModelRouteApprovalGateReportRedacted(report);
  if (!redaction.ok) {
    report.approvalEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.blockerCount = report.blockers.length;
    report.statusCategories = unique([
      "blocked_for_local_model_route_approval_review",
      ...report.blockers,
      "local_model_route_still_disabled",
      "not_production_ready"
    ]);
  }

  return report;
}

export function evaluateOpenWeightVlmLocalModelRouteApprovalGateSamples() {
  const readyReport = evaluateOpenWeightVlmLocalModelRouteApprovalGate(
    localModelRouteApprovalReadyPolicy()
  );
  const blockedReport = evaluateOpenWeightVlmLocalModelRouteApprovalGate({
    ...localModelRouteApprovalReadyPolicy(),
    productionReady: true,
    publicExposure: "public",
    rawLoggingDisabled: false,
    modelCallsAllowed: true
  });
  const aggregateBlockers = readyReport.approvalEligible && !blockedReport.approvalEligible
    ? []
    : ["blocked_for_sample_policy_expectation_mismatch"];

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_LOCAL_MODEL_ROUTE_APPROVAL_GATE_SCHEMA_VERSION,
    runMode: "local_model_route_approval_gate_samples",
    scope: "backend_internal_no_network_no_model",
    requestedRoute: REQUIRED_REQUESTED_ROUTE,
    approvalEligible: aggregateBlockers.length === 0,
    blockerCount: aggregateBlockers.length,
    blockers: aggregateBlockers,
    requiredGateBuckets: readyReport.requiredGateBuckets,
    healthzBucket: readyReport.healthzBucket,
    configBucket: readyReport.configBucket,
    privacyLoggingBucket: readyReport.privacyLoggingBucket,
    validatorSafetyBucket: readyReport.validatorSafetyBucket,
    iOSBoundaryBucket: readyReport.iOSBoundaryBucket,
    endpointBoundaryBucket: readyReport.endpointBoundaryBucket,
    reviewedPolicyCount: 2,
    approvalReadyPolicyCount: readyReport.approvalEligible ? 1 : 0,
    expectedBlockedPolicyCount: blockedReport.approvalEligible ? 0 : 1,
    expectedBlockedReasons: blockedReport.blockers,
    localModelRouteEnabled: false,
    modelCallsAllowed: false,
    qwenInferenceAllowed: false,
    benchmarkAllowed: false,
    networkCallsMade: false,
    productionReady: false,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      aggregateBlockers.length === 0
        ? "pass_for_local_model_route_approval_review"
        : "blocked_for_local_model_route_approval_review",
      ...aggregateBlockers,
      "local_model_route_still_disabled",
      "not_production_ready"
    ])
  };

  const redaction = assertOpenWeightVlmLocalModelRouteApprovalGateReportRedacted(report);
  if (!redaction.ok) {
    report.approvalEligible = false;
    report.blockers = unique([...report.blockers, "blocked_for_unsanitized_output"]);
    report.blockerCount = report.blockers.length;
    report.statusCategories = unique([
      "blocked_for_local_model_route_approval_review",
      ...report.blockers,
      "local_model_route_still_disabled",
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmLocalModelRouteApprovalGateReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "local_model_route_approval_gate_not_redacted",
        message: "Local model route approval gate report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function routeBlockers(policy) {
  const blockers = [];
  if (policy.requestedRoute !== REQUIRED_REQUESTED_ROUTE) {
    blockers.push("blocked_for_unsupported_provider_mode");
  }
  if (policy.localModelRouteEnabled === true) {
    blockers.push("blocked_for_local_model_route_enabled");
  }
  if (policy.futureExplicitUserApprovalRequired !== true) {
    blockers.push("blocked_for_missing_future_user_approval_requirement");
  }
  if (policy.scopedFixtureTokensDeclared !== true) {
    blockers.push("blocked_for_unscoped_fixture_tokens");
  }
  return blockers;
}

function requiredGateBlockers(policy) {
  const checks = [
    ["repoClean", "blocked_for_repo_not_clean"],
    ["upstreamSynced", "blocked_for_upstream_not_synced"],
    ["phase21GCommittedAndPushed", "blocked_for_phase21g_not_committed_pushed"],
    ["deploymentConfigEnvPreflightPassed", "blocked_for_deployment_config_env_preflight"],
    ["crossPlatformBoundaryGatePassed", "blocked_for_cross_platform_boundary_gate"],
    ["providerRoutingGatePassed", "blocked_for_provider_routing_gate"],
    ["providerAdapterNoModelHttpGatePassed", "blocked_for_provider_adapter_no_model_http_gate"]
  ];
  return checks
    .filter(([field]) => policy[field] !== true)
    .map(([, blocker]) => blocker);
}

function healthzBlockers(policy) {
  const blockers = [];
  if (policy.healthzSafe !== true) {
    blockers.push("blocked_for_unsafe_healthz");
  }
  if (policy.publicExposure !== "no") {
    blockers.push("blocked_for_public_exposure");
  }
  if (policy.rawLoggingDisabled !== true) {
    blockers.push("blocked_for_raw_logging_enabled");
  }
  if (policy.endpointLocalPrivateOnly !== true) {
    blockers.push("blocked_for_public_cloud_tunnel_endpoint");
  }
  return blockers;
}

function configBlockers(policy) {
  const blockers = [];
  if (policy.fixtureRegistryIgnored !== true || policy.stagedFixtureRegistry === true) {
    blockers.push("blocked_for_fixture_registry_staged");
  }
  if (policy.localConfigIgnored !== true || policy.stagedLocalConfig === true) {
    blockers.push("blocked_for_local_config_staged");
  }
  if (policy.fixtureImagesIgnored !== true || policy.stagedFixtureImages === true) {
    blockers.push("blocked_for_fixture_images_staged");
  }
  return blockers;
}

function privacyLoggingBlockers(policy) {
  const blockers = [];
  if (policy.rawPersistenceDetected === true) {
    blockers.push("blocked_for_raw_persistence");
  }
  if (policy.realUserPhotoUploadEnabled === true) {
    blockers.push("blocked_for_user_photo_upload");
  }
  if (policy.consentRequired !== true) {
    blockers.push("blocked_for_consent_policy_missing");
  }
  if (policy.retentionPolicyRequired !== true) {
    blockers.push("blocked_for_retention_policy_missing");
  }
  if (policy.deletionPolicyRequired !== true) {
    blockers.push("blocked_for_deletion_policy_missing");
  }
  return blockers;
}

function iosEndpointBlockers(policy) {
  const blockers = [];
  const checks = [
    ["iosIntegrationEnabled", "blocked_for_ios_integration"],
    ["directIOSProviderModelCall", "blocked_for_ios_direct_provider"],
    ["cameraCloudAiEntryEnabled", "blocked_for_camera_cloud_ai_entry"],
    ["backendIosPayloadChanged", "blocked_for_backend_ios_payload_drift"],
    ["appFacingEndpointEnabled", "blocked_for_app_facing_endpoint"],
    ["productionEndpointEnabled", "blocked_for_production_endpoint"]
  ];
  for (const [field, blocker] of checks) {
    if (policy[field] === true) {
      blockers.push(blocker);
    }
  }
  return blockers;
}

function validatorSafetyBlockers(policy) {
  const blockers = [];
  if (policy.structuredCandidateJsonMandatory !== true || policy.freeFormModelTextExposed === true) {
    blockers.push("blocked_for_free_form_model_text");
  }
  if (policy.backendValidatorRequired !== true || policy.schemaValidatorBypassed === true) {
    blockers.push("blocked_for_schema_validator_bypass");
  }
  if (policy.fallbackSafetyRequired !== true || policy.fallbackSafetyBypassed === true) {
    blockers.push("blocked_for_fallback_safety_bypass");
  }
  if (policy.scoreOrRatingAllowed === true) {
    blockers.push("blocked_for_score_or_rating");
  }
  if (policy.sensitiveInferenceAllowed === true) {
    blockers.push("blocked_for_sensitive_inference");
  }
  if (policy.chainOfThoughtAllowed === true) {
    blockers.push("blocked_for_chain_of_thought");
  }
  if (policy.debugProviderLeakageAllowed === true) {
    blockers.push("blocked_for_debug_provider_leakage");
  }
  return blockers;
}

function executionBlockers(policy) {
  const blockers = [];
  if (policy.modelCallsAllowed === true) {
    blockers.push("blocked_for_model_call");
  }
  if (policy.qwenInferenceAllowed === true) {
    blockers.push("blocked_for_qwen_inference");
  }
  if (policy.benchmarkAllowed === true) {
    blockers.push("blocked_for_benchmark_execution");
  }
  return blockers;
}

function policyProbeValueBlockers(values) {
  const blockers = [];
  for (const value of values) {
    if (
      typeof value === "string" &&
      FORBIDDEN_POLICY_VALUE_SNIPPETS.some((snippet) => value.includes(snippet))
    ) {
      blockers.push("blocked_for_committed_raw_policy_value");
    }
  }
  return unique(blockers);
}

function requiredGateBuckets(policy) {
  return {
    repoState: policy.repoClean === true && policy.upstreamSynced === true
      ? "clean_upstream_synced"
      : "blocked_repo_state",
    phase21G: policy.phase21GCommittedAndPushed === true
      ? "committed_pushed_declared"
      : "blocked_phase_commit_state",
    deploymentConfigEnv: policy.deploymentConfigEnvPreflightPassed === true
      ? "passed"
      : "blocked",
    crossPlatformBoundary: policy.crossPlatformBoundaryGatePassed === true
      ? "passed"
      : "blocked",
    providerRouting: policy.providerRoutingGatePassed === true
      ? "passed"
      : "blocked",
    providerAdapterNoModelHttp: policy.providerAdapterNoModelHttpGatePassed === true
      ? "passed"
      : "blocked"
  };
}

function healthzBucket(policy) {
  if (
    policy.healthzSafe === true &&
    policy.publicExposure === "no" &&
    policy.rawLoggingDisabled === true &&
    policy.endpointLocalPrivateOnly === true
  ) {
    return "safe_local_private_no_raw_logging";
  }
  return "blocked_healthz_or_endpoint";
}

function configBucket(policy) {
  if (
    policy.fixtureRegistryIgnored === true &&
    policy.localConfigIgnored === true &&
    policy.fixtureImagesIgnored === true &&
    policy.stagedLocalConfig !== true &&
    policy.stagedFixtureRegistry !== true &&
    policy.stagedFixtureImages !== true
  ) {
    return "ignored_local_sandbox_artifacts";
  }
  return "blocked_local_sandbox_artifacts";
}

function privacyLoggingBucket(policy) {
  if (
    policy.rawPersistenceDetected !== true &&
    policy.realUserPhotoUploadEnabled !== true &&
    policy.consentRequired === true &&
    policy.retentionPolicyRequired === true &&
    policy.deletionPolicyRequired === true
  ) {
    return "raw_artifacts_blocked_future_upload_policy_required";
  }
  return "blocked_privacy_logging_policy";
}

function validatorSafetyBucket(policy) {
  if (
    policy.structuredCandidateJsonMandatory === true &&
    policy.backendValidatorRequired === true &&
    policy.schemaValidatorBypassed !== true &&
    policy.fallbackSafetyRequired === true &&
    policy.fallbackSafetyBypassed !== true &&
    policy.freeFormModelTextExposed !== true &&
    policy.scoreOrRatingAllowed !== true &&
    policy.sensitiveInferenceAllowed !== true &&
    policy.chainOfThoughtAllowed !== true &&
    policy.debugProviderLeakageAllowed !== true
  ) {
    return "structured_candidate_validator_fallback_required";
  }
  return "blocked_validator_safety_policy";
}

function iOSBoundaryBucket(policy) {
  if (
    policy.iosIntegrationEnabled !== true &&
    policy.directIOSProviderModelCall !== true &&
    policy.cameraCloudAiEntryEnabled !== true &&
    policy.backendIosPayloadChanged !== true
  ) {
    return "ios_unchanged_no_direct_provider";
  }
  return "blocked_ios_boundary";
}

function endpointBoundaryBucket(policy) {
  if (
    policy.endpointLocalPrivateOnly === true &&
    policy.appFacingEndpointEnabled !== true &&
    policy.productionEndpointEnabled !== true
  ) {
    return "local_private_only_no_app_or_production_endpoint";
  }
  return "blocked_endpoint_boundary";
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
