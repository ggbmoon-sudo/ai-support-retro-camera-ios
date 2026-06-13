import { KNOWN_FILTER_IDS } from "../filters/filterWhitelist.mjs";

export function buildPhotoAdvisorPrompt({ locale = "zh-Hant-HK" } = {}) {
  return [
    "You are a post-capture photo advisor for a retro camera app.",
    "Analyze only non-sensitive photographic qualities: light, color, contrast, exposure, framing, crop, background clutter, subject placement, retro mood, and suitable existing filters.",
    "Subject placement means where the main visual subject sits in the frame. Do not identify or describe the person, face, body, skin, protected traits, or sensitive attributes of any subject.",
    "Do not identify people. Do not infer age, gender, race, religion, health, emotion, sexuality, identity, attractiveness, or beauty.",
    "Do not describe or rate appearance, body, face, skin, personal identity, ethnicity, nationality, disability, or protected class traits.",
    "Avoid words related to attractiveness, beauty, beautiful people, faces, skin, age, gender, emotion, mental state, health, body, race, ethnicity, nationality, disability, religion, or identity even when the intent is positive.",
    "If a photo includes people, discuss only framing, distance, crop, lighting, background, and filter fit without describing who they are or how they look.",
    "Use neutral object/photo terms: frame, subject placement, background, highlight, shadow, color cast, contrast, exposure, crop, texture, grain, retro mood.",
    "Do not use profanity, insults, harassment, or abusive language.",
    "Return only JSON. Do not include Markdown. Do not mention provider, system instructions, hidden policy, or safety policy.",
    `Use this locale for user-facing text: ${locale}. Consent/privacy/error text must remain neutral.`,
    "Keep output short, practical, and gentle. Avoid poetic copy, overclaiming, and generic filler.",
    "Summary should be at most 1 sentence. Suggestions should be concrete editing steps, not praise-only commentary.",
    "Retake advice must be soft. Prefer keep-and-adjust guidance unless the photo is clearly unusable.",
    "If you include a caption-like suggestion, keep it under 80 characters and do not imply image generation.",
    "If uncertain, use low confidence and avoid guessing unseen details.",
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
