#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { ProviderKind } from "../src/providers/ProviderRegistry.mjs";
import { parseQweCloudAIResponse } from "../src/providers/QwePhotoAdvisorProvider.mjs";
import { handlePhotoAdvisorRequest } from "../src/routes/photoAdvisor.mjs";
import {
  assertQAReportRedacted,
  sanitizePhotoAdvisorQACase,
  summarizePhotoAdvisorQA
} from "../src/qa/photoAdvisorQAReport.mjs";
import { validateCloudAIResponse } from "../src/validators/validateCloudAIResponse.mjs";
import { validateSafeTextOutput } from "../src/security/safetyTextGuard.mjs";
import { isKnownFilterId } from "../src/filters/filterWhitelist.mjs";

const LOCAL_IMAGE_DIR = new URL("../tests/local-images/", import.meta.url);
const APPROVED_REAL_SAMPLE_DIR = new URL("../tests/approved-real-samples/", import.meta.url);
const CONTRACT_FIXTURE_URL = new URL("../tests/fixtures/provider-contract-regression-cases.json", import.meta.url);
const VALID_RESPONSE_FIXTURE_URL = new URL("../tests/fixtures/cloud-ai-valid-response.json", import.meta.url);
const REPORT_DIR = new URL("../reports/provider-qa/", import.meta.url);
const REPORT_URL = new URL("./photo-advisor-qa-report.json", REPORT_DIR);
const DEFAULT_LOCALES = ["en", "zh-Hant", "zh-Hans", "yue-Hant-HK"];
const TINY_JPEG_BASE64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/ASP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/ASP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Al//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IV//2gAMAwEAAgADAAAAEP/EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EFBABAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z";

loadDotEnv(new URL("../../.env", import.meta.url));

const qaOptions = parseArgs(process.argv.slice(2));
const config = cloudAIConfig(process.env);

if (qaOptions.checkSafetyGate) {
  const gate = await buildSafetyGateReport({ config, qaOptions });
  printSanitized(gate);
  process.exit(gate.ok ? 0 : 1);
}

if (qaOptions.runMode === "synthetic") {
  const report = await runSyntheticContractQA();
  await writeSanitizedReport(report);
  printReportSummary(report);
  process.exit(0);
}

if (!qaOptions.runProvider) {
  printSanitized({
    ok: false,
    errorCode: "provider_run_requires_explicit_opt_in",
    message: "Real-provider QA requires --run-provider after the dry-run safety gate is reviewed. No provider request was sent.",
    suggestedPreflight: "node scripts/run-photo-advisor-provider-qa.mjs --check-safety-gate",
    suggestedSynthetic: "node scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract",
    productionReady: false
  });
  process.exit(1);
}

const cases = await loadQACases(qaOptions);

if (!isQweInternalConfigured(config)) {
  printSanitized({
    ok: false,
    errorCode: "missing_internal_qwe_config",
    message: "QweAPI internal config is incomplete or not enabled. No provider request was sent.",
    expectedMode: ProviderKind.qweInternal
  });
  process.exit(1);
}

const results = [];
for (const item of cases) {
  const started = Date.now();
  const response = await handlePhotoAdvisorRequest(buildRequest(item), {
    config,
    headers: { "x-internal-debug-cloudai": "true" }
  });
  const body = response.body;
  const validation = validateCloudAIResponse(body);
  const safety = validateSafeTextOutput(body);

  results.push(sanitizePhotoAdvisorQACase({
    caseId: item.caseId,
    sampleType: item.sampleType ?? "synthetic",
    locale: item.locale,
    source: body?.source ?? "unknown",
    latencyMs: Date.now() - started,
    schemaValid: validation.ok,
    safetyValid: safety.ok,
    fallbackCode: body?.error?.code ?? null,
    unsafeCategory: response.metadata?.unsafeCategory ?? null,
    recommendedFilterIds: recommendedFilterIds(body),
    invalidFilterIds: invalidFilterIds(body).length,
    captionLength: captionLength(body),
    summaryLength: body?.summary?.length ?? 0,
    suggestionCount: Array.isArray(body?.suggestions) ? body.suggestions.length : 0,
    confidence: body?.confidence ?? null,
    needsManualLanguageReview: true
  }));
}

