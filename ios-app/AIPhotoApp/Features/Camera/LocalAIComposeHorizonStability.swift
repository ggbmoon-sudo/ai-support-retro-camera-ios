import Foundation

nonisolated struct LocalAIComposeHorizonStabilityState: Equatable, Sendable {
    let activeAngleDegrees: Double?
    let pendingAngleDegrees: Double?
    let consistentPendingSamples: Int
    let missedSamples: Int

    static let initial = LocalAIComposeHorizonStabilityState(
        activeAngleDegrees: nil,
        pendingAngleDegrees: nil,
        consistentPendingSamples: 0,
        missedSamples: 0
    )

    var isNearLevel: Bool {
        guard let activeAngleDegrees else { return false }
        return abs(activeAngleDegrees) <= 1.5
    }
}

/// Stabilizes the optional Vision horizon without persisting raw observations or confidence.
nonisolated struct LocalAIComposeHorizonStabilityController: Sendable {
    private let activationSamples = 2
    private let pendingAgreementDegrees = 4.0
    private let activeContinuationDegrees = 8.0
    private let smoothingAlpha = 0.34
    private let maximumHeldMisses = 1

    func update(
        state: LocalAIComposeHorizonStabilityState,
        detectedAngleDegrees: Double?
    ) -> LocalAIComposeHorizonStabilityState {
        guard let detectedAngleDegrees,
              detectedAngleDegrees.isFinite,
              abs(detectedAngleDegrees) <= 25 else {
            return missingUpdate(from: state)
        }

        let detected = roundedHalfDegree(detectedAngleDegrees)
        if let activeAngle = state.activeAngleDegrees,
           abs(detected - activeAngle) <= activeContinuationDegrees {
            let smoothed = activeAngle + (detected - activeAngle) * smoothingAlpha
            return LocalAIComposeHorizonStabilityState(
                activeAngleDegrees: roundedHalfDegree(smoothed),
                pendingAngleDegrees: nil,
                consistentPendingSamples: 0,
                missedSamples: 0
            )
        }

        let pendingUpdate = updatedPending(
            existingAngle: state.pendingAngleDegrees,
            existingCount: state.consistentPendingSamples,
            detectedAngle: detected
        )
        if pendingUpdate.count >= activationSamples {
            return LocalAIComposeHorizonStabilityState(
                activeAngleDegrees: roundedHalfDegree(pendingUpdate.angle),
                pendingAngleDegrees: nil,
                consistentPendingSamples: 0,
                missedSamples: 0
            )
        }

        return LocalAIComposeHorizonStabilityState(
            activeAngleDegrees: state.activeAngleDegrees,
            pendingAngleDegrees: pendingUpdate.angle,
            consistentPendingSamples: pendingUpdate.count,
            missedSamples: 0
        )
    }

    private func updatedPending(
        existingAngle: Double?,
        existingCount: Int,
        detectedAngle: Double
    ) -> (angle: Double, count: Int) {
        guard let existingAngle,
              abs(detectedAngle - existingAngle) <= pendingAgreementDegrees else {
            return (detectedAngle, 1)
        }

        let nextCount = min(existingCount + 1, activationSamples)
        let blendedAngle = (existingAngle * Double(existingCount) + detectedAngle)
            / Double(max(nextCount, 1))
        return (roundedHalfDegree(blendedAngle), nextCount)
    }

    private func missingUpdate(
        from state: LocalAIComposeHorizonStabilityState
    ) -> LocalAIComposeHorizonStabilityState {
        guard let activeAngle = state.activeAngleDegrees else {
            return .initial
        }

        let missedSamples = state.missedSamples + 1
        if missedSamples <= maximumHeldMisses {
            return LocalAIComposeHorizonStabilityState(
                activeAngleDegrees: activeAngle,
                pendingAngleDegrees: nil,
                consistentPendingSamples: 0,
                missedSamples: missedSamples
            )
        }
        return .initial
    }

    private func roundedHalfDegree(_ value: Double) -> Double {
        (value * 2).rounded() / 2
    }
}
