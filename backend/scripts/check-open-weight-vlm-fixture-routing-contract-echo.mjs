#!/usr/bin/env node
import {
  evaluateOpenWeightVlmFixtureRoutingContractEcho
} from "../src/qa/openWeightVlmFixtureRoutingContractEcho.mjs";

const endpointUrl = endpointFromArgs(process.argv.slice(2));
const report = await evaluateOpenWeightVlmFixtureRoutingContractEcho({ endpointUrl });

console.log(JSON.stringify(report, null, 2));

if (report.hardBlockers.length > 0) {
  process.exit(1);
}

function endpointFromArgs(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--endpoint") {
      return args[index + 1] || undefined;
    }
    if (arg.startsWith("--endpoint=")) {
      return arg.slice("--endpoint=".length) || undefined;
    }
  }
  return undefined;
}