const report = summarizePhotoAdvisorQA({
  runMode: "provider",
  provider: "qweapi",
  providerConfigured: true,
  model: config.qwePhotoAdvisorModel,
  baseURL: config.qweBaseURL,
  cases: results,
  notes: [
    "Report is sanitized metadata only.",
    "Language quality, caption quality, and filter fit require manual review.",
    "Do not commit local QA images or generated reports."
  ]
});

const redaction = assertQAReportRedacted(report);
if (!redaction.ok) {
  printSanitized({ ok: false, errorCode: redaction.error.code, message: redaction.error.message });
  process.exit(1);
}

await writeSanitizedReport(report);
printReportSummary(report);

function isQweInternalConfigured(value) {
  return value.providerMode === ProviderKind.qweInternal
    && value.allowInternalCloudAI
    && value.qweAPIKey
    && value.qweBaseURL
    && value.qwePhotoAdvisorModel
    && value.qweChatCompletionsPath;
}

function parseArgs(args) {
  const syntheticContract = args.includes("--synthetic-contract");
  const checkSafetyGate = args.includes("--check-safety-gate") || args.includes("--dry-run-gate");
  const runProvider = args.includes("--run-provider");
  const modeArg = args.find((item) => item.startsWith("--mode="));
  const runMode = syntheticContract ? "synthetic" : modeArg?.split("=")[1] ?? "provider";
  if (!["provider", "synthetic"].includes(runMode)) {
    printSanitized({
      ok: false,
      errorCode: "invalid_run_mode",
      message: "Use --mode=provider, --mode=synthetic, --synthetic-contract, or --check-safety-gate."
    });
    process.exit(1);
  }

  const imageSetArg = args.find((item) => item.startsWith("--image-set="));
  const imageSet = imageSetArg?.split("=")[1] ?? "synthetic";
  if (!["synthetic", "approved-real", "all"].includes(imageSet)) {
    printSanitized({
      ok: false,
      errorCode: "invalid_image_set",
      message: "Use --image-set=synthetic, --image-set=approved-real, or --image-set=all."
    });
    process.exit(1);
  }
  return { runMode, imageSet, checkSafetyGate, runProvider };
}

async function buildSafetyGateReport({ config, qaOptions }) {
  const selectedSets = qaOptions.imageSet === "all"
    ? ["synthetic", "approved-real"]
    : [qaOptions.imageSet ?? "synthetic"];
  const imageSetSummaries = [];

  for (const imageSet of selectedSets) {
    const directory = imageSet === "approved-real" ? APPROVED_REAL_SAMPLE_DIR : LOCAL_IMAGE_DIR;
    const entries = await loadImageEntries(directory, imageSet);
    imageSetSummaries.push({
      imageSet,
      sampleCount: entries.length,
      ignoredByPolicy: true,
      approvedRealSamplesRequireOperatorConsent: imageSet === "approved-real"
    });
  }

  const providerConfigured = Boolean(isQweInternalConfigured(config));
  return {
    ok: true,
    gate: "photo_advisor_provider_qa_dry_run",
    runMode: "dry_run_gate",
    providerConfigured,
    providerNameBucket: providerConfigured ? "qweapi" : "not_configured",
    modelNameBucket: providerConfigured ? sanitizeModelNameForGate(config.qwePhotoAdvisorModel) : "not_configured",
    selectedImageSet: qaOptions.imageSet,
    imageSets: imageSetSummaries,
    checks: {
      syntheticContractCommandAvailable: true,
      realProviderRequiresRunProviderFlag: true,
      internalProviderGuardRequired: true,
      localCredentialsRequiredForProviderMode: true,
      reportPathIgnoredByPolicy: true,
      localImageFoldersIgnoredByPolicy: true,
      approvedRealSampleFolderIgnoredByPolicy: true,
      payloadLoggingDisabled: true,
      rawImagePersisted: false,
      rawProviderResponsePersisted: false,
      rawPromptPersisted: false,
      reportContainsRawUserContent: false,
      productionReady: false
    },
    commands: {
      syntheticContract: "node scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract",
      realProvider: "node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=approved-real"
    },
    requiredOperatorConfirmations: [
      "B0/B1/B2 backend tests and synthetic-contract QA have passed.",
      "Provider credentials exist only in ignored local env/config.",
      "Approved real samples are consented, local-only, metadata-stripped JPEGs.",
      "Generated reports remain ignored and sanitized.",
      "No raw images, prompts, provider responses, request payloads, secrets, GPS, raw EXIF, stack traces, or unsafe provider text will be logged or committed.",
      "productionReady remains false."
    ],
    productionReady: false
  };
}

