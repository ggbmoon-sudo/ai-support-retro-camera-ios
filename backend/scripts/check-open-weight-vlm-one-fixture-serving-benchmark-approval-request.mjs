#!/usr/bin/env node
import {
  evaluateOneFixtureServingBenchmarkApprovalRequestSamples
} from "../src/qa/openWeightVlmOneFixtureServingBenchmarkApprovalRequest.mjs";

const report = evaluateOneFixtureServingBenchmarkApprovalRequestSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.approvalRequestGateEligible) {
  process.exit(1);
}

process.exit(0);
