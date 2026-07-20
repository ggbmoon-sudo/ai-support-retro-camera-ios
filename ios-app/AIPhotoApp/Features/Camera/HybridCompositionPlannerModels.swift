import CoreGraphics
import Foundation

nonisolated struct HybridCompositionPlannerInput: Sendable {
    let imageData: Data
    let contentType: String
    let width: Int
    let height: Int
    let metadataStripped: Bool
    let locale: String
    let consent: CloudAIConsent
    let localContext: HybridCompositionLocalContext
}

nonisolated struct HybridCompositionLocalContext: Codable, Equatable, Sendable {
    let subjectKind: HybridCompositionSubjectKind
    let subjectCount: HybridCompositionSubjectCount
    let lensBucket: HybridCompositionLensBucket
    let focusHint: HybridCompositionFocusHint
}

/// The photographer's current intended-subject point in the exact displayed JPEG.
/// Coordinates are bounded integer permille with a top-left origin so the backend
/// never needs raw touch history or preview geometry.
nonisolated struct HybridCompositionFocusHint: Codable, Equatable, Sendable {
    let x: Int
    let y: Int

    init(displayPoint: LiveFramePoint) {
        x = Self.permille(displayPoint.x)
        y = Self.permille(1 - displayPoint.y)
    }

    private static func permille(_ value: CGFloat) -> Int {
        Int((min(1, max(0, value)) * 1_000).rounded())
    }
}

nonisolated enum HybridCompositionSubjectKind: String, Codable, Equatable, Sendable {
    case face
    case body
    case salientObject = "salient_object"

    var localCandidateKind: LiveFrameSubjectCandidateKind {
        switch self {
        case .face:
            return .face
        case .body:
            return .body
        case .salientObject:
            return .salientObject
        }
    }
}

nonisolated enum HybridCompositionSubjectCount: String, Codable, Equatable, Sendable {
    case single
    case multiple
}

nonisolated enum HybridCompositionLensBucket: String, Codable, Equatable, Sendable {
    case wide
    case standard
    case telephoto
}

nonisolated struct HybridCompositionPlannerRequest: Codable, Equatable, Sendable {
    let schemaVersion: String
    let feature: String
    let mode: String
    let locale: String
    let consent: CloudAIConsent
    let localContext: HybridCompositionLocalContext
    let image: CloudAIRequestImage

    init(input: HybridCompositionPlannerInput) {
        schemaVersion = "1.1"
        feature = "composition_planner"
        mode = "live_keyframe"
        locale = input.locale
        consent = input.consent
        localContext = input.localContext
        image = CloudAIRequestImage(
            contentType: input.contentType,
            width: input.width,
            height: input.height,
            metadataStripped: input.metadataStripped,
            dataBase64: input.imageData.base64EncodedString()
        )
    }
}

nonisolated struct HybridCompositionPlannerResponse: Codable, Equatable, Sendable {
    let schemaVersion: String
    let mode: String
    let plan: HybridCompositionPlan?
    let source: CloudAIResponseSource
    let safety: CloudAISafety
    let error: CloudAIError?
}

