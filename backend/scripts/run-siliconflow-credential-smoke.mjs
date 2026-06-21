#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { runSiliconFlowCredentialSmokeGate } from "../src/qa/siliconFlowCredentialSmokeGate.mjs";

loadDotEnv(new URL("../../.env", import.meta.url));

const report = await runSiliconFlowCredentialSmokeGate({
  args: process.argv.slice(2),
  env: process.env
});

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exitCode = report.ok ? 0 : 1;

function loadDotEnv(url) {
  if (!existsSync(url)) {
    return;
  }

  const text = readFileSync(url, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator < 0) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
