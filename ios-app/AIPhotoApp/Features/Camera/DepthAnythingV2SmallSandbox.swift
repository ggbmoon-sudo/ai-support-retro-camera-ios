import Foundation

nonisolated enum DepthAnythingV2SmallInputSizeBucket: String, CaseIterable, Sendable {
    case shortSide256
    case shortSide384
    case modelNative518DebugOnly
}

nonisolated enum DepthAnythingV2SmallCadenceBucket: String, Sendable {
    case disabled
    case debugStillOnly
    case debugLowFrequency
}

nonisolated enum DepthAnythingV2SmallReadinessDecision: String, Sendable {
    case disabledByDefault
    case hardwareDepthPreferred
    case blockedByThermalState
    case blockedByLowPowerMode
    case modelArtifactMissing
    case debugBenchmarkReady
}

nonisolated struct DepthAnythingV2SmallSandboxConfiguration: Equatable, Sendable {
    let debugSandboxEnabled: Bool
    let inputSizeBucket: DepthAnythingV2SmallInputSizeBucket
    let cadenceBucket: DepthAnythingV2SmallCadenceBucket
    let hardwareDepthFirst: Bool
    let sanitizedMetricsOnly: Bool
    let allowRawFrameLogging: Bool
    let allowRawDepthLogging: Bool
    let allowPersistence: Bool
    let productionReady: Bool

    static let disabledDefault = DepthAnythingV2SmallSandboxConfiguration(
        debugSandboxEnabled: false,
        inputSizeBucket: .shortSide256,
        cadenceBucket: .disabled,
        hardwareDepthFirst: true,
        sanitizedMetricsOnly: true,
        allowRawFrameLogging: false,
        allowRawDepthLogging: false,
        allowPersistence: false,
        productionReady: false
    )

    static func debugBenchmark(
        inputSizeBucket: DepthAnythingV2SmallInputSizeBucket = .shortSide256,
        cadenceBucket: DepthAnythingV2SmallCadenceBucket = .debugStillOnly
    ) -> DepthAnythingV2SmallSandboxConfiguration {
        DepthAnythingV2SmallSandboxConfiguration(
            debugSandboxEnabled: true,
            inputSizeBucket: inputSizeBucket,
            cadenceBucket: cadenceBucket,
            hardwareDepthFirst: true,
            sanitizedMetricsOnly: true,
            allowRawFrameLogging: false,
            allowRawDepthLogging: false,
            allowPersistence: false,
            productionReady: false
        )
    }
}

nonisolated struct DepthAnythingV2SmallSandboxReadiness: Equatable, Sendable {
    let decision: DepthAnythingV2SmallReadinessDecision
    let blockerBuckets: [String]
    let warningBuckets: [String]
    let inputSizeBucket: DepthAnythingV2SmallInputSizeBucket
    let cadenceBucket: DepthAnythingV2SmallCadenceBucket
    let hardwareDepthFirst: Bool
    let modelArtifactPresent: Bool
    let rawFrameLoggingAllowed: Bool
    let rawDepthLoggingAllowed: Bool
    let persistenceAllowed: Bool
    let productionReady: Bool

    var canRunDebugBenchmark: Bool {
        decision == .debugBenchmarkReady && blockerBuckets.isEmpty
    }
}

nonisolated struct DepthAnythingV2SmallSanitizedBenchmarkSample: Equatable, Sendable {
    let inputSizeBucket: DepthAnythingV2SmallInputSizeBucket
    let modelLoadTimeBucket: LiveGeometryBucket
    let firstInferenceLatencyBucket: LiveGeometryBucket
    let warmedInferenceLatencyBucket: LiveGeometryBucket
    let peakMemoryBucket: LiveGeometryBucket
    let previewFpsImpactBucket: LiveGeometryBucket
    let thermalStateBucket: LiveGeometryBucket
    let batteryDrainBucket: LiveGeometryBucket
    let depthStabilityBucket: LiveGeometryBucket
    let invalidOutputRateBucket: LiveGeometryBucket
    let appSizeIncreaseBucket: LiveGeometryBucket
    let rawFrameLogged: Bool
    let rawDepthLogged: Bool
    let rawImagePersisted: Bool
    let rawDepthPersisted: Bool
    let productionReady: Bool

    static func empty(
        inputSizeBucket: DepthAnythingV2SmallInputSizeBucket
    ) -> DepthAnythingV2SmallSanitizedBenchmarkSample {
        DepthAnythingV2SmallSanitizedBenchmarkSample(
            inputSizeBucket: inputSizeBucket,
            modelLoadTimeBucket: .unknown,
            firstInferenceLatencyBucket: .unknown,
            warmedInferenceLatencyBucket: .unknown,
            peakMemoryBucket: .unknown,
            previewFpsImpactBucket: .unknown,
            thermalStateBucket: .unknown,
            batteryDrainBucket: .unknown,
            depthStabilityBucket: .unknown,
            invalidOutputRateBucket: .unknown,
            appSizeIncreaseBucket: .unknown,
            rawFrameLogged: false,
            rawDepthLogged: false,
            rawImagePersisted: false,
            rawDepthPersisted: false,
            productionReady: false
        )
    }
}

