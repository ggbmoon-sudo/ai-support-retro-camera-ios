#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { evaluatePhotoAdvisorQAGate } from "../src/qa/photoAdvisorQAGate.mjs";

const DEFAULT_REPORT_URL = new URL("../reports/provider-qa/photo-advisor-qa-report.json", import.meta.url);
const reportURL = resolveReportURL(process.argv.slice(2));

try {
  const report = JSON.parse(await readFile(reportURL, "utf8"));
  const summary = evaluatePhotoAdvisorQAGate(report);
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.hardBlockers.length === 0 ? 0 : 1);
} catch {
  console.log(JSON.stringify({
    productionReady: false,
    eligibleForDebugInternalReview: false,
    hardBlockers: [
      {
        code: "qa_report_unavailable",
        category: "blocked_for_artifact_leakage",
        message: "Sanitized QA report could not be read or parsed. Run synthetic-contract QA first."
      }
    ],
    warnings: [],
    reviewedMetrics: {}
  }, null, 2));
  process.exit(1);
}

function resolveReportURL(args) {
  const reportArg = args.find((item) => item.startsWith("--report="));
  if (!reportArg) {
    return DEFAULT_REPORT_URL;
  }
  return new URL(reportArg.slice("--report=".length), `file://${process.cwd()}/`);
}
