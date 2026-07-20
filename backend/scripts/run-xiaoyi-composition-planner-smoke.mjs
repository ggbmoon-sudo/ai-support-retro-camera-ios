#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { handleCompositionPlannerRequest } from "../src/routes/compositionPlanner.mjs";
import { loadDotEnvFileIfPresent } from "../src/server.mjs";

const args = new Map(
  process.argv.slice(2).map((item) => {
    const separator = item.indexOf("=");
    return separator > 0
      ? [item.slice(0, separator), item.slice(separator + 1)]
      : [item, "true"];
  })
);

const report = await runSmoke();
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exitCode = report.ok ? 0 : 1;

async function runSmoke() {
  if (args.get("--run-provider") !== "true" || !args.get("--image")) {
    return {
      ok: false,
      errorCode: "explicit_provider_run_and_jpeg_required",
      productionReady: false
    };
  }

  const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  loadDotEnvFileIfPresent(path.join(backendRoot, ".env.local"));
  loadDotEnvFileIfPresent(path.join(backendRoot, ".env"));

  let imageData;
  try {
    imageData = readFileSync(path.resolve(args.get("--image")));
  } catch {
    return { ok: false, errorCode: "image_unreadable", productionReady: false };
  }

  const dimensions = jpegDimensions(imageData);
  if (!dimensions) {
    return { ok: false, errorCode: "jpeg_required", productionReady: false };
  }

  const config = cloudAIConfig();
  const headers = config.internalDebugToken
    ? { "x-internal-cloud-ai-debug-token": config.internalDebugToken }
    : { "x-internal-debug-cloudai": "true" };
  const result = await handleCompositionPlannerRequest({
    schemaVersion: "1.0",
    feature: "composition_planner",
    mode: "one_shot_pre_capture",
    locale: args.get("--locale") ?? "zh-Hant-HK",
    consent: {
      imageUploadAccepted: true,
      consentVersion: "2026-07-20.phase24.v1"
    },
    localContext: {
      subjectKind: args.get("--subject-kind") ?? "salient_object",
      subjectCount: args.get("--subject-count") ?? "single",
      lensBucket: args.get("--lens-bucket") ?? "standard"
    },
    image: {
      contentType: "image/jpeg",
      width: dimensions.width,
      height: dimensions.height,
      metadataStripped: true,
      dataBase64: imageData.toString("base64")
    }
  }, { config, headers });

  return {
    ok: result.status === 200 && result.body?.source === "cloud" && Boolean(result.body?.plan),
    status: result.status,
    source: result.body?.source ?? "fallback",
    errorCode: result.body?.error?.code ?? null,
    plan: result.body?.plan ?? null,
    productionReady: false
  };
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
