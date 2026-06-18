#!/usr/bin/env node
import {
  evaluateOpenWeightVlmServingBenchmarkApprovalMatrixSamples
} from "../src/qa/openWeightVlmServingBenchmarkApprovalMatrix.mjs";

const report = evaluateOpenWeightVlmServingBenchmarkApprovalMatrixSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.approvalMatrixEligible) {
  process.exit(1);
}

process.exit(0);
