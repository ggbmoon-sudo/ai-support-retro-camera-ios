#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  disabledAestheticCloudTeacherProviderGateConfig,
  evaluateAestheticCloudTeacherProviderGate,
  readAestheticCloudTeacherProviderGateConfig
} from "../src/qa/aestheticCloudTeacherProviderGate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(__dirname, "..");
const exampleConfigPath = resolve(
  backendRoot,
  "config",
  "aesthetic-cloud-teacher.local.example.json"
);

const configArg = process.argv.find((arg) => arg.startsWith("--config="));
const explicitConfigProvided = Boolean(configArg);
const configPath = configArg ? resolve(process.cwd(), configArg.slice("--config=".length)) : exampleConfigPath;

let config = disabledAestheticCloudTeacherProviderGateConfig();
let readFailure = null;

try {
  if (existsSync(configPath)) {
    config = readAestheticCloudTeacherProviderGateConfig(configPath);
  }
} catch (error) {
  readFailure = "blocked_for_config_parse_failure";
}

const report = evaluateAestheticCloudTeacherProviderGate({
  config,
  explicitConfigProvided
});

if (readFailure) {
  report.blockedReasons = [...new Set([readFailure, ...report.blockedReasons])];
  report.hardValidationFailure = true;
  report.gateValid = false;
}

console.log(JSON.stringify(report, null, 2));

if (report.hardValidationFailure) {
  process.exitCode = 1;
}
