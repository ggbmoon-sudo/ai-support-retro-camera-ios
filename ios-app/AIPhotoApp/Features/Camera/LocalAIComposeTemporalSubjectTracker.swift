import CoreGraphics
import Foundation

nonisolated struct LocalAIComposeTemporalTrackingState: Equatable, Sendable {
    let kind: LiveFrameSubjectCandidateKind
    let smoothedBox: LiveFrameNormalizedRect
    let velocity: LiveFramePoint
    let missedFrameCount: Int
}

nonisolated enum LocalAIComposeTemporalTrackingPhase: Equatable, Sendable {
    case confirmed
    case retained
    case lost
}

nonisolated struct LocalAIComposeTemporalTrackingUpdate: Equatable, Sendable {
    let state: LocalAIComposeTemporalTrackingState
    let candidate: LiveFrameSubjectCandidate?
    let phase: LocalAIComposeTemporalTrackingPhase
    let rejectedAsAmbiguous: Bool

    var hasFreshObservation: Bool {
        phase == .confirmed
    }
}

/// Keeps a user-selected subject stable across the throttled Vision samples used by AI Compose.
/// This is geometry-only matching. It does not identify, recognize, or persist a person or object.
nonisolated struct LocalAIComposeTemporalSubjectTracker: Sendable {
    private let ambiguityMargin: CGFloat = 0.12
    private let missesBeforeLost = 3
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
        let predictionScale: CGFloat = state.missedFrameCount == 0 ? 0.32 : 0
        let predictedBox = translated(
            state.smoothedBox,
            by: LiveFramePoint(
                x: state.velocity.x * predictionScale,
                y: state.velocity.y * predictionScale
            )
        )
        let viableMatches = candidates
            .filter { $0.kind == state.kind }
            .compactMap { scoredMatch(for: $0, predictedBox: predictedBox, state: state) }
            .sorted(by: isPreferredMatch)

        guard let bestMatch = viableMatches.first else {
            return missedUpdate(from: state, isAmbiguous: false)
        }

        if viableMatches.count > 1,
           viableMatches[1].score - bestMatch.score < ambiguityMargin {
            return missedUpdate(from: state, isAmbiguous: true)
        }

        let smoothingAlpha: CGFloat = state.missedFrameCount > 0 ? 0.40 : 0.28
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
            x: clamp(state.velocity.x * 0.52 + measuredVelocity.x * 0.48, minimum: -0.08, maximum: 0.08),
            y: clamp(state.velocity.y * 0.52 + measuredVelocity.y * 0.48, minimum: -0.08, maximum: 0.08)
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
            phase: .confirmed,
            rejectedAsAmbiguous: false
        )
    }

    func reconcilingFastTrackedBox(
        _ box: LiveFrameNormalizedRect,
        with state: LocalAIComposeTemporalTrackingState
    ) -> LocalAIComposeTemporalTrackingState {
        let measuredVelocity = LiveFramePoint(
            x: box.center.x - state.smoothedBox.center.x,
            y: box.center.y - state.smoothedBox.center.y
        )
        return LocalAIComposeTemporalTrackingState(
            kind: state.kind,
            smoothedBox: box,
            velocity: LiveFramePoint(
                x: clamp(
                    state.velocity.x * 0.35 + measuredVelocity.x * 0.65,
                    minimum: -0.06,
                    maximum: 0.06
                ),
                y: clamp(
                    state.velocity.y * 0.35 + measuredVelocity.y * 0.65,
                    minimum: -0.06,
                    maximum: 0.06
                )
            ),
            // Fast sequence tracking may improve display cadence, but only the
            // authoritative full detector is allowed to clear detector misses.
            missedFrameCount: state.missedFrameCount
        )
    }

    func requiresSequenceReseed(
        displayedBox: LiveFrameNormalizedRect,
        detectorBox: LiveFrameNormalizedRect
    ) -> Bool {
        let smallerArea = min(displayedBox.area, detectorBox.area)
        let largerArea = max(max(displayedBox.area, detectorBox.area), 0.0001)
        return distance(from: displayedBox.center, to: detectorBox.center) > 0.045
            || smallerArea / largerArea < 0.78
            || intersectionOverUnion(displayedBox, detectorBox) < 0.65
    }

    private func scoredMatch(
        for candidate: LiveFrameSubjectCandidate,
        predictedBox: LiveFrameNormalizedRect,
        state: LocalAIComposeTemporalTrackingState
    ) -> ScoredMatch? {
        let missedAllowance = min(CGFloat(state.missedFrameCount), 3) * 0.01
        let maximumCenterDistance = 0.18 + missedAllowance
        let closeCenterDistance = 0.095 + missedAllowance
        let centerDistance = distance(from: candidate.box.center, to: predictedBox.center)
        let overlap = intersectionOverUnion(candidate.box, predictedBox)
        let smallerArea = min(candidate.box.area, predictedBox.area)
        let largerArea = max(max(candidate.box.area, predictedBox.area), 0.0001)
        let areaRatio = smallerArea / largerArea

        guard centerDistance <= maximumCenterDistance,
              areaRatio >= 0.50,
              overlap >= 0.12 || centerDistance <= closeCenterDistance else {
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
        isAmbiguous: Bool
    ) -> LocalAIComposeTemporalTrackingUpdate {
        let missedFrameCount = min(
            state.missedFrameCount + 1,
            maximumRememberedMisses
        )
        let nextState = LocalAIComposeTemporalTrackingState(
            kind: state.kind,
            smoothedBox: state.smoothedBox,
            velocity: LiveFramePoint(
                x: state.velocity.x * 0.35,
                y: state.velocity.y * 0.35
            ),
            missedFrameCount: missedFrameCount
        )
        return LocalAIComposeTemporalTrackingUpdate(
            state: nextState,
            candidate: nil,
            phase: missedFrameCount >= missesBeforeLost ? .lost : .retained,
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
        return LiveFrameNormalizedRect(
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
                x: stabilizedValue(
                    from: start.x,
                    to: end.x,
                    alpha: alpha,
                    deadZone: 0.006
                ),
                y: stabilizedValue(
                    from: start.y,
                    to: end.y,
                    alpha: alpha,
                    deadZone: 0.006
                ),
                width: stabilizedValue(
                    from: start.width,
                    to: end.width,
                    alpha: alpha,
                    deadZone: 0.010
                ),
                height: stabilizedValue(
                    from: start.height,
                    to: end.height,
                    alpha: alpha,
                    deadZone: 0.010
                )
            )
        )
    }

    private func stabilizedValue(
        from start: CGFloat,
        to end: CGFloat,
        alpha: CGFloat,
        deadZone: CGFloat
    ) -> CGFloat {
        guard abs(end - start) > deadZone else { return start }
        return start + (end - start) * alpha
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
