import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildGeneratedFilterRecipeRendererCalibrationPrompt,
  buildGeneratedFilterRecipeSchemaPrompt,
  buildGeneratedFilterRecipeStyleGuidancePrompt,
  buildGeneratedFilterRecipeSystemPrompt,
  generatedFilterRecipeExampleCandidate,
  generatedFilterRecipeJSONSchema,
  validateGeneratedFilterRecipeCandidate
} from "../src/providers/generatedFilterRecipeContract.mjs";
import { evaluateFilterLabRecipeFidelity } from "../src/qa/filterLabRecipeFidelityEvaluator.mjs";

test("Filter Lab structured output schema describes every bounded renderer control", () => {
  const schema = generatedFilterRecipeJSONSchema();
  const parameters = schema.properties.parameters;
  const colorTransform = schema.properties.colorTransform;
  const film = schema.properties.film;

  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.equal(parameters.additionalProperties, false);
  assert.equal(colorTransform.additionalProperties, false);
  assert.equal(film.additionalProperties, false);
  assert.deepEqual(parameters.required, [
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

  for (const key of parameters.required) {
    assert.equal(parameters.properties[key].type, "number");
    assert.equal(Number.isFinite(parameters.properties[key].minimum), true);
    assert.equal(Number.isFinite(parameters.properties[key].maximum), true);
    assert.equal(parameters.properties[key].description.length > 30, true);
  }
  assert.deepEqual(colorTransform.required, [
    "inputNormalizationStrength",
    "styleIntensity",
    "lumaCurve",
    "redCurve",
    "greenCurve",
    "blueCurve",
    "basisLUTWeights"
  ]);
  for (const key of ["lumaCurve", "redCurve", "greenCurve", "blueCurve"]) {
    assert.equal(colorTransform.properties[key].minItems, 5);
    assert.equal(colorTransform.properties[key].maxItems, 5);
  }
  assert.equal(colorTransform.properties.basisLUTWeights.required.length, 8);
  assert.equal(film.required.length, 7);
});

test("Filter Lab prompt separates scene content from reusable filter evidence without preset anchoring", () => {
  const prompt = [
    buildGeneratedFilterRecipeSystemPrompt(),
    buildGeneratedFilterRecipeSchemaPrompt(),
    buildGeneratedFilterRecipeStyleGuidancePrompt(),
    buildGeneratedFilterRecipeRendererCalibrationPrompt()
  ].join("\n");

  assert.match(prompt, /color-science analyst/i);
  assert.match(prompt, /neutral whites, grays/i);
  assert.match(prompt, /black point, midtone brightness, highlight roll-off/i);
  assert.match(prompt, /final rendered photo pixels as the primary evidence/i);
  assert.match(prompt, /NEVER map them proportionally or directly/i);
  assert.match(prompt, /First locate the actual photograph region/i);
  assert.match(prompt, /exclude white settings panels/i);
  assert.match(prompt, /bright wall, flash-lit subject, pale background/i);
  assert.match(prompt, /Fade, shadowLift, lumaCurve black lift, and negative contrast compound/i);
  assert.match(prompt, /one black-floor budget/i);
  assert.match(prompt, /lumaBlack \+ fade\*0\.15 \+ shadowLift\*0\.22/i);
  assert.match(prompt, /fade at or below 0\.05, shadowLift at or below 0\.035/i);
  assert.match(prompt, /RGB channel-curve black endpoint to exactly 0/i);
  assert.match(prompt, /wash them to mid-gray/i);
  assert.match(prompt, /scene lighting and filter evidence conflict/i);
  assert.match(prompt, /Do not choose a preset family first/i);
  assert.match(prompt, /Renderer calibration anchors/i);
  assert.match(prompt, /safe curves and app-bundled basis-LUT weights/i);
  assert.match(prompt, /exactly 5 numeric y values/i);
  assert.match(prompt, /warmAmber warms yellows and highlights/i);
  assert.match(prompt, /Bloom is neutral white glow\. Halation is a separate/i);
  assert.match(prompt, /17-level color cube in explicit sRGB/i);
  assert.match(prompt, /Do not output shader code, raw LUT data, LUT URLs/i);
  assert.match(prompt, /full-strength recipe/i);
  assert.doesNotMatch(prompt, /If uncertain, choose amber_travel_glow/i);
  assert.doesNotMatch(prompt, /return this safe contract object/i);
});

test("synthetic Filter Lab fidelity evaluator returns sanitized aggregate parameter error buckets", () => {
  const expected = generatedFilterRecipeExampleCandidate();
  const actual = {
    ...expected,
    parameters: {
      ...expected.parameters,
      exposure: expected.parameters.exposure + 0.02,
      temperature: -expected.parameters.temperature,
      tint: 0
    }
  };

  const report = evaluateFilterLabRecipeFidelity({ expected, actual });

  assert.equal(report.ok, true);
  assert.equal(report.perParameterErrorBuckets.exposure, "lte_0_03");
  assert.equal(report.perParameterErrorBuckets.temperature, "gt_0_10");
  assert.equal(report.directionMismatchCount, 1);
  assert.equal(report.neutralizedStrongControlCount, 1);
  assert.equal(report.parameterCount, 49);
  assert.equal(report.providerCallsMade, 0);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.productionReady, false);
  assert.equal(JSON.stringify(report).includes("filter_lab.recipe"), false);
});

test("synthetic Filter Lab fidelity evaluator fails closed on an invalid candidate", () => {
  const expected = generatedFilterRecipeExampleCandidate();
  const actual = {
    ...expected,
    parameters: {
      exposure: 0
    }
  };

  const report = evaluateFilterLabRecipeFidelity({ expected, actual });

  assert.equal(report.ok, false);
  assert.equal(report.validationBucket, "actual_recipe_schema_invalid");
  assert.equal(report.meanAbsoluteErrorBucket, "not_computed");
  assert.equal(report.productionReady, false);
});

test("Filter Lab recipe validator clamps curves and normalizes only fixed safe LUT weights", () => {
  const candidate = generatedFilterRecipeExampleCandidate();
  candidate.colorTransform.lumaCurve = [-2, 0.7, 0.1, 1.8, 0.2];
  candidate.colorTransform.basisLUTWeights = Object.fromEntries(
    Object.keys(candidate.colorTransform.basisLUTWeights).map((key) => [key, 1])
  );

  const validation = validateGeneratedFilterRecipeCandidate(candidate);

  assert.equal(validation.ok, true);
  assert.deepEqual(
    validation.value.colorTransform.lumaCurve.map((value) => Number(value.toFixed(2))),
    [0, 0.43, 0.43, 0.93, 0.93]
  );
  assert.equal(Object.values(validation.value.colorTransform.basisLUTWeights).every((value) => value === 0.125), true);
  assert.equal(validation.clampedFields.includes("colorTransform.lumaCurve"), true);
  assert.equal(validation.clampedFields.includes("colorTransform.basisLUTWeights"), true);
});

test("Filter Lab recipe validator prevents compound black-floor lift without changing the warm style direction", () => {
  const candidate = generatedFilterRecipeExampleCandidate();
  candidate.parameters = {
    ...candidate.parameters,
    contrast: -0.03,
    saturation: 0.06,
    temperature: 0.18,
    fade: 0.07,
    shadowLift: 0.05
  };
  candidate.colorTransform = {
    ...candidate.colorTransform,
    styleIntensity: 0.82,
    lumaCurve: [0.02, 0.24, 0.5, 0.77, 0.98],
    redCurve: [0.03, 0.27, 0.53, 0.78, 0.98],
    greenCurve: [0.02, 0.25, 0.51, 0.76, 0.97],
    blueCurve: [0.02, 0.24, 0.48, 0.72, 0.95]
  };

  const validation = validateGeneratedFilterRecipeCandidate(candidate);

  assert.equal(validation.ok, true);
  assert.equal(validation.value.parameters.contrast, 0);
  assert.equal(validation.value.parameters.fade < 0.05, true);
  assert.equal(validation.value.parameters.shadowLift < 0.035, true);
  assert.equal(validation.value.parameters.temperature, 0.18);
  assert.equal(validation.value.parameters.saturation, 0.06);
  for (const key of ["redCurve", "greenCurve", "blueCurve"]) {
    assert.equal(validation.value.colorTransform[key][0], 0);
    assert.equal(validation.value.colorTransform[key][4], 1);
  }
  const blackFloorLift = validation.value.colorTransform.lumaCurve[0]
    + validation.value.parameters.fade * 0.15
    + validation.value.parameters.shadowLift * 0.22
    + Math.max(-validation.value.parameters.contrast, 0) * 0.35;
  assert.equal(blackFloorLift <= 0.035001, true);
  for (const field of [
    "parameters.contrast",
    "parameters.fade",
    "parameters.shadowLift",
    "colorTransform.redCurve",
    "colorTransform.greenCurve",
    "colorTransform.blueCurve"
  ]) {
    assert.equal(validation.clampedFields.includes(field), true);
  }
});

test("Filter Lab recipe validator rejects raw LUT fields and malformed curve arrays", () => {
  const rawLUTCandidate = generatedFilterRecipeExampleCandidate();
  rawLUTCandidate.colorTransform.rawLUT = [0, 1];
  const malformedCurveCandidate = generatedFilterRecipeExampleCandidate();
  malformedCurveCandidate.colorTransform.redCurve = [0, 1];

  assert.equal(validateGeneratedFilterRecipeCandidate(rawLUTCandidate).ok, false);
  assert.equal(validateGeneratedFilterRecipeCandidate(rawLUTCandidate).error.fieldBucket, "color_transform");
  assert.equal(validateGeneratedFilterRecipeCandidate(malformedCurveCandidate).ok, false);
  assert.equal(validateGeneratedFilterRecipeCandidate(malformedCurveCandidate).error.fieldBucket, "color_transform_curves");
});

test("Filter Lab local renderer consumes every recipe control with one exposure path and full default intensity", async () => {
  const renderer = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterPreviewRenderer.swift",
    import.meta.url
  ), "utf8");
  const viewModel = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift",
    import.meta.url
  ), "utf8");

  assert.match(renderer, /applyInputNormalization/);
  assert.match(renderer, /applyColorTransform\(recipe\.colorTransform/);
  assert.match(renderer, /applyExposure\(parameters\.exposure,/);
  assert.match(renderer, /applyTone\(parameters, intensity: effectIntensity/);
  assert.match(renderer, /parameters\.shadowLift \* intensity/);
  assert.match(renderer, /parameters\.highlightRollOff \* intensity/);
  assert.match(renderer, /applyBloom\(parameters\.bloom,/);
  assert.match(renderer, /applyDiffusion\(recipe\.film\.diffusion,/);
  assert.match(renderer, /applyHalation\(recipe\.film/);
  assert.match(renderer, /applyGrain\(parameters\.grain, film: recipe\.film/);
  assert.match(renderer, /applyDust\(parameters\.dust,/);
  assert.match(renderer, /CISoftLightBlendMode/);
  assert.match(renderer, /CIScreenBlendMode/);
  assert.match(renderer, /CIColorCubeWithColorSpace/);
  assert.match(renderer, /CIAreaAverage/);
  assert.match(renderer, /CIBlendWithMask/);
  assert.match(renderer, /CIDissolveTransition/);
  assert.match(renderer, /if intensity > 0\.0001/);
  assert.match(renderer, /blackLift = min\(fade \* 0\.15, 0\.075\)/);
  assert.match(renderer, /inputShadowAmount": min\(0\.22, shadowLift \* 0\.55\)/);
  assert.doesNotMatch(renderer, /shadowLift \* 1\.8/);
  assert.match(renderer, /vignette \* 1\.35/);
  assert.doesNotMatch(renderer, /kCIInputBrightnessKey/);
  assert.match(viewModel, /intensity: Double = 1\.0/);
  assert.doesNotMatch(renderer, /api\.siliconflow|Authorization|Bearer /i);
});

test("Filter Lab recipe 2.0 remains aligned across backend, iOS decoding, validation, and diagnostics", async () => {
  const parameterSet = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterParameterSet.swift",
    import.meta.url
  ), "utf8");
  const cloudModels = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Services/CloudAI/CloudAIModels.swift",
    import.meta.url
  ), "utf8");
  const cloudMapper = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Services/CloudAI/CloudAIPhotoAdvisorMapper.swift",
    import.meta.url
  ), "utf8");
  const cloudValidator = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Services/CloudAI/CloudAIResponseValidator.swift",
    import.meta.url
  ), "utf8");
  const resultView = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterResultView.swift",
    import.meta.url
  ), "utf8");
  const colorTransformModel = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterColorTransform.swift",
    import.meta.url
  ), "utf8");
  const filmModel = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilmParameterSet.swift",
    import.meta.url
  ), "utf8");
  const cubeBuilder = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterColorCubeBuilder.swift",
    import.meta.url
  ), "utf8");
  const englishLocalization = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings",
    import.meta.url
  ), "utf8");
  const parameterKeys = generatedFilterRecipeJSONSchema().properties.parameters.required;

  assert.match(cloudValidator, /recipeVersion == "1\.1" \|\| recipeVersion == "2\.0"/);
  assert.match(cloudValidator, /hasSafeV2BlackFloorBudget/);
  assert.match(cloudValidator, /isSafeGeneratedFilterChannelCurve/);
  assert.match(colorTransformModel, /redCurve: \[Double\]/);
  for (const key of parameterKeys) {
    assert.match(parameterSet, new RegExp(`var ${key}: Double`));
    assert.match(cloudModels, new RegExp(`let ${key}: Double`));
    assert.match(cloudMapper, new RegExp(`${key}: generatedFilter\\.parameters\\.${key}`));
    assert.match(resultView, new RegExp(`params\\.${key}`));
  }

  const colorTransformKeys = generatedFilterRecipeJSONSchema().properties.colorTransform.required;
  for (const key of colorTransformKeys.filter((key) => key !== "basisLUTWeights")) {
    assert.match(colorTransformModel, new RegExp(`var ${key}:`));
    assert.match(cloudModels, new RegExp(`let ${key}:`));
  }
  for (const key of generatedFilterRecipeJSONSchema().properties.film.required) {
    assert.match(filmModel, new RegExp(`var ${key}: Double`));
    assert.match(cloudModels, new RegExp(`let ${key}: Double`));
    assert.match(resultView, new RegExp(`film\.${key}`));
  }
  assert.match(cloudMapper, /colorTransform: generatedFilter\.colorTransform/);
  assert.match(cloudMapper, /film: generatedFilter\.film/);
  assert.match(cubeBuilder, /static let dimension = 17/);
  assert.doesNotMatch(cubeBuilder, /http|Authorization|Bearer /i);

  const summaryLine = englishLocalization
    .split("\n")
    .find((line) => line.includes('"filter_lab.parameters.summary"'));
  assert.equal(summaryLine?.match(/%\.2f/g)?.length, parameterKeys.length);
  assert.match(englishLocalization, /"filter_lab\.color_transform\.summary"/);
  assert.match(englishLocalization, /"filter_lab\.film\.summary"/);
  assert.match(englishLocalization, /"filter_lab\.parameters" = "Filter parameters"/);
});
