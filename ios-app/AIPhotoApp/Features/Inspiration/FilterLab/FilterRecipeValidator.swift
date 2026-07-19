import Foundation

nonisolated enum FilterRecipeValidator {
    private static let identityCurve = [0.0, 0.25, 0.5, 0.75, 1.0]
    private static let supportedVersions: Set<String> = ["1.1", "2.0"]
    private static let minimumBlackFloorBudget = 0.035
    private static let maximumLumaBlackPoint = 0.08
    private static let fadeBlackLiftContribution = 0.15
    private static let shadowBlackLiftContribution = 0.22
    private static let negativeContrastBlackLiftContribution = 0.35

    static func validated(_ recipe: GeneratedFilterRecipe) -> GeneratedFilterRecipe {
        let fallback = GeneratedFilterRecipe.mockFallback
        let safeVersion = supportedVersions.contains(recipe.recipeVersion) ? recipe.recipeVersion : fallback.recipeVersion
        let isLegacy = safeVersion == "1.1"
        let safeColorTransform = isLegacy ? GeneratedFilterColorTransform.identity : validated(recipe.colorTransform)
        var safeParameters = validated(recipe.parameters, fallback: fallback.parameters)
        if !isLegacy {
            safeParameters = normalizedBlackFloor(
                safeParameters,
                lumaBlackPoint: safeColorTransform.lumaCurve[0]
            )
        }

        return GeneratedFilterRecipe(
            id: recipe.id.isEmpty ? fallback.id : recipe.id,
            nameKey: recipe.nameKey.isEmpty ? fallback.nameKey : recipe.nameKey,
            descriptionKey: recipe.descriptionKey.isEmpty ? fallback.descriptionKey : recipe.descriptionKey,
            source: recipe.source,
            confidence: clamp(recipe.confidence, to: 0...1, fallback: fallback.confidence),
            recommendedUseKeys: recipe.recommendedUseKeys.isEmpty ? fallback.recommendedUseKeys : recipe.recommendedUseKeys,
            parameters: safeParameters,
            colorTransform: safeColorTransform,
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
            lumaCurve: validatedLumaCurve(transform.lumaCurve),
            redCurve: validatedChannelCurve(transform.redCurve),
            greenCurve: validatedChannelCurve(transform.greenCurve),
            blueCurve: validatedChannelCurve(transform.blueCurve),
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

    private static func validatedLumaCurve(_ values: [Double]) -> [Double] {
        validatedCurve(values, preservesEndpoints: false)
    }

    private static func validatedChannelCurve(_ values: [Double]) -> [Double] {
        validatedCurve(values, preservesEndpoints: true)
    }

    private static func validatedCurve(_ values: [Double], preservesEndpoints: Bool) -> [Double] {
        guard values.count == identityCurve.count else { return identityCurve }
        var result: [Double] = []
        for (index, value) in values.enumerated() {
            let identity = identityCurve[index]
            let localRange = max(0, identity - 0.18)...min(1, identity + 0.18)
            var next = clamp(value, to: localRange, fallback: identity)
            if preservesEndpoints {
                if index == 0 { next = 0 }
                if index == identityCurve.count - 1 { next = 1 }
            } else {
                if index == 0 { next = min(next, maximumLumaBlackPoint) }
                if index == identityCurve.count - 1 { next = max(next, 0.92) }
            }
            if let previous = result.last { next = max(previous, next) }
            result.append(next)
        }
        return result
    }

    private static func normalizedBlackFloor(
        _ parameters: GeneratedFilterParameterSet,
        lumaBlackPoint: Double
    ) -> GeneratedFilterParameterSet {
        var safe = parameters
        let totalBudget = max(minimumBlackFloorBudget, lumaBlackPoint)
        var remainingBudget = max(0, totalBudget - lumaBlackPoint)
        let fadeLift = safe.fade * fadeBlackLiftContribution
        let shadowLift = safe.shadowLift * shadowBlackLiftContribution
        let negativeContrastLift = max(-safe.contrast, 0) * negativeContrastBlackLiftContribution
        let hasSeparateLift = fadeLift + shadowLift > 0.000001

        guard fadeLift + shadowLift + negativeContrastLift > remainingBudget + 0.000001 else {
            return safe
        }

        if safe.contrast < 0, hasSeparateLift {
            safe.contrast = 0
        } else if negativeContrastLift > remainingBudget {
            safe.contrast = -remainingBudget / negativeContrastBlackLiftContribution
            remainingBudget = 0
        } else {
            remainingBudget -= negativeContrastLift
        }

        let separateLift = fadeLift + shadowLift
        if separateLift > remainingBudget + 0.000001 {
            let scale = separateLift > 0 ? remainingBudget / separateLift : 0
            safe.fade *= scale
            safe.shadowLift *= scale
        }

        return safe
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