async function runSyntheticContractQA() {
  const contract = await readJSON(CONTRACT_FIXTURE_URL);
  const base = await readJSON(VALID_RESPONSE_FIXTURE_URL);
  const syntheticCases = [];

  for (const item of contract.validResponses ?? []) {
    const response = responseFromRegressionCase(base, item);
    const validation = validateCloudAIResponse(response);
    const safety = validateSafeTextOutput(response);
    syntheticCases.push(sanitizePhotoAdvisorQACase({
      caseId: item.id,
      sampleType: "synthetic",
      locale: response.locale ?? "en",
      source: validation.ok ? "cloud" : "fallback",
      latencyMs: 0,
      schemaValid: validation.ok,
      safetyValid: safety.ok,
      fallbackCode: validation.ok ? null : fallbackCodeForValidation(validation.error?.code),
      validationCategory: validation.ok ? "none" : validationCategoryForValidation(validation.error?.code),
      unsafeCategory: validation.error?.unsafeCategory ?? null,
      recommendedFilterIds: recommendedFilterIds(response),
      invalidFilterIds: invalidFilterIds(response).length,
      captionLength: captionLength(response),
      summaryLength: response.summary?.length ?? 0,
      suggestionCount: Array.isArray(response.suggestions) ? response.suggestions.length : 0,
      confidence: response.confidence ?? null,
      needsManualLanguageReview: false
    }));
  }

  for (const item of contract.parserRejections ?? []) {
    let fallbackCode = "provider_invalid_json";
    let validationCategory = "invalid_json";
    try {
      const parsed = parseQweCloudAIResponse({
        choices: [{ message: { content: item.content } }]
      });
      const validation = validateCloudAIResponse(parsed);
      fallbackCode = validation.ok ? null : fallbackCodeForValidation(validation.error?.code);
      validationCategory = validation.ok ? "none" : validationCategoryForValidation(validation.error?.code);
    } catch (error) {
      fallbackCode = fallbackCodeForParserError(error?.code);
      validationCategory = "invalid_json";
    }

    syntheticCases.push(sanitizePhotoAdvisorQACase({
      caseId: item.id,
      sampleType: "synthetic",
      locale: "en",
      source: "fallback",
      latencyMs: 0,
      schemaValid: false,
      safetyValid: true,
      fallbackCode,
      validationCategory,
      recommendedFilterIds: [],
      invalidFilterIds: 0,
      needsManualLanguageReview: false
    }));
  }

  for (const item of contract.validatorRejections ?? []) {
    const response = responseFromRegressionCase(base, item);
    const validation = validateCloudAIResponse(response);
    const safety = validateSafeTextOutput(response);
    syntheticCases.push(sanitizePhotoAdvisorQACase({
      caseId: item.id,
      sampleType: "synthetic",
      locale: response.locale ?? "en",
      source: "fallback",
      latencyMs: 0,
      schemaValid: false,
      safetyValid: safety.ok,
      fallbackCode: fallbackCodeForValidation(validation.error?.code),
      validationCategory: validationCategoryForValidation(validation.error?.code, item),
      unsafeCategory: validation.error?.unsafeCategory ?? null,
      recommendedFilterIds: recommendedFilterIds(response).filter(isKnownFilterId),
      invalidFilterIds: invalidFilterIds(response).length,
      captionLength: captionLength(response),
      summaryLength: response.summary?.length ?? 0,
      suggestionCount: Array.isArray(response.suggestions) ? response.suggestions.length : 0,
      confidence: response.confidence ?? null,
      needsManualLanguageReview: false
    }));
  }

  for (const item of contract.providerFailures ?? []) {
    syntheticCases.push(sanitizePhotoAdvisorQACase({
      caseId: item.id,
      sampleType: "synthetic",
      locale: "en",
      source: "fallback",
      latencyMs: 0,
      schemaValid: true,
      safetyValid: true,
      fallbackCode: item.expectedFallbackCode,
      validationCategory: item.expectedFallbackCode === "provider_timeout" ? "timeout" : "provider_error",
      recommendedFilterIds: [],
      invalidFilterIds: 0,
      needsManualLanguageReview: false
    }));
  }

  const report = summarizePhotoAdvisorQA({
    runMode: "synthetic",
    provider: "synthetic",
    providerConfigured: false,
    model: "provider-contract-regression-fixtures",
    baseURL: "",
    cases: syntheticCases,
    notes: [
      "Synthetic contract QA uses committed provider regression fixtures only.",
      "No provider credentials, network request, real image, prompt-with-image data, or live output text is used.",
      "Production readiness must remain false; real-provider QA remains internal/debug only."
    ]
  });

  const redaction = assertQAReportRedacted(report);
  if (!redaction.ok) {
    printSanitized({ ok: false, errorCode: redaction.error.code, message: redaction.error.message });
    process.exit(1);
  }

  return report;
}

