import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  buildSiliconFlowPhotoAdvisorImageQARequest,
  parseSiliconFlowPhotoAdvisorImageQAArgs,
  runSiliconFlowPhotoAdvisorImageQA
} from "../src/qa/siliconFlowPhotoAdvisorImageQAGate.mjs";
import { validSyntheticPhotoAdvisorCandidate } from "../src/providers/siliconflowPhotoAdvisorProviderContract.mjs";

test("siliconflow image QA defaults to dry-run without network or image reads", async () => {
  let fetchCalls = 0;
  let readCalls = 0;
  const report = await runSiliconFlowPhotoAdvisorImageQA({
    args: [],
    env: {},
    listSamplesImpl: async () => [sample()],
    readFileImpl: async () => {
      readCalls += 1;
      return Buffer.from("should not be read");
    },
    fetchImpl: async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }
  });

  assert.equal(report.ok, true);
  assert.equal(report.runMode, "dry_run_gate");
  assert.equal(fetchCalls, 0);
  assert.equal(readCalls, 0);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.imageUploadAttempted, false);
  assert.equal(report.productionReady, false);
});

test("siliconflow image QA blocks provider run without samples", async () => {
  let fetchCalls = 0;
  const report = await runSiliconFlowPhotoAdvisorImageQA({
    args: ["--run-provider"],
    env: configuredEnv(),
    listSamplesImpl: async () => [],
    fetchImpl: async () => {
      fetchCalls += 1;
      throw new Error("network should not be called");
    }
  });

  assert.equal(report.ok, false);
  assert.equal(report.runMode, "provider_image_qa_blocked");
  assert.equal(fetchCalls, 0);
  assert.ok(report.hardBlockers.includes("no_approved_or_synthetic_samples"));
  assert.equal(report.imageUploadAttempted, false);
  assert.equal(report.productionReady, false);
});

