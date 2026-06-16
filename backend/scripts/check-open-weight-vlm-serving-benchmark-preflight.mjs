#!/usr/bin/env node
import {
  evaluateOpenWeightVlmServingBenchmarkPreflight,
  servingBenchmarkPreflightSample
} from "../src/qa/openWeightVlmServingBenchmarkPreflight.mjs";

const report = evaluateOpenWeightVlmServingBenchmarkPreflight(servingBenchmarkPreflightSample());

console.log(JSON.stringify(report, null, 2));

if (!report.eligibleForPhase21EntryReview) {
  process.exit(1);
}

process.exit(0);
