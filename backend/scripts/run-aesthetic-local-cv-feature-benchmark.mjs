#!/usr/bin/env node

import {
  aestheticLocalCvFeatureBenchmarkSample,
  runAestheticLocalCvFeatureBenchmark
} from "../src/qa/aestheticLocalCvFeatureBenchmark.mjs";

const report = runAestheticLocalCvFeatureBenchmark(aestheticLocalCvFeatureBenchmarkSample());

console.log(JSON.stringify(report, null, 2));

if (!report.benchmarkValid) {
  process.exitCode = 1;
}
