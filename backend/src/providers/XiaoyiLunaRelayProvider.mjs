import { CloudAIProvider } from "./CloudAIProvider.mjs";
import { buildPhotoAdvisorPrompt } from "../prompts/photoAdvisorPrompt.mjs";
import {
  buildGeneratedFilterRecipeRendererCalibrationPrompt,
  buildGeneratedFilterRecipeSchemaPrompt,
  buildGeneratedFilterRecipeStyleGuidancePrompt,
  buildGeneratedFilterRecipeSystemPrompt,
  validateGeneratedFilterRecipeCandidate
} from "./generatedFilterRecipeContract.mjs";
import {
  buildCompositionPlannerSystemPrompt,
  buildCompositionPlannerUserPrompt,
  validateCompositionPlanCandidate
} from "./compositionPlannerContract.mjs";

export const XIAOYI_LUNA_BASE_URL = "https://xiaoyiapi.xyz";
export const XIAOYI_LUNA_CHAT_COMPLETIONS_PATH = "/v1/chat/completions";
export const XIAOYI_LUNA_MODEL = "gpt-5.6-luna";
export const XIAOYI_LUNA_TOTAL_TIMEOUT_MS = 90_000;
export const XIAOYI_LUNA_ENDPOINT_BUCKET = "xiaoyi_chat_completions";

const SUPPORTED_MODELS = new Set([XIAOYI_LUNA_MODEL]);

export class XiaoyiLunaRelayProvider extends CloudAIProvider {
  constructor({
    apiKey,
    baseURL = XIAOYI_LUNA_BASE_URL,
    photoAdvisorModel = XIAOYI_LUNA_MODEL,
    filterLabModel = XIAOYI_LUNA_MODEL,
    compositionPlannerModel = XIAOYI_LUNA_MODEL,
    path = XIAOYI_LUNA_CHAT_COMPLETIONS_PATH,
    fetchImpl = globalThis.fetch,
    totalTimeoutMs = XIAOYI_LUNA_TOTAL_TIMEOUT_MS
  } = {}) {
    super();
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.photoAdvisorModel = photoAdvisorModel;
    this.filterLabModel = filterLabModel;
    this.compositionPlannerModel = compositionPlannerModel;
    this.path = path;
    this.fetchImpl = fetchImpl;
    this.totalTimeoutMs = totalTimeoutMs;
  }

  async analyzePhotoAdvisor(input) {
    this.assertReady(this.photoAdvisorModel);
    const payload = await this.sendChatCompletion(this.photoAdvisorRequestBody(input));
    return parseXiaoyiLunaPhotoAdvisorResponse(payload);
  }

  async generateFilterRecipe(input) {
    this.assertReady(this.filterLabModel);
    const payload = await this.sendChatCompletion(this.filterLabRequestBody(input));
    return parseXiaoyiLunaGeneratedFilterRecipeResponse(payload);
  }

  async analyzeCompositionPlan(input) {
    this.assertReady(this.compositionPlannerModel);
    const payload = await this.sendChatCompletion(this.compositionPlannerRequestBody(input));
    return parseXiaoyiLunaCompositionPlanResponse(payload);
  }

  endpointURL() {
    return `${XIAOYI_LUNA_BASE_URL}${XIAOYI_LUNA_CHAT_COMPLETIONS_PATH}`;
  }

  photoAdvisorRequestBody(input) {
    return buildRequestBody({
      model: this.photoAdvisorModel,
      maxTokens: 2_000,
      systemPrompt: [
        "You are a backend-only Photo Advisor JSON writer for a retro / film camera app.",
        "Return JSON only. No Markdown, provider/debug text, chain-of-thought, scores, ratings, or sensitive inference.",
        "Follow Observation -> Mood -> Retro intent -> Optional action.",
        "Never use Score -> Problem -> Fix -> Retake."
      ].join(" "),
      userPrompt: buildPhotoAdvisorPrompt({ locale: input.locale }),
      image: input.image,
      imageDetail: "low"
    });
  }

  filterLabRequestBody(input) {
    return buildRequestBody({
      model: this.filterLabModel,
      maxTokens: 2_000,
      systemPrompt: buildGeneratedFilterRecipeSystemPrompt(),
      userPrompt: [
        "Critical JSON typing: recipeVersion must be the JSON string \"2.0\", never the number 2.0.",
        "Set id to the exact JSON string \"ai_reference_grade\". Do not invent another id, use uppercase letters, spaces, or hyphens.",
        "id, nameKey, descriptionKey, source, recipeVersion, and localization array items must be JSON strings. confidence, parameters, curves, LUT weights, and film fields must be JSON numbers.",
        "recommendedUseKeys must be a JSON array containing 1 to 3 allowed string values, never a single string or object. warningsKeys must be the JSON array [\"filter_lab.warning.session_only\"].",
        "lumaCurve, redCurve, greenCurve, and blueCurve must each be JSON arrays containing exactly five numbers. basisLUTWeights must be one JSON object containing all eight required numeric fields.",
        "Set the first and last numbers of redCurve, greenCurve, and blueCurve to exactly 0 and 1. Only lumaCurve may use non-identity endpoints.",
        "Do not add, rename, omit, or change the type of any required field.",
        buildGeneratedFilterRecipeSchemaPrompt(),
        buildGeneratedFilterRecipeStyleGuidancePrompt(),
        buildGeneratedFilterRecipeRendererCalibrationPrompt(),
        "If the image is ambiguous, keep uncertain controls near identity and lower confidence. Do not substitute a preferred preset recipe."
      ].join("\n"),
      image: input.image,
      imageDetail: "high"
    });
  }

