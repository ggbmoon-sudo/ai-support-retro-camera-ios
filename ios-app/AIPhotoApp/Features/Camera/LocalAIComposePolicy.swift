import CoreGraphics
import Foundation

nonisolated enum LocalAIComposePolicy: String, CaseIterable, Identifiable, Equatable, Sendable {
    case thirds
    case centered
    case symmetry
    case leadingLines
    case leadRoom
    case groupBalance
    case negativeSpace

    var id: String { rawValue }

    var titleKey: String {
        switch self {
        case .thirds:
            return "camera.ai_compose.policy.thirds"
        case .centered:
            return "camera.ai_compose.policy.centered"
        case .symmetry:
            return "camera.ai_compose.policy.symmetry"
        case .leadingLines:
            return "camera.ai_compose.policy.leading_lines"
        case .leadRoom:
            return "camera.ai_compose.policy.lead_room"
        case .groupBalance:
            return "camera.ai_compose.policy.group_balance"
        case .negativeSpace:
            return "camera.ai_compose.policy.negative_space"
        }
    }

    var systemImage: String {
        switch self {
        case .thirds:
            return "square.grid.3x3"
        case .centered:
            return "scope"
        case .symmetry:
            return "rectangle.split.2x1"
        case .leadingLines:
            return "arrow.up.forward"
        case .leadRoom:
            return "arrow.left.and.right"
        case .groupBalance:
            return "person.3"
        case .negativeSpace:
            return "rectangle.split.3x1"
        }
    }

    var supportsHorizontalTargetFlip: Bool {
        self == .thirds || self == .leadRoom || self == .negativeSpace
    }
}

nonisolated enum LocalAIComposePolicyPreference: Equatable, Sendable {
    case automatic
    case fixed(LocalAIComposePolicy)

    var titleKey: String {
        switch self {
        case .automatic:
            return "camera.ai_compose.policy.automatic"
        case let .fixed(policy):
            return policy.titleKey
        }
    }

    var systemImage: String {
        switch self {
        case .automatic:
            return "wand.and.stars"
        case let .fixed(policy):
            return policy.systemImage
        }
    }
}

nonisolated struct LocalAIComposeSubjectContext: Equatable, Sendable {
    let box: LiveFrameNormalizedRect
    let kind: LiveFrameSubjectCandidateKind
    let poseFramingSignal: LiveFramePoseFramingSignal?
}

