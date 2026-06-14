#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
  assertOpenWeightVlmBenchmarkReportRedacted,
  evaluateOpenWeightVlmBenchmarkCase,
  summarizeOpenWeightVlmBenchmark
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";
import { evaluateOpenWeightVlmBenchmarkGate } from "../src/qa/openWeightVlmBenchmarkGate.mjs";

const FIXTURE_URL = new URL("../tests/fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json", import.meta.url);

const options = parseArgs(process.argv.slice(2));
if (!options.synthetic) {
  printSanitized({
    productionReady: false,
    eligibleForSyntheticContractReview: false,
    hardBlockers: [
      {
        code: "synthetic_mode_required",
        category: "blocked_for_provider_integration",
        message: "Open-weight VLM gate only supports --synthetic in Phase 19-D. No model server request was sent."
      }
    ],
    reviewedMetrics: {
      networkCallsMade: false
    }
  });
  process.exit(1);
}

const fixture = JSON.parse(await readFile(FIXTURE_URL, "utf8"));
const results = (fixture.cases ?? []).map(evaluateOpenWeightVlmBenchmarkCase);
const report = summarizeOpenWeightVlmBenchmark(results);
const redaction = assertOpenWeightVlmBenchmarkReportRedacted(report);

if (!redaction.ok) {
  printSanitized(evaluateOpenWeightVlmBenchmarkGate({
    ...report,
    productionReady: false,
    reportContainsRawUserContent: true
  }));
  process.exit(1);
}

const gate = evaluateOpenWeightVlmBenchmarkGate(report);
printSanitized(gate);
process.exit(gate.hardBlockers.length === 0 ? 0 : 1);

function parseArgs(args) {
  return {
    synthetic: args.length === 0 || args.includes("--synthetic")
  };
}

function printSanitized(value) {
  console.log(JSON.stringify(value, null, 2));
}