  compositionPlannerRequestBody(input) {
    return buildRequestBody({
      model: this.compositionPlannerModel,
      maxTokens: 700,
      systemPrompt: buildCompositionPlannerSystemPrompt(),
      userPrompt: buildCompositionPlannerUserPrompt({
        locale: input.locale,
        localContext: input.localContext
      }),
      image: input.image,
      imageDetail: "high"
    });
  }

  async sendChatCompletion(body) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.totalTimeoutMs);

    try {
      const response = await this.fetchImpl(this.endpointURL(), {
        method: "POST",
        headers: {
          "authorization": `Bearer ${this.apiKey}`,
          "content-type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      if (!response.ok) {
        throw sanitizedHTTPError(response.status);
      }

      return await response.json();
    } catch (error) {
      if (error?.name === "AbortError") {
        const timeoutError = new Error("Xiaoyi Luna request timed out");
        timeoutError.code = "timeout";
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  assertReady(model) {
    if (!this.apiKey || this.baseURL !== XIAOYI_LUNA_BASE_URL || this.path !== XIAOYI_LUNA_CHAT_COMPLETIONS_PATH) {
      const error = new Error("Xiaoyi Luna relay is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!SUPPORTED_MODELS.has(model)) {
      const error = new Error("Xiaoyi Luna model is not allowlisted");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!this.fetchImpl || !Number.isInteger(this.totalTimeoutMs) || this.totalTimeoutMs <= 0) {
      const error = new Error("Xiaoyi Luna runtime is unavailable");
      error.code = "provider_unavailable";
      throw error;
    }
  }
}

export function parseXiaoyiLunaPhotoAdvisorResponse(payload) {
  return parseJsonFromXiaoyiLunaPayload(payload);
}

export function parseXiaoyiLunaGeneratedFilterRecipeResponse(payload) {
  const candidate = parseJsonFromXiaoyiLunaPayload(payload);
  const validation = validateGeneratedFilterRecipeCandidate(candidate);
  if (!validation.ok) {
    const error = new Error("Xiaoyi Luna generated filter recipe failed validation");
    error.code = "provider_invalid_schema";
    error.validationCode = validation.error.code;
    error.validationFieldBucket = validation.error.fieldBucket;
    throw error;
  }
  return validation.value;
}

export function parseXiaoyiLunaCompositionPlanResponse(payload) {
  const candidate = parseJsonFromXiaoyiLunaPayload(payload);
  const validation = validateCompositionPlanCandidate(candidate);
  if (!validation.ok) {
    const error = new Error("Xiaoyi Luna composition plan failed validation");
    error.code = "provider_invalid_schema";
    error.validationCode = validation.error.code;
    throw error;
  }
  return validation.value;
}

export function parseJsonFromXiaoyiLunaPayload(payload) {
  const text = contentText(payload?.choices?.[0]?.message?.content);
  if (!text) {
    const error = new Error("Xiaoyi Luna response did not include JSON text");
    error.code = "provider_invalid_json";
    throw error;
  }

  try {
    return JSON.parse(stripCodeFence(text));
  } catch {
    const error = new Error("Xiaoyi Luna response JSON could not be parsed");
    error.code = "provider_invalid_json";
    throw error;
  }
}

function buildRequestBody({ model, maxTokens, systemPrompt, userPrompt, image, imageDetail }) {
  return {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${image.contentType};base64,${image.dataBase64}`,
              detail: imageDetail
            }
          }
        ]
      }
    ],
    temperature: 0.2,
    stream: false,
    max_tokens: maxTokens,
    response_format: { type: "json_object" }
  };
}

function sanitizedHTTPError(status) {
  const error = new Error("Xiaoyi Luna relay request was rejected");
  if (status === 401 || status === 403) {
    error.code = "provider_unavailable";
  } else if (status === 429 || status >= 500) {
    error.code = "provider_transient_error";
  } else {
    error.code = "provider_error";
  }
  return error;
}

function stripCodeFence(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}

function contentText(content) {
  if (Array.isArray(content)) {
    return content
      .map((part) => typeof part === "string" ? part : part?.text ?? "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return String(content ?? "").trim();
}
