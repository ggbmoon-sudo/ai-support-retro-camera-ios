#!/usr/bin/env node

import {
  aestheticParameterTuningDryRunFromBridgeSample,
  runAestheticParameterTuningDryRunFromBridge
} from "../src/qa/aestheticParameterTuningDryRunFromBridge.mjs";

const report = runAestheticParameterTuningDryRunFromBridge(
  aestheticParameterTuningDryRunFromBridgeSample()
);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (!report.acceptedForTuningDryRunReview || report.blockedReasons.length > 0) {
  process.exitCode = 1;
}
