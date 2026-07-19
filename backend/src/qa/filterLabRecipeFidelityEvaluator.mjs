import { validateGeneratedFilterRecipeCandidate } from "../providers/generatedFilterRecipeContract.mjs";

const PARAMETER_KEYS = Object.freeze([
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
]);

const SIGNED_PARAMETER_KEYS = new Set([
  "exposure",
  "contrast",
  "saturation",
  "temperature",
  "tint"
]);

const COLOR_TRANSFORM_SCALAR_KEYS = Object.freeze([
  "inputNormalizationStrength",
  "styleIntensity"
]);

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

const FILM_KEYS = Object.freeze([
  "grainSize",
  "grainRoughness",
  "grainLumaResponse",
  "halationStrength",
  "halationRadius",
  "halationWarmth",
  "diffusion"
]);

export function evaluateFilterLabRecipeFidelity({ expected, actual } = {}) {
  const expectedValidation = validateGeneratedFilterRecipeCandidate(expected);
  if (!expectedValidation.ok) {
    return invalidReport("expected_recipe_schema_invalid");
  }

  const actualValidation = validateGeneratedFilterRecipeCandidate(actual);
  if (!actualValidation.ok) {
    return invalidReport("actual_recipe_schema_invalid");
  }

  const expectedParameters = expectedValidation.value.parameters;
  const actualParameters = actualValidation.value.parameters;
  const perParameterErrorBuckets = {};
  let totalAbsoluteError = 0;
  let directionMismatchCount = 0;
  let neutralizedStrongControlCount = 0;

  for (const key of PARAMETER_KEYS) {
    const expectedValue = expectedParameters[key];
    const actualValue = actualParameters[key];
    const absoluteError = Math.abs(expectedValue - actualValue);
    totalAbsoluteError += absoluteError;
    perParameterErrorBuckets[key] = absoluteErrorBucket(absoluteError);

    if (SIGNED_PARAMETER_KEYS.has(key) && Math.abs(expectedValue) >= 0.04) {
      if (expectedValue * actualValue < 0) {
        directionMismatchCount += 1;
      } else if (Math.abs(actualValue) < 0.02) {
        neutralizedStrongControlCount += 1;
      }
    }
  }

  for (const key of COLOR_TRANSFORM_SCALAR_KEYS) {
    addError(`colorTransform.${key}`, expectedValidation.value.colorTransform[key], actualValidation.value.colorTransform[key]);
  }
  for (const key of CURVE_KEYS) {
    for (let index = 0; index < expectedValidation.value.colorTransform[key].length; index += 1) {
      addError(
        `colorTransform.${key}.${index}`,
        expectedValidation.value.colorTransform[key][index],
        actualValidation.value.colorTransform[key][index]
      );
    }
  }
  for (const key of BASIS_LUT_KEYS) {
    addError(
      `colorTransform.basisLUTWeights.${key}`,
      expectedValidation.value.colorTransform.basisLUTWeights[key],
      actualValidation.value.colorTransform.basisLUTWeights[key]
    );
  }
  for (const key of FILM_KEYS) {
    addError(`film.${key}`, expectedValidation.value.film[key], actualValidation.value.film[key]);
  }

  const valueCount = PARAMETER_KEYS.length
    + COLOR_TRANSFORM_SCALAR_KEYS.length
    + CURVE_KEYS.length * 5
    + BASIS_LUT_KEYS.length
    + FILM_KEYS.length;
  const meanAbsoluteError = totalAbsoluteError / valueCount;
  return {
    ok: true,
    validationBucket: "accepted",
    meanAbsoluteErrorBucket: absoluteErrorBucket(meanAbsoluteError),
    perParameterErrorBuckets,
    directionMismatchCount,
    neutralizedStrongControlCount,
    parameterCount: valueCount,
    rawExpectedRecipeIncluded: false,
    rawActualRecipeIncluded: false,
    rawImageIncluded: false,
    rawProviderTextIncluded: false,
    providerCallsMade: 0,
    imageReadsPerformed: false,
    productionReady: false
  };

  function addError(key, expectedValue, actualValue) {
    const absoluteError = Math.abs(expectedValue - actualValue);
    totalAbsoluteError += absoluteError;
    perParameterErrorBuckets[key] = absoluteErrorBucket(absoluteError);
  }
}

function invalidReport(validationBucket) {
  return {
    ok: false,
    validationBucket,
    meanAbsoluteErrorBucket: "not_computed",
    perParameterErrorBuckets: {},
    directionMismatchCount: 0,
    neutralizedStrongControlCount: 0,
    parameterCount: PARAMETER_KEYS.length
      + COLOR_TRANSFORM_SCALAR_KEYS.length
      + CURVE_KEYS.length * 5
      + BASIS_LUT_KEYS.length
      + FILM_KEYS.length,
    rawExpectedRecipeIncluded: false,
    rawActualRecipeIncluded: false,
    rawImageIncluded: false,
    rawProviderTextIncluded: false,
    providerCallsMade: 0,
    imageReadsPerformed: false,
    productionReady: false
  };
}

function absoluteErrorBucket(value) {
  if (value <= 0.01) {
    return "lte_0_01";
  }
  if (value <= 0.03) {
    return "lte_0_03";
  }
  if (value <= 0.06) {
    return "lte_0_06";
  }
  if (value <= 0.1) {
    return "lte_0_10";
  }
  return "gt_0_10";
}
