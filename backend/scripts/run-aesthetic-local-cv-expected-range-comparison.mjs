#!/usr/bin/env node

import {
  aestheticLocalCvExpectedRangeComparisonSample,
  runAestheticLocalCvExpectedRangeComparison
} from "../src/qa/aestheticLocalCvExpectedRangeComparison.mjs";

const report = runAestheticLocalCvExpectedRangeComparison(
  aestheticLocalCvExpectedRangeComparisonSample()
);

console.log(JSON.stringify(report, null, 2));

if (!report.comparisonPassed) {
  process.exitCode = 1;
}
