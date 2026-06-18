import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Transformers FastAPI one-fixture serving benchmark script is tightly guarded", async () => {
  const script = await readFile(
    new URL("../scripts/run-open-weight-vlm-transformers-fastapi-one-fixture-serving-benchmark.mjs", import.meta.url),
    "utf8"
  );

  assert.match(script, /--approved-one-call/u);
  assert.match(script, /--serving-stack/u);
  assert.match(script, /transformers_fastapi_reference/u);
  assert.match(script, /--fixture/u);
  assert.match(script, /smoke_001/u);
  assert.match(script, /--call-count/u);
  assert.match(script, /parsed\.callCount !== 1/u);
  assert.match(script, /--no-retry/u);
  assert.match(script, /one_fixture_serving_benchmark/u);
  assert.match(script, /runOpenWeightVlmLocalSandboxSmoke/u);
  assert.match(script, /runLocalModel:\s*true/u);
  assert.match(script, /rawOutputPersisted:\s*false/u);
  assert.match(script, /rawOutputPrinted:\s*false/u);
  assert.match(script, /rawPromptPersisted:\s*false/u);
  assert.match(script, /rawPayloadPersisted:\s*false/u);
  assert.match(script, /productionReady:\s*false/u);
  assert.doesNotMatch(script, /console\.log\(.*modelServerUrl/u);
  assert.doesNotMatch(script, /console\.log\(.*requestBody/u);
});
