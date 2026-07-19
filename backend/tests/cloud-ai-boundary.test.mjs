import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { healthResponse } from "../src/routes/health.mjs";
import { isDirectServerRun, loadDotEnvFileIfPresent } from "../src/server.mjs";
import { handlePhotoAdvisorRequest } from "../src/routes/photoAdvisor.mjs";
import { handleFilterLabRequest, resolveFilterLabProviderKind } from "../src/routes/filterLab.mjs";
import { executableProviderKinds, resolveProvider } from "../src/providers/ProviderRegistry.mjs";
import { providerBoundaryStatus } from "../src/providers/providerTypes.mjs";
import { QwePhotoAdvisorProvider, parseQweCloudAIResponse } from "../src/providers/QwePhotoAdvisorProvider.mjs";
import {
  XiaoyiLunaRelayProvider,
  parseXiaoyiLunaGeneratedFilterRecipeResponse
} from "../src/providers/XiaoyiLunaRelayProvider.mjs";
import {
  SiliconFlowCloudAIProvider,
  parseSiliconFlowGeneratedFilterRecipeResponse
} from "../src/providers/SiliconFlowCloudAIProvider.mjs";
import { validSyntheticPhotoAdvisorCandidate } from "../src/providers/siliconflowPhotoAdvisorProviderContract.mjs";
import { generatedFilterRecipeExampleCandidate } from "../src/providers/generatedFilterRecipeContract.mjs";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { buildPhotoAdvisorPrompt } from "../src/prompts/photoAdvisorPrompt.mjs";
import { resolveProviderKind } from "../src/routes/photoAdvisor.mjs";
import { validateCloudAIResponse } from "../src/validators/validateCloudAIResponse.mjs";
import { validatePhotoAdvisorRequest } from "../src/validators/validatePhotoAdvisorRequest.mjs";
import { fallbackCloudAIResponse } from "../src/responses/fallbackResponse.mjs";
import { safeErrorMetadata } from "../src/logging/safeLog.mjs";
import { resetDevRateLimitForTests } from "../src/security/rateLimit.mjs";
import {
  assertQAReportRedacted,
  sanitizePhotoAdvisorQACase,
  summarizePhotoAdvisorQA
} from "../src/qa/photoAdvisorQAReport.mjs";
import { evaluatePhotoAdvisorQAGate } from "../src/qa/photoAdvisorQAGate.mjs";
import { validateSafeTextOutput } from "../src/security/safetyTextGuard.mjs";

test("health returns safe provider readiness status", () => {
  assert.deepEqual(healthResponse({}), {
    ok: true,
    service: "cloud-ai-boundary",
    mode: "mock",
    providerMode: "mock",
    internalCloudAIAllowed: false,
    photoAdvisorReady: false,
    filterLabReady: false,
    productionReady: false
  });

  assert.deepEqual(healthResponse({
    CLOUD_AI_PROVIDER_MODE: "siliconflowInternal",
    ALLOW_INTERNAL_CLOUD_AI: "true",
    SILICONFLOW_API_KEY: "test-key",
    SILICONFLOW_BASE_URL: "https://api.siliconflow.com/v1/chat/completions",
    SILICONFLOW_CHAT_COMPLETIONS_PATH: "/v1/chat/completions",
    SILICONFLOW_PHOTO_ADVISOR_MODEL: "Qwen/Qwen3-VL-32B-Instruct",
    SILICONFLOW_FILTER_LAB_MODEL: "Qwen/Qwen3-VL-32B-Instruct"
  }), {
    ok: true,
    service: "cloud-ai-boundary",
    mode: "siliconflowInternal",
    providerMode: "siliconflowInternal",
    internalCloudAIAllowed: true,
    photoAdvisorReady: true,
    filterLabReady: true,
    productionReady: false
  });
});

test("server direct-run detection accepts native argv paths", () => {
  const serverURL = new URL("../src/server.mjs", import.meta.url);
  const serverPath = fileURLToPath(serverURL);

  assert.equal(isDirectServerRun(serverURL.href, serverPath), true);
  assert.equal(isDirectServerRun(serverURL.href, path.join(path.dirname(serverPath), "other.mjs")), false);
  assert.equal(isDirectServerRun(serverURL.href, ""), false);
});

