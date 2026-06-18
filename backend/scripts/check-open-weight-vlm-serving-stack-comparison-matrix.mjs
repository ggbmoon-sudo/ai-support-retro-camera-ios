#!/usr/bin/env node
import {
  evaluateServingStackComparisonMatrixSamples
} from "../src/qa/openWeightVlmServingStackComparisonMatrix.mjs";

const report = evaluateServingStackComparisonMatrixSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.comparisonMatrixEligible) {
  process.exit(1);
}

process.exit(0);
