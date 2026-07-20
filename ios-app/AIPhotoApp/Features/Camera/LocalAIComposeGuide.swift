import CoreGraphics
import Foundation

nonisolated enum LocalAIComposeStage: String, Equatable, Sendable {
    case searching
    case stabilizing
    case guiding
    case holding
    case aligned
}

nonisolated struct LocalAIComposeGuide: Equatable, Sendable {
    let stage: LocalAIComposeStage
    let subjectBox: LiveFrameNormalizedRect?
    let targetBox: LiveFrameNormalizedRect?
    let targetAnchor: LiveFramePoint?
    let policy: LocalAIComposePolicy?
    let guidanceAction: LocalAIComposeGuidanceAction?
    let readiness: LocalAIComposeReadiness
    let selectionCandidateBoxes: [LiveFrameNormalizedRect]
    let poseFramingEdges: LiveFramePoseEdges
    let instructionKey: String
    let instructionSystemImage: String
    let detailKey: String
    let rollDegrees: Double?
    let isNearLevel: Bool
    let sceneHorizonAngleDegrees: Double?
    let isSceneHorizonNearLevel: Bool
    let isSubjectLocked: Bool
    let isMotionPaused: Bool

    var isThermalProtectionPaused: Bool {
        instructionKey == "camera.ai_compose.thermal_paused"
    }

    var isAnalysisPaused: Bool {
        isMotionPaused || isThermalProtectionPaused
    }

    static let searching = LocalAIComposeGuide(
        stage: .searching,
        subjectBox: nil,
        targetBox: nil,
        targetAnchor: nil,
        policy: nil,
        guidanceAction: nil,
        readiness: .inactive,
        selectionCandidateBoxes: [],
        poseFramingEdges: [],
        instructionKey: "camera.ai_compose.searching",
        instructionSystemImage: "viewfinder",
        detailKey: "camera.ai_compose.subject_selection_hint",
        rollDegrees: nil,
        isNearLevel: false,
        sceneHorizonAngleDegrees: nil,
        isSceneHorizonNearLevel: false,
        isSubjectLocked: false,
        isMotionPaused: false
    )

    static func searchingWithSceneHorizon(
        angleDegrees: Double?,
        isNearLevel: Bool
    ) -> LocalAIComposeGuide {
        LocalAIComposeGuide(
            stage: .searching,
            subjectBox: nil,
            targetBox: nil,
            targetAnchor: nil,
            policy: nil,
            guidanceAction: nil,
            readiness: .inactive,
            selectionCandidateBoxes: [],
            poseFramingEdges: [],
            instructionKey: "camera.ai_compose.searching",
            instructionSystemImage: "viewfinder",
            detailKey: sceneHorizonDetailKey(
                angleDegrees: angleDegrees,
                isNearLevel: isNearLevel,
                fallback: "camera.ai_compose.subject_selection_hint"
            ),
            rollDegrees: nil,
            isNearLevel: false,
            sceneHorizonAngleDegrees: angleDegrees,
            isSceneHorizonNearLevel: isNearLevel,
            isSubjectLocked: false,
            isMotionPaused: false
        )
    }

    static func searchingForGroupBalance(
        sceneHorizonAngleDegrees: Double?,
        isSceneHorizonNearLevel: Bool
    ) -> LocalAIComposeGuide {
        LocalAIComposeGuide(
            stage: .searching,
            subjectBox: nil,
            targetBox: nil,
            targetAnchor: nil,
            policy: .groupBalance,
            guidanceAction: nil,
            readiness: .inactive,
            selectionCandidateBoxes: [],
            poseFramingEdges: [],
            instructionKey: "camera.ai_compose.group_searching",
            instructionSystemImage: "person.3",
            detailKey: "camera.ai_compose.group_local_privacy",
            rollDegrees: nil,
            isNearLevel: false,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: false,
            isMotionPaused: false
        )
    }

    static func multipleSubjects(
        selectionCandidateBoxes: [LiveFrameNormalizedRect],
        sceneHorizonAngleDegrees: Double?,
        isSceneHorizonNearLevel: Bool
    ) -> LocalAIComposeGuide {
        LocalAIComposeGuide(
            stage: .searching,
            subjectBox: nil,
            targetBox: nil,
            targetAnchor: nil,
            policy: nil,
            guidanceAction: nil,
            readiness: .inactive,
            selectionCandidateBoxes: selectionCandidateBoxes,
            poseFramingEdges: [],
            instructionKey: "camera.ai_compose.multiple_subjects",
            instructionSystemImage: "hand.tap",
            detailKey: "camera.ai_compose.selection_candidate_hint",
            rollDegrees: nil,
            isNearLevel: false,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: false,
            isMotionPaused: false
        )
    }

    static func reacquiringLockedSubject(
        policy: LocalAIComposePolicy?,
        targetAnchor: LiveFramePoint?,
        targetBox: LiveFrameNormalizedRect?,
        sceneHorizonAngleDegrees: Double?,
        isSceneHorizonNearLevel: Bool
    ) -> LocalAIComposeGuide {
        LocalAIComposeGuide(
            stage: .searching,
            subjectBox: nil,
            targetBox: targetBox,
            targetAnchor: targetAnchor,
            policy: policy,
            guidanceAction: nil,
            readiness: .inactive,
            selectionCandidateBoxes: [],
            poseFramingEdges: [],
            instructionKey: "camera.ai_compose.subject_reacquiring",
            instructionSystemImage: "viewfinder",
            detailKey: "camera.ai_compose.subject_locked",
            rollDegrees: nil,
            isNearLevel: false,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: true,
            isMotionPaused: false
        )
    }

    func applyingGuidanceAction(
        _ action: LocalAIComposeGuidanceAction?
    ) -> LocalAIComposeGuide {
        guard let action else { return self }
        return LocalAIComposeGuide(
            stage: action.stage,
            subjectBox: subjectBox,
            targetBox: targetBox,
            targetAnchor: targetAnchor,
            policy: policy,
            guidanceAction: action,
            readiness: readiness,
            selectionCandidateBoxes: selectionCandidateBoxes,
            poseFramingEdges: poseFramingEdges,
            instructionKey: action.instructionKey,
            instructionSystemImage: action.systemImage,
            detailKey: detailKey,
            rollDegrees: rollDegrees,
            isNearLevel: isNearLevel,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: isSubjectLocked,
            isMotionPaused: isMotionPaused
        )
    }

    func applyingReadiness(
        _ resolvedReadiness: LocalAIComposeReadiness
    ) -> LocalAIComposeGuide {
        let effectiveReadiness: LocalAIComposeReadiness
        let resolvedStage: LocalAIComposeStage
        let resolvedInstructionKey: String
        let resolvedInstructionSystemImage: String

        if guidanceAction == .aligned {
            if resolvedReadiness == .ready {
                effectiveReadiness = .ready
                resolvedStage = .aligned
                resolvedInstructionKey = LocalAIComposeGuidanceAction.aligned.instructionKey
                resolvedInstructionSystemImage = LocalAIComposeGuidanceAction.aligned.systemImage
            } else {
                effectiveReadiness = .holding
                resolvedStage = .holding
                resolvedInstructionKey = "camera.ai_compose.hold_steady"
                resolvedInstructionSystemImage = "scope"
            }
        } else {
            effectiveReadiness = .inactive
            resolvedStage = stage
            resolvedInstructionKey = instructionKey
            resolvedInstructionSystemImage = instructionSystemImage
        }

        return LocalAIComposeGuide(
            stage: resolvedStage,
            subjectBox: subjectBox,
            targetBox: targetBox,
            targetAnchor: targetAnchor,
            policy: policy,
            guidanceAction: guidanceAction,
            readiness: effectiveReadiness,
            selectionCandidateBoxes: selectionCandidateBoxes,
            poseFramingEdges: poseFramingEdges,
            instructionKey: resolvedInstructionKey,
            instructionSystemImage: resolvedInstructionSystemImage,
            detailKey: detailKey,
            rollDegrees: rollDegrees,
            isNearLevel: isNearLevel,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: isSubjectLocked,
            isMotionPaused: isMotionPaused
        )
    }

    func applyingMotionPause(
        _ isPaused: Bool,
        preservesExistingTarget: Bool
    ) -> LocalAIComposeGuide {
        guard isPaused else { return self }
        return LocalAIComposeGuide(
            stage: .stabilizing,
            subjectBox: subjectBox,
            targetBox: preservesExistingTarget ? targetBox : nil,
            targetAnchor: preservesExistingTarget ? targetAnchor : nil,
            policy: preservesExistingTarget ? policy : nil,
            guidanceAction: nil,
            readiness: .inactive,
            selectionCandidateBoxes: [],
            poseFramingEdges: [],
            instructionKey: "camera.ai_compose.motion_paused",
            instructionSystemImage: "gyroscope",
            detailKey: "camera.ai_compose.motion_paused_detail",
            rollDegrees: rollDegrees,
            isNearLevel: isNearLevel,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: isSubjectLocked,
            isMotionPaused: true
        )
    }

    func applyingThermalProtectionPause(
        preservesExistingTarget: Bool
    ) -> LocalAIComposeGuide {
        LocalAIComposeGuide(
            stage: .stabilizing,
            subjectBox: subjectBox,
            targetBox: preservesExistingTarget ? targetBox : nil,
            targetAnchor: preservesExistingTarget ? targetAnchor : nil,
            policy: preservesExistingTarget ? policy : nil,
            guidanceAction: nil,
            readiness: .inactive,
            selectionCandidateBoxes: [],
            poseFramingEdges: [],
            instructionKey: "camera.ai_compose.thermal_paused",
            instructionSystemImage: "thermometer.medium",
            detailKey: "camera.ai_compose.thermal_paused_detail",
            rollDegrees: rollDegrees,
            isNearLevel: isNearLevel,
            sceneHorizonAngleDegrees: sceneHorizonAngleDegrees,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: isSubjectLocked,
            isMotionPaused: false
        )
    }

    private static func sceneHorizonDetailKey(
        angleDegrees: Double?,
        isNearLevel: Bool,
        fallback: String
    ) -> String {
        angleDegrees != nil && !isNearLevel
            ? "camera.ai_compose.scene_horizon_optional"
            : fallback
    }
}

