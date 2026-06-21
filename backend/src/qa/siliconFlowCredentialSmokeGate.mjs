const ALLOWED_SURFACES = new Set(["photo_analysis", "generated_filter"]);
const DEFAULT_TIMEOUT_MS = 10000;
export const SILICONFLOW_API_BASE_URL = "https://api.siliconflow.com";
export const SILICONFLOW_CHAT_COMPLETIONS_PATH = "/v1/chat/completions";
export const SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL = "deepseek-ai/DeepSeek-V4-Flash";
export const SILICONFLOW_ENDPOINT_BUCKET = "siliconflow_chat_completions";

export function parseSiliconFlowCredentialSmokeArgs(args = []) {
  const options = {
    runProvider: false,
    dryRun: false,
    surface: null,
    model: null,
    timeoutMs: DEFAULT_TIMEOUT_MS
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
    if (arg === "--surface") {
      options.surface = normalizeSurface(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--surface=")) {
      options.surface = normalizeSurface(arg.slice("--surface=".length));
      continue;
    }
    if (arg === "--model") {
      options.model = normalizeSmokeModel(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--model=")) {
      options.model = normalizeSmokeModel(arg.slice("--model=".length));
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = normalizeTimeout(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--timeout-ms=")) {
      options.timeoutMs = normalizeTimeout(arg.slice("--timeout-ms=".length));
    }
  }

  return options;
}

export async function runSiliconFlowCredentialSmokeGate({
  args = [],
  env = process.env,
  fetchImpl = globalThis.fetch,
  now = () => Date.now()
} = {}) {
  const options = parseSiliconFlowCredentialSmokeArgs(args);
  const config = siliconFlowCredentialSmokeConfig(env, options);
  const configured = siliconFlowConfigured(config);
  const base = baseReport({ options, config, configured });

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
      imageUploadAttempted: false,
      modelCallsMade: false,
      instructions: {
        photoAnalysis: "npm run qa:siliconflow:credential-smoke -- --run-provider --surface=photo-analysis",
        filterLab: "npm run qa:siliconflow:credential-smoke -- --run-provider --surface=filter-lab",
        both: "npm run qa:siliconflow:credential-smoke -- --run-provider --surface=both"
      },
      productionReady: false
    };
  }

  const preflightBlockers = runPreflightBlockers({ options, configured, fetchImpl });
  if (preflightBlockers.length > 0) {
    return blockedReport(base, preflightBlockers);
  }

  const surfaces = surfacesForOption(options.surface);
  const results = [];
  for (const surface of surfaces) {
    results.push(await runTextOnlyCredentialCall({
      surface,
      config,
      fetchImpl,
      now,
      timeoutMs: options.timeoutMs
    }));
  }

  const acceptedCount = results.filter((result) => result.accepted).length;
  const rejectedCount = results.length - acceptedCount;

  return {
    ...base,
    ok: rejectedCount === 0,
    runMode: "provider_text_only_credential_smoke",
    hardBlockers: rejectedCount === 0 ? [] : ["provider_credential_smoke_failed"],
    blockers: rejectedCount === 0 ? [] : unique(results.map((result) => result.errorBucket).filter(Boolean)),
    plannedCalls: surfaces.length,
    actualCalls: results.length,
    acceptedCount,
    rejectedCount,
    results,
    networkCallsMade: results.length > 0,
    imageUploadAttempted: false,
    modelCallsMade: results.length,
    rawKeyPrinted: false,
    rawProviderUrlPrinted: false,
    rawPromptPrinted: false,
    rawOutputPrinted: false,
    rawPayloadPrinted: false,
    rawImagePrinted: false,
    providerRuntimeExecutionAdded: false,
    iOSRuntimeChanged: false,
    uploadPayloadChanged: false,
    productionReady: false
  };
}

export function siliconFlowCredentialSmokeConfig(env = process.env, options = {}) {
  return {
    apiKey: env.SILICONFLOW_API_KEY ?? "",
    baseURL: normalizeSiliconFlowBaseURL(env.SILICONFLOW_BASE_URL),
    path: normalizeSiliconFlowPath(env.SILICONFLOW_CHAT_COMPLETIONS_PATH),
    model: normalizeSmokeModel(
      options.model ||
      env.SILICONFLOW_MODEL ||
      env.SILICONFLOW_PHOTO_ADVISOR_MODEL ||
      env.SILICONFLOW_FILTER_LAB_MODEL
    )
  };
}

export function buildSiliconFlowTextOnlyCredentialRequest(surface, model = SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL) {
  const normalizedSurface = ALLOWED_SURFACES.has(surface) ? surface : "photo_analysis";
  const normalizedModel = normalizeSmokeModel(model);
  return {
    model: normalizedModel,
    stream: false,
    temperature: 0,
    max_tokens: 80,
    messages: [
      {
        role: "system",
        content: "Return a compact JSON object only. Do not include markdown, prose, chain-of-thought, provider debug text, or secrets."
      },
      {
        role: "user",
        content: `Return JSON exactly shaped like {"ok":true,"surface":"${normalizedSurface}","provider":"siliconflow","model":"${normalizedModel}"}.`
      }
    ]
  };
}

function baseReport({ options, config, configured }) {
  return {
    schemaVersion: "siliconflow_credential_smoke.v1",
    providerClass: "siliconflow",
    providerMode: "backend_internal_debug_only",
    endpointBucket: SILICONFLOW_ENDPOINT_BUCKET,
    apiStyle: "openai_compatible_chat_completions",
    modelNameBucket: modelNameBucket(config.model),
    selectedSurface: options.surface ?? "not_selected",
    productSurfaces: ["photo_analysis", "generated_filter"],
    requestShape: "text_only_chat_completion",
    requiresExplicitRunProviderFlag: true,
    providerConfigured: configured.ok,
    apiKeyLoaded: options.runProvider && configured.ok,
    keyPresenceBucket: config.apiKey ? "present_in_env_not_printed" : "missing",
    baseUrlBucket: config.baseURL ? "api_siliconflow_com" : "missing",
    pathBucket: config.path === SILICONFLOW_CHAT_COMPLETIONS_PATH ? "v1_chat_completions" : "missing",
    usesServerSideOnlyCredential: true,
    rawKeyPrinted: false,
    rawProviderUrlPrinted: false,
    rawPromptPrinted: false,
    rawOutputPrinted: false,
    rawPayloadPrinted: false,
    rawImagePrinted: false,
    providerRuntimeExecutionAdded: false,
    iOSRuntimeChanged: false,
    uploadPayloadChanged: false,
    productionReady: false
  };
}

function siliconFlowConfigured(config) {
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
  if (config.model !== SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL) {
    blockers.push("provider_model_unavailable");
  }

  return {
    ok: blockers.length === 0,
    blockers: unique(blockers)
  };
}

function runPreflightBlockers({ options, configured, fetchImpl }) {
  const blockers = [];
  if (!configured.ok) {
    blockers.push(...configured.blockers);
  }
  if (!options.surface) {
    blockers.push("surface_required_for_provider_smoke");
  }
  if (!fetchImpl) {
    blockers.push("fetch_unavailable");
  }
  return unique(blockers);
}

function blockedReport(base, hardBlockers) {
  return {
    ...base,
    ok: false,
    runMode: "provider_text_only_credential_smoke_blocked",
    hardBlockers,
    blockers: hardBlockers,
    plannedCalls: 0,
    actualCalls: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    networkCallsMade: false,
    imageUploadAttempted: false,
    modelCallsMade: false,
    productionReady: false
  };
}

async function runTextOnlyCredentialCall({ surface, config, fetchImpl, now, timeoutMs }) {
  const started = now();
  try {
    const response = await fetchWithTimeout(fetchImpl, `${config.baseURL}${config.path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(buildSiliconFlowTextOnlyCredentialRequest(surface, config.model))
    }, timeoutMs);

    const latencyMs = Math.max(0, now() - started);
    if (!response.ok) {
      return surfaceResult({
        surface,
        accepted: false,
        latencyMs,
        httpStatusBucket: httpStatusBucket(response.status),
        errorBucket: mapHTTPStatusToBucket(response.status),
        model: config.model
      });
    }

    const payload = await response.json();
    const text = extractOpenAICompatibleContentText(payload);
    const parsed = parseJSONObject(text);
    const accepted = parsed.ok &&
      parsed.value?.ok === true &&
      parsed.value?.surface === surface &&
      parsed.value?.provider === "siliconflow";

    return surfaceResult({
      surface,
      accepted,
      latencyMs,
      httpStatusBucket: "2xx",
      errorBucket: accepted ? null : parsed.bucket,
      model: config.model
    });
  } catch (error) {
    return surfaceResult({
      surface,
      accepted: false,
      latencyMs: Math.max(0, now() - started),
      httpStatusBucket: "not_available",
      errorBucket: mapThrownErrorToBucket(error),
      model: config.model
    });
  }
}

function surfaceResult({
  surface,
  accepted,
  latencyMs,
  httpStatusBucket,
  errorBucket,
  model = SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL
}) {
  return {
    surface,
    accepted,
    requestShape: "text_only_chat_completion",
    modelNameBucket: modelNameBucket(model),
    endpointBucket: SILICONFLOW_ENDPOINT_BUCKET,
    latencyBucket: latencyBucket(latencyMs),
    httpStatusBucket,
    errorBucket,
    networkCallMade: true,
    imageUploadAttempted: false,
    rawPromptPrinted: false,
    rawPayloadPrinted: false,
    rawOutputPrinted: false,
    rawImagePrinted: false,
    rawKeyPrinted: false,
    productionReady: false
  };
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

function extractOpenAICompatibleContentText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content.map((part) => typeof part === "string" ? part : part?.text ?? "").join("\n").trim();
  }
  return String(content ?? "").trim();
}

function parseJSONObject(text) {
  try {
    const parsed = JSON.parse(stripCodeFence(text));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? { ok: true, value: parsed, bucket: null }
      : { ok: false, value: null, bucket: "provider_schema_invalid" };
  } catch {
    return { ok: false, value: null, bucket: "provider_json_parse_failed" };
  }
}

function stripCodeFence(text) {
  return String(text ?? "")
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}

function normalizeSurface(value) {
  switch (String(value ?? "").trim()) {
  case "photo-analysis":
  case "photo_advisor":
  case "photo_analysis":
    return "photo_analysis";
  case "filter-lab":
  case "generated-filter":
  case "generated_filter":
    return "generated_filter";
  case "both":
  case "all":
    return "both";
  default:
    return null;
  }
}

function normalizeSiliconFlowBaseURL(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return SILICONFLOW_API_BASE_URL;
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return "";
  }

  if (url.protocol !== "https:" || url.search || url.hash) {
    return "";
  }

  const pathname = url.pathname.replace(/\/+$/, "");
  const normalized = `${url.origin}${pathname}`;

  if ([
    SILICONFLOW_API_BASE_URL,
    `${SILICONFLOW_API_BASE_URL}/v1`,
    `${SILICONFLOW_API_BASE_URL}/v1/chat/completions`
  ].includes(normalized)) {
    return SILICONFLOW_API_BASE_URL;
  }

  return "";
}

function normalizeSiliconFlowPath(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return SILICONFLOW_CHAT_COMPLETIONS_PATH;
  }

  if (!trimmed.startsWith("/") || trimmed.includes("?") || trimmed.includes("#")) {
    return "";
  }

  try {
    const url = new URL(trimmed, SILICONFLOW_API_BASE_URL);
    return url.pathname === SILICONFLOW_CHAT_COMPLETIONS_PATH ? SILICONFLOW_CHAT_COMPLETIONS_PATH : "";
  } catch {
    return "";
  }
}

function normalizeSmokeModel(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL;
  }
  return trimmed === SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL ? SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL : "";
}

function surfacesForOption(surface) {
  if (surface === "both") {
    return ["photo_analysis", "generated_filter"];
  }
  return ALLOWED_SURFACES.has(surface) ? [surface] : [];
}

function normalizeTimeout(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(parsed)) {
    return DEFAULT_TIMEOUT_MS;
  }
  return Math.min(Math.max(parsed, 1000), 30000);
}

function modelNameBucket(model) {
  return model === SILICONFLOW_DEEPSEEK_V4_FLASH_MODEL ? "deepseek_ai_deepseek_v4_flash" : "missing";
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

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}
