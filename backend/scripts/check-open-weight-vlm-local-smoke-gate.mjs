#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
  evaluateOpenWeightVlmBenchmarkGate
} from "../src/qa/openWeightVlmBenchmarkGate.mjs";
import {
  evaluateOpenWeightVlmBenchmarkCase,
  summarizeOpenWeightVlmBenchmark
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";
import { runOpenWeightVlmLocalSandboxSmoke } from "../src/qa/openWeightVlmLocalSandboxClient.mjs";
import { loadOpenWeightVlmLocalSandboxConfig } from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";
import { evaluateOpenWeightVlmLocalSmokeGate } from "../src/qa/openWeightVlmLocalSmokeGate.mjs";

const FIXTURE_URL = new URL("../tests/fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json", import.meta.url);
const EXAMPLE_CONFIG_URL = new URL("../config/open-weight-vlm.local.example.json", import.meta.url);
const LOCAL_CONFIG_URL = new URL("../config/open-weight-vlm.local.json", import.meta.url);

const options = parseArgs(process.argv.slice(2));
const configPath = options.configPath || LOCAL_CONFIG_URL.pathname;

const loaded = await loadOpenWeightVlmLocalSandboxConfig(configPath, {
  requireConfig: true
});
const syntheticBenchmarkGate = await runSyntheticBenchmarkGate();
const localSmokeReport = await runOpenWeightVlmLocalSandboxSmoke({
  configPath: EXAMPLE_CONFIG_URL.pathname,
  requireConfig: true,
  runLocalModel: false
});
const gate = evaluateOpenWeightVlmLocalSmokeGate({
  configSummary: loaded.value,
  configLoadedOk: loaded.ok,
  configErrorCode: loaded.error?.code,
  syntheticBenchmarkGate,
  localSmokeReport
});

printSanitized(gate);

if (gate.hardBlockers.length > 0) {
  process.exit(1);
}

process.exit(0);

function parseArgs(args) {
  const options = {
    configPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      continue;
    }
    if (arg === "--config") {
      options.configPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--config=")) {
      options.configPath = arg.slice("--config=".length) || null;
      continue;
    }
  }

  return options;
}

async function runSyntheticBenchmarkGate() {
  const fixture = JSON.parse(await readFile(FIXTURE_URL, "utf8"));
  const results = fixture.cases.map(evaluateOpenWeightVlmBenchmarkCase);
  const report = summarizeOpenWeightVlmBenchmark(results);
  return evaluateOpenWeightVlmBenchmarkGate(report);
}

function printSanitized(value) {
  console.log(JSON.stringify(value, null, 2));
}
