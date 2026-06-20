#!/usr/bin/env node
import {
  aestheticParameterMiningBotDryRunSample,
  runAestheticParameterMiningBotDryRun
} from "../src/qa/aestheticParameterMiningBotDryRun.mjs";

const report = runAestheticParameterMiningBotDryRun(aestheticParameterMiningBotDryRunSample());

console.log(JSON.stringify(report, null, 2));

if (!report.dryRunValid) {
  process.exit(1);
}
