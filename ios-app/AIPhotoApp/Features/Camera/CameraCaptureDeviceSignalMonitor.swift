import CoreMotion
import Foundation

struct CameraCaptureDeviceSignalSnapshot: Codable, Hashable {
    let level: CameraLevelContext
    let motion: CameraMotionContext

    static let unavailable = CameraCaptureDeviceSignalSnapshot(
        level: .unavailable,
        motion: .unavailable
    )
}

@MainActor
final class CameraCaptureDeviceSignalMonitor {
    private struct Sample {
        let timestamp: TimeInterval
        let rollDegrees: Double
        let pitchDegrees: Double
        let accelerationMagnitude: Double
    }

    private let motionManager = CMMotionManager()
    private var samples: [Sample] = []
    private let maxSamples = 36
    private let updateInterval: TimeInterval = 1.0 / 12.0
    private let maxSnapshotAge: TimeInterval = 2.0

    deinit {
        motionManager.stopDeviceMotionUpdates()
    }

    func start() {
        guard motionManager.isDeviceMotionAvailable else {
            samples.removeAll(keepingCapacity: false)
            return
        }

        guard !motionManager.isDeviceMotionActive else {
            return
        }

        samples.removeAll(keepingCapacity: true)
        motionManager.deviceMotionUpdateInterval = updateInterval
        motionManager.startDeviceMotionUpdates(to: .main) { [weak self] motion, _ in
            guard let motion else { return }
            Task { @MainActor [weak self] in
                self?.record(motion)
            }
        }
    }

    func stop() {
        motionManager.stopDeviceMotionUpdates()
        samples.removeAll(keepingCapacity: false)
    }

    func snapshot(captureWindowMs: Int = 700) -> CameraCaptureDeviceSignalSnapshot {
        guard !samples.isEmpty else {
            return .unavailable
        }

        let latestTimestamp = samples[samples.count - 1].timestamp
        guard ProcessInfo.processInfo.systemUptime - latestTimestamp <= maxSnapshotAge else {
            return .unavailable
        }

        let windowStart = latestTimestamp - Double(captureWindowMs) / 1000.0
        let windowSamples = samples.filter { $0.timestamp >= windowStart }
        let activeSamples = windowSamples.isEmpty ? samples : windowSamples

        guard let latest = activeSamples.last else {
            return .unavailable
        }

        let averageAcceleration = activeSamples
            .map(\.accelerationMagnitude)
            .reduce(0, +) / Double(activeSamples.count)
        let normalizedMotionScore = min(max(averageAcceleration / 0.18, 0), 1)

        return CameraCaptureDeviceSignalSnapshot(
            level: CameraLevelContext.rounded(
                rollDegrees: latest.rollDegrees,
                pitchDegrees: latest.pitchDegrees
            ),
            motion: CameraMotionContext.summary(
                score: normalizedMotionScore,
                captureWindowMs: captureWindowMs
            )
        )
    }

    private func record(_ motion: CMDeviceMotion) {
        let userAcceleration = motion.userAcceleration
        let magnitude = sqrt(
            userAcceleration.x * userAcceleration.x
                + userAcceleration.y * userAcceleration.y
                + userAcceleration.z * userAcceleration.z
        )
        let sample = Sample(
            timestamp: motion.timestamp,
            rollDegrees: motion.attitude.roll * 180 / Double.pi,
            pitchDegrees: motion.attitude.pitch * 180 / Double.pi,
            accelerationMagnitude: magnitude
        )

        samples.append(sample)
        if samples.count > maxSamples {
            samples.removeFirst(samples.count - maxSamples)
        }
    }
}
