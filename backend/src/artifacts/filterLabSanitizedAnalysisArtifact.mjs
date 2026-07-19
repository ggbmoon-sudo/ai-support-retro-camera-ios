import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

export const FILTER_LAB_ANALYSIS_ARTIFACT_SCHEMA_VERSION = "filter_lab_sanitized_analysis.v1";
export const DEFAULT_FILTER_LAB_ANALYSIS_ARTIFACT_DIR = new URL(
  "../../reports/filter-lab-sanitized-analysis/",
  import.meta.url
);

export function buildSanitizedFilterLabAnalysisArtifact({
  providerKind,
  recipe,
  attempts,
  latencyMs,
  createdAt = new Date()
}) {
  return {
    schemaVersion: FILTER_LAB_ANALYSIS_ARTIFACT_SCHEMA_VERSION,
    createdAt: createdAt.toISOString(),
    surface: "filter_lab",
    providerModeBucket: normalizeProviderKind(providerKind),
    attemptsBucket: attempts > 1 ? "retry" : "single_attempt",
    latencyBucket: bucketLatency(latencyMs),
    normalizedRecipe: normalizedRecipeArtifact(recipe),
    privacy: {
      imageIncluded: false,
      imageBase64Included: false,
      rawPromptIncluded: false,
      rawRequestIncluded: false,
      rawProviderResponseIncluded: false,
      authorizationHeaderIncluded: false,
      apiKeyIncluded: false
    },
    productionReady: false
  };
}

function normalizedRecipeArtifact(recipe) {
  return {
    recipeVersion: recipe.recipeVersion,
    source: recipe.source,
    nameKey: recipe.nameKey,
    descriptionKey: recipe.descriptionKey,
    confidenceBucket: confidenceBucket(recipe.confidence),
    recommendedUseKeys: [...recipe.recommendedUseKeys],
    parameters: {
      exposure: recipe.parameters.exposure,
      contrast: recipe.parameters.contrast,
      saturation: recipe.parameters.saturation,
      temperature: recipe.parameters.temperature,
      tint: recipe.parameters.tint,
      fade: recipe.parameters.fade,
      shadowLift: recipe.parameters.shadowLift,
      highlightRollOff: recipe.parameters.highlightRollOff,
      bloom: recipe.parameters.bloom,
      grain: recipe.parameters.grain,
      dust: recipe.parameters.dust,
      vignette: recipe.parameters.vignette
    },
    warningsKeys: [...recipe.warningsKeys]
  };
}

export async function persistSanitizedFilterLabAnalysisArtifact({
  providerKind,
  recipe,
  attempts,
  latencyMs,
  directoryURL = DEFAULT_FILTER_LAB_ANALYSIS_ARTIFACT_DIR,
  now = () => new Date(),
  createID = randomUUID
}) {
  const createdAt = now();
  const artifact = buildSanitizedFilterLabAnalysisArtifact({
    providerKind,
    recipe,
    attempts,
    latencyMs,
    createdAt
  });
  const fileName = [
    createdAt.toISOString().replace(/[:.]/g, "-"),
    createID(),
    "filter-lab-analysis.json"
  ].join("_");

  await mkdir(directoryURL, { recursive: true });
  await writeFile(
    new URL(fileName, directoryURL),
    `${JSON.stringify(artifact, null, 2)}\n`,
    { encoding: "utf8", flag: "wx" }
  );

  return {
    saved: true,
    schemaVersion: FILTER_LAB_ANALYSIS_ARTIFACT_SCHEMA_VERSION,
    fileName
  };
}

function normalizeProviderKind(value) {
  switch (value) {
  case "siliconflowInternal":
    return "siliconflow_internal";
  case "xiaoyiRelayInternal":
    return "xiaoyi_relay_internal";
  case "xiaoyiLunaInternal":
    return "xiaoyi_luna_internal";
  default:
    return "internal_unknown";
  }
}

function bucketLatency(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "unknown";
  }
  if (value <= 5000) {
    return "lte_5s";
  }
  if (value <= 15000) {
    return "5s_to_15s";
  }
  return "gt_15s";
}

function confidenceBucket(value) {
  if (value >= 0.75) {
    return "high";
  }
  if (value >= 0.45) {
    return "medium";
  }
  return "low";
}
