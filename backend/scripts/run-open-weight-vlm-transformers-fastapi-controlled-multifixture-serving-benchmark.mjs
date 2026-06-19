#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  loadOpenWeightVlmLocalSandboxConfig
} from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";
import {
  buildOpenWeightVlmSchemaDiagnostic,
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  validateOpenWeightVlmPhotoAdvisorCandidate
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";

const REPO_ROOT = fileURLToPath(new URL("../../", import.meta.url));
const LOCAL_CONFIG_PATH = fileURLToPath(new URL("../config/open-weight-vlm.local.json", import.meta.url));
const LOCAL_REGISTRY_PATH = fileURLToPath(new URL("../config/open-weight-vlm.fixtures.local.json", import.meta.url));
const APPROVED_FIXTURE_TOKENS = Object.freeze([
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

const options = parseArgs(process.argv.slice(2));
const preflight = await runPreflight(options);

if (!preflight.ok) {
  printSummary({
    phaseResult: "preflight_blocked",
    preflight,
    benchmark: null
  });
  process.exit(1);
}

const benchmark = await runBenchmark(preflight.runtimeConfig, preflight.healthz);
const phaseResult = benchmark.acceptedCount === APPROVED_FIXTURE_TOKENS.length
  ? "accepted"
  : benchmark.blockedCount > 0
    ? "unsafe_stopped"
    : "mixed_rejected";

printSummary({
  phaseResult,
  preflight,
  benchmark
});

process.exit(phaseResult === "unsafe_stopped" ? 1 : 0);

function parseArgs(args) {
  const parsed = {
    approvedControlledBenchmark: false,
    servingStack: null,
    fixtures: null,
    callCount: null,
    noRetry: false,
    blockers: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--approved-controlled-benchmark") {
      parsed.approvedControlledBenchmark = true;
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
    if (arg === "--fixtures") {
      parsed.fixtures = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--fixtures=")) {
      parsed.fixtures = arg.slice("--fixtures=".length) || null;
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

  const requestedTokens = parseFixtureList(parsed.fixtures);
  if (parsed.approvedControlledBenchmark !== true) {
    parsed.blockers.push("blocked_for_missing_approved_controlled_benchmark_flag");
  }
  if (parsed.servingStack !== "transformers_fastapi_reference") {
    parsed.blockers.push("blocked_for_invalid_serving_stack");
  }
  if (!sameOrderedTokens(requestedTokens, APPROVED_FIXTURE_TOKENS)) {
    parsed.blockers.push("blocked_for_fixture_token_set_mismatch");
  }
  if (new Set(requestedTokens).size !== requestedTokens.length) {
    parsed.blockers.push("blocked_for_duplicate_fixture_token");
  }
  if (requestedTokens.includes("smoke_001")) {
    parsed.blockers.push("blocked_for_smoke001_not_allowed");
  }
  if (parsed.callCount !== APPROVED_FIXTURE_TOKENS.length) {
    parsed.blockers.push("blocked_for_invalid_call_count");
  }
  if (parsed.noRetry !== true) {
    parsed.blockers.push("blocked_for_missing_no_retry_flag");
  }

  return {
    ...parsed,
    requestedTokens
  };
}

async function runPreflight(options) {
  const blockers = [...options.blockers];
  const localFiles = collectLocalFileFacts(APPROVED_FIXTURE_TOKENS);
  const registry = registryApprovedStatus(APPROVED_FIXTURE_TOKENS);

  if (!localFiles.configPresent || !localFiles.configIgnored || localFiles.configStaged || localFiles.configTracked) {
    blockers.push("blocked_for_local_config_prerequisite");
  }
  if (!localFiles.registryPresent || !localFiles.registryIgnored || localFiles.registryStaged || localFiles.registryTracked) {
    blockers.push("blocked_for_local_registry_prerequisite");
  }
  if (localFiles.fixtureStatuses.some((fixture) => !fixture.filePresent || !fixture.ignored || fixture.staged || fixture.tracked)) {
    blockers.push("blocked_for_fixture_file_prerequisite");
  }
  if (!registry.registryPresent || registry.approvedFixtureCount !== APPROVED_FIXTURE_TOKENS.length || registry.missingApprovedTokens.length > 0) {
    blockers.push("blocked_for_fixture_registry_approval");
  }

  const loaded = await loadOpenWeightVlmLocalSandboxConfig(LOCAL_CONFIG_PATH, {
    requireConfig: true
  });
  if (!loaded.ok) {
    blockers.push("blocked_for_invalid_local_config");
  }

  const config = loaded.runtimeValue || {};
  if (config.enabled !== true || config.allowNetworkCalls !== true || config.servingStack !== "transformers_fastapi") {
    blockers.push("blocked_for_transformers_fastapi_reference_not_ready");
  }
  if (loaded.value?.modelServerUrlBucket !== "local_loopback" && loaded.value?.modelServerUrlBucket !== "private_lan") {
    blockers.push("blocked_for_unsafe_endpoint_bucket");
  }
  if (loaded.value?.productionReady === true) {
    blockers.push("blocked_for_production_ready_true");
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
    approvedControlledBenchmark: options.approvedControlledBenchmark === true,
    benchmarkKind: "controlled_multifixture_serving_benchmark",
    servingStack: options.servingStack === "transformers_fastapi_reference"
      ? "transformers_fastapi_reference"
      : "invalid",
    approvedFixtureTokens: APPROVED_FIXTURE_TOKENS,
    fixtureCount: APPROVED_FIXTURE_TOKENS.length,
    callLimit: options.callCount === APPROVED_FIXTURE_TOKENS.length ? APPROVED_FIXTURE_TOKENS.length : 0,
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
        allowNetworkCalls: loaded.value.allowNetworkCalls === true,
        productionReady: false
      }
      : null,
    healthz,
    runtimeConfig: blockers.length === 0 ? config : null,
    networkCallsMade: Boolean(healthz)
  };
}

async function runBenchmark(config, healthz) {
  const rows = [];
  let unsafeStop = null;

  for (const fixtureToken of APPROVED_FIXTURE_TOKENS) {
    const row = await runFixtureCall(config, fixtureToken);
    rows.push(row);
    const redaction = assertBenchmarkRowsRedacted(rows);
    if (!redaction.ok) {
      unsafeStop = "blocked_for_artifact_leakage";
      break;
    }
  }

  const acceptedCount = rows.filter((row) => row.accepted === true).length;
  const rejectedCount = rows.filter((row) => row.accepted !== true).length;
  const validationCodes = bucketCounts(rows.map((row) => row.validationCode || "null"));
  const fallbackCategories = bucketCounts(rows.map((row) => row.fallbackCategory || "null"));
  const latencyBuckets = bucketCounts(rows.map((row) => row.latencyBucket || "unknown"));

  return {
    benchmarkKind: "controlled_multifixture_serving_benchmark",
    servingStackClass: "transformers_fastapi_reference",
    modelClass: healthz?.modelFamilyBucket === "qwen_vlm_compatible"
      ? "qwen_vlm_compatible"
      : "unknown",
    endpointBucket: "local_or_private",
    approvedFixtureTokens: APPROVED_FIXTURE_TOKENS,
    fixtureCount: APPROVED_FIXTURE_TOKENS.length,
    callCount: rows.length,
    retryCount: 0,
    acceptedCount,
    rejectedCount,
    blockedCount: unsafeStop ? 1 : 0,
    validationCodes,
    fallbackCategories,
    latencyBuckets,
    perFixtureSanitizedRows: rows,
    unsafeStopBucket: unsafeStop,
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    rawPromptPersisted: false,
    rawPromptPrinted: false,
    rawPayloadPersisted: false,
    rawPayloadPrinted: false,
    productionReady: false
  };
}

async function runFixtureCall(config, fixtureToken) {
  const startedAt = Date.now();
  const requestBody = {
    schemaVersion: "open_weight_vlm_local_fastapi_request.v1",
    fixtureId: fixtureToken,
    modelId: config.modelId,
    outputContract: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION
  };

  let response;
  try {
    response = await fetch(config.modelServerUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(config.timeoutMs)
    });
  } catch {
    return fixtureRow({
      fixtureToken,
      accepted: false,
      validationCode: "local_model_unavailable",
      fallbackCategory: "blocked_for_provider_integration",
      latencyMs: Date.now() - startedAt
    });
  }

  if (!response.ok) {
    return fixtureRow({
      fixtureToken,
      accepted: false,
      validationCode: "local_model_unavailable",
      fallbackCategory: "blocked_for_provider_integration",
      latencyMs: Date.now() - startedAt
    });
  }

  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return fixtureRow({
      fixtureToken,
      accepted: false,
      validationCode: "invalid_json",
      fallbackCategory: "invalid_json",
      latencyMs: Date.now() - startedAt
    });
  }

  const candidate = isPlainObject(parsed) && "candidate" in parsed ? parsed.candidate : parsed;
  const validation = validateOpenWeightVlmPhotoAdvisorCandidate(candidate);
  const diagnostic = validation.ok
    ? null
    : buildOpenWeightVlmSchemaDiagnostic(candidate, validation.error);

  return fixtureRow({
    fixtureToken,
    accepted: validation.ok,
    validationCode: validation.ok ? null : diagnostic?.validationCode || validation.error.code,
    fallbackCategory: validation.ok ? null : validation.error.fallbackCategory,
    latencyMs: Date.now() - startedAt
  });
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
    return healthzFailure("connection_refused");
  }

  if (!response.ok) {
    return healthzFailure("ok_false");
  }

  let parsed;
  try {
    parsed = await response.json();
  } catch {
    return healthzFailure("invalid_json");
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

function healthzFailure(healthzBucket) {
  return {
    ok: false,
    modelLoaded: false,
    modelFamilyBucket: "unavailable",
    rawLoggingDisabled: false,
    publicExposure: "unknown",
    healthzBucket,
    networkCallsMade: true
  };
}

function collectLocalFileFacts(tokens) {
  return {
    configPresent: existsSync(LOCAL_CONFIG_PATH),
    registryPresent: existsSync(LOCAL_REGISTRY_PATH),
    configIgnored: gitCheckIgnored("backend/config/open-weight-vlm.local.json"),
    registryIgnored: gitCheckIgnored("backend/config/open-weight-vlm.fixtures.local.json"),
    configStaged: gitHasOutput(["diff", "--cached", "--name-only", "--", "backend/config/open-weight-vlm.local.json"]),
    registryStaged: gitHasOutput(["diff", "--cached", "--name-only", "--", "backend/config/open-weight-vlm.fixtures.local.json"]),
    configTracked: gitHasOutput(["ls-files", "--", "backend/config/open-weight-vlm.local.json"]),
    registryTracked: gitHasOutput(["ls-files", "--", "backend/config/open-weight-vlm.fixtures.local.json"]),
    fixtureStatuses: tokens.map((token) => fixtureFileStatus(token))
  };
}

function fixtureFileStatus(token) {
  const candidates = ["jpg", "jpeg", "png"].map((extension) => ({
    extension,
    repoPath: `backend/tests/vlm-local-samples/${token}.${extension}`
  }));
  const found = candidates.find((candidate) => existsSync(fileURLToPath(new URL(`../tests/vlm-local-samples/${token}.${candidate.extension}`, import.meta.url))));
  return {
    token,
    extensionBucket: found?.extension || "missing",
    filePresent: Boolean(found),
    ignored: found ? gitCheckIgnored(found.repoPath) : false,
    staged: found ? gitHasOutput(["diff", "--cached", "--name-only", "--", found.repoPath]) : false,
    tracked: found ? gitHasOutput(["ls-files", "--", found.repoPath]) : false
  };
}

function registryApprovedStatus(tokens) {
  if (!existsSync(LOCAL_REGISTRY_PATH)) {
    return {
      registryPresent: false,
      approvedFixtureCount: 0,
      missingApprovedTokens: tokens,
      unexpectedApprovedTokens: [],
      duplicateTokenCount: 0
    };
  }

  const registry = JSON.parse(readFileSync(LOCAL_REGISTRY_PATH, "utf8"));
  const fixtures = Array.isArray(registry) ? registry : Array.isArray(registry.fixtures) ? registry.fixtures : [];
  const approvedTokens = [];
  const seen = new Set();
  let duplicateTokenCount = 0;
  for (const entry of fixtures) {
    const token = String(entry?.fixtureId || "");
    if (seen.has(token)) {
      duplicateTokenCount += 1;
    }
    seen.add(token);
    if (entry?.approvedForLocalSmoke === true && entry?.metadataStripped === true && entry?.privacyReviewed === true) {
      approvedTokens.push(token);
    }
  }

  return {
    registryPresent: true,
    approvedFixtureCount: tokens.filter((token) => approvedTokens.includes(token)).length,
    missingApprovedTokens: tokens.filter((token) => !approvedTokens.includes(token)),
    unexpectedApprovedTokens: approvedTokens.filter((token) => !tokens.includes(token)).filter((token) => /^smoke_\d{3}$/u.test(token)),
    duplicateTokenCount
  };
}

function fixtureRow({
  fixtureToken,
  accepted,
  validationCode = null,
  fallbackCategory = null,
  latencyMs = 0
}) {
  return {
    fixtureToken,
    accepted: accepted === true,
    validationCode: validationCode ? sanitizeToken(validationCode) : null,
    fallbackCategory: fallbackCategory ? sanitizeToken(fallbackCategory) : null,
    latencyBucket: latencyBucket(latencyMs),
    rawOutputPersisted: false,
    rawOutputPrinted: false,
    rawPromptPersisted: false,
    rawPromptPrinted: false,
    rawPayloadPersisted: false,
    rawPayloadPrinted: false
  };
}

function printSummary(summary) {
  const output = {
    schemaVersion: "open_weight_vlm_transformers_fastapi_controlled_multifixture_serving_benchmark.v1",
    phaseResult: summary.phaseResult,
    benchmarkKind: "controlled_multifixture_serving_benchmark",
    servingStackClass: "transformers_fastapi_reference",
    preflightPassed: summary.preflight.ok === true,
    preflightBlockers: summary.preflight.blockers,
    approvedFixtureTokens: APPROVED_FIXTURE_TOKENS,
    fixtureCount: APPROVED_FIXTURE_TOKENS.length,
    callCount: summary.benchmark?.callCount || 0,
    retryCount: 0,
    healthzBucket: summary.preflight.healthz?.healthzBucket || "not_run",
    healthzSafeSummary: summary.preflight.healthz
      ? {
        ok: summary.preflight.healthz.ok === true,
        modelLoaded: summary.preflight.healthz.modelLoaded === true,
        modelFamilyBucket: summary.preflight.healthz.modelFamilyBucket,
        rawLoggingDisabled: summary.preflight.healthz.rawLoggingDisabled === true,
        publicExposure: summary.preflight.healthz.publicExposure
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
  };

  const redaction = assertBenchmarkRowsRedacted([output]);
  if (!redaction.ok) {
    console.log(JSON.stringify({
      schemaVersion: output.schemaVersion,
      phaseResult: "unsafe_stopped",
      preflightPassed: false,
      preflightBlockers: ["blocked_for_artifact_leakage"],
      callCount: 0,
      retryCount: 0,
      rawOutputPersisted: false,
      rawOutputPrinted: false,
      rawPromptPersisted: false,
      rawPromptPrinted: false,
      rawPayloadPersisted: false,
      rawPayloadPrinted: false,
      productionReady: false
    }, null, 2));
    return;
  }

  console.log(JSON.stringify(output, null, 2));
}

function assertBenchmarkRowsRedacted(value) {
  const serialized = JSON.stringify(value);
  const forbiddenSnippets = [
    "data:image",
    "image_url",
    "fullPrompt",
    "rawResponse",
    "modelResponseText",
    "modelOutput",
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
    "token@example",
    "stack trace"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: "benchmark_summary_not_redacted"
      };
    }
  }

  return { ok: true };
}

function parseFixtureList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sameOrderedTokens(left, right) {
  return left.length === right.length && left.every((token, index) => token === right[index]);
}

function bucketCounts(values) {
  const counts = {};
  for (const value of values) {
    const key = sanitizeToken(value || "null");
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
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

function latencyBucket(latencyMs) {
  if (!Number.isFinite(latencyMs)) {
    return "unknown";
  }
  if (latencyMs < 1000) {
    return "lt_1s";
  }
  if (latencyMs < 5000) {
    return "1s_to_5s";
  }
  if (latencyMs < 15000) {
    return "5s_to_15s";
  }
  return "gt_15s";
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
