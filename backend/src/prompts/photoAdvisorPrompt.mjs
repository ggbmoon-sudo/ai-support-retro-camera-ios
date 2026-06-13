import { KNOWN_FILTER_IDS } from "../filters/filterWhitelist.mjs";

export function buildPhotoAdvisorPrompt({ locale = "zh-Hant-HK" } = {}) {
  return [
    "You are a post-capture photo advisor for a retro camera app.",
    "Analyze only photo style, mood, composition, lighting, crop, retake choice, and suitable existing filters.",
    "Do not identify people. Do not infer age, gender, race, religion, health, emotion, sexuality, identity, attractiveness, or beauty.",
    "Do not rate appearance, body, face, or personal identity. Do not mention sensitive attributes.",
    "Do not use profanity, insults, harassment, or abusive language.",
    "Return only JSON. Do not include Markdown. Do not mention provider, system instructions, hidden policy, or safety policy.",
    `Use this locale for user-facing text: ${locale}. Consent/privacy/error text must remain neutral.`,
    "Keep output short, actionable, and gentle. If uncertain, use low confidence.",
    "Recommended filter IDs must be chosen only from this whitelist:",
    KNOWN_FILTER_IDS.join(", "),
    "Required JSON shape:",
    JSON.stringify(photoAdvisorProviderOutputSchema(), null, 2)
  ].join("\n");
}

export function photoAdvisorProviderOutputSchema() {
  return {
    type: "object",
    required: [
      "schemaVersion",
      "mode",
      "summary",
      "suggestions",
      "recommendedFilters",
      "retakeAdvice",
      "cropAdvice",
      "confidence",
      "source",
      "locale",
      "safety",
      "error"
    ],
    properties: {
      schemaVersion: { type: "string", enum: ["1.0"] },
      mode: { type: "string", enum: ["post_capture"] },
      summary: { type: "string", maxLength: 160 },
      suggestions: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          required: ["type", "text", "priority", "action"],
          properties: {
            type: { type: "string", enum: ["filter", "crop", "lighting", "retake", "composition"] },
            text: { type: "string", maxLength: 180 },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            action: { type: "string", enum: ["apply_filter", "adjust_crop", "retake", "none"] }
          }
        }
      },
      recommendedFilters: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          required: ["filterId", "reason", "confidence"],
          properties: {
            filterId: { type: "string", enum: KNOWN_FILTER_IDS },
            reason: { type: "string", maxLength: 120 },
            confidence: { type: "string", enum: ["low", "medium", "high"] }
          }
        }
      },
      retakeAdvice: {
        type: ["object", "null"],
        properties: {
          shouldRetake: { type: "boolean" },
          reason: { type: "string", maxLength: 160 }
        }
      },
      cropAdvice: {
        type: ["object", "null"],
        properties: {
          recommended: { type: "boolean" },
          text: { type: "string", maxLength: 160 }
        }
      },
      confidence: { type: "string", enum: ["low", "medium", "high"] },
      source: { type: "string", enum: ["cloud"] },
      locale: { type: "string" },
      safety: {
        type: "object",
        required: ["containsSensitiveInference", "requiresUserConsent", "blockedReason"],
        properties: {
          containsSensitiveInference: { type: "boolean", enum: [false] },
          requiresUserConsent: { type: "boolean" },
          blockedReason: { type: ["string", "null"] }
        }
      },
      error: { type: ["object", "null"] }
    }
  };
}
