import CoreGraphics
import CoreVideo
import Foundation
import ImageIO
import Vision

nonisolated struct LiveGuidanceVisionGeometryAnalyzer: Sendable {
    private let compositionAnalyzer = LiveVisionCompositionAnalyzer()

    func analysis(from pixelBuffer: CVPixelBuffer) -> LiveVisionGeometryAnalysis {
        let faceRequest = VNDetectFaceRectanglesRequest()
        let bodyPoseRequest = VNDetectHumanBodyPoseRequest()
        let handler = VNImageRequestHandler(
            cvPixelBuffer: pixelBuffer,
            orientation: .right,
            options: [:]
        )

        do {
            try handler.perform([faceRequest, bodyPoseRequest])
        } catch {
            return .empty
        }

        let faceBox = faceRequest.results?
            .map(\.boundingBox)
            .max(by: { area(of: $0) < area(of: $1) })
            .map(LiveFrameNormalizedRect.init)

        let bodyBox = bodyPoseRequest.results?
            .compactMap(bodyBoundingBox)
            .max(by: { $0.area < $1.area })

        guard let subjectBox = bodyBox ?? faceBox else {
            return .empty
        }

        return compositionAnalyzer.analysis(
            subjectBox: subjectBox,
            faceBox: faceBox,
            bodyBox: bodyBox
        )
    }

    func signals(from pixelBuffer: CVPixelBuffer) -> [LiveGuidanceSignal] {
        analysis(from: pixelBuffer).signals
    }

    private func bodyBoundingBox(from observation: VNHumanBodyPoseObservation) -> LiveFrameNormalizedRect? {
        guard let recognizedPoints = try? observation.recognizedPoints(.all) else {
            return nil
        }

        let points = recognizedPoints.values
            .filter { $0.confidence >= 0.2 }
            .map(\.location)

        guard !points.isEmpty else {
            return nil
        }

        let minX = points.map(\.x).min() ?? 0
        let maxX = points.map(\.x).max() ?? 0
        let minY = points.map(\.y).min() ?? 0
        let maxY = points.map(\.y).max() ?? 0

        return LiveFrameNormalizedRect(
            CGRect(
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            )
        )
    }

    private func area(of rect: CGRect) -> CGFloat {
        rect.width * rect.height
    }
}

nonisolated struct LiveVisionGeometryAnalysis: Equatable, Sendable {
    let liveFrameSignals: LiveFrameSignals?
    let signals: [LiveGuidanceSignal]

    static let empty = LiveVisionGeometryAnalysis(
        liveFrameSignals: nil,
        signals: []
    )
}

