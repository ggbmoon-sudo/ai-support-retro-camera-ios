#!/usr/bin/env node
import {
  evaluateOpenWeightVlmLocalModelRouteDryRunPlanSamples
} from "../src/qa/openWeightVlmLocalModelRouteDryRunPlan.mjs";

const report = evaluateOpenWeightVlmLocalModelRouteDryRunPlanSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.dryRunPlanEligible) {
  process.exit(1);
}

process.exit(0);
