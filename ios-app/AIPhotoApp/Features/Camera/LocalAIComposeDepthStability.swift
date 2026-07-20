import Foundation

nonisolated struct LocalAIComposeDepthStabilityState: Equatable, Sendable {
    let isActive: Bool
    let matchingObservationCount: Int
    let clearObservationCount: Int

    static let initial = LocalAIComposeDepthStabilityState(
        isActive: false,
        matchingObservationCount: 0,
        clearObservationCount: 0
    )
}

nonisolated struct LocalAIComposeDepthStabilityUpdate: Equatable, Sendable {
    let state: LocalAIComposeDepthStabilityState
    let didChangeActiveState: Bool
}

/// Requires repeated, synchronized bucket evidence before drawing a depth-layer cue.
/// Metric depth, valid ratios, and depth maps never enter this controller.
nonisolated struct LocalAIComposeDepthStabilityController: Sendable {
    private let requiredMatchingObservationCount = 2
    private let requiredClearObservationCount = 2

    func update(
        state: LocalAIComposeDepthStabilityState,
        signals: DepthSignals
    ) -> LocalAIComposeDepthStabilityUpdate {
        let hasReliableLayers = signals.depthState == .hardwareDepthAvailable
            && signals.foregroundBackgroundSeparationBucket == .high
            && (signals.depthConfidenceBucket == .high
                || signals.depthConfidenceBucket == .balanced)
        let nextState: LocalAIComposeDepthStabilityState

        if hasReliableLayers {
            let matchingCount = min(
                state.matchingObservationCount + 1,
                requiredMatchingObservationCount
            )
            nextState = LocalAIComposeDepthStabilityState(
                isActive: state.isActive
                    || matchingCount >= requiredMatchingObservationCount,
                matchingObservationCount: matchingCount,
                clearObservationCount: 0
            )
        } else {
            let clearCount = min(
                state.clearObservationCount + 1,
                requiredClearObservationCount
            )
            nextState = LocalAIComposeDepthStabilityState(
                isActive: state.isActive
                    && clearCount < requiredClearObservationCount,
                matchingObservationCount: 0,
                clearObservationCount: clearCount
            )
        }

        return LocalAIComposeDepthStabilityUpdate(
            state: nextState,
            didChangeActiveState: nextState.isActive != state.isActive
        )
    }
}
