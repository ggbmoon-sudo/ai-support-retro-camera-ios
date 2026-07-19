import { validateGeneratedFilterRecipeCandidate } from "../providers/generatedFilterRecipeContract.mjs";

const PARAMETER_KEYS = Object.freeze([
  "exposure",
  "contrast",
  "saturation",
  "temperature",
  "tint",
  "fade",
  "grain",
  "vignette"
]);

const SIGNED_PARAMETER_KEYS = new Set([
  "exposure",
  "contrast",
  "saturation",
  "temperature",
  "tint"
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

  const meanAbsoluteError = totalAbsoluteError / PARAMETER_KEYS.length;
  return {
    ok: true,
    validationBucket: "accepted",
    meanAbsoluteErrorBucket: absoluteErrorBucket(meanAbsoluteError),
    perParameterErrorBuckets,
    directionMismatchCount,
    neutralizedStrongControlCount,
    parameterCount: PARAMETER_KEYS.length,
    rawExpectedRecipeIncluded: false,
    rawActualRecipeIncluded: false,
    rawImageIncluded: false,
    rawProviderTextIncluded: false,
    providerCallsMade: 0,
    imageReadsPerformed: false,
    productionReady: false
  };
}

function invalidReport(validationBucket) {
  return {
    ok: false,
    validationBucket,
    meanAbsoluteErrorBucket: "not_computed",
    perParameterErrorBuckets: {},
    directionMismatchCount: 0,
    neutralizedStrongControlCount: 0,
    parameterCount: PARAMETER_KEYS.length,
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
