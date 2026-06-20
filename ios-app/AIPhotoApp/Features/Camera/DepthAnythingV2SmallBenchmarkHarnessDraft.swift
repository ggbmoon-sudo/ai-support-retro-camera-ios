import Foundation

nonisolated enum DepthAnythingV2SmallBenchmarkMetricKey: String, CaseIterable, Sendable {
    case modelLoadTimeBucket
    case firstInferenceLatencyBucket
    case warmedInferenceLatencyBucket
    case peakMemoryBucket
    case previewFpsImpactBucket
    case thermalStateBucket
    case batteryDrainBucket
    case depthStabilityBucket
    case invalidOutputRateBucket
    case appSizeIncreaseBucket
}

nonisolated enum DepthAnythingV2SmallBenchmarkStopCondition: String, CaseIterable, Sendable {
    case thermalSeriousOrCritical
    case lowPowerModeEnabled
    case memoryWarning
    case previewFpsRegression
    case rawArtifactRisk
    case productionReadyTrue
}

nonisolated struct DepthAnythingV2SmallBenchmarkHarnessPlan: Equatable, Sendable {
    let schemaVersion: String
    let sourceArtifactBucket: String
    let localArtifactIgnored: Bool
    let xcodePhysicalDeviceRequired: Bool
    let simulatorAccepted: Bool
    let hardwareDepthFirst: Bool
    let inputSizeBuckets: [DepthAnythingV2SmallInputSizeBucket]
    let metricKeys: [DepthAnythingV2SmallBenchmarkMetricKey]
    let stopConditions: [DepthAnythingV2SmallBenchmarkStopCondition]
    let rawFrameLoggingAllowed: Bool
    let rawDepthLoggingAllowed: Bool
    let rawPathLoggingAllowed: Bool
    let persistenceAllowed: Bool
    let productionReady: Bool

    static let draft = DepthAnythingV2SmallBenchmarkHarnessPlan(
        schemaVersion: "depth_anything_v2_small_benchmark_harness_plan.v1",
        sourceArtifactBucket: "operator_verified_local_ignored_artifact_required",
        localArtifactIgnored: true,
        xcodePhysicalDeviceRequired: true,
        simulatorAccepted: false,
        hardwareDepthFirst: true,
        inputSizeBuckets: [.shortSide256, .shortSide384, .modelNative518DebugOnly],
        metricKeys: DepthAnythingV2SmallBenchmarkMetricKey.allCases,
        stopConditions: DepthAnythingV2SmallBenchmarkStopCondition.allCases,
        rawFrameLoggingAllowed: false,
        rawDepthLoggingAllowed: false,
        rawPathLoggingAllowed: false,
        persistenceAllowed: false,
        productionReady: false
    )
}

nonisolated struct DepthAnythingV2SmallBenchmarkHarnessReadiness: Equatable, Sendable {
    let plan: DepthAnythingV2SmallBenchmarkHarnessPlan
    let sandboxReadiness: DepthAnythingV2SmallSandboxReadiness
    let blockerBuckets: [String]
    let warningBuckets: [String]
    let networkCallsMade: Bool
    let modelCallsMade: Bool
    let benchmarkRun: Bool
    let productionReady: Bool

    var canDraftBenchmarkHarness: Bool {
        blockerBuckets.isEmpty && !networkCallsMade && !modelCallsMade && !benchmarkRun
    }
}

nonisolated struct DepthAnythingV2SmallBenchmarkHarnessDraft: Sendable {
    func readiness(
        sandboxReadiness: DepthAnythingV2SmallSandboxReadiness,
        plan: DepthAnythingV2SmallBenchmarkHarnessPlan = .draft
    ) -> DepthAnythingV2SmallBenchmarkHarnessReadiness {
        var blockers: [String] = []
        var warnings: [String] = []

        if !plan.localArtifactIgnored {
            blockers.append("blocked_for_non_ignored_model_artifact")
        }

        if !plan.xcodePhysicalDeviceRequired {
            blockers.append("blocked_for_missing_physical_device_requirement")
        }

        if plan.simulatorAccepted {
            blockers.append("blocked_for_simulator_only_benchmark")
        }

        if !plan.hardwareDepthFirst {
            blockers.append("blocked_for_missing_hardware_depth_first_policy")
        }

        if plan.inputSizeBuckets.isEmpty {
            blockers.append("blocked_for_missing_input_size_buckets")
        }

        if plan.metricKeys.count != DepthAnythingV2SmallBenchmarkMetricKey.allCases.count {
            blockers.append("blocked_for_missing_metric_buckets")
        }

        if plan.stopConditions.isEmpty {
            blockers.append("blocked_for_missing_stop_conditions")
        }

        if plan.rawFrameLoggingAllowed {
            blockers.append("blocked_for_raw_frame_logging")
        }

        if plan.rawDepthLoggingAllowed {
            blockers.append("blocked_for_raw_depth_logging")
        }

        if plan.rawPathLoggingAllowed {
            blockers.append("blocked_for_raw_path_logging")
        }

        if plan.persistenceAllowed {
            blockers.append("blocked_for_raw_artifact_persistence")
        }

        if plan.productionReady {
            blockers.append("blocked_for_production_ready_flag")
        }

        if sandboxReadiness.modelArtifactPresent {
            warnings.append("local_model_artifact_detected_but_not_executed")
        } else {
            warnings.append("local_model_artifact_missing")
        }

        return DepthAnythingV2SmallBenchmarkHarnessReadiness(
            plan: plan,
            sandboxReadiness: sandboxReadiness,
            blockerBuckets: unique(blockers),
            warningBuckets: unique(warnings + sandboxReadiness.warningBuckets),
            networkCallsMade: false,
            modelCallsMade: false,
            benchmarkRun: false,
            productionReady: false
        )
    }

    func emptySanitizedSample(
        inputSizeBucket: DepthAnythingV2SmallInputSizeBucket = .shortSide256
    ) -> DepthAnythingV2SmallSanitizedBenchmarkSample {
        DepthAnythingV2SmallSanitizedBenchmarkSample.empty(inputSizeBucket: inputSizeBucket)
    }

    private func unique(_ values: [String]) -> [String] {
        values.reduce(into: []) { result, value in
            guard !result.contains(value) else { return }
            result.append(value)
        }
    }
}
