#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  loadOpenWeightVlmLocalSandboxConfig
} from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";

const BACKEND_ROOT = fileURLToPath(new URL("../", import.meta.url));
const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const LOCAL_CONFIG_PATH = fileURLToPath(new URL("../config/open-weight-vlm.local.json", import.meta.url));
const LOCAL_REGISTRY_PATH = fileURLToPath(new URL("../config/open-weight-vlm.fixtures.local.json", import.meta.url));
const SMOKE_FIXTURE_REPO_PATH = "backend/tests/vlm-local-samples/smoke_001.jpg";

export async function runOpenWeightVlmLocalModelHealthzPreflight({
  fetchImpl = fetch,
  configPath = LOCAL_CONFIG_PATH,
  registryPath = LOCAL_REGISTRY_PATH
} = {}) {
  const localFiles = localReadiness(registryPath);
  const registry = registrySmoke001Status(registryPath);
  const loaded = await loadOpenWeightVlmLocalSandboxConfig(configPath, {
    requireConfig: true
  });
  const config = loaded.runtimeValue || {};
  const configBucket = loaded.value
    ? {
      configValid: loaded.value.configValid === true,
      configEnabled: loaded.value.configEnabled === true,
      servingStack: sanitizeToken(loaded.value.servingStack || "unknown"),
      modelServerConfigured: loaded.value.modelServerConfigured === true,
      endpointBucket: endpointBucketFromConfigBucket(loaded.value.modelServerUrlBucket),
      fixtureMode: sanitizeToken(loaded.value.fixtureMode || "unknown"),
      fixtureTokenIsSmoke001: config.fixtureId === "smoke_001",
      allowNetworkCalls: loaded.value.allowNetworkCalls === true,
      productionReady: false
    }
    : null;

  const blockers = prerequisiteBlockers({ localFiles, registry, loaded, config });
  let healthz = null;
  if (blockers.length === 0) {
    healthz = await checkHealthzOnly({
      modelServerUrl: config.modelServerUrl,
      timeoutMs: config.timeoutMs,
      endpointBucket: configBucket.endpointBucket,
      fetchImpl
    });
    if (healthz.healthzPrerequisiteResolved !== true) {
      blockers.push(`blocked_for_${healthz.healthzResultBucket}`);
    }
  }

  return {
    schemaVersion: "open_weight_vlm_local_model_healthz_preflight.v1",
    healthzChecked: Boolean(healthz),
    healthzResultBucket: healthz?.healthzResultBucket || "not_checked_prerequisite_blocked",
    healthzPrerequisiteResolved: healthz?.healthzPrerequisiteResolved === true,
    localFiles,
    registry,
    configBucket,
    blockers: [...new Set(blockers)],
    modelCallsMade: false,
    qwenInferenceRun: false,
    fixtureInferenceRun: false,
    servingBenchmarkRun: false,
    rawHealthzPersisted: false,
    rawHealthzPrinted: false,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    productionReady: false,
    networkCallsMade: Boolean(healthz)
  };
}

export async function checkHealthzOnly({
  modelServerUrl,
  timeoutMs = 5000,
  endpointBucket = "unknown",
  fetchImpl = fetch
} = {}) {
  if (!["local_loopback", "private_lan"].includes(endpointBucket)) {
    return healthzReport("unsafe_endpoint_bucket", endpointBucket);
  }

  let healthUrl;
  try {
    healthUrl = new URL("/healthz", modelServerUrl);
    if (healthUrl.username || healthUrl.password || healthUrl.search || healthUrl.hash) {
      return healthzReport("credentialed_url_blocked", endpointBucket);
    }
  } catch {
    return healthzReport("unsafe_endpoint_bucket", endpointBucket);
  }

  let response;
  try {
    response = await fetchImpl(healthUrl, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(Math.min(timeoutMs || 5000, 10000))
    });
  } catch (error) {
    return healthzReport(classifyFetchError(error), endpointBucket);
  }

  if (!response?.ok) {
    return healthzReport("ok_false", endpointBucket);
  }

  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return healthzReport("invalid_json", endpointBucket);
  }

  return evaluateHealthzJson(parsed, endpointBucket);
}

