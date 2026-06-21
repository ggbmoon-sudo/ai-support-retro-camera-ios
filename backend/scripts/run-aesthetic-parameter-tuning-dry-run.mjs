#!/usr/bin/env node

import {
  aestheticParameterTuningHarnessSample,
  runAestheticParameterTuningDryRun
} from "../src/qa/aestheticParameterTuningHarness.mjs";

const report = runAestheticParameterTuningDryRun(aestheticParameterTuningHarnessSample());

console.log(JSON.stringify(report, null, 2));

if (!report.tuningDryRunValid) {
  process.exitCode = 1;
}
