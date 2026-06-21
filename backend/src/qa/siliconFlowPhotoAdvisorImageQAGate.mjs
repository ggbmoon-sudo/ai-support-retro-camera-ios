import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import {
  SILICONFLOW_API_BASE_URL,
  SILICONFLOW_CHAT_COMPLETIONS_PATH,
  SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL,
  SILICONFLOW_ENDPOINT_BUCKET,
  siliconFlowCredentialSmokeConfig
} from "./siliconFlowCredentialSmokeGate.mjs";
import {
  PHOTO_ADVISOR_MODEL_IDS,
  PhotoAdvisorModelCandidate
} from "../providers/photoAdvisorProviderTypes.mjs";
import {
  buildSiliconFlowPhotoAdvisorCompactSystemPrompt,
  buildSiliconFlowPhotoAdvisorCompactUserPrompt
} from "../providers/siliconflowPhotoAdvisorPromptContract.mjs";
import { parseSiliconFlowPhotoAdvisorResponse } from "../providers/siliconflowPhotoAdvisorProviderContract.mjs";

const LOCAL_IMAGE_DIR = new URL("../../tests/local-images/", import.meta.url);
const APPROVED_REAL_SAMPLE_DIR = new URL("../../tests/approved-real-samples/", import.meta.url);
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_LIMIT = 1;
const DEFAULT_LOCALE = "zh-Hant";
const IMAGE_QA_MODEL_CANDIDATES = Object.freeze([
  PhotoAdvisorModelCandidate.deepseekV4Flash,
  PhotoAdvisorModelCandidate.qwen3Vl32BInstruct,
  PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct,
  PhotoAdvisorModelCandidate.qwen3Vl8BInstruct
]);

export function parseSiliconFlowPhotoAdvisorImageQAArgs(args = []) {
  const options = {
    runProvider: false,
    dryRun: false,
    imageSet: "synthetic",
    limit: DEFAULT_LIMIT,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    locale: DEFAULT_LOCALE,
    modelCandidate: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--run-provider") {
      options.runProvider = true;
      continue;
    }
    if (arg === "--dry-run" || arg === "--check-gate") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--image-set") {
      options.imageSet = normalizeImageSet(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--image-set=")) {
      options.imageSet = normalizeImageSet(arg.slice("--image-set=".length));
      continue;
    }
    if (arg === "--limit") {
      options.limit = normalizeLimit(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--limit=")) {
      options.limit = normalizeLimit(arg.slice("--limit=".length));
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = normalizeTimeout(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--timeout-ms=")) {
      options.timeoutMs = normalizeTimeout(arg.slice("--timeout-ms=".length));
      continue;
    }
    if (arg === "--locale") {
      options.locale = normalizeLocale(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--locale=")) {
      options.locale = normalizeLocale(arg.slice("--locale=".length));
      continue;
    }
    if (arg === "--model-candidate") {
      options.modelCandidate = normalizeImageQAModelCandidate(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--model-candidate=")) {
      options.modelCandidate = normalizeImageQAModelCandidate(arg.slice("--model-candidate=".length));
    }
  }

  return options;
}

export async function runSiliconFlowPhotoAdvisorImageQA({
  args = [],
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = () => Date.now(),
  listSamplesImpl = listImageEntries,
  readFileImpl = readFile
} = {}) {
  const options = parseSiliconFlowPhotoAdvisorImageQAArgs(args);
  const config = siliconFlowPhotoAdvisorImageQAConfig(env, options);
  const configured = siliconFlowImageQAConfigured(config);

  const sampleEntries = await listSamplesImpl(options.imageSet);
  const selectedSamples = sampleEntries.slice(0, options.limit);
  const base = baseReport({ options, config, configured, sampleEntries, selectedSamples });

  if (!options.runProvider) {
    return {
      ...base,
      ok: true,
      runMode: "dry_run_gate",
      hardBlockers: [],
      blockers: configured.blockers,
      plannedCalls: 0,
      actualCalls: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      networkCallsMade: false,
      imageReadsPerformed: false,
      imageUploadAttempted: false,
      modelCallsMade: false,
      instructions: {
        syntheticOne: "npm run qa:siliconflow:photo-advisor-image-qa -- --run-provider --image-set=synthetic --limit=1",
        approvedRealOne: "npm run qa:siliconflow:photo-advisor-image-qa -- --run-provider --image-set=approved-real --limit=1"
      },
      productionReady: false
    };
  }

  const preflightBlockers = preflightBlockersForRun({ configured, selectedSamples, fetchImpl });
  if (preflightBlockers.length > 0) {
    return blockedReport(base, preflightBlockers);
  }

  const results = [];
  for (const sample of selectedSamples) {
    results.push(await runImageQACall({
      sample,
      options,
      config,
      fetchImpl,
      readFileImpl,
      now
    }));
  }

  const acceptedCount = results.filter((result) => result.accepted).length;
  const rejectedCount = results.length - acceptedCount;
  const report = {
    ...base,
    ok: rejectedCount === 0,
    runMode: "provider_image_qa",
    hardBlockers: rejectedCount === 0 ? [] : ["provider_image_qa_failed"],
    blockers: rejectedCount === 0 ? [] : unique(results.map((result) => result.errorBucket).filter(Boolean)),
    plannedCalls: selectedSamples.length,
    actualCalls: results.length,
    acceptedCount,
    rejectedCount,
    results,
    latencyBuckets: countBy(results.map((result) => result.latencyBucket)),
    errorBuckets: countBy(results.map((result) => result.errorBucket).filter(Boolean)),
    networkCallsMade: results.length > 0,
    imageReadsPerformed: results.length > 0,
    imageUploadAttempted: results.length > 0,
    modelCallsMade: results.length,
    keyPrinted: false,
    providerUrlPrinted: false,
    promptContentPrinted: false,
    providerTextPrinted: false,
    requestBodyPrinted: false,
    imageContentPrinted: false,
    imageContentPersisted: false,
    providerResponsePersisted: false,
    providerRuntimeExecutionAdded: false,
    iOSRuntimeChanged: false,
    uploadPayloadChanged: false,
    productionReady: false
  };

  const redaction = assertSiliconFlowPhotoAdvisorImageQAReportRedacted(report);
  if (!redaction.ok) {
    return {
      ...base,
      ok: false,
      runMode: "provider_image_qa_redaction_blocked",
      hardBlockers: [redaction.errorCode],
      blockers: [redaction.errorCode],
      plannedCalls: selectedSamples.length,
      actualCalls: results.length,
      acceptedCount: 0,
      rejectedCount: results.length,
      networkCallsMade: results.length > 0,
      imageReadsPerformed: results.length > 0,
      imageUploadAttempted: results.length > 0,
      modelCallsMade: results.length,
      productionReady: false
    };
  }

  return report;
}

export function buildSiliconFlowPhotoAdvisorImageQARequest({
  imageDataURL,
  locale = DEFAULT_LOCALE,
  model = SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL
} = {}) {
  return {
    model,
    stream: false,
    temperature: 0.1,
    top_p: 0.8,
    max_tokens: 192,
    messages: [
      {
        role: "system",
        content: buildSiliconFlowPhotoAdvisorCompactSystemPrompt()
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageDataURL,
              detail: "low"
            }
          },
          {
            type: "text",
            text: `${buildSiliconFlowPhotoAdvisorCompactUserPrompt()}\nLocale: ${locale}`
          }
        ]
      }
    ]
  };
}

