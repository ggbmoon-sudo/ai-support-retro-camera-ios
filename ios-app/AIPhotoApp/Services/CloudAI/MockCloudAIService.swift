import Foundation

struct MockCloudAIService: CloudAIService {
    private let validator: CloudAIResponseValidator

    init(validator: CloudAIResponseValidator = CloudAIResponseValidator()) {
        self.validator = validator
    }

    func analyzePhotoAdvisor(_ input: CloudAIPhotoAdvisorInput) async throws -> CloudAIResponse {
        guard input.consent.imageUploadAccepted else {
            throw CloudAIServiceError.consentRequired
        }

        try? await Task.sleep(nanoseconds: 250_000_000)

        let response = CloudAIResponse(
            schemaVersion: "1.0",
            mode: .postCapture,
            summary: "這張相有暖光感，可以試柔和復古濾鏡。",
            suggestions: [
                CloudAISuggestion(
                    type: .filter,
                    text: "可以試柔和暖色復古濾鏡，保留舒服的氛圍。",
                    priority: .high,
                    action: .applyFilter
                )
            ],
            recommendedFilters: [
                CloudAIRecommendedFilter(
                    filterId: "instant_dream",
                    reason: "適合暖光人像。",
                    confidence: .high
                )
            ],
            generatedFilter: nil,
            poseGuide: nil,
            retakeAdvice: CloudAIRetakeAdvice(
                shouldRetake: false,
                reason: "可以保留這張，先試濾鏡和裁切。"
            ),
            cropAdvice: CloudAICropAdvice(
                recommended: true,
                text: "可以裁走邊緣少少空白，主體會更集中。"
            ),
            confidence: .medium,
            source: .mock,
            locale: input.locale,
            safety: CloudAISafety(
                containsSensitiveInference: false,
                requiresUserConsent: true,
                blockedReason: nil
            ),
            error: nil
        )

        switch validator.validate(response) {
        case .valid(let validResponse):
            return validResponse
        case .invalid(let issues, _):
            throw CloudAIServiceError.invalidResponse(issues.map(\.description))
        }
    }

    func generateFilterLab(_ input: CloudAIFilterLabInput) async throws -> CloudAIResponse {
        guard input.consent.imageUploadAccepted else {
            throw CloudAIServiceError.consentRequired
        }

        try? await Task.sleep(nanoseconds: 250_000_000)

        let response = CloudAIResponse(
            schemaVersion: "1.0",
            mode: .filterGeneration,
            summary: "",
            suggestions: [],
            recommendedFilters: [],
            generatedFilter: CloudAIGeneratedFilter(recipe: .mockFallback, source: .mock),
            poseGuide: nil,
            retakeAdvice: nil,
            cropAdvice: nil,
            confidence: .medium,
            source: .mock,
            locale: input.locale,
            safety: CloudAISafety(
                containsSensitiveInference: false,
                requiresUserConsent: true,
                blockedReason: nil
            ),
            error: nil
        )

        switch validator.validate(response) {
        case .valid(let validResponse):
            return validResponse
        case .invalid(let issues, _):
            throw CloudAIServiceError.invalidResponse(issues.map(\.description))
        }
    }
}

private extension CloudAIGeneratedFilter {
    init(recipe: GeneratedFilterRecipe, source: CloudAIGeneratedFilterSource) {
        id = recipe.id
        nameKey = recipe.nameKey
        descriptionKey = recipe.descriptionKey
        self.source = source
        confidence = recipe.confidence
        recommendedUseKeys = recipe.recommendedUseKeys
        parameters = CloudAIGeneratedFilterParameters(parameters: recipe.parameters)
        warningsKeys = recipe.warningsKeys
        recipeVersion = recipe.recipeVersion
    }
}

private extension CloudAIGeneratedFilterParameters {
    init(parameters: GeneratedFilterParameterSet) {
        exposure = parameters.exposure
        contrast = parameters.contrast
        saturation = parameters.saturation
        temperature = parameters.temperature
        tint = parameters.tint
        fade = parameters.fade
        grain = parameters.grain
        vignette = parameters.vignette
    }
}
