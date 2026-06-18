import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("approved one-fixture local model smoke retry script is explicitly guarded", async () => {
  const script = await readFile(
    new URL("../scripts/run-open-weight-vlm-approved-one-fixture-local-model-smoke-retry.mjs", import.meta.url),
    "utf8"
  );

  assert.match(script, /--approved-one-call/u);
  assert.match(script, /--fixture/u);
  assert.match(script, /smoke_001/u);
  assert.match(script, /--no-retry/u);
  assert.match(script, /runOpenWeightVlmLocalSandboxSmoke/u);
  assert.match(script, /rawOutputPersisted:\s*false/u);
  assert.match(script, /rawOutputPrinted:\s*false/u);
  assert.doesNotMatch(script, /console\.log\(.*modelServerUrl/u);
});
