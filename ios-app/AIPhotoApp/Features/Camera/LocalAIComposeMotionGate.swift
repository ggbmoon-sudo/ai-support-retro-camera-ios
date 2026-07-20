import Foundation

nonisolated enum LocalAIComposeMotionBucket: String, Equatable, Sendable {
    case stable
    case moving
    case unavailable
}

nonisolated struct LocalAIComposeMotionGateState: Equatable, Sendable {
    let isPaused: Bool
    let consecutiveReleaseSamples: Int

    static let initial = LocalAIComposeMotionGateState(
        isPaused: false,
        consecutiveReleaseSamples: 0
    )
}

nonisolated struct LocalAIComposeMotionGateUpdate: Equatable, Sendable {
    let state: LocalAIComposeMotionGateState
    let didEnterPause: Bool
    let didLeavePause: Bool
}

/// Pauses scene-policy and Ready evidence immediately on a moving bucket.
/// Two fresh stable/unavailable full-analysis samples are required to resume.
nonisolated struct LocalAIComposeMotionGateController: Sendable {
    private let requiredReleaseSamples = 2

    func update(
        state: LocalAIComposeMotionGateState,
        motion: LocalAIComposeMotionBucket
    ) -> LocalAIComposeMotionGateUpdate {
        let nextState: LocalAIComposeMotionGateState
        switch motion {
        case .moving:
            nextState = LocalAIComposeMotionGateState(
                isPaused: true,
                consecutiveReleaseSamples: 0
            )

        case .stable, .unavailable:
            if !state.isPaused {
                nextState = .initial
            } else {
                let releaseSamples = min(
                    state.consecutiveReleaseSamples + 1,
                    requiredReleaseSamples
                )
                nextState = LocalAIComposeMotionGateState(
                    isPaused: releaseSamples < requiredReleaseSamples,
                    consecutiveReleaseSamples: releaseSamples
                )
            }
        }

        return LocalAIComposeMotionGateUpdate(
            state: nextState,
            didEnterPause: !state.isPaused && nextState.isPaused,
            didLeavePause: state.isPaused && !nextState.isPaused
        )
    }
}
