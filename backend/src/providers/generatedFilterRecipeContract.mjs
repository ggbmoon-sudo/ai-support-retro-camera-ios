const FILTER_RECIPE_VERSION = "2.0";
const CURVE_POINT_COUNT = 5;
const IDENTITY_CURVE = Object.freeze([0, 0.25, 0.5, 0.75, 1]);

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
  "colorTransform",
  "film",
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
  "shadowLift",
  "highlightRollOff",
  "bloom",
  "grain",
  "dust",
  "vignette"
];

const PARAMETER_RANGES = Object.freeze({
  exposure: [-0.35, 0.35],
  contrast: [-0.35, 0.35],
  saturation: [-0.35, 0.45],
  temperature: [-0.45, 0.45],
  tint: [-0.25, 0.25],
  fade: [0, 0.5],
  shadowLift: [0, 0.4],
  highlightRollOff: [0, 0.4],
  bloom: [0, 0.3],
  grain: [0, 0.35],
  dust: [0, 0.35],
  vignette: [0, 0.35]
});

const PARAMETER_DESCRIPTIONS = Object.freeze({
  exposure: "Single Core Image exposure adjustment in EV. Zero is identity; negative darkens and positive brightens. Do not also compensate with brightness.",
  contrast: "Core Image contrast offset around the identity multiplier: renderer contrast = 1 + value * intensity. Negative softens tonal separation; positive strengthens it.",
  saturation: "Core Image saturation offset around the identity multiplier: renderer saturation = 1 + value * intensity. Negative mutes color; positive strengthens color.",
  temperature: "Renderer white-balance warmth control. Zero targets 6500K; positive lowers the target Kelvin for a warmer result and negative raises it for a cooler result.",
  tint: "Renderer green-magenta white-balance control. Zero is neutral; negative moves toward green and positive moves toward magenta.",
  fade: "Milky global fade amount. Zero is identity; positive gently raises the black floor and softens color separation without darkening the image.",
  shadowLift: "Dedicated shadow-opening amount. Zero is identity; positive reveals dark detail and prevents crushed blacks without changing overall exposure.",
  highlightRollOff: "Highlight compression amount. Zero is identity; positive softens bright peaks while preserving midtone brightness instead of lowering exposure.",
  bloom: "Neutral soft highlight glow amount. Zero is no glow; positive adds bounded white diffusion and must not substitute for warm halation.",
  grain: "Film-grain strength. Zero is no grain; positive increases texture while the film object separately defines its size, roughness, and luminance response.",
  dust: "Sparse analog dust and short scratch texture amount. Zero is clean; positive adds defects distinct from uniform film grain.",
  vignette: "Corner darkening strength. Zero is no vignette; positive progressively darkens the edges while preserving the center."
});

const REQUIRED_COLOR_TRANSFORM_KEYS = [
  "inputNormalizationStrength",
  "styleIntensity",
  "lumaCurve",
  "redCurve",
  "greenCurve",
  "blueCurve",
  "basisLUTWeights"
];

const COLOR_TRANSFORM_RANGES = Object.freeze({
  inputNormalizationStrength: [0, 0.35],
  styleIntensity: [0, 1]
});

const CURVE_KEYS = Object.freeze([
  "lumaCurve",
  "redCurve",
  "greenCurve",
  "blueCurve"
]);

const BASIS_LUT_KEYS = Object.freeze([
  "neutral",
  "warmAmber",
  "roseFlash",
  "coolChrome",
  "tealOrange",
  "mutedPastel",
  "deepBrown",
  "chromeSlide"
]);

const REQUIRED_FILM_KEYS = [
  "grainSize",
  "grainRoughness",
  "grainLumaResponse",
  "halationStrength",
  "halationRadius",
  "halationWarmth",
  "diffusion"
];

