#!/usr/bin/env node
import {
  evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGateSamples
} from "../src/qa/depthAnythingV2SmallModelArtifactBenchmarkHarnessGate.mjs";

const report = evaluateDepthAnythingV2SmallModelArtifactBenchmarkHarnessGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.artifactHarnessGateEligible) {
  process.exit(1);
}

process.exit(0);
