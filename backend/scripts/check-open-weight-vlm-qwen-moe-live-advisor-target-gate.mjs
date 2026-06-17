#!/usr/bin/env node
import {
  evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGateSamples
} from "../src/qa/openWeightVlmQwenMoELiveAdvisorTargetGate.mjs";

const report = evaluateOpenWeightVlmQwenMoELiveAdvisorTargetGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.targetGateEligible) {
  process.exit(1);
}

process.exit(0);
