import UIKit

struct MockFilterGenerationService: FilterGenerationService {
    private static let recipes: [GeneratedFilterRecipe] = [
        .mockFallback,
        GeneratedFilterRecipe(
            id: "mock_soft_film_memory",
            nameKey: "filter_lab.recipe.soft_film_memory.name",
            descriptionKey: "filter_lab.recipe.soft_film_memory.description",
            source: .mock,
            confidence: 0.74,
            recommendedUseKeys: [
                "filter_lab.use.daily",
                "filter_lab.use.soft_portrait"
            ],
            parameters: GeneratedFilterParameterSet(
                exposure: 0.04,
                contrast: -0.18,
                saturation: 0.08,
                temperature: 0.12,
                tint: 0.02,
                fade: 0.24,
                shadowLift: 0.2,
                highlightRollOff: 0.14,
                bloom: 0.05,
                grain: 0.1,
                dust: 0.06,
                vignette: 0.06
            ),
            warningsKeys: ["filter_lab.warning.mock_only"],
            recipeVersion: "2.0"
        ),
        GeneratedFilterRecipe(
            id: "mock_neon_street_fade",
            nameKey: "filter_lab.recipe.neon_street_fade.name",
            descriptionKey: "filter_lab.recipe.neon_street_fade.description",
            source: .mock,
            confidence: 0.72,
            recommendedUseKeys: [
                "filter_lab.use.street",
                "filter_lab.use.night"
            ],
            parameters: GeneratedFilterParameterSet(
                exposure: -0.04,
                contrast: 0.18,
                saturation: 0.2,
                temperature: -0.18,
                tint: 0.12,
                fade: 0.08,
                shadowLift: 0.05,
                highlightRollOff: 0.12,
                bloom: 0.08,
                grain: 0.16,
                dust: 0.1,
                vignette: 0.18
            ),
            warningsKeys: ["filter_lab.warning.mock_only"],
            recipeVersion: "2.0"
        ),
        GeneratedFilterRecipe(
            id: "mock_ccd_party_warm",
            nameKey: "filter_lab.recipe.ccd_party_warm.name",
            descriptionKey: "filter_lab.recipe.ccd_party_warm.description",
            source: .mock,
            confidence: 0.7,
            recommendedUseKeys: [
                "filter_lab.use.party",
                "filter_lab.use.flash"
            ],
            parameters: GeneratedFilterParameterSet(
                exposure: 0.02,
                contrast: 0.12,
                saturation: 0.28,
                temperature: 0.16,
                tint: -0.04,
                fade: 0.04,
                shadowLift: 0.08,
                highlightRollOff: 0.18,
                bloom: 0.12,
                grain: 0.22,
                dust: 0.08,
                vignette: 0.12
            ),
            warningsKeys: ["filter_lab.warning.mock_only"],
            recipeVersion: "2.0"
        ),
        GeneratedFilterRecipe(
            id: "mock_cool_chrome_portrait",
            nameKey: "filter_lab.recipe.cool_chrome_portrait.name",
            descriptionKey: "filter_lab.recipe.cool_chrome_portrait.description",
            source: .mock,
            confidence: 0.76,
            recommendedUseKeys: [
                "filter_lab.use.portrait",
                "filter_lab.use.street"
            ],
            parameters: GeneratedFilterParameterSet(
                exposure: 0.0,
                contrast: 0.16,
                saturation: 0.02,
                temperature: -0.22,
                tint: -0.02,
                fade: 0.1,
                shadowLift: 0.08,
                highlightRollOff: 0.1,
                bloom: 0.03,
                grain: 0.08,
                dust: 0.04,
                vignette: 0.1
            ),
            warningsKeys: ["filter_lab.warning.mock_only"],
            recipeVersion: "2.0"
        ),
        GeneratedFilterRecipe(
            id: "mock_amber_travel_glow",
            nameKey: "filter_lab.recipe.amber_travel_glow.name",
            descriptionKey: "filter_lab.recipe.amber_travel_glow.description",
            source: .mock,
            confidence: 0.8,
            recommendedUseKeys: [
                "filter_lab.use.travel",
                "filter_lab.use.golden_hour"
            ],
            parameters: GeneratedFilterParameterSet(
                exposure: 0.06,
                contrast: -0.08,
                saturation: 0.16,
                temperature: 0.28,
                tint: 0.06,
                fade: 0.12,
                shadowLift: 0.12,
                highlightRollOff: 0.14,
                bloom: 0.09,
                grain: 0.1,
                dust: 0.06,
                vignette: 0.14
            ),
            warningsKeys: ["filter_lab.warning.mock_only"],
            recipeVersion: "2.0"
        )
    ]

    func generateFilter(from referenceImage: UIImage) async throws -> GeneratedFilterRecipe {
        try await Task.sleep(nanoseconds: 900_000_000)

        let dimensionsSeed = Int(referenceImage.size.width + referenceImage.size.height)
        let recipe = Self.recipes[abs(dimensionsSeed) % Self.recipes.count]
        return FilterRecipeValidator.validated(recipe)
    }
}
