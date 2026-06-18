#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  loadOpenWeightVlmLocalSandboxConfig
} from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";
import {
  runOpenWeightVlmLocalSandboxSmoke
} from "../src/qa/openWeightVlmLocalSandboxClient.mjs";

const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const LOCAL_CONFIG_PATH = fileURLToPath(new URL("../config/open-weight-vlm.local.json", import.meta.url));
const LOCAL_REGISTRY_PATH = fileURLToPath(new URL("../config/open-weight-vlm.fixtures.local.json", import.meta.url));
const SMOKE_FIXTURE_REPO_PATH = "backend/tests/vlm-local-samples/smoke_001.jpg";

const options = parseArgs(process.argv.slice(2));
const preflight = await runPreflight(options);

if (!preflight.ok) {
  printSummary({
    phaseResult: "preflight_blocked",
    preflight,
    healthz: preflight.healthz || null,
    benchmark: null
  });
  process.exit(1);
}

const smokeReport = await runOpenWeightVlmLocalSandboxSmoke({
  configPath: LOCAL_CONFIG_PATH,
  requireConfig: true,
  runLocalModel: true
});

const benchmark = summarizeBenchmark(smokeReport, preflight.healthz);
printSummary({
  phaseResult: benchmark.acceptedCount === 1 ? "accepted" : "rejected",
  preflight,
  healthz: preflight.healthz,
  benchmark
});

process.exit(0);

function parseArgs(args) {
  const parsed = {
    approvedOneCall: false,
    servingStack: null,
    fixture: null,
    callCount: null,
    noRetry: false,
    blockers: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--approved-one-call") {
      parsed.approvedOneCall = true;
      continue;
    }
    if (arg === "--no-retry") {
      parsed.noRetry = true;
      continue;
    }
    if (arg === "--serving-stack") {
      parsed.servingStack = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--serving-stack=")) {
      parsed.servingStack = arg.slice("--serving-stack=".length) || null;
      continue;
    }
    if (arg === "--fixture") {
      parsed.fixture = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--fixture=")) {
      parsed.fixture = arg.slice("--fixture=".length) || null;
      continue;
    }
    if (arg === "--call-count") {
      parsed.callCount = Number(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--call-count=")) {
      parsed.callCount = Number(arg.slice("--call-count=".length));
      continue;
    }
    parsed.blockers.push("blocked_for_unknown_argument");
  }

  if (parsed.approvedOneCall !== true) {
    parsed.blockers.push("blocked_for_missing_approved_one_call_flag");
  }
  if (parsed.servingStack !== "transformers_fastapi_reference") {
    parsed.blockers.push("blocked_for_invalid_serving_stack");
  }
  if (parsed.fixture !== "smoke_001") {
    parsed.blockers.push("blocked_for_missing_or_invalid_fixture");
  }
  if (parsed.callCount !== 1) {
    parsed.blockers.push("blocked_for_invalid_call_count");
  }
  if (parsed.noRetry !== true) {
    parsed.blockers.push("blocked_for_missing_no_retry_flag");
  }

  return parsed;
}

