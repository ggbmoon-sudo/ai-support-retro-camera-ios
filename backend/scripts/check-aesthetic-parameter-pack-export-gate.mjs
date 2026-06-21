#!/usr/bin/env node

import {
  aestheticParameterPackExportGateSample,
  runAestheticParameterPackExportGate
} from "../src/qa/aestheticParameterPackExportGate.mjs";

const report = runAestheticParameterPackExportGate(aestheticParameterPackExportGateSample());

console.log(JSON.stringify(report, null, 2));

if (!report.exportGatePassed) {
  process.exitCode = 1;
}
