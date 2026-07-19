import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  buildGeneratedFilterRecipeRendererCalibrationPrompt,
  buildGeneratedFilterRecipeSchemaPrompt,
  buildGeneratedFilterRecipeStyleGuidancePrompt,
  buildGeneratedFilterRecipeSystemPrompt,
  generatedFilterRecipeExampleCandidate,
  generatedFilterRecipeJSONSchema
} from "../src/providers/generatedFilterRecipeContract.mjs";
import { evaluateFilterLabRecipeFidelity } from "../src/qa/filterLabRecipeFidelityEvaluator.mjs";

test("Filter Lab structured output schema describes every bounded renderer control", () => {
  const schema = generatedFilterRecipeJSONSchema();
  const parameters = schema.properties.parameters;

  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);
  assert.equal(parameters.additionalProperties, false);
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
  assert.match(prompt, /faded direct-flash or warm instant-film look/i);
  assert.match(prompt, /Do not crush blacks/i);
  assert.match(prompt, /scene lighting and filter evidence conflict/i);
  assert.match(prompt, /Do not choose a preset family first/i);
  assert.match(prompt, /Renderer calibration anchors/i);
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

test("Filter Lab local renderer consumes every recipe control with one exposure path and full default intensity", async () => {
  const renderer = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterPreviewRenderer.swift",
    import.meta.url
  ), "utf8");
  const viewModel = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift",
    import.meta.url
  ), "utf8");

  assert.match(renderer, /applyExposure\(parameters\.exposure \* intensity/);
  assert.match(renderer, /applyTone\(parameters, intensity: intensity/);
  assert.match(renderer, /parameters\.shadowLift \* intensity/);
  assert.match(renderer, /parameters\.highlightRollOff \* intensity/);
  assert.match(renderer, /applyBloom\(parameters\.bloom \* intensity/);
  assert.match(renderer, /applyGrain\(parameters\.grain \* intensity/);
  assert.match(renderer, /applyDust\(parameters\.dust \* intensity/);
  assert.match(renderer, /CISoftLightBlendMode/);
  assert.match(renderer, /CIScreenBlendMode/);
  assert.match(renderer, /blackLift = min\(fade \* 0\.15, 0\.075\)/);
  assert.match(renderer, /vignette \* 1\.35/);
  assert.doesNotMatch(renderer, /kCIInputBrightnessKey/);
  assert.match(viewModel, /intensity: Double = 1\.0/);
  assert.doesNotMatch(renderer, /api\.siliconflow|Authorization|Bearer /i);
});

test("Filter Lab recipe 1.1 remains aligned across backend, iOS decoding, validation, and diagnostics", async () => {
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
  const englishLocalization = await readFile(new URL(
    "../../ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings",
    import.meta.url
  ), "utf8");
  const parameterKeys = generatedFilterRecipeJSONSchema().properties.parameters.required;

  assert.match(cloudValidator, /recipeVersion == "1\.1"/);
  for (const key of parameterKeys) {
    assert.match(parameterSet, new RegExp(`var ${key}: Double`));
    assert.match(cloudModels, new RegExp(`let ${key}: Double`));
    assert.match(cloudMapper, new RegExp(`${key}: generatedFilter\\.parameters\\.${key}`));
    assert.match(resultView, new RegExp(`params\\.${key}`));
  }

  const summaryLine = englishLocalization
    .split("\n")
    .find((line) => line.includes('"filter_lab.parameters.summary"'));
  assert.equal(summaryLine?.match(/%\.2f/g)?.length, parameterKeys.length);
  assert.match(englishLocalization, /"filter_lab\.parameters" = "Filter parameters"/);
});
