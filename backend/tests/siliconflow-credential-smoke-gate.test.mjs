import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  buildSiliconFlowTextOnlyCredentialRequest,
  parseSiliconFlowCredentialSmokeArgs,
  runSiliconFlowCredentialSmokeGate,
  siliconFlowCredentialSmokeConfig
} from "../src/qa/siliconFlowCredentialSmokeGate.mjs";

test("siliconflow credential smoke defaults to dry-run without network", async () => {
  let calls = 0;
  const report = await runSiliconFlowCredentialSmokeGate({
    args: [],
    env: {},
    fetchImpl: async () => {
      calls += 1;
      throw new Error("network should not be called");
    }
  });

  assert.equal(report.ok, true);
  assert.equal(report.runMode, "dry_run_gate");
  assert.equal(calls, 0);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageUploadAttempted, false);
  assert.equal(report.modelCallsMade, false);
  assert.equal(report.productionReady, false);
  assert.equal(report.rawKeyPrinted, false);
  assert.equal(report.rawPayloadPrinted, false);
  assert.equal(report.rawPromptPrinted, false);
  assert.equal(report.rawOutputPrinted, false);
});

test("siliconflow credential smoke requires explicit surface and backend key before provider run", async () => {
  let calls = 0;
  const report = await runSiliconFlowCredentialSmokeGate({
    args: ["--run-provider"],
    env: {},
    fetchImpl: async () => {
      calls += 1;
      throw new Error("network should not be called");
    }
  });

  assert.equal(report.ok, false);
  assert.equal(report.runMode, "provider_text_only_credential_smoke_blocked");
  assert.equal(calls, 0);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageUploadAttempted, false);
  assert.ok(report.hardBlockers.includes("provider_not_configured"));
  assert.ok(report.hardBlockers.includes("surface_required_for_provider_smoke"));
  assert.equal(report.productionReady, false);
});

