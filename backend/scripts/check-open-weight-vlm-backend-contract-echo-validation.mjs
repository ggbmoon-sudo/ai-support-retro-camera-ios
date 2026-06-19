#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BACKEND_CONTRACT_ECHO_APPROVED_TOKENS,
  BACKEND_CONTRACT_ECHO_SCHEMA_VERSION,
  buildBackendNoModelContractEchoValidationPlan,
  validateBackendNoModelContractEchoResult
} from "../src/qa/openWeightVlmBackendContractEchoValidation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_CONFIG_PATH = path.join(__dirname, "../config/open-weight-vlm.local.json");
const DEFAULT_LOOPBACK_BASE_URL = "http://127.0.0.1:8025";

async function main() {
  const plan = buildBackendNoModelContractEchoValidationPlan();
  const baseUrl = resolveContractEchoBaseUrl();
  const endpointBucket = classifyEndpointBucket(baseUrl);

  if (!baseUrl || !["local_loopback", "private_lan"].includes(endpointBucket)) {
    printAndExit(blockedOutput(plan, "no_contract_echo_endpoint", endpointBucket), 1);
  }

  let result;
  try {
    result = await runNoModelContractEchoValidation(baseUrl, plan);
  } catch {
    printAndExit(blockedOutput(plan, "no_contract_echo_endpoint", endpointBucket), 1);
  }

  const validated = validateBackendNoModelContractEchoResult({
    ...result,
    endpointBucket,
    contractEchoOnly: true,
    modelCallExecuted: false,
    inferenceEndpointCalled: false,
    benchmarkExecuted: false,
    retryCount: 0,
    productionReady: false
  });

  const output = {
    schemaVersion: BACKEND_CONTRACT_ECHO_SCHEMA_VERSION,
    validationKind: "backend_no_model_contract_echo_validation",
    noModelHttpEndpointAvailable: true,
    endpointBucket,
    ...validated
  };

  printAndExit(output, validated.contractEchoValidationEligible ? 0 : 1);
}

async function runNoModelContractEchoValidation(baseUrl, plan) {
  const approvedResponses = [];
  for (const fixtureToken of BACKEND_CONTRACT_ECHO_APPROVED_TOKENS) {
    const routing = await postJson(baseUrl, "/local/vlm/fixture-routing-contract-echo", {
      fixtureId: fixtureToken
    });
    const gateway = await postJson(baseUrl, "/local/vlm/gateway-contract-echo", {
      fixtureId: fixtureToken
    });
    approvedResponses.push({
      fixtureToken,
      routing: sanitizeContractEchoResponse(routing),
      gateway: sanitizeContractEchoResponse(gateway)
    });
  }

  const unsupported = await postJson(baseUrl, "/local/vlm/fixture-routing-contract-echo", {
    fixtureId: "smoke_999"
  });
  const missing = await postJson(baseUrl, "/local/vlm/fixture-routing-contract-echo", {});

  return {
    ...plan,
    approvedResponses,
    unsupportedTokenBucket: sanitizeTokenBucket(unsupported?.errorBucket),
    missingTokenBucket: sanitizeTokenBucket(missing?.errorBucket),
    approvedTokenBuckets: [...BACKEND_CONTRACT_ECHO_APPROVED_TOKENS],
    rawArtifactLeakageDetected: false
  };
}

