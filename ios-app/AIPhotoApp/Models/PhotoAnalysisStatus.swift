import Foundation

nonisolated enum PhotoAnalysisStatus: String, CaseIterable, Sendable {
    case notStarted
    case analyzing
    case completed
    case failed
    case blockedByConsentLater
    case quotaRequiredLater
    case unsafeContent
}

nonisolated enum PhotoAnalysisProvider: String, CaseIterable, Sendable {
    case mock
    case cloudFunction
    case gemini
    case openAI
    case unknown
}

nonisolated enum PhotoAnalysisError: LocalizedError, Equatable, Sendable {
    case invalidImage
    case quotaRequiredLater
    case providerUnavailable
    case networkUnavailable
    case unsafeContent
    case notConfigured
    case mockFailure
    case unknown

    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return NSLocalizedString("ai.error.invalid_image", comment: "")
        case .quotaRequiredLater:
            return NSLocalizedString("ai.error.quota_required_later", comment: "")
        case .providerUnavailable:
            return NSLocalizedString("ai.error.provider_unavailable", comment: "")
        case .networkUnavailable:
            return NSLocalizedString("ai.error.network_unavailable", comment: "")
        case .unsafeContent:
            return NSLocalizedString("ai.error.unsafe_content", comment: "")
        case .notConfigured:
            return NSLocalizedString("ai.error.not_configured", comment: "")
        case .mockFailure:
            return NSLocalizedString("ai.error.mock_failure", comment: "")
        case .unknown:
            return NSLocalizedString("ai.error.unknown", comment: "")
        }
    }
}
