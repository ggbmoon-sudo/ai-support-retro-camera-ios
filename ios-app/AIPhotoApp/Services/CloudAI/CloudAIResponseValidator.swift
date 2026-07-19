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
        guard recipeVersion == "1.1" || recipeVersion == "2.0",
              id.hasPrefix("ai_"),
              source == .cloud || source == .mock || source == .local,
              (0.0...1.0).contains(confidence),
              !nameKey.isEmpty,
              !descriptionKey.isEmpty,
              !recommendedUseKeys.isEmpty,
              !warningsKeys.isEmpty else {
            return false
        }

        let params = parameters
        let legacyParametersAreSafe = (-0.35...0.35).contains(params.exposure)
            && (-0.35...0.35).contains(params.contrast)
            && (-0.35...0.45).contains(params.saturation)
            && (-0.45...0.45).contains(params.temperature)
            && (-0.25...0.25).contains(params.tint)
            && (0.0...0.5).contains(params.fade)
            && (0.0...0.4).contains(params.shadowLift)
            && (0.0...0.4).contains(params.highlightRollOff)
            && (0.0...0.3).contains(params.bloom)
            && (0.0...0.35).contains(params.grain)
            && (0.0...0.35).contains(params.dust)
            && (0.0...0.35).contains(params.vignette)

        guard legacyParametersAreSafe else { return false }
        guard recipeVersion == "2.0" else { return true }
        guard let colorTransform, let film else { return false }
        return colorTransform.isSafe && film.isSafe
    }
}

private extension CloudAIGeneratedFilterColorTransform {
    var isSafe: Bool {
        guard (0.0...0.35).contains(inputNormalizationStrength),
              (0.0...1.0).contains(styleIntensity),
              lumaCurve.isSafeGeneratedFilterCurve,
              redCurve.isSafeGeneratedFilterCurve,
              greenCurve.isSafeGeneratedFilterCurve,
              blueCurve.isSafeGeneratedFilterCurve else {
            return false
        }

        let weights = basisLUTWeights.values
        let sum = weights.reduce(0, +)
        return weights.allSatisfy { $0.isFinite && (0.0...1.0).contains($0) }
            && abs(sum - 1) <= 0.001
    }
}

private extension CloudAIGeneratedFilterBasisLUTWeights {
    var values: [Double] {
        [neutral, warmAmber, roseFlash, coolChrome, tealOrange, mutedPastel, deepBrown, chromeSlide]
    }
}

private extension CloudAIGeneratedFilterFilm {
    var isSafe: Bool {
        (0.6...2.2).contains(grainSize)
            && (0.0...1.0).contains(grainRoughness)
            && (-1.0...1.0).contains(grainLumaResponse)
            && (0.0...0.25).contains(halationStrength)
            && (2.0...24.0).contains(halationRadius)
            && (0.0...1.0).contains(halationWarmth)
            && (0.0...0.25).contains(diffusion)
    }
}

private extension Array where Element == Double {
    var isSafeGeneratedFilterCurve: Bool {
        let identity = [0.0, 0.25, 0.5, 0.75, 1.0]
        guard count == identity.count else { return false }
        for index in indices {
            guard self[index].isFinite,
                  (0.0...1.0).contains(self[index]),
                  abs(self[index] - identity[index]) <= 0.180001 else {
                return false
            }
            if index > startIndex && self[index] < self[index - 1] {
                return false
            }
        }
        return self[0] <= 0.12 && self[count - 1] >= 0.88
    }
}