/// Chooses a bounded, explainable composition family from ephemeral local geometry.
/// It does not classify identity, scene meaning, attractiveness, or photographic quality.
nonisolated struct LocalAIComposePolicyResolver: Sendable {
    func subjectContext(
        frameSignals: LiveFrameSignals?,
        subjectCandidates: [LiveFrameSubjectCandidate],
        selectedCandidate: LiveFrameSubjectCandidate?,
        isSubjectLocked: Bool
    ) -> LocalAIComposeSubjectContext? {
        if isSubjectLocked {
            guard let selectedCandidate else { return nil }
            return LocalAIComposeSubjectContext(
                box: selectedCandidate.box,
                kind: selectedCandidate.kind,
                poseFramingSignal: selectedCandidate.poseFramingSignal
            )
        }

        guard let frameSignals,
              let subjectBox = frameSignals.geometry.subjectBoxNormalized else {
            return nil
        }
        let kind = inferredSubjectKind(from: frameSignals.geometry)
        return LocalAIComposeSubjectContext(
            box: subjectBox,
            kind: kind,
            poseFramingSignal: subjectCandidates.first(where: { $0.kind == kind })?.poseFramingSignal
        )
    }

    func hasMultiplePlausibleSubjects(
        _ candidates: [LiveFrameSubjectCandidate]
    ) -> Bool {
        selectionCandidates(in: candidates).count > 1
    }

    func selectionCandidates(
        in candidates: [LiveFrameSubjectCandidate]
    ) -> [LiveFrameSubjectCandidate] {
        Array(
            candidates
                .filter { $0.box.area >= 0.012 }
                .sorted(by: { $0.box.area > $1.box.area })
                .prefix(4)
        )
    }

    func selectionCandidateBoxes(
        in candidates: [LiveFrameSubjectCandidate]
    ) -> [LiveFrameNormalizedRect] {
        selectionCandidates(in: candidates)
            .map(\.box)
    }

    func groupSubjectContext(
        activeGroupBox: LiveFrameNormalizedRect?
    ) -> LocalAIComposeSubjectContext? {
        guard let activeGroupBox else { return nil }
        return LocalAIComposeSubjectContext(
            box: activeGroupBox,
            kind: .body,
            poseFramingSignal: nil
        )
    }

    func recommendedPolicy(
        for context: LocalAIComposeSubjectContext,
        favorsSymmetry: Bool = false,
        leadingLinePoint: LiveFramePoint? = nil,
        subjectMotionDirection: LocalAIComposeSubjectMotionDirection? = nil,
        quietSpaceSide: LiveFrameHorizontalSide? = nil
    ) -> LocalAIComposePolicy {
        let center = context.box.center
        let horizontalCenterDistance = abs(center.x - 0.5)
        let verticalCenterDistance = abs(center.y - 0.5)
        let safeHeight = max(context.box.height, 0.01)
        let aspectRatio = context.box.width / safeHeight

        if let leadingLinePoint,
           squaredDistance(from: center, to: leadingLinePoint) <= 0.26 * 0.26,
           (0.025...0.55).contains(context.box.area) {
            return .leadingLines
        }

        if let subjectMotionDirection,
           (0.025...0.32).contains(context.box.area) {
            let leadRoomTargetX: CGFloat = subjectMotionDirection == .right
                ? CGFloat(1.0 / 3.0)
                : CGFloat(2.0 / 3.0)
            if abs(center.x - leadRoomTargetX) <= 0.32 {
                return .leadRoom
            }
        }

        if let quietSpaceSide,
           (0.020...0.14).contains(context.box.area) {
            let negativeSpaceTargetX: CGFloat = quietSpaceSide == .left
                ? CGFloat(2.0 / 3.0)
                : CGFloat(1.0 / 3.0)
            if abs(center.x - negativeSpaceTargetX) <= 0.34 {
                return .negativeSpace
            }
        }

        if favorsSymmetry,
           horizontalCenterDistance <= 0.24,
           (0.035...0.62).contains(context.box.area) {
            return .symmetry
        }

        switch context.kind {
        case .face:
            if context.box.area >= 0.18,
               horizontalCenterDistance <= 0.16 {
                return .centered
            }
            return .thirds

        case .body:
            if context.box.area >= 0.34,
               horizontalCenterDistance <= 0.14 {
                return .centered
            }
            return .thirds

        case .salientObject:
            if context.box.area <= 0.10 {
                return .negativeSpace
            }

            if context.box.area >= 0.14,
               horizontalCenterDistance <= 0.15,
               verticalCenterDistance <= 0.18,
               (0.65...1.55).contains(aspectRatio) {
                return .centered
            }
            return .thirds
        }
    }

    func targetAnchor(
        for context: LocalAIComposeSubjectContext,
        policy: LocalAIComposePolicy,
        leadingLinePoint: LiveFramePoint? = nil,
        subjectMotionDirection: LocalAIComposeSubjectMotionDirection? = nil,
        quietSpaceSide: LiveFrameHorizontalSide? = nil,
        horizontallyFlipped: Bool = false
    ) -> LiveFramePoint {
        let leftThird = CGFloat(1.0 / 3.0)
        let rightThird = CGFloat(2.0 / 3.0)

        let anchor: LiveFramePoint
        switch policy {
        case .centered, .symmetry:
            anchor = LiveFramePoint(
                x: 0.5,
                y: context.kind == .face ? 0.58 : 0.5
            )

        case .leadingLines:
            anchor = leadingLinePoint ?? LiveFramePoint(x: 0.5, y: 0.5)

        case .leadRoom:
            let targetX: CGFloat
            switch subjectMotionDirection {
            case .left:
                targetX = rightThird
            case .right:
                targetX = leftThird
            case nil:
                targetX = context.box.center.x <= 0.5 ? leftThird : rightThird
            }
            let targetY = context.kind == .face
                ? rightThird
                : min(max(context.box.center.y, leftThird), rightThird)
            anchor = LiveFramePoint(x: targetX, y: targetY)

        case .groupBalance:
            anchor = LiveFramePoint(x: 0.5, y: 0.5)

        case .thirds:
            let targetX = context.box.center.x <= 0.5 ? leftThird : rightThird
            let targetY: CGFloat
            if context.kind == .face {
                targetY = rightThird
            } else {
                targetY = context.box.center.y <= 0.5 ? leftThird : rightThird
            }
            anchor = LiveFramePoint(x: targetX, y: targetY)

        case .negativeSpace:
            let targetX: CGFloat
            switch quietSpaceSide {
            case .left:
                targetX = rightThird
            case .right:
                targetX = leftThird
            case nil:
                targetX = context.box.center.x <= 0.5 ? leftThird : rightThird
            }
            let targetY: CGFloat
            if context.kind == .face {
                targetY = rightThird
            } else {
                targetY = context.box.center.y <= 0.5 ? leftThird : rightThird
            }
            anchor = LiveFramePoint(x: targetX, y: targetY)
        }

        guard horizontallyFlipped,
              policy.supportsHorizontalTargetFlip else {
            return anchor
        }
        return LiveFramePoint(x: 1 - anchor.x, y: anchor.y)
    }

    func targetBox(
        for context: LocalAIComposeSubjectContext,
        policy: LocalAIComposePolicy,
        centeredAt target: LiveFramePoint
    ) -> LiveFrameNormalizedRect {
        let safeHeight = max(context.box.height, 0.01)
        let aspectRatio = min(max(context.box.width / safeHeight, 0.28), 3.2)
        let desiredArea = desiredArea(for: context.kind, policy: policy)
        let minimumDimension: CGFloat
        let maximumWidth: CGFloat
        let maximumHeight: CGFloat
        switch policy {
        case .negativeSpace, .leadRoom:
            minimumDimension = 0.16
            maximumWidth = 0.72
            maximumHeight = 0.76
        case .groupBalance:
            minimumDimension = 0.26
            maximumWidth = 0.86
            maximumHeight = 0.84
        case .thirds, .centered, .symmetry, .leadingLines:
            minimumDimension = 0.20
            maximumWidth = 0.72
            maximumHeight = 0.76
        }
        let width = min(max(sqrt(desiredArea * aspectRatio), minimumDimension), maximumWidth)
        let height = min(max(sqrt(desiredArea / aspectRatio), minimumDimension), maximumHeight)
        let x = min(max(target.x - width / 2, 0), 1 - width)
        let y = min(max(target.y - height / 2, 0), 1 - height)

        return LiveFrameNormalizedRect(
            CGRect(x: x, y: y, width: width, height: height)
        )
    }

    private func inferredSubjectKind(
        from geometry: GeometrySignals
    ) -> LiveFrameSubjectCandidateKind {
        if geometry.bodyBoxNormalized != nil {
            return .body
        }
        if geometry.faceBoxNormalized != nil {
            return .face
        }
        return .salientObject
    }

    private func squaredDistance(
        from lhs: LiveFramePoint,
        to rhs: LiveFramePoint
    ) -> CGFloat {
        let deltaX = lhs.x - rhs.x
        let deltaY = lhs.y - rhs.y
        return deltaX * deltaX + deltaY * deltaY
    }

    private func desiredArea(
        for kind: LiveFrameSubjectCandidateKind,
        policy: LocalAIComposePolicy
    ) -> CGFloat {
        switch policy {
        case .negativeSpace:
            return 0.10
        case .leadRoom:
            switch kind {
            case .face:
                return 0.16
            case .body:
                return 0.21
            case .salientObject:
                return 0.18
            }
        case .groupBalance:
            return 0.38
        case .centered:
            switch kind {
            case .face:
                return 0.21
            case .body:
                return 0.28
            case .salientObject:
                return 0.24
            }
        case .symmetry:
            switch kind {
            case .face:
                return 0.20
            case .body:
                return 0.27
            case .salientObject:
                return 0.22
            }
        case .leadingLines:
            switch kind {
            case .face:
                return 0.18
            case .body:
                return 0.23
            case .salientObject:
                return 0.20
            }
        case .thirds:
            switch kind {
            case .face:
                return 0.17
            case .body:
                return 0.22
            case .salientObject:
                return 0.19
            }
        }
    }
}