const FILM_RANGES = Object.freeze({
  grainSize: [0.6, 2.2],
  grainRoughness: [0, 1],
  grainLumaResponse: [-1, 1],
  halationStrength: [0, 0.25],
  halationRadius: [2, 24],
  halationWarmth: [0, 1],
  diffusion: [0, 0.25]
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
      exposure: -0.02,
      contrast: -0.04,
      saturation: -0.08,
      temperature: 0.18,
      tint: 0.05,
      fade: 0.08,
      shadowLift: 0.06,
      highlightRollOff: 0.14,
      bloom: 0.04,
      grain: 0.14,
      dust: 0.12,
      vignette: 0.06
    },
    colorTransform: {
      inputNormalizationStrength: 0.16,
      styleIntensity: 0.72,
      lumaCurve: [0.03, 0.24, 0.5, 0.76, 0.96],
      redCurve: [0.02, 0.27, 0.52, 0.78, 0.98],
      greenCurve: [0.01, 0.25, 0.5, 0.75, 0.97],
      blueCurve: [0.01, 0.23, 0.47, 0.72, 0.95],
      basisLUTWeights: {
        neutral: 0.25,
        warmAmber: 0.35,
        roseFlash: 0.12,
        coolChrome: 0.03,
        tealOrange: 0.05,
        mutedPastel: 0.08,
        deepBrown: 0.1,
        chromeSlide: 0.02
      }
    },
    film: {
      grainSize: 1.15,
      grainRoughness: 0.55,
      grainLumaResponse: 0.35,
      halationStrength: 0.06,
      halationRadius: 9,
      halationWarmth: 0.72,
      diffusion: 0.05
    },
    warningsKeys: [
      "filter_lab.warning.session_only"
    ],
    recipeVersion: FILTER_RECIPE_VERSION
  };
}

export function generatedFilterRecipeJSONSchema() {
  const parameterProperties = Object.fromEntries(
    REQUIRED_PARAMETER_KEYS.map((key) => {
      const [minimum, maximum] = PARAMETER_RANGES[key];
      return [key, boundedNumberSchema(minimum, maximum, PARAMETER_DESCRIPTIONS[key])];
    })
  );
  const curveSchema = {
    type: "array",
    minItems: CURVE_POINT_COUNT,
    maxItems: CURVE_POINT_COUNT,
    items: boundedNumberSchema(0, 1, "One output value for fixed input x positions 0, 0.25, 0.5, 0.75, and 1. Values must stay monotonic and near identity.")
  };
  const basisLUTProperties = Object.fromEntries(BASIS_LUT_KEYS.map((key) => [
    key,
    boundedNumberSchema(0, 1, `Non-negative mixture weight for the app-bundled ${key} color transform.`)
  ]));
  const filmProperties = Object.fromEntries(REQUIRED_FILM_KEYS.map((key) => {
    const [minimum, maximum] = FILM_RANGES[key];
    return [key, boundedNumberSchema(minimum, maximum, filmDescription(key))];
  }));

  return {
    type: "object",
    additionalProperties: false,
    required: [...REQUIRED_TOP_LEVEL_KEYS],
    properties: {
      id: {
        type: "string",
        pattern: "^ai_[a-z0-9_]{3,64}$",
        description: "App-safe generated recipe identifier. This label must not influence numeric values."
      },
      nameKey: {
        type: "string",
        enum: Array.from(ALLOWED_NAME_KEYS),
        description: "Closest app localization key, selected only after estimating the numeric recipe."
      },
      descriptionKey: {
        type: "string",
        enum: Array.from(ALLOWED_DESCRIPTION_KEYS),
        description: "Closest app localization key, selected only after estimating the numeric recipe."
      },
      source: { type: "string", enum: ["cloud"] },
      confidence: boundedNumberSchema(0, 1, "Confidence that repeatable style can be separated from scene content. This is not a quality score."),
      recommendedUseKeys: {
        type: "array",
        minItems: 1,
        maxItems: 3,
        uniqueItems: true,
        items: { type: "string", enum: Array.from(ALLOWED_USE_KEYS) }
      },
      parameters: {
        type: "object",
        additionalProperties: false,
        required: [...REQUIRED_PARAMETER_KEYS],
        properties: parameterProperties,
        description: "Legacy-compatible explainable renderer controls used only for bounded fine adjustment."
      },
      colorTransform: {
        type: "object",
        additionalProperties: false,
        required: [...REQUIRED_COLOR_TRANSFORM_KEYS],
        properties: {
          inputNormalizationStrength: boundedNumberSchema(0, 0.35, "Strength of conservative local-only exposure normalization before style mapping. Zero disables it."),
          styleIntensity: boundedNumberSchema(0, 1, "Strength of the safe curve plus basis-LUT transform before the user's overall intensity slider."),
          lumaCurve: curveSchema,
          redCurve: curveSchema,
          greenCurve: curveSchema,
          blueCurve: curveSchema,
          basisLUTWeights: {
            type: "object",
            additionalProperties: false,
            required: [...BASIS_LUT_KEYS],
            properties: basisLUTProperties,
            description: "Mixture weights for fixed app-bundled deterministic LUT bases. The backend normalizes them to sum to one."
          }
        }
      },
      film: {
        type: "object",
        additionalProperties: false,
        required: [...REQUIRED_FILM_KEYS],
        properties: filmProperties
      },
      warningsKeys: {
        type: "array",
        minItems: 1,
        maxItems: 2,
        uniqueItems: true,
        items: { type: "string", enum: Array.from(ALLOWED_WARNING_KEYS) }
      },
      recipeVersion: { type: "string", enum: [FILTER_RECIPE_VERSION] }
    }
  };
}