test("server local env loader reads ignored env files without overriding process env", async () => {
  const tmp = await mkdtemp(path.join(tmpdir(), "cloud-ai-env-"));
  try {
    const envFile = path.join(tmp, ".env.local");
    await writeFile(envFile, [
      "# local debug env",
      "CLOUD_AI_PROVIDER_MODE=siliconflowInternal",
      "ALLOW_INTERNAL_CLOUD_AI=true",
      "QUOTED_VALUE='hello world'",
      "EXISTING_VALUE=from_file"
    ].join("\n"));

    const env = { EXISTING_VALUE: "from_process" };
    const result = loadDotEnvFileIfPresent(envFile, env);

    assert.deepEqual(result, { loaded: true, setCount: 3 });
    assert.equal(env.CLOUD_AI_PROVIDER_MODE, "siliconflowInternal");
    assert.equal(env.ALLOW_INTERNAL_CLOUD_AI, "true");
    assert.equal(env.QUOTED_VALUE, "hello world");
    assert.equal(env.EXISTING_VALUE, "from_process");
  } finally {
    await rm(tmp, { force: true, recursive: true });
  }
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

test("cloud ai response validator rejects overlong filter reasons", async () => {
  const response = await fixture("cloud-ai-valid-response.json");
  response.recommendedFilters[0].reason = "A".repeat(141);

  const result = validateCloudAIResponse(response);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_filter_reason");
});

test("cloud ai response validator rejects unsafe text", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-unsafe-response.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unsafe_response");
  assert.equal(result.error.unsafeCategory, "banned_term_guard");
});

test("cloud ai response validator rejects score and harsh fix-it language", async () => {
  const scoredResponse = await fixture("cloud-ai-valid-response.json");
  scoredResponse.summary = "Photo score: 8/10.";
  const scoredResult = validateCloudAIResponse(scoredResponse);

  assert.equal(scoredResult.ok, false);
  assert.equal(scoredResult.error.code, "unsafe_response");
  assert.equal(scoredResult.error.unsafeCategory, "unknown_safety_guard");
  assert.equal(JSON.stringify(scoredResult).includes("8/10"), false);

  const harshResponse = await fixture("cloud-ai-valid-response.json");
  harshResponse.suggestions[0].text = "Wrong exposure. Retake this.";
  const harshResult = validateCloudAIResponse(harshResponse);

  assert.equal(harshResult.ok, false);
  assert.equal(harshResult.error.code, "unsafe_response");
  assert.equal(harshResult.error.unsafeCategory, "unknown_safety_guard");
  assert.equal(JSON.stringify(harshResult).includes("Wrong exposure"), false);
});

test("cloud ai response validator rejects provider and chain-of-thought leakage", async () => {
  const providerLeakResponse = await fixture("cloud-ai-valid-response.json");
  providerLeakResponse.summary = "Provider debug field: chain-of-thought omitted.";
  const providerLeakResult = validateCloudAIResponse(providerLeakResponse);

  assert.equal(providerLeakResult.ok, false);
  assert.equal(providerLeakResult.error.code, "unsafe_response");
  assert.equal(providerLeakResult.error.unsafeCategory, "unknown_safety_guard");
  assert.equal(JSON.stringify(providerLeakResult).includes("chain-of-thought"), false);
});

test("provider contract regression fixtures accept valid app-voice responses", async () => {
  const cases = await providerContractCases();
  const base = await fixture("cloud-ai-valid-response.json");

  for (const item of cases.validResponses) {
    const response = responseFromRegressionCase(base, item);
    const result = validateCloudAIResponse(response);

    assert.equal(result.ok, true, item.id);
    assert.equal(response.source, "cloud", item.id);
    assert.equal(response.summary.length <= 280, true, item.id);
    assert.equal(response.recommendedFilters.length <= 3, true, item.id);
  }
});

test("provider contract regression fixtures reject invalid provider content", async () => {
  const cases = await providerContractCases();

  for (const item of cases.parserRejections) {
    assert.throws(() => parseQweCloudAIResponse({
      choices: [
        {
          message: {
            content: item.content
          }
        }
      ]
    }), (error) => {
      assert.equal(error.code, item.expectedErrorCode, item.id);
      assert.equal(String(error.message).includes(item.content), false, item.id);
      return true;
    }, item.id);
  }
});

test("provider contract regression fixtures reject unsafe or invalid schema output", async () => {
  const cases = await providerContractCases();
  const base = await fixture("cloud-ai-valid-response.json");

  for (const item of cases.validatorRejections) {
    const response = responseFromRegressionCase(base, item);
    const result = validateCloudAIResponse(response);

    assert.equal(result.ok, false, item.id);
    assert.equal(result.error.code, item.expectedErrorCode, item.id);
    if (item.expectedUnsafeCategory) {
      assert.equal(result.error.unsafeCategory, item.expectedUnsafeCategory, item.id);
    }
    if (item.rawLeak) {
      assert.equal(JSON.stringify(result).includes(item.rawLeak), false, item.id);
    }
  }
});

test("provider contract rejected fixtures map to safe fallback without raw provider text", async () => {
  const cases = await providerContractCases();
  const base = await fixture("cloud-ai-valid-response.json");

  for (const item of cases.validatorRejections) {
    const provider = {
      async analyzePhotoAdvisor() {
        return responseFromRegressionCase(base, item);
      }
    };

    const result = await handlePhotoAdvisorRequest(validRequest(), {
      provider,
      config: enabledQweAPIConfig(),
      headers: { "x-internal-debug-cloudai": "true" }
    });

    const expectedFallbackCode = item.expectedErrorCode === "unsafe_response"
      ? "unsafe_response"
      : "provider_invalid_schema";

    assert.equal(result.status, 200, item.id);
    assert.equal(result.body.mode, "unavailable", item.id);
    assert.equal(result.body.source, "fallback", item.id);
    assert.equal(result.body.error.code, expectedFallbackCode, item.id);
    assert.equal(result.body.error.message.includes("Cloud analysis is unavailable"), true, item.id);
    assert.equal(validateCloudAIResponse(result.body).ok, true, item.id);
    if (item.rawLeak) {
      assert.equal(JSON.stringify(result.body).includes(item.rawLeak), false, item.id);
      assert.equal(JSON.stringify(result.metadata ?? {}).includes(item.rawLeak), false, item.id);
    }
  }
});

test("provider failure fixtures map to structured fallback parity responses", async () => {
  const cases = await providerContractCases();

  for (const item of cases.providerFailures) {
    let calls = 0;
    const provider = {
      async analyzePhotoAdvisor() {
        calls += 1;
        const error = new Error("Synthetic provider failure");
        error.code = item.providerErrorCode;
        throw error;
      }
    };

    const result = await handlePhotoAdvisorRequest(validRequest(), {
      provider,
      config: enabledQweAPIConfig(),
      headers: { "x-internal-debug-cloudai": "true" }
    });

    assert.equal(result.status, 200, item.id);
    assert.equal(result.body.mode, "unavailable", item.id);
    assert.equal(result.body.source, "fallback", item.id);
    assert.equal(result.body.error.code, item.expectedFallbackCode, item.id);
    assert.equal(result.body.error.message.includes("Synthetic provider failure"), false, item.id);
    assert.equal(validateCloudAIResponse(result.body).ok, true, item.id);
    assert.equal(calls >= 1, true, item.id);
  }
});

test("fallback response contract stays app-safe and result-card compatible", () => {
  const response = fallbackCloudAIResponse({
    locale: "en",
    code: "provider_invalid_schema",
    message: "Cloud analysis is unavailable right now. Showing local advice instead."
  });

  const serialized = JSON.stringify(response);
  const validation = validateCloudAIResponse(response);

  assert.equal(validation.ok, true);
  assert.equal(response.mode, "unavailable");
  assert.equal(response.source, "fallback");
  assert.equal(response.summary, "");
  assert.equal(response.suggestions.length, 0);
  assert.equal(response.recommendedFilters.length, 0);
  assert.equal(response.error.recoverable, true);
  assert.equal(serialized.includes("QweAPI"), false);
  assert.equal(serialized.includes("stack trace"), false);
  assert.equal(serialized.includes("raw provider"), false);
});

test("cloud ai response validator labels appearance and sensitive unsafe text without raw output", async () => {
  const appearanceResponse = await fixture("cloud-ai-valid-response.json");
  appearanceResponse.summary = "The face looks attractive in this frame.";
  const appearanceResult = validateCloudAIResponse(appearanceResponse);

  assert.equal(appearanceResult.ok, false);
  assert.equal(appearanceResult.error.code, "unsafe_response");
  assert.equal(appearanceResult.error.unsafeCategory, "appearance_or_identity_guard");
  assert.equal(JSON.stringify(appearanceResult).includes("attractive"), false);

  const sensitiveResponse = await fixture("cloud-ai-valid-response.json");
  sensitiveResponse.summary = "The age appears young in this frame.";
  const sensitiveResult = validateCloudAIResponse(sensitiveResponse);

  assert.equal(sensitiveResult.ok, false);
  assert.equal(sensitiveResult.error.code, "unsafe_response");
  assert.equal(sensitiveResult.error.unsafeCategory, "sensitive_attribute_guard");
  assert.equal(JSON.stringify(sensitiveResult).includes("young"), false);
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
  assert.equal(result.metadata.unsafeCategory, "banned_term_guard");
  assert.equal(JSON.stringify(result.body).includes("你樣衰"), false);
});

test("provider key is not required and mock provider is the only active path", () => {
  assert.deepEqual(providerBoundaryStatus(), {
    mode: "mock-only",
    executableProviders: ["mock", "qweInternal", "xiaoyiRelayInternal", "xiaoyiLunaInternal", "siliconflowInternal", "disabled"],
    providerCallsEnabled: false,
    providerKeyRequired: false
  });
  assert.deepEqual(executableProviderKinds(), ["mock", "qweInternal", "xiaoyiRelayInternal", "xiaoyiLunaInternal", "siliconflowInternal", "disabled"]);
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

test("siliconflow internal path returns validated photo advisor response when enabled", async () => {
  const provider = new SiliconFlowCloudAIProvider({
    apiKey: "test-key",
    baseURL: "https://api.siliconflow.com",
    photoAdvisorModel: "Qwen/Qwen3-VL-32B-Instruct",
    fetchImpl: async () => okJSON(openAICompatibleJSON(validSyntheticPhotoAdvisorCandidate()))
  });

  const result = await handlePhotoAdvisorRequest(validRequest(), {
    provider,
    config: enabledSiliconFlowAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.source, "cloud");
  assert.equal(result.body.mode, "post_capture");
  assert.equal(result.metadata.providerKind, "siliconflowInternal");
});

test("xiaoyi config trims and allows only the supported relay url, path, and Luna model", () => {
  const config = cloudAIConfig({
    CLOUD_AI_PROVIDER_MODE: "xiaoyiLunaInternal",
    XIAOYI_BASE_URL: " https://xiaoyiapi.xyz/ ",
    XIAOYI_CHAT_COMPLETIONS_PATH: " /v1/chat/completions ",
    XIAOYI_PHOTO_ADVISOR_MODEL: " gpt-5.6-luna ",
    XIAOYI_FILTER_LAB_MODEL: " gpt-5.6-luna "
  });

  assert.equal(config.providerMode, "xiaoyiLunaInternal");
  assert.equal(config.xiaoyiBaseURL, "https://xiaoyiapi.xyz");
  assert.equal(config.xiaoyiChatCompletionsPath, "/v1/chat/completions");
  assert.equal(config.xiaoyiPhotoAdvisorModel, "gpt-5.6-luna");
  assert.equal(config.xiaoyiFilterLabModel, "gpt-5.6-luna");
  const sharedModelConfig = cloudAIConfig({ XIAOYI_MODEL: "gpt-5.6-luna" });
  assert.equal(sharedModelConfig.xiaoyiPhotoAdvisorModel, "gpt-5.6-luna");
  assert.equal(sharedModelConfig.xiaoyiFilterLabModel, "gpt-5.6-luna");
  assert.equal(cloudAIConfig({}).xiaoyiBaseURL, "https://xiaoyiapi.xyz");
  assert.equal(cloudAIConfig({ XIAOYI_BASE_URL: "https://xiaoyiapi.xyz/v1" }).xiaoyiBaseURL, "");
  assert.equal(cloudAIConfig({ XIAOYI_BASE_URL: "http://xiaoyiapi.xyz" }).xiaoyiBaseURL, "");
  assert.equal(cloudAIConfig({ XIAOYI_BASE_URL: "https://evil.example" }).xiaoyiBaseURL, "");
  assert.equal(cloudAIConfig({ XIAOYI_CHAT_COMPLETIONS_PATH: "/v1/chat/completions?token=bad" }).xiaoyiChatCompletionsPath, "");
  assert.equal(cloudAIConfig({ XIAOYI_PHOTO_ADVISOR_MODEL: "other-model" }).xiaoyiPhotoAdvisorModel, "");
});

test("xiaoyi provider uses gpt-5.6-luna for photo advisor request shape", async () => {
  let capturedURL;
  let capturedHeaders;
  let capturedRequest;
  const provider = new XiaoyiLunaRelayProvider({
    apiKey: "test-key",
    baseURL: "https://xiaoyiapi.xyz",
    photoAdvisorModel: "gpt-5.6-luna",
    path: "/v1/chat/completions",
    fetchImpl: async (url, request) => {
      capturedURL = url;
      capturedHeaders = request.headers;
      capturedRequest = JSON.parse(request.body);
      return okJSON(await fixture("qwe-gateway-valid.json"));
    }
  });

  const response = await provider.analyzePhotoAdvisor(providerInput());

  assert.equal(response.source, "cloud");
  assert.equal(capturedURL, "https://xiaoyiapi.xyz/v1/chat/completions");
  assert.equal(capturedHeaders.authorization, "Bearer test-key");
  assert.equal(capturedHeaders.accept, "application/json");
  assert.equal(capturedRequest.model, "gpt-5.6-luna");
  assert.equal(capturedRequest.stream, false);
  assert.equal(capturedRequest.max_tokens, 2000);
  assert.equal("top_p" in capturedRequest, false);
  assert.deepEqual(capturedRequest.response_format, { type: "json_object" });
  assert.equal(capturedRequest.messages[1].content[0].text.includes("Do not identify people"), true);
  assert.equal(capturedRequest.messages[1].content[1].image_url.url, "data:image/jpeg;base64,/9j/");
  assert.equal(capturedRequest.messages[1].content[1].image_url.detail, "low");
});

test("xiaoyi provider uses gpt-5.6-luna for generated Filter Lab recipes", async () => {
  let capturedRequest;
  const recipe = generatedFilterRecipeExampleCandidate();
  const provider = new XiaoyiLunaRelayProvider({
    apiKey: "test-key",
    baseURL: "https://xiaoyiapi.xyz",
    filterLabModel: "gpt-5.6-luna",
    path: "/v1/chat/completions",
    fetchImpl: async (_url, request) => {
      capturedRequest = JSON.parse(request.body);
      return okJSON(openAICompatibleJSON(recipe));
    }
  });

  const response = await provider.generateFilterRecipe(providerInput());

  assert.deepEqual(response, recipe);
  assert.equal(capturedRequest.model, "gpt-5.6-luna");
  assert.equal(capturedRequest.stream, false);
  assert.equal(capturedRequest.max_tokens, 2000);
  assert.deepEqual(capturedRequest.response_format, { type: "json_object" });
  assert.equal(capturedRequest.messages[0].content.includes("color-science analyst"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("Allowed recipeVersion: 2.0"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("JSON string \"2.0\", never the number 2.0"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("exact JSON string \"ai_reference_grade\""), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("recommendedUseKeys must be a JSON array"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("warningsKeys must be the JSON array"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("lumaCurve, redCurve, greenCurve, and blueCurve"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("basisLUTWeights must be one JSON object"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("Do not add, rename, omit, or change the type"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("exclude white settings panels"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("Fade, shadowLift, and negative contrast compound"), true);
  assert.equal(capturedRequest.messages[1].content[0].text.includes("Renderer calibration anchors"), true);
  assert.equal(capturedRequest.messages[1].content[1].image_url.url, "data:image/jpeg;base64,/9j/");
  assert.equal(capturedRequest.messages[1].content[1].image_url.detail, "high");
});

test("xiaoyi generated filter parser rejects invalid recipe schema without raw output", () => {
  assert.throws(() => parseXiaoyiLunaGeneratedFilterRecipeResponse(openAICompatibleJSON({
    ...generatedFilterRecipeExampleCandidate(),
    source: "provider_debug"
  })), (error) => {
    assert.equal(error.code, "provider_invalid_schema");
    assert.equal(error.validationCode, "unsupported_enum");
    assert.equal(error.validationFieldBucket, "source");
    assert.equal(String(error.message).includes("provider_debug"), false);
    return true;
  });
});

test("xiaoyi runtime registry resolves the fresh Luna adapter", () => {
  const provider = resolveProvider("xiaoyiLunaInternal", enabledXiaoyiAPIConfig());
  assert.equal(provider instanceof XiaoyiLunaRelayProvider, true);
  assert.equal(provider.endpointURL(), "https://xiaoyiapi.xyz/v1/chat/completions");
});

test("siliconflow config trims supported base url variants, path, and vision models", () => {
  const config = cloudAIConfig({
    CLOUD_AI_PROVIDER_MODE: "siliconflowInternal",
    SILICONFLOW_BASE_URL: " https://api.siliconflow.com/v1/chat/completions ",
    SILICONFLOW_CHAT_COMPLETIONS_PATH: " /v1/chat/completions ",
    SILICONFLOW_PHOTO_ADVISOR_MODEL: " Qwen/Qwen3-VL-32B-Instruct ",
    SILICONFLOW_FILTER_LAB_MODEL: " Qwen/Qwen3-VL-32B-Instruct "
  });

  assert.equal(config.providerMode, "siliconflowInternal");
  assert.equal(config.siliconFlowBaseURL, "https://api.siliconflow.com");
  assert.equal(config.siliconFlowChatCompletionsPath, "/v1/chat/completions");
  assert.equal(config.siliconFlowPhotoAdvisorModel, "Qwen/Qwen3-VL-32B-Instruct");
  assert.equal(config.siliconFlowFilterLabModel, "Qwen/Qwen3-VL-32B-Instruct");
  assert.equal(cloudAIConfig({}).siliconFlowBaseURL, "https://api.siliconflow.com");
  assert.equal(cloudAIConfig({ SILICONFLOW_BASE_URL: "https://api.siliconflow.com" }).siliconFlowBaseURL, "https://api.siliconflow.com");
  assert.equal(cloudAIConfig({ SILICONFLOW_BASE_URL: "https://api.siliconflow.com/v1" }).siliconFlowBaseURL, "https://api.siliconflow.com");
  assert.equal(cloudAIConfig({ SILICONFLOW_BASE_URL: "http://api.siliconflow.com" }).siliconFlowBaseURL, "");
  assert.equal(cloudAIConfig({ SILICONFLOW_BASE_URL: "https://api.siliconflow.com?token=bad" }).siliconFlowBaseURL, "");
  assert.equal(cloudAIConfig({ SILICONFLOW_BASE_URL: "https://evil.example" }).siliconFlowBaseURL, "");
  assert.equal(cloudAIConfig({ SILICONFLOW_CHAT_COMPLETIONS_PATH: "/v1/chat/completions?token=bad" }).siliconFlowChatCompletionsPath, "");
  assert.equal(cloudAIConfig({ SILICONFLOW_PHOTO_ADVISOR_MODEL: "deepseek-ai/DeepSeek-V4-Flash" }).siliconFlowPhotoAdvisorModel, "");
});

test("siliconflow provider builds image-first photo advisor request and maps semantic output", async () => {
  let capturedURL;
  let capturedHeaders;
  let capturedRequest;
  const provider = new SiliconFlowCloudAIProvider({
    apiKey: "test-key",
    baseURL: "https://api.siliconflow.com",
    photoAdvisorModel: "Qwen/Qwen3-VL-32B-Instruct",
    path: "/v1/chat/completions",
    fetchImpl: async (url, request) => {
      capturedURL = url;
      capturedHeaders = request.headers;
      capturedRequest = JSON.parse(request.body);
      return okJSON(openAICompatibleJSON(validSyntheticPhotoAdvisorCandidate()));
    }
  });

  const response = await provider.analyzePhotoAdvisor(providerInput());

  assert.equal(response.source, "cloud");
  assert.equal(response.recommendedFilters[0].filterId, "soft_warm_400");
  assert.equal(validateCloudAIResponse(response).ok, true);
  assert.equal(capturedURL, "https://api.siliconflow.com/v1/chat/completions");
  assert.equal(capturedHeaders.authorization, "Bearer test-key");
  assert.equal(capturedRequest.model, "Qwen/Qwen3-VL-32B-Instruct");
  assert.equal(capturedRequest.stream, false);
  assert.equal(capturedRequest.temperature, 0.1);
  assert.equal(capturedRequest.top_p, 0.8);
  assert.equal(capturedRequest.max_tokens, 192);
  assert.equal(capturedRequest.messages[1].content[0].image_url.url, "data:image/jpeg;base64,/9j/");
  assert.equal(capturedRequest.messages[1].content[0].image_url.detail, "low");
  assert.equal(capturedRequest.messages[1].content[1].text.includes("filterFamilyCandidate"), true);
});

test("siliconflow provider builds image-first Filter Lab recipe request", async () => {
  let capturedURL;
  let capturedHeaders;
  let capturedRequest;
  const recipe = generatedFilterRecipeExampleCandidate();
  const provider = new SiliconFlowCloudAIProvider({
    apiKey: "test-key",
    baseURL: "https://api.siliconflow.com",
    filterLabModel: "Qwen/Qwen3-VL-32B-Instruct",
    path: "/v1/chat/completions",
    fetchImpl: async (url, request) => {
      capturedURL = url;
      capturedHeaders = request.headers;
      capturedRequest = JSON.parse(request.body);
      return okJSON(openAICompatibleJSON(recipe));
    }
  });

  const response = await provider.generateFilterRecipe(providerInput());

  assert.deepEqual(response, recipe);
  assert.equal(capturedURL, "https://api.siliconflow.com/v1/chat/completions");
  assert.equal(capturedHeaders.authorization, "Bearer test-key");
  assert.equal(capturedRequest.model, "Qwen/Qwen3-VL-32B-Instruct");
  assert.equal(capturedRequest.stream, false);
  assert.equal(capturedRequest.max_tokens, 1400);
  assert.equal("top_p" in capturedRequest, false);
  assert.equal(capturedRequest.response_format.type, "json_schema");
  assert.equal(capturedRequest.response_format.json_schema.name, "filter_lab_recipe");
  assert.equal(capturedRequest.response_format.json_schema.schema.additionalProperties, false);
  assert.equal(capturedRequest.response_format.json_schema.schema.properties.parameters.additionalProperties, false);
  assert.equal(capturedRequest.response_format.json_schema.schema.properties.colorTransform.additionalProperties, false);
  assert.equal(capturedRequest.response_format.json_schema.schema.properties.film.additionalProperties, false);
  assert.equal(capturedRequest.messages[0].content.includes("color-science analyst"), true);
  assert.equal(capturedRequest.messages[1].content[0].image_url.url, "data:image/jpeg;base64,/9j/");
  assert.equal(capturedRequest.messages[1].content[0].image_url.detail, "high");
  assert.equal(capturedRequest.messages[1].content[1].text.includes("Allowed recipeVersion: 2.0"), true);
  assert.equal(capturedRequest.messages[1].content[1].text.includes("final rendered photo pixels"), true);
  assert.equal(capturedRequest.messages[1].content[1].text.includes("NEVER map them proportionally or directly"), true);
  assert.equal(capturedRequest.messages[1].content[1].text.includes("Renderer calibration anchors"), true);
  assert.equal(capturedRequest.messages[1].content[1].text.includes("Do not substitute a preferred preset recipe"), true);
  assert.equal(capturedRequest.messages[1].content[1].text.includes("return this safe contract object"), false);
});

test("siliconflow generated filter parser rejects invalid recipe schema without raw output", () => {
  assert.throws(() => parseSiliconFlowGeneratedFilterRecipeResponse(openAICompatibleJSON({
    ...generatedFilterRecipeExampleCandidate(),
    source: "provider_debug"
  })), (error) => {
    assert.equal(error.code, "provider_invalid_schema");
    assert.equal(String(error.message).includes("provider_debug"), false);
    return true;
  });
});

test("filter lab route requires xiaoyi internal debug approval", async () => {
  resetDevRateLimitForTests();
  let calls = 0;
  const provider = {
    async generateFilterRecipe() {
      calls += 1;
      return generatedFilterRecipeExampleCandidate();
    }
  };

  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider,
    config: {
      ...enabledXiaoyiAPIConfig(),
      allowInternalCloudAI: false
    },
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(calls, 0);
  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "internal_cloud_disabled");
});

test("filter lab route returns validated generated recipe when xiaoyi is enabled", async () => {
  resetDevRateLimitForTests();
  const provider = {
    async generateFilterRecipe() {
      return generatedFilterRecipeExampleCandidate();
    }
  };

  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider,
    config: enabledXiaoyiAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "filter_generation");
  assert.equal(result.body.source, "cloud");
  assert.equal(result.body.generatedFilter.source, "cloud");
  assert.equal(result.body.generatedFilter.recipeVersion, "2.0");
  assert.equal(result.body.generatedFilter.colorTransform.lumaCurve.length, 5);
  assert.equal(Object.keys(result.body.generatedFilter.colorTransform.basisLUTWeights).length, 8);
  assert.equal(Object.keys(result.body.generatedFilter.film).length, 7);
  assert.equal(result.body.safety.containsSensitiveInference, false);
  assert.equal(result.metadata.providerKind, "xiaoyiLunaInternal");
});

test("filter lab route returns validated generated recipe when siliconflow is enabled", async () => {
  resetDevRateLimitForTests();
  const provider = {
    async generateFilterRecipe() {
      return generatedFilterRecipeExampleCandidate();
    }
  };

  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider,
    config: enabledSiliconFlowAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "filter_generation");
  assert.equal(result.body.source, "cloud");
  assert.equal(result.body.generatedFilter.source, "cloud");
  assert.equal(result.body.generatedFilter.recipeVersion, "2.0");
  assert.equal(result.body.safety.containsSensitiveInference, false);
  assert.equal(result.metadata.providerKind, "siliconflowInternal");
});

test("filter lab route falls back after generated recipe schema retry failure", async () => {
  resetDevRateLimitForTests();
  let calls = 0;
  const provider = {
    async generateFilterRecipe() {
      calls += 1;
      return {
        ...generatedFilterRecipeExampleCandidate(),
        parameters: {
          exposure: 0
        }
      };
    }
  };

  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider,
    config: enabledXiaoyiAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  });

  assert.equal(calls, 2);
  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.generatedFilter, null);
  assert.equal(result.body.error.code, "provider_invalid_schema");
});

test("filter lab provider kind only enables approved internal providers with full backend config", () => {
  assert.equal(resolveFilterLabProviderKind({
    config: enabledQweAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  }), "disabled");
  assert.equal(resolveFilterLabProviderKind({
    config: enabledXiaoyiAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  }), "xiaoyiLunaInternal");
  assert.equal(resolveFilterLabProviderKind({
    config: {
      ...enabledXiaoyiAPIConfig(),
      xiaoyiAPIKey: ""
    },
    headers: { "x-internal-debug-cloudai": "true" }
  }), "disabled");
  assert.equal(resolveFilterLabProviderKind({
    config: enabledSiliconFlowAPIConfig(),
    headers: { "x-internal-debug-cloudai": "true" }
  }), "siliconflowInternal");
  assert.equal(resolveFilterLabProviderKind({
    config: {
      ...enabledSiliconFlowAPIConfig(),
      siliconFlowAPIKey: ""
    },
    headers: { "x-internal-debug-cloudai": "true" }
  }), "disabled");
});

test("provider invalid json falls back after retry", async () => {
  resetDevRateLimitForTests();
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
  resetDevRateLimitForTests();
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
  resetDevRateLimitForTests();
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
  assert.equal(prompt.includes("Analyze only non-sensitive photographic qualities"), true);
  assert.equal(prompt.includes("Subject placement means where the main visual subject sits in the frame"), true);
  assert.equal(prompt.includes("Do not describe or rate appearance, body, face, skin"), true);
  assert.equal(prompt.includes("If a photo includes people, discuss only framing"), true);
  assert.equal(prompt.includes("Avoid words related to attractiveness"), true);
  assert.equal(prompt.includes("Use neutral object/photo terms"), true);
  assert.equal(prompt.includes("Recommended filter IDs must be chosen only from this whitelist"), true);
  assert.equal(prompt.includes("Keep output short, practical, gentle, and retro-camera-aware"), true);
  assert.equal(prompt.includes("Observation -> Mood -> Retro intent -> Optional action"), true);
  assert.equal(prompt.includes("Do not use Score -> Problem -> Fix -> Retake language"), true);
  assert.equal(prompt.includes("Filter recommendations must include a short reason"), true);
  assert.equal(prompt.includes("Treat blur, tilt, low light, grain"), true);
  assert.equal(prompt.includes("Retake advice must be rare"), true);
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
    runMode: "provider",
    provider: "qweapi",
    providerConfigured: true,
    model: "gemini-3.1-flash-image-preview",
    baseURL: "https://qweapi.com",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "warm-rooftop-01",
        sampleType: "approved_real_sample",
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
  assert.equal(report.runMode, "provider");
  assert.equal(report.providerConfigured, true);
  assert.equal(report.providerNameBucket, "qweapi");
  assert.equal(report.modelNameBucket, "gemini-3.1-flash-image-preview");
  assert.equal(report.successCount, 1);
  assert.equal(report.cloudSuccess, 1);
  assert.equal(report.cloudSuccessCount, 1);
  assert.equal(report.fallback, 0);
  assert.equal(report.fallbackCount, 0);
  assert.equal(report.languageCasesNeedingManualReview, 1);
  assert.equal(report.cases[0].sampleType, "approved_real_sample");
  assert.equal(report.cases[0].latencyBucket, "5s_to_10s");
  assert.equal(report.cases[0].validationCategory, "none");
  assert.equal(report.payloadLoggingDisabled, true);
  assert.equal(report.rawImagePersisted, false);
  assert.equal(report.rawProviderResponsePersisted, false);
  assert.equal(report.rawPromptPersisted, false);
  assert.equal(report.reportContainsRawUserContent, false);
  assert.equal(report.productionReady, false);
  assert.equal(report.contractChecks.usesCloudAIResponseValidator, true);
  assert.equal(JSON.stringify(report).includes("/9j/"), false);
  assert.equal(JSON.stringify(report).includes("requestBody"), false);
  assert.equal(JSON.stringify(report).includes("apiKey"), false);
  assert.equal(assertQAReportRedacted(report).ok, true);
});

test("photo advisor qa report summarizes fallback metrics", () => {
  const report = summarizePhotoAdvisorQA({
    runMode: "provider",
    provider: "qweapi",
    providerConfigured: true,
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
        fallbackCode: "provider_timeout",
        validationCategory: "timeout"
      })
    ]
  });

  assert.equal(report.totalCases, 2);
  assert.equal(report.cloudSuccess, 1);
  assert.equal(report.cloudSuccessCount, 1);
  assert.equal(report.fallback, 1);
  assert.equal(report.fallbackCount, 1);
  assert.equal(report.validationFailureCount, 0);
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

test("photo advisor qa report counts B2 contract validation categories", () => {
  const report = summarizePhotoAdvisorQA({
    runMode: "synthetic",
    provider: "synthetic",
    providerConfigured: false,
    model: "provider-contract-regression-fixtures",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "invalid-json",
        locale: "en",
        source: "fallback",
        schemaValid: false,
        safetyValid: true,
        fallbackCode: "provider_invalid_json",
        validationCategory: "invalid_json"
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "unsafe-score",
        locale: "en",
        source: "fallback",
        schemaValid: false,
        safetyValid: false,
        fallbackCode: "unsafe_response",
        validationCategory: "unsafe_response",
        unsafeCategory: "unknown_safety_guard"
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "unsupported-filter",
        locale: "en",
        source: "fallback",
        schemaValid: false,
        safetyValid: true,
        fallbackCode: "provider_invalid_schema",
        validationCategory: "unsupported_filter",
        invalidFilterIds: 1
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "overlong-reason",
        locale: "en",
        source: "fallback",
        schemaValid: false,
        safetyValid: true,
        fallbackCode: "provider_invalid_schema",
        validationCategory: "overlong_text"
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "provider-unavailable",
        locale: "en",
        source: "fallback",
        schemaValid: true,
        safetyValid: true,
        fallbackCode: "provider_unavailable",
        validationCategory: "provider_error"
      })
    ]
  });

  assert.equal(report.runMode, "synthetic");
  assert.equal(report.providerConfigured, false);
  assert.equal(report.providerNameBucket, "synthetic");
  assert.equal(report.modelNameBucket, "provider-contract-regression-fixtures");
  assert.equal(report.successCount, 0);
  assert.equal(report.validationFailureCount, 4);
  assert.equal(report.invalidJsonCount, 1);
  assert.equal(report.unsafeResponseCount, 1);
  assert.equal(report.unsupportedFilterCount, 1);
  assert.equal(report.overlongTextCount, 1);
  assert.equal(report.providerErrorCount, 1);
  assert.equal(report.productionReady, false);
  assert.equal(report.cases.every((item) => item.validationCategory !== "unknown"), true);
  assert.equal(assertQAReportRedacted(report).ok, true);
});

test("photo advisor qa report records safe unsafe diagnostic labels only", () => {
  const report = summarizePhotoAdvisorQA({
    provider: "qweapi",
    model: "gemini-3.1-flash-image-preview",
    baseURL: "https://qweapi.com",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "unsafe-appearance",
        locale: "en",
        source: "fallback",
        latencyMs: 900,
        schemaValid: true,
        safetyValid: true,
        fallbackCode: "unsafe_response",
        unsafeCategory: "appearance_or_identity_guard",
        rawProviderText: "redact this"
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "unsafe-sensitive",
        locale: "zh-Hant",
        source: "fallback",
        latencyMs: 1200,
        schemaValid: true,
        safetyValid: true,
        fallbackCode: "unsafe_response",
        unsafeCategory: "sensitive_attribute_guard"
      })
    ]
  });

  assert.equal(report.unsafeResponseCount, 2);
  assert.deepEqual(report.unsafeByCategory, {
    appearance_or_identity_guard: 1,
    sensitive_attribute_guard: 1
  });
  assert.equal(report.cases[0].unsafeCategory, "appearance_or_identity_guard");
  assert.equal(JSON.stringify(report).includes("redact this"), false);
  assert.equal(assertQAReportRedacted(report).ok, true);
});

