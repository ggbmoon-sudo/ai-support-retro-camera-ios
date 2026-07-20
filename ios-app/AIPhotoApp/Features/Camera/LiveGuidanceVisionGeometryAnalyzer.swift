import CoreGraphics
import CoreVideo
import Foundation
import ImageIO
import Vision

nonisolated struct LiveGuidanceVisionGeometryAnalyzer: Sendable {
    private let compositionAnalyzer = LiveVisionCompositionAnalyzer()

    func analysis(
        from pixelBuffer: CVPixelBuffer,
        depthSignals: DepthSignals = .unavailable,
        includeSceneHorizon: Bool = false,
        pixelOrientation: CameraFramePixelOrientation = .sensorNativeLandscape
    ) -> LiveVisionGeometryAnalysis {
        let faceRequest = VNDetectFaceRectanglesRequest()
        let bodyPoseRequest = VNDetectHumanBodyPoseRequest()
        let handler = VNImageRequestHandler(
            cvPixelBuffer: pixelBuffer,
            orientation: pixelOrientation.imagePropertyOrientation,
            options: [:]
        )

        do {
            try handler.perform([faceRequest, bodyPoseRequest])
        } catch {
            return .empty
        }

        let faceBoxes = faceRequest.results?
            .map(\.boundingBox)
            .map(LiveFrameNormalizedRect.init)
            .sorted(by: { $0.area > $1.area }) ?? []

        let bodyDetections = bodyPoseRequest.results?
            .compactMap(bodyDetection)
            .sorted(by: { $0.box.area > $1.box.area }) ?? []
        let bodyBoxes = bodyDetections.map(\.box)
        let sceneHorizonSignal = includeSceneHorizon
            ? sceneHorizonSignal(using: handler)
            : nil

        let faceBox = faceBoxes.first
        let bodyBox = bodyBoxes.first
        let personCandidates = subjectCandidates(
            faceBoxes: faceBoxes,
            bodyDetections: bodyDetections
        )

        let salientObjectBoxes = personCandidates.isEmpty
            ? salientObjectBoundingBoxes(using: handler)
            : []
        let salientObjectBox = salientObjectBoxes.first
        let subjectCandidates = personCandidates.isEmpty
            ? salientObjectBoxes.map {
                LiveFrameSubjectCandidate(box: $0, kind: .salientObject)
            }
            : personCandidates

        guard let subjectBox = bodyBox ?? faceBox ?? salientObjectBox else {
            return LiveVisionGeometryAnalysis(
                liveFrameSignals: nil,
                signals: [],
                subjectCandidates: [],
                sceneHorizonSignal: sceneHorizonSignal
            )
        }

        return compositionAnalyzer.analysis(
            subjectBox: subjectBox,
            faceBox: faceBox,
            bodyBox: bodyBox,
            depthSignals: depthSignals,
            subjectCandidates: subjectCandidates,
            sceneHorizonSignal: sceneHorizonSignal
        )
    }

    func signals(
        from pixelBuffer: CVPixelBuffer,
        depthSignals: DepthSignals = .unavailable
    ) -> [LiveGuidanceSignal] {
        analysis(from: pixelBuffer, depthSignals: depthSignals).signals
    }

    private func bodyDetection(
        from observation: VNHumanBodyPoseObservation
    ) -> BodyDetection? {
        guard let recognizedPoints = try? observation.recognizedPoints(.all) else {
            return nil
        }

        let points = Array(recognizedPoints.values)
        guard let box = bodyBoundingBox(from: points) else { return nil }
        return BodyDetection(
            box: box,
            poseFramingSignal: poseFramingSignal(from: points)
        )
    }

    private func bodyBoundingBox(
        from recognizedPoints: [VNRecognizedPoint]
    ) -> LiveFrameNormalizedRect? {
        let points = recognizedPoints
            .filter { $0.confidence >= 0.35 }
            .map(\.location)

        guard points.count >= 4 else {
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

    private func poseFramingSignal(
        from recognizedPoints: [VNRecognizedPoint]
    ) -> LiveFramePoseFramingSignal? {
        let points = recognizedPoints
            .filter { $0.confidence >= 0.55 }
            .map(\.location)
        guard points.count >= 5 else { return nil }

        let edgeThreshold: CGFloat = 0.045
        var nearEdges: LiveFramePoseEdges = []
        if points.contains(where: { $0.x <= edgeThreshold }) {
            nearEdges.insert(.left)
        }
        if points.contains(where: { $0.x >= 1 - edgeThreshold }) {
            nearEdges.insert(.right)
        }
        if points.contains(where: { $0.y >= 1 - edgeThreshold }) {
            nearEdges.insert(.top)
        }
        if points.contains(where: { $0.y <= edgeThreshold }) {
            nearEdges.insert(.bottom)
        }

        guard !nearEdges.isEmpty else { return nil }
        return LiveFramePoseFramingSignal(nearEdges: nearEdges)
    }

    private func area(of rect: CGRect) -> CGFloat {
        rect.width * rect.height
    }

    private func subjectCandidates(
        faceBoxes: [LiveFrameNormalizedRect],
        bodyDetections: [BodyDetection]
    ) -> [LiveFrameSubjectCandidate] {
        let bodyBoxes = bodyDetections.map(\.box)
        var candidates = bodyDetections.prefix(6).map {
            LiveFrameSubjectCandidate(
                box: $0.box,
                kind: .body,
                poseFramingSignal: $0.poseFramingSignal
            )
        }

        let unpairedFaces = faceBoxes.filter { faceBox in
            !bodyBoxes.contains(where: { $0.contains(faceBox.center) })
        }
        candidates.append(contentsOf: unpairedFaces.prefix(6).map {
            LiveFrameSubjectCandidate(box: $0, kind: .face)
        })

        return Array(candidates.prefix(6))
    }

    private func salientObjectBoundingBoxes(
        using handler: VNImageRequestHandler
    ) -> [LiveFrameNormalizedRect] {
        let request = VNGenerateObjectnessBasedSaliencyImageRequest()

        do {
            try handler.perform([request])
        } catch {
            return []
        }

        let candidateBoxes = request.results?
            .first?
            .salientObjects?
            .filter { $0.confidence >= 0.2 }
            .map(\.boundingBox)
            .filter {
                let boxArea = area(of: $0)
                return boxArea >= 0.02 && boxArea <= 0.78
            } ?? []

        return candidateBoxes
            .map(LiveFrameNormalizedRect.init)
            .sorted(by: { $0.area > $1.area })
            .prefix(6)
            .map { $0 }
    }

    private struct BodyDetection {
        let box: LiveFrameNormalizedRect
        let poseFramingSignal: LiveFramePoseFramingSignal?
    }

    private func sceneHorizonSignal(
        using handler: VNImageRequestHandler
    ) -> LiveFrameSceneHorizonSignal? {
        let request = VNDetectHorizonRequest()

        do {
            try handler.perform([request])
        } catch {
            return nil
        }

        guard let observation = request.results?.first,
              observation.confidence >= 0.35 else {
            return nil
        }
        let angleDegrees = Double(observation.angle) * 180 / .pi
        guard angleDegrees.isFinite,
              abs(angleDegrees) <= 25 else {
            return nil
        }

        return LiveFrameSceneHorizonSignal(
            angleDegreesRounded: (angleDegrees * 2).rounded() / 2
        )
    }
}

nonisolated struct LiveVisionGeometryAnalysis: Equatable, Sendable {
    let liveFrameSignals: LiveFrameSignals?
    let signals: [LiveGuidanceSignal]
    let subjectCandidates: [LiveFrameSubjectCandidate]
    let sceneHorizonSignal: LiveFrameSceneHorizonSignal?

    static let empty = LiveVisionGeometryAnalysis(
        liveFrameSignals: nil,
        signals: [],
        subjectCandidates: [],
        sceneHorizonSignal: nil
    )

    func applyingDepthSignals(
        _ depthSignals: DepthSignals
    ) -> LiveVisionGeometryAnalysis {
        guard let liveFrameSignals else { return self }
        return LiveVisionGeometryAnalysis(
            liveFrameSignals: LiveFrameSignals(
                geometry: liveFrameSignals.geometry,
                depth: depthSignals,
                composition: liveFrameSignals.composition,
                safety: liveFrameSignals.safety,
                productionReady: false
            ),
            signals: signals,
            subjectCandidates: subjectCandidates,
            sceneHorizonSignal: sceneHorizonSignal
        )
    }
}

nonisolated struct LiveVisionCompositionAnalyzer: Sendable {
    private let centerTolerance: CGFloat = 0.22
    private let nearEdgeThreshold: CGFloat = 0.06
    private let lowHeadroomThreshold: CGFloat = 0.92
    private let lowFootroomThreshold: CGFloat = 0.05
    private let tooLargeAreaThreshold: CGFloat = 0.52
    private let tooSmallAreaThreshold: CGFloat = 0.03
    private let thirdsTolerance: CGFloat = 0.06

    func analysis(
        subjectBox: LiveFrameNormalizedRect,
        faceBox: LiveFrameNormalizedRect?,
        bodyBox: LiveFrameNormalizedRect?,
        depthSignals: DepthSignals = .unavailable,
        subjectCandidates: [LiveFrameSubjectCandidate] = [],
        sceneHorizonSignal: LiveFrameSceneHorizonSignal? = nil
    ) -> LiveVisionGeometryAnalysis {
        let geometry = geometrySignals(
            subjectBox: subjectBox,
            faceBox: faceBox,
            bodyBox: bodyBox
        )
        let composition = compositionSignals(from: geometry)
        let liveFrameSignals = LiveFrameSignals(
            geometry: geometry,
            depth: depthSignals,
            composition: composition
        )

        return LiveVisionGeometryAnalysis(
            liveFrameSignals: liveFrameSignals,
            signals: guidanceSignals(from: geometry, composition: composition),
            subjectCandidates: subjectCandidates,
            sceneHorizonSignal: sceneHorizonSignal
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
