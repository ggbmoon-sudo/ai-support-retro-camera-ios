import Foundation

nonisolated enum LocalAIComposeReadiness: String, Equatable, Sendable {
    case inactive
    case holding
    case ready
}

nonisolated struct LocalAIComposeReadinessState: Equatable, Sendable {
    let consecutiveAlignedFrameSamples: Int
    let readiness: LocalAIComposeReadiness

    static let initial = LocalAIComposeReadinessState(
        consecutiveAlignedFrameSamples: 0,
        readiness: .inactive
    )
}

/// Requires repeated fresh frame evidence before presenting the composition as ready.
/// It exposes no score, countdown, confidence, or automatic capture decision.
nonisolated struct LocalAIComposeReadinessController: Sendable {
    private let requiredAlignedFrameSamples = 2

    func update(
        state: LocalAIComposeReadinessState,
        isAlignedFrame: Bool
    ) -> LocalAIComposeReadinessState {
        guard isAlignedFrame else { return .initial }

        let alignedSamples = min(
            state.consecutiveAlignedFrameSamples + 1,
            requiredAlignedFrameSamples
        )
        return LocalAIComposeReadinessState(
            consecutiveAlignedFrameSamples: alignedSamples,
            readiness: alignedSamples >= requiredAlignedFrameSamples
                ? .ready
                : .holding
        )
    }
}