test("siliconflow credential smoke sends one official OpenAI-compatible text-only request", async () => {
  let capturedURL;
  let capturedRequest;
  let capturedHeaders;
  let calls = 0;
  let tick = 0;

  const report = await runSiliconFlowCredentialSmokeGate({
    args: ["--run-provider", "--surface=photo-analysis"],
    env: configuredEnv(),
    now: () => {
      tick += 250;
      return tick;
    },
    fetchImpl: async (url, request) => {
      calls += 1;
      capturedURL = url;
      capturedHeaders = request.headers;
      capturedRequest = JSON.parse(request.body);
      return okJSON({
        choices: [
          {
            message: {
              content: JSON.stringify({
                ok: true,
                surface: "photo_analysis",
                provider: "siliconflow",
                model: "deepseek-ai/DeepSeek-V4-Flash"
              })
            }
          }
        ]
      });
    }
  });

  assert.equal(report.ok, true);
  assert.equal(report.runMode, "provider_text_only_credential_smoke");
  assert.equal(calls, 1);
  assert.equal(capturedURL, "https://api.siliconflow.com/v1/chat/completions");
  assert.equal(capturedHeaders.Authorization, "Bearer local-test-key");
  assert.equal(capturedRequest.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(capturedRequest.stream, false);
  assert.equal(capturedRequest.max_tokens, 80);
  assert.equal("response_format" in capturedRequest, false);
  assert.equal(JSON.stringify(capturedRequest).includes("image_url"), false);
  assert.equal(JSON.stringify(capturedRequest).includes("data:image"), false);
  assert.equal(report.actualCalls, 1);
  assert.equal(report.acceptedCount, 1);
  assert.equal(report.rejectedCount, 0);
  assert.equal(report.networkCallsMade, true);
  assert.equal(report.imageUploadAttempted, false);
  assert.equal(report.modelCallsMade, 1);
  assert.equal(report.results[0].latencyBucket, "lt_1s");
  assert.equal(report.productionReady, false);
  assert.doesNotMatch(JSON.stringify(report), /local-test-key|Bearer|requestPayload":|"rawOutput":|image_url|data:image/);
});

test("siliconflow credential smoke can explicitly select both surfaces", async () => {
  const seenSurfaces = [];
  const report = await runSiliconFlowCredentialSmokeGate({
    args: ["--run-provider", "--surface=both"],
    env: configuredEnv(),
    fetchImpl: async (_url, request) => {
      const body = JSON.parse(request.body);
      const surface = body.messages[1].content.includes("generated_filter")
        ? "generated_filter"
        : "photo_analysis";
      seenSurfaces.push(surface);
      return okJSON({
        choices: [
          {
            message: {
              content: JSON.stringify({
                ok: true,
                surface,
                provider: "siliconflow",
                model: "deepseek-ai/DeepSeek-V4-Flash"
              })
            }
          }
        ]
      });
    }
  });

  assert.deepEqual(seenSurfaces, ["photo_analysis", "generated_filter"]);
  assert.equal(report.plannedCalls, 2);
  assert.equal(report.actualCalls, 2);
  assert.equal(report.acceptedCount, 2);
  assert.equal(report.imageUploadAttempted, false);
  assert.equal(report.productionReady, false);
});

test("siliconflow credential smoke reports sanitized provider failures", async () => {
  const report = await runSiliconFlowCredentialSmokeGate({
    args: ["--run-provider", "--surface=filter-lab"],
    env: configuredEnv(),
    fetchImpl: async () => okJSON({ error: "secret raw body should not be read" }, { ok: false, status: 401 })
  });

  assert.equal(report.ok, false);
  assert.equal(report.actualCalls, 1);
  assert.equal(report.acceptedCount, 0);
  assert.equal(report.rejectedCount, 1);
  assert.equal(report.results[0].surface, "generated_filter");
  assert.equal(report.results[0].httpStatusBucket, "auth_failed");
  assert.equal(report.results[0].errorBucket, "provider_auth_failed");
  assert.equal(report.rawOutputPrinted, false);
  assert.doesNotMatch(JSON.stringify(report), /secret raw body|Bearer|local-test-key/);
});

test("siliconflow credential smoke CLI dry-run is sanitized", () => {
  const output = execFileSync("node", ["scripts/run-siliconflow-credential-smoke.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {}
  });

  assert.match(output, /"runMode": "dry_run_gate"/);
  assert.match(output, /"networkCallsMade": false/);
  assert.match(output, /"imageUploadAttempted": false/);
  assert.match(output, /"productionReady": false/);
  assert.doesNotMatch(output, /Bearer|data:image|requestPayload":|"rawOutput":|"authorization"/i);
});

test("siliconflow credential smoke request builder and config are doc-aligned", () => {
  const args = parseSiliconFlowCredentialSmokeArgs(["--run-provider", "--surface=filter-lab", "--timeout-ms=3000"]);
  const config = siliconFlowCredentialSmokeConfig({
    SILICONFLOW_API_KEY: "local-test-key",
    SILICONFLOW_BASE_URL: "https://api.siliconflow.com/v1",
    SILICONFLOW_CHAT_COMPLETIONS_PATH: "/v1/chat/completions"
  }, args);
  const request = buildSiliconFlowTextOnlyCredentialRequest("generated_filter");

  assert.equal(args.runProvider, true);
  assert.equal(args.surface, "generated_filter");
  assert.equal(args.timeoutMs, 3000);
  assert.equal(config.baseURL, "https://api.siliconflow.com");
  assert.equal(config.path, "/v1/chat/completions");
  assert.equal(config.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(request.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(request.max_tokens, 80);
  assert.equal("response_format" in request, false);
  assert.equal(JSON.stringify(request).includes("image_url"), false);
  assert.equal(JSON.stringify(request).includes("data:image"), false);
});

function configuredEnv() {
  return {
    SILICONFLOW_API_KEY: "local-test-key",
    SILICONFLOW_BASE_URL: "https://api.siliconflow.com",
    SILICONFLOW_CHAT_COMPLETIONS_PATH: "/v1/chat/completions",
    SILICONFLOW_MODEL: "deepseek-ai/DeepSeek-V4-Flash"
  };
}

function okJSON(payload, overrides = {}) {
  return {
    ok: overrides.ok ?? true,
    status: overrides.status ?? 200,
    async json() {
      return payload;
    }
  };
}
