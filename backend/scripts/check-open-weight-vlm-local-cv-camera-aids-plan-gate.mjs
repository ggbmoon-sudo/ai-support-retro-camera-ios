#!/usr/bin/env node
import {
  evaluateOpenWeightVlmLocalCvCameraAidsPlanGateSamples
} from "../src/qa/openWeightVlmLocalCvCameraAidsPlanGate.mjs";

const report = evaluateOpenWeightVlmLocalCvCameraAidsPlanGateSamples();

console.log(JSON.stringify(report, null, 2));

if (!report.localCvPlanEligible) {
  process.exit(1);
}

process.exit(0);
