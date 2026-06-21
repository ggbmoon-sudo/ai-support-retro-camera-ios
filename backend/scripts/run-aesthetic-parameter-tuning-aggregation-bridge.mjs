#!/usr/bin/env node

import {
  aestheticParameterTuningAggregationBridgeSample,
  runAestheticParameterTuningAggregationBridge
} from "../src/qa/aestheticParameterTuningAggregationBridge.mjs";

const report = runAestheticParameterTuningAggregationBridge(
  aestheticParameterTuningAggregationBridgeSample()
);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (!report.acceptedForTuningBridgeReview || report.blockedReasons.length > 0) {
  process.exitCode = 1;
}