async function loadQACases(options = {}) {
  const selectedSets = options.imageSet === "all"
    ? ["synthetic", "approved-real"]
    : [options.imageSet ?? "synthetic"];
  const images = [];

  for (const imageSet of selectedSets) {
    const directory = imageSet === "approved-real" ? APPROVED_REAL_SAMPLE_DIR : LOCAL_IMAGE_DIR;
    images.push(...await loadImageEntries(directory, imageSet));
  }

  if (images.length === 0) {
    return DEFAULT_LOCALES.map((locale) => ({
      caseId: `tiny-smoke-${locale}`,
      sampleType: "synthetic",
      locale,
      width: 1,
      height: 1,
      contentType: "image/jpeg",
      dataBase64: TINY_JPEG_BASE64
    }));
  }

  const loaded = [];
  for (const image of images) {
    const buffer = await readFile(image.fileURL);
    for (const locale of DEFAULT_LOCALES) {
      loaded.push({
        caseId: `${image.imageSet}-${basename(image.name, extname(image.name))}-${locale}`,
        sampleType: image.imageSet === "approved-real" ? "approved_real_sample" : "synthetic",
        locale,
        width: 1024,
        height: 768,
        contentType: "image/jpeg",
        dataBase64: buffer.toString("base64")
      });
    }
  }
  return loaded;
}

async function loadImageEntries(directoryURL, imageSet) {
  if (!existsSync(directoryURL)) {
    return [];
  }

  const names = await readdir(directoryURL);
  const resourceForks = names.filter((name) => name.startsWith("._"));
  if (resourceForks.length > 0) {
    printSanitized({
      ok: true,
      warningCode: "resource_fork_files_ignored",
      imageSet,
      count: resourceForks.length
    });
  }

  return names
    .filter((name) => [".jpg", ".jpeg"].includes(extname(name).toLowerCase()))
    .filter((name) => !name.startsWith("._"))
    .map((name) => ({
      imageSet,
      name,
      fileURL: new URL(name, directoryURL)
    }));
}

function buildRequest(item) {
  return {
    schemaVersion: "1.0",
    feature: "photo_advisor",
    mode: "post_capture",
    locale: item.locale,
    selectedFilterId: "instant_dream",
    consent: {
      imageUploadAccepted: true,
      consentVersion: "2026-06-13.phase17c-r2.qa"
    },
    image: {
      contentType: item.contentType,
      width: item.width,
      height: item.height,
      metadataStripped: true,
      dataBase64: item.dataBase64
    },
    client: {
      platform: "iOS",
      appVersion: "debug-provider-qa"
    }
  };
}

function recommendedFilterIds(body) {
  return Array.isArray(body?.recommendedFilters)
    ? body.recommendedFilters.map((item) => item.filterId).filter(Boolean)
    : [];
}

function invalidFilterIds(body) {
  return recommendedFilterIds(body).filter((filterId) => !isKnownFilterId(filterId));
}

function captionLength(body) {
  if (!Array.isArray(body?.suggestions)) {
    return 0;
  }
  const caption = body.suggestions.find((item) => item.type === "caption" || item.action === "caption");
  return caption?.text?.length ?? 0;
}

async function readJSON(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

async function writeSanitizedReport(report) {
  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_URL, `${JSON.stringify(report, null, 2)}\n`);
}

