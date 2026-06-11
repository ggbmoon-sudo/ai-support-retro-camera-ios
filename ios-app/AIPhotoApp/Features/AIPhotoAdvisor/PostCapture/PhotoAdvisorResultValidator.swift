import Foundation

enum PhotoAdvisorResultValidator {
    static let schemaVersion = "1.0"

    static func validated(_ result: PhotoAdvisorResult, allowedFilterIds: Set<String>) -> PhotoAdvisorResult {
        guard result.schemaVersion == schemaVersion,
              result.mode == .postCapture,
              isAllowedSource(result.source),
              !result.summaryKey.isEmpty,
              !result.suggestions.isEmpty,
              !result.recommendedFilters.isEmpty else {
            return fallback(allowedFilterIds: allowedFilterIds)
        }

        let strengths = Array(result.strengthsKeys.filter { !$0.isEmpty }.prefix(3))
        let suggestions = Array(result.suggestions.filter { !$0.textKey.isEmpty }.prefix(3))
        let filters = Array(
            result.recommendedFilters
                .filter { allowedFilterIds.contains($0.filterId) && !$0.reasonKey.isEmpty }
                .prefix(3)
        )

        guard !suggestions.isEmpty, !filters.isEmpty else {
            return fallback(allowedFilterIds: allowedFilterIds)
        }

        return PhotoAdvisorResult(
            id: result.id,
            schemaVersion: result.schemaVersion,
            mode: result.mode,
            summaryKey: result.summaryKey,
            strengthsKeys: strengths,
            suggestions: suggestions,
            recommendedFilters: filters,
            retakeAdvice: result.retakeAdvice,
            cropAdvice: result.cropAdvice,
            confidence: result.confidence,
            source: result.source
        )
    }

    static func fallback(allowedFilterIds: Set<String>) -> PhotoAdvisorResult {
        let fixture = PhotoAdvisorFixtures.result(for: PhotoAdvisorFixtures.fallbackScene)

        if fixture.recommendedFilters.contains(where: { allowedFilterIds.contains($0.filterId) }) {
            return fixture
        }

        return PhotoAdvisorResult(
            id: "fallback_safe",
            schemaVersion: schemaVersion,
            mode: .postCapture,
            summaryKey: "photo_advisor.fallback.summary",
            strengthsKeys: [
                "photo_advisor.fallback.strength"
            ],
            suggestions: [
                PhotoAdvisorSuggestion(
                    id: "fallback_filter",
                    type: .filter,
                    textKey: "photo_advisor.fallback.suggestion",
                    priority: .medium
                )
            ],
            recommendedFilters: [
                PhotoAdvisorFilterRecommendation(
                    id: "fallback_soft_warm",
                    filterId: allowedFilterIds.contains("soft_warm_400") ? "soft_warm_400" : "original",
                    reasonKey: "photo_advisor.fallback.filter_reason",
                    confidence: .low
                )
            ],
            retakeAdvice: PhotoAdvisorRetakeAdvice(
                shouldRetake: false,
                reasonKey: "photo_advisor.fallback.retake"
            ),
            cropAdvice: nil,
            confidence: .low,
            source: .fallback
        )
    }

    private static func isAllowedSource(_ source: PhotoAdvisorSource) -> Bool {
        switch source {
        case .mock, .local, .cloud, .fallback:
            return true
        }
    }
}
