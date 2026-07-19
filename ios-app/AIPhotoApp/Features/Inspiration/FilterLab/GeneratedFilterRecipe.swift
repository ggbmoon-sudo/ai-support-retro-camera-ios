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
    let warningsKeys: [String]
    let recipeVersion: String
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
        warningsKeys: [
            "filter_lab.warning.mock_only",
            "filter_lab.warning.session_only"
        ],
        recipeVersion: "1.1"
    )
}
