#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
  evaluateOpenWeightVlmLocalSmokeRepeatabilityGate,
  summarizeOpenWeightVlmLocalSmokeRepeatability
} from "../src/qa/openWeightVlmLocalSmokeRepeatabilityGate.mjs";

const options = parseArgs(process.argv.slice(2));
const aggregate = options.baseline
  ? baselineAggregate()
  : options.inputPath
    ? JSON.parse(await readFile(options.inputPath, "utf8"))
    : summarizeOpenWeightVlmLocalSmokeRepeatability(baselineFixtureResults());

const report = evaluateOpenWeightVlmLocalSmokeRepeatabilityGate(aggregate);
console.log(JSON.stringify(report, null, 2));

if (report.hardBlockers.length > 0) {
  process.exit(1);
}

process.exit(0);

function parseArgs(args) {
  const options = {
    baseline: false,
    inputPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--baseline" || arg === "--dry-run") {
      options.baseline = true;
      continue;
    }
    if (arg === "--input") {
      options.inputPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--input=")) {
      options.inputPath = arg.slice("--input=".length) || null;
    }
  }

  return options;
}

function baselineAggregate() {
  return summarizeOpenWeightVlmLocalSmokeRepeatability(baselineFixtureResults());
}

function baselineFixtureResults() {
  return [
    fixture("gt_15s"),
    fixture("5s_to_15s"),
    fixture("5s_to_15s")
  ];
}

function fixture(latencyBucket) {
  return {
    fixtureIdBucket: "configured",
    acceptedCount: 1,
    rejectedCount: 0,
    validationCode: null,
    fallbackCategory: null,
    schemaDiagnostic: null,
    latencyBucket,
    networkCallsMade: true,
    productionReady: false,
    rawPromptPersisted: false,
    rawModelResponsePersisted: false,
    rawImagePersisted: false,
    rawImagePathPersisted: false,
    requestPayloadPersisted: false
  };
}
