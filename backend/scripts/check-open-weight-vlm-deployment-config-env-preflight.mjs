#!/usr/bin/env node
import {
  evaluateOpenWeightVlmDeploymentConfigEnvPreflightSamples
} from "../src/qa/openWeightVlmDeploymentConfigEnvPreflight.mjs";

const report = evaluateOpenWeightVlmDeploymentConfigEnvPreflightSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.eligibleForDeploymentConfigEnvReview) {
  process.exit(1);
}

process.exit(0);
