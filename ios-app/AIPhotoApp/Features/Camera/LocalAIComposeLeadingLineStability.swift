import CoreGraphics
import Foundation

nonisolated struct LocalAIComposeLeadingLineStabilityState: Equatable, Sendable {
    let candidatePoint: LiveFramePoint?
    let consecutiveObservedSamples: Int
    let consecutiveClearSamples: Int
    let activePoint: LiveFramePoint?

    static let initial = LocalAIComposeLeadingLineStabilityState(
        candidatePoint: nil,
        consecutiveObservedSamples: 0,
        consecutiveClearSamples: 0,
        activePoint: nil
    )
}

nonisolated struct LocalAIComposeLeadingLineStabilityUpdate: Equatable, Sendable {
    let state: LocalAIComposeLeadingLineStabilityState
    let didChangeActivePoint: Bool
}

/// Requires two nearby full-analysis observations before exposing or replacing
/// a convergence target, and two clear samples before removing it.
nonisolated struct LocalAIComposeLeadingLineStabilityController: Sendable {
    private let requiredSamples = 2
    private let candidateMatchDistance: CGFloat = 0.14
    private let activeContinuationDistance: CGFloat = 0.18

    func update(
        state: LocalAIComposeLeadingLineStabilityState,
        signal: LiveFrameLeadingLineSignal
    ) -> LocalAIComposeLeadingLineStabilityUpdate {
        let nextState: LocalAIComposeLeadingLineStabilityState
        switch (signal.evidence, signal.convergencePoint) {
        case let (.observed, point?):
            nextState = observedState(from: state, point: point)
        case (.observed, nil), (.notObserved, _), (.unavailable, _):
            let clearSamples = min(
                state.consecutiveClearSamples + 1,
                requiredSamples
            )
            nextState = LocalAIComposeLeadingLineStabilityState(
                candidatePoint: nil,
                consecutiveObservedSamples: 0,
                consecutiveClearSamples: clearSamples,
                activePoint: clearSamples >= requiredSamples ? nil : state.activePoint
            )
        }

        return LocalAIComposeLeadingLineStabilityUpdate(
            state: nextState,
            didChangeActivePoint: pointsDiffer(
                state.activePoint,
                nextState.activePoint
            )
        )
    }

    private func observedState(
        from state: LocalAIComposeLeadingLineStabilityState,
        point: LiveFramePoint
    ) -> LocalAIComposeLeadingLineStabilityState {
        if let activePoint = state.activePoint,
           distance(from: activePoint, to: point) <= activeContinuationDistance {
            return LocalAIComposeLeadingLineStabilityState(
                candidatePoint: nil,
                consecutiveObservedSamples: requiredSamples,
                consecutiveClearSamples: 0,
                activePoint: activePoint
            )
        }

        let matchesCandidate = state.candidatePoint.map {
            distance(from: $0, to: point) <= candidateMatchDistance
        } ?? false
        let observedSamples = matchesCandidate
            ? min(state.consecutiveObservedSamples + 1, requiredSamples)
            : 1
        let candidatePoint = matchesCandidate
            ? midpoint(state.candidatePoint ?? point, point)
            : point
        let resolvedActivePoint = observedSamples >= requiredSamples
            ? candidatePoint
            : state.activePoint

        return LocalAIComposeLeadingLineStabilityState(
            candidatePoint: observedSamples >= requiredSamples ? nil : candidatePoint,
            consecutiveObservedSamples: observedSamples,
            consecutiveClearSamples: 0,
            activePoint: resolvedActivePoint
        )
    }

    private func pointsDiffer(
        _ lhs: LiveFramePoint?,
        _ rhs: LiveFramePoint?
    ) -> Bool {
        switch (lhs, rhs) {
        case (nil, nil):
            return false
        case (nil, _), (_, nil):
            return true
        case let (lhs?, rhs?):
            return distance(from: lhs, to: rhs) > 0.001
        }
    }

    private func midpoint(
        _ lhs: LiveFramePoint,
        _ rhs: LiveFramePoint
    ) -> LiveFramePoint {
        LiveFramePoint(
            x: (lhs.x + rhs.x) / 2,
            y: (lhs.y + rhs.y) / 2
        )
    }

    private func distance(
        from lhs: LiveFramePoint,
        to rhs: LiveFramePoint
    ) -> CGFloat {
        let deltaX = lhs.x - rhs.x
        let deltaY = lhs.y - rhs.y
        return (deltaX * deltaX + deltaY * deltaY).squareRoot()
    }
}
