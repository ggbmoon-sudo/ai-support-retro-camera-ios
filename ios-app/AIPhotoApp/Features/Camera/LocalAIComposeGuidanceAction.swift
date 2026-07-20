import CoreGraphics
import Foundation

nonisolated enum LocalAIComposeGuidanceAction: String, Equatable, Sendable {
    case moveLeft
    case moveRight
    case moveUp
    case moveDown
    case zoomIn
    case stepBack
    case aligned

    var stage: LocalAIComposeStage {
        self == .aligned ? .aligned : .guiding
    }

    var instructionKey: String {
        switch self {
        case .moveLeft:
            return "camera.ai_compose.subject_left"
        case .moveRight:
            return "camera.ai_compose.subject_right"
        case .moveUp:
            return "camera.ai_compose.subject_up"
        case .moveDown:
            return "camera.ai_compose.subject_down"
        case .zoomIn:
            return "camera.ai_compose.zoom_in"
        case .stepBack:
            return "camera.ai_compose.step_back"
        case .aligned:
            return "camera.ai_compose.aligned"
        }
    }

    var systemImage: String {
        switch self {
        case .moveLeft:
            return "arrow.left"
        case .moveRight:
            return "arrow.right"
        case .moveUp:
            return "arrow.up"
        case .moveDown:
            return "arrow.down"
        case .zoomIn:
            return "plus.magnifyingglass"
        case .stepBack:
            return "minus.magnifyingglass"
        case .aligned:
            return "checkmark.circle.fill"
        }
    }

    var isHorizontalMovement: Bool {
        self == .moveLeft || self == .moveRight
    }

    var isVerticalMovement: Bool {
        self == .moveUp || self == .moveDown
    }
}

/// Resolves the largest normalized placement error first, then scale, without a numeric score.
nonisolated struct LocalAIComposeGuidanceActionResolver: Sendable {
    func proposedAction(
        horizontalDelta: CGFloat,
        verticalDelta: CGFloat,
        areaRatio: CGFloat,
        poseFramingEdges: LiveFramePoseEdges = [],
        activeAction: LocalAIComposeGuidanceAction?
    ) -> LocalAIComposeGuidanceAction {
        let horizontalTolerance = resolvedHorizontalTolerance(activeAction: activeAction)
        let verticalTolerance = resolvedVerticalTolerance(activeAction: activeAction)
        let horizontalNeed = abs(horizontalDelta) / max(horizontalTolerance, 0.001)
        let verticalNeed = abs(verticalDelta) / max(verticalTolerance, 0.001)

        if max(horizontalNeed, verticalNeed) > 1 {
            if horizontalNeed >= verticalNeed {
                return horizontalDelta > 0 ? .moveRight : .moveLeft
            }
            return verticalDelta > 0 ? .moveUp : .moveDown
        }

        if !poseFramingEdges.isEmpty {
            return .stepBack
        }

        let scaleRange = resolvedScaleRange(activeAction: activeAction)
        if areaRatio < scaleRange.lowerBound {
            return .zoomIn
        }
        if areaRatio > scaleRange.upperBound {
            return .stepBack
        }
        return .aligned
    }

    private func resolvedHorizontalTolerance(
        activeAction: LocalAIComposeGuidanceAction?
    ) -> CGFloat {
        if activeAction == .aligned {
            return 0.095
        }
        if activeAction?.isHorizontalMovement == true {
            return 0.055
        }
        return 0.075
    }

    private func resolvedVerticalTolerance(
        activeAction: LocalAIComposeGuidanceAction?
    ) -> CGFloat {
        if activeAction == .aligned {
            return 0.105
        }
        if activeAction?.isVerticalMovement == true {
            return 0.065
        }
        return 0.085
    }

    private func resolvedScaleRange(
        activeAction: LocalAIComposeGuidanceAction?
    ) -> ClosedRange<CGFloat> {
        switch activeAction {
        case .some(.aligned):
            return 0.66...1.48
        case .some(.zoomIn):
            return 0.80...1.38
        case .some(.stepBack):
            return 0.72...1.30
        case .some(.moveLeft), .some(.moveRight), .some(.moveUp), .some(.moveDown), .none:
            return 0.72...1.38
        }
    }
}

nonisolated struct LocalAIComposeGuidanceActionState: Equatable, Sendable {
    let activeAction: LocalAIComposeGuidanceAction?
    let pendingAction: LocalAIComposeGuidanceAction?
    let consecutivePendingSamples: Int

    static let initial = LocalAIComposeGuidanceActionState(
        activeAction: nil,
        pendingAction: nil,
        consecutivePendingSamples: 0
    )
}

/// Keeps the first action responsive while requiring two samples before subsequent switches.
nonisolated struct LocalAIComposeGuidanceActionStabilityController: Sendable {
    private let requiredSwitchSamples = 2

    func update(
        state: LocalAIComposeGuidanceActionState,
        proposedAction: LocalAIComposeGuidanceAction?
    ) -> LocalAIComposeGuidanceActionState {
        guard let proposedAction else { return .initial }
        guard let activeAction = state.activeAction else {
            return LocalAIComposeGuidanceActionState(
                activeAction: proposedAction,
                pendingAction: nil,
                consecutivePendingSamples: 0
            )
        }
        guard proposedAction != activeAction else {
            return LocalAIComposeGuidanceActionState(
                activeAction: activeAction,
                pendingAction: nil,
                consecutivePendingSamples: 0
            )
        }

        let pendingSamples = state.pendingAction == proposedAction
            ? min(state.consecutivePendingSamples + 1, requiredSwitchSamples)
            : 1
        if pendingSamples >= requiredSwitchSamples {
            return LocalAIComposeGuidanceActionState(
                activeAction: proposedAction,
                pendingAction: nil,
                consecutivePendingSamples: 0
            )
        }
        return LocalAIComposeGuidanceActionState(
            activeAction: activeAction,
            pendingAction: proposedAction,
            consecutivePendingSamples: pendingSamples
        )
    }
}
