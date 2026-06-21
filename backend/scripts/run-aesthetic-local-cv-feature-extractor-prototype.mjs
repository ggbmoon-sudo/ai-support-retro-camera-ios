#!/usr/bin/env node

import {
  aestheticLocalCvFeatureExtractorPrototypeSample,
  runAestheticLocalCvFeatureExtractorPrototype
} from "../src/qa/aestheticLocalCvFeatureExtractorPrototype.mjs";

const report = runAestheticLocalCvFeatureExtractorPrototype(
  aestheticLocalCvFeatureExtractorPrototypeSample()
);

console.log(JSON.stringify(report, null, 2));

if (!report.extractorPrototypeValid) {
  process.exitCode = 1;
}
