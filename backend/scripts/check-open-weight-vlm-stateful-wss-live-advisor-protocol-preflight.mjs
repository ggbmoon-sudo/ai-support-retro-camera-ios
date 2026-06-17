#!/usr/bin/env node
import {
  evaluateOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflightSamples
} from "../src/qa/openWeightVlmStatefulWssLiveAdvisorProtocolPreflight.mjs";

const report = evaluateOpenWeightVlmStatefulWssLiveAdvisorProtocolPreflightSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.protocolPreflightEligible) {
  process.exit(1);
}

process.exit(0);