nonisolated struct LiveVisionCompositionAnalyzer: Sendable {
    private let centerTolerance: CGFloat = 0.18
    private let nearEdgeThreshold: CGFloat = 0.08
    private let lowHeadroomThreshold: CGFloat = 0.88
    private let lowFootroomThreshold: CGFloat = 0.08
    private let tooLargeAreaThreshold: CGFloat = 0.44
    private let tooSmallAreaThreshold: CGFloat = 0.04
    private let thirdsTolerance: CGFloat = 0.08

    func analysis(
        subjectBox: LiveFrameNormalizedRect,
        faceBox: LiveFrameNormalizedRect?,
        bodyBox: LiveFrameNormalizedRect?
    ) -> LiveVisionGeometryAnalysis {
        let geometry = geometrySignals(
            subjectBox: subjectBox,
            faceBox: faceBox,
            bodyBox: bodyBox
        )
        let composition = compositionSignals(from: geometry)
        let liveFrameSignals = LiveFrameSignals(
            geometry: geometry,
            composition: composition
        )

        return LiveVisionGeometryAnalysis(
            liveFrameSignals: liveFrameSignals,
            signals: guidanceSignals(from: geometry, composition: composition)
        )
    }

    private func geometrySignals(
        subjectBox: LiveFrameNormalizedRect,
        faceBox: LiveFrameNormalizedRect?,
        bodyBox: LiveFrameNormalizedRect?
    ) -> GeometrySignals {
        GeometrySignals(
            subjectPresent: true,
            subjectBoxNormalized: subjectBox,
            faceBoxNormalized: faceBox,
            bodyBoxNormalized: bodyBox,
            subjectCenter: subjectBox.center,
            edgeMarginBucket: edgeMarginBucket(for: subjectBox),
            headroomBucket: headroomBucket(for: faceBox ?? subjectBox),
            footroomBucket: footroomBucket(for: bodyBox ?? subjectBox),
            subjectSizeRatioBucket: subjectSizeRatioBucket(for: subjectBox),
            ruleOfThirdsBucket: ruleOfThirdsBucket(for: subjectBox.center),
            verticalBalanceBucket: verticalBalanceBucket(for: subjectBox)
        )
    }

    private func compositionSignals(from geometry: GeometrySignals) -> CompositionSignals {
        CompositionSignals(
            edgeCrowdingBucket: geometry.edgeMarginBucket,
            negativeSpaceBucket: negativeSpaceBucket(from: geometry.subjectSizeRatioBucket),
            subjectBalanceBucket: geometry.subjectCenter.map(subjectBalanceBucket) ?? .unknown,
            ruleOfThirdsBucket: geometry.ruleOfThirdsBucket,
            verticalBalanceBucket: geometry.verticalBalanceBucket
        )
    }

    private func guidanceSignals(
        from geometry: GeometrySignals,
        composition: CompositionSignals
    ) -> [LiveGuidanceSignal] {
        var signals: [LiveGuidanceSignal] = []

        if composition.edgeCrowdingBucket == .low {
            signals.append(.subjectNearEdge)
        } else if let center = geometry.subjectCenter,
                  abs(center.x - 0.5) > centerTolerance {
            signals.append(.subjectOffCenter)
        }

        if geometry.headroomBucket == .low {
            signals.append(.lowHeadroom)
        }

        switch geometry.subjectSizeRatioBucket {
        case .high:
            signals.append(.subjectTooLarge)
        case .low:
            signals.append(.subjectTooSmall)
        case .balanced where geometry.bodyBoxNormalized == nil && geometry.faceBoxNormalized != nil:
            signals.append(.portraitLikely)
        case .balanced, .unknown:
            break
        }

        if composition.ruleOfThirdsBucket == .balanced,
           signals.isEmpty {
            signals.append(.ruleOfThirdsAligned)
        } else if composition.verticalBalanceBucket == .balanced,
                  signals.isEmpty {
            signals.append(.verticalBalanceReady)
        }

        return unique(signals)
    }

    private func edgeMarginBucket(for box: LiveFrameNormalizedRect) -> LiveGeometryBucket {
        let margin = min(box.x, box.y, 1 - box.x - box.width, 1 - box.y - box.height)
        return margin < nearEdgeThreshold ? .low : .balanced
    }

    private func headroomBucket(for box: LiveFrameNormalizedRect) -> LiveGeometryBucket {
        box.y + box.height > lowHeadroomThreshold ? .low : .balanced
    }

    private func footroomBucket(for box: LiveFrameNormalizedRect) -> LiveGeometryBucket {
        box.y < lowFootroomThreshold ? .low : .balanced
    }

    private func subjectSizeRatioBucket(for box: LiveFrameNormalizedRect) -> LiveGeometryBucket {
        if box.area > tooLargeAreaThreshold {
            return .high
        }

        if box.area < tooSmallAreaThreshold {
            return .low
        }

        return .balanced
    }

    private func ruleOfThirdsBucket(for point: LiveFramePoint) -> LiveGeometryBucket {
        let thirds: [CGFloat] = [1.0 / 3.0, 2.0 / 3.0]
        let xDistance = thirds.map { abs(point.x - $0) }.min() ?? 1
        let yDistance = thirds.map { abs(point.y - $0) }.min() ?? 1
        return min(xDistance, yDistance) <= thirdsTolerance ? .balanced : .unknown
    }

    private func verticalBalanceBucket(for box: LiveFrameNormalizedRect) -> LiveGeometryBucket {
        let topMargin = 1 - box.y - box.height
        let bottomMargin = box.y
        return abs(topMargin - bottomMargin) <= 0.28 ? .balanced : .unknown
    }

    private func negativeSpaceBucket(from subjectSizeBucket: LiveGeometryBucket) -> LiveGeometryBucket {
        switch subjectSizeBucket {
        case .low:
            return .high
        case .high:
            return .low
        case .balanced:
            return .balanced
        case .unknown:
            return .unknown
        }
    }

    private func subjectBalanceBucket(for point: LiveFramePoint) -> LiveGeometryBucket {
        abs(point.x - 0.5) <= centerTolerance ? .balanced : .low
    }

    private func unique(_ signals: [LiveGuidanceSignal]) -> [LiveGuidanceSignal] {
        signals.reduce(into: []) { result, signal in
            guard !result.contains(signal) else { return }
            result.append(signal)
        }
    }
}

