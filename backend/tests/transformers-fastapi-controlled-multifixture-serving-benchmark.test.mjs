import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Transformers FastAPI controlled multi-fixture serving benchmark script is tightly guarded", async () => {
  const script = await readFile(
    new URL("../scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs", import.meta.url),
    "utf8"
  );

  assert.match(script, /--approved-controlled-benchmark/u);
  assert.match(script, /--serving-stack/u);
  assert.match(script, /transformers_fastapi_reference/u);
  assert.match(script, /--fixtures/u);
  assert.match(script, /smoke_004/u);
  assert.match(script, /smoke_015/u);
  assert.match(script, /blocked_for_smoke001_not_allowed/u);
  assert.match(script, /blocked_for_duplicate_fixture_token/u);
  assert.match(script, /blocked_for_fixture_token_set_mismatch/u);
  assert.match(script, /--call-count/u);
  assert.match(script, /APPROVED_FIXTURE_TOKENS\.length/u);
  assert.match(script, /--no-retry/u);
  assert.match(script, /controlled_multifixture_serving_benchmark/u);
  assert.match(script, /validateOpenWeightVlmPhotoAdvisorCandidate/u);
  assert.match(script, /rawOutputPersisted:\s*false/u);
  assert.match(script, /rawOutputPrinted:\s*false/u);
  assert.match(script, /rawPromptPersisted:\s*false/u);
  assert.match(script, /rawPayloadPersisted:\s*false/u);
  assert.match(script, /productionReady:\s*false/u);
  assert.doesNotMatch(script, /console\.log\(.*modelServerUrl/u);
  assert.doesNotMatch(script, /console\.log\(.*requestBody/u);
});
