import { CloudAIProvider } from "./CloudAIProvider.mjs";
import {
  buildSiliconFlowPhotoAdvisorCompactSystemPrompt,
  buildSiliconFlowPhotoAdvisorCompactUserPrompt
} from "./siliconflowPhotoAdvisorPromptContract.mjs";
import { parseSiliconFlowPhotoAdvisorResponse } from "./siliconflowPhotoAdvisorProviderContract.mjs";
import {
  buildGeneratedFilterRecipeRendererCalibrationPrompt,
  buildGeneratedFilterRecipeSchemaPrompt,
  buildGeneratedFilterRecipeStyleGuidancePrompt,
  buildGeneratedFilterRecipeSystemPrompt,
  generatedFilterRecipeJSONSchema,
  validateGeneratedFilterRecipeCandidate
} from "./generatedFilterRecipeContract.mjs";

export const SILICONFLOW_DEFAULT_BASE_URL = "https://api.siliconflow.com";
export const SILICONFLOW_CHAT_COMPLETIONS_PATH = "/v1/chat/completions";
export const SILICONFLOW_DEFAULT_VISION_MODEL = "Qwen/Qwen3-VL-32B-Instruct";

const FILTER_FAMILY_TO_APP_FILTER_ID = Object.freeze({
  warm_film: "soft_warm_400",
  faded_pastel: "memory_negative",
  cinematic_contrast: "cinema_flat",
  night_grain: "amber_night_800",
  soft_dream: "instant_dream",
  street_chrome: "street_chrome",
  amber_glow: "amber_nostalgia",
  cool_fade: "silver_gradation",
  classic_film: "summer_gold_200",
  original: "original"
});

export class SiliconFlowCloudAIProvider extends CloudAIProvider {
  constructor({
    apiKey,
    baseURL = SILICONFLOW_DEFAULT_BASE_URL,
    photoAdvisorModel = SILICONFLOW_DEFAULT_VISION_MODEL,
    filterLabModel = SILICONFLOW_DEFAULT_VISION_MODEL,
    path = SILICONFLOW_CHAT_COMPLETIONS_PATH,
    fetchImpl = globalThis.fetch
  } = {}) {
    super();
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.photoAdvisorModel = photoAdvisorModel;
    this.filterLabModel = filterLabModel;
    this.path = path;
    this.fetchImpl = fetchImpl;
  }

  async analyzePhotoAdvisor(input) {
    this.assertReady(this.photoAdvisorModel);
    const payload = await this.sendChatCompletion(this.photoAdvisorRequestBody(input));
    const parsed = parseSiliconFlowPhotoAdvisorResponse(payload);
    if (!parsed.ok) {
      throw providerParseError(parsed);
    }
    return mapSiliconFlowPhotoAdvisorCandidateToCloudAIResponse(parsed.candidate, input.locale);
  }

  async generateFilterRecipe(input) {
    this.assertReady(this.filterLabModel);
    const payload = await this.sendChatCompletion(this.filterLabRequestBody(input));
    return parseSiliconFlowGeneratedFilterRecipeResponse(payload);
  }

  endpointURL() {
    return joinURLPath(this.baseURL, this.path);
  }

  photoAdvisorRequestBody(input) {
    return {
      model: this.photoAdvisorModel,
      stream: false,
      temperature: 0.1,
      top_p: 0.8,
      max_tokens: 192,
      messages: [
        {
          role: "system",
          content: buildSiliconFlowPhotoAdvisorCompactSystemPrompt()
        },
        {
          role: "user",
          content: [
            imageContentPart(input),
            {
              type: "text",
              text: buildSiliconFlowPhotoAdvisorCompactUserPrompt()
            }
          ]
        }
      ]
    };
  }

  filterLabRequestBody(input) {
    return {
      model: this.filterLabModel,
      stream: false,
      temperature: 0.1,
      max_tokens: 512,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "filter_lab_recipe",
          schema: generatedFilterRecipeJSONSchema()
        }
      },
      messages: [
        {
          role: "system",
          content: buildGeneratedFilterRecipeSystemPrompt()
        },
        {
          role: "user",
          content: [
            imageContentPart(input, { detail: "high" }),
            {
              type: "text",
              text: [
                buildGeneratedFilterRecipeSchemaPrompt(),
                buildGeneratedFilterRecipeStyleGuidancePrompt(),
                buildGeneratedFilterRecipeRendererCalibrationPrompt(),
                "Use exactly the allowed enum strings. Do not invent localization keys.",
                "If the image is ambiguous, keep uncertain controls near identity and lower confidence. Do not substitute a preferred preset recipe.",
                `Locale: ${input.locale ?? "zh-Hant"}`
              ].join("\n")
            }
          ]
        }
      ]
    };
  }

  async sendChatCompletion(body) {
    const response = await this.fetchImpl(this.endpointURL(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = new Error(`SiliconFlow request failed with ${response.status}`);
      error.code = response.status === 408 || response.status === 429 || response.status >= 500
        ? "provider_transient_error"
        : "provider_error";
      throw error;
    }

    return response.json();
  }

  assertReady(model) {
    if (!this.apiKey || !this.baseURL || !this.path || !model || !this.fetchImpl) {
      const error = new Error("SiliconFlow provider is not configured");
      error.code = "provider_unavailable";
      throw error;
    }
  }
}