test("photo advisor qa report redaction rejects raw prompt and provider artifacts", () => {
  const redaction = assertQAReportRedacted({
    schemaVersion: "1.0",
    cases: [
      {
        caseId: "bad",
        rawProviderText: "should not be here"
      }
    ]
  });

  assert.equal(redaction.ok, false);
  assert.equal(redaction.error.code, "qa_report_not_redacted");
});

test("photo advisor provider qa runner supports synthetic contract mode without credentials", async () => {
  const scriptURL = new URL("./../scripts/run-photo-advisor-provider-qa.mjs", import.meta.url);
  assert.equal(existsSync(scriptURL), true);
  const source = await readFile(scriptURL, "utf8");

  assert.equal(source.includes("--synthetic-contract"), true);
  assert.equal(source.includes("provider-contract-regression-cases.json"), true);
  assert.equal(source.includes("QWE_API_KEY="), false);
  assert.equal(source.includes("rawProviderText:"), false);
  assert.equal(source.includes("console.log(request"), false);
});

test("photo advisor provider qa runner requires explicit real-provider opt in", async () => {
  const scriptURL = new URL("./../scripts/run-photo-advisor-provider-qa.mjs", import.meta.url);
  const source = await readFile(scriptURL, "utf8");

  assert.equal(source.includes("--check-safety-gate"), true);
  assert.equal(source.includes("--dry-run-gate"), true);
  assert.equal(source.includes("--run-provider"), true);
  assert.equal(source.includes("provider_run_requires_explicit_opt_in"), true);
  assert.equal(source.includes("productionReady: false"), true);
  assert.equal(source.includes("rawProviderResponsePersisted: false"), true);
  assert.equal(source.includes("rawPromptPersisted: false"), true);
  assert.equal(source.includes("console.log(request"), false);
  assert.equal(source.includes("console.log(response"), false);
});