export function evaluateHealthzJson(parsed, endpointBucket = "unknown") {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return healthzReport("invalid_json", endpointBucket);
  }
  if (!Object.hasOwn(parsed, "ok")) {
    return healthzReport("missing_ok", endpointBucket);
  }
  if (parsed.productionReady === true) {
    return healthzReport("production_ready_true", endpointBucket);
  }
  if (parsed.ok !== true) {
    return healthzReport("ok_false", endpointBucket);
  }
  if (parsed.modelLoaded !== true) {
    return healthzReport("model_not_loaded", endpointBucket);
  }
  if (!/qwen|vlm|vision/iu.test(String(parsed.modelFamily || parsed.model || ""))) {
    return healthzReport("incompatible_model_family", endpointBucket);
  }
  if (parsed.rawLoggingDisabled !== true) {
    return healthzReport("raw_logging_not_disabled", endpointBucket);
  }
  if (sanitizeToken(parsed.publicExposure || "unknown") !== "no") {
    return healthzReport("public_exposure_not_no", endpointBucket);
  }

  return {
    healthzResultBucket: "safe",
    healthzPrerequisiteResolved: true,
    endpointBucket,
    ok: true,
    modelLoaded: true,
    modelFamilyBucket: "qwen_vlm_compatible",
    rawLoggingDisabled: true,
    publicExposure: "no",
    productionReady: false
  };
}

function prerequisiteBlockers({ localFiles, registry, loaded, config }) {
  const blockers = [];
  if (!localFiles.localConfigPresent || !localFiles.localConfigIgnored || localFiles.localConfigStaged || localFiles.localConfigTracked) {
    blockers.push("blocked_for_local_config_prerequisite");
  }
  if (!localFiles.fixtureRegistryPresent || !localFiles.fixtureRegistryIgnored || localFiles.fixtureRegistryStaged || localFiles.fixtureRegistryTracked) {
    blockers.push("blocked_for_local_registry_prerequisite");
  }
  if (!localFiles.smoke001FilePresent || !localFiles.smoke001Ignored || localFiles.smoke001Staged || localFiles.smoke001Tracked) {
    blockers.push("blocked_for_smoke001_fixture_prerequisite");
  }
  if (!registry.smoke001EntryPresent || !registry.smoke001Approved) {
    blockers.push("blocked_for_smoke001_registry_approval");
  }
  if (!loaded.ok) {
    blockers.push(mapConfigErrorToBlocker(loaded.error?.code));
  }
  if (config.fixtureId !== "smoke_001") {
    blockers.push("blocked_for_config_fixture_not_smoke001");
  }
  if (config.enabled !== true || config.allowNetworkCalls !== true || config.servingStack !== "transformers_fastapi") {
    blockers.push("blocked_for_local_model_config_not_ready");
  }
  return blockers;
}

function localReadiness(registryPath) {
  const localConfigRepoPath = "backend/config/open-weight-vlm.local.json";
  const registryRepoPath = "backend/config/open-weight-vlm.fixtures.local.json";
  const smokeFixturePath = fileURLToPath(new URL("../tests/vlm-local-samples/smoke_001.jpg", import.meta.url));
  const extension = existsSync(smokeFixturePath)
    ? sanitizeExtension(SMOKE_FIXTURE_REPO_PATH)
    : "missing";

  return {
    localConfigPresent: existsSync(LOCAL_CONFIG_PATH),
    localConfigIgnored: gitCheckIgnored(localConfigRepoPath),
    localConfigStaged: gitHasOutput(["diff", "--cached", "--name-only", "--", localConfigRepoPath]),
    localConfigTracked: gitHasOutput(["ls-files", "--", localConfigRepoPath]),
    fixtureRegistryPresent: existsSync(registryPath),
    fixtureRegistryIgnored: gitCheckIgnored(registryRepoPath),
    fixtureRegistryStaged: gitHasOutput(["diff", "--cached", "--name-only", "--", registryRepoPath]),
    fixtureRegistryTracked: gitHasOutput(["ls-files", "--", registryRepoPath]),
    smoke001FilePresent: existsSync(smokeFixturePath),
    smoke001ExtensionBucket: extension,
    smoke001Ignored: gitCheckIgnored(SMOKE_FIXTURE_REPO_PATH),
    smoke001Staged: gitHasOutput(["diff", "--cached", "--name-only", "--", SMOKE_FIXTURE_REPO_PATH]),
    smoke001Tracked: gitHasOutput(["ls-files", "--", SMOKE_FIXTURE_REPO_PATH])
  };
}

