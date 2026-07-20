import Foundation

nonisolated struct LocalAIComposePoseFramingState: Equatable, Sendable {
    let activeEdges: LiveFramePoseEdges
    let pendingEdges: LiveFramePoseEdges
    let consecutivePendingSamples: Int
    let consecutiveClearSamples: Int

    static let initial = LocalAIComposePoseFramingState(
        activeEdges: [],
        pendingEdges: [],
        consecutivePendingSamples: 0,
        consecutiveClearSamples: 0
    )
}

/// Requires repeated local pose evidence before showing, changing, or clearing an edge cue.
/// Only the bounded edge bitmask crosses actors; no joint coordinates or confidences are stored.
nonisolated struct LocalAIComposePoseFramingStabilityController: Sendable {
    private let requiredActivationSamples = 2
    private let requiredChangeSamples = 2
    private let requiredClearSamples = 2

    func update(
        state: LocalAIComposePoseFramingState,
        detectedEdges: LiveFramePoseEdges?
    ) -> LocalAIComposePoseFramingState {
        let detected = detectedEdges ?? []

        if state.activeEdges.isEmpty {
            guard !detected.isEmpty else { return .initial }
            let pendingSamples = state.pendingEdges == detected
                ? min(state.consecutivePendingSamples + 1, requiredActivationSamples)
                : 1
            guard pendingSamples >= requiredActivationSamples else {
                return LocalAIComposePoseFramingState(
                    activeEdges: [],
                    pendingEdges: detected,
                    consecutivePendingSamples: pendingSamples,
                    consecutiveClearSamples: 0
                )
            }
            return LocalAIComposePoseFramingState(
                activeEdges: detected,
                pendingEdges: [],
                consecutivePendingSamples: 0,
                consecutiveClearSamples: 0
            )
        }

        if detected.isEmpty {
            let clearSamples = min(
                state.consecutiveClearSamples + 1,
                requiredClearSamples
            )
            guard clearSamples >= requiredClearSamples else {
                return LocalAIComposePoseFramingState(
                    activeEdges: state.activeEdges,
                    pendingEdges: [],
                    consecutivePendingSamples: 0,
                    consecutiveClearSamples: clearSamples
                )
            }
            return .initial
        }

        guard detected != state.activeEdges else {
            return LocalAIComposePoseFramingState(
                activeEdges: state.activeEdges,
                pendingEdges: [],
                consecutivePendingSamples: 0,
                consecutiveClearSamples: 0
            )
        }

        let pendingSamples = state.pendingEdges == detected
            ? min(state.consecutivePendingSamples + 1, requiredChangeSamples)
            : 1
        guard pendingSamples >= requiredChangeSamples else {
            return LocalAIComposePoseFramingState(
                activeEdges: state.activeEdges,
                pendingEdges: detected,
                consecutivePendingSamples: pendingSamples,
                consecutiveClearSamples: 0
            )
        }
        return LocalAIComposePoseFramingState(
            activeEdges: detected,
            pendingEdges: [],
            consecutivePendingSamples: 0,
            consecutiveClearSamples: 0
        )
    }
}
