import Foundation

struct PhotoAdvisorResultCardModel: Hashable {
    let moodHeadlineKey: String
    let visualReasonKey: String?
    let primaryFilterRecommendation: PhotoAdvisorFilterRecommendation?
    let optionalRefinement: PhotoAdvisorCardAdvice?
    let secondaryAdvice: PhotoAdvisorCardAdvice?
    let fallbackMessageKey: String?

    init(result: PhotoAdvisorResult, input: PhotoAdvisorInput) {
        moodHeadlineKey = result.summaryKey
        primaryFilterRecommendation = result.recommendedFilters.first
        fallbackMessageKey = Self.fallbackMessageKey(for: result, input: input)

        let displaySuggestions = Self.displaySuggestions(from: result.suggestions)
        visualReasonKey = displaySuggestions.first?.textKey

        let usedKeys = Set([visualReasonKey].compactMap { $0 })
        optionalRefinement = Self.optionalRefinement(from: displaySuggestions, excluding: usedKeys)

        let refinementKeys = usedKeys.union([optionalRefinement?.textKey].compactMap { $0 })
        secondaryAdvice = Self.secondaryAdvice(from: result, excluding: refinementKeys)
    }

    private static func displaySuggestions(
        from suggestions: [PhotoAdvisorSuggestion]
    ) -> [PhotoAdvisorSuggestion] {
        suggestions
            .filter { suggestion in
                !isFallbackContext(suggestion.textKey)
            }
            .sorted { lhs, rhs in
                if lhs.priority.displayRank != rhs.priority.displayRank {
                    return lhs.priority.displayRank > rhs.priority.displayRank
                }

                return lhs.type.displayRank > rhs.type.displayRank
            }
    }

    private static func optionalRefinement(
        from suggestions: [PhotoAdvisorSuggestion],
        excluding usedKeys: Set<String>
    ) -> PhotoAdvisorCardAdvice? {
        guard let suggestion = suggestions.first(where: { !usedKeys.contains($0.textKey) }) else {
            return nil
        }

        return PhotoAdvisorCardAdvice(
            id: "refinement_\(suggestion.id)",
            titleKey: suggestion.type.refinementTitleKey,
            icon: suggestion.type.refinementIcon,
            textKey: suggestion.textKey
        )
    }

    private static func secondaryAdvice(
        from result: PhotoAdvisorResult,
        excluding usedKeys: Set<String>
    ) -> PhotoAdvisorCardAdvice? {
        if result.retakeAdvice.shouldRetake,
           !usedKeys.contains(result.retakeAdvice.reasonKey) {
            return PhotoAdvisorCardAdvice(
                id: "retake_optional",
                titleKey: "photo_advisor.section.optional_retake",
                icon: "arrow.triangle.2.circlepath",
                textKey: result.retakeAdvice.reasonKey
            )
        }

        if let cropAdvice = result.cropAdvice,
           !usedKeys.contains(cropAdvice.textKey) {
            return PhotoAdvisorCardAdvice(
                id: "crop_or_straighten",
                titleKey: cropAdvice.recommended
                    ? "photo_advisor.section.crop"
                    : "photo_advisor.section.optional_refinement",
                icon: cropAdvice.recommended ? "crop" : "rectangle.dashed",
                textKey: cropAdvice.textKey
            )
        }

        return nil
    }

    private static func fallbackMessageKey(
        for result: PhotoAdvisorResult,
        input: PhotoAdvisorInput
    ) -> String? {
        if result.source == .fallback {
            return PhotoAdvisorLanguagePack.providerUnavailableKey(
                language: input.languageMode,
                requestedTone: input.toneMode
            )
        }

        if input.source == .imported {
            return PhotoAdvisorLanguagePack.importedFallbackKey(for: input)
        }

        return nil
    }

    private static func isFallbackContext(_ key: String) -> Bool {
        key.hasPrefix("advisor.fallback.imported_photo")
            || key.hasPrefix("advisor.fallback.provider_unavailable")
            || key.hasPrefix("advisor.fallback.local_only")
    }
}

struct PhotoAdvisorCardAdvice: Identifiable, Hashable {
    let id: String
    let titleKey: String
    let icon: String
    let textKey: String
}

private extension PhotoAdvisorPriority {
    var displayRank: Int {
        switch self {
        case .high:
            return 3
        case .medium:
            return 2
        case .low:
            return 1
        }
    }
}

private extension PhotoAdvisorSuggestionType {
    var displayRank: Int {
        switch self {
        case .lighting:
            return 5
        case .composition:
            return 4
        case .filter:
            return 3
        case .crop:
            return 2
        case .retake:
            return 1
        }
    }

    var refinementTitleKey: String {
        switch self {
        case .filter:
            return "photo_advisor.section.filter_note"
        case .crop:
            return "photo_advisor.section.crop"
        case .lighting, .composition:
            return "photo_advisor.section.optional_refinement"
        case .retake:
            return "photo_advisor.section.optional_retake"
        }
    }

    var refinementIcon: String {
        switch self {
        case .filter:
            return "camera.filters"
        case .crop:
            return "crop"
        case .lighting:
            return "light.max"
        case .composition:
            return "rectangle.dashed"
        case .retake:
            return "arrow.triangle.2.circlepath"
        }
    }
}
