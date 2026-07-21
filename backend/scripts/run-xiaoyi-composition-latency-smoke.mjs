#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import {
  XIAOYI_LUNA_COMPOSITION_TIMEOUT_MS,
  XiaoyiLunaRelayProvider
} from "../src/providers/XiaoyiLunaRelayProvider.mjs";
import { validateCompositionPlanGrounding } from "../src/providers/compositionPlannerContract.mjs";
import { loadDotEnvFileIfPresent } from "../src/server.mjs";

const args = new Map(
  process.argv.slice(2).map((item) => {
    const separator = item.indexOf("=");
    return separator > 0
      ? [item.slice(0, separator), item.slice(separator + 1)]
      : [item, "true"];
  })
);

const report = await runLatencySmoke();
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exitCode = report.ok ? 0 : 1;

async function runLatencySmoke() {
  if (args.get("--run-provider") !== "true" || !args.get("--image")) {
    return safeFailure("explicit_provider_run_and_jpeg_required");
  }

  const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  loadDotEnvFileIfPresent(path.join(backendRoot, ".env.local"));
  loadDotEnvFileIfPresent(path.join(backendRoot, ".env"));
  const config = cloudAIConfig();
  if (!config.xiaoyiAPIKey) {
    return safeFailure("provider_not_configured");
  }

  let imageData;
  try {
    imageData = readFileSync(path.resolve(args.get("--image")));
  } catch {
    return safeFailure("image_unreadable");
  }
  const dimensions = jpegDimensions(imageData);
  if (!dimensions) {
    return safeFailure("jpeg_required");
  }

  const focusHint = {
    x: boundedPermille(args.get("--focus-x")),
    y: boundedPermille(args.get("--focus-y"))
  };
  const provider = new XiaoyiLunaRelayProvider({
    apiKey: config.xiaoyiAPIKey,
    totalTimeoutMs: XIAOYI_LUNA_COMPOSITION_TIMEOUT_MS
  });
  const requestBody = provider.compositionPlannerRequestBody({
    locale: args.get("--locale") ?? "zh-Hant-HK",
    localContext: {
      subjectKind: args.get("--subject-kind") ?? "salient_object",
      subjectCount: args.get("--subject-count") ?? "single",
      lensBucket: args.get("--lens-bucket") ?? "standard",
      focusHint
    },
    image: {
      contentType: "image/jpeg",
      width: dimensions.width,
      height: dimensions.height,
      metadataStripped: true,
      dataBase64: imageData.toString("base64")
    }
  });
  requestBody.stream = true;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    XIAOYI_LUNA_COMPOSITION_TIMEOUT_MS
  );
  const startedAt = performance.now();

  try {
    const response = await fetch(provider.endpointURL(), {
      method: "POST",
      headers: {
        "authorization": `Bearer ${config.xiaoyiAPIKey}`,
        "content-type": "application/json",
        "accept": "text/event-stream"
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    const headersMs = elapsedMs(startedAt);
    if (!response.ok || !response.body) {
      return {
        ...safeFailure("provider_unavailable"),
        headersMs
      };
    }

    const streamResult = await firstValidJSONFromSSE(
      response.body,
      startedAt,
      focusHint
    );
    if (streamResult.ok) {
      controller.abort();
    }
    return {
      ...streamResult,
      headersMs,
      productionReady: false
    };
  } catch (error) {
    return safeFailure(error?.name === "AbortError" ? "provider_timeout" : "provider_unavailable");
  } finally {
    clearTimeout(timeout);
  }
}

async function firstValidJSONFromSSE(body, startedAt, focusHint) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let eventBuffer = "";
  let responseText = "";
  let firstContentMs = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    eventBuffer = `${eventBuffer}${decoder.decode(value, { stream: true })}`
      .replaceAll("\r\n", "\n");

    let separatorIndex;
    while ((separatorIndex = eventBuffer.indexOf("\n\n")) >= 0) {
      const event = eventBuffer.slice(0, separatorIndex);
      eventBuffer = eventBuffer.slice(separatorIndex + 2);
      for (const line of event.split("\n")) {
        if (!line.startsWith("data:")) {
          continue;
        }
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") {
          continue;
        }
        let eventPayload;
        try {
          eventPayload = JSON.parse(data);
        } catch {
          continue;
        }
        const delta = eventPayload?.choices?.[0]?.delta?.content;
        if (typeof delta !== "string" || delta.length === 0) {
          continue;
        }
        firstContentMs ??= elapsedMs(startedAt);
        responseText += delta;
        const candidate = parseCompleteJSON(responseText);
        if (!candidate) {
          continue;
        }
        const validation = validateCompositionPlanGrounding(candidate, focusHint);
        if (!validation.ok) {
          return {
            ok: false,
            errorCode: "provider_invalid_schema",
            firstContentMs,
            validJSONMs: elapsedMs(startedAt)
          };
        }
        return {
          ok: true,
          errorCode: null,
          firstContentMs,
          validJSONMs: elapsedMs(startedAt)
        };
      }
    }
  }

  return {
    ok: false,
    errorCode: "provider_incomplete",
    firstContentMs,
    validJSONMs: null
  };
}

function parseCompleteJSON(text) {
  try {
    return JSON.parse(
      text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
    );
  } catch {
    return null;
  }
}

function elapsedMs(startedAt) {
  return Math.round(performance.now() - startedAt);
}

function safeFailure(errorCode) {
  return {
    ok: false,
    errorCode,
    firstContentMs: null,
    validJSONMs: null,
    productionReady: false
  };
}

function boundedPermille(value) {
  const parsed = Number.parseInt(value ?? "500", 10);
  return Number.isFinite(parsed) ? Math.min(1000, Math.max(0, parsed)) : 500;
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }
  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf
  ]);
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (startOfFrameMarkers.has(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7)
      };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) {
      return null;
    }
    offset += 2 + segmentLength;
  }
  return null;
}