export function buildGeneratedFilterRecipeSystemPrompt() {
  return [
    "You are a color-science analyst for a retro camera Filter Lab.",
    "Infer one reusable global photo grade from one already-styled reference photo.",
    "Separate repeatable filter effects from subject matter, object colors, scene lighting, time of day, camera exposure, and composition.",
    "Represent the base color style with safe curves and app-bundled basis-LUT weights; use the 12 legacy controls only as fine adjustments.",
    "Do not identify or judge people and do not output hidden reasoning.",
    "Return only the JSON object required by the supplied schema.",
    "Do not echo the prompt or expose provider, backend, debug, request, or internal classification details.",
    "Do not output shader code, raw LUT data, LUT URLs, image-generation instructions, bitmap data, brand/movie/creator clone claims, or localized UI copy."
  ].join("\n");
}

export function buildGeneratedFilterRecipeSchemaPrompt() {
  return [
    "Return exactly one JSON object for the app's Filter Lab recipe contract.",
    "Use localization keys only; do not write final UI copy.",
    "Do not output Core Image filter names, shader code, raw LUT tables, LUT URLs, executable logic, brand/movie/creator clone claims, or exact-copy promises.",
    `Use only these top-level fields: ${REQUIRED_TOP_LEVEL_KEYS.join(", ")}`,
    `Use only these parameter fields: ${REQUIRED_PARAMETER_KEYS.join(", ")}`,
    `Use only these colorTransform fields: ${REQUIRED_COLOR_TRANSFORM_KEYS.join(", ")}`,
    `Each luma/red/green/blue curve must be a JSON array of exactly ${CURVE_POINT_COUNT} numeric y values for fixed x values [0,0.25,0.5,0.75,1].`,
    `Use only these basisLUTWeights fields: ${BASIS_LUT_KEYS.join(", ")}. Include every field as a JSON number from 0 to 1.`,
    "basisLUTWeights are normalized by the backend, but you should make them sum to 1. Use neutral for unexplained or ambiguous color.",
    `Use only these film fields: ${REQUIRED_FILM_KEYS.join(", ")}`,
    `Allowed nameKey: ${Array.from(ALLOWED_NAME_KEYS).join(", ")}`,
    `Allowed descriptionKey: ${Array.from(ALLOWED_DESCRIPTION_KEYS).join(", ")}`,
    `Allowed recommendedUseKeys: ${Array.from(ALLOWED_USE_KEYS).join(", ")}`,
    `Allowed warningsKeys: ${Array.from(ALLOWED_WARNING_KEYS).join(", ")}`,
    "Allowed source: cloud",
    `Allowed recipeVersion: ${FILTER_RECIPE_VERSION}`,
    `Parameter ranges: ${Object.entries(PARAMETER_RANGES).map(([key, [min, max]]) => `${key}=${min}..${max}`).join(", ")}`,
    `Color transform ranges: ${Object.entries(COLOR_TRANSFORM_RANGES).map(([key, [min, max]]) => `${key}=${min}..${max}`).join(", ")}`,
    `Film ranges: ${Object.entries(FILM_RANGES).map(([key, [min, max]]) => `${key}=${min}..${max}`).join(", ")}`,
    "Estimate the curve/LUT transform and film structure before choosing nameKey or descriptionKey. Labels must not drive values.",
    "Confidence measures style-separation certainty, not visual quality or filter strength.",
    "Output JSON only. No markdown. No prose."
  ].join("\n");
}

