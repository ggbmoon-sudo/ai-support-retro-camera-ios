export const OPEN_WEIGHT_VLM_CROSS_PLATFORM_DEPLOYMENT_BOUNDARY_SCHEMA_VERSION =
  "open_weight_vlm_cross_platform_deployment_boundary.v1";

const ALLOWED_PATH_BUCKETS = new Set([
  "docs",
  "manual_smoke",
  "operator_runbook",
  "ignored_local_config_example",
  "tests_sandbox_assertion"
]);

const RUNTIME_PATH_BUCKETS = new Set([
  "backend_runtime",
  "ios_runtime",
  "backend_config_runtime",
  "ios_config_runtime",
  "production_config"
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
  "base64",
  "data:image",
  "rawPrompt",
  "fullPrompt",
  "\"requestPayload\":",
  "rawModelOutput",
  "modelOutput",
  "rawProviderResponse",
  "Authorization",
  "Bearer ",
  "QWE_API_KEY",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CODE0_API_KEY",
  "INTENEXT_API_KEY",
  ".jpg",
  ".jpeg",
  ".png",
  "EXIF",
  "GPS"
]);

export function crossPlatformDeploymentBoundarySamplePolicy() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_CROSS_PLATFORM_DEPLOYMENT_BOUNDARY_SCHEMA_VERSION,
    productionReady: false,
    pathReferences: [
      pathReference("docs", "windows_local_path", "operator_example"),
      pathReference("operator_runbook", "windows_local_path", "sandbox_workspace_example"),
      pathReference("tests_sandbox_assertion", "windows_local_path", "blocked_runtime_fixture"),
      pathReference("ignored_local_config_example", "private_lan_model_url", "local_example_bucket")
    ],
    runtimeFlags: {
      iosDirectProviderRoute: false,
      cameraCloudAiEntry: false,
      backendIosUploadPayloadChanged: false,
      captureContextUpload: false,
      appFacingEndpoint: false,
      productionEndpoint: false,
      rawImageAllowed: false,
      encodedImageAllowed: false,
      rawPathAllowed: false,
      promptBodyAllowed: false,
      rawModelOutputAllowed: false,
      providerResponseAllowed: false
    },
    configPolicy: {
      committedPublicModelUrl: false,
      committedLanModelUrl: false,
      productionUsesEnvSecretsConfig: true,
      windowsPathsRuntimeDependency: false,
      macRequiresWindowsPath: false,
      iosContainsProviderSecrets: false,
      backendContainsProviderSecrets: false
    }
  };
}

