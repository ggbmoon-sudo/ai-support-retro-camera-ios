#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { runOpenWeightVlmLocalSandboxSmoke } from "../src/qa/openWeightVlmLocalSandboxClient.mjs";

const EXAMPLE_CONFIG_URL = new URL("../config/open-weight-vlm.local.example.json", import.meta.url);
const LOCAL_CONFIG_URL = new URL("../config/open-weight-vlm.local.json", import.meta.url);

const options = parseArgs(process.argv.slice(2));
const configPath = options.configPath
  || fileURLToPath(options.runLocalModel ? LOCAL_CONFIG_URL : EXAMPLE_CONFIG_URL);

const report = await runOpenWeightVlmLocalSandboxSmoke({
  configPath,
  requireConfig: options.runLocalModel || Boolean(options.configPath),
  runLocalModel: options.runLocalModel
});

printSanitized(report);

if (report.hardBlockers.length > 0) {
  process.exit(1);
}

process.exit(0);

function parseArgs(args) {
  const options = {
    runLocalModel: false,
    configPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run" || arg === "--stub") {
      continue;
    }
    if (arg === "--run-local-model") {
      options.runLocalModel = true;
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
