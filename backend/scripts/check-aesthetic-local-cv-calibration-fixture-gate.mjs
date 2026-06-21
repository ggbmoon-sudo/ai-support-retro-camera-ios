#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  aestheticLocalCvCalibrationFixtureGateDisabledConfig,
  runAestheticLocalCvCalibrationFixtureGate
} from "../src/qa/aestheticLocalCvCalibrationFixtureGate.mjs";

const configPath = argValue("--config");
const config = configPath
  ? JSON.parse(readFileSync(resolve(configPath), "utf8"))
  : aestheticLocalCvCalibrationFixtureGateDisabledConfig();
const report = runAestheticLocalCvCalibrationFixtureGate(config);

console.log(JSON.stringify(report, null, 2));

if (report.hardValidationFailure) {
  process.exitCode = 1;
}

function argValue(name) {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}
