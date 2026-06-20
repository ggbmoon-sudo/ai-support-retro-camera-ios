#!/usr/bin/env node
import {
  aestheticCloudTeacherSandboxSample,
  runAestheticCloudTeacherSandboxPreflight
} from "../src/qa/aestheticCloudTeacherSandbox.mjs";

const report = runAestheticCloudTeacherSandboxPreflight(aestheticCloudTeacherSandboxSample());

console.log(JSON.stringify(report, null, 2));

if (!report.preflightValid) {
  process.exit(1);
}
