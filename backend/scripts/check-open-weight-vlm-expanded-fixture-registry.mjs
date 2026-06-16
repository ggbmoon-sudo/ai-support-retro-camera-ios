#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
  evaluateOpenWeightVlmExpandedFixtureRegistry,
  expandedFixtureRegistrySample
} from "../src/qa/openWeightVlmExpandedFixtureRegistry.mjs";

const options = parseArgs(process.argv.slice(2));
const registry = options.inputPath
  ? JSON.parse(await readFile(options.inputPath, "utf8"))
  : expandedFixtureRegistrySample();
const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);

console.log(JSON.stringify(report, null, 2));

if (options.inputPath && !report.eligibleForControlledSmoke) {
  process.exit(1);
}

process.exit(0);

function parseArgs(args) {
  const options = {
    inputPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      continue;
    }
    if (arg === "--input") {
      options.inputPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--input=")) {
      options.inputPath = arg.slice("--input=".length) || null;
    }
  }

  return options;
}
