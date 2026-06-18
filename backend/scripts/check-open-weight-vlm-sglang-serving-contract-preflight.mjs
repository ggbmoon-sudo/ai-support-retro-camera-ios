#!/usr/bin/env node
import {
  evaluateOpenWeightVlmSglangServingContractPreflightSamples
} from "../src/qa/openWeightVlmSglangServingContractPreflight.mjs";

const report = evaluateOpenWeightVlmSglangServingContractPreflightSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.sglangContractPreflightEligible) {
  process.exit(1);
}

process.exit(0);