test("photo advisor provider qa gate accepts sanitized synthetic contract report", () => {
  const report = summarizePhotoAdvisorQA({
    runMode: "synthetic",
    provider: "synthetic",
    providerConfigured: false,
    model: "provider-contract-regression-fixtures",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "valid-low-light",
        locale: "en",
        source: "cloud",
        schemaValid: true,
        safetyValid: true,
        recommendedFilterIds: ["instant_dream"]
      }),
      sanitizePhotoAdvisorQACase({
        caseId: "invalid-json",
        locale: "en",
        source: "fallback",
        schemaValid: false,
        safetyValid: true,
        fallbackCode: "provider_invalid_json",
        validationCategory: "invalid_json"
      })
    ]
  });

  const result = evaluatePhotoAdvisorQAGate(report);

  assert.equal(result.productionReady, false);
  assert.equal(result.eligibleForDebugInternalReview, true);
  assert.equal(result.statusCategories.includes("pass_for_synthetic_contract"), true);
  assert.equal(result.statusCategories.includes("not_production_ready"), true);
  assert.equal(result.hardBlockers.length, 0);
  assert.equal(result.reviewedMetrics.totalCases, 2);
  assert.equal(result.reviewedMetrics.invalidJsonCount, 1);
});

test("photo advisor provider qa gate flags unsafe report state without raw leakage", () => {
  const result = evaluatePhotoAdvisorQAGate({
    schemaVersion: "1.0",
    runMode: "provider",
    totalCases: 1,
    productionReady: true,
    payloadLoggingDisabled: false,
    rawImagePersisted: true,
    rawPromptPersisted: true,
    rawProviderResponsePersisted: true,
    reportContainsRawUserContent: true
  });

  assert.equal(result.productionReady, false);
  assert.equal(result.eligibleForDebugInternalReview, false);
  assert.equal(result.statusCategories.includes("blocked_for_artifact_leakage"), true);
  assert.equal(result.statusCategories.includes("not_production_ready"), true);
  assert.equal(result.hardBlockers.some((item) => item.code === "production_ready_true"), true);
  assert.equal(result.hardBlockers.some((item) => item.code === "raw_image_persisted"), true);
  assert.equal(JSON.stringify(result).includes("rawProviderText"), false);
});

