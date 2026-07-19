import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import {
  buildSanitizedFilterLabAnalysisArtifact,
  FILTER_LAB_ANALYSIS_ARTIFACT_SCHEMA_VERSION,
  persistSanitizedFilterLabAnalysisArtifact
} from "../src/artifacts/filterLabSanitizedAnalysisArtifact.mjs";
import { cloudAIConfig } from "../src/config/cloudAIConfig.mjs";
import { generatedFilterRecipeExampleCandidate } from "../src/providers/generatedFilterRecipeContract.mjs";
import { handleFilterLabRequest } from "../src/routes/filterLab.mjs";
import { resetDevRateLimitForTests } from "../src/security/rateLimit.mjs";

test("sanitized Filter Lab analysis persistence is explicit opt-in", () => {
  assert.equal(cloudAIConfig({}).saveSanitizedFilterLabAnalysis, false);
  assert.equal(cloudAIConfig({ FILTER_LAB_SAVE_SANITIZED_ANALYSIS: "false" }).saveSanitizedFilterLabAnalysis, false);
  assert.equal(cloudAIConfig({ FILTER_LAB_SAVE_SANITIZED_ANALYSIS: "true" }).saveSanitizedFilterLabAnalysis, true);
});

test("sanitized Filter Lab artifact contains only normalized recipe and privacy-safe metadata", () => {
  const artifact = buildSanitizedFilterLabAnalysisArtifact({
    providerKind: "siliconflowInternal",
    recipe: generatedFilterRecipeExampleCandidate(),
    attempts: 1,
    latencyMs: 4200,
    createdAt: new Date("2026-07-19T02:03:04.000Z")
  });

  assert.equal(artifact.schemaVersion, FILTER_LAB_ANALYSIS_ARTIFACT_SCHEMA_VERSION);
  assert.equal(artifact.providerModeBucket, "siliconflow_internal");
  assert.equal(artifact.attemptsBucket, "single_attempt");
  assert.equal(artifact.latencyBucket, "lte_5s");
  assert.deepEqual(artifact.normalizedRecipe.parameters, generatedFilterRecipeExampleCandidate().parameters);
  assert.equal(artifact.normalizedRecipe.recipeVersion, "1.1");
  assert.equal(artifact.normalizedRecipe.confidenceBucket, "medium");
  assert.equal("id" in artifact.normalizedRecipe, false);
  assert.equal("confidence" in artifact.normalizedRecipe, false);
  assert.deepEqual(artifact.privacy, {
    imageIncluded: false,
    imageBase64Included: false,
    rawPromptIncluded: false,
    rawRequestIncluded: false,
    rawProviderResponseIncluded: false,
    authorizationHeaderIncluded: false,
    apiKeyIncluded: false
  });
  assert.equal(artifact.productionReady, false);
  assert.equal("image" in artifact, false);
  assert.equal("prompt" in artifact, false);
  assert.equal("request" in artifact, false);
  assert.equal("providerResponse" in artifact, false);
  assert.equal("authorization" in artifact, false);
  assert.equal("apiKey" in artifact, false);
});