test("siliconflow image QA sends one sanitized image-url request and accepts schema output", async () => {
  let capturedURL;
  let capturedRequest;
  let capturedHeaders;
  let readCalls = 0;
  let tick = 0;

  const report = await runSiliconFlowPhotoAdvisorImageQA({
    args: ["--run-provider", "--image-set=synthetic", "--limit=1", "--locale=zh-Hant"],
    env: configuredEnv(),
    listSamplesImpl: async () => [sample()],
    readFileImpl: async () => {
      readCalls += 1;
      return Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
    },
    now: () => {
      tick += 500;
      return tick;
    },
    fetchImpl: async (url, request) => {
      capturedURL = url;
      capturedHeaders = request.headers;
      capturedRequest = JSON.parse(request.body);
      return okJSON({
        choices: [
          {
            message: {
              content: JSON.stringify(validSyntheticPhotoAdvisorCandidate())
            }
          }
        ]
      });
    }
  });

  assert.equal(readCalls, 1);
  assert.equal(capturedURL, "https://api.siliconflow.com/v1/chat/completions");
  assert.equal(capturedHeaders.Authorization, "Bearer local-test-key");
  assert.equal(capturedRequest.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(capturedRequest.stream, false);
  assert.equal(capturedRequest.max_tokens, 192);
  assert.equal(capturedRequest.messages[1].content[0].type, "image_url");
  assert.match(capturedRequest.messages[1].content[0].image_url.url, /^data:image\/jpeg;base64,/);
  assert.equal(report.ok, true);
  assert.equal(report.actualCalls, 1);
  assert.equal(report.acceptedCount, 1);
  assert.equal(report.imageReadsPerformed, true);
  assert.equal(report.imageUploadAttempted, true);
  assert.equal(report.results[0].accepted, true);
  assert.equal(report.results[0].latencyBucket, "lt_1s");
  assert.doesNotMatch(JSON.stringify(report), /local-test-key|Bearer|data:image|base64|image_url|requestPayload|rawOutput/i);
  assert.equal(report.productionReady, false);
});

test("siliconflow image QA reports sanitized schema failures", async () => {
  const report = await runSiliconFlowPhotoAdvisorImageQA({
    args: ["--run-provider"],
    env: configuredEnv(),
    listSamplesImpl: async () => [sample()],
    readFileImpl: async () => Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
    fetchImpl: async () => okJSON({
      choices: [{ message: { content: "not json" } }]
    })
  });

  assert.equal(report.ok, false);
  assert.equal(report.acceptedCount, 0);
  assert.equal(report.rejectedCount, 1);
  assert.equal(report.results[0].errorBucket, "provider_json_parse_failed");
  assert.equal(report.results[0].providerTextPrinted, false);
  assert.doesNotMatch(JSON.stringify(report), /not json|data:image|base64|local-test-key|Bearer/i);
});

test("siliconflow image QA maps rejected image requests to a vision bucket", async () => {
  const report = await runSiliconFlowPhotoAdvisorImageQA({
    args: ["--run-provider"],
    env: configuredEnv(),
    listSamplesImpl: async () => [sample()],
    readFileImpl: async () => Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
    fetchImpl: async () => okJSON({}, { ok: false, status: 400 })
  });

  assert.equal(report.ok, false);
  assert.equal(report.results[0].httpStatusBucket, "4xx");
  assert.equal(report.results[0].errorBucket, "provider_vision_request_rejected");
  assert.doesNotMatch(JSON.stringify(report), /data:image|base64|local-test-key|Bearer/i);
});

test("siliconflow image QA args and request builder are bounded", () => {
  const args = parseSiliconFlowPhotoAdvisorImageQAArgs([
    "--run-provider",
    "--image-set=approved-real",
    "--limit=99",
    "--timeout-ms=999999",
    "--locale=yue-Hant-HK",
    "--model-candidate=qwen3_vl_32b_instruct"
  ]);
  const request = buildSiliconFlowPhotoAdvisorImageQARequest({
    imageDataURL: "data:image/jpeg;base64,abc",
    locale: args.locale
  });

  assert.equal(args.runProvider, true);
  assert.equal(args.imageSet, "approved-real");
  assert.equal(args.limit, 3);
  assert.equal(args.timeoutMs, 60000);
  assert.equal(args.locale, "yue-Hant-HK");
  assert.equal(args.modelCandidate, "qwen3_vl_32b_instruct");
  assert.equal(request.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(request.messages[1].content[0].image_url.detail, "low");
});

test("siliconflow image QA can use an explicit vision model candidate", async () => {
  let capturedRequest;
  const report = await runSiliconFlowPhotoAdvisorImageQA({
    args: ["--run-provider", "--model-candidate=qwen3_vl_32b_instruct"],
    env: configuredEnv(),
    listSamplesImpl: async () => [sample()],
    readFileImpl: async () => Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
    fetchImpl: async (_url, request) => {
      capturedRequest = JSON.parse(request.body);
      return okJSON({
        choices: [
          {
            message: {
              content: JSON.stringify(validSyntheticPhotoAdvisorCandidate())
            }
          }
        ]
      });
    }
  });

  assert.equal(capturedRequest.model, "Qwen/Qwen3-VL-32B-Instruct");
  assert.equal(report.ok, true);
  assert.equal(report.selectedModelCandidate, "qwen3_vl_32b_instruct");
  assert.equal(report.modelNameBucket, "qwen3_vl_32b_instruct");
  assert.equal(report.results[0].modelNameBucket, "qwen3_vl_32b_instruct");
  assert.doesNotMatch(JSON.stringify(report), /Qwen\/Qwen3-VL-32B-Instruct|data:image|base64|local-test-key|Bearer/i);
});

test("siliconflow image QA CLI dry-run is sanitized", () => {
  const output = execFileSync("node", ["scripts/run-siliconflow-photo-advisor-image-qa.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {}
  });

  assert.match(output, /"runMode": "dry_run_gate"/);
  assert.match(output, /"networkCallsMade": false/);
  assert.match(output, /"imageUploadAttempted": false/);
  assert.match(output, /"productionReady": false/);
  assert.doesNotMatch(output, /Bearer|data:image|base64|image_url|requestPayload|rawOutput|SILICONFLOW_API_KEY/i);
});

function configuredEnv() {
  return {
    SILICONFLOW_API_KEY: "local-test-key",
    SILICONFLOW_BASE_URL: "https://api.siliconflow.com",
    SILICONFLOW_CHAT_COMPLETIONS_PATH: "/v1/chat/completions",
    SILICONFLOW_MODEL: "deepseek-ai/DeepSeek-V4-Flash"
  };
}

function sample() {
  return {
    caseId: "synthetic-local-test",
    sampleType: "synthetic",
    fileURL: new URL("file:///tmp/synthetic-local-test.jpg")
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
