#!/usr/bin/env node

import {
  aestheticParameterPackCandidateBuilderSample,
  runAestheticParameterPackCandidateBuilder
} from "../src/qa/aestheticParameterPackCandidateBuilder.mjs";

const report = runAestheticParameterPackCandidateBuilder(
  aestheticParameterPackCandidateBuilderSample()
);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (!report.acceptedForPackCandidateReview || report.blockedReasons.length > 0) {
  process.exitCode = 1;
}
