import CoreGraphics
import Foundation

/// A coarse screen-space direction derived from a user-locked subject's local geometry.
/// It is not a speed, intent, identity, gaze, or semantic activity classification.
nonisolated enum LocalAIComposeSubjectMotionDirection: Equatable, Sendable {
    case left
    case right
}

nonisolated struct LocalAIComposeLeadRoomStabilityState: Equatable, Sendable {
    let candidateDirection: LocalAIComposeSubjectMotionDirection?
    let consecutiveObservedSamples: Int
    let consecutiveClearSamples: Int
    let activeDirection: LocalAIComposeSubjectMotionDirection?

    static let initial = LocalAIComposeLeadRoomStabilityState(
        candidateDirection: nil,
        consecutiveObservedSamples: 0,
        consecutiveClearSamples: 0,
        activeDirection: nil
    )
}

nonisolated struct LocalAIComposeLeadRoomStabilityUpdate: Equatable, Sendable {
    let state: LocalAIComposeLeadRoomStabilityState
    let didChangeActiveDirection: Bool
}

/// Requires two fresh, matching full-analysis samples before changing Lead Room.
/// A lower continuation threshold adds hysteresis while a direction is active.
nonisolated struct LocalAIComposeLeadRoomStabilityController: Sendable {
    private let requiredSamples = 2
    private let entryMagnitude: CGFloat = 0.018
    private let continuationMagnitude: CGFloat = 0.010

    func update(
        state: LocalAIComposeLeadRoomStabilityState,
        horizontalVelocity: CGFloat?
    ) -> LocalAIComposeLeadRoomStabilityUpdate {
        let entryDirection = direction(
            for: horizontalVelocity,
            minimumMagnitude: entryMagnitude
        )
        let continuationDirection = direction(
            for: horizontalVelocity,
            minimumMagnitude: continuationMagnitude
        )

        let nextState: LocalAIComposeLeadRoomStabilityState
        if let activeDirection = state.activeDirection {
            if continuationDirection == activeDirection {
                nextState = LocalAIComposeLeadRoomStabilityState(
                    candidateDirection: nil,
                    consecutiveObservedSamples: 0,
                    consecutiveClearSamples: 0,
                    activeDirection: activeDirection
                )
            } else if let entryDirection,
                      entryDirection != activeDirection {
                let observedSamples = entryDirection == state.candidateDirection
                    ? min(state.consecutiveObservedSamples + 1, requiredSamples)
                    : 1
                nextState = LocalAIComposeLeadRoomStabilityState(
                    candidateDirection: observedSamples >= requiredSamples ? nil : entryDirection,
                    consecutiveObservedSamples: observedSamples >= requiredSamples ? 0 : observedSamples,
                    consecutiveClearSamples: 0,
                    activeDirection: observedSamples >= requiredSamples
                        ? entryDirection
                        : activeDirection
                )
            } else {
                let clearSamples = min(
                    state.consecutiveClearSamples + 1,
                    requiredSamples
                )
                nextState = LocalAIComposeLeadRoomStabilityState(
                    candidateDirection: nil,
                    consecutiveObservedSamples: 0,
                    consecutiveClearSamples: clearSamples >= requiredSamples ? 0 : clearSamples,
                    activeDirection: clearSamples >= requiredSamples ? nil : activeDirection
                )
            }
        } else if let entryDirection {
            let observedSamples = entryDirection == state.candidateDirection
                ? min(state.consecutiveObservedSamples + 1, requiredSamples)
                : 1
            nextState = LocalAIComposeLeadRoomStabilityState(
                candidateDirection: observedSamples >= requiredSamples ? nil : entryDirection,
                consecutiveObservedSamples: observedSamples >= requiredSamples ? 0 : observedSamples,
                consecutiveClearSamples: 0,
                activeDirection: observedSamples >= requiredSamples ? entryDirection : nil
            )
        } else {
            nextState = .initial
        }

        return LocalAIComposeLeadRoomStabilityUpdate(
            state: nextState,
            didChangeActiveDirection: nextState.activeDirection != state.activeDirection
        )
    }

    private func direction(
        for horizontalVelocity: CGFloat?,
        minimumMagnitude: CGFloat
    ) -> LocalAIComposeSubjectMotionDirection? {
        guard let horizontalVelocity,
              abs(horizontalVelocity) >= minimumMagnitude else {
            return nil
        }
        return horizontalVelocity < 0 ? .left : .right
    }
}
