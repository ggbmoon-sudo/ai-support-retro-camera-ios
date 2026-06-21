#!/usr/bin/env node

import {
  aestheticLocalCvCalibrationAggregationSample,
  runAestheticLocalCvCalibrationAggregationGate
} from "../src/qa/aestheticLocalCvCalibrationAggregationGate.mjs";

const report = runAestheticLocalCvCalibrationAggregationGate(
  aestheticLocalCvCalibrationAggregationSample()
);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (!report.acceptedForCalibrationAggregationReview || report.blockerBuckets.length > 0) {
  process.exitCode = 1;
}
