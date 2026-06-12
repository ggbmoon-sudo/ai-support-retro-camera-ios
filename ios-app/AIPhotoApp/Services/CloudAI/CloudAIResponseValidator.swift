import Foundation

struct CloudAIResponseValidator: Sendable {
    private let allowedFilterIds: Set<String>
    private let supportedModes: Set<CloudAIMode>

    init(
        allowedFilterIds: Set<String> = Set(FilterPresetCatalog.all.map(\.id)),
        supportedModes: Set<CloudAIMode> = Set(CloudAIMode.allCases)
    ) {
        self.allowedFilterIds = allowedFilterIds
        self.supportedModes = supportedModes
    }

    func validate(_ response: CloudAIResponse) -> CloudAIValidationResult {
        var issues: [CloudAIValidationIssue] = []

        if response.schemaVersion != "1.0" {
            issues.append(.unsupportedSchemaVersion)
        }

        if !supportedModes.contains(response.mode) {
            issues.append(.unsupportedMode)
        }

        if response.summary.count > 280 {
            issues.append(.summaryTooLong)
        }

        if response.suggestions.count > 3 {
            issues.append(.tooManySuggestions)
        }

        if response.recommendedFilters.count > 3 {
            issues.append(.tooManyRecommendedFilters)
        }

        if response.suggestions.contains(where: { $0.text.count > 180 }) {
            issues.append(.suggestionTooLong)
        }

        let unknownFilters = response.recommendedFilters
            .map(\.filterId)
            .filter { !allowedFilterIds.contains($0) }
        if !unknownFilters.isEmpty {
            issues.append(.unknownFilterIds(unknownFilters))
        }

        if response.safety.containsSensitiveInference {
            issues.append(.sensitiveInference)
        }

        if let generatedFilter = response.generatedFilter,
           !generatedFilter.parametersAreSafe {
            issues.append(.unsafeGeneratedFilterParameters)
        }

        if issues.isEmpty {
            return .valid(response)
        }

        return .invalid(
            issues: issues,
            fallback: fallbackResponse(locale: response.locale)
        )
    }

    func fallbackResponse(locale: String) -> CloudAIResponse {
        CloudAIResponse(
            schemaVersion: "1.0",
            mode: .unavailable,
            summary: "相片顧問暫時未能使用，你仍然可以手動試濾鏡。",
            suggestions: [],
            recommendedFilters: [],
            generatedFilter: nil,
            poseGuide: nil,
            retakeAdvice: nil,
            cropAdvice: nil,
            confidence: .low,
            source: .fallback,
            locale: locale,
            safety: CloudAISafety(
                containsSensitiveInference: false,
                requiresUserConsent: true,
                blockedReason: "invalid_response"
            ),
            error: CloudAIError(
                code: "invalid_response",
                message: "The cloud AI response did not pass app validation."
            )
        )
    }
}

enum CloudAIValidationResult: Equatable {
    case valid(CloudAIResponse)
    case invalid(issues: [CloudAIValidationIssue], fallback: CloudAIResponse)

    var responseOrFallback: CloudAIResponse {
        switch self {
        case .valid(let response):
            return response
        case .invalid(_, let fallback):
            return fallback
        }
    }
}

enum CloudAIValidationIssue: Equatable, CustomStringConvertible {
    case unsupportedSchemaVersion
    case unsupportedMode
    case summaryTooLong
    case tooManySuggestions
    case tooManyRecommendedFilters
    case suggestionTooLong
    case unknownFilterIds([String])
    case sensitiveInference
    case unsafeGeneratedFilterParameters

    var description: String {
        switch self {
        case .unsupportedSchemaVersion:
            return "unsupported_schema_version"
        case .unsupportedMode:
            return "unsupported_mode"
        case .summaryTooLong:
            return "summary_too_long"
        case .tooManySuggestions:
            return "too_many_suggestions"
        case .tooManyRecommendedFilters:
            return "too_many_recommended_filters"
        case .suggestionTooLong:
            return "suggestion_too_long"
        case .unknownFilterIds(let ids):
            return "unknown_filter_ids:\(ids.joined(separator: ","))"
        case .sensitiveInference:
            return "sensitive_inference"
        case .unsafeGeneratedFilterParameters:
            return "unsafe_generated_filter_parameters"
        }
    }
}

private extension CloudAIGeneratedFilter {
    var parametersAreSafe: Bool {
        [exposure, contrast, saturation, warmth]
            .compactMap { $0 }
            .allSatisfy { (-2.0...2.0).contains($0) }
    }
}
