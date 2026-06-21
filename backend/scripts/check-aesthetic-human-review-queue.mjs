#!/usr/bin/env node

import {
  aestheticHumanReviewQueueSample,
  evaluateAestheticHumanReviewQueue
} from "../src/qa/aestheticHumanReviewQueue.mjs";

const report = evaluateAestheticHumanReviewQueue(aestheticHumanReviewQueueSample());

console.log(JSON.stringify(report, null, 2));

if (!report.reviewQueueValid) {
  process.exitCode = 1;
}
