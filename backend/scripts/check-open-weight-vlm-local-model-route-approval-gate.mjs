#!/usr/bin/env node
import {
  evaluateOpenWeightVlmLocalModelRouteApprovalGateSamples
} from "../src/qa/openWeightVlmLocalModelRouteApprovalGate.mjs";

const report = evaluateOpenWeightVlmLocalModelRouteApprovalGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.approvalEligible) {
  process.exit(1);
}

process.exit(0);
