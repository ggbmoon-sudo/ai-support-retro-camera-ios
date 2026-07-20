import CoreGraphics
import Foundation
import SwiftUI

struct LocalAIComposeOverlayView: View {
    @Environment(\.accessibilityReduceMotion) private var accessibilityReduceMotion

    let guide: LocalAIComposeGuide
    let isMirrored: Bool
    let showsDepthLayerCue: Bool
    let depthOcclusionMask: LiveFrameDepthOcclusionMask?

    private let coordinateMapper = CameraOverlayCoordinateMapper()

    var body: some View {
        GeometryReader { proxy in
            let overlaySize = proxy.size
            let subjectRect = mappedRect(guide.subjectBox, overlaySize: overlaySize)
            let targetRect = mappedRect(guide.targetBox, overlaySize: overlaySize)
            let previewRect = mappedRect(
                LiveFrameNormalizedRect(CGRect(x: 0, y: 0, width: 1, height: 1)),
                overlaySize: overlaySize
            )
            let targetPoint = mappedPoint(
                guide.targetAnchor,
                previewRect: previewRect
            )
            let selectionCandidateRects = guide.selectionCandidateBoxes.compactMap {
                mappedRect($0, overlaySize: overlaySize)
            }

            ZStack {
                Color.black.opacity(guide.stage == .searching ? 0.08 : 0.04)

                if let policy = guide.policy,
                   let previewRect {
                    ZStack {
                        compositionGrid(
                            for: policy,
                            in: previewRect,
                            targetPoint: targetPoint
                        )

                        if showsDepthLayerCue,
                           !guide.isAnalysisPaused,
                           policy != .groupBalance,
                           let depthOcclusionMask {
                            depthOcclusionCutout(
                                depthOcclusionMask,
                                in: previewRect
                            )
                        }
                    }
                    .compositingGroup()
                    .opacity(guide.isAnalysisPaused ? 0.42 : 1)
                }

                if !selectionCandidateRects.isEmpty {
                    selectionCandidateFrames(selectionCandidateRects)
                }

                if !guide.poseFramingEdges.isEmpty,
                   let previewRect {
                    poseEdgeGuards(
                        edges: guide.poseFramingEdges,
                        in: previewRect
                    )
                }

                if let action = guide.guidanceAction,
                   let subjectRect,
                   let targetRect,
                   action.isHorizontalMovement || action.isVerticalMovement {
                    movementArrow(
                        action: action,
                        subjectRect: subjectRect,
                        targetRect: targetRect,
                        overlaySize: overlaySize
                    )
                }

                if let targetRect {
                    targetFrame(in: targetRect)
                        .opacity(guide.isAnalysisPaused ? 0.46 : 1)
                } else if !guide.isAnalysisPaused,
                          guide.instructionKey != "camera.ai_compose.multiple_subjects" {
                    searchingReticle(in: overlaySize)
                }

                if let subjectRect {
                    if showsDepthLayerCue,
                       !guide.isAnalysisPaused,
                       guide.policy != .groupBalance {
                        depthLayerHalo(in: subjectRect)
                    }
                    subjectFrame(in: subjectRect)
                        .opacity(guide.isAnalysisPaused ? 0.46 : 1)
                }

                if let action = guide.guidanceAction,
                   let targetRect,
                   !action.isHorizontalMovement,
                   !action.isVerticalMovement {
                    scaleOrAlignedCue(action: action, targetRect: targetRect)
                }

                if guide.isAnalysisPaused,
                   let previewRect {
                    if guide.isThermalProtectionPaused {
                        thermalProtectionCue(in: previewRect)
                    } else {
                        motionStabilityCue(in: previewRect)
                    }
                } else {
                    sceneHorizonGuide(in: overlaySize)
                    levelGuide(in: overlaySize)
                }

                VStack(spacing: 0) {
                    VStack(spacing: 8) {
                        instructionCard

                        if let policy = guide.policy {
                            policyBadge(policy)
                        }

                        if showsDepthLayerCue,
                           guide.subjectBox != nil,
                           !guide.isAnalysisPaused,
                           guide.policy != .groupBalance {
                            depthLayerBadge
                        }
                    }
                    .padding(.horizontal, 38)
                    .padding(.top, max(proxy.safeAreaInsets.top + 72, 112))

                    Spacer()

                    detailPill
                        .padding(.horizontal, 42)
                        .padding(.bottom, max(proxy.safeAreaInsets.bottom + 174, 202))
                }
            }
        }
        .allowsHitTesting(false)
        .accessibilityElement(children: .combine)
        .accessibilityHint("camera.ai_compose.subject_selection_accessibility_hint")
        .animation(
            accessibilityReduceMotion ? nil : .easeInOut(duration: 0.22),
            value: guide.readiness
        )
    }