async function runPreflight(options) {
  const blockers = [...options.blockers];
  const localFiles = {
    configPresent: existsSync(LOCAL_CONFIG_PATH),
    registryPresent: existsSync(LOCAL_REGISTRY_PATH),
    smoke001FilePresent: existsSync(fileURLToPath(new URL("../tests/vlm-local-samples/smoke_001.jpg", import.meta.url))),
    configIgnored: gitCheckIgnored("backend/config/open-weight-vlm.local.json"),
    registryIgnored: gitCheckIgnored("backend/config/open-weight-vlm.fixtures.local.json"),
    smoke001Ignored: gitCheckIgnored(SMOKE_FIXTURE_REPO_PATH),
    configStaged: gitHasOutput(["diff", "--cached", "--name-only", "--", "backend/config/open-weight-vlm.local.json"]),
    registryStaged: gitHasOutput(["diff", "--cached", "--name-only", "--", "backend/config/open-weight-vlm.fixtures.local.json"]),
    smoke001Staged: gitHasOutput(["diff", "--cached", "--name-only", "--", SMOKE_FIXTURE_REPO_PATH]),
    configTracked: gitHasOutput(["ls-files", "--", "backend/config/open-weight-vlm.local.json"]),
    registryTracked: gitHasOutput(["ls-files", "--", "backend/config/open-weight-vlm.fixtures.local.json"]),
    smoke001Tracked: gitHasOutput(["ls-files", "--", SMOKE_FIXTURE_REPO_PATH])
  };

  if (!localFiles.configPresent || !localFiles.configIgnored || localFiles.configStaged || localFiles.configTracked) {
    blockers.push("blocked_for_local_config_prerequisite");
  }
  if (!localFiles.registryPresent || !localFiles.registryIgnored || localFiles.registryStaged || localFiles.registryTracked) {
    blockers.push("blocked_for_local_registry_prerequisite");
  }
  if (!localFiles.smoke001FilePresent || !localFiles.smoke001Ignored || localFiles.smoke001Staged || localFiles.smoke001Tracked) {
    blockers.push("blocked_for_smoke001_fixture_prerequisite");
  }

  const registry = registrySmoke001Status();
  if (!registry.smoke001EntryPresent || !registry.smoke001Approved) {
    blockers.push("blocked_for_smoke001_registry_approval");
  }

  const loaded = await loadOpenWeightVlmLocalSandboxConfig(LOCAL_CONFIG_PATH, {
    requireConfig: true
  });
  if (!loaded.ok) {
    blockers.push("blocked_for_invalid_local_config");
  }

  const config = loaded.runtimeValue || {};
  if (config.fixtureId !== "smoke_001") {
    blockers.push("blocked_for_config_fixture_not_smoke001");
  }
  if (config.enabled !== true || config.allowNetworkCalls !== true || config.servingStack !== "transformers_fastapi") {
    blockers.push("blocked_for_transformers_fastapi_reference_not_ready");
  }

  let healthz = null;
  if (blockers.length === 0) {
    healthz = await safeHealthz(config.modelServerUrl, config.timeoutMs);
    if (healthz.ok !== true || healthz.modelLoaded !== true || healthz.modelFamilyBucket !== "qwen_vlm_compatible" || healthz.rawLoggingDisabled !== true || healthz.publicExposure !== "no") {
      blockers.push("blocked_for_unsafe_healthz");
    }
  }

  return {
    ok: blockers.length === 0,
    blockers: [...new Set(blockers)],
    approvedOneCall: options.approvedOneCall === true,
    benchmarkKind: "one_fixture_serving_benchmark",
    servingStack: options.servingStack === "transformers_fastapi_reference"
      ? "transformers_fastapi_reference"
      : "invalid",
    fixtureToken: options.fixture === "smoke_001" ? "smoke_001" : "invalid",
    fixtureCount: options.fixture === "smoke_001" ? 1 : 0,
    callLimit: options.callCount === 1 ? 1 : 0,
    retryLimit: options.noRetry === true ? 0 : "invalid",
    localFiles,
    registry,
    configBucket: loaded.value
      ? {
        configValid: loaded.value.configValid === true,
        configEnabled: loaded.value.configEnabled === true,
        servingStack: loaded.value.servingStack,
        modelServerConfigured: loaded.value.modelServerConfigured === true,
        modelServerUrlBucket: loaded.value.modelServerUrlBucket || "missing",
        fixtureMode: loaded.value.fixtureMode,
        fixtureIdBucket: loaded.value.fixtureIdBucket,
        allowNetworkCalls: loaded.value.allowNetworkCalls === true,
        productionReady: false
      }
      : null,
    healthz,
    networkCallsMade: Boolean(healthz)
  };
}

async function safeHealthz(modelServerUrl, timeoutMs) {
  const healthUrl = new URL("/healthz", modelServerUrl);
  let response;
  try {
    response = await fetch(healthUrl, {
      method: "GET",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(Math.min(timeoutMs || 5000, 10000))
    });
  } catch {
    return {
      ok: false,
      modelLoaded: false,
      modelFamilyBucket: "unavailable",
      rawLoggingDisabled: false,
      publicExposure: "unknown",
      healthzBucket: "connection_refused",
      networkCallsMade: true
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      modelLoaded: false,
      modelFamilyBucket: "unavailable",
      rawLoggingDisabled: false,
      publicExposure: "unknown",
      healthzBucket: "ok_false",
      networkCallsMade: true
    };
  }

  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return {
      ok: false,
      modelLoaded: false,
      modelFamilyBucket: "unavailable",
      rawLoggingDisabled: false,
      publicExposure: "unknown",
      healthzBucket: "invalid_json",
      networkCallsMade: true
    };
  }

  const healthz = {
    ok: parsed.ok === true,
    modelLoaded: parsed.modelLoaded === true,
    modelFamilyBucket: /qwen|vlm|vision/i.test(String(parsed.modelFamily || parsed.model || ""))
      ? "qwen_vlm_compatible"
      : "unknown",
    rawLoggingDisabled: parsed.rawLoggingDisabled === true,
    publicExposure: sanitizeToken(parsed.publicExposure || "unknown"),
    networkCallsMade: true
  };

  return {
    ...healthz,
    healthzBucket: healthz.ok === true
      && healthz.modelLoaded === true
      && healthz.modelFamilyBucket === "qwen_vlm_compatible"
      && healthz.rawLoggingDisabled === true
      && healthz.publicExposure === "no"
      ? "safe"
      : "unknown_healthz_failure"
  };
}

