#!/usr/bin/env node
import {
  evaluateOpenWeightVlmQuantizationServingBenchmarkPlanGateSamples
} from "../src/qa/openWeightVlmQuantizationServingBenchmarkPlanGate.mjs";

const report = evaluateOpenWeightVlmQuantizationServingBenchmarkPlanGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.quantizationServingBenchmarkPlanEligible) {
  process.exit(1);
}

process.exit(0);
