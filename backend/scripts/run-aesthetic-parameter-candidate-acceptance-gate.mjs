#!/usr/bin/env node

import {
  aestheticParameterCandidateAcceptanceGateSample,
  runAestheticParameterCandidateAcceptanceGate
} from "../src/qa/aestheticParameterCandidateAcceptanceGate.mjs";

const report = runAestheticParameterCandidateAcceptanceGate(
  aestheticParameterCandidateAcceptanceGateSample()
);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (!report.acceptedForParameterPackCandidateReview || report.blockedReasons.length > 0) {
  process.exitCode = 1;
}