export function buildGeneratedFilterRecipeStyleGuidancePrompt() {
  return [
    "Style extraction evidence order:",
    "Treat the final rendered photo pixels as the primary evidence. Match the visible tonal and color result, not a label or number printed by another app.",
    "First locate the actual photograph region. If the reference is a screenshot, exclude white settings panels, QR codes, controls, borders, captions, and sharing UI from every estimate.",
    "A visible third-party preset code can imply an unknown base transform. Its signed sliders are adjustments layered on that transform, so NEVER map them proportionally or directly into this renderer.",
    "Inspect neutral whites, grays, and low-saturation surfaces, then black point, midtone brightness, highlight roll-off, and tonal separation.",
    "Judge the black point from the darkest photographic areas. A bright wall, flash-lit subject, pale background, or interface panel is not evidence of a raised black floor.",
    "Then inspect chroma distribution: whether reds, browns, greens, blues, neutrals, shadows, and highlights move differently.",
    "Use colorTransform for repeatable nonlinear or channel-selective style. Use legacy temperature/tint/saturation only for residual global correction.",
    "Curves must stay monotonic and close to identity. Keep each point within about 0.18 of its fixed input x; keep black endpoints at or below 0.12 and white endpoints at or above 0.88.",
    "Basis meanings: neutral preserves color; warmAmber warms yellows and highlights; roseFlash adds restrained pink-magenta flash character; coolChrome cools cyan-blue neutrals; tealOrange separates cooler shadows and warmer highlights; mutedPastel gently compresses chroma; deepBrown deepens warm red-brown mids; chromeSlide adds clean slide-film separation.",
    "Use multiple modest basis weights instead of one extreme basis. If the scene and style cannot be separated, increase neutral and lower confidence.",
    "When scene lighting and filter evidence conflict, lower confidence and keep only repeatable controls conservative.",
    "Do not choose a preset family first and derive the numeric recipe afterward.",
    "inputNormalizationStrength is local-only conservative exposure normalization for reuse across source photos. Keep it 0.10 to 0.22 normally and never use it to erase an intentionally dark or bright mood.",
    "Use corner-to-center falloff as evidence for vignette, high-frequency texture as grain, sparse spots/scratches as dust, neutral haze as bloom/diffusion, and warm glow limited to strong highlights as halation.",
    "grain is strength; grainSize, grainRoughness, and grainLumaResponse define structure. Positive grainLumaResponse favors shadows; negative favors highlights.",
    "Bloom is neutral white glow. Halation is a separate restrained warm highlight-edge effect. Do not use either as exposure.",
    "Fade, shadowLift, and negative contrast compound; mutedPastel and diffusion can compound with them too. Never use all of them strongly because the reference is bright or flash-lit.",
    "For a warm direct-flash look whose darkest photographic areas remain deep, keep fade at or below 0.10, shadowLift at or below 0.08, and contrast no lower than -0.05.",
    "Use stronger fade or shadowLift only when the darkest photographic regions themselves show a raised black floor. Do not wash them to mid-gray.",
    "Ignore QR codes, watermarks, app logos, usernames, decorative stickers, and sharing UI.",
    "Do not claim an exact clone of a third-party app/filter. Output only the closest safe app recipe."
  ].join("\n");
}

