#!/usr/bin/env node

import { siliconFlowNoRuntimeReadinessSummary } from "../src/providers/siliconflowPhotoAdvisorProviderContract.mjs";

const report = siliconFlowNoRuntimeReadinessSummary();

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
