import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import test from "node:test";
import { healthResponse } from "../src/routes/health.mjs";
import { handlePhotoAdvisorRequest } from "../src/routes/photoAdvisor.mjs";
import { executableProviderKinds } from "../src/providers/ProviderRegistry.mjs";
import { providerBoundaryStatus } from "../src/providers/providerTypes.mjs";
import { QwePhotoAdvisorProvider, parseQweCloudAIResponse } from "../src/providers/QwePhotoAdvisorProvider.mjs";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { buildPhotoAdvisorPrompt } from "../src/prompts/photoAdvisorPrompt.mjs";
import { resolveProviderKind } from "../src/routes/photoAdvisor.mjs";
import { validateCloudAIResponse } from "../src/validators/validateCloudAIResponse.mjs";
import { validatePhotoAdvisorRequest } from "../src/validators/validatePhotoAdvisorRequest.mjs";
import { safeErrorMetadata } from "../src/logging/safeLog.mjs";
import {
  assertQAReportRedacted,
  sanitizePhotoAdvisorQACase,
  summarizePhotoAdvisorQA
} from "../src/qa/photoAdvisorQAReport.mjs";

test("health returns mock-only status", () => {
  assert.deepEqual(healthResponse(), {
    ok: true,
    service: "cloud-ai-boundary",
    mode: "mock-only"
  });
});

test("photo advisor accepts valid debug request", async () => {
  const result = await handlePhotoAdvisorRequest(await fixture("photo-advisor-valid-request.json"));

  assert.equal(result.status, 200);
  assert.equal(result.body.schemaVersion, "1.0");
  assert.equal(result.body.mode, "post_capture");
  assert.equal(result.body.source, "mock");
  assert.equal(result.body.safety.containsSensitiveInference, false);
  assert.equal(result.body.recommendedFilters[0].filterId, "instant_dream");
});

test("photo advisor rejects missing consent with structured fallback", async () => {
  const result = await handlePhotoAdvisorRequest(await fixture("photo-advisor-missing-consent.json"));

  assert.equal(result.status, 400);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "missing_consent");
});

test("photo advisor rejects bad schema version", async () => {
  const result = await handlePhotoAdvisorRequest(await fixture("photo-advisor-invalid-schema-version.json"));

  assert.equal(result.status, 400);
  assert.equal(result.body.error.code, "invalid_request");
});

test("photo advisor rejects oversized image", () => {
  const request = validRequest();
  request.image.dataBase64 = "A".repeat(2_100_004);

  const result = validatePhotoAdvisorRequest(request);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "payload_too_large");
});

test("photo advisor rejects invalid selected filter id", () => {
  const request = validRequest();
  request.selectedFilterId = "provider_made_this_up";

  const result = validatePhotoAdvisorRequest(request);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_filter_id");
});

test("cloud ai response validator accepts valid response", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-valid-response.json"));

  assert.equal(result.ok, true);
});

test("cloud ai response validator rejects too many suggestions", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-too-many-suggestions.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_suggestions");
});

test("cloud ai response validator rejects invalid filter id", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-invalid-filter-response.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unknown_filter_id");
});

test("cloud ai response validator rejects unsafe text", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-unsafe-response.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unsafe_response");
});

test("unsafe provider output maps to fallback response", async () => {
  const provider = {
    async analyzePhotoAdvisor() {
      return fixture("cloud-ai-unsafe-response.json");
    }
  };

  const result = await handlePhotoAdvisorRequest(validRequest(), { provider });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.source, "fallback");
  assert.equal(result.body.error.code, "unsafe_response");
  assert.equal(JSON.stringify(result.body).includes("你樣衰"), false);
});

test("provider key is not required and mock provider is the only active path", () => {
  assert.deepEqual(providerBoundaryStatus(), {
    mode: "mock-only",
    executableProviders: ["mock", "qweInternal", "disabled"],
    providerCallsEnabled: false,
    providerKeyRequired: false
  });
  assert.deepEqual(executableProviderKinds(), ["mock", "qweInternal", "disabled"]);
});

