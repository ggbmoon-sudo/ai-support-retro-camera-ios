#!/usr/bin/env node
import {
  evaluateControlledMultifixtureServingBenchmarkApprovalRequestSamples
} from "../src/qa/openWeightVlmControlledMultifixtureServingBenchmarkApprovalRequest.mjs";

const report = evaluateControlledMultifixtureServingBenchmarkApprovalRequestSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.approvalRequestGateEligible) {
  process.exit(1);
}

process.exit(0);
