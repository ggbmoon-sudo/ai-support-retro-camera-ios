import CoreGraphics
import Foundation

nonisolated struct LocalAIComposeTemporalTrackingState: Equatable, Sendable {
    let kind: LiveFrameSubjectCandidateKind
    let smoothedBox: LiveFrameNormalizedRect
    let velocity: LiveFramePoint
    let missedFrameCount: Int
}

nonisolated struct LocalAIComposeTemporalTrackingUpdate: Equatable, Sendable {
    let state: LocalAIComposeTemporalTrackingState
    let candidate: LiveFrameSubjectCandidate?
    let rejectedAsAmbiguous: Bool
}

/// Keeps a user-selected subject stable across the throttled Vision samples used by AI Compose.
/// This is geometry-only matching. It does not identify, recognize, or persist a person or object.
nonisolated struct LocalAIComposeTemporalSubjectTracker: Sendable {
    private let ambiguityMargin: CGFloat = 0.08
    private let maximumRememberedMisses = 6

    func initialState(
        for candidate: LiveFrameSubjectCandidate
    ) -> LocalAIComposeTemporalTrackingState {
        LocalAIComposeTemporalTrackingState(
            kind: candidate.kind,
            smoothedBox: candidate.box,
            velocity: LiveFramePoint(x: 0, y: 0),
            missedFrameCount: 0
        )
    }

    func update(
        state: LocalAIComposeTemporalTrackingState,
        candidates: [LiveFrameSubjectCandidate]
    ) -> LocalAIComposeTemporalTrackingUpdate {
        let predictedBox = translated(
            state.smoothedBox,
            by: state.velocity
        )
        let viableMatches = candidates
            .filter { $0.kind == state.kind }
            .compactMap { scoredMatch(for: $0, predictedBox: predictedBox, state: state) }
            .sorted(by: isPreferredMatch)

        guard let bestMatch = viableMatches.first else {
            return missedUpdate(from: state, predictedBox: predictedBox, isAmbiguous: false)
        }

        if viableMatches.count > 1,
           viableMatches[1].score - bestMatch.score < ambiguityMargin {
            return missedUpdate(from: state, predictedBox: predictedBox, isAmbiguous: true)
        }

        let smoothingAlpha: CGFloat = state.missedFrameCount > 0 ? 0.58 : 0.44
        let smoothedBox = interpolated(
            from: predictedBox,
            to: bestMatch.candidate.box,
            alpha: smoothingAlpha
        )
        let measuredVelocity = LiveFramePoint(
            x: bestMatch.candidate.box.center.x - state.smoothedBox.center.x,
            y: bestMatch.candidate.box.center.y - state.smoothedBox.center.y
        )
        let velocity = LiveFramePoint(
            x: clamp(state.velocity.x * 0.45 + measuredVelocity.x * 0.55, minimum: -0.14, maximum: 0.14),
            y: clamp(state.velocity.y * 0.45 + measuredVelocity.y * 0.55, minimum: -0.14, maximum: 0.14)
        )
        let nextState = LocalAIComposeTemporalTrackingState(
            kind: state.kind,
            smoothedBox: smoothedBox,
            velocity: velocity,
            missedFrameCount: 0
        )

        return LocalAIComposeTemporalTrackingUpdate(
            state: nextState,
            candidate: LiveFrameSubjectCandidate(
                box: smoothedBox,
                kind: state.kind,
                poseFramingSignal: bestMatch.candidate.poseFramingSignal
            ),
            rejectedAsAmbiguous: false
        )
    }

    private func scoredMatch(
        for candidate: LiveFrameSubjectCandidate,
        predictedBox: LiveFrameNormalizedRect,
        state: LocalAIComposeTemporalTrackingState
    ) -> ScoredMatch? {
        let missedAllowance = min(CGFloat(state.missedFrameCount), 4) * 0.03
        let maximumCenterDistance = 0.24 + missedAllowance
        let closeCenterDistance = 0.18 + missedAllowance
        let centerDistance = distance(from: candidate.box.center, to: predictedBox.center)
        let overlap = intersectionOverUnion(candidate.box, predictedBox)
        let smallerArea = min(candidate.box.area, predictedBox.area)
        let largerArea = max(max(candidate.box.area, predictedBox.area), 0.0001)
        let areaRatio = smallerArea / largerArea

        guard centerDistance <= maximumCenterDistance,
              areaRatio >= 0.34,
              overlap >= 0.015 || centerDistance <= closeCenterDistance else {
            return nil
        }

        let normalizedDistance = centerDistance / maximumCenterDistance
        let sizeDifference = 1 - areaRatio
        let score = normalizedDistance * 0.55
            + (1 - overlap) * 0.30
            + sizeDifference * 0.15
        return ScoredMatch(candidate: candidate, score: score)
    }

    private func missedUpdate(
        from state: LocalAIComposeTemporalTrackingState,
        predictedBox: LiveFrameNormalizedRect,
        isAmbiguous: Bool
    ) -> LocalAIComposeTemporalTrackingUpdate {
        let nextState = LocalAIComposeTemporalTrackingState(
            kind: state.kind,
            smoothedBox: predictedBox,
            velocity: LiveFramePoint(
                x: state.velocity.x * 0.55,
                y: state.velocity.y * 0.55
            ),
            missedFrameCount: min(state.missedFrameCount + 1, maximumRememberedMisses)
        )
        return LocalAIComposeTemporalTrackingUpdate(
            state: nextState,
            candidate: nil,
            rejectedAsAmbiguous: isAmbiguous
        )
    }

    private func isPreferredMatch(_ lhs: ScoredMatch, _ rhs: ScoredMatch) -> Bool {
        if lhs.score != rhs.score {
            return lhs.score < rhs.score
        }
        if lhs.candidate.box.x != rhs.candidate.box.x {
            return lhs.candidate.box.x < rhs.candidate.box.x
        }
        if lhs.candidate.box.y != rhs.candidate.box.y {
            return lhs.candidate.box.y < rhs.candidate.box.y
        }
        return lhs.candidate.box.area < rhs.candidate.box.area
    }

    private func translated(
        _ box: LiveFrameNormalizedRect,
        by velocity: LiveFramePoint
    ) -> LiveFrameNormalizedRect {
        let maximumX = max(0, 1 - box.width)
        let maximumY = max(0, 1 - box.height)
        LiveFrameNormalizedRect(
            CGRect(
                x: clamp(box.x + velocity.x, minimum: 0, maximum: maximumX),
                y: clamp(box.y + velocity.y, minimum: 0, maximum: maximumY),
                width: box.width,
                height: box.height
            )
        )
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

    private func intersectionOverUnion(
        _ lhs: LiveFrameNormalizedRect,
        _ rhs: LiveFrameNormalizedRect
    ) -> CGFloat {
        let intersection = lhs.cgRect.intersection(rhs.cgRect)
        guard !intersection.isNull, !intersection.isEmpty else { return 0 }

        let intersectionArea = intersection.width * intersection.height
        let unionArea = lhs.area + rhs.area - intersectionArea
        return unionArea > 0 ? intersectionArea / unionArea : 0
    }

    private func distance(from lhs: LiveFramePoint, to rhs: LiveFramePoint) -> CGFloat {
        let deltaX = lhs.x - rhs.x
        let deltaY = lhs.y - rhs.y
        return (deltaX * deltaX + deltaY * deltaY).squareRoot()
    }

    private func clamp(_ value: CGFloat, minimum: CGFloat, maximum: CGFloat) -> CGFloat {
        min(maximum, max(minimum, value))
    }

    private struct ScoredMatch {
        let candidate: LiveFrameSubjectCandidate
        let score: CGFloat
    }
}
