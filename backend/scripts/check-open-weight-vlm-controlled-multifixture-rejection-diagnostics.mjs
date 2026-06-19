#!/usr/bin/env node
import {
  diagnoseControlledMultifixtureRejectionPath
} from "../src/qa/openWeightVlmControlledMultifixtureRejectionDiagnostics.mjs";

const report = diagnoseControlledMultifixtureRejectionPath();

console.log(JSON.stringify(report, null, 2));

if (!report.diagnosticEligible) {
  process.exit(1);
}

process.exit(0);
