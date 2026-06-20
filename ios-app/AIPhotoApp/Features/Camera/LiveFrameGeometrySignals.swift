import CoreGraphics
import Foundation

nonisolated enum LiveGeometryBucket: String, Sendable {
    case low
    case balanced
    case high
    case unknown
}

nonisolated enum LiveFrameDepthState: String, Sendable {
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

nonisolated struct AdvisorHintCandidate: Equatable, Sendable {
    let observationKey: String
    let moodKey: String
    let retroIntentKey: String
    let optionalActionKey: String?
    let priorityBucket: LiveGeometryBucket
    let showHint: Bool
}

