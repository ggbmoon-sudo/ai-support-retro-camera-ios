#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { evaluateOpenWeightVlmLocalSmokeFailureTaxonomy } from "../src/qa/openWeightVlmLocalSmokeFailureTaxonomy.mjs";

const options = parseArgs(process.argv.slice(2));
const aggregate = options.inputPath
  ? JSON.parse(await readFile(options.inputPath, "utf8"))
  : sampleAggregate(options.sample);
const report = evaluateOpenWeightVlmLocalSmokeFailureTaxonomy(aggregate, {
  realModelExpected: options.realModelExpected
});

console.log(JSON.stringify(report, null, 2));

if (options.inputPath && report.hardBlockers.length > 0) {
  process.exit(1);
}

process.exit(0);

function parseArgs(args) {
  const options = {
    inputPath: null,
    sample: "clean",
    realModelExpected: true
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run" || arg === "--sample") {
      options.sample = args[index + 1] && !args[index + 1].startsWith("--")
        ? args[index + 1]
        : "clean";
      if (args[index + 1] && !args[index + 1].startsWith("--")) {
        index += 1;
      }
      continue;
    }
    if (arg.startsWith("--sample=")) {
      options.sample = arg.slice("--sample=".length) || "clean";
      continue;
    }
    if (arg === "--input") {
      options.inputPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--input=")) {
      options.inputPath = arg.slice("--input=".length) || null;
      continue;
    }
    if (arg === "--no-network-expected") {
      options.realModelExpected = false;
    }
  }

  return options;
}

function sampleAggregate(sample) {
  const base = {
    schemaVersion: "open_weight_vlm_local_smoke_failure_taxonomy.sample.v1",
    fixtureCount: 3,
    acceptedCount: 3,
    rejectedCount: 0,
    acceptanceRate: 100,
    validationCodeCounts: { null: 3 },
    fallbackCategoryCounts: { null: 3 },
    schemaErrorBucketCounts: {},
    schemaFieldBucketCounts: {},
    latencyBucketCounts: { "5s_to_15s": 3 },
    networkCallsMade: true,
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false
  };

  if (sample === "latency-note") {
    return {
      ...base,
      latencyBucketCounts: { gt_15s: 1, "5s_to_15s": 2 }
    };
  }

  if (sample === "schema-regression") {
    return {
      ...base,
      acceptedCount: 2,
      rejectedCount: 1,
      acceptanceRate: 67,
      validationCodeCounts: { null: 2, unsupported_enum: 1 },
      fallbackCategoryCounts: { null: 2, invalid_schema: 1 },
      schemaErrorBucketCounts: { unsupported_enum: 1 },
      schemaFieldBucketCounts: { visualObservationKey: 1 }
    };
  }

  if (sample === "provider-integration") {
    return {
      ...base,
      acceptedCount: 2,
      rejectedCount: 1,
      acceptanceRate: 67,
      fallbackCategoryCounts: { null: 2, blocked_for_provider_integration: 1 },
      latencyBucketCounts: { "5s_to_15s": 2, lt_1s: 1 }
    };
  }

  return base;
}