export function parseSiliconFlowGeneratedFilterRecipeResponse(payload) {
  const text = extractOpenAICompatibleContentText(payload);
  if (!text) {
    const error = new Error("SiliconFlow response did not include JSON text");
    error.code = "provider_invalid_json";
    throw error;
  }

  let candidate;
  try {
    candidate = JSON.parse(stripCodeFence(text));
  } catch {
    const error = new Error("SiliconFlow response JSON could not be parsed");
    error.code = "provider_invalid_json";
    throw error;
  }

  const validation = validateGeneratedFilterRecipeCandidate(candidate);
  if (!validation.ok) {
    const error = new Error("SiliconFlow generated filter recipe failed validation");
    error.code = "provider_invalid_schema";
    error.validationCode = validation.error?.code ?? "schema_invalid";
    throw error;
  }
  return validation.value;
}

export function mapSiliconFlowPhotoAdvisorCandidateToCloudAIResponse(candidate = {}, locale = "zh-Hant-HK") {
  const filterId = FILTER_FAMILY_TO_APP_FILTER_ID[candidate.filterFamilyCandidate] ?? "original";
  const confidence = confidenceForCandidate(candidate);
  return {
    schemaVersion: "1.0",
    mode: "post_capture",
    summary: "The image has a gentle retro direction with room for a simple film finish.",
    suggestions: [
      {
        type: "filter",
        text: "Lean into the current mood with a gentle film finish.",
        priority: "high",
        action: "apply_filter"
      }
    ],
    recommendedFilters: [
      {
        filterId,
        reason: filterReasonForFamily(candidate.filterFamilyCandidate),
        confidence
      }
    ],
    generatedFilter: null,
    poseGuide: null,
    retakeAdvice: {
      shouldRetake: false,
      reason: "Keep this frame and shape the mood with a soft retro finish."
    },
    cropAdvice: null,
    confidence,
    source: "cloud",
    locale,
    safety: {
      containsSensitiveInference: false,
      requiresUserConsent: true,
      blockedReason: null
    },
    error: null
  };
}

function imageContentPart(input, { detail = "low" } = {}) {
  return {
    type: "image_url",
    image_url: {
      url: `data:${input.image.contentType};base64,${input.image.dataBase64}`,
      detail
    }
  };
}

function extractOpenAICompatibleContentText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content
      .map((part) => typeof part === "string" ? part : part?.text ?? "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return String(content ?? "").trim();
}

function providerParseError(parsed = {}) {
  const error = new Error("SiliconFlow provider response failed validation");
  error.code = parsed.bucket === "provider_json_parse_failed" ? "provider_invalid_json" : "provider_invalid_schema";
  if (parsed.bucket === "provider_safety_rejected") {
    error.code = "unsafe_response";
  }
  return error;
}

function filterReasonForFamily(family) {
  switch (family) {
  case "warm_film":
  case "amber_glow":
    return "Warm light can become a soft nostalgic palette.";
  case "faded_pastel":
  case "soft_dream":
    return "Soft color keeps the scene airy and film-like.";
  case "cinematic_contrast":
  case "street_chrome":
    return "Clean contrast gives the frame a quiet cinema feel.";
  case "night_grain":
    return "Low light can carry a gentle night-film texture.";
  case "cool_fade":
    return "Cooler color keeps the mood calm and understated.";
  case "classic_film":
    return "Classic color keeps the frame simple and nostalgic.";
  default:
    return "A light retro finish keeps the original mood intact.";
  }
}

function confidenceForCandidate(candidate = {}) {
  switch (candidate.technicalRisk?.level) {
  case "none":
    return "high";
  case "mild":
  case "moderate":
    return "medium";
  default:
    return "low";
  }
}

function stripCodeFence(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}

function joinURLPath(baseURL, path) {
  const normalizedBase = String(baseURL ?? "").replace(/\/+$/, "");
  const normalizedPath = String(path ?? "").startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
