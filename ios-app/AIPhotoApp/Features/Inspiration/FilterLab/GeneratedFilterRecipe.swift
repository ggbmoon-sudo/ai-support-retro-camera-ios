import Foundation

nonisolated enum GeneratedFilterSource: String, Codable, Hashable, Sendable {
    case mock
    case local
    case cloud

    var labelKey: String {
        switch self {
        case .mock:
            return "filter_lab.source.mock"
        case .local:
            return "filter_lab.source.local"
        case .cloud:
            return "filter_lab.source.cloud"
        }
    }
}

nonisolated struct GeneratedFilterRecipe: Identifiable, Codable, Hashable, Sendable {
    let id: String
    let nameKey: String
    let descriptionKey: String
    let source: GeneratedFilterSource
    let confidence: Double
    let recommendedUseKeys: [String]
    let parameters: GeneratedFilterParameterSet
    let colorTransform: GeneratedFilterColorTransform
    let film: GeneratedFilmParameterSet
    let warningsKeys: [String]
    let recipeVersion: String

    init(
        id: String,
        nameKey: String,
        descriptionKey: String,
        source: GeneratedFilterSource,
        confidence: Double,
        recommendedUseKeys: [String],
        parameters: GeneratedFilterParameterSet,
        colorTransform: GeneratedFilterColorTransform = .identity,
        film: GeneratedFilmParameterSet = .identity,
        warningsKeys: [String],
        recipeVersion: String
    ) {
        self.id = id
        self.nameKey = nameKey
        self.descriptionKey = descriptionKey
        self.source = source
        self.confidence = confidence
        self.recommendedUseKeys = recommendedUseKeys
        self.parameters = parameters
        self.colorTransform = colorTransform
        self.film = film
        self.warningsKeys = warningsKeys
        self.recipeVersion = recipeVersion
    }
}

extension GeneratedFilterRecipe {
    nonisolated static let mockFallback = GeneratedFilterRecipe(
        id: "mock_golden_rooftop_dream",
        nameKey: "filter_lab.recipe.golden_rooftop_dream.name",
        descriptionKey: "filter_lab.recipe.golden_rooftop_dream.description",
        source: .mock,
        confidence: 0.78,
        recommendedUseKeys: [
            "filter_lab.use.golden_hour",
            "filter_lab.use.travel",
            "filter_lab.use.portrait"
        ],
        parameters: GeneratedFilterParameterSet(
            exposure: 0.08,
            contrast: -0.12,
            saturation: 0.18,
            temperature: 0.22,
            tint: 0.04,
            fade: 0.18,
            shadowLift: 0.16,
            highlightRollOff: 0.12,
            bloom: 0.06,
            grain: 0.12,
            dust: 0.08,
            vignette: 0.08
        ),
        colorTransform: GeneratedFilterColorTransform(
            inputNormalizationStrength: 0.16,
            styleIntensity: 0.72,
            lumaCurve: [0.03, 0.24, 0.5, 0.76, 0.96],
            redCurve: [0.02, 0.27, 0.52, 0.78, 0.98],
            greenCurve: [0.01, 0.25, 0.5, 0.75, 0.97],
            blueCurve: [0.01, 0.23, 0.47, 0.72, 0.95],
            basisLUTWeights: GeneratedFilterBasisLUTWeights(
                neutral: 0.25,
                warmAmber: 0.35,
                roseFlash: 0.12,
                coolChrome: 0.03,
                tealOrange: 0.05,
                mutedPastel: 0.08,
                deepBrown: 0.1,
                chromeSlide: 0.02
            )
        ),
        film: GeneratedFilmParameterSet(
            grainSize: 1.15,
            grainRoughness: 0.55,
            grainLumaResponse: 0.35,
            halationStrength: 0.06,
            halationRadius: 9,
            halationWarmth: 0.72,
            diffusion: 0.05
        ),
        warningsKeys: [
            "filter_lab.warning.mock_only",
            "filter_lab.warning.session_only"
        ],
        recipeVersion: "2.0"
    )
}