export function assertSiliconFlowPhotoAdvisorImageQAReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const forbidden = [
    "data:image",
    "base64",
    "image_url",
    "requestPayload",
    "rawPayload",
    "rawPrompt",
    "rawOutput",
    "rawProvider",
    "Authorization",
    "Bearer ",
    "SILICONFLOW_API_KEY",
    "EXIF",
    "GPS",
    "stack trace"
  ];

  for (const marker of forbidden) {
    if (serialized.includes(marker)) {
      return { ok: false, errorCode: "qa_report_not_redacted" };
    }
  }
  return { ok: true };
}

async function runImageQACall({ sample, options, config, fetchImpl, readFileImpl, now }) {
  const started = now();
  try {
    const buffer = await readFileImpl(sample.fileURL);
    const imageDataURL = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    const response = await fetchWithTimeout(fetchImpl, `${config.baseURL}${config.path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(buildSiliconFlowPhotoAdvisorImageQARequest({
        imageDataURL,
        locale: options.locale,
        model: config.model
      }))
    }, options.timeoutMs);

    const latencyMs = Math.max(0, now() - started);
    if (!response.ok) {
      return caseResult({
        sample,
        model: config.model,
        accepted: false,
        latencyMs,
        httpStatusBucket: httpStatusBucket(response.status),
        errorBucket: mapHTTPStatusToBucket(response.status),
        schemaDiagnosticBuckets: []
      });
    }

    const payload = await response.json();
    const parsed = parseSiliconFlowPhotoAdvisorResponse(payload);
    return caseResult({
      sample,
      model: config.model,
      accepted: parsed.ok,
      latencyMs,
      httpStatusBucket: "2xx",
      errorBucket: parsed.ok ? null : parsed.bucket,
      schemaDiagnosticBuckets: parsed.schemaDiagnosticBuckets ?? []
    });
  } catch (error) {
    return caseResult({
      sample,
      model: config.model,
      accepted: false,
      latencyMs: Math.max(0, now() - started),
      httpStatusBucket: "not_available",
      errorBucket: mapThrownErrorToBucket(error),
      schemaDiagnosticBuckets: []
    });
  }
}

function baseReport({ options, config, configured, sampleEntries, selectedSamples }) {
  return {
    schemaVersion: "siliconflow_photo_advisor_image_qa.v1",
    providerClass: "siliconflow",
    providerMode: "backend_internal_debug_only",
    endpointBucket: SILICONFLOW_ENDPOINT_BUCKET,
    apiStyle: "openai_compatible_chat_completions",
    modelNameBucket: modelNameBucket(config.model),
    selectedModelCandidate: modelCandidateBucket(config.model),
    selectedImageSet: options.imageSet,
    selectedLocale: options.locale,
    sampleCount: sampleEntries.length,
    selectedSampleCount: selectedSamples.length,
    maxPlannedCalls: options.limit,
    requestShape: "vision_chat_completion",
    requiresExplicitRunProviderFlag: true,
    providerConfigured: configured.ok,
    apiKeyLoaded: options.runProvider && configured.ok,
    keyPresenceBucket: config.apiKey ? "present_in_env_not_printed" : "missing",
    baseUrlBucket: config.baseURL ? "api_siliconflow_com" : "missing",
    pathBucket: config.path === SILICONFLOW_CHAT_COMPLETIONS_PATH ? "v1_chat_completions" : "missing",
    usesServerSideOnlyCredential: true,
    keyPrinted: false,
    providerUrlPrinted: false,
    promptContentPrinted: false,
    providerTextPrinted: false,
    requestBodyPrinted: false,
    imageContentPrinted: false,
    imageContentPersisted: false,
    providerResponsePersisted: false,
    providerRuntimeExecutionAdded: false,
    iOSRuntimeChanged: false,
    uploadPayloadChanged: false,
    productionReady: false
  };
}

function blockedReport(base, hardBlockers) {
  return {
    ...base,
    ok: false,
    runMode: "provider_image_qa_blocked",
    hardBlockers,
    blockers: hardBlockers,
    plannedCalls: 0,
    actualCalls: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    networkCallsMade: false,
    imageReadsPerformed: false,
    imageUploadAttempted: false,
    modelCallsMade: false,
    productionReady: false
  };
}

function caseResult({
  sample,
  model,
  accepted,
  latencyMs,
  httpStatusBucket,
  errorBucket,
  schemaDiagnosticBuckets
}) {
  return {
    caseId: sample.caseId,
    sampleType: sample.sampleType,
    accepted,
    endpointBucket: SILICONFLOW_ENDPOINT_BUCKET,
    modelNameBucket: modelNameBucket(model),
    latencyBucket: latencyBucket(latencyMs),
    httpStatusBucket,
    errorBucket,
    schemaDiagnosticBuckets: Array.isArray(schemaDiagnosticBuckets) ? schemaDiagnosticBuckets.slice(0, 8).sort() : [],
    networkCallMade: true,
    imageReadPerformed: true,
    imageUploadAttempted: true,
    promptContentPrinted: false,
    requestBodyPrinted: false,
    providerTextPrinted: false,
    imageContentPrinted: false,
    keyPrinted: false,
    productionReady: false
  };
}

async function listImageEntries(imageSet) {
  const directory = imageSet === "approved-real" ? APPROVED_REAL_SAMPLE_DIR : LOCAL_IMAGE_DIR;
  const sampleType = imageSet === "approved-real" ? "approved_real_sample" : "synthetic";
  if (!existsSync(directory)) {
    return [];
  }

  const names = await readdir(directory);
  return names
    .filter((name) => [".jpg", ".jpeg"].includes(extname(name).toLowerCase()))
    .filter((name) => !name.startsWith("._"))
    .sort()
    .map((name) => ({
      caseId: `${sampleType}-${basename(name, extname(name))}`,
      sampleType,
      fileURL: new URL(name, directory)
    }));
}

function siliconFlowPhotoAdvisorImageQAConfig(env, options) {
  const base = siliconFlowCredentialSmokeConfig(env, {});
  const candidate = options.modelCandidate ||
    normalizeImageQAModelCandidate(env.SILICONFLOW_PHOTO_ADVISOR_VISION_MODEL_CANDIDATE);
  const model = candidate ? PHOTO_ADVISOR_MODEL_IDS[candidate] : base.model;
  return {
    ...base,
    model,
    modelCandidate: candidate || modelCandidateForModel(model)
  };
}

function siliconFlowImageQAConfigured(config) {
  const blockers = [];
  if (!config.apiKey) {
    blockers.push("provider_not_configured");
  }
  if (config.baseURL !== SILICONFLOW_API_BASE_URL) {
    blockers.push("provider_base_url_not_configured");
  }
  if (config.path !== SILICONFLOW_CHAT_COMPLETIONS_PATH) {
    blockers.push("provider_path_not_configured");
  }
  if (!modelCandidateForModel(config.model)) {
    blockers.push("provider_model_unavailable");
  }
  return { ok: blockers.length === 0, blockers: unique(blockers) };
}

function preflightBlockersForRun({ configured, selectedSamples, fetchImpl }) {
  const blockers = [];
  if (!configured.ok) {
    blockers.push(...configured.blockers);
  }
  if (selectedSamples.length === 0) {
    blockers.push("no_approved_or_synthetic_samples");
  }
  if (!fetchImpl) {
    blockers.push("fetch_unavailable");
  }
  return unique(blockers);
}

async function fetchWithTimeout(fetchImpl, url, request, timeoutMs) {
  if (typeof AbortController === "undefined") {
    return fetchImpl(url, request);
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchImpl(url, { ...request, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeImageSet(value) {
  return value === "approved-real" ? "approved-real" : "synthetic";
}

function normalizeLimit(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) ? Math.min(Math.max(parsed, 1), 3) : DEFAULT_LIMIT;
}

function normalizeTimeout(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(parsed) ? Math.min(Math.max(parsed, 1000), 60000) : DEFAULT_TIMEOUT_MS;
}

function normalizeLocale(value) {
  const text = String(value ?? "").trim();
  return ["en", "zh-Hant", "zh-Hans", "yue-Hant-HK"].includes(text) ? text : DEFAULT_LOCALE;
}

function normalizeImageQAModelCandidate(value) {
  const text = String(value ?? "").trim();
  const normalized = text
    .replace(/^--?/, "")
    .replace(/-/g, "_");
  if (IMAGE_QA_MODEL_CANDIDATES.includes(normalized)) {
    return normalized;
  }
  if (Object.values(PHOTO_ADVISOR_MODEL_IDS).includes(text)) {
    return modelCandidateForModel(text);
  }
  return null;
}

function modelNameBucket(model) {
  switch (model) {
  case SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL:
    return "deepseek_ai_deepseek_v4_flash";
  case PHOTO_ADVISOR_MODEL_IDS[PhotoAdvisorModelCandidate.qwen3Vl32BInstruct]:
    return "qwen3_vl_32b_instruct";
  case PHOTO_ADVISOR_MODEL_IDS[PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct]:
    return "qwen3_vl_30b_a3b_instruct";
  case PHOTO_ADVISOR_MODEL_IDS[PhotoAdvisorModelCandidate.qwen3Vl8BInstruct]:
    return "qwen3_vl_8b_instruct";
  default:
    return "missing";
  }
}

function modelCandidateBucket(model) {
  return modelCandidateForModel(model) || "missing";
}

function modelCandidateForModel(model) {
  return IMAGE_QA_MODEL_CANDIDATES.find((candidate) => PHOTO_ADVISOR_MODEL_IDS[candidate] === model) || null;
}

function httpStatusBucket(status) {
  if (status >= 200 && status < 300) {
    return "2xx";
  }
  if (status === 401 || status === 403) {
    return "auth_failed";
  }
  if (status === 429) {
    return "rate_limited";
  }
  if (status >= 500) {
    return "5xx";
  }
  if (status >= 400) {
    return "4xx";
  }
  return "unknown";
}

function mapHTTPStatusToBucket(status) {
  switch (status) {
  case 401:
  case 403:
    return "provider_auth_failed";
  case 404:
    return "provider_model_unavailable";
  case 408:
  case 504:
    return "provider_timeout";
  case 400:
  case 415:
  case 422:
    return "provider_vision_request_rejected";
  case 429:
    return "provider_rate_limited";
  default:
    return status >= 500 ? "provider_transient_error" : "provider_error";
  }
}

function mapThrownErrorToBucket(error) {
  if (error?.name === "AbortError" || error?.code === "ETIMEDOUT") {
    return "provider_timeout";
  }
  if (["ECONNRESET", "ENOTFOUND", "ECONNREFUSED"].includes(error?.code)) {
    return "provider_network_error";
  }
  return "provider_error";
}

function latencyBucket(value) {
  if (!Number.isFinite(value)) {
    return "unknown";
  }
  if (value < 1000) {
    return "lt_1s";
  }
  if (value < 5000) {
    return "1s_to_5s";
  }
  if (value < 15000) {
    return "5s_to_15s";
  }
  return "gt_15s";
}

function countBy(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}
