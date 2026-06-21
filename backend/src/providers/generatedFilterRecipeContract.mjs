const FILTER_RECIPE_VERSION = "1.0";

const ALLOWED_NAME_KEYS = new Set([
  "filter_lab.recipe.golden_rooftop_dream.name",
  "filter_lab.recipe.soft_film_memory.name",
  "filter_lab.recipe.neon_street_fade.name",
  "filter_lab.recipe.ccd_party_warm.name",
  "filter_lab.recipe.cool_chrome_portrait.name",
  "filter_lab.recipe.amber_travel_glow.name"
]);

const ALLOWED_DESCRIPTION_KEYS = new Set([
  "filter_lab.recipe.golden_rooftop_dream.description",
  "filter_lab.recipe.soft_film_memory.description",
  "filter_lab.recipe.neon_street_fade.description",
  "filter_lab.recipe.ccd_party_warm.description",
  "filter_lab.recipe.cool_chrome_portrait.description",
  "filter_lab.recipe.amber_travel_glow.description"
]);

const ALLOWED_USE_KEYS = new Set([
  "filter_lab.use.golden_hour",
  "filter_lab.use.travel",
  "filter_lab.use.portrait",
  "filter_lab.use.daily",
  "filter_lab.use.soft_portrait",
  "filter_lab.use.street",
  "filter_lab.use.night",
  "filter_lab.use.party",
  "filter_lab.use.flash"
]);

const ALLOWED_WARNING_KEYS = new Set([
  "filter_lab.warning.session_only"
]);

const REQUIRED_TOP_LEVEL_KEYS = [
  "id",
  "nameKey",
  "descriptionKey",
  "source",
  "confidence",
  "recommendedUseKeys",
  "parameters",
  "warningsKeys",
  "recipeVersion"
];

const REQUIRED_PARAMETER_KEYS = [
  "exposure",
  "contrast",
  "saturation",
  "temperature",
  "tint",
  "fade",
  "grain",
  "vignette"
];

const PARAMETER_RANGES = Object.freeze({
  exposure: [-0.35, 0.35],
  contrast: [-0.35, 0.35],
  saturation: [-0.35, 0.45],
  temperature: [-0.45, 0.45],
  tint: [-0.25, 0.25],
  fade: [0, 0.5],
  grain: [0, 0.35],
  vignette: [0, 0.35]
});

export function generatedFilterRecipeExampleCandidate() {
  return {
    id: "ai_amber_travel_glow",
    nameKey: "filter_lab.recipe.amber_travel_glow.name",
    descriptionKey: "filter_lab.recipe.amber_travel_glow.description",
    source: "cloud",
    confidence: 0.74,
    recommendedUseKeys: [
      "filter_lab.use.travel",
      "filter_lab.use.golden_hour"
    ],
    parameters: {
      exposure: 0.06,
      contrast: -0.08,
      saturation: 0.16,
      temperature: 0.28,
      tint: 0.06,
      fade: 0.12,
      grain: 0.1,
      vignette: 0.14
    },
    warningsKeys: [
      "filter_lab.warning.session_only"
    ],
    recipeVersion: FILTER_RECIPE_VERSION
  };
}

export function buildGeneratedFilterRecipeSchemaPrompt() {
  return [
    "Return exactly one JSON object for the app's Filter Lab recipe contract.",
    "Use localization keys only; do not write final UI copy.",
    "Do not output Core Image filter names, shader code, LUT URLs, executable logic, brand/movie/creator clone claims, or exact-copy promises.",
    "Use only these top-level fields:",
    REQUIRED_TOP_LEVEL_KEYS.join(", "),
    "Use only these parameter fields:",
    REQUIRED_PARAMETER_KEYS.join(", "),
    "Allowed nameKey:",
    Array.from(ALLOWED_NAME_KEYS).join(", "),
    "Allowed descriptionKey:",
    Array.from(ALLOWED_DESCRIPTION_KEYS).join(", "),
    "Allowed recommendedUseKeys:",
    Array.from(ALLOWED_USE_KEYS).join(", "),
    "Allowed warningsKeys:",
    Array.from(ALLOWED_WARNING_KEYS).join(", "),
    "Allowed source: cloud",
    "Allowed recipeVersion: 1.0",
    "Parameter ranges:",
    Object.entries(PARAMETER_RANGES).map(([key, [min, max]]) => `${key}=${min}..${max}`).join(", "),
    "If uncertain, choose amber_travel_glow or soft_film_memory keys with conservative parameter values.",
    "Output JSON only. No markdown. No prose."
  ].join("\n");
}

