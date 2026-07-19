import Foundation

nonisolated enum FilterRecipeValidator {
    private static let identityCurve = [0.0, 0.25, 0.5, 0.75, 1.0]
    private static let supportedVersions: Set<String> = ["1.1", "2.0"]

    static func validated(_ recipe: GeneratedFilterRecipe) -> GeneratedFilterRecipe {
        let fallback = GeneratedFilterRecipe.mockFallback
        let safeVersion = supportedVersions.contains(recipe.recipeVersion) ? recipe.recipeVersion : fallback.recipeVersion
        let isLegacy = safeVersion == "1.1"

        return GeneratedFilterRecipe(
            id: recipe.id.isEmpty ? fallback.id : recipe.id,
            nameKey: recipe.nameKey.isEmpty ? fallback.nameKey : recipe.nameKey,
            descriptionKey: recipe.descriptionKey.isEmpty ? fallback.descriptionKey : recipe.descriptionKey,
            source: recipe.source,
            confidence: clamp(recipe.confidence, to: 0...1, fallback: fallback.confidence),
            recommendedUseKeys: recipe.recommendedUseKeys.isEmpty ? fallback.recommendedUseKeys : recipe.recommendedUseKeys,
            parameters: validated(recipe.parameters, fallback: fallback.parameters),
            colorTransform: isLegacy ? .identity : validated(recipe.colorTransform),
            film: isLegacy ? .identity : validated(recipe.film),
            warningsKeys: recipe.warningsKeys,
            recipeVersion: safeVersion
        )
    }

    static func validated(
        _ parameters: GeneratedFilterParameterSet,
        fallback: GeneratedFilterParameterSet = GeneratedFilterRecipe.mockFallback.parameters
    ) -> GeneratedFilterParameterSet {
        GeneratedFilterParameterSet(
            exposure: clamp(parameters.exposure, to: -0.35...0.35, fallback: fallback.exposure),
            contrast: clamp(parameters.contrast, to: -0.35...0.35, fallback: fallback.contrast),
            saturation: clamp(parameters.saturation, to: -0.35...0.45, fallback: fallback.saturation),
            temperature: clamp(parameters.temperature, to: -0.45...0.45, fallback: fallback.temperature),
            tint: clamp(parameters.tint, to: -0.25...0.25, fallback: fallback.tint),
            fade: clamp(parameters.fade, to: 0...0.5, fallback: fallback.fade),
            shadowLift: clamp(parameters.shadowLift, to: 0...0.4, fallback: fallback.shadowLift),
            highlightRollOff: clamp(parameters.highlightRollOff, to: 0...0.4, fallback: fallback.highlightRollOff),
            bloom: clamp(parameters.bloom, to: 0...0.3, fallback: fallback.bloom),
            grain: clamp(parameters.grain, to: 0...0.35, fallback: fallback.grain),
            dust: clamp(parameters.dust, to: 0...0.35, fallback: fallback.dust),
            vignette: clamp(parameters.vignette, to: 0...0.35, fallback: fallback.vignette)
        )
    }

    static func validated(_ transform: GeneratedFilterColorTransform) -> GeneratedFilterColorTransform {
        GeneratedFilterColorTransform(
            inputNormalizationStrength: clamp(transform.inputNormalizationStrength, to: 0...0.35, fallback: 0),
            styleIntensity: clamp(transform.styleIntensity, to: 0...1, fallback: 0),
            lumaCurve: validatedCurve(transform.lumaCurve),
            redCurve: validatedCurve(transform.redCurve),
            greenCurve: validatedCurve(transform.greenCurve),
            blueCurve: validatedCurve(transform.blueCurve),
            basisLUTWeights: validated(transform.basisLUTWeights)
        )
    }

    static func validated(_ film: GeneratedFilmParameterSet) -> GeneratedFilmParameterSet {
        GeneratedFilmParameterSet(
            grainSize: clamp(film.grainSize, to: 0.6...2.2, fallback: 1),
            grainRoughness: clamp(film.grainRoughness, to: 0...1, fallback: 0.4),
            grainLumaResponse: clamp(film.grainLumaResponse, to: -1...1, fallback: 0),
            halationStrength: clamp(film.halationStrength, to: 0...0.25, fallback: 0),
            halationRadius: clamp(film.halationRadius, to: 2...24, fallback: 8),
            halationWarmth: clamp(film.halationWarmth, to: 0...1, fallback: 0.65),
            diffusion: clamp(film.diffusion, to: 0...0.25, fallback: 0)
        )
    }

    private static func validatedCurve(_ values: [Double]) -> [Double] {
        guard values.count == identityCurve.count else { return identityCurve }
        var result: [Double] = []
        for (index, value) in values.enumerated() {
            let identity = identityCurve[index]
            let localRange = max(0, identity - 0.18)...min(1, identity + 0.18)
            var next = clamp(value, to: localRange, fallback: identity)
            if index == 0 { next = min(next, 0.12) }
            if index == identityCurve.count - 1 { next = max(next, 0.88) }
            if let previous = result.last { next = max(previous, next) }
            result.append(next)
        }
        return result
    }

    private static func validated(_ weights: GeneratedFilterBasisLUTWeights) -> GeneratedFilterBasisLUTWeights {
        var values = [
            clamp(weights.neutral, to: 0...1, fallback: 1),
            clamp(weights.warmAmber, to: 0...1, fallback: 0),
            clamp(weights.roseFlash, to: 0...1, fallback: 0),
            clamp(weights.coolChrome, to: 0...1, fallback: 0),
            clamp(weights.tealOrange, to: 0...1, fallback: 0),
            clamp(weights.mutedPastel, to: 0...1, fallback: 0),
            clamp(weights.deepBrown, to: 0...1, fallback: 0),
            clamp(weights.chromeSlide, to: 0...1, fallback: 0)
        ]
        let sum = values.reduce(0, +)
        if sum <= 0.000001 {
            values = [1, 0, 0, 0, 0, 0, 0, 0]
        } else {
            values = values.map { $0 / sum }
        }
        return GeneratedFilterBasisLUTWeights(
            neutral: values[0],
            warmAmber: values[1],
            roseFlash: values[2],
            coolChrome: values[3],
            tealOrange: values[4],
            mutedPastel: values[5],
            deepBrown: values[6],
            chromeSlide: values[7]
        )
    }

    private static func clamp(_ value: Double, to range: ClosedRange<Double>, fallback: Double) -> Double {
        guard value.isFinite else { return fallback }
        return min(max(value, range.lowerBound), range.upperBound)
    }
}
