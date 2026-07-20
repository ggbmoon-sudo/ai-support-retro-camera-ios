import Foundation

nonisolated enum LocalCameraAIWorkloadMode: String, Equatable, Sendable {
    case nominal
    case reduced
    case thermallyPaused
}

nonisolated struct LocalCameraAIWorkloadState: Equatable, Sendable {
    let mode: LocalCameraAIWorkloadMode
    let thermalRecoveryBeganAt: Date?

    static let initial = LocalCameraAIWorkloadState(
        mode: .nominal,
        thermalRecoveryBeganAt: nil
    )
}

nonisolated struct LocalCameraAIWorkloadProfile: Equatable, Sendable {
    let mode: LocalCameraAIWorkloadMode
    let fullAnalysisInterval: TimeInterval
    let lockedSubjectTrackingInterval: TimeInterval
    let runsVisionAnalysis: Bool
    let runsLockedSubjectTracking: Bool
}

/// Keeps preview and capture responsive by lowering optional local-AI work under
/// low-power/thermal pressure. Raw timing and OS state never cross into UI copy.
nonisolated struct LocalCameraAIWorkloadController: Sendable {
    private let thermalRecoveryDelay: TimeInterval = 5

    func update(
        state: LocalCameraAIWorkloadState,
        thermalState: ProcessInfo.ThermalState,
        isLowPowerModeEnabled: Bool,
        now: Date
    ) -> LocalCameraAIWorkloadState {
        let desiredMode = desiredMode(
            thermalState: thermalState,
            isLowPowerModeEnabled: isLowPowerModeEnabled
        )

        if desiredMode == .thermallyPaused {
            return LocalCameraAIWorkloadState(
                mode: .thermallyPaused,
                thermalRecoveryBeganAt: nil
            )
        }

        guard state.mode == .thermallyPaused else {
            return LocalCameraAIWorkloadState(
                mode: desiredMode,
                thermalRecoveryBeganAt: nil
            )
        }

        guard let recoveryBeganAt = state.thermalRecoveryBeganAt else {
            return LocalCameraAIWorkloadState(
                mode: .thermallyPaused,
                thermalRecoveryBeganAt: now
            )
        }
        guard now.timeIntervalSince(recoveryBeganAt) >= thermalRecoveryDelay else {
            return state
        }

        return LocalCameraAIWorkloadState(
            mode: desiredMode,
            thermalRecoveryBeganAt: nil
        )
    }

    func profile(
        for mode: LocalCameraAIWorkloadMode
    ) -> LocalCameraAIWorkloadProfile {
        switch mode {
        case .nominal:
            return LocalCameraAIWorkloadProfile(
                mode: mode,
                fullAnalysisInterval: 0.5,
                lockedSubjectTrackingInterval: 1.0 / 15.0,
                runsVisionAnalysis: true,
                runsLockedSubjectTracking: true
            )
        case .reduced:
            return LocalCameraAIWorkloadProfile(
                mode: mode,
                fullAnalysisInterval: 0.85,
                lockedSubjectTrackingInterval: 1.0 / 8.0,
                runsVisionAnalysis: true,
                runsLockedSubjectTracking: true
            )
        case .thermallyPaused:
            return LocalCameraAIWorkloadProfile(
                mode: mode,
                fullAnalysisInterval: 2.0,
                lockedSubjectTrackingInterval: 2.0,
                runsVisionAnalysis: false,
                runsLockedSubjectTracking: false
            )
        }
    }

    private func desiredMode(
        thermalState: ProcessInfo.ThermalState,
        isLowPowerModeEnabled: Bool
    ) -> LocalCameraAIWorkloadMode {
        switch thermalState {
        case .serious, .critical:
            return .thermallyPaused
        case .fair:
            return .reduced
        case .nominal:
            return isLowPowerModeEnabled ? .reduced : .nominal
        @unknown default:
            return .reduced
        }
    }
}
