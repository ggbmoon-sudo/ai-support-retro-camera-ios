#!/usr/bin/env node

import {
  buildSiliconFlowBenchmarkDryRunPlan,
  siliconFlowBenchmarkDryRunReport
} from "../src/providers/siliconflowPhotoAdvisorBenchmarkPlan.mjs";

const report = siliconFlowBenchmarkDryRunReport(buildSiliconFlowBenchmarkDryRunPlan());

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
