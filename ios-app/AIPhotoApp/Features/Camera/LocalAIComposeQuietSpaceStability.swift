import Foundation

nonisolated struct LocalAIComposeQuietSpaceStabilityState: Equatable, Sendable {
    let candidateSide: LiveFrameHorizontalSide?
    let consecutiveObservedSamples: Int
    let consecutiveClearSamples: Int
    let activeSide: LiveFrameHorizontalSide?

    static let initial = LocalAIComposeQuietSpaceStabilityState(
        candidateSide: nil,
        consecutiveObservedSamples: 0,
        consecutiveClearSamples: 0,
        activeSide: nil
    )
}

nonisolated struct LocalAIComposeQuietSpaceStabilityUpdate: Equatable, Sendable {
    let state: LocalAIComposeQuietSpaceStabilityState
    let didChangeActiveSide: Bool
}

/// Requires two matching full-analysis samples before activating or switching
/// a quiet-space side, and two clear samples before removing it.
nonisolated struct LocalAIComposeQuietSpaceStabilityController: Sendable {
    private let requiredSamples = 2

    func update(
        state: LocalAIComposeQuietSpaceStabilityState,
        signal: LiveFrameQuietSpaceSignal
    ) -> LocalAIComposeQuietSpaceStabilityUpdate {
        let nextState: LocalAIComposeQuietSpaceStabilityState
        switch (signal.evidence, signal.side) {
        case let (.observed, side?):
            if state.activeSide == side {
                nextState = LocalAIComposeQuietSpaceStabilityState(
                    candidateSide: nil,
                    consecutiveObservedSamples: requiredSamples,
                    consecutiveClearSamples: 0,
                    activeSide: side
                )
            } else {
                let matchesCandidate = state.candidateSide == side
                let observedSamples = matchesCandidate
                    ? min(state.consecutiveObservedSamples + 1, requiredSamples)
                    : 1
                nextState = LocalAIComposeQuietSpaceStabilityState(
                    candidateSide: observedSamples >= requiredSamples ? nil : side,
                    consecutiveObservedSamples: observedSamples,
                    consecutiveClearSamples: 0,
                    activeSide: observedSamples >= requiredSamples ? side : state.activeSide
                )
            }

        case (.observed, nil), (.notObserved, _), (.unavailable, _):
            let clearSamples = min(
                state.consecutiveClearSamples + 1,
                requiredSamples
            )
            nextState = LocalAIComposeQuietSpaceStabilityState(
                candidateSide: nil,
                consecutiveObservedSamples: 0,
                consecutiveClearSamples: clearSamples,
                activeSide: clearSamples >= requiredSamples ? nil : state.activeSide
            )
        }

        return LocalAIComposeQuietSpaceStabilityUpdate(
            state: nextState,
            didChangeActiveSide: state.activeSide != nextState.activeSide
        )
    }
}