struct LocalAIComposeGuideResolver {
    private let policyResolver = LocalAIComposePolicyResolver()
    private let actionResolver = LocalAIComposeGuidanceActionResolver()

    func guide(
        subjectContext: LocalAIComposeSubjectContext?,
        policy: LocalAIComposePolicy?,
        requiresSubjectSelection: Bool,
        isGroupGuidanceSelected: Bool = false,
        isSubjectLocked: Bool,
        targetAnchor existingTarget: LiveFramePoint?,
        targetBox existingTargetBox: LiveFrameNormalizedRect?,
        level: CameraLevelContext,
        isMirrored: Bool,
        sceneHorizonAngleDegrees: Double?,
        isSceneHorizonNearLevel: Bool,
        poseFramingEdges: LiveFramePoseEdges,
        activeGuidanceAction: LocalAIComposeGuidanceAction?,
        favorsSymmetry: Bool = false,
        leadingLinePoint: LiveFramePoint? = nil,
        subjectMotionDirection: LocalAIComposeSubjectMotionDirection? = nil,
        quietSpaceSide: LiveFrameHorizontalSide? = nil,
        isTargetHorizontallyFlipped: Bool = false,
        selectionCandidateBoxes: [LiveFrameNormalizedRect] = []
    ) -> LocalAIComposeGuide {
        let displaySceneHorizonAngle = sceneHorizonAngleDegrees.map {
            isMirrored ? -$0 : $0
        }
        let displayPoseFramingEdges = isMirrored
            ? poseFramingEdges.mirroredHorizontally
            : poseFramingEdges
        if requiresSubjectSelection {
            return .multipleSubjects(
                selectionCandidateBoxes: Array(selectionCandidateBoxes.prefix(4)),
                sceneHorizonAngleDegrees: displaySceneHorizonAngle,
                isSceneHorizonNearLevel: isSceneHorizonNearLevel
            )
        }

        guard let subjectContext else {
            if isGroupGuidanceSelected {
                return .searchingForGroupBalance(
                    sceneHorizonAngleDegrees: displaySceneHorizonAngle,
                    isSceneHorizonNearLevel: isSceneHorizonNearLevel
                )
            }
            return isSubjectLocked
                ? .reacquiringLockedSubject(
                    policy: policy,
                    targetAnchor: existingTarget,
                    targetBox: existingTargetBox,
                    sceneHorizonAngleDegrees: displaySceneHorizonAngle,
                    isSceneHorizonNearLevel: isSceneHorizonNearLevel
                )
                : .searchingWithSceneHorizon(
                    angleDegrees: displaySceneHorizonAngle,
                    isNearLevel: isSceneHorizonNearLevel
                )
        }
        let resolvedPolicy = policy ?? policyResolver.recommendedPolicy(
            for: subjectContext,
            favorsSymmetry: favorsSymmetry,
            leadingLinePoint: leadingLinePoint,
            subjectMotionDirection: subjectMotionDirection,
            quietSpaceSide: quietSpaceSide
        )
        let subjectBox = subjectContext.box
        let subjectCenter = subjectBox.center

        let targetAnchor = existingTarget ?? policyResolver.targetAnchor(
            for: subjectContext,
            policy: resolvedPolicy,
            leadingLinePoint: leadingLinePoint,
            subjectMotionDirection: subjectMotionDirection,
            quietSpaceSide: quietSpaceSide,
            horizontallyFlipped: isTargetHorizontallyFlipped
        )
        let targetBox = existingTargetBox ?? policyResolver.targetBox(
            for: subjectContext,
            policy: resolvedPolicy,
            centeredAt: targetAnchor
        )
        let rawHorizontalDelta = targetAnchor.x - subjectCenter.x
        let horizontalDelta = isMirrored ? -rawHorizontalDelta : rawHorizontalDelta
        let verticalDelta = targetAnchor.y - subjectCenter.y
        let proposedAction = actionResolver.proposedAction(
            horizontalDelta: horizontalDelta,
            verticalDelta: verticalDelta,
            areaRatio: subjectBox.area / max(targetBox.area, 0.001),
            poseFramingEdges: poseFramingEdges,
            activeAction: activeGuidanceAction
        )
        let levelNeedsAttention = level.available && level.isNearLevel == false
        let sceneHorizonNeedsAttention = displaySceneHorizonAngle != nil
            && !isSceneHorizonNearLevel
        let detailKey: String
        if resolvedPolicy == .groupBalance {
            detailKey = "camera.ai_compose.group_local_privacy"
        } else if !displayPoseFramingEdges.isEmpty {
            detailKey = "camera.ai_compose.pose_edge_optional"
        } else if isSubjectLocked {
            detailKey = "camera.ai_compose.subject_locked"
        } else if sceneHorizonNeedsAttention {
            detailKey = "camera.ai_compose.scene_horizon_optional"
        } else if levelNeedsAttention {
            detailKey = "camera.ai_compose.level_optional"
        } else {
            detailKey = "camera.ai_compose.subject_selection_hint"
        }

        return LocalAIComposeGuide(
            stage: proposedAction.stage,
            subjectBox: subjectBox,
            targetBox: targetBox,
            targetAnchor: targetAnchor,
            policy: resolvedPolicy,
            guidanceAction: proposedAction,
            readiness: .inactive,
            selectionCandidateBoxes: [],
            poseFramingEdges: displayPoseFramingEdges,
            instructionKey: proposedAction.instructionKey,
            instructionSystemImage: proposedAction.systemImage,
            detailKey: detailKey,
            rollDegrees: level.rollDegreesRounded,
            isNearLevel: level.isNearLevel == true,
            sceneHorizonAngleDegrees: displaySceneHorizonAngle,
            isSceneHorizonNearLevel: isSceneHorizonNearLevel,
            isSubjectLocked: isSubjectLocked,
            isMotionPaused: false
        )
    }
}