export function evaluateOpenWeightVlmCrossPlatformDeploymentBoundary(
  policy = crossPlatformDeploymentBoundarySamplePolicy()
) {
  const pathReview = evaluatePathReferences(policy.pathReferences || []);
  const flagReview = evaluateRuntimeFlags(policy.runtimeFlags || {});
  const configReview = evaluateConfigPolicy(policy.configPolicy || {});
  const hardBlockers = unique([
    ...pathReview.blockers,
    ...flagReview.blockers,
    ...configReview.blockers,
    ...(policy.productionReady === false ? [] : ["blocked_for_production_flag"])
  ]);

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_CROSS_PLATFORM_DEPLOYMENT_BOUNDARY_SCHEMA_VERSION,
    runMode: "cross_platform_deployment_boundary_audit",
    scope: "backend_internal_no_network_no_model",
    productionReady: false,
    networkCallsMade: false,
    modelCallsMade: false,
    qwenInferenceRun: false,
    benchmarkRun: false,
    appFacingEndpoint: false,
    productionEndpoint: false,
    eligibleForDeploymentBoundaryReview: hardBlockers.length === 0,
    eligibleForAppIntegration: false,
    statusCategories: unique([
      hardBlockers.length === 0
        ? "pass_for_cross_platform_deployment_boundary_review"
        : "blocked_for_cross_platform_deployment_boundary_review",
      ...hardBlockers,
      "not_production_ready"
    ]),
    hardBlockers,
    deploymentRoles: {
      windowsLocalMachine: "local_backend_vlm_development_sandbox_only",
      macBookXcode: "ios_client_development_and_future_runtime_validation_only",
      mainBackend: "future_app_facing_api_owner_and_vlm_mediator",
      vlmProviderServer: "behind_backend_provider_only_not_app_contract_source"
    },
    runtimeVsDocsOnlyPathRules: {
      windowsPathsAllowedBuckets: Array.from(ALLOWED_PATH_BUCKETS),
      runtimePathBucketsBlocked: Array.from(RUNTIME_PATH_BUCKETS),
      macLocalPathsAllowedInRuntime: false,
      committedLanModelUrlsAllowedInRuntime: false,
      productionConfigMustUseEnvSecretsConfig: true
    },
    reviewedPathReferenceCounts: pathReview.counts,
    blockedPathReferenceBuckets: pathReview.blockedBuckets,
    reviewedRuntimeFlags: flagReview.summary,
    reviewedConfigPolicy: configReview.summary,
    rawArtifactPolicy: {
      imageBytesAllowed: false,
      encodedImageAllowed: false,
      imageLocationAllowed: false,
      promptBodyAllowed: false,
      modelTextAllowed: false,
      providerTextAllowed: false
    }
  };

  const redaction = assertOpenWeightVlmCrossPlatformDeploymentBoundaryReportRedacted(report);
  if (!redaction.ok) {
    report.eligibleForDeploymentBoundaryReview = false;
    report.hardBlockers = unique([...report.hardBlockers, "blocked_for_unsanitized_output"]);
    report.statusCategories = unique([
      "blocked_for_cross_platform_deployment_boundary_review",
      ...report.hardBlockers,
      "not_production_ready"
    ]);
  }

  return report;
}

export function assertOpenWeightVlmCrossPlatformDeploymentBoundaryReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const leak = FORBIDDEN_REPORT_SNIPPETS.find((snippet) => serialized.includes(snippet));
  if (leak) {
    return {
      ok: false,
      error: {
        code: "cross_platform_deployment_boundary_not_redacted",
        message: "Cross-platform deployment boundary report contains a forbidden artifact marker."
      }
    };
  }
  return { ok: true };
}

function evaluatePathReferences(pathReferences) {
  const blockers = [];
  const counts = {};
  const blockedBuckets = [];

  for (const reference of pathReferences) {
    const bucket = sanitizeToken(reference.bucket || "unknown");
    const kind = sanitizeToken(reference.kind || "unknown");
    counts[`${bucket}:${kind}`] = (counts[`${bucket}:${kind}`] || 0) + 1;

    if (kind === "windows_local_path" && !ALLOWED_PATH_BUCKETS.has(bucket)) {
      blockers.push("blocked_for_windows_runtime_path");
      blockedBuckets.push(`${bucket}:windows_local_path`);
    }
    if (kind === "mac_local_path" && RUNTIME_PATH_BUCKETS.has(bucket)) {
      blockers.push("blocked_for_mac_runtime_path");
      blockedBuckets.push(`${bucket}:mac_local_path`);
    }
    if (kind === "lan_model_url" && bucket === "ios_runtime") {
      blockers.push("blocked_for_ios_lan_model_url");
      blockedBuckets.push(`${bucket}:lan_model_url`);
    }
    if (kind === "lan_model_url" && ["backend_runtime", "production_config"].includes(bucket)) {
      blockers.push("blocked_for_committed_lan_model_url");
      blockedBuckets.push(`${bucket}:lan_model_url`);
    }
    if (kind === "public_model_url" || kind === "cloud_tunnel_model_url") {
      blockers.push("blocked_for_public_or_cloud_model_url");
      blockedBuckets.push(`${bucket}:${kind}`);
    }
    if (kind === "provider_secret" || kind === "model_secret") {
      blockers.push("blocked_for_provider_secret");
      blockedBuckets.push(`${bucket}:${kind}`);
    }
  }

  return {
    blockers: unique(blockers),
    counts,
    blockedBuckets: unique(blockedBuckets)
  };
}

