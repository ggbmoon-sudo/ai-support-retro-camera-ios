import { redactedOperationalMetadata } from "../security/redaction.mjs";

export function safeLogEvent(event, metadata = {}) {
  const redacted = redactedOperationalMetadata(metadata);
  console.log(JSON.stringify({ event, ...redacted }));
}

export function safeErrorMetadata({ endpoint, mode, schemaVersion, status, latencyMs, image, errorCode, providerKind }) {
  return {
    ...redactedOperationalMetadata({ endpoint, mode, schemaVersion, status, latencyMs, image, errorCode, providerKind })
  };
}
