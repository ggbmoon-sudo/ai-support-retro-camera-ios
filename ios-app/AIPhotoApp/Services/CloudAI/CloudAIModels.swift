import Foundation

struct CloudAIPhotoAdvisorInput {
    let imageData: Data
    let contentType: String
    let width: Int
    let height: Int
    let metadataStripped: Bool
    let locale: String
    let consent: CloudAIConsent
    let selectedFilterId: String?
}

struct CloudAIConsent: Codable, Hashable, Sendable {
    static let currentVersion = "2026-06-12.phase17a.v1"

    let imageUploadAccepted: Bool
    let consentVersion: String

    static var acceptedCurrent: CloudAIConsent {
        CloudAIConsent(
            imageUploadAccepted: true,
            consentVersion: currentVersion
        )
    }
}

enum CloudAIMode: String, Codable, CaseIterable, Hashable, Sendable {
    case postCapture = "post_capture"
    case preCapture = "pre_capture"
    case filterRecommendation = "filter_recommendation"
    case filterGeneration = "filter_generation"
    case inspiration
    case poseGuide = "pose_guide"
    case unavailable
    case error
}

enum CloudAIResponseSource: String, Codable, CaseIterable, Hashable, Sendable {
    case mock
    case local
    case cloud
    case fallback
}

enum CloudAIConfidence: String, Codable, CaseIterable, Hashable, Sendable {
    case low
    case medium
    case high
}

enum CloudAISuggestionType: String, Codable, Hashable, Sendable {
    case filter
    case crop
    case lighting
    case retake
    case composition
}

enum CloudAISuggestionPriority: String, Codable, Hashable, Sendable {
    case low
    case medium
    case high
}

enum CloudAISuggestionAction: String, Codable, Hashable, Sendable {
    case applyFilter = "apply_filter"
    case adjustCrop = "adjust_crop"
    case retake
    case none
}

struct CloudAISuggestion: Codable, Hashable, Sendable {
    let type: CloudAISuggestionType
    let text: String
    let priority: CloudAISuggestionPriority
    let action: CloudAISuggestionAction
}

struct CloudAIRecommendedFilter: Codable, Hashable, Sendable {
    let filterId: String
    let reason: String
    let confidence: CloudAIConfidence
}

struct CloudAIGeneratedFilter: Codable, Hashable, Sendable {
    let filterId: String?
    let exposure: Double?
    let contrast: Double?
    let saturation: Double?
    let warmth: Double?
}

struct CloudAIPoseGuide: Codable, Hashable, Sendable {
    let guideId: String
    let text: String
}

struct CloudAIRetakeAdvice: Codable, Hashable, Sendable {
    let shouldRetake: Bool
    let reason: String
}

struct CloudAICropAdvice: Codable, Hashable, Sendable {
    let recommended: Bool
    let text: String
}

struct CloudAISafety: Codable, Hashable, Sendable {
    let containsSensitiveInference: Bool
    let requiresUserConsent: Bool
    let blockedReason: String?
}

struct CloudAIError: Codable, Hashable, Sendable {
    let code: String
    let message: String
}

struct CloudAIResponse: Codable, Hashable, Sendable {
    let schemaVersion: String
    let mode: CloudAIMode
    let summary: String
    let suggestions: [CloudAISuggestion]
    let recommendedFilters: [CloudAIRecommendedFilter]
    let generatedFilter: CloudAIGeneratedFilter?
    let poseGuide: CloudAIPoseGuide?
    let retakeAdvice: CloudAIRetakeAdvice?
    let cropAdvice: CloudAICropAdvice?
    let confidence: CloudAIConfidence
    let source: CloudAIResponseSource
    let locale: String
    let safety: CloudAISafety
    let error: CloudAIError?
}

enum CloudAIServiceError: LocalizedError, Equatable {
    case consentRequired
    case remoteDisabled
    case invalidResponse([String])
    case imageCompressionFailed

    var errorDescription: String? {
        switch self {
        case .consentRequired:
            return "Cloud photo analysis requires explicit consent."
        case .remoteDisabled:
            return "Remote Cloud AI is disabled in this build."
        case .invalidResponse(let reasons):
            return "Cloud AI response failed validation: \(reasons.joined(separator: ", "))"
        case .imageCompressionFailed:
            return "Unable to prepare the image for cloud analysis."
        }
    }
}