async function postJson(baseUrl, pathname, body) {
  const response = await fetch(new URL(pathname, baseUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const value = await response.json();
  if (!response.ok && !value?.errorBucket) {
    throw new Error("contract_echo_http_error");
  }
  return value;
}

function sanitizeContractEchoResponse(value) {
  const candidate = value?.candidate && typeof value.candidate === "object" ? value.candidate : null;
  return {
    ok: value?.ok === true,
    mode: sanitizeTokenBucket(value?.mode),
    fixtureIdBucket: sanitizeTokenBucket(value?.fixtureIdBucket),
    errorBucket: value?.errorBucket == null ? null : sanitizeTokenBucket(value.errorBucket),
    modelInferenceRun: value?.modelInferenceRun === true ? true : false,
    rawLoggingDisabled: value?.rawLoggingDisabled === true,
    publicExposure: value?.publicExposure === "no" ? "no" : "unknown",
    productionReady: value?.productionReady === true,
    candidate: candidate ? sanitizeCandidate(candidate) : null
  };
}

function sanitizeCandidate(candidate) {
  return {
    schemaVersion: candidate.schemaVersion,
    sourceType: candidate.sourceType,
    moodKey: candidate.moodKey,
    visualObservationKey: candidate.visualObservationKey,
    creativeIntent:
      candidate.creativeIntent && typeof candidate.creativeIntent === "object"
        ? {
            classification: candidate.creativeIntent.classification,
            preserveSignals: Array.isArray(candidate.creativeIntent.preserveSignals)
              ? candidate.creativeIntent.preserveSignals.map(sanitizeTokenBucket)
              : []
          }
        : null,
    technicalRisk:
      candidate.technicalRisk && typeof candidate.technicalRisk === "object"
        ? {
            level: candidate.technicalRisk.level,
            reasonKey: candidate.technicalRisk.reasonKey ?? null
          }
        : null,
    safety:
      candidate.safety && typeof candidate.safety === "object"
        ? {
            sensitiveInference: candidate.safety.sensitiveInference === true,
            identityInference: candidate.safety.identityInference === true,
            faceRecognition: candidate.safety.faceRecognition === true,
            rawProviderLeakage: candidate.safety.rawProviderLeakage === true
          }
        : null
  };
}

function resolveContractEchoBaseUrl() {
  const envValue = process.env.OPEN_WEIGHT_VLM_CONTRACT_ECHO_BASE_URL || process.env.VLM_CONTRACT_ECHO_BASE_URL;
  if (envValue) {
    return normalizeBaseUrl(envValue);
  }
  const localConfigValue = readLocalConfigBaseUrl();
  return normalizeBaseUrl(localConfigValue || DEFAULT_LOOPBACK_BASE_URL);
}

function readLocalConfigBaseUrl() {
  try {
    const parsed = JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf8"));
    return typeof parsed.modelServerUrl === "string" ? parsed.modelServerUrl : null;
  } catch {
    return null;
  }
}

function normalizeBaseUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function classifyEndpointBucket(value) {
  try {
    const host = new URL(value).hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return "local_loopback";
    }
    if (
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    ) {
      return "private_lan";
    }
    return "unsafe_or_public";
  } catch {
    return "missing";
  }
}

function sanitizeTokenBucket(value) {
  return typeof value === "string" && /^[a-z0-9_.-]+$/i.test(value) ? value : "unknown";
}

function blockedOutput(plan, blocker, endpointBucket = "missing") {
  return {
    schemaVersion: BACKEND_CONTRACT_ECHO_SCHEMA_VERSION,
    validationKind: "backend_no_model_contract_echo_validation",
    contractEchoValidationEligible: false,
    noModelHttpEndpointAvailable: false,
    endpointBucket,
    approvedTokenCount: plan.approvedTokenCount,
    approvedTokenBuckets: plan.approvedFixtureTokens,
    unsupportedTokenBucket: "missing",
    missingTokenBucket: "missing",
    modelCallExecuted: false,
    inferenceEndpointCalled: false,
    benchmarkExecuted: false,
    retryCount: 0,
    rawArtifactLeakageDetected: false,
    productionReady: false,
    blockers: [blocker],
    statusCategories: [
      "blocked_for_backend_no_model_contract_echo_validation",
      blocker,
      "not_production_ready"
    ]
  };
}

function printAndExit(output, exitCode) {
  console.log(JSON.stringify(output, null, 2));
  process.exit(exitCode);
}

main().catch(() => {
  printAndExit(blockedOutput(buildBackendNoModelContractEchoValidationPlan(), "unknown_contract_echo_failure"), 1);
});
