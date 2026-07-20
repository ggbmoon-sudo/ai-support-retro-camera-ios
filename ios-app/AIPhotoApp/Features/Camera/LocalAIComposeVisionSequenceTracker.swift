import CoreGraphics
import CoreVideo
import Foundation
import ImageIO
import Vision

nonisolated struct LocalAIComposeVisionTrackingSeed: Equatable, Sendable {
    let id: UUID
    let box: LiveFrameNormalizedRect
}

nonisolated enum LocalAIComposeVisionTrackingPhase: Equatable, Sendable {
    case tracked
    case lost
}

nonisolated struct LocalAIComposeVisionTrackingUpdate: Equatable, Sendable {
    let seedID: UUID
    let sequenceIndex: Int
    let phase: LocalAIComposeVisionTrackingPhase
    let box: LiveFrameNormalizedRect?
}

/// Fills the visual gap between the slower full-scene detections after a user locks a subject.
/// This tracks one temporary rectangle on the camera background queue; it does not identify,
/// recognize, label, log, upload, or persist the person/object inside that rectangle.
nonisolated final class LocalAIComposeVisionSequenceTracker {
    private let minimumAcceptedConfidence: VNConfidence = 0.55
    private let minimumAcceptedArea: CGFloat = 0.004
    private let maximumAcceptedArea: CGFloat = 0.92
    private let minimumAcceptedSide: CGFloat = 0.025
    private let coordinateTolerance: CGFloat = 0.08
    private let maximumCenterJump: CGFloat = 0.18
    private let minimumAreaRatio: CGFloat = 0.45
    private let missesBeforeLost = 3
    private let displaySmoothingAlpha: CGFloat = 0.34

    private var activeSeedID: UUID?
    private var inputObservation: VNDetectedObjectObservation?
    private var smoothedDisplayBox: LiveFrameNormalizedRect?
    private var consecutiveMisses = 0
    private var didReportLost = false
    private var emittedSequenceIndex = 0
    private var sequenceHandler = VNSequenceRequestHandler()

    var isActive: Bool {
        activeSeedID != nil
    }

    func update(
        seed: LocalAIComposeVisionTrackingSeed,
        pixelBuffer: CVPixelBuffer,
        orientation: CGImagePropertyOrientation
    ) -> LocalAIComposeVisionTrackingUpdate? {
        if activeSeedID != seed.id {
            begin(seed: seed)
        }

        guard let inputObservation else {
            return nil
        }

        let request = VNTrackObjectRequest(detectedObjectObservation: inputObservation)
        request.trackingLevel = .fast

        do {
            try sequenceHandler.perform(
                [request],
                on: pixelBuffer,
                orientation: orientation
            )
        } catch {
            return recordMiss(seedID: seed.id)
        }

        guard let observation = request.results?.first as? VNDetectedObjectObservation,
              observation.confidence >= minimumAcceptedConfidence,
              let trackedBox = acceptedBox(
                observation.boundingBox,
                previousBoundingBox: inputObservation.boundingBox
              ) else {
            return recordMiss(seedID: seed.id)
        }

        self.inputObservation = observation
        consecutiveMisses = 0
        didReportLost = false

        let displayBox = smoothed(
            from: smoothedDisplayBox ?? trackedBox,
            to: trackedBox,
            alpha: displaySmoothingAlpha
        )
        smoothedDisplayBox = displayBox
        emittedSequenceIndex += 1

        return LocalAIComposeVisionTrackingUpdate(
            seedID: seed.id,
            sequenceIndex: emittedSequenceIndex,
            phase: .tracked,
            box: displayBox
        )
    }

    func reset() {
        activeSeedID = nil
        inputObservation = nil
        smoothedDisplayBox = nil
        consecutiveMisses = 0
        didReportLost = false
        emittedSequenceIndex = 0
        sequenceHandler = VNSequenceRequestHandler()
    }

    private func begin(seed: LocalAIComposeVisionTrackingSeed) {
        activeSeedID = seed.id
        inputObservation = VNDetectedObjectObservation(boundingBox: seed.box.cgRect)
        smoothedDisplayBox = seed.box
        consecutiveMisses = 0
        didReportLost = false
        emittedSequenceIndex = 0
        sequenceHandler = VNSequenceRequestHandler()
    }

    private func acceptedBox(
        _ boundingBox: CGRect,
        previousBoundingBox: CGRect
    ) -> LiveFrameNormalizedRect? {
        guard boundingBox.minX.isFinite,
              boundingBox.minY.isFinite,
              boundingBox.maxX.isFinite,
              boundingBox.maxY.isFinite,
              boundingBox.width.isFinite,
              boundingBox.height.isFinite,
              boundingBox.minX >= -coordinateTolerance,
              boundingBox.minY >= -coordinateTolerance,
              boundingBox.maxX <= 1 + coordinateTolerance,
              boundingBox.maxY <= 1 + coordinateTolerance,
              boundingBox.width >= minimumAcceptedSide,
              boundingBox.height >= minimumAcceptedSide else {
            return nil
        }

        let box = LiveFrameNormalizedRect(boundingBox)
        let previousBox = LiveFrameNormalizedRect(previousBoundingBox)
        let smallerArea = min(box.area, previousBox.area)
        let largerArea = max(max(box.area, previousBox.area), 0.0001)

        guard box.area >= minimumAcceptedArea,
              box.area <= maximumAcceptedArea,
              smallerArea / largerArea >= minimumAreaRatio,
              centerDistance(from: box, to: previousBox) <= maximumCenterJump else {
            return nil
        }

        return box
    }

    private func recordMiss(
        seedID: UUID
    ) -> LocalAIComposeVisionTrackingUpdate? {
        consecutiveMisses += 1
        guard consecutiveMisses >= missesBeforeLost,
              !didReportLost else {
            return nil
        }

        didReportLost = true
        inputObservation = nil
        smoothedDisplayBox = nil
        emittedSequenceIndex += 1
        return LocalAIComposeVisionTrackingUpdate(
            seedID: seedID,
            sequenceIndex: emittedSequenceIndex,
            phase: .lost,
            box: nil
        )
    }

    private func smoothed(
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
                    deadZone: 0.004
                ),
                y: stabilizedValue(
                    from: start.y,
                    to: end.y,
                    alpha: alpha,
                    deadZone: 0.004
                ),
                width: stabilizedValue(
                    from: start.width,
                    to: end.width,
                    alpha: alpha,
                    deadZone: 0.008
                ),
                height: stabilizedValue(
                    from: start.height,
                    to: end.height,
                    alpha: alpha,
                    deadZone: 0.008
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

    private func centerDistance(
        from lhs: LiveFrameNormalizedRect,
        to rhs: LiveFrameNormalizedRect
    ) -> CGFloat {
        let deltaX = lhs.center.x - rhs.center.x
        let deltaY = lhs.center.y - rhs.center.y
        return (deltaX * deltaX + deltaY * deltaY).squareRoot()
    }
}