test("photo advisor provider qa gate marks provider warnings for review", () => {
  const report = summarizePhotoAdvisorQA({
    runMode: "provider",
    provider: "qweapi",
    providerConfigured: true,
    model: "gemini-3.1-flash-image-preview",
    baseURL: "https://qweapi.com",
    cases: [
      sanitizePhotoAdvisorQACase({
        caseId: "timeout",
        sampleType: "approved_real_sample",
        locale: "zh-Hant",
        source: "fallback",
        latencyMs: 21_000,
        schemaValid: true,
        safetyValid: true,
        fallbackCode: "provider_timeout",
        validationCategory: "timeout",
        needsManualLanguageReview: true
      })
    ]
  });

  const result = evaluatePhotoAdvisorQAGate(report);

  assert.equal(result.productionReady, false);
  assert.equal(result.eligibleForDebugInternalReview, true);
  assert.equal(result.statusCategories.includes("needs_review"), true);
  assert.equal(result.warnings.some((item) => item.code === "timeout_count"), true);
  assert.equal(result.warnings.some((item) => item.code === "manual_language_review"), true);
  assert.equal(result.reviewedMetrics.timeoutCount, 1);
});

test("photo advisor provider qa gate helper script exists and avoids raw logging", async () => {
  const scriptURL = new URL("./../scripts/check-photo-advisor-provider-qa-gate.mjs", import.meta.url);
  assert.equal(existsSync(scriptURL), true);
  const source = await readFile(scriptURL, "utf8");

  assert.equal(source.includes("evaluatePhotoAdvisorQAGate"), true);
  assert.equal(source.includes("console.log(request"), false);
  assert.equal(source.includes("console.log(response"), false);
  assert.equal(source.includes("QWE_API_KEY="), false);
  assert.equal(source.includes("dataBase64"), false);
});

