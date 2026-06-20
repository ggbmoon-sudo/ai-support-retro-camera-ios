#!/usr/bin/env node
import {
  evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGateSamples
} from "../src/qa/depthAnythingV2SmallCoreMlSandboxPreflightGate.mjs";

const report = evaluateDepthAnythingV2SmallCoreMlSandboxPreflightGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.sandboxPreflightEligible || !report.eligibleForFutureBenchmark) {
  process.exit(1);
}

process.exit(0);
