#!/usr/bin/env node
import {
  evaluateOpenWeightVlmAutoTriggerLiveAdvisorPolicyGateSamples
} from "../src/qa/openWeightVlmAutoTriggerLiveAdvisorPolicyGate.mjs";

const report = evaluateOpenWeightVlmAutoTriggerLiveAdvisorPolicyGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.autoTriggerPolicyEligible) {
  process.exit(1);
}

process.exit(0);
