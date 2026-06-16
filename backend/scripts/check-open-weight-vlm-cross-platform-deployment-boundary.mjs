#!/usr/bin/env node

import {
  evaluateOpenWeightVlmCrossPlatformDeploymentBoundary
} from "../src/qa/openWeightVlmCrossPlatformDeploymentBoundary.mjs";

const report = evaluateOpenWeightVlmCrossPlatformDeploymentBoundary();
console.log(JSON.stringify(report, null, 2));

if (report.eligibleForDeploymentBoundaryReview !== true) {
  process.exitCode = 1;
}