test("safety guard returns sanitized diagnostic labels", () => {
  const appearance = validateSafeTextOutput("The skin looks smooth and the face looks attractive.");
  const sensitive = validateSafeTextOutput("The gender appears detected.");

  assert.equal(appearance.ok, false);
  assert.equal(appearance.error.unsafeCategory, "appearance_or_identity_guard");
  assert.equal(JSON.stringify(appearance).includes("smooth"), false);
  assert.equal(sensitive.ok, false);
  assert.equal(sensitive.error.unsafeCategory, "sensitive_attribute_guard");
});

async function fixture(name) {
  const json = await readFile(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
  return JSON.parse(json);
}

async function providerContractCases() {
  return fixture("provider-contract-regression-cases.json");
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

function okJSON(body) {
  return {
    ok: true,
    status: 200,
    async json() {
      return body;
    }
  };
}

function openAICompatibleJSON(value) {
  return {
    choices: [
      {
        message: {
          content: JSON.stringify(value)
        }
      }
    ]
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

function enabledXiaoyiAPIConfig() {
  return {
    providerMode: "xiaoyiLunaInternal",
    allowInternalCloudAI: true,
    xiaoyiAPIKey: "test-key",
    xiaoyiBaseURL: "https://xiaoyiapi.xyz",
    xiaoyiChatCompletionsPath: "/v1/chat/completions",
    xiaoyiPhotoAdvisorModel: "gpt-5.6-luna",
    xiaoyiFilterLabModel: "gpt-5.6-luna"
  };
}

function enabledSiliconFlowAPIConfig() {
  return {
    providerMode: "siliconflowInternal",
    allowInternalCloudAI: true,
    siliconFlowAPIKey: "test-key",
    siliconFlowBaseURL: "https://api.siliconflow.com",
    siliconFlowChatCompletionsPath: "/v1/chat/completions",
    siliconFlowPhotoAdvisorModel: "Qwen/Qwen3-VL-32B-Instruct",
    siliconFlowFilterLabModel: "Qwen/Qwen3-VL-32B-Instruct"
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

function validFilterLabRequest() {
  return {
    schemaVersion: "1.0",
    feature: "filter_lab",
    mode: "reference_image",
    locale: "zh-Hant-HK",
    consent: {
      imageUploadAccepted: true,
      consentVersion: "2026-06-21.pt2.xiaoyi.v1"
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
