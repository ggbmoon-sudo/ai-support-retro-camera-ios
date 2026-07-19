import Foundation

nonisolated enum FilterRecipeValidator {
    private static let exposureRange = -0.35...0.35
    private static let contrastRange = -0.35...0.35
    private static let saturationRange = -0.35...0.45
    private static let temperatureRange = -0.45...0.45
    private static let tintRange = -0.25...0.25
    private static let fadeRange = 0.0...0.5
    private static let shadowLiftRange = 0.0...0.4
    private static let highlightRollOffRange = 0.0...0.4
    private static let bloomRange = 0.0...0.3
    private static let grainRange = 0.0...0.35
    private static let dustRange = 0.0...0.35
    private static let vignetteRange = 0.0...0.35

    static func validated(_ recipe: GeneratedFilterRecipe) -> GeneratedFilterRecipe {
        let fallback = GeneratedFilterRecipe.mockFallback
        let clampedParameters = validated(recipe.parameters, fallback: fallback.parameters)
        let safeConfidence = recipe.confidence.isFinite ? min(max(recipe.confidence, 0), 1) : fallback.confidence
        let safeVersion = recipe.recipeVersion.isEmpty ? fallback.recipeVersion : recipe.recipeVersion

        return GeneratedFilterRecipe(
            id: recipe.id.isEmpty ? fallback.id : recipe.id,
            nameKey: recipe.nameKey.isEmpty ? fallback.nameKey : recipe.nameKey,
            descriptionKey: recipe.descriptionKey.isEmpty ? fallback.descriptionKey : recipe.descriptionKey,
            source: recipe.source,
            confidence: safeConfidence,
            recommendedUseKeys: recipe.recommendedUseKeys.isEmpty ? fallback.recommendedUseKeys : recipe.recommendedUseKeys,
            parameters: clampedParameters,
            warningsKeys: recipe.warningsKeys,
            recipeVersion: safeVersion
        )
    }

    static func validated(
        _ parameters: GeneratedFilterParameterSet,
        fallback: GeneratedFilterParameterSet = GeneratedFilterRecipe.mockFallback.parameters
    ) -> GeneratedFilterParameterSet {
        GeneratedFilterParameterSet(
            exposure: clamp(parameters.exposure, to: exposureRange, fallback: fallback.exposure),
            contrast: clamp(parameters.contrast, to: contrastRange, fallback: fallback.contrast),
            saturation: clamp(parameters.saturation, to: saturationRange, fallback: fallback.saturation),
            temperature: clamp(parameters.temperature, to: temperatureRange, fallback: fallback.temperature),
            tint: clamp(parameters.tint, to: tintRange, fallback: fallback.tint),
            fade: clamp(parameters.fade, to: fadeRange, fallback: fallback.fade),
            shadowLift: clamp(parameters.shadowLift, to: shadowLiftRange, fallback: fallback.shadowLift),
            highlightRollOff: clamp(parameters.highlightRollOff, to: highlightRollOffRange, fallback: fallback.highlightRollOff),
            bloom: clamp(parameters.bloom, to: bloomRange, fallback: fallback.bloom),
            grain: clamp(parameters.grain, to: grainRange, fallback: fallback.grain),
            dust: clamp(parameters.dust, to: dustRange, fallback: fallback.dust),
            vignette: clamp(parameters.vignette, to: vignetteRange, fallback: fallback.vignette)
        )
    }

    private static func clamp(_ value: Double, to range: ClosedRange<Double>, fallback: Double) -> Double {
        guard value.isFinite else { return fallback }
        return min(max(value, range.lowerBound), range.upperBound)
    }
}
