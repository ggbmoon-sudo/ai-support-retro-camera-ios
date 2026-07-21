import CoreGraphics
import Foundation
import SwiftUI

/// A deliberately staged guide inspired by a camera viewfinder workflow:
/// scan one keyframe, aim one locked subject at one target, then refine one frame.
/// It never renders detector alternatives, confidence, scores, or cloud details.
struct HybridCompositionLiveOverlayView: View {
    @Environment(\.accessibilityReduceMotion) private var accessibilityReduceMotion

    let stage: HybridCompositionLiveGuideStage
    let guide: LocalAIComposeGuide
    let aimFeedback: HybridCompositionAimFeedback
    let aimHoldProgress: Double
    let isMirrored: Bool
    let failureMessageKey: String?

    private let coordinateMapper = CameraOverlayCoordinateMapper()

    var body: some View {
        GeometryReader { proxy in
            let size = proxy.size
            let previewRect = coordinateMapper.displayedContentRect(
                sourceSize: CameraFrameOrientationContract.portraitNormalizedSourceSize,
                overlaySize: size,
                contentMode: .aspectFit
            )
            let subjectRect = mappedRect(guide.subjectBox, overlaySize: size)
            let targetRect = mappedRect(guide.targetBox, overlaySize: size)
            let targetPoint = mappedPoint(guide.targetAnchor, previewRect: previewRect)

            ZStack {
                switch stage {
                case .idle:
                    EmptyView()

                case .analyzing:
                    analysisField(in: previewRect)

                case .aiming:
                    aimingGuide(
                        subjectRect: subjectRect,
                        targetPoint: targetPoint,
                        previewRect: previewRect
                    )

                case .framing, .ready:
                    compositionFrame(
                        targetRect: targetRect,
                        previewRect: previewRect,
                        isReady: stage == .ready
                    )

                case .failed:
                    failureMark(in: previewRect)
                }

                VStack(spacing: 0) {
                    statusPill
                        .padding(.horizontal, 34)
                        .padding(.top, max(proxy.safeAreaInsets.top + 72, 112))

                    Spacer()

                    if stage != .idle {
                        detailPill
                            .padding(.horizontal, 34)
                            .padding(.bottom, max(proxy.safeAreaInsets.bottom + 174, 202))
                    }
                }
            }
        }
        .allowsHitTesting(false)
        .accessibilityElement(children: .combine)
        .animation(
            accessibilityReduceMotion ? nil : .easeInOut(duration: 0.24),
            value: stage
        )
    }

    @ViewBuilder
    private var statusPill: some View {
        HStack(spacing: 9) {
            switch stage {
            case .analyzing:
                ProgressView()
                    .tint(.white)
                    .controlSize(.small)
            case .aiming:
                Image(systemName: "scope")
            case .framing:
                Image(systemName: "viewfinder")
            case .ready:
                Image(systemName: "checkmark.circle.fill")
                    .foregroundStyle(Color.mint)
            case .failed:
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundStyle(Color.orange)
            case .idle:
                EmptyView()
            }

            Text(LocalizedStringKey(statusTitleKey))
                .font(.callout.weight(.semibold))
                .multilineTextAlignment(.center)

            if stage == .analyzing {
                Text("camera.hybrid_compose.live.single_keyframe")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(Color.cyan)
            }
        }
        .foregroundStyle(.white)
        .padding(.horizontal, 16)
        .padding(.vertical, 11)
        .background(.black.opacity(0.68), in: Capsule())
        .overlay {
            Capsule()
                .stroke(statusStroke, lineWidth: 1.2)
        }
        .shadow(color: .black.opacity(0.32), radius: 6, y: 3)
    }

