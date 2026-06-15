#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import {
  evaluateOpenWeightVlmLocalSandboxGate,
  loadOpenWeightVlmLocalSandboxConfig
} from "../src/qa/openWeightVlmLocalSandboxConfig.mjs";

const EXAMPLE_CONFIG_URL = new URL("../config/open-weight-vlm.local.example.json", import.meta.url);

const options = parseArgs(process.argv.slice(2));
const configPath = options.configPath || fileURLToPath(EXAMPLE_CONFIG_URL);
const loaded = await loadOpenWeightVlmLocalSandboxConfig(configPath, {
  requireConfig: options.runLocalModel || Boolean(options.configPath)
});
const summary = loaded.ok ? loaded.value : loaded.value;
const gate = evaluateOpenWeightVlmLocalSandboxGate(summary, {
  runLocalModel: options.runLocalModel
});

printSanitized(gate);

if (!loaded.ok || gate.hardBlockers.length > 0 || options.runLocalModel) {
  process.exit(1);
}

process.exit(0);

function parseArgs(args) {
  const options = {
    dryRun: true,
    runLocalModel: false,
    configPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (arg === "--run-local-model") {
      options.runLocalModel = true;
      options.dryRun = false;
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

function printSanitized(value) {
  console.log(JSON.stringify(value, null, 2));
}
