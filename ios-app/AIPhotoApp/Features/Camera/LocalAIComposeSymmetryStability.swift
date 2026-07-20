import Foundation

nonisolated struct LocalAIComposeSymmetryStabilityState: Equatable, Sendable {
    let consecutiveObservedSamples: Int
    let consecutiveClearSamples: Int
    let isActive: Bool

    static let initial = LocalAIComposeSymmetryStabilityState(
        consecutiveObservedSamples: 0,
        consecutiveClearSamples: 0,
        isActive: false
    )
}

nonisolated struct LocalAIComposeSymmetryStabilityUpdate: Equatable, Sendable {
    let state: LocalAIComposeSymmetryStabilityState
    let didChangeActiveState: Bool
}

/// Requires repeated full-analysis evidence before automatic policy may enter or
/// leave symmetry. Fast sequence-tracking frames never call this controller.
nonisolated struct LocalAIComposeSymmetryStabilityController: Sendable {
    private let requiredSamples = 2

    func update(
        state: LocalAIComposeSymmetryStabilityState,
        evidence: LiveFrameSymmetryEvidence
    ) -> LocalAIComposeSymmetryStabilityUpdate {
        let nextState: LocalAIComposeSymmetryStabilityState
        switch evidence {
        case .observed:
            let observedSamples = min(
                state.consecutiveObservedSamples + 1,
                requiredSamples
            )
            nextState = LocalAIComposeSymmetryStabilityState(
                consecutiveObservedSamples: observedSamples,
                consecutiveClearSamples: 0,
                isActive: state.isActive || observedSamples >= requiredSamples
            )

        case .notObserved, .unavailable:
            let clearSamples = min(
                state.consecutiveClearSamples + 1,
                requiredSamples
            )
            nextState = LocalAIComposeSymmetryStabilityState(
                consecutiveObservedSamples: 0,
                consecutiveClearSamples: clearSamples,
                isActive: state.isActive && clearSamples < requiredSamples
            )
        }

        return LocalAIComposeSymmetryStabilityUpdate(
            state: nextState,
            didChangeActiveState: nextState.isActive != state.isActive
        )
    }
}