nonisolated struct HybridCompositionPlan: Codable, Equatable, Sendable {
    let schemaVersion: String
    let subjectKind: HybridCompositionSubjectKind
    let subjectBox: [Int]
    let sceneFamily: HybridCompositionSceneFamily
    let policy: HybridCompositionPolicy
    let targetHorizontal: HybridCompositionHorizontalSlot
    let targetVertical: HybridCompositionVerticalSlot
    let targetSize: HybridCompositionTargetSize
    let distanceAction: HybridCompositionDistanceAction
    let focalSuggestion: HybridCompositionFocalSuggestion
    let reasonCode: HybridCompositionReasonCode
    let confidence: CloudAIConfidence

    func hasSameStrategy(as other: HybridCompositionPlan) -> Bool {
        sceneFamily == other.sceneFamily
            && policy == other.policy
            && targetHorizontal == other.targetHorizontal
            && targetVertical == other.targetVertical
            && targetSize == other.targetSize
            && distanceAction == other.distanceAction
            && focalSuggestion == other.focalSuggestion
            && reasonCode == other.reasonCode
    }

    func groundedSubjectCandidate(
        isFrontCameraMirrored: Bool
    ) -> LiveFrameSubjectCandidate? {
        guard subjectBox.count == 4 else { return nil }
        let left = CGFloat(subjectBox[0]) / 1_000
        let top = CGFloat(subjectBox[1]) / 1_000
        let right = CGFloat(subjectBox[2]) / 1_000
        let bottom = CGFloat(subjectBox[3]) / 1_000
        guard left >= 0,
              top >= 0,
              right <= 1,
              bottom <= 1,
              right - left >= 0.025,
              bottom - top >= 0.025 else {
            return nil
        }

        let analysisX = isFrontCameraMirrored ? 1 - right : left
        let analysisBox = LiveFrameNormalizedRect(
            CGRect(
                x: analysisX,
                y: 1 - bottom,
                width: right - left,
                height: bottom - top
            )
        )
        guard analysisBox.area >= 0.004,
              analysisBox.area <= 0.92 else {
            return nil
        }

        return LiveFrameSubjectCandidate(
            box: analysisBox,
            kind: subjectKind.localCandidateKind
        )
    }

    var localPolicy: LocalAIComposePolicy {
        switch policy {
        case .thirds:
            return .thirds
        case .centered:
            return .centered
        case .symmetry:
            return .symmetry
        case .leadingLines:
            return .leadingLines
        case .negativeSpace:
            return .negativeSpace
        }
    }

    var targetArea: CGFloat {
        switch targetSize {
        case .small:
            return 0.10
        case .medium:
            return 0.20
        case .large:
            return 0.34
        }
    }

    func targetAnchor(isFrontCameraMirrored: Bool) -> LiveFramePoint {
        let displayX: CGFloat
        switch targetHorizontal {
        case .left:
            displayX = 1.0 / 3.0
        case .center:
            displayX = 0.5
        case .right:
            displayX = 2.0 / 3.0
        }

        let analysisX = isFrontCameraMirrored ? 1 - displayX : displayX
        let targetY: CGFloat
        switch targetVertical {
        case .upper:
            targetY = 2.0 / 3.0
        case .middle:
            targetY = 0.5
        case .lower:
            targetY = 1.0 / 3.0
        }
        return LiveFramePoint(x: analysisX, y: targetY)
    }
}

nonisolated enum HybridCompositionSceneFamily: String, Codable, Equatable, Sendable {
    case portrait
    case group
    case pet
    case food
    case architecture
    case landscape
    case street
    case object
    case abstract
    case unknown
}

nonisolated enum HybridCompositionPolicy: String, Codable, Equatable, Sendable {
    case thirds
    case centered
    case symmetry
    case leadingLines = "leading_lines"
    case negativeSpace = "negative_space"
}

nonisolated enum HybridCompositionHorizontalSlot: String, Codable, Equatable, Sendable {
    case left
    case center
    case right
}

nonisolated enum HybridCompositionVerticalSlot: String, Codable, Equatable, Sendable {
    case upper
    case middle
    case lower
}

nonisolated enum HybridCompositionTargetSize: String, Codable, Equatable, Sendable {
    case small
    case medium
    case large
}

nonisolated enum HybridCompositionDistanceAction: String, Codable, Equatable, Sendable {
    case closer
    case hold
    case back

    var titleKey: String {
        "camera.hybrid_compose.distance.\(rawValue)"
    }
}

nonisolated enum HybridCompositionFocalSuggestion: String, Codable, Equatable, Sendable {
    case wider
    case current
    case telephoto

    var titleKey: String {
        "camera.hybrid_compose.focal.\(rawValue)"
    }
}

nonisolated enum HybridCompositionReasonCode: String, Codable, Equatable, Sendable {
    case subjectEmphasis = "subject_emphasis"
    case balancedCenter = "balanced_center"
    case mirrorStructure = "mirror_structure"
    case leadingStructure = "leading_structure"
    case negativeSpace = "negative_space"
    case depthSeparation = "depth_separation"
    case retroIntent = "retro_intent"

    var titleKey: String {
        "camera.hybrid_compose.reason.\(rawValue)"
    }
}

nonisolated enum HybridCompositionPlannerState: Equatable, Sendable {
    case idle
    case consentRequired
    case preparingSnapshot
    case analyzing
    case applied(HybridCompositionPlan)
    case failed(messageKey: String)

    var isWorking: Bool {
        switch self {
        case .preparingSnapshot, .analyzing:
            return true
        case .idle, .consentRequired, .applied, .failed:
            return false
        }
    }
}
