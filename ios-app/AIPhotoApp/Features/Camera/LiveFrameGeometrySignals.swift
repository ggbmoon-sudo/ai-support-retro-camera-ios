import CoreGraphics
import Foundation

nonisolated enum LiveGeometryBucket: String, Sendable {
    case low
    case balanced
    case high
    case unknown
}

nonisolated enum LiveFrameDepthState: String, Sendable {
    case hardwareDepthAvailable
    case portraitMatteAvailable
    case depthUnavailable
}

nonisolated struct LiveFramePoint: Equatable, Sendable {
    let x: CGFloat
    let y: CGFloat
}

nonisolated struct LiveFrameNormalizedRect: Equatable, Sendable {
    let x: CGFloat
    let y: CGFloat
    let width: CGFloat
    let height: CGFloat

    var cgRect: CGRect {
        CGRect(x: x, y: y, width: width, height: height)
    }

    var center: LiveFramePoint {
        LiveFramePoint(x: x + width / 2, y: y + height / 2)
    }

    var area: CGFloat {
        width * height
    }

    func contains(_ point: LiveFramePoint) -> Bool {
        point.x >= x
            && point.x <= x + width
            && point.y >= y
            && point.y <= y + height
    }

    init(_ rect: CGRect) {
        let normalized = rect.standardized
        let clampedMinX = Self.clamp(normalized.minX)
        let clampedMinY = Self.clamp(normalized.minY)
        let clampedMaxX = Self.clamp(normalized.maxX)
        let clampedMaxY = Self.clamp(normalized.maxY)

        x = clampedMinX
        y = clampedMinY
        width = max(0, clampedMaxX - clampedMinX)
        height = max(0, clampedMaxY - clampedMinY)
    }

    private static func clamp(_ value: CGFloat) -> CGFloat {
        min(1, max(0, value))
    }
}

nonisolated enum LiveFrameSubjectCandidateKind: String, Equatable, Sendable {
    case face
    case body
    case salientObject
}

/// A bounded, nonnumeric summary of high-confidence body-pose points near preview edges.
/// Raw joints and confidence values never leave the background Vision analyzer.
nonisolated struct LiveFramePoseEdges: OptionSet, Equatable, Sendable {
    let rawValue: UInt8

    static let left = LiveFramePoseEdges(rawValue: 1 << 0)
    static let right = LiveFramePoseEdges(rawValue: 1 << 1)
    static let top = LiveFramePoseEdges(rawValue: 1 << 2)
    static let bottom = LiveFramePoseEdges(rawValue: 1 << 3)

    var mirroredHorizontally: LiveFramePoseEdges {
        var mirrored: LiveFramePoseEdges = []
        if contains(.left) { mirrored.insert(.right) }
        if contains(.right) { mirrored.insert(.left) }
        if contains(.top) { mirrored.insert(.top) }
        if contains(.bottom) { mirrored.insert(.bottom) }
        return mirrored
    }
}

nonisolated struct LiveFramePoseFramingSignal: Equatable, Sendable {
    let nearEdges: LiveFramePoseEdges
}

nonisolated struct LiveFrameSubjectCandidate: Equatable, Sendable {
    let box: LiveFrameNormalizedRect
    let kind: LiveFrameSubjectCandidateKind
    let poseFramingSignal: LiveFramePoseFramingSignal?

    init(
        box: LiveFrameNormalizedRect,
        kind: LiveFrameSubjectCandidateKind,
        poseFramingSignal: LiveFramePoseFramingSignal? = nil
    ) {
        self.box = box
        self.kind = kind
        self.poseFramingSignal = poseFramingSignal
    }
}

nonisolated struct LiveFrameSceneHorizonSignal: Equatable, Sendable {
    /// Rounded to half-degree steps and bounded by the Vision analyzer before crossing actors.
    let angleDegreesRounded: Double
}

nonisolated enum LiveFrameLeadingLineEvidence: String, Equatable, Sendable {
    case observed
    case notObserved
    case unavailable
}

nonisolated struct LiveFrameLeadingLineSignal: Equatable, Sendable {
    let evidence: LiveFrameLeadingLineEvidence
    let convergencePoint: LiveFramePoint?

    static let unavailable = LiveFrameLeadingLineSignal(
        evidence: .unavailable,
        convergencePoint: nil
    )
}

nonisolated enum LiveFrameHorizontalSide: String, Equatable, Sendable {
    case left
    case right
}

nonisolated enum LiveFrameQuietSpaceEvidence: String, Equatable, Sendable {
    case observed
    case notObserved
    case unavailable
}

nonisolated struct LiveFrameQuietSpaceSignal: Equatable, Sendable {
    let evidence: LiveFrameQuietSpaceEvidence
    let side: LiveFrameHorizontalSide?

    static let unavailable = LiveFrameQuietSpaceSignal(
        evidence: .unavailable,
        side: nil
    )
}

nonisolated struct LiveFrameLumaCompositionAnalysis: Equatable, Sendable {
    let leadingLineSignal: LiveFrameLeadingLineSignal
    let quietSpaceSignal: LiveFrameQuietSpaceSignal

    static let unavailable = LiveFrameLumaCompositionAnalysis(
        leadingLineSignal: .unavailable,
        quietSpaceSignal: .unavailable
    )
}

