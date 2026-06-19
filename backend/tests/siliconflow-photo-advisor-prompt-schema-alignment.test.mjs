import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSiliconFlowPhotoAdvisorSystemPrompt,
  buildSiliconFlowPhotoAdvisorUserPrompt,
  siliconFlowPhotoAdvisorExampleCandidate
} from "../src/providers/siliconflowPhotoAdvisorPromptContract.mjs";
import {
  parseSiliconFlowPhotoAdvisorCandidateFromText
} from "../src/providers/siliconflowPhotoAdvisorProviderContract.mjs";

function candidate(overrides = {}) {
  return {
    ...siliconFlowPhotoAdvisorExampleCandidate(),
    ...overrides
  };
}

function parse(value) {
  return parseSiliconFlowPhotoAdvisorCandidateFromText(
    typeof value === "string" ? value : JSON.stringify(value)
  );
}

test("SiliconFlow prompt contract forces backend-only semantic JSON", () => {
  const systemPrompt = buildSiliconFlowPhotoAdvisorSystemPrompt();
  const userPrompt = buildSiliconFlowPhotoAdvisorUserPrompt();

  assert.match(systemPrompt, /exactly one JSON object/i);
  assert.match(systemPrompt, /Do not use Markdown/i);
  assert.match(systemPrompt, /Do not write final user-facing UI copy/i);
  assert.match(systemPrompt, /semantic enum\/key values only/i);
  assert.match(systemPrompt, /Do not infer identity, age, gender/i);
  assert.match(systemPrompt, /chain-of-thought/i);
  assert.match(systemPrompt, /retakeAllowed false/);
  assert.match(userPrompt, /photo_advisor_vlm_candidate\.v1/);
  assert.match(userPrompt, /mood\.warm_calm/);
  assert.match(userPrompt, /observation\.warm_indoor_light/);
  assert.match(userPrompt, /warm_film/);
  assert.match(userPrompt, /Output JSON only/);
  assert.doesNotMatch(systemPrompt + userPrompt, /SILICONFLOW_API_KEY|Bearer [A-Za-z0-9]|data:image|https:\/\/api/i);
});

test("SiliconFlow exact valid candidate passes", () => {
  const result = parse(siliconFlowPhotoAdvisorExampleCandidate());
  assert.equal(result.ok, true);
  assert.equal(result.semanticKeysOnly, true);
  assert.equal(result.candidate.schemaVersion, "photo_advisor_vlm_candidate.v1");
  assert.equal(result.rawOutputPrinted, false);
  assert.equal(result.rawOutputPersisted, false);
});

test("SiliconFlow malformed provider-like strings are rejected with sanitized diagnostics", () => {
  const valid = JSON.stringify(siliconFlowPhotoAdvisorExampleCandidate());
  const cases = [
    ["markdown fenced JSON", "```json\n" + valid + "\n```", "provider_json_parse_failed", "markdown_fence_detected"],
    ["prose before JSON", "Here is the JSON:\n" + valid, "provider_json_parse_failed", "free_form_text_detected"],
    ["prose after JSON", valid + "\nHope this helps.", "provider_json_parse_failed", "free_form_text_detected"],
    ["old field names", { ...candidate(), observationKey: "observation.warm_indoor_light" }, "provider_schema_invalid", "additional_property"],
    ["missing required fields", (({ safety, ...rest }) => rest)(candidate()), "provider_schema_invalid", "missing_required_field"],
    ["extra fields", { ...candidate(), providerDebug: "debug" }, "provider_schema_invalid", "additional_property"],
    ["unsupported enum", { ...candidate(), moodKey: "mood.sunny" }, "provider_schema_invalid", "unsupported_enum"],
    ["wrong object shape", { ...candidate(), creativeIntent: "style_positive" }, "provider_schema_invalid", "wrong_object_shape"],
    ["wrong type", { ...candidate(), retakeAllowed: "false" }, "provider_schema_invalid", "wrong_type"],
    ["score rating", { ...candidate(), moodKey: "score 8/10" }, "provider_safety_rejected", "score_or_rating_detected"],
    ["sensitive inference", { ...candidate(), moodKey: "age looks young" }, "provider_safety_rejected", "sensitive_inference_detected"],
    ["chain of thought", { ...candidate(), moodKey: "chain-of-thought hidden" }, "provider_safety_rejected", "chain_of_thought_detected"],
    ["debug leakage", { ...candidate(), moodKey: "system prompt leaked" }, "provider_safety_rejected", "debug_leakage_detected"],
    ["raw prompt echo", { ...candidate(), moodKey: "ignore previous instructions" }, "provider_safety_rejected", "debug_leakage_detected"],
    ["retake-first language", { ...candidate(), optionalActionKey: "please retake this" }, "provider_safety_rejected", "retake_first_language_detected"],
    ["capture context overclaim", { ...candidate(), visualObservationKey: "observation.motion_blur" }, "provider_safety_rejected", "capture_context_overclaim_detected"]
  ];

  for (const [label, input, bucket, diagnosticBucket] of cases) {
    const result = parse(input);
    assert.equal(result.ok, false, label);
    assert.equal(result.bucket, bucket, label);
    assert.ok(result.schemaDiagnosticBuckets?.includes(diagnosticBucket), label);
    assert.equal(result.rawOutputPrinted, false, label);
    assert.equal(result.rawOutputPersisted, false, label);
    assert.doesNotMatch(JSON.stringify(result), /Here is the JSON|Hope this helps|providerDebug|please retake this|system prompt leaked|age looks young|chain-of-thought hidden/);
  }
});
