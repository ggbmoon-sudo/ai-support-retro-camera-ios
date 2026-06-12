import Foundation

enum CloudAIPhotoAdvisorMapper {
    static func map(
        _ response: CloudAIResponse,
        allowedFilterIds: Set<String>
    ) -> PhotoAdvisorResult {
        let suggestions = response.suggestions.prefix(3).enumerated().map { index, suggestion in
            PhotoAdvisorSuggestion(
                id: "cloud_suggestion_\(index)",
                type: mapSuggestionType(suggestion.type),
                textKey: suggestion.text,
                priority: mapPriority(suggestion.priority)
            )
        }

        let filters: [PhotoAdvisorFilterRecommendation] = response.recommendedFilters.prefix(3).enumerated().compactMap { item in
            let index = item.offset
            let filter = item.element
            guard allowedFilterIds.contains(filter.filterId) else { return nil }

            return PhotoAdvisorFilterRecommendation(
                id: "cloud_filter_\(index)_\(filter.filterId)",
                filterId: filter.filterId,
                reasonKey: filter.reason,
                confidence: mapConfidence(filter.confidence)
            )
        }

        let fallback = PhotoAdvisorResultValidator.fallback(allowedFilterIds: allowedFilterIds)
        let result = PhotoAdvisorResult(
            id: "cloud_debug_\(UUID().uuidString.lowercased())",
            schemaVersion: response.schemaVersion,
            mode: .postCapture,
            summaryKey: response.summary,
            strengthsKeys: [
                "Cloud boundary returned a structured mock response."
            ],
            suggestions: suggestions.isEmpty ? fallback.suggestions : suggestions,
            recommendedFilters: filters.isEmpty ? fallback.recommendedFilters : filters,
            retakeAdvice: response.retakeAdvice.map {
                PhotoAdvisorRetakeAdvice(
                    shouldRetake: $0.shouldRetake,
                    reasonKey: $0.reason
                )
            } ?? fallback.retakeAdvice,
            cropAdvice: response.cropAdvice.map {
                PhotoAdvisorCropAdvice(
                    recommended: $0.recommended,
                    textKey: $0.text
                )
            } ?? fallback.cropAdvice,
            confidence: mapConfidence(response.confidence),
            source: mapSource(response.source)
        )

        return PhotoAdvisorResultValidator.validated(result, allowedFilterIds: allowedFilterIds)
    }

    private static func mapSuggestionType(_ type: CloudAISuggestionType) -> PhotoAdvisorSuggestionType {
        switch type {
        case .filter:
            return .filter
        case .crop:
            return .crop
        case .lighting:
            return .lighting
        case .retake:
            return .retake
        case .composition:
            return .composition
        }
    }

    private static func mapPriority(_ priority: CloudAISuggestionPriority) -> PhotoAdvisorPriority {
        switch priority {
        case .low:
            return .low
        case .medium:
            return .medium
        case .high:
            return .high
        }
    }

    private static func mapConfidence(_ confidence: CloudAIConfidence) -> PhotoAdvisorConfidence {
        switch confidence {
        case .low:
            return .low
        case .medium:
            return .medium
        case .high:
            return .high
        }
    }

    private static func mapSource(_ source: CloudAIResponseSource) -> PhotoAdvisorSource {
        switch source {
        case .mock:
            return .mock
        case .local:
            return .local
        case .cloud:
            return .cloud
        case .fallback:
            return .fallback
        }
    }
}
