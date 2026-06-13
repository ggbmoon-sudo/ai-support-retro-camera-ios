import { CloudAIProvider } from "./CloudAIProvider.mjs";
import { buildPhotoAdvisorPrompt, photoAdvisorProviderOutputSchema } from "../prompts/photoAdvisorPrompt.mjs";

export class QwePhotoAdvisorProvider extends CloudAIProvider {
  constructor({
    apiKey,
    baseURL,
    model,
    path = "/v1/chat/completions",
    fetchImpl = globalThis.fetch
  } = {}) {
    super();
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.model = model;
    this.path = path;
    this.fetchImpl = fetchImpl;
  }

  async analyzePhotoAdvisor(input) {
    if (!this.apiKey) {
      const error = new Error("QweAPI API key is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!this.baseURL) {
      const error = new Error("QweAPI base URL is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!this.model) {
      const error = new Error("QweAPI Photo Advisor model is not configured");
      error.code = "provider_unavailable";
      throw error;
    }

    if (!this.fetchImpl) {
      const error = new Error("Fetch is not available in this runtime");
      error.code = "provider_unavailable";
      throw error;
    }

    const response = await this.fetchImpl(this.endpointURL(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        ...this.authHeaders()
      },
      body: JSON.stringify(this.requestBody(input))
    });

    if (!response.ok) {
      const error = new Error(`QweAPI request failed with ${response.status}`);
      error.code = response.status >= 500 ? "provider_transient_error" : "provider_error";
      throw error;
    }

    const payload = await response.json();
    return parseQweCloudAIResponse(payload);
  }

  endpointURL() {
    return joinURLPath(this.baseURL, this.path);
  }

  authHeaders() {
    return { "authorization": `Bearer ${this.apiKey}` };
  }

  requestBody(input) {
    return {
      model: this.model,
      messages: [
        {
          role: "system",
          content: "You are a careful post-capture photo advisor. Return JSON only and follow the requested safety and schema rules."
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
                url: `data:${input.image.contentType};base64,${input.image.dataBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.2
    };
  }
}

export function parseQweCloudAIResponse(payload) {
  const chatContent = payload?.choices?.[0]?.message?.content;
  const text = contentText(chatContent);

  if (!text) {
    const error = new Error("QweAPI response did not include JSON text");
    error.code = "provider_invalid_json";
    throw error;
  }

  try {
    return JSON.parse(stripCodeFence(text));
  } catch {
    const error = new Error("QweAPI response JSON could not be parsed");
    error.code = "provider_invalid_json";
    throw error;
  }
}

function stripCodeFence(text) {
  return text
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
