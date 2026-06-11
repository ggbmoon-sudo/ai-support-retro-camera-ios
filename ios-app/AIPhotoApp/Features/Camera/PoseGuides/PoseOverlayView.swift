import SwiftUI

struct PoseOverlayView: View {
    let guide: PoseGuide
    let isMirrored: Bool
    let opacity: Double

    var body: some View {
        GeometryReader { proxy in
            let overlayRect = overlayFrame(in: proxy.size)

            PoseLineArtView(guideID: guide.id)
                .frame(width: overlayRect.width, height: overlayRect.height)
                .scaleEffect(x: isMirrored && guide.supportsMirroring ? -1 : 1, y: 1)
                .position(x: overlayRect.midX, y: overlayRect.midY)
        }
        .opacity(opacity)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }

    private func overlayFrame(in size: CGSize) -> CGRect {
        let scale = CGFloat(min(max(guide.defaultScale, 0.62), 1.02))
        let width = size.width * scale
        let height = size.height * scale
        let offsetX = CGFloat(guide.defaultOffsetNormX) * size.width
        let offsetY = CGFloat(guide.defaultOffsetNormY) * size.height
        let centerX = size.width / 2 + offsetX

        switch guide.anchor {
        case .center:
            return CGRect(
                x: centerX - width / 2,
                y: size.height / 2 - height / 2 + offsetY,
                width: width,
                height: height
            )
        case .bottomCenter:
            return CGRect(
                x: centerX - width / 2,
                y: size.height * 0.98 - height + offsetY,
                width: width,
                height: height
            )
        }
    }
}

private struct PoseLineArtView: View {
    let guideID: String

    var body: some View {
        Canvas { context, size in
            var path = Path()
            PoseOutlineBuilder.appendOutline(for: guideID, in: CGRect(origin: .zero, size: size), to: &path)

            let lineWidth = max(3, min(size.width, size.height) * 0.016)
            context.stroke(
                path,
                with: .color(Color(red: 1.0, green: 0.93, blue: 0.78).opacity(0.98)),
                style: StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round)
            )
        }
        .shadow(color: .black.opacity(0.5), radius: 5, x: 0, y: 2)
    }
}

private enum PoseOutlineBuilder {
    static func appendOutline(for guideID: String, in rect: CGRect, to path: inout Path) {
        switch guideID {
        case "solo_walk":
            appendStandingFigure(to: &path, in: rect, centerX: 0.5, headY: 0.18, scale: 1.0, lean: -0.18, armStyle: .walking, legStyle: .walking)
        case "half_body_turn_back":
            appendStandingFigure(to: &path, in: rect, centerX: 0.5, headY: 0.16, scale: 1.06, lean: 0.22, armStyle: .turnBack, legStyle: .hidden)
        case "couple_side_by_side":
            appendStandingFigure(to: &path, in: rect, centerX: 0.38, headY: 0.18, scale: 0.92, lean: -0.05, armStyle: .relaxed, legStyle: .straight)
            appendStandingFigure(to: &path, in: rect, centerX: 0.62, headY: 0.18, scale: 0.9, lean: 0.05, armStyle: .relaxed, legStyle: .straight)
            appendLinkLine(to: &path, in: rect, from: (0.46, 0.48), to: (0.54, 0.48))
        case "couple_staggered":
            appendStandingFigure(to: &path, in: rect, centerX: 0.43, headY: 0.17, scale: 0.94, lean: 0.08, armStyle: .relaxed, legStyle: .straight)
            appendStandingFigure(to: &path, in: rect, centerX: 0.62, headY: 0.24, scale: 0.78, lean: -0.1, armStyle: .turnBack, legStyle: .walking)
        case "menswear_wall_lean":
            appendWallLine(to: &path, in: rect, x: 0.72)
            appendStandingFigure(to: &path, in: rect, centerX: 0.52, headY: 0.18, scale: 1.0, lean: 0.26, armStyle: .crossed, legStyle: .crossed)
        case "womenswear_hair_touch":
            appendStandingFigure(to: &path, in: rect, centerX: 0.5, headY: 0.16, scale: 1.0, lean: -0.12, armStyle: .hairTouch, legStyle: .soft)
        case "seated_side_pose":
            appendSeatedFigure(to: &path, in: rect, centerX: 0.52, headY: 0.2, scale: 1.0, lean: -0.08)
        default:
            appendStandingFigure(to: &path, in: rect, centerX: 0.5, headY: 0.18, scale: 1.0, lean: 0.08, armStyle: .relaxed, legStyle: .straight)
        }
    }

    private enum ArmStyle {
        case relaxed
        case walking
        case turnBack
        case crossed
        case hairTouch
    }