nonisolated enum LiveFrameSymmetryEvidence: String, Equatable, Sendable {
    case observed
    case notObserved
    case unavailable
}

nonisolated struct LiveFrameSceneStructureSignal: Equatable, Sendable {
    let symmetryEvidence: LiveFrameSymmetryEvidence
    let leadingLineSignal: LiveFrameLeadingLineSignal
    let quietSpaceSignal: LiveFrameQuietSpaceSignal
}

nonisolated struct GeometrySignals: Equatable, Sendable {
    let subjectPresent: Bool
    let subjectBoxNormalized: LiveFrameNormalizedRect?
    let faceBoxNormalized: LiveFrameNormalizedRect?
    let bodyBoxNormalized: LiveFrameNormalizedRect?
    let subjectCenter: LiveFramePoint?
    let edgeMarginBucket: LiveGeometryBucket
    let headroomBucket: LiveGeometryBucket
    let footroomBucket: LiveGeometryBucket
    let subjectSizeRatioBucket: LiveGeometryBucket
    let ruleOfThirdsBucket: LiveGeometryBucket
    let verticalBalanceBucket: LiveGeometryBucket

    static let unavailable = GeometrySignals(
        subjectPresent: false,
        subjectBoxNormalized: nil,
        faceBoxNormalized: nil,
        bodyBoxNormalized: nil,
        subjectCenter: nil,
        edgeMarginBucket: .unknown,
        headroomBucket: .unknown,
        footroomBucket: .unknown,
        subjectSizeRatioBucket: .unknown,
        ruleOfThirdsBucket: .unknown,
        verticalBalanceBucket: .unknown
    )
}

nonisolated struct DepthSignals: Equatable, Sendable {
    let depthState: LiveFrameDepthState
    let foregroundBackgroundSeparationBucket: LiveGeometryBucket
    let subjectDistanceBucket: LiveGeometryBucket
    let depthConfidenceBucket: LiveGeometryBucket

    static let unavailable = DepthSignals(
        depthState: .depthUnavailable,
        foregroundBackgroundSeparationBucket: .unknown,
        subjectDistanceBucket: .unknown,
        depthConfidenceBucket: .unknown
    )
}

/// A fixed, coarse, ephemeral foreground grid used only to cut AR guide lines
/// around hardware-depth-supported subject geometry. It contains no depth values.
nonisolated struct LiveFrameDepthOcclusionMask: Equatable, Sendable {
    static let columnCount = 18
    static let rowCount = 24
    static let maximumCellCount = columnCount * rowCount

    let occupiedCellIndices: [UInt16]

    init(occupiedCellIndices: [UInt16]) {
        self.occupiedCellIndices = Array(
            Set(
                occupiedCellIndices.filter {
                    Int($0) < Self.maximumCellCount
                }
            )
            .sorted()
            .prefix(Self.maximumCellCount)
        )
    }
}

nonisolated struct CompositionSignals: Equatable, Sendable {
    let edgeCrowdingBucket: LiveGeometryBucket
    let negativeSpaceBucket: LiveGeometryBucket
    let subjectBalanceBucket: LiveGeometryBucket
    let ruleOfThirdsBucket: LiveGeometryBucket
    let verticalBalanceBucket: LiveGeometryBucket
}

nonisolated struct SafetyFlags: Equatable, Sendable {
    let sensitiveInferenceBlocked: Bool
    let identityInferenceBlocked: Bool
    let scoreLanguageBlocked: Bool
    let rawOutputBlocked: Bool

    static let localGeometryOnly = SafetyFlags(
        sensitiveInferenceBlocked: true,
        identityInferenceBlocked: true,
        scoreLanguageBlocked: true,
        rawOutputBlocked: true
    )
}

nonisolated struct LiveFrameSignals: Equatable, Sendable {
    let schemaVersion: String
    let sourceFrameBucket: String
    let geometry: GeometrySignals
    let depth: DepthSignals
    let composition: CompositionSignals
    let safety: SafetyFlags
    let productionReady: Bool

    init(
        geometry: GeometrySignals,
        depth: DepthSignals = .unavailable,
        composition: CompositionSignals,
        safety: SafetyFlags = .localGeometryOnly,
        productionReady: Bool = false
    ) {
        schemaVersion = "live_frame_signals.v1"
        sourceFrameBucket = "ephemeral_preview"
        self.geometry = geometry
        self.depth = depth
        self.composition = composition
        self.safety = safety
        self.productionReady = productionReady
    }
}

nonisolated struct LiveGuidanceFrameAnalysis: Equatable, Sendable {
    let guidanceSignals: [LiveGuidanceSignal]
    let liveFrameSignals: LiveFrameSignals?
    let subjectCandidates: [LiveFrameSubjectCandidate]
    let sceneHorizonSignal: LiveFrameSceneHorizonSignal?
    let sceneStructureSignal: LiveFrameSceneStructureSignal?
    let workloadMode: LocalCameraAIWorkloadMode
    let depthOcclusionMask: LiveFrameDepthOcclusionMask?
}

nonisolated struct AdvisorHintCandidate: Equatable, Sendable {
    let observationKey: String
    let moodKey: String
    let retroIntentKey: String
    let optionalActionKey: String?
    let priorityBucket: LiveGeometryBucket
    let showHint: Bool
}