export function buildGeneratedFilterRecipeRendererCalibrationPrompt() {
  return [
    "Renderer calibration anchors:",
    ...REQUIRED_PARAMETER_KEYS.map((key) => {
      const [minimum, maximum] = PARAMETER_RANGES[key];
      return `${key} (${minimum}..${maximum}): ${PARAMETER_DESCRIPTIONS[key]}`;
    }),
    "Curves and basis-LUT weights are combined into one deterministic local 17-level color cube in explicit sRGB. Identity curves plus neutral=1 produce no style shift.",
    "The overall user intensity separately blends normalization, color transform, legacy controls, and film effects back toward identity.",
    "At zero, signed controls are identity. Do not use one control to compensate for another control's implementation.",
    "Estimate the full-strength recipe."
  ].join("\n");
}

export function validateGeneratedFilterRecipeCandidate(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return invalid("wrong_object_shape", "Generated filter recipe must be an object.", "top_level");
  }

  const extraKeys = Object.keys(candidate).filter((key) => !REQUIRED_TOP_LEVEL_KEYS.includes(key));
  if (extraKeys.length > 0) {
    return invalid("additional_property", "Generated filter recipe has unsupported fields.", "top_level");
  }
  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in candidate)) {
      return invalid("missing_required_field", "Generated filter recipe is missing required fields.", "top_level");
    }
  }

  if (candidate.recipeVersion !== FILTER_RECIPE_VERSION) {
    return invalid("unsupported_enum", "Generated filter recipeVersion is unsupported.", "recipe_version");
  }
  if (typeof candidate.id !== "string" || !/^ai_[a-z0-9_]{3,64}$/.test(candidate.id)) {
    return invalid("unsupported_enum", "Generated filter id must be an app-safe ai_* id.", "id");
  }
  if (!ALLOWED_NAME_KEYS.has(candidate.nameKey) || !ALLOWED_DESCRIPTION_KEYS.has(candidate.descriptionKey)) {
    return invalid("unsupported_enum", "Generated filter recipe must use known localization keys.", "localization_keys");
  }
  if (candidate.source !== "cloud") {
    return invalid("unsupported_enum", "Generated filter source must be cloud.", "source");
  }
  if (!Number.isFinite(candidate.confidence)) {
    return invalid("wrong_type", "Generated filter confidence must be a finite number.", "confidence");
  }
  if (!Array.isArray(candidate.recommendedUseKeys) || candidate.recommendedUseKeys.length < 1 || candidate.recommendedUseKeys.length > 3) {
    return invalid("wrong_type", "Generated filter recommendedUseKeys must contain 1 to 3 keys.", "recommended_use_keys");
  }
  if (!candidate.recommendedUseKeys.every((key) => ALLOWED_USE_KEYS.has(key))) {
    return invalid("unsupported_enum", "Generated filter recommendedUseKeys must be known localization keys.", "recommended_use_keys");
  }
  if (!Array.isArray(candidate.warningsKeys) || candidate.warningsKeys.length < 1 || candidate.warningsKeys.length > 2) {
    return invalid("wrong_type", "Generated filter warningsKeys must contain 1 to 2 keys.", "warning_keys");
  }
  if (!candidate.warningsKeys.every((key) => ALLOWED_WARNING_KEYS.has(key))) {
    return invalid("unsupported_enum", "Generated filter warningsKeys must be known safe warning keys.", "warning_keys");
  }

  const parameterValidation = validateAndClampNumberObject(candidate.parameters, REQUIRED_PARAMETER_KEYS, PARAMETER_RANGES, "parameters");
  if (!parameterValidation.ok) return parameterValidation;
  const colorTransformValidation = validateAndClampColorTransform(candidate.colorTransform);
  if (!colorTransformValidation.ok) return colorTransformValidation;
  const filmValidation = validateAndClampNumberObject(candidate.film, REQUIRED_FILM_KEYS, FILM_RANGES, "film");
  if (!filmValidation.ok) return filmValidation;

  return {
    ok: true,
    value: {
      ...candidate,
      confidence: clamp(candidate.confidence, 0, 1),
      parameters: parameterValidation.value,
      colorTransform: colorTransformValidation.value,
      film: filmValidation.value
    },
    clampedFields: [
      ...(candidate.confidence < 0 || candidate.confidence > 1 ? ["confidence"] : []),
      ...parameterValidation.clampedFields,
      ...colorTransformValidation.clampedFields,
      ...filmValidation.clampedFields
    ],
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}