    private var detailPill: some View {
        HStack(spacing: 9) {
            Image(systemName: detailSystemImage)
                .font(.callout.weight(.bold))

            Text(LocalizedStringKey(detailKey))
                .font(.footnote.weight(.semibold))
                .multilineTextAlignment(.center)
        }
        .foregroundStyle(.white.opacity(0.96))
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(.black.opacity(0.70), in: Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.16), lineWidth: 1)
        }
    }

    private func analysisField(in rect: CGRect) -> some View {
        TimelineView(.animation(minimumInterval: accessibilityReduceMotion ? 0.8 : 0.12)) { timeline in
            let phase = timeline.date.timeIntervalSinceReferenceDate * 2.4

            ZStack {
                ForEach(0..<42, id: \.self) { index in
                    let column = index % 6
                    let row = index / 6
                    let wave = (sin(phase + Double(index) * 0.72) + 1) / 2
                    let x = rect.minX + rect.width * (0.10 + CGFloat(column) * 0.16)
                    let y = rect.minY + rect.height * (0.14 + CGFloat(row) * 0.12)

                    Circle()
                        .fill(analysisColor(for: index))
                        .frame(
                            width: 4.5 + CGFloat(wave) * 3.5,
                            height: 4.5 + CGFloat(wave) * 3.5
                        )
                        .opacity(0.28 + wave * 0.66)
                        .position(x: x, y: y)
                }

                Capsule()
                    .fill(
                        LinearGradient(
                            colors: [Color.cyan.opacity(0.72), AppColors.accent.opacity(0.88)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(width: min(rect.width * 0.42, 184), height: 3)
                    .position(
                        x: rect.midX,
                        y: rect.minY + rect.height * (0.36 + CGFloat((sin(phase * 0.45) + 1) * 0.12))
                    )
                    .shadow(color: Color.cyan.opacity(0.42), radius: 5)
            }
        }
        .accessibilityHidden(true)
    }

    @ViewBuilder
    private func aimingGuide(
        subjectRect: CGRect?,
        targetPoint: CGPoint?,
        previewRect: CGRect
    ) -> some View {
        if let subjectRect,
           let targetPoint {
            let subjectPoint = CGPoint(x: subjectRect.midX, y: subjectRect.midY)

            Path { path in
                path.move(to: subjectPoint)
                path.addLine(to: targetPoint)
            }
            .stroke(
                Color.white.opacity(0.58),
                style: StrokeStyle(lineWidth: 1.8, lineCap: .round, dash: [7, 7])
            )

            targetReticle
                .position(targetPoint)

            coloredRing
                .position(subjectPoint)
        } else {
            reacquiringRing
                .position(x: previewRect.midX, y: previewRect.midY)
        }
    }

    private var coloredRing: some View {
        ZStack {
            Circle()
                .stroke(
                    AngularGradient(
                        colors: aimRingColors,
                        center: .center
                    ),
                    lineWidth: aimFeedback == .holding ? 5 : 4
                )

            if aimHoldProgress > 0 {
                Circle()
                    .trim(from: 0, to: CGFloat(aimHoldProgress))
                    .stroke(
                        Color.mint,
                        style: StrokeStyle(lineWidth: 3, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .padding(-6)
            }

            Circle()
                .stroke(Color.white.opacity(0.72), lineWidth: 1)
                .padding(6)
        }
        .frame(width: 42, height: 42)
        .scaleEffect(aimFeedback == .holding ? 0.88 : 1)
        .shadow(color: aimRingShadowColor, radius: aimFeedback == .holding ? 10 : 7)
        .animation(
            accessibilityReduceMotion ? nil : .easeInOut(duration: 0.16),
            value: aimFeedback
        )
        .animation(
            accessibilityReduceMotion ? nil : .linear(duration: 0.08),
            value: aimHoldProgress
        )
    }

    private var targetReticle: some View {
        ZStack {
            Circle()
                .stroke(targetReticleColor, lineWidth: 2)
                .frame(width: 18, height: 18)

            Path { path in
                path.move(to: CGPoint(x: 12, y: 0))
                path.addLine(to: CGPoint(x: 12, y: 7))
                path.move(to: CGPoint(x: 12, y: 17))
                path.addLine(to: CGPoint(x: 12, y: 24))
                path.move(to: CGPoint(x: 0, y: 12))
                path.addLine(to: CGPoint(x: 7, y: 12))
                path.move(to: CGPoint(x: 17, y: 12))
                path.addLine(to: CGPoint(x: 24, y: 12))
            }
            .stroke(targetReticleColor, lineWidth: 2)
            .frame(width: 24, height: 24)
        }
        .frame(width: 30, height: 30)
        .shadow(color: .black.opacity(0.55), radius: 3)
    }

    private var reacquiringRing: some View {
        Circle()
            .stroke(
                LinearGradient(
                    colors: [.cyan.opacity(0.75), AppColors.accent.opacity(0.75)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ),
                style: StrokeStyle(lineWidth: 2, dash: [7, 6])
            )
            .frame(width: 58, height: 58)
    }

    @ViewBuilder
    private func compositionFrame(
        targetRect: CGRect?,
        previewRect: CGRect,
        isReady: Bool
    ) -> some View {
        if let targetRect {
            Path { path in
                path.addRect(previewRect)
                path.addRoundedRect(
                    in: targetRect,
                    cornerSize: CGSize(width: 24, height: 24)
                )
            }
            .fill(
                Color.black.opacity(isReady ? 0.18 : 0.30),
                style: FillStyle(eoFill: true)
            )

            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(
                    AngularGradient(
                        colors: isReady
                            ? [.mint, .white, .mint]
                            : [.cyan, .mint, AppColors.accent, .pink, .cyan],
                        center: .center
                    ),
                    lineWidth: isReady ? 4.5 : 4
                )
                .frame(width: targetRect.width, height: targetRect.height)
                .position(x: targetRect.midX, y: targetRect.midY)
                .shadow(
                    color: isReady ? Color.mint.opacity(0.46) : Color.cyan.opacity(0.42),
                    radius: 8
                )

            if isReady {
                Image(systemName: "checkmark")
                    .font(.system(size: 20, weight: .black))
                    .foregroundStyle(.black)
                    .frame(width: 38, height: 38)
                    .background(Color.mint, in: Circle())
                    .position(x: targetRect.maxX - 8, y: targetRect.minY + 8)
            }
        }
    }

    private func failureMark(in rect: CGRect) -> some View {
        Image(systemName: "exclamationmark.triangle.fill")
            .font(.system(size: 30, weight: .semibold))
            .foregroundStyle(Color.orange)
            .frame(width: 72, height: 72)
            .background(.black.opacity(0.58), in: Circle())
            .position(x: rect.midX, y: rect.midY)
    }

    private var statusTitleKey: String {
        switch stage {
        case .idle:
            return "camera.hybrid_compose.live.idle"
        case .analyzing:
            return "camera.hybrid_compose.live.analyzing"
        case .aiming:
            return "camera.hybrid_compose.live.aim"
        case .framing:
            return "camera.hybrid_compose.live.frame"
        case .ready:
            return "camera.hybrid_compose.live.ready"
        case .failed:
            return "camera.hybrid_compose.live.failed"
        }
    }

    private var detailKey: String {
        switch stage {
        case .idle:
            return "camera.hybrid_compose.live.idle"
        case .analyzing:
            return "camera.hybrid_compose.live.analyzing_detail"
        case .aiming:
            if guide.subjectBox == nil {
                return "camera.hybrid_compose.live.reacquiring"
            }
            switch aimFeedback {
            case .seeking:
                return "camera.hybrid_compose.live.aim_detail"
            case .near:
                return "camera.hybrid_compose.live.aim_near"
            case .holding:
                return "camera.hybrid_compose.live.aim_hold"
            }
        case .framing:
            return guide.subjectBox == nil
                ? "camera.hybrid_compose.live.reacquiring"
                : guide.guidanceAction?.instructionKey
                    ?? "camera.hybrid_compose.live.frame_detail"
        case .ready:
            return "camera.hybrid_compose.live.ready_detail"
        case .failed:
            return failureMessageKey ?? "camera.hybrid_compose.error.unavailable"
        }
    }

    private var detailSystemImage: String {
        switch stage {
        case .idle:
            return "viewfinder"
        case .analyzing:
            return "arrow.up.circle"
        case .aiming:
            return guide.subjectBox == nil ? "arrow.clockwise" : "move.3d"
        case .framing:
            return guide.subjectBox == nil
                ? "arrow.clockwise"
                : guide.guidanceAction?.systemImage ?? "viewfinder"
        case .ready:
            return "camera.shutter.button"
        case .failed:
            return "arrow.clockwise"
        }
    }

    private var statusStroke: Color {
        if stage == .aiming, aimFeedback == .holding {
            return .mint.opacity(0.82)
        }
        switch stage {
        case .ready:
            return .mint.opacity(0.72)
        case .failed:
            return .orange.opacity(0.72)
        case .analyzing, .aiming, .framing:
            return .cyan.opacity(0.52)
        case .idle:
            return .clear
        }
    }

    private var aimRingColors: [Color] {
        switch aimFeedback {
        case .seeking:
            return [.cyan, .mint, AppColors.accent, .pink, .cyan]
        case .near:
            return [.yellow, .cyan, .yellow]
        case .holding:
            return [.mint, .white, .mint]
        }
    }

    private var aimRingShadowColor: Color {
        switch aimFeedback {
        case .seeking:
            return .cyan.opacity(0.50)
        case .near:
            return .yellow.opacity(0.58)
        case .holding:
            return .mint.opacity(0.72)
        }
    }

    private var targetReticleColor: Color {
        switch aimFeedback {
        case .seeking:
            return .white.opacity(0.94)
        case .near:
            return .yellow
        case .holding:
            return .mint
        }
    }

    private func analysisColor(for index: Int) -> Color {
        switch index % 4 {
        case 0:
            return .cyan
        case 1:
            return .mint
        case 2:
            return AppColors.accent
        default:
            return .pink
        }
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
        previewRect: CGRect
    ) -> CGPoint? {
        guard let normalizedPoint else { return nil }
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
