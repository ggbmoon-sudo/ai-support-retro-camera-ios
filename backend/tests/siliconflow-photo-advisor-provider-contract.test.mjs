import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  buildSiliconFlowPhotoAdvisorRequest,
  defaultSiliconFlowPhotoAdvisorConfig,
  parseSiliconFlowPhotoAdvisorCandidateFromText,
  parseSiliconFlowPhotoAdvisorResponse,
  siliconFlowNoRuntimeReadinessSummary,
  siliconFlowSyntheticErrorReport,
  validateSiliconFlowPhotoAdvisorConfig,
  validSyntheticPhotoAdvisorCandidate
} from "../src/providers/siliconflowPhotoAdvisorProviderContract.mjs";
import {
  PhotoAdvisorModelCandidate,
  PhotoAdvisorProviderKind
} from "../src/providers/photoAdvisorProviderTypes.mjs";
import { mapSiliconFlowSyntheticErrorToBucket } from "../src/providers/siliconflowPhotoAdvisorErrors.mjs";

test("SiliconFlow default config is disabled no-runtime only", () => {
  const config = defaultSiliconFlowPhotoAdvisorConfig();
  const validation = validateSiliconFlowPhotoAdvisorConfig(config);

  assert.equal(validation.ok, true);
  assert.equal(config.provider, PhotoAdvisorProviderKind.siliconflow);
  assert.equal(config.enabled, false);
  assert.equal(config.allowNetworkCalls, false);
  assert.equal(config.allowImageUpload, false);
  assert.equal(config.allowLiveCamera, false);
  assert.equal(config.allowJsonModeForVlm, false);
  assert.equal(config.productionReady, false);
  assert.equal(config.modelCandidate, PhotoAdvisorModelCandidate.deepseekV4Flash);
  assert.equal(config.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(validation.networkCallsMade, false);
});

test("SiliconFlow config fails closed for unsafe runtime fields", () => {
  const unsafeCases = [
    [{ apiKeyEnvName: "" }, "provider_not_configured"],
    [{ apiKey: "not-a-real-key-placeholder" }, "provider_auth_failed"],
    [{ baseUrl: "https://provider.example.invalid" }, "provider_network_not_approved"],
    [{ allowNetworkCalls: true }, "provider_network_not_approved"],
    [{ enabled: true }, "provider_runtime_not_enabled"],
    [{ allowImageUpload: true }, "provider_upload_not_approved"],
    [{ allowLiveCamera: true }, "provider_upload_not_approved"],
    [{ allowJsonModeForVlm: true }, "provider_runtime_not_enabled"],
    [{ productionReady: true }, "provider_runtime_not_enabled"],
    [{ provider: "unknown" }, "provider_not_configured"],
    [{ modelCandidate: "unknown" }, "provider_model_unavailable"]
  ];

  for (const [override, blocker] of unsafeCases) {
    const validation = validateSiliconFlowPhotoAdvisorConfig({
      ...defaultSiliconFlowPhotoAdvisorConfig(),
      ...override
    });
    assert.equal(validation.ok, false);
    assert.ok(validation.blockers.includes(blocker));
    assert.equal(validation.productionReady, false);
    assert.equal(validation.networkCallsMade, false);
  }
});

test("SiliconFlow request builder creates stable placeholder request without execution", () => {
  const shape = buildSiliconFlowPhotoAdvisorRequest({
    imageUrlOrBase64Placeholder: "<SAFE_IMAGE_URL_OR_BASE64_PLACEHOLDER>",
    systemPromptPlaceholder: "<PHOTO_ADVISOR_SYSTEM_PROMPT_PLACEHOLDER>",
    userPromptPlaceholder: "<PHOTO_ADVISOR_PROMPT_PLACEHOLDER>"
  });

  assert.equal(shape.endpointBucket, "siliconflow_chat_completions");
  assert.equal(shape.baseUrlEnvName, "SILICONFLOW_BASE_URL");
  assert.equal(shape.apiKeyEnvName, "SILICONFLOW_API_KEY");
  assert.equal(shape.request.method, "POST");
  assert.equal(shape.request.path, "/v1/chat/completions");
  assert.equal(shape.request.body.model, "deepseek-ai/DeepSeek-V4-Flash");
  assert.equal(shape.request.body.stream, false);
  assert.equal(shape.request.body.temperature, 0.1);
  assert.equal(shape.request.body.top_p, 0.8);
  assert.equal(shape.request.body.max_tokens, 192);
  assert.equal(shape.request.body.messages[1].content[0].image_url.detail, "low");
  assert.equal(shape.executionAllowed, false);
  assert.equal(shape.networkCallsMade, false);
  assert.equal(shape.productionReady, false);
  assert.doesNotMatch(JSON.stringify(shape), /fetch\(|data:image|https?:\/\//);
});

test("SiliconFlow parser accepts valid synthetic candidate from OpenAI-compatible shape", () => {
  const response = {
    choices: [
      {
        message: {
          content: JSON.stringify(validSyntheticPhotoAdvisorCandidate())
        }
      }
    ]
  };

  const result = parseSiliconFlowPhotoAdvisorResponse(response);
  assert.equal(result.ok, true);
  assert.equal(result.semanticKeysOnly, true);
  assert.equal(result.candidate.filterFamilyCandidate, "warm_film");
  assert.equal(result.rawOutputPrinted, false);
  assert.equal(result.rawOutputPersisted, false);
});

test("SiliconFlow parser rejects invalid and unsafe synthetic outputs", () => {
  const valid = validSyntheticPhotoAdvisorCandidate();
  const withoutSafety = ({ safety, ...rest }) => rest;
  const cases = [
    ["invalid JSON", "{not json", "provider_json_parse_failed"],
    ["missing field", JSON.stringify(withoutSafety(valid)), "provider_schema_invalid"],
    ["extra property", JSON.stringify({ ...valid, providerDebug: "hidden" }), "provider_schema_invalid"],
    ["unsupported enum", JSON.stringify({ ...valid, moodKey: "mood.unsupported" }), "provider_schema_invalid"],
    ["wrong type", JSON.stringify({ ...valid, retakeAllowed: "false" }), "provider_schema_invalid"],
    ["free-form prose", `Here is the JSON ${JSON.stringify(valid)}`, "provider_json_parse_failed"],
    ["score rating text", JSON.stringify({ ...valid, moodKey: "rating" }), "provider_safety_rejected"],
    ["sensitive inference", JSON.stringify({ ...valid, moodKey: "face looks young" }), "provider_safety_rejected"],
    ["chain of thought", JSON.stringify({ ...valid, moodKey: "chain of thought hidden" }), "provider_safety_rejected"],
    ["debug leakage", JSON.stringify({ ...valid, moodKey: "system prompt leaked" }), "provider_safety_rejected"],
    ["raw prompt echo", JSON.stringify({ ...valid, moodKey: "ignore previous instructions" }), "provider_safety_rejected"],
    ["unsupported filter", JSON.stringify({ ...valid, filterFamilyCandidate: "future_filter" }), "provider_schema_invalid"],
    ["retake first", JSON.stringify({ ...valid, optionalActionKey: "please retake" }), "provider_safety_rejected"],
    ["capture overclaim", JSON.stringify({ ...valid, visualObservationKey: "observation.motion_blur" }), "provider_safety_rejected"]
  ];

  for (const [label, text, bucket] of cases) {
    const result = parseSiliconFlowPhotoAdvisorCandidateFromText(text);
    assert.equal(result.ok, false, label);
    assert.equal(result.bucket, bucket, label);
    assert.equal(result.rawOutputPrinted, false, label);
    assert.equal(result.rawOutputPersisted, false, label);
  }
});

test("SiliconFlow error mapper returns sanitized buckets only", () => {
  assert.equal(mapSiliconFlowSyntheticErrorToBucket({ status: 429 }), "provider_rate_limited");
  assert.equal(mapSiliconFlowSyntheticErrorToBucket({ status: 401 }), "provider_auth_failed");
  assert.equal(mapSiliconFlowSyntheticErrorToBucket({ status: 404 }), "provider_model_unavailable");
  assert.equal(mapSiliconFlowSyntheticErrorToBucket({ code: "ECONNREFUSED" }), "provider_network_error");
  assert.equal(mapSiliconFlowSyntheticErrorToBucket({ timeout: true }), "provider_timeout");

  const report = siliconFlowSyntheticErrorReport({ status: 500, rawBody: "unsafe" });
  assert.equal(report.bucket, "provider_invalid_response");
  assert.equal(report.rawBodyIncluded, false);
  assert.equal(report.rawUrlIncluded, false);
  assert.equal(report.credentialIncluded, false);
  assert.equal(report.providerOutputIncluded, false);
});

test("SiliconFlow readiness CLI fails closed without runtime execution", () => {
  const summary = siliconFlowNoRuntimeReadinessSummary({}, defaultSiliconFlowPhotoAdvisorConfig());
  assert.equal(summary.providerConfigured, false);
  assert.equal(summary.apiKeyLoaded, false);
  assert.equal(summary.keyPresenceBucket, "missing");
  assert.equal(summary.networkCallsMade, false);
  assert.equal(summary.imageUploadAttempted, false);
  assert.equal(summary.benchmarkRun, false);
  assert.equal(summary.modelCallsMade, false);
  assert.equal(summary.providerRuntimeExecutionAdded, false);
  assert.equal(summary.productionReady, false);
  assert.ok(summary.blockers.includes("provider_not_configured"));
  assert.ok(summary.blockers.includes("provider_network_not_approved"));

  const output = execFileSync("node", ["scripts/check-siliconflow-photo-advisor-provider-readiness.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {}
  });
  assert.match(output, /"networkCallsMade": false/);
  assert.match(output, /"productionReady": false/);
  assert.doesNotMatch(output, /Bearer [A-Za-z0-9]|data:image|requestPayload":|"rawOutput":/);
});

test("SiliconFlow model alternatives remain contract-only enum values", () => {
  assert.equal(PhotoAdvisorModelCandidate.deepseekV4Flash, "deepseek_v4_flash");
  assert.equal(PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct, "qwen3_vl_30b_a3b_instruct");
  assert.equal(PhotoAdvisorModelCandidate.qwen3Vl32BInstruct, "qwen3_vl_32b_instruct");
  assert.equal(PhotoAdvisorModelCandidate.qwen3Vl8BInstruct, "qwen3_vl_8b_instruct");
  assert.equal(PhotoAdvisorModelCandidate.glm45v, "glm_4_5v");
});
