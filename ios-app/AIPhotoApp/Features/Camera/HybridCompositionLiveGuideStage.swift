import Foundation

/// A one-way, session-scoped presentation state for the internal Live AI guide.
/// One cloud keyframe is confined to `analyzing`; every later stage uses the
/// frozen plan plus local tracking and never accepts a replacement target.
nonisolated enum HybridCompositionLiveGuideStage: String, Equatable, Sendable {
    case idle
    case analyzing
    case aiming
    case framing
    case ready
    case failed
}

/// Coarse, user-facing alignment feedback. It intentionally exposes neither
/// detector confidence nor a score.
nonisolated enum HybridCompositionAimFeedback: String, Equatable, Sendable {
    case seeking
    case near
    case holding
}

nonisolated struct HybridCompositionAimLockState: Equatable, Sendable {
    var alignedSampleCount: Int
    var feedback: HybridCompositionAimFeedback

    static let initial = HybridCompositionAimLockState(
        alignedSampleCount: 0,
        feedback: .seeking
    )
}

nonisolated struct HybridCompositionAimLockUpdate: Equatable, Sendable {
    let state: HybridCompositionAimLockState
    let progress: Double
    let didLock: Bool
}

/// Uses the fast Apple Vision sequence track only after GPT has frozen the
/// subject and target. A narrow display-space hit radius prevents premature
/// acceptance, while a short hold and near-zone hysteresis absorb tracker jitter.
nonisolated struct HybridCompositionAimLockController: Sendable {
    let requiredAlignedSamples: Int
    let alignedDisplayDistance: Double
    let nearDisplayDistance: Double
    let portraitHeightToWidthRatio: Double

    init(
        requiredAlignedSamples: Int = 5,
        alignedDisplayDistance: Double = 0.028,
        nearDisplayDistance: Double = 0.075,
        portraitHeightToWidthRatio: Double = 4.0 / 3.0
    ) {
        self.requiredAlignedSamples = max(1, requiredAlignedSamples)
        self.alignedDisplayDistance = alignedDisplayDistance
        self.nearDisplayDistance = nearDisplayDistance
        self.portraitHeightToWidthRatio = portraitHeightToWidthRatio
    }

    func update(
        state: HybridCompositionAimLockState,
        subjectCenter: LiveFramePoint?,
        targetAnchor: LiveFramePoint?,
        consumesFreshTrackingSample: Bool
    ) -> HybridCompositionAimLockUpdate {
        guard consumesFreshTrackingSample else {
            return HybridCompositionAimLockUpdate(
                state: state,
                progress: min(
                    1,
                    Double(state.alignedSampleCount) / Double(requiredAlignedSamples)
                ),
                didLock: false
            )
        }

        guard let subjectCenter,
              let targetAnchor else {
            let resetState = HybridCompositionAimLockState.initial
            return HybridCompositionAimLockUpdate(
                state: resetState,
                progress: 0,
                didLock: false
            )
        }

        let deltaX = Double(subjectCenter.x - targetAnchor.x)
        let deltaY = Double(subjectCenter.y - targetAnchor.y) * portraitHeightToWidthRatio
        let displayDistance = hypot(deltaX, deltaY)

        var nextState = state
        if displayDistance <= alignedDisplayDistance {
            nextState.alignedSampleCount = min(
                state.alignedSampleCount + 1,
                requiredAlignedSamples
            )
            nextState.feedback = .holding
        } else if displayDistance <= nearDisplayDistance {
            // A one-step decay keeps tiny Vision jitter from erasing the whole
            // hold, but the narrow hit radius still prevents an early lock.
            nextState.alignedSampleCount = max(0, state.alignedSampleCount - 1)
            nextState.feedback = .near
        } else {
            nextState = .initial
        }

        return HybridCompositionAimLockUpdate(
            state: nextState,
            progress: min(
                1,
                Double(nextState.alignedSampleCount) / Double(requiredAlignedSamples)
            ),
            didLock: nextState.alignedSampleCount >= requiredAlignedSamples
        )
    }
}
