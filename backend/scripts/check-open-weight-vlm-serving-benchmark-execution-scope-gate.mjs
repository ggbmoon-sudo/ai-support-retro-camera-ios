#!/usr/bin/env node
import {
  evaluateOpenWeightVlmServingBenchmarkExecutionScopeGateSamples
} from "../src/qa/openWeightVlmServingBenchmarkExecutionScopeGate.mjs";

const report = evaluateOpenWeightVlmServingBenchmarkExecutionScopeGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.scopeGateEligible) {
  process.exit(1);
}

process.exit(0);
