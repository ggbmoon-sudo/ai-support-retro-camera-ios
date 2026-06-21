#!/usr/bin/env node

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  disabledAestheticCloudTeacherProviderGateConfig,
  readAestheticCloudTeacherProviderGateConfig
} from "../src/qa/aestheticCloudTeacherProviderGate.mjs";
import { runAestheticCloudTeacherProviderSmokeHarness } from "../src/qa/aestheticCloudTeacherProviderSmokeHarness.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(__dirname, "..");
const exampleConfigPath = resolve(
  backendRoot,
  "config",
  "aesthetic-cloud-teacher.local.example.json"
);

const configArg = process.argv.find((arg) => arg.startsWith("--config="));
const runProviderSmoke = process.argv.includes("--run-provider-smoke");
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

const report = await runAestheticCloudTeacherProviderSmokeHarness({
  config,
  configPath,
  explicitConfigProvided,
  runProviderSmoke
});

if (readFailure) {
  report.blockedReasons = [...new Set([readFailure, ...report.blockedReasons])];
  report.hardValidationFailure = true;
  report.harnessValid = false;
}

console.log(JSON.stringify(report, null, 2));

if (report.hardValidationFailure) {
  process.exitCode = 1;
}