    private enum LegStyle {
        case straight
        case walking
        case crossed
        case soft
        case hidden
    }

    private static func appendStandingFigure(
        to path: inout Path,
        in rect: CGRect,
        centerX: CGFloat,
        headY: CGFloat,
        scale: CGFloat,
        lean: CGFloat,
        armStyle: ArmStyle,
        legStyle: LegStyle
    ) {
        let headCenter = point(centerX, headY, in: rect)
        let headWidth = rect.width * 0.09 * scale
        let headHeight = rect.height * 0.064 * scale
        path.addEllipse(in: CGRect(x: headCenter.x - headWidth / 2, y: headCenter.y - headHeight / 2, width: headWidth, height: headHeight))

        let neck = point(centerX + lean * 0.018, headY + 0.07 * scale, in: rect)
        let shoulderLeft = point(centerX - 0.09 * scale + lean * 0.04, headY + 0.12 * scale, in: rect)
        let shoulderRight = point(centerX + 0.09 * scale + lean * 0.04, headY + 0.12 * scale, in: rect)
        let hip = point(centerX - lean * 0.03, headY + 0.39 * scale, in: rect)
        let waistLeft = point(centerX - 0.055 * scale, headY + 0.34 * scale, in: rect)
        let waistRight = point(centerX + 0.055 * scale, headY + 0.34 * scale, in: rect)

        path.move(to: neck)
        path.addQuadCurve(to: hip, control: point(centerX + lean * 0.09, headY + 0.25 * scale, in: rect))
        path.move(to: shoulderLeft)
        path.addQuadCurve(to: shoulderRight, control: neck)
        path.move(to: shoulderLeft)
        path.addQuadCurve(to: waistLeft, control: point(centerX - 0.13 * scale, headY + 0.25 * scale, in: rect))
        path.move(to: shoulderRight)
        path.addQuadCurve(to: waistRight, control: point(centerX + 0.13 * scale, headY + 0.25 * scale, in: rect))

        appendArms(to: &path, in: rect, centerX: centerX, headY: headY, scale: scale, lean: lean, style: armStyle)
        appendLegs(to: &path, in: rect, centerX: centerX, headY: headY, scale: scale, lean: lean, style: legStyle)
    }

    private static func appendArms(
        to path: inout Path,
        in rect: CGRect,
        centerX: CGFloat,
        headY: CGFloat,
        scale: CGFloat,
        lean: CGFloat,
        style: ArmStyle
    ) {
        let leftShoulder = point(centerX - 0.085 * scale + lean * 0.04, headY + 0.13 * scale, in: rect)
        let rightShoulder = point(centerX + 0.085 * scale + lean * 0.04, headY + 0.13 * scale, in: rect)

        switch style {
        case .relaxed:
            drawLimb(&path, from: leftShoulder, through: point(centerX - 0.14 * scale, headY + 0.27 * scale, in: rect), to: point(centerX - 0.09 * scale, headY + 0.43 * scale, in: rect))
            drawLimb(&path, from: rightShoulder, through: point(centerX + 0.14 * scale, headY + 0.27 * scale, in: rect), to: point(centerX + 0.08 * scale, headY + 0.43 * scale, in: rect))
        case .walking:
            drawLimb(&path, from: leftShoulder, through: point(centerX - 0.17 * scale, headY + 0.25 * scale, in: rect), to: point(centerX - 0.02 * scale, headY + 0.43 * scale, in: rect))
            drawLimb(&path, from: rightShoulder, through: point(centerX + 0.17 * scale, headY + 0.28 * scale, in: rect), to: point(centerX + 0.15 * scale, headY + 0.42 * scale, in: rect))
        case .turnBack:
            drawLimb(&path, from: leftShoulder, through: point(centerX - 0.16 * scale, headY + 0.24 * scale, in: rect), to: point(centerX - 0.12 * scale, headY + 0.38 * scale, in: rect))
            drawLimb(&path, from: rightShoulder, through: point(centerX + 0.16 * scale, headY + 0.22 * scale, in: rect), to: point(centerX + 0.18 * scale, headY + 0.34 * scale, in: rect))
        case .crossed:
            path.move(to: leftShoulder)
            path.addLine(to: point(centerX + 0.08 * scale, headY + 0.29 * scale, in: rect))
            path.move(to: rightShoulder)
            path.addLine(to: point(centerX - 0.08 * scale, headY + 0.31 * scale, in: rect))
        case .hairTouch:
            drawLimb(&path, from: leftShoulder, through: point(centerX - 0.12 * scale, headY + 0.24 * scale, in: rect), to: point(centerX - 0.08 * scale, headY + 0.42 * scale, in: rect))
            drawLimb(&path, from: rightShoulder, through: point(centerX + 0.15 * scale, headY + 0.05 * scale, in: rect), to: point(centerX + 0.04 * scale, headY - 0.01 * scale, in: rect))
        }
    }

