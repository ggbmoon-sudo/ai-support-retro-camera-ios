import Foundation

struct PhotoAdvisorInput: Hashable {
    let photoId: String
    let source: PhotoAdvisorPhotoSource
    let selectedFilterId: String?
    let mockScene: PhotoAdvisorMockScene?
    let variantSeed: Int
    let localeIdentifier: String

    init(
        photoId: String,
        source: PhotoAdvisorPhotoSource,
        selectedFilterId: String?,
        mockScene: PhotoAdvisorMockScene? = nil,
        variantSeed: Int = 0,
        localeIdentifier: String = Locale.preferredLanguages.first ?? "en"
    ) {
        self.photoId = photoId
        self.source = source
        self.selectedFilterId = selectedFilterId
        self.mockScene = mockScene
        self.variantSeed = variantSeed
        self.localeIdentifier = localeIdentifier
    }
}

enum PhotoAdvisorPhotoSource: String, Codable, Hashable {
    case captured
    case imported
    case placeholder
}

enum PhotoAdvisorMode: String, Codable, Hashable {
    case postCapture = "post_capture"
}

enum PhotoAdvisorSource: String, Codable, Hashable {
    case mock
    case local
    case cloud
    case fallback
}

enum PhotoAdvisorConfidence: String, Codable, Hashable {
    case low
    case medium
    case high
}

enum PhotoAdvisorSuggestionType: String, Codable, Hashable {
    case filter
    case crop
    case lighting
    case retake
    case composition
}

enum PhotoAdvisorPriority: String, Codable, Hashable {
    case low
    case medium
    case high
}

enum PhotoAdvisorMockScene: String, CaseIterable, Codable, Hashable {
    case warmPortrait
    case nightStreet
    case dimIndoor
    case ccdParty
    case travelLandscape
    case overexposedHighlight
    case busyBackground
    case chromeMood
}

struct PhotoAdvisorResult: Identifiable, Codable, Hashable {
    let id: String
    let schemaVersion: String
    let mode: PhotoAdvisorMode
    let summaryKey: String
    let strengthsKeys: [String]
    let suggestions: [PhotoAdvisorSuggestion]
    let recommendedFilters: [PhotoAdvisorFilterRecommendation]
    let retakeAdvice: PhotoAdvisorRetakeAdvice
    let cropAdvice: PhotoAdvisorCropAdvice?
    let confidence: PhotoAdvisorConfidence
    let source: PhotoAdvisorSource
}

struct PhotoAdvisorSuggestion: Identifiable, Codable, Hashable {
    let id: String
    let type: PhotoAdvisorSuggestionType
    let textKey: String
    let priority: PhotoAdvisorPriority
}

struct PhotoAdvisorFilterRecommendation: Identifiable, Codable, Hashable {
    let id: String
    let filterId: String
    let reasonKey: String
    let confidence: PhotoAdvisorConfidence
}

struct PhotoAdvisorRetakeAdvice: Codable, Hashable {
    let shouldRetake: Bool
    let reasonKey: String
}

struct PhotoAdvisorCropAdvice: Codable, Hashable {
    let recommended: Bool
    let textKey: String
}

enum PhotoAdvisorState: Equatable {
    case idle
    case analyzing
    case success(PhotoAdvisorResult)
    case failed(messageKey: String)
    case unavailable(messageKey: String)

    var isAnalyzing: Bool {
        if case .analyzing = self {
            return true
        }

        return false
    }
}

enum PhotoAdvisorError: LocalizedError {
    case mockUnavailable
    case invalidMockResult

    var errorDescription: String? {
        switch self {
        case .mockUnavailable:
            return NSLocalizedString("photo_advisor.error.unavailable", comment: "")
        case .invalidMockResult:
            return NSLocalizedString("photo_advisor.error.invalid_result", comment: "")
        }
    }
}
