import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateCompositionPlanCandidate
} from "../src/providers/compositionPlannerContract.mjs";
import {
  handleCompositionPlannerRequest,
  resolveCompositionPlannerProviderKind
} from "../src/routes/compositionPlanner.mjs";
import { ProviderKind } from "../src/providers/ProviderRegistry.mjs";
import { validateCompositionPlannerRequest } from "../src/validators/validateCompositionPlannerRequest.mjs";

const VALID_PLAN = Object.freeze({
  schemaVersion: "1.0",
  sceneFamily: "pet",
  policy: "thirds",
  targetHorizontal: "left",
  targetVertical: "middle",
  targetSize: "medium",
  distanceAction: "hold",
  focalSuggestion: "current",
  reasonCode: "subject_emphasis",
  confidence: "medium"
});

const VALID_REQUEST = Object.freeze({
  schemaVersion: "1.0",
  feature: "composition_planner",
  mode: "one_shot_pre_capture",
  locale: "zh-Hant-HK",
  consent: {
    imageUploadAccepted: true,
    consentVersion: "2026-07-20.phase24.v1"
  },
  localContext: {
    subjectKind: "salient_object",
    subjectCount: "single",
    lensBucket: "standard"
  },
  image: {
    contentType: "image/jpeg",
    width: 2,
    height: 2,
    metadataStripped: true,
    dataBase64: "/9j/2Q=="
  }
});

const READY_CONFIG = Object.freeze({
  providerMode: ProviderKind.xiaoyiLunaInternal,
  allowInternalCloudAI: true,
  internalDebugToken: "",
  xiaoyiAPIKey: "test-only",
  xiaoyiBaseURL: "https://xiaoyiapi.xyz",
  xiaoyiChatCompletionsPath: "/v1/chat/completions",
  xiaoyiCompositionPlannerModel: "gpt-5.6-luna"
});

test("composition plan accepts the strict enum-only contract", () => {
  const result = validateCompositionPlanCandidate(VALID_PLAN);
  assert.equal(result.ok, true);
  assert.deepEqual(result.value, VALID_PLAN);
});

test("composition plan rejects extra fields and inconsistent centered targets", () => {
  assert.equal(validateCompositionPlanCandidate({ ...VALID_PLAN, explanation: "free text" }).ok, false);
  assert.equal(validateCompositionPlanCandidate({
    ...VALID_PLAN,
    policy: "centered",
    targetHorizontal: "left"
  }).ok, false);
});

test("composition planner request requires explicit consent and bounded context", () => {
  assert.equal(validateCompositionPlannerRequest(VALID_REQUEST).ok, true);
  assert.equal(validateCompositionPlannerRequest({
    ...VALID_REQUEST,
    consent: { ...VALID_REQUEST.consent, imageUploadAccepted: false }
  }).error.code, "consent_required");
  assert.equal(validateCompositionPlannerRequest({
    ...VALID_REQUEST,
    localContext: { ...VALID_REQUEST.localContext, identity: "not-allowed" }
  }).error.code, "invalid_local_context");
});

test("composition planner is Xiaoyi Luna internal/debug only", () => {
  assert.equal(resolveCompositionPlannerProviderKind({
    config: READY_CONFIG,
    headers: { "x-internal-debug-cloudai": "true" }
  }), ProviderKind.xiaoyiLunaInternal);

  assert.equal(resolveCompositionPlannerProviderKind({
    config: { ...READY_CONFIG, providerMode: ProviderKind.siliconflowInternal },
    headers: { "x-internal-debug-cloudai": "true" }
  }), ProviderKind.disabled);

  assert.equal(resolveCompositionPlannerProviderKind({
    config: READY_CONFIG,
    headers: {}
  }), ProviderKind.disabled);
});

test("composition planner wraps a validated provider plan without provider prose", async () => {
  const result = await handleCompositionPlannerRequest(VALID_REQUEST, {
    config: READY_CONFIG,
    headers: { "x-internal-debug-cloudai": "true" },
    provider: {
      async analyzeCompositionPlan() {
        return VALID_PLAN;
      }
    },
    timeoutMs: 100
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.source, "cloud");
  assert.deepEqual(result.body.plan, VALID_PLAN);
  assert.equal(result.body.safety.containsSensitiveInference, false);
  assert.equal(result.metadata.productionReady, false);
});

test("composition planner falls back safely on invalid provider output", async () => {
  const result = await handleCompositionPlannerRequest(VALID_REQUEST, {
    config: READY_CONFIG,
    headers: { "x-internal-debug-cloudai": "true" },
    provider: {
      async analyzeCompositionPlan() {
        return { ...VALID_PLAN, score: 99 };
      }
    },
    timeoutMs: 100
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.source, "fallback");
  assert.equal(result.body.plan, null);
  assert.equal(result.body.error.code, "provider_invalid_schema");
});

test("iOS hybrid planner keeps cloud selection one-shot and local tracking continuous", () => {
  const cameraView = readIOSSource("Features/Camera/CameraView.swift");
  const cameraViewModel = readIOSSource("Features/Camera/CameraViewModel.swift");
  const captureService = readIOSSource("Features/Camera/CameraCaptureService.swift");
  const remoteService = readIOSSource("Features/Camera/HybridCompositionPlannerService.swift");
  const consentView = readIOSSource("Services/CloudAI/CloudAIConsentView.swift");

  assert.equal(cameraView.includes("#if DEBUG"), true);
  assert.equal(cameraView.includes("requestHybridCompositionPlannerConsent"), true);
  assert.equal(cameraView.includes(".disabled(!viewModel.canRequestHybridCompositionPlan)"), true);
  assert.equal(cameraViewModel.includes("service.captureAnalysisSnapshot"), true);
  assert.equal(cameraViewModel.includes("activeHybridCompositionPlan"), true);
  assert.equal(cameraViewModel.includes("refreshLocalAIComposeGuide()"), true);
  assert.equal(cameraViewModel.includes("isFrontCameraMirrored: isUsingFrontCamera"), true);
  assert.equal(captureService.includes("requestNextFrame"), true);
  assert.equal(remoteService.includes("response.safety.containsSensitiveInference == false"), true);
  assert.equal(remoteService.includes("#else\n        throw CloudAIServiceError.remoteDisabled"), true);
  assert.equal(consentView.includes("third-party AI service"), true);
  assert.equal(consentView.includes("do not store the original or compressed image or use it for training"), true);
  assert.equal(cameraViewModel.includes("capturePhoto("), true);
  assert.equal(cameraViewModel.includes("setVideoZoomFactor"), false);
});

test("composition smoke tool reports only sanitized plan fields", () => {
  const script = readFileSync(
    new URL("../scripts/run-xiaoyi-composition-planner-smoke.mjs", import.meta.url),
    "utf8"
  );

  assert.equal(script.includes("--run-provider"), true);
  assert.equal(script.includes("productionReady: false"), true);
  assert.equal(script.includes("dataBase64: imageData.toString"), true);
  assert.equal(script.includes("console.log"), false);
  assert.equal(script.includes("XIAOYI_API_KEY"), false);
  assert.equal(script.includes("authorization"), false);
});

function readIOSSource(relativePath) {
  return readFileSync(
    new URL(`../../ios-app/AIPhotoApp/${relativePath}`, import.meta.url),
    "utf8"
  );
}