nonisolated struct DepthAnythingV2SmallSandbox: Sendable {
    private let bundledModelResourceName = "DepthAnythingV2Small"

    func readiness(
        cameraDepthCapability: CameraDepthCapability,
        configuration: DepthAnythingV2SmallSandboxConfiguration = .disabledDefault,
        thermalState: ProcessInfo.ThermalState = ProcessInfo.processInfo.thermalState,
        isLowPowerModeEnabled: Bool = ProcessInfo.processInfo.isLowPowerModeEnabled,
        modelArtifactPresent overrideModelArtifactPresent: Bool? = nil
    ) -> DepthAnythingV2SmallSandboxReadiness {
        let modelArtifactPresent = overrideModelArtifactPresent ?? bundledModelArtifactPresent()
        var blockers: [String] = []
        var warnings: [String] = []

        if !configuration.sanitizedMetricsOnly {
            blockers.append("blocked_for_unsanitized_metrics")
        }

        if configuration.allowRawFrameLogging {
            blockers.append("blocked_for_raw_frame_logging")
        }

        if configuration.allowRawDepthLogging {
            blockers.append("blocked_for_raw_depth_logging")
        }

        if configuration.allowPersistence {
            blockers.append("blocked_for_depth_or_frame_persistence")
        }

        if configuration.productionReady {
            blockers.append("blocked_for_production_ready_flag")
        }

        if configuration.hardwareDepthFirst,
           cameraDepthCapability.hardwareDepthAvailable || cameraDepthCapability.portraitMatteAvailable {
            warnings.append("hardware_depth_or_portrait_matte_available")
            return report(
                decision: .hardwareDepthPreferred,
                blockers: blockers,
                warnings: warnings,
                configuration: configuration,
                modelArtifactPresent: modelArtifactPresent
            )
        }

        guard configuration.debugSandboxEnabled else {
            blockers.append("blocked_for_debug_sandbox_disabled")
            return report(
                decision: .disabledByDefault,
                blockers: blockers,
                warnings: warnings,
                configuration: configuration,
                modelArtifactPresent: modelArtifactPresent
            )
        }

        if thermalState == .serious || thermalState == .critical {
            blockers.append("blocked_for_thermal_state")
            return report(
                decision: .blockedByThermalState,
                blockers: blockers,
                warnings: warnings,
                configuration: configuration,
                modelArtifactPresent: modelArtifactPresent
            )
        }

        if isLowPowerModeEnabled {
            blockers.append("blocked_for_low_power_mode")
            return report(
                decision: .blockedByLowPowerMode,
                blockers: blockers,
                warnings: warnings,
                configuration: configuration,
                modelArtifactPresent: modelArtifactPresent
            )
        }

        guard modelArtifactPresent else {
            blockers.append("blocked_for_missing_depth_anything_model_artifact")
            return report(
                decision: .modelArtifactMissing,
                blockers: blockers,
                warnings: warnings,
                configuration: configuration,
                modelArtifactPresent: false
            )
        }

        return report(
            decision: blockers.isEmpty ? .debugBenchmarkReady : .disabledByDefault,
            blockers: blockers,
            warnings: warnings,
            configuration: configuration,
            modelArtifactPresent: true
        )
    }

    func unavailableDepthSignals() -> DepthSignals {
        DepthSignals(
            depthState: .depthUnavailable,
            foregroundBackgroundSeparationBucket: .unknown,
            subjectDistanceBucket: .unknown,
            depthConfidenceBucket: .unknown
        )
    }

    func emptyBenchmarkSample(
        inputSizeBucket: DepthAnythingV2SmallInputSizeBucket = .shortSide256
    ) -> DepthAnythingV2SmallSanitizedBenchmarkSample {
        .empty(inputSizeBucket: inputSizeBucket)
    }

    private func bundledModelArtifactPresent() -> Bool {
        Bundle.main.url(
            forResource: bundledModelResourceName,
            withExtension: "mlmodelc"
        ) != nil
    }

    private func report(
        decision: DepthAnythingV2SmallReadinessDecision,
        blockers: [String],
        warnings: [String],
        configuration: DepthAnythingV2SmallSandboxConfiguration,
        modelArtifactPresent: Bool
    ) -> DepthAnythingV2SmallSandboxReadiness {
        DepthAnythingV2SmallSandboxReadiness(
            decision: decision,
            blockerBuckets: unique(blockers),
            warningBuckets: unique(warnings),
            inputSizeBucket: configuration.inputSizeBucket,
            cadenceBucket: configuration.cadenceBucket,
            hardwareDepthFirst: configuration.hardwareDepthFirst,
            modelArtifactPresent: modelArtifactPresent,
            rawFrameLoggingAllowed: configuration.allowRawFrameLogging,
            rawDepthLoggingAllowed: configuration.allowRawDepthLogging,
            persistenceAllowed: configuration.allowPersistence,
            productionReady: false
        )
    }

    private func unique(_ values: [String]) -> [String] {
        values.reduce(into: []) { result, value in
            guard !result.contains(value) else { return }
            result.append(value)
        }
    }
}
