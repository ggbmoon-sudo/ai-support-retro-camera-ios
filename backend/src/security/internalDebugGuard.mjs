export function isInternalCloudAIAllowed({ headers = {}, config }) {
  if (!config?.allowInternalCloudAI) {
    return false;
  }

  const normalizedHeaders = normalizeHeaders(headers);
  if (config.internalDebugToken) {
    return normalizedHeaders["x-internal-cloud-ai-debug-token"] === config.internalDebugToken;
  }

  return normalizedHeaders["x-internal-debug-cloudai"] === "true";
}

function normalizeHeaders(headers) {
  const result = {};
  for (const [key, value] of Object.entries(headers ?? {})) {
    result[key.toLowerCase()] = Array.isArray(value) ? value[0] : String(value);
  }
  return result;
}
