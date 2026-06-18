import assert from "node:assert/strict";
import test from "node:test";
import {
  checkHealthzOnly,
  evaluateHealthzJson
} from "../scripts/check-open-weight-vlm-local-model-healthz-preflight.mjs";

test("local model healthz preflight accepts sanitized safe Qwen VLM healthz", () => {
  const report = evaluateHealthzJson({
    ok: true,
    modelLoaded: true,
    modelFamily: "qwen2.5-vl",
    rawLoggingDisabled: true,
    publicExposure: "no"
  }, "local_loopback");

  assert.equal(report.healthzResultBucket, "safe");
  assert.equal(report.healthzPrerequisiteResolved, true);
  assert.equal(report.modelFamilyBucket, "qwen_vlm_compatible");
  assert.equal(report.productionReady, false);
});

test("local model healthz preflight blocks unsafe bucket conditions", () => {
  assert.equal(evaluateHealthzJson({}, "local_loopback").healthzResultBucket, "missing_ok");
  assert.equal(evaluateHealthzJson({ ok: false }, "local_loopback").healthzResultBucket, "ok_false");
  assert.equal(evaluateHealthzJson({
    ok: true,
    modelLoaded: false,
    modelFamily: "qwen2.5-vl",
    rawLoggingDisabled: true,
    publicExposure: "no"
  }, "local_loopback").healthzResultBucket, "model_not_loaded");
  assert.equal(evaluateHealthzJson({
    ok: true,
    modelLoaded: true,
    modelFamily: "text-only",
    rawLoggingDisabled: true,
    publicExposure: "no"
  }, "local_loopback").healthzResultBucket, "incompatible_model_family");
  assert.equal(evaluateHealthzJson({
    ok: true,
    modelLoaded: true,
    modelFamily: "qwen2.5-vl",
    rawLoggingDisabled: false,
    publicExposure: "no"
  }, "local_loopback").healthzResultBucket, "raw_logging_not_disabled");
  assert.equal(evaluateHealthzJson({
    ok: true,
    modelLoaded: true,
    modelFamily: "qwen2.5-vl",
    rawLoggingDisabled: true,
    publicExposure: "public"
  }, "local_loopback").healthzResultBucket, "public_exposure_not_no");
  assert.equal(evaluateHealthzJson({
    ok: true,
    modelLoaded: true,
    modelFamily: "qwen2.5-vl",
    rawLoggingDisabled: true,
    publicExposure: "no",
    productionReady: true
  }, "local_loopback").healthzResultBucket, "production_ready_true");
});

test("local model healthz preflight prints no raw endpoint on blocked fetch", async () => {
  const report = await checkHealthzOnly({
    modelServerUrl: "http://127.0.0.1:9",
    endpointBucket: "local_loopback",
    fetchImpl: async () => {
      const error = new Error("connect ECONNREFUSED 127.0.0.1");
      error.cause = { code: "ECONNREFUSED" };
      throw error;
    }
  });

  assert.equal(report.healthzResultBucket, "connection_refused");
  assert.equal(report.healthzPrerequisiteResolved, false);
  assert.equal(JSON.stringify(report).includes("127.0.0.1"), false);
  assert.equal(report.productionReady, false);
});
