#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { ProviderKind } from "../src/providers/ProviderRegistry.mjs";
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
const REPORT_DIR = new URL("../reports/provider-qa/", import.meta.url);
const REPORT_URL = new URL("./photo-advisor-qa-report.json", REPORT_DIR);
const DEFAULT_LOCALES = ["en", "zh-Hant", "zh-Hans", "yue-Hant-HK"];
const TINY_JPEG_BASE64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/ASP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/ASP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Al//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IV//2gAMAwEAAgADAAAAEP/EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EFBABAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z";

loadDotEnv(new URL("../../.env", import.meta.url));

const config = cloudAIConfig(process.env);
const qaOptions = parseArgs(process.argv.slice(2));
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
  provider: "qweapi",
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

await mkdir(REPORT_DIR, { recursive: true });
await writeFile(REPORT_URL, `${JSON.stringify(report, null, 2)}\n`);

printSanitized({
  ok: true,
  reportPath: "backend/reports/provider-qa/photo-advisor-qa-report.json",
  provider: report.provider,
  model: report.model,
  baseUrlHost: report.baseUrlHost,
  totalCases: report.totalCases,
  cloudSuccess: report.cloudSuccess,
  fallback: report.fallback,
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
  languageCasesNeedingManualReview: report.languageCasesNeedingManualReview
});

function isQweInternalConfigured(value) {
  return value.providerMode === ProviderKind.qweInternal
    && value.allowInternalCloudAI
    && value.qweAPIKey
    && value.qweBaseURL
    && value.qwePhotoAdvisorModel
    && value.qweChatCompletionsPath;
}

function parseArgs(args) {
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
  return { imageSet };
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
