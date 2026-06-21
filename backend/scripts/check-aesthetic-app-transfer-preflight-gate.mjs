import {
  aestheticAppTransferPreflightGateSample,
  runAestheticAppTransferPreflightGate
} from "../src/qa/aestheticAppTransferPreflightGate.mjs";

const report = runAestheticAppTransferPreflightGate(aestheticAppTransferPreflightGateSample());

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

if (!report.preflightPassed) {
  process.exitCode = 1;
}
