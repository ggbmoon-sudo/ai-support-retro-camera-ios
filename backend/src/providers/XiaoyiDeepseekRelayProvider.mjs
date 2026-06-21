import { CloudAIProvider } from "./CloudAIProvider.mjs";
import { buildPhotoAdvisorPrompt } from "../prompts/photoAdvisorPrompt.mjs";
import {
  buildGeneratedFilterRecipeSchemaPrompt,
  validateGeneratedFilterRecipeCandidate
} from "./generatedFilterRecipeContract.mjs";

export const XIAOYI_DEEPSEEK_DEFAULT_MODEL = "deepseek-v4-flash";
export const XIAOYI_CHAT_COMPLETIONS_PATH = "/v1/chat/completions";
export const XIAOYI_ENDPOINT_BUCKET = "xiaoyi_openai_chat_completions";

export class XiaoyiDeepseekRelayProvider extends CloudAIProvider {
  constructor({
    apiKey,
    baseURL,
    photoAdvisorModel = XIAOYI_DEEPSEEK_DEFAULT_MODEL,
    filterLabModel = XIAOYI_DEEPSEEK_DEFAULT_MODEL,
    path = XIAOYI_CHAT_COMPLETIONS_PATH,
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
    return parseXiaoyiPhotoAdvisorResponse(payload);
  }

  async generateFilterRecipe(input) {
    this.assertReady(this.filterLabModel);
    const payload = await this.sendChatCompletion(this.filterLabRequestBody(input));
    return parseXiaoyiGeneratedFilterRecipeResponse(payload);
  }

  endpointURL() {
    return joinURLPath(this.baseURL, this.path);
  }

  authHeaders() {
    return { "authorization": `Bearer ${this.apiKey}` };
  }

  photoAdvisorRequestBody(input) {
    return {
      model: this.photoAdvisorModel,
      stream: false,
      temperature: 0.2,
      top_p: 0.8,
      max_tokens: 640,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are a backend-only Photo Advisor JSON writer for a retro / film camera app.",
            "Return JSON only. No Markdown, prose, provider/debug text, chain-of-thought, scores, ratings, or sensitive inference.",
            "Follow Observation -> Mood -> Retro intent -> Optional action.",
            "Never use Score -> Problem -> Fix -> Retake."
          ].join(" ")
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: buildPhotoAdvisorPrompt({ locale: input.locale })
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${input.image.contentType};base64,${input.image.dataBase64}`,
                detail: "low"
              }
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
      temperature: 0.2,
      top_p: 0.8,
      max_tokens: 512,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are a backend-only Filter Lab recipe writer for a retro / film camera app.",
            "Return JSON only. No Markdown, prose, raw prompt echo, provider/debug text, chain-of-thought, code, shader, LUT URL, or exact-copy claim.",
            "The app renderer owns all image processing; you output safe typed recipe keys and numeric parameters only."
          ].join(" ")
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: buildGeneratedFilterRecipeSchemaPrompt()
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${input.image.contentType};base64,${input.image.dataBase64}`,
                detail: "low"
              }
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
        ...this.authHeaders()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = new Error(`Xiaoyi relay request failed with ${response.status}`);
      error.code = response.status >= 500 ? "provider_transient_error" : "provider_error";
      throw error;
    }

    return response.json();
  }

  assertReady(model) {
    if (!this.apiKey) {
      const error = new Error("Xiaoyi relay API key is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!this.baseURL) {
      const error = new Error("Xiaoyi relay base URL is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!model) {
      const error = new Error("Xiaoyi relay model is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!this.fetchImpl) {
      const error = new Error("Fetch is not available in this runtime");
      error.code = "provider_unavailable";
      throw error;
    }
  }
}

export function parseXiaoyiPhotoAdvisorResponse(payload) {
  return parseJsonFromOpenAICompatiblePayload(payload);
}

export function parseXiaoyiGeneratedFilterRecipeResponse(payload) {
  const candidate = parseJsonFromOpenAICompatiblePayload(payload);
  const validation = validateGeneratedFilterRecipeCandidate(candidate);
  if (!validation.ok) {
    const error = new Error("Xiaoyi relay generated filter recipe failed validation");
    error.code = "provider_invalid_schema";
    error.validationCode = validation.error.code;
    throw error;
  }
  return validation.value;
}

export function parseJsonFromOpenAICompatiblePayload(payload) {
  const text = extractOpenAICompatibleContentText(payload);
  if (!text) {
    const error = new Error("Xiaoyi relay response did not include JSON text");
    error.code = "provider_invalid_json";
    throw error;
  }

  try {
    return JSON.parse(stripCodeFence(text));
  } catch {
    const error = new Error("Xiaoyi relay response JSON could not be parsed");
    error.code = "provider_invalid_json";
    throw error;
  }
}

export function extractOpenAICompatibleContentText(payload) {
  return contentText(payload?.choices?.[0]?.message?.content);
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
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        return part?.text ?? "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return String(content ?? "").trim();
}

function joinURLPath(baseURL, path) {
  const normalizedBase = String(baseURL ?? "").replace(/\/+$/, "");
  const normalizedPath = String(path ?? "").startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
