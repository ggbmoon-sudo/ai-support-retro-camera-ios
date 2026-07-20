import CoreGraphics
import Foundation

nonisolated struct LocalAIComposeGroupStabilityState: Equatable, Sendable {
    let candidateBox: LiveFrameNormalizedRect?
    let consecutiveObservedSamples: Int
    let consecutiveClearSamples: Int
    let activeBox: LiveFrameNormalizedRect?

    static let initial = LocalAIComposeGroupStabilityState(
        candidateBox: nil,
        consecutiveObservedSamples: 0,
        consecutiveClearSamples: 0,
        activeBox: nil
    )
}

nonisolated struct LocalAIComposeGroupStabilityUpdate: Equatable, Sendable {
    let state: LocalAIComposeGroupStabilityState
    let didChangeActiveGroup: Bool
    let hasFreshActiveObservation: Bool
}

/// Stabilizes the union of two to four plausible local subject rectangles.
/// The rectangles are geometry only; the controller does not decide identity,
/// relationship, social grouping, importance, or photographic quality.
nonisolated struct LocalAIComposeGroupStabilityController: Sendable {
    private let requiredSamples = 2

    func update(
        state: LocalAIComposeGroupStabilityState,
        memberBoxes: [LiveFrameNormalizedRect]
    ) -> LocalAIComposeGroupStabilityUpdate {
        let observedBox = groupBox(from: memberBoxes)
        let nextState: LocalAIComposeGroupStabilityState
        let didReplaceActiveGroup: Bool
        let hasFreshActiveObservation: Bool

        if let activeBox = state.activeBox {
            if let observedBox,
               isCompatible(
                observedBox,
                with: activeBox,
                maximumCenterDistance: 0.20,
                minimumAreaRatio: 0.42
               ) {
                nextState = LocalAIComposeGroupStabilityState(
                    candidateBox: nil,
                    consecutiveObservedSamples: 0,
                    consecutiveClearSamples: 0,
                    activeBox: interpolated(from: activeBox, to: observedBox, alpha: 0.32)
                )
                didReplaceActiveGroup = false
                hasFreshActiveObservation = true
            } else if let observedBox {
                let matchesCandidate = state.candidateBox.map {
                    isCompatible(
                        observedBox,
                        with: $0,
                        maximumCenterDistance: 0.14,
                        minimumAreaRatio: 0.58
                    )
                } ?? false
                let observedSamples = matchesCandidate
                    ? min(state.consecutiveObservedSamples + 1, requiredSamples)
                    : 1
                let replacesActiveGroup = observedSamples >= requiredSamples
                nextState = LocalAIComposeGroupStabilityState(
                    candidateBox: replacesActiveGroup ? nil : observedBox,
                    consecutiveObservedSamples: replacesActiveGroup ? 0 : observedSamples,
                    consecutiveClearSamples: 0,
                    activeBox: replacesActiveGroup ? observedBox : activeBox
                )
                didReplaceActiveGroup = replacesActiveGroup
                hasFreshActiveObservation = replacesActiveGroup
            } else {
                let clearSamples = min(
                    state.consecutiveClearSamples + 1,
                    requiredSamples
                )
                nextState = LocalAIComposeGroupStabilityState(
                    candidateBox: nil,
                    consecutiveObservedSamples: 0,
                    consecutiveClearSamples: clearSamples >= requiredSamples ? 0 : clearSamples,
                    activeBox: clearSamples >= requiredSamples ? nil : activeBox
                )
                didReplaceActiveGroup = false
                hasFreshActiveObservation = false
            }
        } else if let observedBox {
            let matchesCandidate = state.candidateBox.map {
                isCompatible(
                    observedBox,
                    with: $0,
                    maximumCenterDistance: 0.14,
                    minimumAreaRatio: 0.58
                )
            } ?? false
            let observedSamples = matchesCandidate
                ? min(state.consecutiveObservedSamples + 1, requiredSamples)
                : 1
            nextState = LocalAIComposeGroupStabilityState(
                candidateBox: observedSamples >= requiredSamples ? nil : observedBox,
                consecutiveObservedSamples: observedSamples >= requiredSamples ? 0 : observedSamples,
                consecutiveClearSamples: 0,
                activeBox: observedSamples >= requiredSamples ? observedBox : nil
            )
            didReplaceActiveGroup = false
            hasFreshActiveObservation = observedSamples >= requiredSamples
        } else {
            nextState = .initial
            didReplaceActiveGroup = false
            hasFreshActiveObservation = false
        }

        return LocalAIComposeGroupStabilityUpdate(
            state: nextState,
            didChangeActiveGroup: didReplaceActiveGroup
                || (state.activeBox == nil) != (nextState.activeBox == nil),
            hasFreshActiveObservation: hasFreshActiveObservation
        )
    }

    private func groupBox(
        from memberBoxes: [LiveFrameNormalizedRect]
    ) -> LiveFrameNormalizedRect? {
        let boundedBoxes = Array(memberBoxes.prefix(4))
        guard boundedBoxes.count >= 2 else { return nil }

        let minX = boundedBoxes.map(\.x).min() ?? 0
        let minY = boundedBoxes.map(\.y).min() ?? 0
        let maxX = boundedBoxes.map { $0.x + $0.width }.max() ?? 1
        let maxY = boundedBoxes.map { $0.y + $0.height }.max() ?? 1
        let box = LiveFrameNormalizedRect(
            CGRect(
                x: minX,
                y: minY,
                width: max(maxX - minX, 0),
                height: max(maxY - minY, 0)
            )
        )
        guard (0.035...0.78).contains(box.area),
              box.width <= 0.94,
              box.height <= 0.94 else {
            return nil
        }
        return box
    }

    private func isCompatible(
        _ lhs: LiveFrameNormalizedRect,
        with rhs: LiveFrameNormalizedRect,
        maximumCenterDistance: CGFloat,
        minimumAreaRatio: CGFloat
    ) -> Bool {
        let deltaX = lhs.center.x - rhs.center.x
        let deltaY = lhs.center.y - rhs.center.y
        let centerDistance = (deltaX * deltaX + deltaY * deltaY).squareRoot()
        let areaRatio = min(lhs.area, rhs.area) / max(max(lhs.area, rhs.area), 0.0001)
        return centerDistance <= maximumCenterDistance
            && areaRatio >= minimumAreaRatio
    }

    private func interpolated(
        from start: LiveFrameNormalizedRect,
        to end: LiveFrameNormalizedRect,
        alpha: CGFloat
    ) -> LiveFrameNormalizedRect {
        LiveFrameNormalizedRect(
            CGRect(
                x: start.x + (end.x - start.x) * alpha,
                y: start.y + (end.y - start.y) * alpha,
                width: start.width + (end.width - start.width) * alpha,
                height: start.height + (end.height - start.height) * alpha
            )
        )
    }
}