function registrySmoke001Status(registryPath) {
  if (!existsSync(registryPath)) {
    return {
      registryPresent: false,
      smoke001EntryPresent: false,
      smoke001Approved: false,
      fixtureCountBucket: "missing"
    };
  }

  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  const fixtures = Array.isArray(registry) ? registry : Array.isArray(registry.fixtures) ? registry.fixtures : [];
  const smoke = fixtures.find((entry) => entry?.fixtureId === "smoke_001");

  return {
    registryPresent: true,
    smoke001EntryPresent: Boolean(smoke),
    smoke001Approved: Boolean(smoke?.approvedForLocalSmoke === true && smoke?.metadataStripped === true && smoke?.privacyReviewed === true),
    fixtureCountBucket: fixtures.length <= 12 ? "twelve_or_less" : "more_than_twelve"
  };
}

function healthzReport(healthzResultBucket, endpointBucket) {
  return {
    healthzResultBucket,
    healthzPrerequisiteResolved: false,
    endpointBucket,
    ok: false,
    modelLoaded: false,
    modelFamilyBucket: "unavailable",
    rawLoggingDisabled: false,
    publicExposure: "unknown",
    productionReady: false
  };
}

function classifyFetchError(error) {
  const code = String(error?.cause?.code || error?.code || "").toUpperCase();
  const name = String(error?.name || "").toLowerCase();
  if (code === "ECONNREFUSED") {
    return "connection_refused";
  }
  if (code === "ETIMEDOUT" || name.includes("timeout") || name.includes("abort")) {
    return "timeout";
  }
  return "healthz_unreachable";
}

function mapConfigErrorToBlocker(code) {
  if (code === "unsafe_model_server_url") {
    return "blocked_for_credentialed_url_blocked";
  }
  if (code === "non_local_model_server_url" || code === "private_lan_not_allowed" || code === "unsupported_model_server_protocol") {
    return "blocked_for_unsafe_endpoint_bucket";
  }
  return "blocked_for_invalid_local_config";
}

function endpointBucketFromConfigBucket(bucket) {
  if (bucket === "local_loopback_name" || bucket === "local_loopback_ip") {
    return "local_loopback";
  }
  if (bucket === "private_lan_ipv4") {
    return "private_lan";
  }
  if (bucket === "missing") {
    return "missing";
  }
  return "unknown";
}

function sanitizeExtension(repoPath) {
  const extension = String(repoPath.split(".").pop() || "unknown").toLowerCase();
  return ["jpg", "jpeg", "png"].includes(extension) ? extension : "unknown";
}

function gitCheckIgnored(repoPath) {
  try {
    execFileSync("git", ["-C", REPO_ROOT, "check-ignore", "-q", "--", repoPath], {
      stdio: "ignore"
    });
    return true;
  } catch {
    return false;
  }
}

function gitHasOutput(args) {
  return execFileSync("git", ["-C", REPO_ROOT, ...args], {
    encoding: "utf8"
  }).trim().length > 0;
}

function sanitizeToken(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/gu, "_")
    .replace(/^_+|_+$/gu, "")
    .slice(0, 80) || "unknown";
}

async function main() {
  const report = await runOpenWeightVlmLocalModelHealthzPreflight();
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.healthzPrerequisiteResolved ? 0 : 1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
