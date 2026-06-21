import { ProviderKind } from "../providers/ProviderRegistry.mjs";

const DEFAULT_QWE_CHAT_COMPLETIONS_PATH = "/v1/chat/completions";
const DEFAULT_QWE_AUTH_HEADER = "authorization_bearer";
const SUPPORTED_QWE_BASE_URL = "https://qweapi.com";
const DEFAULT_XIAOYI_CHAT_COMPLETIONS_PATH = "/v1/chat/completions";
const SUPPORTED_XIAOYI_BASE_URL = "https://xiaoyiapi.xyz";
const DEFAULT_XIAOYI_MODEL = "deepseek-v4-flash";

export function cloudAIConfig(env = process.env) {
  return {
    providerMode: normalizeProviderMode(env.CLOUD_AI_PROVIDER_MODE),
    allowInternalCloudAI: env.ALLOW_INTERNAL_CLOUD_AI === "true",
    internalDebugToken: env.INTERNAL_CLOUD_AI_DEBUG_TOKEN ?? "",
    qweAPIKey: env.QWE_API_KEY ?? "",
    qweBaseURL: normalizeQweAPIBaseURL(env.QWE_BASE_URL),
    qwePhotoAdvisorModel: normalizeRequiredString(env.QWE_PHOTO_ADVISOR_MODEL),
    qweChatCompletionsPath: normalizeQweAPIPath(env.QWE_CHAT_COMPLETIONS_PATH),
    qweAuthHeader: normalizeQweAPIAuthHeader(env.QWE_AUTH_HEADER),
    xiaoyiAPIKey: env.XIAOYI_API_KEY ?? "",
    xiaoyiBaseURL: normalizeXiaoyiRelayBaseURL(env.XIAOYI_BASE_URL),
    xiaoyiChatCompletionsPath: normalizeXiaoyiRelayPath(env.XIAOYI_CHAT_COMPLETIONS_PATH),
    xiaoyiPhotoAdvisorModel: normalizeXiaoyiModel(env.XIAOYI_PHOTO_ADVISOR_MODEL),
    xiaoyiFilterLabModel: normalizeXiaoyiModel(env.XIAOYI_FILTER_LAB_MODEL)
  };
}

function normalizeProviderMode(value) {
  switch (value) {
  case ProviderKind.qweInternal:
    return ProviderKind.qweInternal;
  case ProviderKind.xiaoyiRelayInternal:
    return ProviderKind.xiaoyiRelayInternal;
  case ProviderKind.disabled:
    return ProviderKind.disabled;
  case ProviderKind.mock:
  case undefined:
  case "":
    return ProviderKind.mock;
  default:
    return ProviderKind.mock;
  }
}

function normalizeQweAPIBaseURL(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return "";
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

  if (normalized !== SUPPORTED_QWE_BASE_URL) {
    return "";
  }

  return SUPPORTED_QWE_BASE_URL;
}

function normalizeRequiredString(value) {
  const trimmed = String(value ?? "").trim();
  return trimmed.length > 0 ? trimmed : "";
}

function normalizeQweAPIPath(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return DEFAULT_QWE_CHAT_COMPLETIONS_PATH;
  }

  if (!trimmed.startsWith("/") || trimmed.includes("?") || trimmed.includes("#")) {
    return "";
  }

  try {
    const url = new URL(trimmed, "https://qweapi.com");
    return url.pathname === trimmed ? trimmed : "";
  } catch {
    return "";
  }
}

function normalizeQweAPIAuthHeader(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return DEFAULT_QWE_AUTH_HEADER;
  }

  return trimmed === DEFAULT_QWE_AUTH_HEADER ? trimmed : DEFAULT_QWE_AUTH_HEADER;
}

function normalizeXiaoyiRelayBaseURL(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return "";
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

  return normalized === SUPPORTED_XIAOYI_BASE_URL ? SUPPORTED_XIAOYI_BASE_URL : "";
}

function normalizeXiaoyiRelayPath(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return DEFAULT_XIAOYI_CHAT_COMPLETIONS_PATH;
  }

  if (!trimmed.startsWith("/") || trimmed.includes("?") || trimmed.includes("#")) {
    return "";
  }

  try {
    const url = new URL(trimmed, SUPPORTED_XIAOYI_BASE_URL);
    return url.pathname === DEFAULT_XIAOYI_CHAT_COMPLETIONS_PATH ? DEFAULT_XIAOYI_CHAT_COMPLETIONS_PATH : "";
  } catch {
    return "";
  }
}

function normalizeXiaoyiModel(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed.length === 0) {
    return DEFAULT_XIAOYI_MODEL;
  }
  return trimmed === DEFAULT_XIAOYI_MODEL ? DEFAULT_XIAOYI_MODEL : "";
}
