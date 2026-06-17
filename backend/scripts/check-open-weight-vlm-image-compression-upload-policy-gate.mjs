#!/usr/bin/env node
import {
  evaluateOpenWeightVlmImageCompressionUploadPolicyGateSamples
} from "../src/qa/openWeightVlmImageCompressionUploadPolicyGate.mjs";

const report = evaluateOpenWeightVlmImageCompressionUploadPolicyGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.uploadPolicyEligible) {
  process.exit(1);
}

process.exit(0);
