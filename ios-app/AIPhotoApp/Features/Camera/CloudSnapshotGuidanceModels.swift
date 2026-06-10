import Foundation

nonisolated struct CloudSnapshotGuidanceRequest: Equatable, Sendable {
    let filterPresetID: String
    let filterNameKey: String
    let lensFocalLengthLabel: String
    let guidanceModeID: String
    let requestedAt: Date
}

nonisolated struct CloudSnapshotGuidanceSuggestion: Identifiable, Equatable, Sendable {
    let id: String
    let messageKey: String
}

nonisolated struct CloudSnapshotGuidanceResponse: Identifiable, Equatable, Sendable {
    let id: UUID
    let summaryKey: String
    let suggestions: [CloudSnapshotGuidanceSuggestion]
    let sourceKey: String
    let isMock: Bool

    init(
        id: UUID = UUID(),
        summaryKey: String,
        suggestions: [CloudSnapshotGuidanceSuggestion],
        sourceKey: String,
        isMock: Bool
    ) {
        self.id = id
        self.summaryKey = summaryKey
        self.suggestions = suggestions
        self.sourceKey = sourceKey
        self.isMock = isMock
    }
}

nonisolated enum CloudSnapshotGuidanceMockOutcome: Equatable, Sendable {
    case success
    case failure
    case unavailable
}

nonisolated enum CloudSnapshotGuidanceError: Error, Sendable {
    case mockFailure
    case mockUnavailable

    var messageKey: String {
        switch self {
        case .mockFailure:
            return "camera.cloud_snapshot.error.mock_failure"
        case .mockUnavailable:
            return "camera.cloud_snapshot.error.unavailable"
        }
    }
}
