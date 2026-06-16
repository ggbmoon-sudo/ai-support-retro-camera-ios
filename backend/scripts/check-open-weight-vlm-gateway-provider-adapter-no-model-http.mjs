#!/usr/bin/env node
import {
  evaluateOpenWeightVlmGatewayProviderAdapterNoModelHttp,
  providerAdapterNoModelHttpSafeMockFetch,
  providerAdapterNoModelHttpUnsafeMockFetch
} from "../src/qa/openWeightVlmGatewayProviderAdapterNoModelHttp.mjs";

const args = process.argv.slice(2);
const report = await evaluateOpenWeightVlmGatewayProviderAdapterNoModelHttp({
  endpointUrl: argValue(args, "--endpoint"),
  requestedProviderMode: argValue(args, "--provider-mode") || "local_contract_echo",
  fetchImpl: mockFetchFromArgs(args)
});

console.log(JSON.stringify(report, null, 2));

if (!report.eligibleForProviderAdapterNoModelHttpReview) {
  process.exit(1);
}

process.exit(0);

function argValue(args, name) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === name) {
      return args[index + 1] || undefined;
    }
    if (arg.startsWith(`${name}=`)) {
      return arg.slice(name.length + 1) || undefined;
    }
  }
  return undefined;
}

function mockFetchFromArgs(args) {
  if (args.includes("--mock-safe")) {
    return providerAdapterNoModelHttpSafeMockFetch;
  }
  if (args.includes("--mock-unsafe")) {
    return providerAdapterNoModelHttpUnsafeMockFetch;
  }
  return undefined;
}
