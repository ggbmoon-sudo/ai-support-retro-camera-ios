#!/usr/bin/env node
import {
  gatewayAdapterStubSampleRequest,
  runOpenWeightVlmGatewayAdapterStub
} from "../src/qa/openWeightVlmGatewayAdapterStub.mjs";

const report = runOpenWeightVlmGatewayAdapterStub({
  request: gatewayAdapterStubSampleRequest()
});

console.log(JSON.stringify(report, null, 2));

if (!report.eligibleForPhase21CPlanning) {
  process.exit(1);
}

process.exit(0);