    private func movementArrow(
        action: LocalAIComposeGuidanceAction,
        subjectRect: CGRect,
        targetRect: CGRect,
        overlaySize: CGSize
    ) -> some View {
        let start = CGPoint(x: subjectRect.midX, y: subjectRect.midY)
        let rawMagnitude: CGFloat
        let direction = movementDirection(for: action)

        if action.isHorizontalMovement {
            rawMagnitude = abs(targetRect.midX - subjectRect.midX)
        } else {
            rawMagnitude = abs(targetRect.midY - subjectRect.midY)
        }

        let magnitude = min(max(rawMagnitude, 34), 112)
        let insetStart = CGPoint(
            x: start.x + direction.dx * 12,
            y: start.y + direction.dy * 12
        )
        let unclampedEnd = CGPoint(
            x: insetStart.x + direction.dx * magnitude,
            y: insetStart.y + direction.dy * magnitude
        )
        let end = CGPoint(
            x: min(max(unclampedEnd.x, 18), overlaySize.width - 18),
            y: min(max(unclampedEnd.y, 18), overlaySize.height - 18)
        )

        return arrowPath(from: insetStart, to: end)
            .stroke(
                LinearGradient(
                    colors: [Color.cyan.opacity(0.65), AppColors.accent],
                    startPoint: .leading,
                    endPoint: .trailing
                ),
                style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round)
            )
            .shadow(color: .black.opacity(0.42), radius: 3)
            .accessibilityHidden(true)
    }

    private func movementDirection(
        for action: LocalAIComposeGuidanceAction
    ) -> CGVector {
        switch action {
        case .moveLeft:
            return CGVector(dx: -1, dy: 0)
        case .moveRight:
            return CGVector(dx: 1, dy: 0)
        case .moveUp:
            return CGVector(dx: 0, dy: -1)
        case .moveDown:
            return CGVector(dx: 0, dy: 1)
        case .zoomIn, .stepBack, .aligned:
            return CGVector(dx: 0, dy: 0)
        }
    }

    private func arrowPath(from start: CGPoint, to end: CGPoint) -> Path {
        var path = Path()
        path.move(to: start)
        path.addLine(to: end)

        let angle = atan2(
            Double(end.y - start.y),
            Double(end.x - start.x)
        )
        let headLength: CGFloat = 11
        let headAngle = 0.55
        let firstHead = CGPoint(
            x: end.x - headLength * CGFloat(cos(angle - headAngle)),
            y: end.y - headLength * CGFloat(sin(angle - headAngle))
        )
        let secondHead = CGPoint(
            x: end.x - headLength * CGFloat(cos(angle + headAngle)),
            y: end.y - headLength * CGFloat(sin(angle + headAngle))
        )
        path.move(to: firstHead)
        path.addLine(to: end)
        path.addLine(to: secondHead)
        return path
    }

    private func scaleOrAlignedCue(
        action: LocalAIComposeGuidanceAction,
        targetRect: CGRect
    ) -> some View {
        let isReady = guide.readiness == .ready
        let isHolding = action == .aligned && !isReady
        let systemImage = isHolding ? "scope" : action.systemImage
        let cueColor = isReady ? Color.mint : Color.cyan

        return Image(systemName: systemImage)
            .font(.system(size: action == .aligned ? 25 : 21, weight: .bold))
            .foregroundStyle(cueColor)
            .frame(width: 44, height: 44)
            .background(.black.opacity(0.58))
            .clipShape(Circle())
            .overlay {
                Circle()
                    .stroke(
                        cueColor.opacity(isReady ? 0.82 : 0.72),
                        lineWidth: 1.5
                    )
            }
            .overlay {
                if isHolding {
                    Circle()
                        .stroke(
                            AppColors.accent.opacity(0.56),
                            style: StrokeStyle(lineWidth: 1.2, dash: [4, 4])
                        )
                        .frame(width: 54, height: 54)
                }
            }
            .position(x: targetRect.midX, y: targetRect.midY)
            .shadow(color: .black.opacity(0.34), radius: 4)
            .accessibilityHidden(true)
    }

    private func poseEdgeGuards(
        edges: LiveFramePoseEdges,
        in rect: CGRect
    ) -> some View {
        let markerLength = min(max(min(rect.width, rect.height) * 0.18, 54), 112)
        let inset: CGFloat = 9

        return ZStack {
            if edges.contains(.left) {
                Capsule()
                    .frame(width: 4, height: markerLength)
                    .position(x: rect.minX + inset, y: rect.midY)
            }
            if edges.contains(.right) {
                Capsule()
                    .frame(width: 4, height: markerLength)
                    .position(x: rect.maxX - inset, y: rect.midY)
            }
            if edges.contains(.top) {
                Capsule()
                    .frame(width: markerLength, height: 4)
                    .position(x: rect.midX, y: rect.minY + inset)
            }
            if edges.contains(.bottom) {
                Capsule()
                    .frame(width: markerLength, height: 4)
                    .position(x: rect.midX, y: rect.maxY - inset)
            }
        }
        .foregroundStyle(Color.orange.opacity(0.92))
        .shadow(color: .black.opacity(0.46), radius: 3)
        .accessibilityHidden(true)
    }

    private func selectionCandidateFrames(
        _ rects: [CGRect]
    ) -> some View {
        ZStack {
            ForEach(Array(rects.enumerated()), id: \.offset) { _, rect in
                RoundedRectangle(cornerRadius: 15, style: .continuous)
                    .stroke(
                        Color.cyan.opacity(0.78),
                        style: StrokeStyle(lineWidth: 1.8, dash: [8, 6])
                    )
                    .frame(width: rect.width, height: rect.height)
                    .overlay(alignment: .topTrailing) {
                        Circle()
                            .fill(AppColors.accent)
                            .frame(width: 7, height: 7)
                            .offset(x: 4, y: -4)
                    }
                    .position(x: rect.midX, y: rect.midY)
            }
        }
        .shadow(color: .black.opacity(0.34), radius: 3)
        .accessibilityHidden(true)
    }

    private func policyBadge(_ policy: LocalAIComposePolicy) -> some View {
        HStack(spacing: 7) {
            Image(systemName: policy.systemImage)
                .font(.caption2.weight(.bold))

            Text(LocalizedStringKey(policy.titleKey))
                .font(.caption2.weight(.semibold))
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 11)
        .foregroundStyle(.white.opacity(0.92))
        .background(.black.opacity(0.54))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(AppColors.accent.opacity(0.46), lineWidth: 1)
        }
    }

    @ViewBuilder
    private func compositionGrid(
        for policy: LocalAIComposePolicy,
        in rect: CGRect,
        targetPoint: CGPoint?
    ) -> some View {
        switch policy {
        case .thirds:
            Path { path in
                let firstX = rect.minX + rect.width / 3
                let secondX = rect.minX + rect.width * 2 / 3
                let firstY = rect.minY + rect.height / 3
                let secondY = rect.minY + rect.height * 2 / 3

                path.move(to: CGPoint(x: firstX, y: rect.minY))
                path.addLine(to: CGPoint(x: firstX, y: rect.maxY))
                path.move(to: CGPoint(x: secondX, y: rect.minY))
                path.addLine(to: CGPoint(x: secondX, y: rect.maxY))
                path.move(to: CGPoint(x: rect.minX, y: firstY))
                path.addLine(to: CGPoint(x: rect.maxX, y: firstY))
                path.move(to: CGPoint(x: rect.minX, y: secondY))
                path.addLine(to: CGPoint(x: rect.maxX, y: secondY))
            }
            .stroke(
                Color.white.opacity(0.16),
                style: StrokeStyle(lineWidth: 0.8)
            )

        case .negativeSpace:
            let focusPoint = targetPoint ?? CGPoint(x: rect.midX, y: rect.midY)
            let quietRect = focusPoint.x <= rect.midX
                ? CGRect(
                    x: rect.midX,
                    y: rect.minY,
                    width: rect.width / 2,
                    height: rect.height
                )
                : CGRect(
                    x: rect.minX,
                    y: rect.minY,
                    width: rect.width / 2,
                    height: rect.height
                )
            ZStack {
                Rectangle()
                    .fill(Color.cyan.opacity(0.055))
                    .frame(width: quietRect.width, height: quietRect.height)
                    .position(x: quietRect.midX, y: quietRect.midY)

                Path { path in
                    let firstX = rect.minX + rect.width / 3
                    let secondX = rect.minX + rect.width * 2 / 3
                    let firstY = rect.minY + rect.height / 3
                    let secondY = rect.minY + rect.height * 2 / 3

                    path.move(to: CGPoint(x: firstX, y: rect.minY))
                    path.addLine(to: CGPoint(x: firstX, y: rect.maxY))
                    path.move(to: CGPoint(x: secondX, y: rect.minY))
                    path.addLine(to: CGPoint(x: secondX, y: rect.maxY))
                    path.move(to: CGPoint(x: rect.minX, y: firstY))
                    path.addLine(to: CGPoint(x: rect.maxX, y: firstY))
                    path.move(to: CGPoint(x: rect.minX, y: secondY))
                    path.addLine(to: CGPoint(x: rect.maxX, y: secondY))
                }
                .stroke(
                    Color.white.opacity(0.20),
                    style: StrokeStyle(lineWidth: 0.8, dash: [7, 6])
                )

                Path { path in
                    path.move(to: CGPoint(x: rect.midX, y: rect.minY))
                    path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
                }
                .stroke(
                    Color.cyan.opacity(0.30),
                    style: StrokeStyle(lineWidth: 1, dash: [3, 6])
                )
            }

        case .leadRoom:
            let focusPoint = targetPoint ?? CGPoint(x: rect.midX, y: rect.midY)
            let movesTowardRight = focusPoint.x <= rect.midX
            let openRect = movesTowardRight
                ? CGRect(
                    x: focusPoint.x,
                    y: rect.minY,
                    width: max(rect.maxX - focusPoint.x, 0),
                    height: rect.height
                )
                : CGRect(
                    x: rect.minX,
                    y: rect.minY,
                    width: max(focusPoint.x - rect.minX, 0),
                    height: rect.height
                )
            ZStack {
                Rectangle()
                    .fill(Color.cyan.opacity(0.052))
                    .frame(width: openRect.width, height: openRect.height)
                    .position(x: openRect.midX, y: openRect.midY)

                Path { path in
                    let laneEndX = movesTowardRight
                        ? rect.maxX - 12
                        : rect.minX + 12
                    let laneStartX = focusPoint.x
                    let laneSpacing = min(max(rect.height * 0.07, 14), 32)
                    for offset in [-laneSpacing, 0, laneSpacing] {
                        let y = min(max(focusPoint.y + offset, rect.minY + 8), rect.maxY - 8)
                        path.move(to: CGPoint(x: laneStartX, y: y))
                        path.addLine(to: CGPoint(x: laneEndX, y: y))
                    }
                }
                .stroke(
                    Color.cyan.opacity(0.34),
                    style: StrokeStyle(
                        lineWidth: 1,
                        lineCap: .round,
                        dash: [7, 6]
                    )
                )

                Path { path in
                    let thirdX = movesTowardRight
                        ? rect.minX + rect.width / 3
                        : rect.maxX - rect.width / 3
                    path.move(to: CGPoint(x: thirdX, y: rect.minY))
                    path.addLine(to: CGPoint(x: thirdX, y: rect.maxY))
                }
                .stroke(
                    Color.white.opacity(0.20),
                    style: StrokeStyle(lineWidth: 0.8, dash: [5, 6])
                )
            }

        case .groupBalance:
            ZStack {
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .stroke(
                        Color.cyan.opacity(0.30),
                        style: StrokeStyle(lineWidth: 1, dash: [8, 7])
                    )
                    .frame(width: rect.width * 0.68, height: rect.height * 0.58)
                    .position(x: rect.midX, y: rect.midY)

                Path { path in
                    let leftGuide = rect.minX + rect.width / 5
                    let rightGuide = rect.maxX - rect.width / 5
                    path.move(to: CGPoint(x: leftGuide, y: rect.minY))
                    path.addLine(to: CGPoint(x: leftGuide, y: rect.maxY))
                    path.move(to: CGPoint(x: rightGuide, y: rect.minY))
                    path.addLine(to: CGPoint(x: rightGuide, y: rect.maxY))
                    path.move(to: CGPoint(x: rect.minX, y: rect.midY))
                    path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
                }
                .stroke(
                    Color.white.opacity(0.17),
                    style: StrokeStyle(lineWidth: 0.8, dash: [5, 7])
                )

                Image(systemName: "person.3")
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundStyle(Color.cyan.opacity(0.42))
                    .position(x: rect.midX, y: rect.midY)
            }

        case .symmetry:
            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: rect.midX, y: rect.minY))
                    path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
                }
                .stroke(Color.cyan.opacity(0.48), lineWidth: 1.2)

                Path { path in
                    let leftMirrorGuide = rect.minX + rect.width / 4
                    let rightMirrorGuide = rect.maxX - rect.width / 4
                    path.move(to: CGPoint(x: leftMirrorGuide, y: rect.minY))
                    path.addLine(to: CGPoint(x: leftMirrorGuide, y: rect.maxY))
                    path.move(to: CGPoint(x: rightMirrorGuide, y: rect.minY))
                    path.addLine(to: CGPoint(x: rightMirrorGuide, y: rect.maxY))
                }
                .stroke(
                    Color.white.opacity(0.16),
                    style: StrokeStyle(lineWidth: 0.8, dash: [5, 6])
                )
            }

        case .leadingLines:
            let focusPoint = targetPoint ?? CGPoint(x: rect.midX, y: rect.midY)
            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
                    path.addLine(to: focusPoint)
                    path.move(to: CGPoint(x: rect.maxX, y: rect.maxY))
                    path.addLine(to: focusPoint)
                    path.move(to: CGPoint(x: rect.minX, y: rect.midY))
                    path.addLine(to: focusPoint)
                    path.move(to: CGPoint(x: rect.maxX, y: rect.midY))
                    path.addLine(to: focusPoint)
                }
                .stroke(
                    Color.cyan.opacity(0.34),
                    style: StrokeStyle(
                        lineWidth: 1,
                        lineCap: .round,
                        dash: [7, 6]
                    )
                )

                Circle()
                    .stroke(AppColors.accent.opacity(0.58), lineWidth: 1.2)
                    .frame(width: 14, height: 14)
                    .position(focusPoint)
            }

        case .centered:
            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: rect.midX, y: rect.minY))
                    path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
                    path.move(to: CGPoint(x: rect.minX, y: rect.midY))
                    path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
                }
                .stroke(Color.white.opacity(0.16), lineWidth: 0.8)

                Circle()
                    .stroke(Color.white.opacity(0.28), lineWidth: 1)
                    .frame(width: 34, height: 34)
                    .position(x: rect.midX, y: rect.midY)
            }
        }
    }

    private var instructionCard: some View {
        HStack(spacing: 10) {
            Image(systemName: guide.instructionSystemImage)
                .font(.system(size: 17, weight: .bold))
                .foregroundStyle(guide.readiness == .ready ? Color.mint : AppColors.accent)

            Text(LocalizedStringKey(guide.instructionKey))
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
                .multilineTextAlignment(.leading)
                .fixedSize(horizontal: false, vertical: true)

            Spacer(minLength: 0)
        }
        .padding(.vertical, 11)
        .padding(.horizontal, 14)
        .background(.black.opacity(0.66))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(.white.opacity(0.18), lineWidth: 1)
        }
    }

    private var detailPill: some View {
        HStack(spacing: 7) {
            Image(
                systemName: detailSystemImage
            )
                .font(.caption2.weight(.bold))

            Text(LocalizedStringKey(guide.detailKey))
                .font(.caption2.weight(.medium))
                .lineLimit(2)
                .minimumScaleFactor(0.78)
        }
        .padding(.vertical, 7)
        .padding(.horizontal, 12)
        .foregroundStyle(.white.opacity(0.9))
        .background(.black.opacity(0.56))
        .clipShape(Capsule())
    }

    private var depthLayerBadge: some View {
        HStack(spacing: 6) {
            Image(systemName: "square.3.layers.3d.down.right")
                .font(.caption2.weight(.semibold))

            Text("camera.ai_compose.depth_layers_local")
                .font(.caption2.weight(.semibold))
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 10)
        .foregroundStyle(Color.cyan.opacity(0.94))
        .background(.black.opacity(0.52))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.cyan.opacity(0.28), lineWidth: 1)
        }
    }

    private var detailSystemImage: String {
        if guide.detailKey == "camera.ai_compose.thermal_paused_detail" {
            return "thermometer.medium"
        }

        if guide.detailKey == "camera.ai_compose.group_local_privacy" {
            return "person.3"
        }

        if guide.detailKey == "camera.ai_compose.pose_edge_optional" {
            return "figure.stand"
        }

        if guide.detailKey == "camera.ai_compose.scene_horizon_optional" {
            return "water.waves"
        }

        if guide.detailKey == "camera.ai_compose.level_optional" {
            return "gyroscope"
        }

        if guide.isSubjectLocked {
            return "lock.fill"
        }

        return "hand.tap"
    }

    private func subjectFrame(in rect: CGRect) -> some View {
        let isGroupFrame = guide.policy == .groupBalance
        let frameColor = guide.isSubjectLocked
            ? Color.cyan
            : isGroupFrame ? Color.cyan.opacity(0.78) : Color.white.opacity(0.58)
        let frameWidth: CGFloat = guide.isSubjectLocked ? 2.5 : isGroupFrame ? 2 : 1

        return RoundedRectangle(cornerRadius: 15, style: .continuous)
            .stroke(
                frameColor,
                style: StrokeStyle(
                    lineWidth: frameWidth,
                    dash: guide.isSubjectLocked ? [] : isGroupFrame ? [8, 6] : [5, 5]
                )
            )
            .frame(width: rect.width, height: rect.height)
            .overlay(alignment: .topTrailing) {
                if guide.isSubjectLocked {
                    Image(systemName: "lock.fill")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(.black)
                        .padding(6)
                        .background(Color.cyan)
                        .clipShape(Circle())
                        .offset(x: 8, y: -8)
                } else if isGroupFrame {
                    Image(systemName: "person.3")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(.black)
                        .padding(6)
                        .background(Color.cyan.opacity(0.92))
                        .clipShape(Circle())
                        .offset(x: 8, y: -8)
                }
            }
            .position(x: rect.midX, y: rect.midY)
    }

    private func depthLayerHalo(in rect: CGRect) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: 17, style: .continuous)
                .stroke(
                    Color.cyan.opacity(0.18),
                    style: StrokeStyle(lineWidth: 1.2, dash: [7, 7])
                )
                .frame(width: rect.width + 12, height: rect.height + 12)
                .position(x: rect.midX + 7, y: rect.midY + 7)

            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(Color.white.opacity(0.12), lineWidth: 1)
                .frame(width: rect.width + 22, height: rect.height + 22)
                .position(x: rect.midX + 12, y: rect.midY + 12)
        }
        .accessibilityHidden(true)
    }

    private func depthOcclusionCutout(
        _ mask: LiveFrameDepthOcclusionMask,
        in rect: CGRect
    ) -> some View {
        let cellWidth = rect.width / CGFloat(LiveFrameDepthOcclusionMask.columnCount)
        let cellHeight = rect.height / CGFloat(LiveFrameDepthOcclusionMask.rowCount)
        return Path { path in
            for rawIndex in mask.occupiedCellIndices {
                let index = Int(rawIndex)
                let row = index / LiveFrameDepthOcclusionMask.columnCount
                let sourceColumn = index % LiveFrameDepthOcclusionMask.columnCount
                let displayColumn = isMirrored
                    ? LiveFrameDepthOcclusionMask.columnCount - 1 - sourceColumn
                    : sourceColumn
                let cellRect = CGRect(
                    x: rect.minX + CGFloat(displayColumn) * cellWidth - 0.75,
                    y: rect.minY + CGFloat(row) * cellHeight - 0.75,
                    width: cellWidth + 1.5,
                    height: cellHeight + 1.5
                )
                path.addRect(cellRect)
            }
        }
        .fill(Color.black)
        .blendMode(.destinationOut)
        .accessibilityHidden(true)
    }

    @ViewBuilder
    private func targetFrame(in rect: CGRect) -> some View {
        let isReady = guide.readiness == .ready
        let stroke = isReady
            ? LinearGradient(colors: [.mint, .green], startPoint: .topLeading, endPoint: .bottomTrailing)
            : LinearGradient(colors: [AppColors.accent, .cyan], startPoint: .topLeading, endPoint: .bottomTrailing)

        RoundedRectangle(cornerRadius: 24, style: .continuous)
            .fill(.white.opacity(0.055))
            .frame(width: rect.width, height: rect.height)
            .overlay {
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .stroke(stroke, lineWidth: isReady ? 4 : 3)
            }
            .overlay {
                Circle()
                    .fill(isReady ? Color.mint : AppColors.accent)
                    .frame(width: 8, height: 8)
            }
            .overlay {
                if guide.readiness == .holding {
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(
                            AppColors.accent.opacity(0.52),
                            style: StrokeStyle(lineWidth: 1.3, dash: [7, 6])
                        )
                        .padding(-7)
                }
            }
            .position(x: rect.midX, y: rect.midY)
            .shadow(color: .black.opacity(0.24), radius: 8, x: 0, y: 4)
    }

    private func searchingReticle(in size: CGSize) -> some View {
        RoundedRectangle(cornerRadius: 24, style: .continuous)
            .stroke(
                LinearGradient(
                    colors: [AppColors.accent.opacity(0.9), .cyan.opacity(0.8)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ),
                style: StrokeStyle(lineWidth: 2.5, dash: [11, 7])
            )
            .frame(width: min(size.width * 0.58, 270), height: min(size.height * 0.34, 300))
            .position(x: size.width / 2, y: size.height * 0.46)
    }

    private func motionStabilityCue(in rect: CGRect) -> some View {
        ZStack {
            Circle()
                .stroke(
                    Color.cyan.opacity(0.62),
                    style: StrokeStyle(lineWidth: 1.5, dash: [6, 5])
                )

            Ellipse()
                .stroke(Color.white.opacity(0.46), lineWidth: 1)
                .frame(width: 62, height: 26)

            Ellipse()
                .stroke(Color.white.opacity(0.34), lineWidth: 1)
                .frame(width: 26, height: 62)

            Circle()
                .fill(AppColors.accent.opacity(0.92))
                .frame(width: 8, height: 8)
        }
        .frame(width: 72, height: 72)
        .position(x: rect.midX, y: rect.midY)
        .shadow(color: .black.opacity(0.3), radius: 4)
        .accessibilityHidden(true)
    }

    private func thermalProtectionCue(in rect: CGRect) -> some View {
        ZStack {
            Circle()
                .fill(.black.opacity(0.42))

            Circle()
                .stroke(
                    Color.orange.opacity(0.58),
                    style: StrokeStyle(lineWidth: 1.6, dash: [7, 6])
                )

            Image(systemName: "thermometer.medium")
                .font(.system(size: 25, weight: .semibold))
                .foregroundStyle(Color.orange.opacity(0.92))
        }
        .frame(width: 72, height: 72)
        .position(x: rect.midX, y: rect.midY)
        .shadow(color: .black.opacity(0.32), radius: 4)
        .accessibilityHidden(true)
    }

    @ViewBuilder
    private func sceneHorizonGuide(in size: CGSize) -> some View {
        if guide.sceneHorizonAngleDegrees != nil {
            let guideWidth = min(size.width * 0.46, 188)
            let guideY = size.height * 0.56

            ZStack {
                Path { path in
                    path.move(to: CGPoint(x: size.width / 2 - guideWidth / 2, y: guideY))
                    path.addLine(to: CGPoint(x: size.width / 2 + guideWidth / 2, y: guideY))
                }
                .stroke(
                    Color.white.opacity(0.34),
                    style: StrokeStyle(lineWidth: 1, dash: [5, 5])
                )

                Capsule()
                    .fill(guide.isSceneHorizonNearLevel ? Color.mint : Color.cyan)
                    .frame(width: guideWidth, height: 3)
                    .overlay {
                        HStack {
                            Circle().frame(width: 6, height: 6)
                            Spacer()
                            Circle().frame(width: 6, height: 6)
                        }
                        .foregroundStyle(guide.isSceneHorizonNearLevel ? Color.mint : Color.cyan)
                    }
                    .rotationEffect(.degrees(clampedSceneHorizonDegrees))
                    .position(x: size.width / 2, y: guideY)
                    .shadow(color: .black.opacity(0.3), radius: 3)
            }
        }
    }

    @ViewBuilder
    private func levelGuide(in size: CGSize) -> some View {
        if guide.stage != .searching,
           guide.sceneHorizonAngleDegrees == nil,
           guide.rollDegrees != nil {
            Capsule()
                .fill(guide.isNearLevel ? Color.mint : Color.yellow)
                .frame(width: min(size.width * 0.34, 150), height: 3)
                .overlay {
                    Circle()
                        .fill(guide.isNearLevel ? Color.mint : Color.yellow)
                        .frame(width: 7, height: 7)
                }
                .rotationEffect(.degrees(clampedRollDegrees))
                .position(x: size.width / 2, y: size.height * 0.48)
                .shadow(color: .black.opacity(0.28), radius: 3)
        }
    }

    private var clampedRollDegrees: Double {
        min(max(guide.rollDegrees ?? 0, -12), 12)
    }

    private var clampedSceneHorizonDegrees: Double {
        min(max(guide.sceneHorizonAngleDegrees ?? 0, -18), 18)
    }

    private func mappedRect(
        _ normalizedRect: LiveFrameNormalizedRect?,
        overlaySize: CGSize
    ) -> CGRect? {
        guard let normalizedRect else { return nil }
        let displayRect = isMirrored ? mirrored(normalizedRect) : normalizedRect
        return coordinateMapper.overlayRect(
            for: displayRect,
            sourceSize: CameraFrameOrientationContract.portraitNormalizedSourceSize,
            overlaySize: overlaySize,
            contentMode: .aspectFit
        )
    }

    private func mappedPoint(
        _ normalizedPoint: LiveFramePoint?,
        previewRect: CGRect?
    ) -> CGPoint? {
        guard let normalizedPoint,
              let previewRect else {
            return nil
        }
        let displayX = isMirrored ? 1 - normalizedPoint.x : normalizedPoint.x
        return CGPoint(
            x: previewRect.minX + displayX * previewRect.width,
            y: previewRect.maxY - normalizedPoint.y * previewRect.height
        )
    }

    private func mirrored(_ rect: LiveFrameNormalizedRect) -> LiveFrameNormalizedRect {
        LiveFrameNormalizedRect(
            CGRect(x: 1 - rect.x - rect.width, y: rect.y, width: rect.width, height: rect.height)
        )
    }
}