test("qwe provider is not used when mode is mock", () => {
  const kind = resolveProviderKind({
    config: {
      providerMode: "mock",
      allowInternalCloudAI: true,
      qweAPIKey: "test-key",
      qweBaseURL: "https://qweapi.com",
      qwePhotoAdvisorModel: "gemini-3.1-flash-image-preview"
    },
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(kind, "mock");
});

test("qwe provider requires internal allow flag", () => {
  const kind = resolveProviderKind({
    config: {
      providerMode: "qweInternal",
      allowInternalCloudAI: false,
      qweAPIKey: "test-key",
      qweBaseURL: "https://qweapi.com",
      qwePhotoAdvisorModel: "gemini-3.1-flash-image-preview",
      qweChatCompletionsPath: "/v1/chat/completions"
    },
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(kind, "mock");
});

test("qwe provider requires api key", async () => {
  const result = await handlePhotoAdvisorRequest(validRequest(), {
    config: {
      providerMode: "qweInternal",
      allowInternalCloudAI: true,
      qweAPIKey: "",
      qweBaseURL: "https://qweapi.com",
      qwePhotoAdvisorModel: "gemini-3.1-flash-image-preview",
      qweChatCompletionsPath: "/v1/chat/completions"
    },
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "internal_cloud_disabled");
});

test("qwe provider requires configured base url", async () => {
  const result = await handlePhotoAdvisorRequest(validRequest(), {
    config: {
      providerMode: "qweInternal",
      allowInternalCloudAI: true,
      qweAPIKey: "test-key",
      qweBaseURL: "",
      qwePhotoAdvisorModel: "gemini-3.1-flash-image-preview",
      qweChatCompletionsPath: "/v1/chat/completions"
    },
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "internal_cloud_disabled");
});

test("qwe config trims and allows only the supported v1 https base url", () => {
  assert.equal(cloudAIConfig({
    CLOUD_AI_PROVIDER_MODE: "qweInternal",
    QWE_BASE_URL: " https://qweapi.com/ ",
    QWE_PHOTO_ADVISOR_MODEL: " gemini-3.1-flash-image-preview "
  }).qweBaseURL, "https://qweapi.com");
  assert.equal(cloudAIConfig({ QWE_BASE_URL: "https://qweapi.com" }).qweBaseURL, "https://qweapi.com");
  assert.equal(cloudAIConfig({ QWE_BASE_URL: "https://qweapi.com/v1" }).qweBaseURL, "");
  assert.equal(cloudAIConfig({ QWE_BASE_URL: "http://qweapi.com/v1" }).qweBaseURL, "");
  assert.equal(cloudAIConfig({ QWE_BASE_URL: "https://qweapi.com?token=bad" }).qweBaseURL, "");
  assert.equal(cloudAIConfig({ QWE_BASE_URL: "https://evil.example" }).qweBaseURL, "");
});

test("qwe endpoint path config is trimmed and defaults safely", () => {
  assert.equal(cloudAIConfig({}).qweChatCompletionsPath, "/v1/chat/completions");
  assert.equal(cloudAIConfig({ QWE_CHAT_COMPLETIONS_PATH: " /v1/chat/completions " }).qweChatCompletionsPath, "/v1/chat/completions");
  assert.equal(cloudAIConfig({ QWE_CHAT_COMPLETIONS_PATH: "chat/completions" }).qweChatCompletionsPath, "");
  assert.equal(cloudAIConfig({ QWE_CHAT_COMPLETIONS_PATH: "/v1/chat/completions?token=bad" }).qweChatCompletionsPath, "");
});

test("qwe auth header config defaults to authorization bearer", () => {
  assert.equal(cloudAIConfig({}).qweAuthHeader, "authorization_bearer");
  assert.equal(cloudAIConfig({ QWE_AUTH_HEADER: "x_api_key" }).qweAuthHeader, "authorization_bearer");
  assert.equal(cloudAIConfig({ QWE_AUTH_HEADER: "unknown" }).qweAuthHeader, "authorization_bearer");
});

test("qwe provider uses gemini-3.1-flash-image-preview model and builds prompt without logging image", async () => {
  let capturedRequest;
  const provider = new QwePhotoAdvisorProvider({
    apiKey: "test-key",
    baseURL: "https://qweapi.com",
    model: "gemini-3.1-flash-image-preview",
    path: "/v1/chat/completions",
    fetchImpl: async (_url, request) => {
      capturedRequest = JSON.parse(request.body);
      return okJSON(await fixture("qwe-gateway-valid.json"));
    }
  });

  const response = await provider.analyzePhotoAdvisor(providerInput());

  assert.equal(response.source, "cloud");
  assert.equal(provider.endpointURL(), "https://qweapi.com/v1/chat/completions");
  assert.equal(capturedRequest.model, "gemini-3.1-flash-image-preview");
  assert.equal(capturedRequest.messages[1].content[0].text.includes("Do not identify people"), true);
  assert.equal(capturedRequest.messages[1].content[1].image_url.url, "data:image/jpeg;base64,/9j/");
});

test("qwe provider uses authorization bearer auth header", () => {
  const bearerProvider = new QwePhotoAdvisorProvider({ apiKey: "test-key", authHeader: "authorization_bearer" });

  assert.deepEqual(Object.keys(bearerProvider.authHeaders()), ["authorization"]);
});

test("qwe provider parses openai compatible choices", () => {
  const parsed = parseQweCloudAIResponse({
    choices: [
      {
        message: {
          content: "{\"ok\":true}"
        }
      }
    ]
  });

  assert.equal(parsed.ok, true);
});

test("qwe provider rejects non json content", () => {
  assert.throws(() => parseQweCloudAIResponse({
    choices: [
      {
        message: {
          content: "not json"
        }
      }
    ]
  }), /could not be parsed/);
});

test("qwe endpoint probe script exists and does not contain secret logging", async () => {
  const scriptURL = new URL("./../scripts/probe-qwe-endpoint.mjs", import.meta.url);
  assert.equal(existsSync(scriptURL), true);
  const source = await readFile(scriptURL, "utf8");
  assert.equal(source.includes("QWE_API_KEY="), false);
  assert.equal(source.includes("request.body"), false);
  assert.equal(source.includes("dataBase64"), false);
});

test("qwe internal path returns validated structured response when enabled", async () => {
  const provider = new QwePhotoAdvisorProvider({
    apiKey: "test-key",
    baseURL: "https://qweapi.com",
    model: "gemini-3.1-flash-image-preview",
    fetchImpl: async () => okJSON(await fixture("qwe-gateway-valid.json"))
  });

  const result = await handlePhotoAdvisorRequest(validRequest(), {
    provider,
    config: {
      providerMode: "qweInternal",
      allowInternalCloudAI: true,
      qweAPIKey: "test-key",
      qweBaseURL: "https://qweapi.com",
      qwePhotoAdvisorModel: "gemini-3.1-flash-image-preview",
      qweChatCompletionsPath: "/v1/chat/completions",
      qweAuthHeader: "authorization_bearer"
    },
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.source, "cloud");
  assert.equal(result.body.mode, "post_capture");
});

test("provider invalid json falls back after retry", async () => {
  let calls = 0;
  const provider = {
    async analyzePhotoAdvisor() {
      calls += 1;
      const error = new Error("Bad JSON");
      error.code = "provider_invalid_json";
      throw error;
    }
  };

  const result = await handlePhotoAdvisorRequest(validRequest(), {
    provider,
    config: enabledQweAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(calls, 2);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "provider_invalid_json");
});

test("provider invalid schema falls back after retry", async () => {
  let calls = 0;
  const provider = {
    async analyzePhotoAdvisor() {
      calls += 1;
      return fixture("cloud-ai-too-many-suggestions.json");
    }
  };

  const result = await handlePhotoAdvisorRequest(validRequest(), {
    provider,
    config: enabledQweAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(calls, 2);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "provider_invalid_schema");
});

test("unsafe provider output returns unsafe fallback without retry", async () => {
  let calls = 0;
  const provider = {
    async analyzePhotoAdvisor() {
      calls += 1;
      return fixture("cloud-ai-unsafe-response.json");
    }
  };

  const result = await handlePhotoAdvisorRequest(validRequest(), {
    provider,
    config: enabledQweAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(calls, 1);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "unsafe_response");
});

test("missing consent does not call provider", async () => {
  let calls = 0;
  const provider = {
    async analyzePhotoAdvisor() {
      calls += 1;
      return fixture("cloud-ai-valid-response.json");
    }
  };

  const request = validRequest();
  request.consent.imageUploadAccepted = false;
  await handlePhotoAdvisorRequest(request, { provider, config: enabledQweAPIConfig() });

  assert.equal(calls, 0);
});

test("image too large does not call provider", async () => {
  let calls = 0;
  const provider = {
    async analyzePhotoAdvisor() {
      calls += 1;
      return fixture("cloud-ai-valid-response.json");
    }
  };

  const request = validRequest();
  request.image.width = 4096;
  request.image.height = 4096;
  const result = await handlePhotoAdvisorRequest(request, { provider, config: enabledQweAPIConfig() });

  assert.equal(calls, 0);
  assert.equal(result.status, 400);
  assert.equal(result.body.error.code, "invalid_request");
});

test("photo advisor prompt bans sensitive inference and arbitrary filters", () => {
  const prompt = buildPhotoAdvisorPrompt({ locale: "en" });

  assert.equal(prompt.includes("Do not identify people"), true);
  assert.equal(prompt.includes("Do not infer age, gender, race"), true);
  assert.equal(prompt.includes("Avoid words related to attractiveness"), true);
  assert.equal(prompt.includes("visible non-sensitive photo qualities"), true);
  assert.equal(prompt.includes("Recommended filter IDs must be chosen only from this whitelist"), true);
  assert.equal(prompt.includes("Avoid poetic copy, overclaiming, and generic filler"), true);
  assert.equal(prompt.includes("Retake advice must be soft"), true);
  assert.equal(prompt.includes("instant_dream"), true);
});

test("safe logging metadata does not include payload fields", () => {
  const metadata = safeErrorMetadata({
    endpoint: "/v1/ai/photo-advisor",
    mode: "post_capture",
    schemaVersion: "1.0",
    status: 400,
    latencyMs: 12,
    image: { width: 1024, height: 768 },
    errorCode: "invalid_request",
    providerKind: "mock"
  });

  assert.deepEqual(Object.keys(metadata).sort(), [
    "endpoint",
    "errorCode",
    "imageSizeBucket",
    "latencyMs",
    "mode",
    "providerKind",
    "schemaVersion",
    "status"
  ].sort());
  assert.equal("dataBase64" in metadata, false);
  assert.equal("requestBody" in metadata, false);
});

test("photo advisor qa report redacts sensitive fields", () => {
  const report = summarizePhotoAdvisorQA({
    provider: "qweapi",
    model: "gemini-3.1-flash-image-preview",
    baseURL: "https://qweapi.com",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "warm-rooftop-01",
        locale: "zh-Hant",
        source: "cloud",
        latencyMs: 5600,
        schemaValid: true,
        safetyValid: true,
        fallbackCode: null,
        recommendedFilterIds: ["instant_dream"],
        captionLength: 18,
        summaryLength: 44,
        suggestionCount: 2,
        confidence: "high",
        needsManualLanguageReview: true,
        dataBase64: "/9j/",
        requestBody: { image: "redact" },
        apiKey: "redact"
      })
    ]
  });

  assert.equal(report.totalCases, 1);
  assert.equal(report.cloudSuccess, 1);
  assert.equal(report.cloudSuccessCount, 1);
  assert.equal(report.fallback, 0);
  assert.equal(report.fallbackCount, 0);
  assert.equal(report.languageCasesNeedingManualReview, 1);
  assert.equal(report.cases[0].latencyBucket, "5s_to_10s");
  assert.equal(JSON.stringify(report).includes("/9j/"), false);
  assert.equal(JSON.stringify(report).includes("requestBody"), false);
  assert.equal(JSON.stringify(report).includes("apiKey"), false);
  assert.equal(assertQAReportRedacted(report).ok, true);
});

test("photo advisor qa report summarizes fallback metrics", () => {
  const report = summarizePhotoAdvisorQA({
    provider: "qweapi",
    model: "gemini-3.1-flash-image-preview",
    baseURL: "https://qweapi.com",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "valid",
        locale: "en",
        source: "cloud",
        latencyMs: 5000,
        schemaValid: true,
        safetyValid: true,
        recommendedFilterIds: ["instant_dream"]
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "fallback",
        locale: "zh-Hant",
        source: "fallback",
        latencyMs: 1200,
        schemaValid: true,
        safetyValid: true,
        fallbackCode: "provider_timeout"
      })
    ]
  });

  assert.equal(report.totalCases, 2);
  assert.equal(report.cloudSuccess, 1);
  assert.equal(report.cloudSuccessCount, 1);
  assert.equal(report.fallback, 1);
  assert.equal(report.fallbackCount, 1);
  assert.equal(report.providerTimeouts, 1);
  assert.equal(report.timeoutCount, 1);
  assert.equal(report.unsafeResponseCount, 0);
  assert.deepEqual(report.fallbackByCode, { provider_timeout: 1 });
  assert.deepEqual(report.fallbackByCategory, { timeout: 1 });
  assert.equal(report.averageLatencyMs, 3100);
  assert.equal(report.p50LatencyMs, 1200);
  assert.equal(report.p90LatencyMs, 5000);
  assert.equal(report.p95LatencyMs, 5000);
  assert.equal(report.maxLatencyMs, 5000);
  assert.equal(report.latencyAssessment.providerTimeoutMs, 30000);
  assert.equal(report.latencyAssessment.productionRollout, "blocked");
  assert.equal(report.cases[1].fallbackCategory, "timeout");
});

async function fixture(name) {
  const json = await readFile(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
  return JSON.parse(json);
}

function okJSON(body) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    }
  };
}

function providerInput() {
  return {
    locale: "en",
    selectedFilterId: "instant_dream",
    image: {
      contentType: "image/jpeg",
      width: 1024,
      height: 768,
      metadataStripped: true,
      dataBase64: "/9j/"
    }
  };
}

function enabledQweAPIConfig() {
  return {
    providerMode: "qweInternal",
    allowInternalCloudAI: true,
    qweAPIKey: "test-key",
    qweBaseURL: "https://qweapi.com",
    qwePhotoAdvisorModel: "gemini-3.1-flash-image-preview",
    qweChatCompletionsPath: "/v1/chat/completions",
    qweAuthHeader: "authorization_bearer"
  };
}

function validRequest() {
  return {
    schemaVersion: "1.0",
    feature: "photo_advisor",
    mode: "post_capture",
    locale: "zh-Hant-HK",
    selectedFilterId: "instant_dream",
    consent: {
      imageUploadAccepted: true,
      consentVersion: "2026-06-12.phase17a.v1"
    },
    image: {
      contentType: "image/jpeg",
      width: 1024,
      height: 768,
      metadataStripped: true,
      dataBase64: "/9j/"
    },
    client: {
      platform: "iOS",
      appVersion: "debug"
    }
  };
}