nonisolated struct LocalAIComposeSubjectAmbiguityState: Equatable, Sendable {
    let consecutiveMultipleSamples: Int
    let consecutiveClearSamples: Int
    let requiresSelection: Bool

    static let initial = LocalAIComposeSubjectAmbiguityState(
        consecutiveMultipleSamples: 0,
        consecutiveClearSamples: 0,
        requiresSelection: false
    )
}

nonisolated struct LocalAIComposeSubjectAmbiguityUpdate: Equatable, Sendable {
    let state: LocalAIComposeSubjectAmbiguityState
    let didChangeRequirement: Bool
}

/// Adds two-sample hysteresis before entering or leaving explicit subject-choice mode.
nonisolated struct LocalAIComposeSubjectAmbiguityController: Sendable {
    private let requiredSamples = 2

    func update(
        state: LocalAIComposeSubjectAmbiguityState,
        hasMultipleSubjects: Bool,
        isSubjectLocked: Bool
    ) -> LocalAIComposeSubjectAmbiguityUpdate {
        guard !isSubjectLocked else {
            return LocalAIComposeSubjectAmbiguityUpdate(
                state: .initial,
                didChangeRequirement: state.requiresSelection
            )
        }

        let nextState: LocalAIComposeSubjectAmbiguityState
        if hasMultipleSubjects {
            let multipleSamples = min(
                state.consecutiveMultipleSamples + 1,
                requiredSamples
            )
            nextState = LocalAIComposeSubjectAmbiguityState(
                consecutiveMultipleSamples: multipleSamples,
                consecutiveClearSamples: 0,
                requiresSelection: state.requiresSelection || multipleSamples >= requiredSamples
            )
        } else {
            let clearSamples = min(
                state.consecutiveClearSamples + 1,
                requiredSamples
            )
            nextState = LocalAIComposeSubjectAmbiguityState(
                consecutiveMultipleSamples: 0,
                consecutiveClearSamples: clearSamples,
                requiresSelection: state.requiresSelection && clearSamples < requiredSamples
            )
        }

        return LocalAIComposeSubjectAmbiguityUpdate(
            state: nextState,
            didChangeRequirement: nextState.requiresSelection != state.requiresSelection
        )
    }
}
