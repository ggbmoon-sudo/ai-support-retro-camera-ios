#!/usr/bin/env node
import {
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "../src/qa/aestheticParameterRegistry.mjs";

const report = evaluateAestheticParameterRegistry(aestheticParameterRegistry());

console.log(JSON.stringify(report, null, 2));

if (!report.registryValid) {
  process.exit(1);
}