function evaluateRuntimeFlags(flags) {
  const blockers = [];
  const flagBlockerPairs = [
    ["iosDirectProviderRoute", "blocked_for_ios_direct_provider_route"],
    ["cameraCloudAiEntry", "blocked_for_camera_cloud_ai_entry"],
    ["backendIosUploadPayloadChanged", "blocked_for_backend_ios_payload_change"],
    ["captureContextUpload", "blocked_for_capture_context_upload"],
    ["appFacingEndpoint", "blocked_for_app_facing_endpoint"],
    ["productionEndpoint", "blocked_for_production_endpoint"],
    ["rawImageAllowed", "blocked_for_raw_artifact_policy"],
    ["encodedImageAllowed", "blocked_for_raw_artifact_policy"],
    ["rawPathAllowed", "blocked_for_raw_artifact_policy"],
    ["promptBodyAllowed", "blocked_for_raw_artifact_policy"],
    ["rawModelOutputAllowed", "blocked_for_raw_artifact_policy"],
    ["providerResponseAllowed", "blocked_for_raw_artifact_policy"]
  ];

  for (const [flag, blocker] of flagBlockerPairs) {
    if (flags[flag] === true) {
      blockers.push(blocker);
    }
  }

  return {
    blockers: unique(blockers),
    summary: {
      iosDirectProviderRoute: flags.iosDirectProviderRoute === true,
      cameraCloudAiEntry: flags.cameraCloudAiEntry === true,
      backendIosUploadPayloadChanged: flags.backendIosUploadPayloadChanged === true,
      captureContextUpload: flags.captureContextUpload === true,
      appFacingEndpoint: flags.appFacingEndpoint === true,
      productionEndpoint: flags.productionEndpoint === true,
      rawArtifactPolicySafe: ![
        "rawImageAllowed",
        "encodedImageAllowed",
        "rawPathAllowed",
        "promptBodyAllowed",
        "rawModelOutputAllowed",
        "providerResponseAllowed"
      ].some((flag) => flags[flag] === true)
    }
  };
}

function evaluateConfigPolicy(configPolicy) {
  const blockers = [];
  const pairs = [
    ["committedPublicModelUrl", "blocked_for_public_or_cloud_model_url"],
    ["committedLanModelUrl", "blocked_for_committed_lan_model_url"],
    ["windowsPathsRuntimeDependency", "blocked_for_windows_runtime_path"],
    ["macRequiresWindowsPath", "blocked_for_macbook_windows_path_dependency"],
    ["iosContainsProviderSecrets", "blocked_for_provider_secret"],
    ["backendContainsProviderSecrets", "blocked_for_provider_secret"]
  ];

  for (const [flag, blocker] of pairs) {
    if (configPolicy[flag] === true) {
      blockers.push(blocker);
    }
  }
  if (configPolicy.productionUsesEnvSecretsConfig !== true) {
    blockers.push("blocked_for_production_config_boundary");
  }

  return {
    blockers: unique(blockers),
    summary: {
      committedPublicModelUrl: configPolicy.committedPublicModelUrl === true,
      committedLanModelUrl: configPolicy.committedLanModelUrl === true,
      productionUsesEnvSecretsConfig: configPolicy.productionUsesEnvSecretsConfig === true,
      windowsPathsRuntimeDependency: configPolicy.windowsPathsRuntimeDependency === true,
      macRequiresWindowsPath: configPolicy.macRequiresWindowsPath === true,
      iosContainsProviderSecrets: configPolicy.iosContainsProviderSecrets === true,
      backendContainsProviderSecrets: configPolicy.backendContainsProviderSecrets === true
    }
  };
}

function pathReference(bucket, kind, label) {
  return {
    bucket,
    kind,
    labelBucket: sanitizeToken(label)
  };
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
