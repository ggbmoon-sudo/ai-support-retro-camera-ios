#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
  assertOpenWeightVlmBenchmarkReportRedacted,
  evaluateOpenWeightVlmBenchmarkCase,
  summarizeOpenWeightVlmBenchmark
} from "../src/qa/openWeightVlmPhotoAdvisorSchema.mjs";

const FIXTURE_URL = new URL("../tests/fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json", import.meta.url);

const options = parseArgs(process.argv.slice(2));

if (!options.synthetic) {
  printSanitized({
    ok: false,
    errorCode: "synthetic_mode_required",
    message: "Open-weight VLM benchmark skeleton only supports --synthetic in Phase 19-C. No model server request was sent.",
    productionReady: false
  });
  process.exit(1);
}

const fixture = JSON.parse(await readFile(FIXTURE_URL, "utf8"));
const results = (fixture.cases ?? []).map(evaluateOpenWeightVlmBenchmarkCase);
const report = summarizeOpenWeightVlmBenchmark(results);
const redaction = assertOpenWeightVlmBenchmarkReportRedacted(report);

if (!redaction.ok) {
  printSanitized({
    ok: false,
    errorCode: redaction.error.code,
    message: redaction.error.message,
    productionReady: false
  });
  process.exit(1);
}

printSanitized(report);
process.exit(report.expectationFailureCount === 0 ? 0 : 1);

function parseArgs(args) {
  return {
    synthetic: args.length === 0 || args.includes("--synthetic")
  };
}

function printSanitized(value) {
  console.log(JSON.stringify(value, null, 2));
}