function validateAndClampColorTransform(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return invalid("wrong_object_shape", "Generated filter colorTransform must be an object.", "color_transform");
  }
  if (Object.keys(value).some((key) => !REQUIRED_COLOR_TRANSFORM_KEYS.includes(key))) {
    return invalid("additional_property", "Generated filter colorTransform has unsupported fields.", "color_transform");
  }
  for (const key of REQUIRED_COLOR_TRANSFORM_KEYS) {
    if (!(key in value)) {
      return invalid("missing_required_field", "Generated filter colorTransform is missing required fields.", "color_transform");
    }
  }

  const clampedFields = [];
  const sanitized = {};
  for (const [key, [min, max]] of Object.entries(COLOR_TRANSFORM_RANGES)) {
    if (!Number.isFinite(value[key])) {
      return invalid("wrong_type", "Generated filter colorTransform strengths must be finite numbers.", "color_transform");
    }
    sanitized[key] = clamp(value[key], min, max);
    if (sanitized[key] !== value[key]) clampedFields.push(`colorTransform.${key}`);
  }

  for (const key of CURVE_KEYS) {
    const curveValidation = validateAndClampCurve(value[key], key);
    if (!curveValidation.ok) return curveValidation;
    sanitized[key] = curveValidation.value;
    clampedFields.push(...curveValidation.clampedFields);
  }

  const weightsValidation = validateAndNormalizeBasisWeights(value.basisLUTWeights);
  if (!weightsValidation.ok) return weightsValidation;
  sanitized.basisLUTWeights = weightsValidation.value;
  clampedFields.push(...weightsValidation.clampedFields);

  return { ok: true, value: sanitized, clampedFields };
}

function validateAndClampCurve(curve, key) {
  if (!Array.isArray(curve) || curve.length !== CURVE_POINT_COUNT || !curve.every(Number.isFinite)) {
    return invalid("wrong_type", "Generated filter curves must contain exactly five finite numbers.", "color_transform_curves");
  }

  const sanitized = [];
  let changed = false;
  for (let index = 0; index < CURVE_POINT_COUNT; index += 1) {
    const identity = IDENTITY_CURVE[index];
    const localMin = index === 0 ? 0 : Math.max(0, identity - 0.18);
    const localMax = index === CURVE_POINT_COUNT - 1 ? 1 : Math.min(1, identity + 0.18);
    let next = clamp(curve[index], localMin, localMax);
    if (index === 0) next = Math.min(next, 0.12);
    if (index === CURVE_POINT_COUNT - 1) next = Math.max(next, 0.88);
    if (index > 0) next = Math.max(next, sanitized[index - 1]);
    sanitized.push(next);
    if (next !== curve[index]) changed = true;
  }

  return {
    ok: true,
    value: sanitized,
    clampedFields: changed ? [`colorTransform.${key}`] : []
  };
}

