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

struct CloudAIPhotoAdvisorRequest: Codable, Hashable, Sendable {
    let schemaVersion: String
    let feature: String
    let mode: CloudAIMode
    let locale: String
    let consent: CloudAIConsent
    let image: CloudAIRequestImage
    let client: CloudAIRequestClient
    let selectedFilterId: String?

    init(input: CloudAIPhotoAdvisorInput) {
        schemaVersion = "1.0"
        feature = "photo_advisor"
        mode = .postCapture
        locale = input.locale
        consent = input.consent
        image = CloudAIRequestImage(input: input)
        client = CloudAIRequestClient(platform: "iOS", appVersion: Bundle.main.appVersionString)
        selectedFilterId = input.selectedFilterId
    }
}

struct CloudAIRequestImage: Codable, Hashable, Sendable {
    let contentType: String
    let width: Int
    let height: Int
    let metadataStripped: Bool
    let dataBase64: String

    init(input: CloudAIPhotoAdvisorInput) {
        contentType = input.contentType
        width = input.width
        height = input.height
        metadataStripped = input.metadataStripped
        dataBase64 = input.imageData.base64EncodedString()
    }
}

struct CloudAIRequestClient: Codable, Hashable, Sendable {
    let platform: String
    let appVersion: String
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
    case remoteUnavailable
    case remoteHTTPStatus(Int)
    case invalidResponse([String])
    case imageCompressionFailed

    var errorDescription: String? {
        switch self {
        case .consentRequired:
            return "Cloud photo analysis requires explicit consent."
        case .remoteDisabled:
            return "Remote Cloud AI is disabled in this build."
        case .remoteUnavailable:
            return "Cloud analysis is unavailable right now."
        case .remoteHTTPStatus(let statusCode):
            return "Cloud analysis returned HTTP \(statusCode)."
        case .invalidResponse(let reasons):
            return "Cloud AI response failed validation: \(reasons.joined(separator: ", "))"
        case .imageCompressionFailed:
            return "Unable to prepare the image for cloud analysis."
        }
    }
}

private extension Bundle {
    var appVersionString: String {
        let version = object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String
        let build = object(forInfoDictionaryKey: "CFBundleVersion") as? String

        switch (version, build) {
        case let (version?, build?):
            return "\(version) (\(build))"
        case let (version?, nil):
            return version
        default:
            return "debug"
        }
    }
}
