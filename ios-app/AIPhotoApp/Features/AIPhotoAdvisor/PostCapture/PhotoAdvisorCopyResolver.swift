import Foundation

nonisolated enum PhotoAdvisorCopyCategory: String, CaseIterable, Sendable {
    case moodSummary = "mood_summary"
    case compositionAdvice = "composition_advice"
    case lightingAdvice = "lighting_advice"
    case filterRecommendation = "filter_recommendation"
    case cropAdvice = "crop_advice"
    case retakeAdvice = "retake_advice"
    case keepAdvice = "keep_advice"
    case captionSuggestion = "caption_suggestion"
    case unavailable
}

nonisolated struct PhotoAdvisorCopyResolver: Sendable {
    func messageKey(
        for category: PhotoAdvisorCopyCategory,
        language: AppLanguageMode,
        requestedTone: ToneMode
    ) -> String {
        let tone = resolvedTone(
            language: language,
            requestedTone: requestedTone,
            category: category
        )

        return "photo_advisor.copy.\(language.keyComponent).\(tone.keyComponent).\(category.rawValue)"
    }

    func localizedResult(_ result: PhotoAdvisorResult, input: PhotoAdvisorInput) -> PhotoAdvisorResult {
        PhotoAdvisorResult(
            id: result.id,
            schemaVersion: result.schemaVersion,
            mode: result.mode,
            summaryKey: messageKey(for: .moodSummary, language: input.languageMode, requestedTone: input.toneMode),
            strengthsKeys: result.strengthsKeys,
            suggestions: localizedSuggestions(result.suggestions, input: input),
            recommendedFilters: localizedRecommendations(result.recommendedFilters, input: input),
            retakeAdvice: PhotoAdvisorRetakeAdvice(
                shouldRetake: result.retakeAdvice.shouldRetake,
                reasonKey: messageKey(for: result.retakeAdvice.shouldRetake ? .retakeAdvice : .keepAdvice, language: input.languageMode, requestedTone: input.toneMode)
            ),
            cropAdvice: result.cropAdvice.map { cropAdvice in
                PhotoAdvisorCropAdvice(
                    recommended: cropAdvice.recommended,
                    textKey: messageKey(for: .cropAdvice, language: input.languageMode, requestedTone: input.toneMode)
                )
            },
            confidence: result.confidence,
            source: result.source
        )
    }

    private func localizedSuggestions(
        _ suggestions: [PhotoAdvisorSuggestion],
        input: PhotoAdvisorInput
    ) -> [PhotoAdvisorSuggestion] {
        let categories: [PhotoAdvisorCopyCategory] = [
            .filterRecommendation,
            .compositionAdvice,
            .lightingAdvice
        ]

        return suggestions.enumerated().map { index, suggestion in
            let category = categories[min(index, categories.count - 1)]
            return PhotoAdvisorSuggestion(
                id: suggestion.id,
                type: suggestion.type,
                textKey: messageKey(for: category, language: input.languageMode, requestedTone: input.toneMode),
                priority: suggestion.priority
            )
        }
    }

    private func localizedRecommendations(
        _ recommendations: [PhotoAdvisorFilterRecommendation],
        input: PhotoAdvisorInput
    ) -> [PhotoAdvisorFilterRecommendation] {
        recommendations.map { recommendation in
            PhotoAdvisorFilterRecommendation(
                id: recommendation.id,
                filterId: recommendation.filterId,
                reasonKey: messageKey(for: .filterRecommendation, language: input.languageMode, requestedTone: input.toneMode),
                confidence: recommendation.confidence
            )
        }
    }

    private func resolvedTone(
        language: AppLanguageMode,
        requestedTone: ToneMode,
        category: PhotoAdvisorCopyCategory
    ) -> ToneMode {
        if category == .unavailable {
            return .neutral
        }

        switch language {
        case .english, .traditionalChinese, .simplifiedChinese:
            return .neutral
        case .cantonese:
            switch requestedTone {
            case .neutral:
                return .hongKongConversational
            case .troublemakerExplicit:
                return .troublemaker
            case .hongKongConversational, .troublemaker:
                return requestedTone
            }
        }
    }
}

private extension AppLanguageMode {
    var keyComponent: String {
        switch self {
        case .english:
            return "en"
        case .traditionalChinese:
            return "zh_hant"
        case .simplifiedChinese:
            return "zh_hans"
        case .cantonese:
            return "yue"
        }
    }
}

private extension ToneMode {
    var keyComponent: String {
        switch self {
        case .neutral:
            return "neutral"
        case .hongKongConversational:
            return "hk"
        case .troublemaker, .troublemakerExplicit:
            return "troublemaker"
        }
    }
}
