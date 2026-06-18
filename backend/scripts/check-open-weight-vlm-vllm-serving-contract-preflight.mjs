#!/usr/bin/env node
import {
  evaluateOpenWeightVlmVllmServingContractPreflightSamples
} from "../src/qa/openWeightVlmVllmServingContractPreflight.mjs";

const report = evaluateOpenWeightVlmVllmServingContractPreflightSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.vllmContractPreflightEligible) {
  process.exit(1);
}

process.exit(0);
