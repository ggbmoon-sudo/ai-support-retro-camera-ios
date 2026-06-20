#!/usr/bin/env node
import {
  aestheticParameterCandidateRunnerSample,
  runAestheticParameterCandidateDryRun
} from "../src/qa/aestheticParameterCandidateRunner.mjs";

const report = runAestheticParameterCandidateDryRun(aestheticParameterCandidateRunnerSample());

console.log(JSON.stringify(report, null, 2));

if (!report.dryRunValid) {
  process.exit(1);
}
