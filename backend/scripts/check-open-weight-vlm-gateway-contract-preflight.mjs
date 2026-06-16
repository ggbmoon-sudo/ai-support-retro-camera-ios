#!/usr/bin/env node
import {
  evaluateOpenWeightVlmGatewayContractPreflight,
  gatewayContractPreflightSampleRequest,
  gatewayContractPreflightSampleResponse
} from "../src/qa/openWeightVlmGatewayContractPreflight.mjs";

const report = evaluateOpenWeightVlmGatewayContractPreflight({
  request: gatewayContractPreflightSampleRequest(),
  response: gatewayContractPreflightSampleResponse()
});

console.log(JSON.stringify(report, null, 2));

if (!report.eligibleForPhase21BPlanning) {
  process.exit(1);
}

process.exit(0);
