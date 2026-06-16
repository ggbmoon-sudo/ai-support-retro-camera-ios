#!/usr/bin/env node

import {
  evaluateOpenWeightVlmGatewayProviderRoutingDryRun
} from "../src/qa/openWeightVlmGatewayProviderRouting.mjs";

const report = evaluateOpenWeightVlmGatewayProviderRoutingDryRun();
console.log(JSON.stringify(report, null, 2));

if (report.eligibleForPhase21DPlanning !== true) {
  process.exitCode = 1;
}