export function validateGeneratedFilterRecipeCandidate(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return invalid("wrong_object_shape", "Generated filter recipe must be an object.");
  }

  const extraKeys = Object.keys(candidate).filter((key) => !REQUIRED_TOP_LEVEL_KEYS.includes(key));
  if (extraKeys.length > 0) {
    return invalid("additional_property", "Generated filter recipe has unsupported fields.");
  }

  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in candidate)) {
      return invalid("missing_required_field", "Generated filter recipe is missing required fields.");
    }
  }

  if (candidate.recipeVersion !== FILTER_RECIPE_VERSION) {
    return invalid("unsupported_enum", "Generated filter recipeVersion is unsupported.");
  }

  if (typeof candidate.id !== "string" || !/^ai_[a-z0-9_]{3,64}$/.test(candidate.id)) {
    return invalid("unsupported_enum", "Generated filter id must be an app-safe ai_* id.");
  }

  if (!ALLOWED_NAME_KEYS.has(candidate.nameKey) || !ALLOWED_DESCRIPTION_KEYS.has(candidate.descriptionKey)) {
    return invalid("unsupported_enum", "Generated filter recipe must use known localization keys.");
  }

  if (candidate.source !== "cloud") {
    return invalid("unsupported_enum", "Generated filter source must be cloud.");
  }

  if (!Number.isFinite(candidate.confidence)) {
    return invalid("wrong_type", "Generated filter confidence must be a finite number.");
  }

  if (!Array.isArray(candidate.recommendedUseKeys) || candidate.recommendedUseKeys.length < 1 || candidate.recommendedUseKeys.length > 3) {
    return invalid("wrong_type", "Generated filter recommendedUseKeys must contain 1 to 3 keys.");
  }

  if (!candidate.recommendedUseKeys.every((key) => ALLOWED_USE_KEYS.has(key))) {
    return invalid("unsupported_enum", "Generated filter recommendedUseKeys must be known localization keys.");
  }

  if (!Array.isArray(candidate.warningsKeys) || candidate.warningsKeys.length < 1 || candidate.warningsKeys.length > 2) {
    return invalid("wrong_type", "Generated filter warningsKeys must contain 1 to 2 keys.");
  }

  if (!candidate.warningsKeys.every((key) => ALLOWED_WARNING_KEYS.has(key))) {
    return invalid("unsupported_enum", "Generated filter warningsKeys must be known safe warning keys.");
  }

  const parameterValidation = validateAndClampParameters(candidate.parameters);
  if (!parameterValidation.ok) {
    return parameterValidation;
  }

  return {
    ok: true,
    value: {
      ...candidate,
      confidence: clamp(candidate.confidence, 0, 1),
      parameters: parameterValidation.parameters
    },
    clampedFields: [
      ...(candidate.confidence < 0 || candidate.confidence > 1 ? ["confidence"] : []),
      ...parameterValidation.clampedFields
    ],
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}

function validateAndClampParameters(parameters) {
  if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) {
    return invalid("wrong_object_shape", "Generated filter parameters must be an object.");
  }

  const extraKeys = Object.keys(parameters).filter((key) => !REQUIRED_PARAMETER_KEYS.includes(key));
  if (extraKeys.length > 0) {
    return invalid("additional_property", "Generated filter parameters have unsupported fields.");
  }

  const clampedFields = [];
  const sanitized = {};
  for (const key of REQUIRED_PARAMETER_KEYS) {
    if (!(key in parameters)) {
      return invalid("missing_required_field", "Generated filter parameters are missing required fields.");
    }
    if (!Number.isFinite(parameters[key])) {
      return invalid("wrong_type", "Generated filter parameters must be finite numbers.");
    }
    const [min, max] = PARAMETER_RANGES[key];
    sanitized[key] = clamp(parameters[key], min, max);
    if (sanitized[key] !== parameters[key]) {
      clampedFields.push(key);
    }
  }

  return {
    ok: true,
    parameters: sanitized,
    clampedFields
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function invalid(code, message) {
  return {
    ok: false,
    error: {
      code,
      message
    },
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}
