#!/usr/bin/env node

import { runSiliconFlowVisionModelPreflightGate } from "../src/qa/siliconFlowVisionModelPreflightGate.mjs";

const report = runSiliconFlowVisionModelPreflightGate({
  args: process.argv.slice(2)
});

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exitCode = report.ok ? 0 : 1;
