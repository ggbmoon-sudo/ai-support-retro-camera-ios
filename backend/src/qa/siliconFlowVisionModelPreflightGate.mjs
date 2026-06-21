import {
  PHOTO_ADVISOR_MODEL_IDS,
  PhotoAdvisorModelCandidate
} from "../providers/photoAdvisorProviderTypes.mjs";

export const SILICONFLOW_VISION_PREFLIGHT_SCHEMA_VERSION = "siliconflow_vision_model_preflight.v1";
export const SILICONFLOW_RECOMMENDED_VISION_MODEL_CANDIDATE = PhotoAdvisorModelCandidate.qwen3Vl32BInstruct;

const CANDIDATE_ORDER = Object.freeze([
  PhotoAdvisorModelCandidate.qwen3Vl32BInstruct,
  PhotoAdvisorModelCandidate.qwen3Vl8BInstruct,
  PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct,
  PhotoAdvisorModelCandidate.deepseekV4Flash,
  PhotoAdvisorModelCandidate.glm45v
]);

const CANDIDATE_POLICY = Object.freeze({
  [PhotoAdvisorModelCandidate.qwen3Vl32BInstruct]: {
    status: "recommended_for_bounded_one_image_preflight",
    modelNameBucket: "qwen3_vl_32b_instruct",
    capabilityBuckets: [
      "vision_language_model",
      "chat_completions_compatible",
      "image_url_or_base64_input",
      "json_structured_output_capable",
      "instruct_variant"
    ],
    blockers: []
  },
  [PhotoAdvisorModelCandidate.qwen3Vl8BInstruct]: {
    status: "fallback_for_cost_or_latency_canary",
    modelNameBucket: "qwen3_vl_8b_instruct",
    capabilityBuckets: [
      "vision_language_model",
      "chat_completions_compatible",
      "image_url_or_base64_input",
      "json_structured_output_capable",
      "smaller_fallback_candidate"
    ],
    blockers: []
  },
  [PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct]: {
    status: "historical_candidate_requires_recheck",
    modelNameBucket: "qwen3_vl_30b_a3b_instruct",
    capabilityBuckets: [
      "historical_primary_candidate",
      "vision_language_model_expected",
      "chat_completions_compatible_expected"
    ],
    blockers: ["provider_model_listing_recheck_required"]
  },
  [PhotoAdvisorModelCandidate.deepseekV4Flash]: {
    status: "blocked_for_image_qa_current_evidence",
    modelNameBucket: "deepseek_ai_deepseek_v4_flash",
    capabilityBuckets: ["text_smoke_accepted"],
    blockers: ["provider_vision_request_rejected"]
  },
  [PhotoAdvisorModelCandidate.glm45v]: {
    status: "blocked_by_current_deprecation_notes",
    modelNameBucket: "glm_4_5v",
    capabilityBuckets: ["vision_language_model"],
    blockers: ["provider_model_deprecated"]
  }
});

export function parseSiliconFlowVisionModelPreflightArgs(args = []) {
  const options = {
    candidate: SILICONFLOW_RECOMMENDED_VISION_MODEL_CANDIDATE
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--candidate" || arg === "--model-candidate") {
      options.candidate = normalizeVisionCandidate(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith("--candidate=")) {
      options.candidate = normalizeVisionCandidate(arg.slice("--candidate=".length));
      continue;
    }
    if (arg.startsWith("--model-candidate=")) {
      options.candidate = normalizeVisionCandidate(arg.slice("--model-candidate=".length));
    }
  }

  return options;
}

export function runSiliconFlowVisionModelPreflightGate({ args = [] } = {}) {
  const options = parseSiliconFlowVisionModelPreflightArgs(args);
  const selected = buildCandidateReview(options.candidate);
  const candidates = CANDIDATE_ORDER.map(buildCandidateReview);
  const selectedBlocked = selected.blockers.length > 0;

  return {
    schemaVersion: SILICONFLOW_VISION_PREFLIGHT_SCHEMA_VERSION,
    providerClass: "siliconflow",
    providerMode: "backend_internal_debug_only",
    endpointBucket: "siliconflow_chat_completions",
    apiStyle: "openai_compatible_chat_completions",
    requestShape: "vision_chat_completion",
    selectedModelCandidate: selected.candidate,
    selectedModelNameBucket: selected.modelNameBucket,
    selectedModelStatus: selected.status,
    selectedCapabilityBuckets: selected.capabilityBuckets,
    selectedBlockers: selected.blockers,
    recommendedModelCandidate: SILICONFLOW_RECOMMENDED_VISION_MODEL_CANDIDATE,
    recommendedModelNameBucket: CANDIDATE_POLICY[SILICONFLOW_RECOMMENDED_VISION_MODEL_CANDIDATE].modelNameBucket,
    requestFormatPreflight: {
      messageContentShape: "mixed_image_url_then_text",
      imageInputAllowedShapes: ["image_url", "data_url_base64"],
      imageDetail: "low",
      stream: false,
      maxOutputTokens: 192,
      jsonModeDefault: false
    },
    candidates,
    ok: !selectedBlocked,
    hardBlockers: selectedBlocked ? selected.blockers : [],
    blockers: selectedBlocked ? selected.blockers : [],
    plannedCalls: 0,
    actualCalls: 0,
    networkCallsMade: false,
    imageReadsPerformed: false,
    imageUploadAttempted: false,
    modelCallsMade: false,
    apiKeyLoaded: false,
    keyPrinted: false,
    providerUrlPrinted: false,
    promptContentPrinted: false,
    requestBodyPrinted: false,
    providerTextPrinted: false,
    imageContentPrinted: false,
    providerRuntimeExecutionAdded: false,
    iOSRuntimeChanged: false,
    uploadPayloadChanged: false,
    productionReady: false,
    nextExplicitRunCommand: selectedBlocked ? null : [
      "npm run qa:siliconflow:photo-advisor-image-qa --",
      "--run-provider",
      "--image-set=synthetic",
      "--limit=1",
      "--timeout-ms=60000",
      `--model-candidate=${selected.candidate}`
    ].join(" ")
  };
}

function buildCandidateReview(candidate) {
  const normalized = normalizeVisionCandidate(candidate);
  const policy = CANDIDATE_POLICY[normalized];
  if (!policy) {
    return {
      candidate: "unknown",
      modelNameBucket: "missing",
      status: "blocked_unknown_candidate",
      capabilityBuckets: [],
      blockers: ["provider_model_unavailable"]
    };
  }

  return {
    candidate: normalized,
    modelNameBucket: policy.modelNameBucket,
    modelId: PHOTO_ADVISOR_MODEL_IDS[normalized],
    status: policy.status,
    capabilityBuckets: [...policy.capabilityBuckets],
    blockers: [...policy.blockers]
  };
}

function normalizeVisionCandidate(value) {
  const text = String(value ?? "").trim();
  if (text.length === 0) {
    return SILICONFLOW_RECOMMENDED_VISION_MODEL_CANDIDATE;
  }
  const normalized = text.replace(/-/g, "_");
  if (CANDIDATE_ORDER.includes(normalized)) {
    return normalized;
  }
  const byModelId = CANDIDATE_ORDER.find((candidate) => PHOTO_ADVISOR_MODEL_IDS[candidate] === text);
  return byModelId || "unknown";
}
