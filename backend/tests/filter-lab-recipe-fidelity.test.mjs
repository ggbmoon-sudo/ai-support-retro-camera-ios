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
  assert.match(prompt, /transfer to unrelated source photos/i);
  assert.match(prompt, /lumaCurve owns the primary reusable tone transfer/i);
  assert.match(prompt, /x=0\.25 point declares reusable shadow-detail intent/i);
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
  assert.match(prompt, /lumaCurve-owned tone floor/i);
  assert.match(prompt, /allows bounded residual density from exposure\/contrast, temperature, RGB curves, and basis looks/i);
  assert.match(prompt, /bounded local chromaticity-preserving micro-lift/i);
  assert.match(prompt, /isolated dark objects, saturated color styling, declared vignette, and intentional low-key luma curves remain unchanged/i);
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
  const cubeBuilder = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterColorCubeBuilder.swift",
    import.meta.url
  ), "utf8");

  assert.match(renderer, /applyInputNormalization/);
  assert.match(renderer, /applyColorTransform\(\s*recipe\.colorTransform/);
  assert.match(renderer, /applyExposure\(parameters\.exposure,/);
  assert.match(renderer, /applyTone\(parameters, intensity: effectIntensity/);
  assert.match(renderer, /parameters\.shadowLift \* intensity/);
  assert.match(renderer, /parameters\.highlightRollOff \* intensity/);
  assert.match(renderer, /applyBloom\(parameters\.bloom,/);
  assert.match(renderer, /applyDiffusion\(recipe\.film\.diffusion,/);
  assert.match(renderer, /applyHalation\(recipe\.film/);
  assert.match(renderer, /applyGrain\(parameters\.grain, film: recipe\.film/);
  assert.match(renderer, /applyDust\(parameters\.dust,/);
  assert.match(renderer, /applyAdaptiveShadowDetailGuard/);
  assert.match(renderer, /adaptiveShadowCorrection/);
  assert.match(renderer, /primaryShadowLuminance/);
  assert.match(renderer, /legacyAdjustedShadowLuminance/);
  assert.match(renderer, /fullStyleShadowLuminances/);
  assert.match(renderer, /declaredStyleDensityAllowance/);
  assert.match(renderer, /normalizationExposure: normalizedInput\.exposure/);
  assert.match(renderer, /recipe\.recipeVersion == "2\.0"/);
  assert.match(renderer, /adaptiveToneSampleLongEdge: CGFloat = 64/);
  assert.match(renderer, /adaptiveToneTileCount = 6/);
  assert.match(renderer, /sourceShadowSample\.luminance <= 0\.38/);
  assert.match(renderer, /sourceDetailPercentile - sourceShadowSample\.luminance >= 0\.018/);
  assert.match(renderer, /sourceTileColors: sourceTileColors/);
  assert.match(renderer, /shadowChromaEvidence\(/);
  assert.match(renderer, /adaptiveToneMaximumShadowChroma = 0\.12/);
  assert.match(renderer, /adaptiveToneMaximumRelativeShadowChroma = 0\.45/);
  assert.match(renderer, /adaptiveToneMaximumSampleRelativeChroma = 0\.55/);
  assert.match(renderer, /sourceTileColors: \[SIMD3<Double>\]/);
  assert.match(renderer, /sourceColorGroups: \[\[SIMD3<Double>\]\]/);
  assert.match(renderer, /alpha\[index\] >= 0\.95/);
  assert.match(renderer, /samples\.count >= 3/);
  assert.match(renderer, /significantDamageCount >= 2/);
  assert.match(renderer, /CILanczosScaleTransform/);
  assert.match(renderer, /CIGaussianBlur/);
  assert.match(renderer, /adaptiveToneMaskPixelsPerTile = 24/);
  assert.match(renderer, /min\(max\(min\(extent\.width, extent\.height\) \/ 320, 2\), 6\)/);
  assert.match(renderer, /adaptiveToneActivationFloor = 0\.006/);
  assert.match(renderer, /effectiveDamage \* 0\.90, 0\), 0\.045/);
  assert.doesNotMatch(renderer, /CIToneCurve/);
  assert.doesNotMatch(renderer, /tileDamage\.last|worst \* 0\.30/);
  assert.equal(renderer.indexOf("applyAdaptiveShadowDetailGuard(") < renderer.indexOf("applyBloom(parameters.bloom"), true);
  assert.equal(renderer.indexOf("applyAdaptiveShadowDetailGuard(") < renderer.indexOf("applyGrain(parameters.grain"), true);
  assert.match(renderer, /CISoftLightBlendMode/);
  assert.match(renderer, /CIScreenBlendMode/);
  assert.match(renderer, /CIColorCubeWithColorSpace/);
  assert.match(renderer, /CIAreaAverage/);
  assert.match(renderer, /CIBlendWithMask/);
  assert.match(renderer, /CIDissolveTransition/);
  assert.match(renderer, /if intensity > 0\.0001/);
  assert.match(renderer, /blackLift = min\(safeFade \* 0\.15, 0\.075\)/);
  assert.match(renderer, /intended = try applyFade\(parameters\.fade, to: intended\)/);
  assert.match(renderer, /inputShadowAmount": min\(0\.22, shadowLift \* 0\.55\)/);
  assert.doesNotMatch(renderer, /shadowLift \* 1\.8/);
  assert.match(renderer, /vignette \* 1\.35/);
  assert.doesNotMatch(renderer, /kCIInputBrightnessKey/);
  assert.match(viewModel, /intensity: Double = 1\.0/);
  assert.match(viewModel, /intensityRenderDebounceNanoseconds: UInt64 = 100_000_000/);
  assert.match(viewModel, /Task\.sleep\(/);
  assert.match(cubeBuilder, /adaptiveShadowDetailData\(toeLift:/);
  assert.match(cubeBuilder, /toeLift \* 0\.72, 0\), 0\.025/);
  assert.match(cubeBuilder, /targetLuminance \/ inputLuminance/);
  assert.match(cubeBuilder, /smoothstep\(0\.10, 0\.24, inputLuminance\)/);
  assert.doesNotMatch(renderer, /api\.siliconflow|Authorization|Bearer /i);
  assert.doesNotMatch(renderer, /\bcat\b|foodie|CH3|golden_rooftop_dream/i);
});

test("adaptive tone policy requires repeated neutral textured shadows and preserves declared styles", () => {
  const accidental = mirroredAdaptiveToneDecision({
    sourceP10: [0.086, 0.119, 0.209, 0.125, 0.351, 0.55],
    sourceP25: [0.106, 0.185, 0.384, 0.212, 0.392, 0.60],
    primaryP10: [0.100, 0.139, 0.229, 0.145, 0.354, 0.55],
    legacyP10: [0.074, 0.113, 0.207, 0.121, 0.338, 0.54],
    fullStyleP10: [0.068, 0.104, 0.194, 0.112, 0.327, 0.53],
    filteredP10: [0.049, 0.061, 0.098, 0.069, 0.257, 0.52],
    shadowAbsoluteChroma: [0.04, 0.06, 0.05, 0.07, 0.08, 0.04],
    shadowRelativeChroma: [0.20, 0.28, 0.22, 0.30, 0.18, 0.12],
    selectedRelativeChroma: [0.22, 0.30, 0.24, 0.32, 0.20, 0.14],
    temperature: 0.12,
    tint: 0.03
  });
  assert.equal(accidental.toeLift > 0.015, true);
  assert.equal(accidental.toeLift <= 0.045, true);
  assert.equal(accidental.tileWeights.filter((weight) => weight > 0).length >= 2, true);

  const intentionalLowKey = mirroredAdaptiveToneDecision({
    sourceP10: [0.08, 0.14, 0.22, 0.31, 0.36],
    sourceP25: [0.12, 0.19, 0.29, 0.37, 0.42],
    primaryP10: [0.05, 0.09, 0.15, 0.23, 0.29],
    legacyP10: [0.043, 0.080, 0.140, 0.220, 0.278],
    fullStyleP10: [0.04, 0.078, 0.142, 0.225, 0.278],
    filteredP10: [0.043, 0.082, 0.146, 0.231, 0.286],
    shadowAbsoluteChroma: [0.03, 0.04, 0.05, 0.06, 0.05],
    shadowRelativeChroma: [0.18, 0.20, 0.22, 0.24, 0.20],
    selectedRelativeChroma: [0.20, 0.22, 0.24, 0.26, 0.22]
  });
  assert.equal(intentionalLowKey.toeLift, 0);

  const softFaded = mirroredAdaptiveToneDecision({
    sourceP10: [0.09, 0.16, 0.24, 0.34],
    sourceP25: [0.14, 0.22, 0.31, 0.41],
    primaryP10: [0.13, 0.20, 0.28, 0.37],
    legacyP10: [0.13, 0.20, 0.28, 0.37],
    fullStyleP10: [0.132, 0.202, 0.282, 0.372],
    filteredP10: [0.135, 0.205, 0.285, 0.375],
    shadowAbsoluteChroma: [0.02, 0.03, 0.04, 0.03],
    shadowRelativeChroma: [0.12, 0.16, 0.18, 0.14],
    selectedRelativeChroma: [0.14, 0.18, 0.20, 0.16]
  });
  assert.equal(softFaded.toeLift, 0);

  const brightSourceNormalization = mirroredAdaptiveToneDecision({
    sourceP10: [0.24, 0.28, 0.31, 0.34, 0.36, 0.38],
    sourceP25: [0.29, 0.34, 0.37, 0.40, 0.43, 0.45],
    primaryP10: [0.212, 0.247, 0.274, 0.300, 0.318, 0.335],
    legacyP10: [0.212, 0.247, 0.274, 0.300, 0.318, 0.335],
    fullStyleP10: [0.212, 0.247, 0.274, 0.300, 0.318, 0.335],
    filteredP10: [0.212, 0.247, 0.274, 0.300, 0.318, 0.335],
    shadowAbsoluteChroma: [0.02, 0.03, 0.04, 0.05, 0.04, 0.03],
    shadowRelativeChroma: [0.10, 0.12, 0.14, 0.16, 0.14, 0.12],
    selectedRelativeChroma: [0.12, 0.14, 0.16, 0.18, 0.16, 0.14]
  });
  assert.equal(brightSourceNormalization.toeLift, 0);

  const oneDarkObject = mirroredAdaptiveToneDecision({
    sourceP10: [0.08, 0.18, 0.26, 0.52],
    sourceP25: [0.15, 0.24, 0.33, 0.59],
    primaryP10: [0.11, 0.19, 0.27, 0.51],
    legacyP10: [0.105, 0.185, 0.265, 0.50],
    fullStyleP10: [0.10, 0.18, 0.26, 0.50],
    filteredP10: [0.02, 0.185, 0.265, 0.50],
    shadowAbsoluteChroma: [0.03, 0.04, 0.05, 0.03],
    shadowRelativeChroma: [0.18, 0.20, 0.22, 0.16],
    selectedRelativeChroma: [0.20, 0.22, 0.24, 0.18]
  });
  assert.equal(oneDarkObject.toeLift, 0);

  const flatBlackTiles = mirroredAdaptiveToneDecision({
    sourceP10: [0.01, 0.03, 0.06, 0.09],
    sourceP25: [0.015, 0.038, 0.069, 0.101],
    primaryP10: [0.03, 0.05, 0.08, 0.11],
    legacyP10: [0.025, 0.045, 0.075, 0.105],
    fullStyleP10: [0.02, 0.04, 0.07, 0.10],
    filteredP10: [0.005, 0.01, 0.02, 0.03],
    shadowAbsoluteChroma: [0.01, 0.02, 0.02, 0.03],
    shadowRelativeChroma: [0.12, 0.16, 0.18, 0.20],
    selectedRelativeChroma: [0.14, 0.18, 0.20, 0.22]
  });
  assert.equal(flatBlackTiles.toeLift, 0);

  const intentionalChromaticShadows = mirroredAdaptiveToneDecision({
    sourceP10: [0.07, 0.11, 0.16, 0.22],
    sourceP25: [0.13, 0.18, 0.24, 0.30],
    primaryP10: [0.09, 0.13, 0.18, 0.24],
    legacyP10: [0.08, 0.12, 0.17, 0.23],
    fullStyleP10: [0.035, 0.055, 0.075, 0.10],
    filteredP10: [0.034, 0.054, 0.074, 0.099],
    shadowAbsoluteChroma: [0.10, 0.11, 0.09, 0.08],
    shadowRelativeChroma: [0.92, 0.88, 0.84, 0.80],
    selectedRelativeChroma: [0.96, 0.91, 0.89, 0.86]
  });
  assert.equal(intentionalChromaticShadows.toeLift, 0);

  const syntheticStyleDensityFixtures = [
    { name: "neutral", full: [0.07, 0.13, 0.205, 0.285] },
    { name: "warmAmber", full: [0.072, 0.134, 0.210, 0.291] },
    { name: "coolChrome", full: [0.066, 0.124, 0.196, 0.276] },
    { name: "mutedPastel", full: [0.080, 0.141, 0.216, 0.296] },
    { name: "deepBrown", full: [0.054, 0.114, 0.189, 0.269] },
    { name: "chromeSlide", full: [0.058, 0.118, 0.193, 0.273] }
  ];
  for (const style of syntheticStyleDensityFixtures) {
    const declaredStyle = mirroredAdaptiveToneDecision({
      sourceP10: [0.08, 0.15, 0.23, 0.31],
      sourceP25: [0.13, 0.21, 0.30, 0.38],
      primaryP10: [0.08, 0.15, 0.23, 0.31],
      legacyP10: [0.07, 0.13, 0.205, 0.285],
      fullStyleP10: style.full,
      filteredP10: style.full.map((value) => value - 0.002),
      shadowAbsoluteChroma: [0.03, 0.04, 0.05, 0.06],
      shadowRelativeChroma: [0.16, 0.18, 0.20, 0.22],
      selectedRelativeChroma: [0.18, 0.20, 0.22, 0.24]
    });
    assert.equal(declaredStyle.toeLift, 0, style.name);
  }

  const liftedBlack = mirroredAdaptiveShadowLuminance(0, 0.045);
  const liftedHighShadow = mirroredAdaptiveShadowLuminance(0.24, 0.045);
  assert.equal(liftedBlack, 0);
  assert.equal(liftedHighShadow, 0.24);
  let maximumLift = 0;
  for (let index = 0; index <= 1_000; index += 1) {
    const luminance = index / 1_000;
    maximumLift = Math.max(
      maximumLift,
      mirroredAdaptiveShadowLuminance(luminance, 0.045) - luminance
    );
  }
  assert.equal(maximumLift <= 0.0250001, true);
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

function mirroredAdaptiveToneDecision({
  sourceP10,
  sourceP25,
  primaryP10,
  legacyP10 = primaryP10,
  fullStyleP10 = legacyP10,
  filteredP10,
  shadowAbsoluteChroma = sourceP10.map(() => 0),
  shadowRelativeChroma = sourceP10.map(() => 0),
  selectedRelativeChroma = sourceP10.map(() => 0),
  temperature = 0,
  tint = 0
}) {
  const activationFloor = 0.006;
  const colorAllowance = 0.006
    + Math.abs(temperature) * 0.006
    + Math.abs(tint) * 0.004;
  const tileDamage = Array(sourceP10.length).fill(0);
  const eligibleDamage = [];
  for (let index = 0; index < sourceP10.length; index += 1) {
    const detailSpan = sourceP25[index] - sourceP10[index];
    if (
      sourceP10[index] <= 0.004
      || sourceP10[index] > 0.38
      || detailSpan < 0.018
      || shadowAbsoluteChroma[index] > 0.12
      || shadowRelativeChroma[index] > 0.45
      || selectedRelativeChroma[index] > 0.55
    ) continue;
    const legacyDensityAllowance = Math.min(
      Math.max(primaryP10[index] - legacyP10[index], 0),
      0.016
    );
    const colorStyleDensityAllowance = Math.min(
      Math.max(legacyP10[index] - fullStyleP10[index], 0),
      0.020
    );
    const declaredStyleDensityAllowance = Math.min(
      legacyDensityAllowance + colorStyleDensityAllowance,
      0.034
    );
    const rawDamage = Math.max(
      0,
      primaryP10[index]
        - declaredStyleDensityAllowance
        - colorAllowance
        - filteredP10[index]
    );
    tileDamage[index] = rawDamage;
    eligibleDamage.push(tileDamage[index]);
  }
  if (eligibleDamage.length < 3 || eligibleDamage.filter((value) => value > activationFloor).length < 2) {
    return { toeLift: 0, tileWeights: tileDamage.map(() => 0) };
  }
  eligibleDamage.sort((left, right) => left - right);
  const robustIndex = Math.min(
    eligibleDamage.length - 1,
    Math.floor((eligibleDamage.length - 1) * 0.75)
  );
  const robustDamage = eligibleDamage[robustIndex];
  if (robustDamage <= activationFloor) {
    return { toeLift: 0, tileWeights: tileDamage.map(() => 0) };
  }
  const effectiveDamage = robustDamage - activationFloor;
  const toeLift = Math.min(Math.max(effectiveDamage * 0.90, 0), 0.045);
  if (toeLift <= 0.004) return { toeLift: 0, tileWeights: tileDamage.map(() => 0) };
  const weightScale = Math.max(effectiveDamage, 0.001);
  return {
    toeLift,
    tileWeights: tileDamage.map((damage) => mirroredSmoothstep(
      0,
      1,
      Math.max(0, damage - activationFloor) / weightScale
    ))
  };
}

function mirroredAdaptiveShadowLuminance(luminance, toeLift) {
  const maximumLuminanceLift = Math.min(Math.max(toeLift * 0.72, 0), 0.025);
  const rampIn = mirroredSmoothstep(0.005, 0.055, luminance);
  const rampOut = 1 - mirroredSmoothstep(0.10, 0.24, luminance);
  return luminance + maximumLuminanceLift * rampIn * rampOut;
}

function mirroredSmoothstep(lower, upper, value) {
  if (upper <= lower) return value >= upper ? 1 : 0;
  const t = Math.min(Math.max((value - lower) / (upper - lower), 0), 1);
  return t * t * (3 - 2 * t);
}