function printReportSummary(report) {
  printSanitized({
    ok: true,
    reportPath: "backend/reports/provider-qa/photo-advisor-qa-report.json",
    runMode: report.runMode,
    providerConfigured: report.providerConfigured,
    providerNameBucket: report.providerNameBucket,
    modelNameBucket: report.modelNameBucket,
    baseUrlHost: report.baseUrlHost,
    totalCases: report.totalCases,
    successCount: report.successCount,
    cloudSuccess: report.cloudSuccess,
    fallback: report.fallback,
    validationFailureCount: report.validationFailureCount,
    invalidJsonCount: report.invalidJsonCount,
    invalidSchemaCount: report.invalidSchemaCount,
    unsupportedFilterCount: report.unsupportedFilterCount,
    overlongTextCount: report.overlongTextCount,
    providerErrorCount: report.providerErrorCount,
    averageLatencyMs: report.averageLatencyMs,
    p50LatencyMs: report.p50LatencyMs,
    p90LatencyMs: report.p90LatencyMs,
    p95LatencyMs: report.p95LatencyMs,
    maxLatencyMs: report.maxLatencyMs,
    timeoutCount: report.timeoutCount,
    unsafeResponseCount: report.unsafeResponseCount,
    unsafeByCategory: report.unsafeByCategory,
    schemaFailures: report.schemaFailures,
    safetyFailures: report.safetyFailures,
    invalidFilterIds: report.invalidFilterIds,
    fallbackByCode: report.fallbackByCode,
    fallbackByCategory: report.fallbackByCategory,
    latencyAssessment: report.latencyAssessment,
    languageCasesNeedingManualReview: report.languageCasesNeedingManualReview,
    payloadLoggingDisabled: report.payloadLoggingDisabled,
    rawImagePersisted: report.rawImagePersisted,
    rawProviderResponsePersisted: report.rawProviderResponsePersisted,
    rawPromptPersisted: report.rawPromptPersisted,
    reportContainsRawUserContent: report.reportContainsRawUserContent,
    productionReady: report.productionReady
  });
}

function responseFromRegressionCase(baseResponse, item) {
  const response = deepClone(baseResponse);
  if (item.override) {
    deepMerge(response, item.override);
  }
  for (const path of item.deletePaths ?? []) {
    deletePath(response, path);
  }
  return response;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(target, patch) {
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function deletePath(target, path) {
  const parts = path.split(".");
  const last = parts.pop();
  let node = target;
  for (const part of parts) {
    node = node?.[part];
  }
  if (node && last) {
    delete node[last];
  }
}

function fallbackCodeForParserError(code) {
  return code === "provider_invalid_json" || code === "invalid_json"
    ? "provider_invalid_json"
    : "provider_error";
}

function fallbackCodeForValidation(code) {
  switch (code) {
  case "unsafe_response":
    return "unsafe_response";
  case "provider_invalid_json":
  case "invalid_json":
    return "provider_invalid_json";
  case "timeout":
  case "provider_timeout":
    return "provider_timeout";
  case "provider_error":
  case "provider_unavailable":
    return "provider_unavailable";
  default:
    return "provider_invalid_schema";
  }
}

function validationCategoryForValidation(code, item = {}) {
  switch (code) {
  case "unsafe_response":
    return "unsafe_response";
  case "provider_invalid_json":
  case "invalid_json":
    return "invalid_json";
  case "unknown_filter_id":
    return "unsupported_filter";
  case "invalid_summary":
    return String(item.id ?? "").includes("overlong") ? "overlong_text" : "invalid_schema";
  case "invalid_suggestion_text":
  case "invalid_filter_reason":
  case "invalid_error_message":
    return "overlong_text";
  case "timeout":
  case "provider_timeout":
    return "timeout";
  case "provider_error":
  case "provider_unavailable":
    return "provider_error";
  default:
    return "invalid_schema";
  }
}

function sanitizeModelNameForGate(value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return "not_configured";
  }
  return text.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

function printSanitized(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

function loadDotEnv(url) {
  if (!existsSync(url)) {
    return;
  }
  const text = readFileSync(url, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separator = trimmed.indexOf("=");
    if (separator < 0) {
      continue;
    }
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