test("sanitized Filter Lab artifact writer creates one ignored JSON analysis file", async () => {
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "filter-lab-analysis-test-"));
  const directoryURL = pathToFileURL(`${temporaryDirectory}${path.sep}`);

  try {
    const result = await persistSanitizedFilterLabAnalysisArtifact({
      providerKind: "xiaoyiRelayInternal",
      recipe: generatedFilterRecipeExampleCandidate(),
      attempts: 2,
      latencyMs: 16000,
      directoryURL,
      now: () => new Date("2026-07-19T02:03:04.000Z"),
      createID: () => "test-id"
    });
    const persisted = JSON.parse(await readFile(new URL(result.fileName, directoryURL), "utf8"));

    assert.equal(result.saved, true);
    assert.equal(persisted.providerModeBucket, "xiaoyi_relay_internal");
    assert.equal(persisted.attemptsBucket, "retry");
    assert.equal(persisted.latencyBucket, "gt_15s");
    assert.deepEqual(persisted.normalizedRecipe.parameters, generatedFilterRecipeExampleCandidate().parameters);
    assert.equal("id" in persisted.normalizedRecipe, false);
    assert.equal("confidence" in persisted.normalizedRecipe, false);
    assert.equal(persisted.privacy.rawProviderResponseIncluded, false);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("Filter Lab route saves only the validated recipe when opt-in is enabled", async () => {
  resetDevRateLimitForTests();
  const writerInputs = [];
  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider: {
      async generateFilterRecipe() {
        return generatedFilterRecipeExampleCandidate();
      }
    },
    config: {
      ...enabledSiliconFlowConfig(),
      saveSanitizedFilterLabAnalysis: true
    },
    headers: { "x-internal-debug-cloudai": "true" },
    analysisArtifactWriter: async (input) => {
      writerInputs.push(input);
      return { saved: true, schemaVersion: FILTER_LAB_ANALYSIS_ARTIFACT_SCHEMA_VERSION };
    }
  });

  assert.equal(result.status, 200);
  assert.equal(writerInputs.length, 1);
  assert.deepEqual(writerInputs[0].recipe, result.body.generatedFilter);
  assert.equal("requestBody" in writerInputs[0], false);
  assert.equal("image" in writerInputs[0], false);
  assert.equal("rawProviderResponse" in writerInputs[0], false);
  assert.equal(result.metadata.analysisArtifact.saved, true);
});

test("Filter Lab route does not invoke the artifact writer by default", async () => {
  resetDevRateLimitForTests();
  let writerCalls = 0;
  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider: {
      async generateFilterRecipe() {
        return generatedFilterRecipeExampleCandidate();
      }
    },
    config: enabledSiliconFlowConfig(),
    headers: { "x-internal-debug-cloudai": "true" },
    analysisArtifactWriter: async () => {
      writerCalls += 1;
    }
  });

  assert.equal(result.status, 200);
  assert.equal(writerCalls, 0);
  assert.equal("analysisArtifact" in result.metadata, false);
});

test("Filter Lab route never persists a provider candidate that fails recipe validation", async () => {
  resetDevRateLimitForTests();
  let writerCalls = 0;
  const result = await handleFilterLabRequest(validFilterLabRequest(), {
    provider: {
      async generateFilterRecipe() {
        return {
          ...generatedFilterRecipeExampleCandidate(),
          source: "provider_debug"
        };
      }
    },
    config: {
      ...enabledSiliconFlowConfig(),
      saveSanitizedFilterLabAnalysis: true
    },
    headers: { "x-internal-debug-cloudai": "true" },
    analysisArtifactWriter: async () => {
      writerCalls += 1;
    }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.mode, "unavailable");
  assert.equal(result.body.generatedFilter, null);
  assert.equal(result.body.error.code, "provider_invalid_schema");
  assert.equal(writerCalls, 0);
  assert.equal("analysisArtifact" in result.metadata, false);
});

function enabledSiliconFlowConfig() {
  return {
    providerMode: "siliconflowInternal",
    allowInternalCloudAI: true,
    siliconFlowAPIKey: "test-key",
    siliconFlowBaseURL: "https://api.siliconflow.com",
    siliconFlowChatCompletionsPath: "/v1/chat/completions",
    siliconFlowFilterLabModel: "Qwen/Qwen3-VL-32B-Instruct",
    saveSanitizedFilterLabAnalysis: false
  };
}

function validFilterLabRequest() {
  return {
    schemaVersion: "1.0",
    feature: "filter_lab",
    mode: "reference_image",
    locale: "zh-Hant-HK",
    consent: {
      imageUploadAccepted: true,
      consentVersion: "2026-06-21.pt2.xiaoyi.v1"
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
