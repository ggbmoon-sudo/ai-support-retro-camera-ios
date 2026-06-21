import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  parseSiliconFlowVisionModelPreflightArgs,
  runSiliconFlowVisionModelPreflightGate
} from "../src/qa/siliconFlowVisionModelPreflightGate.mjs";

test("SiliconFlow vision model preflight selects Qwen3-VL 32B without runtime execution", () => {
  const report = runSiliconFlowVisionModelPreflightGate();

  assert.equal(report.ok, true);
  assert.equal(report.schemaVersion, "siliconflow_vision_model_preflight.v1");
  assert.equal(report.selectedModelCandidate, "qwen3_vl_32b_instruct");
  assert.equal(report.selectedModelNameBucket, "qwen3_vl_32b_instruct");
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.imageUploadAttempted, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.apiKeyLoaded, false);
  assert.equal(report.productionReady, false);
  assert.match(report.nextExplicitRunCommand, /--model-candidate=qwen3_vl_32b_instruct/);
  assert.doesNotMatch(JSON.stringify(report), /Bearer|SILICONFLOW_API_KEY|data:image|base64,/i);
});

test("SiliconFlow vision model preflight keeps DeepSeek blocked for image QA", () => {
  const report = runSiliconFlowVisionModelPreflightGate({
    args: ["--candidate=deepseek_v4_flash"]
  });

  assert.equal(report.ok, false);
  assert.equal(report.selectedModelCandidate, "deepseek_v4_flash");
  assert.equal(report.selectedModelStatus, "blocked_for_image_qa_current_evidence");
  assert.ok(report.blockers.includes("provider_vision_request_rejected"));
  assert.equal(report.nextExplicitRunCommand, null);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.productionReady, false);
});

test("SiliconFlow vision model preflight accepts explicit fallback candidates without calls", () => {
  const args = parseSiliconFlowVisionModelPreflightArgs([
    "--model-candidate",
    "Qwen/Qwen3-VL-8B-Instruct"
  ]);
  const report = runSiliconFlowVisionModelPreflightGate({
    args: ["--model-candidate=Qwen/Qwen3-VL-8B-Instruct"]
  });

  assert.equal(args.candidate, "qwen3_vl_8b_instruct");
  assert.equal(report.ok, true);
  assert.equal(report.selectedModelCandidate, "qwen3_vl_8b_instruct");
  assert.equal(report.selectedModelStatus, "fallback_for_cost_or_latency_canary");
  assert.equal(report.actualCalls, 0);
});

test("SiliconFlow vision model preflight blocks unknown candidates", () => {
  const report = runSiliconFlowVisionModelPreflightGate({
    args: ["--candidate=not_a_model"]
  });

  assert.equal(report.ok, false);
  assert.equal(report.selectedModelCandidate, "unknown");
  assert.ok(report.blockers.includes("provider_model_unavailable"));
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.productionReady, false);
});

test("SiliconFlow vision model preflight CLI is sanitized", () => {
  const output = execFileSync("node", ["scripts/check-siliconflow-vision-model-preflight.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {}
  });

  assert.match(output, /"selectedModelCandidate": "qwen3_vl_32b_instruct"/);
  assert.match(output, /"networkCallsMade": false/);
  assert.match(output, /"imageUploadAttempted": false/);
  assert.match(output, /"productionReady": false/);
  assert.doesNotMatch(output, /Bearer|SILICONFLOW_API_KEY|data:image|base64,|Authorization/i);
});