function registrySmoke001Status() {
  if (!existsSync(LOCAL_REGISTRY_PATH)) {
    return {
      registryPresent: false,
      smoke001EntryPresent: false,
      smoke001Approved: false,
      fixtureCountBucket: "missing"
    };
  }

  const registry = JSON.parse(readFileSync(LOCAL_REGISTRY_PATH, "utf8"));
  const fixtures = Array.isArray(registry) ? registry : Array.isArray(registry.fixtures) ? registry.fixtures : [];
  const smoke = fixtures.find((entry) => entry?.fixtureId === "smoke_001");

  return {
    registryPresent: true,
    smoke001EntryPresent: Boolean(smoke),
    smoke001Approved: Boolean(smoke?.approvedForLocalSmoke === true && smoke?.metadataStripped === true && smoke?.privacyReviewed === true),
    fixtureCountBucket: fixtures.length <= 12 ? "twelve_or_less" : "more_than_twelve"
  };
}

function summarizeBenchmark(report, healthz) {
  const smoke = report.localModelSmoke || {};
  return {
    benchmarkKind: "one_fixture_serving_benchmark",
    servingStackClass: "transformers_fastapi_reference",
    modelClass: healthz?.modelFamilyBucket === "qwen_vlm_compatible"
      ? "qwen_vlm_compatible"
      : "unknown",
    endpointBucket: "local_or_private",
    modelCallsMade: smoke.networkCallsMade === true,
    qwenInferenceRun: smoke.networkCallsMade === true && healthz?.modelFamilyBucket === "qwen_vlm_compatible",
    fixtureToken: "smoke_001",
    fixtureCount: smoke.fixtureCount || 0,
    callCount: smoke.networkCallsMade === true ? 1 : 0,
    retryCount: 0,
    acceptedCount: smoke.acceptedCount || 0,
    rejectedCount: smoke.rejectedCount || 0,
    fallbackCategory: smoke.fallbackCategory || null,
    validationCode: smoke.validationCode || null,
    latencyBucket: smoke.latencyBucket || "unknown",
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    rawPromptPersisted: false,
    rawPromptPrinted: false,
    rawPayloadPersisted: false,
    rawPayloadPrinted: false,
    productionReady: false,
    hardBlockers: Array.isArray(report.hardBlockers)
      ? report.hardBlockers.map((item) => sanitizeToken(item.reason || item.code || "unknown"))
      : []
  };
}

function printSummary(summary) {
  console.log(JSON.stringify({
    schemaVersion: "open_weight_vlm_transformers_fastapi_one_fixture_serving_benchmark.v1",
    phaseResult: summary.phaseResult,
    benchmarkKind: "one_fixture_serving_benchmark",
    servingStackClass: "transformers_fastapi_reference",
    preflightPassed: summary.preflight.ok === true,
    preflightBlockers: summary.preflight.blockers,
    fixtureToken: "smoke_001",
    fixtureCount: summary.benchmark?.fixtureCount || summary.preflight.fixtureCount,
    callCount: summary.benchmark?.callCount || 0,
    retryCount: 0,
    healthzBucket: summary.healthz?.healthzBucket || "not_run",
    healthzSafeSummary: summary.healthz
      ? {
        ok: summary.healthz.ok === true,
        modelLoaded: summary.healthz.modelLoaded === true,
        modelFamilyBucket: summary.healthz.modelFamilyBucket,
        rawLoggingDisabled: summary.healthz.rawLoggingDisabled === true,
        publicExposure: summary.healthz.publicExposure
      }
      : null,
    registry: summary.preflight.registry,
    localFiles: summary.preflight.localFiles,
    benchmark: summary.benchmark,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    rawPromptPersisted: false,
    rawPromptPrinted: false,
    rawPayloadPersisted: false,
    rawPayloadPrinted: false,
    productionReady: false
  }, null, 2));
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
