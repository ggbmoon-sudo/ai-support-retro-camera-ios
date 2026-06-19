#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import {
  runBenchmarkRouteContractDryRun
} from "../src/qa/openWeightVlmBenchmarkRouteContractDryRun.mjs";

const LOCAL_CONFIG_PATH = fileURLToPath(new URL("../config/open-weight-vlm.local.json", import.meta.url));

const report = await runBenchmarkRouteContractDryRun({
  configPath: LOCAL_CONFIG_PATH
});

console.log(JSON.stringify(report, null, 2));
process.exitCode = report.routeContractDryRunEligible ? 0 : 1;
