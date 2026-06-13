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
const REPORT_DIR = new URL("../reports/provider-qa/", import.meta.url);
const REPORT_URL = new URL("./photo-advisor-qa-report.json", REPORT_DIR);
const DEFAULT_LOCALES = ["en", "zh-Hant", "zh-Hans", "yue-Hant-HK"];
const TINY_JPEG_BASE64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/ASP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/ASP/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAY/Al//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/IV//2gAMAwEAAgADAAAAEP/EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8QH//EFBQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8QH//EFBABAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEAAT8QH//Z";

loadDotEnv(new URL("../../.env", import.meta.url));

const config = cloudAIConfig(process.env);
const cases = await loadQACases();

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
    locale: item.locale,
    source: body?.source ?? "unknown",
    latencyMs: Date.now() - started,
    schemaValid: validation.ok,
    safetyValid: safety.ok,
    fallbackCode: body?.error?.code ?? null,
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
  p95LatencyMs: report.p95LatencyMs,
  schemaFailures: report.schemaFailures,
  safetyFailures: report.safetyFailures,
  invalidFilterIds: report.invalidFilterIds,
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

async function loadQACases() {
  const images = existsSync(LOCAL_IMAGE_DIR)
    ? (await readdir(LOCAL_IMAGE_DIR)).filter((name) => [".jpg", ".jpeg"].includes(extname(name).toLowerCase()))
    : [];

  if (images.length === 0) {
    return DEFAULT_LOCALES.map((locale) => ({
      caseId: `tiny-smoke-${locale}`,
      locale,
      width: 1,
      height: 1,
      contentType: "image/jpeg",
      dataBase64: TINY_JPEG_BASE64
    }));
  }

  const loaded = [];
  for (const imageName of images) {
    const fileURL = new URL(imageName, LOCAL_IMAGE_DIR);
    const buffer = await readFile(fileURL);
    for (const locale of DEFAULT_LOCALES) {
      loaded.push({
        caseId: `${basename(imageName, extname(imageName))}-${locale}`,
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
