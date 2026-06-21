#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  aestheticLocalCvCalibrationSmokeDisabledConfig,
  runAestheticLocalCvCalibrationSmoke
} from "../src/qa/aestheticLocalCvCalibrationSmoke.mjs";

const configPath = resolve(argValue("--config") || "config/aesthetic-local-cv-calibration-fixtures.local.json");
const fixtureToken = argValue("--fixture-token") || "calibration_001";
const configPresent = existsSync(configPath);
const config = configPresent
  ? JSON.parse(readFileSync(configPath, "utf8"))
  : aestheticLocalCvCalibrationSmokeDisabledConfig();

const report = runAestheticLocalCvCalibrationSmoke(
  { config, configPresent, fixtureToken },
  { cwd: process.cwd() }
);

console.log(JSON.stringify(report, null, 2));

if (report.hardValidationFailure) {
  process.exitCode = 1;
}

function argValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}
