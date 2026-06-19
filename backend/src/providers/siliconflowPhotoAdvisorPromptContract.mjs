import {
  OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION
} from "../qa/openWeightVlmPhotoAdvisorSchema.mjs";

export const SILICONFLOW_PHOTO_ADVISOR_SCHEMA_ENUMS = Object.freeze({
  schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
  sourceType: ["imported"],
  allowedContext: ["imageOnly"],
  moodKey: [
    "mood.bright_clean",
    "mood.warm_calm",
    "mood.cool_quiet",
    "mood.low_light_night",
    "mood.dreamy_soft",
    "mood.snapshot_energy",
    "mood.grainy_retro",
    "mood.cinematic_contrast",
    "mood.faded_film",
    "mood.minimal_space",
    "mood.unknown"
  ],
  visualObservationKey: [
    "observation.bright_daylight",
    "observation.warm_indoor_light",
    "observation.cool_tone",
    "observation.low_light",
    "observation.neon_night_street",
    "observation.soft_focus",
    "observation.grainy_retro",
    "observation.high_contrast",
    "observation.faded_color",
    "observation.backlight_silhouette",
    "observation.background_clutter",
    "observation.negative_space",
    "observation.centered_clean",
    "observation.food_object",
    "observation.street_scene",
    "observation.landscape",
    "observation.pet",
    "observation.architecture",
    "observation.severe_blur",
    "observation.black_image",
    "observation.overexposed_image",
    "observation.unknown"
  ],
  creativeIntentClassification: [
    "style_positive",
    "acceptable_imperfection",
    "technical_risk",
    "unknown"
  ],
  preserveSignals: [
    "low_light",
    "blur",
    "motion",
    "tilt",
    "grain",
    "soft_focus",
    "high_contrast",
    "faded_color",
    "unusual_framing"
  ],
  technicalRiskLevel: ["none", "mild", "moderate", "severe_unusable"],
  technicalRiskReasonKey: [
    null,
    "risk.severe_blur_unreadable",
    "risk.black_image_unreadable",
    "risk.severe_underexposure_unreadable",
    "risk.severe_overexposure_unreadable"
  ],
  filterFamilyCandidate: [
    "warm_film",
    "faded_pastel",
    "cinematic_contrast",
    "night_grain",
    "soft_dream",
    "street_chrome",
    "amber_glow",
    "cool_fade",
    "classic_film",
    "original"
  ],
  optionalActionKey: [
    "action.none",
    "action.keep_style",
    "action.try_filter_first",
    "action.crop_gently",
    "action.brighten_if_more_detail"
  ],
  retakeAllowed: [false],
  retakeReasonKey: [null]
});

export function siliconFlowPhotoAdvisorExampleCandidate() {
  return {
    schemaVersion: OPEN_WEIGHT_VLM_PHOTO_ADVISOR_SCHEMA_VERSION,
    sourceType: "imported",
    allowedContext: "imageOnly",
    moodKey: "mood.warm_calm",
    visualObservationKey: "observation.warm_indoor_light",
    creativeIntent: {
      classification: "style_positive",
      preserveSignals: ["soft_focus"]
    },
    technicalRisk: {
      level: "none",
      reasonKey: null
    },
    filterFamilyCandidate: "warm_film",
    optionalActionKey: "action.keep_style",
    retakeAllowed: false,
    retakeReasonKey: null,
    safety: {
      sensitiveInferenceDetected: false,
      forbiddenInferenceTypes: [],
      scoreOrRatingDetected: false,
      chainOfThoughtDetected: false,
      debugLeakageDetected: false
    }
  };
}

export function buildSiliconFlowPhotoAdvisorSystemPrompt() {
  return [
    "You are a backend-only JSON contract writer for a retro Photo Advisor.",
    "Return exactly one JSON object and nothing else.",
    "Do not use Markdown, code fences, prose before JSON, or prose after JSON.",
    "Do not write final user-facing UI copy; the app language pack owns final copy.",
    "Use semantic enum/key values only from the allowed lists.",
    "Do not invent enum values, field names, or extra fields.",
    "For unknown or uncertain image content, choose conservative fallback-safe keys such as mood.unknown, observation.unknown, unknown classification, original filter, and action.none.",
    "Treat this as post-capture/imported-photo analysis with image-only context.",
    "Do not claim capture-time motion, tilt, focus, device stability, GPS, EXIF, sensor, camera setting, or user intent.",
    "Do not score, rate, grade, rank, criticize, or use retake-first language.",
    "Do not infer identity, age, gender, attractiveness, beauty, emotion, health, ethnicity, race, religion, disability, sexuality, body traits, or other sensitive attributes.",
    "Do not include chain-of-thought, hidden reasoning, provider name, model name, prompt text, debug fields, raw JSON labels, request details, file paths, URLs, or API details.",
    "If uncertain, keep retakeAllowed false and retakeReasonKey null.",
    "The safety object must always have all booleans false and forbiddenInferenceTypes as an empty array."
  ].join("\n");
}

export function buildSiliconFlowPhotoAdvisorUserPrompt() {
  const enums = SILICONFLOW_PHOTO_ADVISOR_SCHEMA_ENUMS;
  return [
    "Analyze this photo only for safe retro Photo Advisor routing.",
    "Return exactly this JSON shape with these exact field names:",
    JSON.stringify(siliconFlowPhotoAdvisorExampleCandidate(), null, 2),
    "Allowed sourceType: " + enums.sourceType.join(", "),
    "Allowed allowedContext: " + enums.allowedContext.join(", "),
    "Allowed moodKey: " + enums.moodKey.join(", "),
    "Allowed visualObservationKey: " + enums.visualObservationKey.join(", "),
    "Allowed creativeIntent.classification: " + enums.creativeIntentClassification.join(", "),
    "Allowed creativeIntent.preserveSignals: " + enums.preserveSignals.join(", "),
    "Allowed technicalRisk.level: " + enums.technicalRiskLevel.join(", "),
    "Allowed technicalRisk.reasonKey: null, risk.severe_blur_unreadable, risk.black_image_unreadable, risk.severe_underexposure_unreadable, risk.severe_overexposure_unreadable",
    "Allowed filterFamilyCandidate: " + enums.filterFamilyCandidate.join(", "),
    "Allowed optionalActionKey: " + enums.optionalActionKey.join(", "),
    "Allowed retakeAllowed: false",
    "Allowed retakeReasonKey: null",
    "Output JSON only. No markdown. No explanation."
  ].join("\n");
}
