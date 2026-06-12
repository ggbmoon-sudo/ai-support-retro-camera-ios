import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { healthResponse } from "../src/routes/health.mjs";
import { handlePhotoAdvisorRequest } from "../src/routes/photoAdvisor.mjs";
import { executableProviderKinds } from "../src/providers/ProviderRegistry.mjs";
import { providerBoundaryStatus } from "../src/providers/providerTypes.mjs";
import { validateCloudAIResponse } from "../src/validators/validateCloudAIResponse.mjs";
import { validatePhotoAdvisorRequest } from "../src/validators/validatePhotoAdvisorRequest.mjs";
import { safeErrorMetadata } from "../src/logging/safeLog.mjs";

test("health returns mock-only status", () => {
  assert.deepEqual(healthResponse(), {
    ok: true,
    service: "cloud-ai-boundary",
    mode: "mock-only"
  });
});

test("photo advisor accepts valid debug request", async () => {
  const result = await handlePhotoAdvisorRequest(await fixture("photo-advisor-valid-request.json"));

  assert.equal(result.status, 200);
  assert.equal(result.body.schemaVersion, "1.0");
  assert.equal(result.body.mode, "post_capture");
  assert.equal(result.body.source, "mock");
  assert.equal(result.body.safety.containsSensitiveInference, false);
  assert.equal(result.body.recommendedFilters[0].filterId, "instant_dream");
});

test("photo advisor rejects missing consent with structured fallback", async () => {
  const result = await handlePhotoAdvisorRequest(await fixture("photo-advisor-missing-consent.json"));

  assert.equal(result.status, 400);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.error.code, "invalid_request");
});

test("photo advisor rejects bad schema version", async () => {
  const result = await handlePhotoAdvisorRequest(await fixture("photo-advisor-invalid-schema-version.json"));

  assert.equal(result.status, 400);
  assert.equal(result.body.error.code, "invalid_request");
});

test("photo advisor rejects oversized image", () => {
  const request = validRequest();
  request.image.dataBase64 = "A".repeat(96_004);

  const result = validatePhotoAdvisorRequest(request);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "payload_too_large");
});

test("photo advisor rejects invalid selected filter id", () => {
  const request = validRequest();
  request.selectedFilterId = "provider_made_this_up";

  const result = validatePhotoAdvisorRequest(request);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_filter_id");
});

test("cloud ai response validator accepts valid response", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-valid-response.json"));

  assert.equal(result.ok, true);
});

test("cloud ai response validator rejects too many suggestions", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-too-many-suggestions.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "invalid_suggestions");
});

test("cloud ai response validator rejects invalid filter id", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-invalid-filter-response.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unknown_filter_id");
});

test("cloud ai response validator rejects unsafe text", async () => {
  const result = validateCloudAIResponse(await fixture("cloud-ai-unsafe-response.json"));

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unsafe_response");
});

test("unsafe provider output maps to fallback response", async () => {
  const provider = {
    async analyzePhotoAdvisor() {
      return fixture("cloud-ai-unsafe-response.json");
    }
  };

  const result = await handlePhotoAdvisorRequest(validRequest(), { provider });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.source, "fallback");
  assert.equal(result.body.error.code, "unsafe_response");
  assert.equal(JSON.stringify(result.body).includes("你樣衰"), false);
});

test("provider key is not required and mock provider is the only active path", () => {
  assert.deepEqual(providerBoundaryStatus(), {
    mode: "mock-only",
    executableProviders: ["mock", "disabled"],
    providerCallsEnabled: false,
    providerKeyRequired: false
  });
  assert.deepEqual(executableProviderKinds(), ["mock", "disabled"]);
});

test("safe logging metadata does not include payload fields", () => {
  const metadata = safeErrorMetadata({
    endpoint: "/v1/ai/photo-advisor",
    mode: "post_capture",
    schemaVersion: "1.0",
    status: 400,
    latencyMs: 12,
    image: { width: 1024, height: 768 },
    errorCode: "invalid_request",
    providerKind: "mock"
  });

  assert.deepEqual(Object.keys(metadata).sort(), [
    "endpoint",
    "errorCode",
    "imageSizeBucket",
    "latencyMs",
    "mode",
    "providerKind",
    "schemaVersion",
    "status"
  ].sort());
  assert.equal("dataBase64" in metadata, false);
  assert.equal("requestBody" in metadata, false);
});

async function fixture(name) {
  const json = await readFile(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
  return JSON.parse(json);
}

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
      dataBase64: "/9j/"
    },
    client: {
      platform: "iOS",
      appVersion: "debug"
    }
  };
}
