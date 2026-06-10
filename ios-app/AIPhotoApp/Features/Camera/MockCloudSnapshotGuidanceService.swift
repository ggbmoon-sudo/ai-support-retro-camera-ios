import Foundation

@MainActor
struct MockCloudSnapshotGuidanceService: CloudSnapshotGuidanceService {
    let outcome: CloudSnapshotGuidanceMockOutcome

    init(outcome: CloudSnapshotGuidanceMockOutcome = .success) {
        self.outcome = outcome
    }

    func analyze(_ request: CloudSnapshotGuidanceRequest) async throws -> CloudSnapshotGuidanceResponse {
        try await Task.sleep(nanoseconds: 700_000_000)

        switch outcome {
        case .success:
            return CloudSnapshotGuidanceResponse(
                summaryKey: "camera.cloud_snapshot.result.summary",
                suggestions: [
                    CloudSnapshotGuidanceSuggestion(
                        id: "hold_center",
                        messageKey: "camera.cloud_snapshot.result.suggestion.hold_center"
                    ),
                    CloudSnapshotGuidanceSuggestion(
                        id: "soften_light",
                        messageKey: "camera.cloud_snapshot.result.suggestion.soften_light"
                    ),
                    CloudSnapshotGuidanceSuggestion(
                        id: "try_filter",
                        messageKey: "camera.cloud_snapshot.result.suggestion.try_filter"
                    )
                ],
                sourceKey: "camera.cloud_snapshot.result.source.mock",
                isMock: true
            )
        case .failure:
            throw CloudSnapshotGuidanceError.mockFailure
        case .unavailable:
            throw CloudSnapshotGuidanceError.mockUnavailable
        }
    }
}