    private static func appendLegs(
        to path: inout Path,
        in rect: CGRect,
        centerX: CGFloat,
        headY: CGFloat,
        scale: CGFloat,
        lean: CGFloat,
        style: LegStyle
    ) {
        guard style != .hidden else { return }

        let hipLeft = point(centerX - 0.04 * scale - lean * 0.02, headY + 0.39 * scale, in: rect)
        let hipRight = point(centerX + 0.04 * scale - lean * 0.02, headY + 0.39 * scale, in: rect)

        switch style {
        case .straight:
            drawLimb(&path, from: hipLeft, through: point(centerX - 0.07 * scale, headY + 0.6 * scale, in: rect), to: point(centerX - 0.09 * scale, headY + 0.79 * scale, in: rect))
            drawLimb(&path, from: hipRight, through: point(centerX + 0.07 * scale, headY + 0.6 * scale, in: rect), to: point(centerX + 0.1 * scale, headY + 0.79 * scale, in: rect))
        case .walking:
            drawLimb(&path, from: hipLeft, through: point(centerX - 0.16 * scale, headY + 0.58 * scale, in: rect), to: point(centerX - 0.22 * scale, headY + 0.78 * scale, in: rect))
            drawLimb(&path, from: hipRight, through: point(centerX + 0.08 * scale, headY + 0.61 * scale, in: rect), to: point(centerX + 0.19 * scale, headY + 0.78 * scale, in: rect))
        case .crossed:
            drawLimb(&path, from: hipLeft, through: point(centerX + 0.04 * scale, headY + 0.6 * scale, in: rect), to: point(centerX - 0.02 * scale, headY + 0.79 * scale, in: rect))
            drawLimb(&path, from: hipRight, through: point(centerX + 0.12 * scale, headY + 0.6 * scale, in: rect), to: point(centerX + 0.18 * scale, headY + 0.79 * scale, in: rect))
        case .soft:
            drawLimb(&path, from: hipLeft, through: point(centerX - 0.1 * scale, headY + 0.59 * scale, in: rect), to: point(centerX - 0.14 * scale, headY + 0.77 * scale, in: rect))
            drawLimb(&path, from: hipRight, through: point(centerX + 0.04 * scale, headY + 0.59 * scale, in: rect), to: point(centerX + 0.09 * scale, headY + 0.77 * scale, in: rect))
        case .hidden:
            break
        }
    }

    private static func appendSeatedFigure(
        to path: inout Path,
        in rect: CGRect,
        centerX: CGFloat,
        headY: CGFloat,
        scale: CGFloat,
        lean: CGFloat
    ) {
        appendStandingFigure(to: &path, in: rect, centerX: centerX, headY: headY, scale: scale, lean: lean, armStyle: .relaxed, legStyle: .hidden)

        let hip = point(centerX - 0.03 * scale, headY + 0.42 * scale, in: rect)
        let kneeFront = point(centerX + 0.22 * scale, headY + 0.58 * scale, in: rect)
        let footFront = point(centerX + 0.34 * scale, headY + 0.72 * scale, in: rect)
        let kneeBack = point(centerX - 0.14 * scale, headY + 0.58 * scale, in: rect)
        let footBack = point(centerX - 0.24 * scale, headY + 0.71 * scale, in: rect)

        drawLimb(&path, from: hip, through: kneeFront, to: footFront)
        drawLimb(&path, from: hip, through: kneeBack, to: footBack)
        path.move(to: point(centerX - 0.28 * scale, headY + 0.73 * scale, in: rect))
        path.addLine(to: point(centerX + 0.36 * scale, headY + 0.73 * scale, in: rect))
    }

    private static func appendWallLine(to path: inout Path, in rect: CGRect, x: CGFloat) {
        path.move(to: point(x, 0.08, in: rect))
        path.addLine(to: point(x, 0.88, in: rect))
    }

    private static func appendLinkLine(to path: inout Path, in rect: CGRect, from: (CGFloat, CGFloat), to: (CGFloat, CGFloat)) {
        path.move(to: point(from.0, from.1, in: rect))
        path.addLine(to: point(to.0, to.1, in: rect))
    }

    private static func drawLimb(_ path: inout Path, from start: CGPoint, through control: CGPoint, to end: CGPoint) {
        path.move(to: start)
        path.addQuadCurve(to: end, control: control)
    }

    private static func point(_ x: CGFloat, _ y: CGFloat, in rect: CGRect) -> CGPoint {
        CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y)
    }
}
