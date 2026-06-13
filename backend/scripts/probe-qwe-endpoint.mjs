#!/usr/bin/env node
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { QwePhotoAdvisorProvider, parseQweCloudAIResponse } from "../src/providers/QwePhotoAdvisorProvider.mjs";

const args = parseArgs(process.argv.slice(2));
const config = cloudAIConfig({
  ...process.env,
  QWE_CHAT_COMPLETIONS_PATH: args.path ?? process.env.QWE_CHAT_COMPLETIONS_PATH,
  QWE_AUTH_HEADER: args.authHeader ?? process.env.QWE_AUTH_HEADER
});

const started = Date.now();

if (!config.qweAPIKey || !config.qweBaseURL || !config.qwePhotoAdvisorModel || !config.qweChatCompletionsPath) {
  printResult({
    ok: false,
    status: null,
    errorCode: "missing_config",
    message: "QweAPI config is incomplete.",
    latencyMs: Date.now() - started
  });
  process.exit(1);
}

const provider = new QwePhotoAdvisorProvider({
  apiKey: config.qweAPIKey,
  baseURL: config.qweBaseURL,
  model: config.qwePhotoAdvisorModel,
  path: config.qweChatCompletionsPath,
  authHeader: config.qweAuthHeader
});

try {
  const response = await fetch(provider.endpointURL(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      ...provider.authHeaders()
    },
    body: JSON.stringify(textOnlyProbeRequest(config.qwePhotoAdvisorModel)),
    signal: AbortSignal.timeout(25000)
  });

  if (!response.ok) {
    printResult({
      ok: false,
      status: response.status,
      errorCode: `http_${response.status}`,
      message: "QweAPI text-only probe returned a non-success HTTP status.",
      latencyMs: Date.now() - started
    });
    process.exit(1);
  }

  const payload = await response.json();
  let parsed;
  try {
    parsed = parseQweCloudAIResponse(payload);
  } catch {
    parsed = null;
  }

  printResult({
    ok: Boolean(parsed?.ok),
    status: response.status,
    errorCode: parsed?.ok ? null : "invalid_probe_json",
    message: parsed?.ok ? "QweAPI text-only probe succeeded." : "QweAPI response did not contain the expected JSON.",
    latencyMs: Date.now() - started
  });

  process.exit(parsed?.ok ? 0 : 1);
} catch (error) {
  printResult({
    ok: false,
    status: null,
    errorCode: "network_error",
    message: error.name ?? "Network error",
    latencyMs: Date.now() - started
  });
  process.exit(1);
}

function textOnlyProbeRequest(model) {
  return {
    model,
    messages: [
      {
        role: "system",
        content: "Return JSON only."
      },
      {
        role: "user",
        content: "Return exactly this JSON: {\"ok\":true}"
      }
    ],
    temperature: 0
  };
}

function printResult({ ok, status, errorCode, message, latencyMs }) {
  console.log(JSON.stringify({
    ok,
    baseURL: config.qweBaseURL,
    path: config.qweChatCompletionsPath,
    authMode: config.qweAuthHeader,
    model: config.qwePhotoAdvisorModel,
    status,
    errorCode,
    message,
    latencyMs
  }, null, 2));
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--path") {
      result.path = argv[index + 1];
      index += 1;
    } else if (arg === "--auth-header") {
      result.authHeader = argv[index + 1];
      index += 1;
    }
  }
  return result;
}