function validateAndNormalizeBasisWeights(weights) {
  if (!weights || typeof weights !== "object" || Array.isArray(weights)) {
    return invalid("wrong_object_shape", "Generated filter basisLUTWeights must be an object.", "basis_lut_weights");
  }
  if (Object.keys(weights).some((key) => !BASIS_LUT_KEYS.includes(key))) {
    return invalid("additional_property", "Generated filter basisLUTWeights have unsupported fields.", "basis_lut_weights");
  }

  const sanitized = {};
  let changed = false;
  for (const key of BASIS_LUT_KEYS) {
    if (!(key in weights)) {
      return invalid("missing_required_field", "Generated filter basisLUTWeights are missing required fields.", "basis_lut_weights");
    }
    if (!Number.isFinite(weights[key])) {
      return invalid("wrong_type", "Generated filter basisLUTWeights must be finite numbers.", "basis_lut_weights");
    }
    sanitized[key] = clamp(weights[key], 0, 1);
    if (sanitized[key] !== weights[key]) changed = true;
  }

  const total = BASIS_LUT_KEYS.reduce((sum, key) => sum + sanitized[key], 0);
  if (total <= 0.000001) {
    for (const key of BASIS_LUT_KEYS) sanitized[key] = key === "neutral" ? 1 : 0;
    changed = true;
  } else if (Math.abs(total - 1) > 0.000001) {
    for (const key of BASIS_LUT_KEYS) sanitized[key] /= total;
    changed = true;
  }

  return {
    ok: true,
    value: sanitized,
    clampedFields: changed ? ["colorTransform.basisLUTWeights"] : []
  };
}

function validateAndClampNumberObject(value, requiredKeys, ranges, fieldBucket) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return invalid("wrong_object_shape", `Generated filter ${fieldBucket} must be an object.`, fieldBucket);
  }
  if (Object.keys(value).some((key) => !requiredKeys.includes(key))) {
    return invalid("additional_property", `Generated filter ${fieldBucket} has unsupported fields.`, fieldBucket);
  }

  const sanitized = {};
  const clampedFields = [];
  for (const key of requiredKeys) {
    if (!(key in value)) {
      return invalid("missing_required_field", `Generated filter ${fieldBucket} is missing required fields.`, fieldBucket);
    }
    if (!Number.isFinite(value[key])) {
      return invalid("wrong_type", `Generated filter ${fieldBucket} must contain finite numbers.`, fieldBucket);
    }
    const [min, max] = ranges[key];
    sanitized[key] = clamp(value[key], min, max);
    if (sanitized[key] !== value[key]) clampedFields.push(`${fieldBucket}.${key}`);
  }
  return { ok: true, value: sanitized, clampedFields };
}

function boundedNumberSchema(minimum, maximum, description) {
  return { type: "number", minimum, maximum, description };
}

function filmDescription(key) {
  const descriptions = {
    grainSize: "Relative film-grain clump size. It shapes the existing grain strength and must not act as extra grain opacity.",
    grainRoughness: "Grain contrast and irregularity. Zero is soft and fine; one is visibly rough but still bounded.",
    grainLumaResponse: "Where grain is emphasized. Positive favors shadows, negative favors highlights, and zero is even.",
    halationStrength: "Warm highlight-edge glow strength, separate from neutral bloom and exposure.",
    halationRadius: "Warm halation spread radius in preview pixels before the user's overall intensity blend.",
    halationWarmth: "Halation red-amber bias. Zero is nearly neutral and one is the warmest safe bias.",
    diffusion: "Whole-image optical softness mixed conservatively with the sharp source; zero disables it."
  };
  return descriptions[key];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function invalid(code, message, fieldBucket = "unknown") {
  return {
    ok: false,
    error: { code, message, fieldBucket },
    rawOutputPrinted: false,
    rawOutputPersisted: false
  };
}
