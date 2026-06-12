import assert from "node:assert/strict";
import test from "node:test";
import { healthResponse } from "../src/routes/health.mjs";
import { handlePhotoAdvisorRequest } from "../src/routes/photoAdvisor.mjs";
import { providerBoundaryStatus } from "../src/providers/providerTypes.mjs";

test("health returns mock-only status", () => {
  assert.deepEqual(healthResponse(), {
    ok: true,
    service: "cloud-ai-boundary",
    mode: "mock-only"
  });
});

test("photo advisor returns structured mock response", () => {
  const result = handlePhotoAdvisorRequest(validRequest());

  assert.equal(result.status, 200);
  assert.equal(result.body.schemaVersion, "1.0");
  assert.equal(result.body.mode, "post_capture");
  assert.equal(result.body.source, "mock");
  assert.equal(result.body.safety.containsSensitiveInference, false);
  assert.equal(result.body.recommendedFilters[0].filterId, "instant_dream");
});

test("photo advisor requires consent", () => {
  const request = validRequest();
  request.consent.imageUploadAccepted = false;

  const result = handlePhotoAdvisorRequest(request);

  assert.equal(result.status, 400);
  assert.equal(result.body.error.code, "consent_required");
});

test("photo advisor rejects unsupported schema version", () => {
  const request = validRequest();
  request.schemaVersion = "2.0";

  const result = handlePhotoAdvisorRequest(request);

  assert.equal(result.status, 400);
  assert.equal(result.body.error.code, "unsupported_schema_version");
});

test("provider key is not required", () => {
  assert.deepEqual(providerBoundaryStatus(), {
    mode: "mock-only",
    providerCallsEnabled: false,
    providerKeyRequired: false
  });
});

function validRequest() {
  return {
    schemaVersion: "1.0",
    feature: "photo_advisor",
    mode: "post_capture",
    locale: "zh-Hant-HK",
    selectedFilterId: "instant_dream",
    consent: {
      imageUploadAccepted: true,
      consentVersion: "2026-06-12.phase17a.v1"
    },
    image: {
      contentType: "image/jpeg",
      width: 1024,
      height: 768,
      metadataStripped: true,
      dataBase64: ""
    }
  };
}
