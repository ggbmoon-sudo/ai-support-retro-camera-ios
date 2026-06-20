import AVFoundation
import SwiftUI
import UIKit

nonisolated struct CameraDualFocalZoomConfiguration: Equatable, Sendable {
    static let maximumFocalLengthMillimeters = 100.0

    let focalLengthMillimeters: Double
    let insetSideRatio: CGFloat
    let insetCenterXRatio: CGFloat
    let insetCenterYRatio: CGFloat

    init(
        focalLengthMillimeters: Double,
        insetSideRatio: CGFloat = 0.38,
        insetCenterXRatio: CGFloat = 0.5,
        insetCenterYRatio: CGFloat = 0.43
    ) {
        self.focalLengthMillimeters = focalLengthMillimeters
        self.insetSideRatio = insetSideRatio
        self.insetCenterXRatio = insetCenterXRatio
        self.insetCenterYRatio = insetCenterYRatio
    }

    var focalLengthLabel: String {
        Self.focalLengthLabel(for: focalLengthMillimeters)
    }

    static func focalLengthRange(forBaseFocalLength baseFocalLength: Double) -> ClosedRange<Double> {
        let minimumFocalLength = Self.sanitizedFocalLength(baseFocalLength)
        let maximumFocalLength = max(minimumFocalLength, maximumFocalLengthMillimeters)
        return minimumFocalLength...maximumFocalLength
    }

    static func defaultFocalLength(forBaseFocalLength baseFocalLength: Double) -> Double {
        let preferredFocalLength = max(baseFocalLength * 2, 71)
        return clampedFocalLength(preferredFocalLength, baseFocalLength: baseFocalLength)
    }

    static func clampedFocalLength(
        _ focalLength: Double,
        baseFocalLength: Double
    ) -> Double {
        let range = focalLengthRange(forBaseFocalLength: baseFocalLength)
        return min(max(focalLength, range.lowerBound), range.upperBound)
    }

    static func focalLengthLabel(for focalLength: Double) -> String {
        "\(Int(focalLength.rounded()))mm"
    }

    func zoomFactor(relativeToBaseFocalLength baseFocalLength: Double) -> CGFloat {
        CGFloat(max(focalLengthMillimeters / Self.sanitizedFocalLength(baseFocalLength), 1))
    }

    func progress(in range: ClosedRange<Double>) -> Double {
        let span = max(range.upperBound - range.lowerBound, 1)
        return min(max((focalLengthMillimeters - range.lowerBound) / span, 0), 1)
    }

    private static func sanitizedFocalLength(_ focalLength: Double) -> Double {
        max(focalLength.rounded(), 1)
    }
}

enum CameraDualFocalPhotoRenderer {
    static func render(
        image: UIImage,
        configuration: CameraDualFocalZoomConfiguration,
        baseFocalLengthMillimeters: Double
    ) -> UIImage {
        let normalizedImage = image.normalizedForDualFocalRendering()
        let imageSize = normalizedImage.size

        guard imageSize.width > 0,
              imageSize.height > 0,
              let sourceCGImage = normalizedImage.cgImage else {
            return image
        }

        let insetRect = insetRect(for: imageSize, configuration: configuration)
        let sourceCropRect = cropRect(
            imageSize: imageSize,
            insetRect: insetRect,
            zoomFactor: configuration.zoomFactor(relativeToBaseFocalLength: baseFocalLengthMillimeters)
        )
        let pixelXScale = CGFloat(sourceCGImage.width) / imageSize.width
        let pixelYScale = CGFloat(sourceCGImage.height) / imageSize.height
        let proposedPixelCropRect = CGRect(
            x: sourceCropRect.minX * pixelXScale,
            y: sourceCropRect.minY * pixelYScale,
            width: sourceCropRect.width * pixelXScale,
            height: sourceCropRect.height * pixelYScale
        ).integral
        let pixelImageBounds = CGRect(
            x: 0,
            y: 0,
            width: CGFloat(sourceCGImage.width),
            height: CGFloat(sourceCGImage.height)
        )
        let pixelCropRect = proposedPixelCropRect.intersection(pixelImageBounds)

        guard pixelCropRect.width > 0,
              pixelCropRect.height > 0,
              let croppedCGImage = sourceCGImage.cropping(to: pixelCropRect) else {
            return normalizedImage
        }

        let croppedImage = UIImage(
            cgImage: croppedCGImage,
            scale: normalizedImage.scale,
            orientation: .up
        )
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = normalizedImage.scale
        format.opaque = true

        return UIGraphicsImageRenderer(size: imageSize, format: format).image { rendererContext in
            normalizedImage.draw(in: CGRect(origin: .zero, size: imageSize))
            drawInset(
                croppedImage: croppedImage,
                insetRect: insetRect,
                imageSize: imageSize,
                label: configuration.focalLengthLabel,
                context: rendererContext.cgContext
            )
        }
    }

    private static func insetRect(
        for imageSize: CGSize,
        configuration: CameraDualFocalZoomConfiguration
    ) -> CGRect {
        let side = min(imageSize.width, imageSize.height) * configuration.insetSideRatio
        let center = CGPoint(
            x: imageSize.width * configuration.insetCenterXRatio,
            y: imageSize.height * configuration.insetCenterYRatio
        )
        return CGRect(
            x: center.x - side / 2,
            y: center.y - side / 2,
            width: side,
            height: side
        )
    }

    private static func cropRect(
        imageSize: CGSize,
        insetRect: CGRect,
        zoomFactor: CGFloat
    ) -> CGRect {
        let cropSide = min(imageSize.width, imageSize.height) / max(zoomFactor, 1)
        let center = CGPoint(x: insetRect.midX, y: insetRect.midY)
        let proposed = CGRect(
            x: center.x - cropSide / 2,
            y: center.y - cropSide / 2,
            width: cropSide,
            height: cropSide
        )
        let maxX = max(imageSize.width - cropSide, 0)
        let maxY = max(imageSize.height - cropSide, 0)

        return CGRect(
            x: min(max(proposed.minX, 0), maxX),
            y: min(max(proposed.minY, 0), maxY),
            width: cropSide,
            height: cropSide
        )
    }

    private static func drawInset(
        croppedImage: UIImage,
        insetRect: CGRect,
        imageSize: CGSize,
        label: String,
        context: CGContext
    ) {
        let cornerRadius = max(imageSize.width * 0.018, 16)
        let borderWidth = max(imageSize.width * 0.004, 3)
        let path = UIBezierPath(roundedRect: insetRect, cornerRadius: cornerRadius)

        context.saveGState()
        path.addClip()
        croppedImage.draw(in: insetRect)
        context.restoreGState()

        UIColor.white.withAlphaComponent(0.96).setStroke()
        path.lineWidth = borderWidth
        path.stroke()

        let font = UIFont.systemFont(ofSize: max(imageSize.width * 0.035, 22), weight: .bold)
        let shadow = NSShadow()
        shadow.shadowColor = UIColor.black.withAlphaComponent(0.46)
        shadow.shadowBlurRadius = max(imageSize.width * 0.004, 3)
        shadow.shadowOffset = CGSize(width: 0, height: 1)
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .foregroundColor: UIColor.white,
            .shadow: shadow
        ]
        let labelSize = label.size(withAttributes: attributes)
        let labelOrigin = CGPoint(
            x: insetRect.midX - labelSize.width / 2,
            y: max(insetRect.minY - labelSize.height - imageSize.height * 0.012, imageSize.height * 0.04)
        )
        label.draw(at: labelOrigin, withAttributes: attributes)
    }
}

struct CameraDualFocalViewfinderOverlay: View {
    let session: AVCaptureSession
    let isMirrored: Bool
    let configuration: CameraDualFocalZoomConfiguration
    let baseFocalLengthMillimeters: Double
    let focalLengthRange: ClosedRange<Double>
    let selectedFilterPreset: FilterPreset
    let onFocalLengthChange: (Double) -> Void

    var body: some View {
        GeometryReader { proxy in
            let side = min(proxy.size.width, proxy.size.height) * configuration.insetSideRatio
            let centerX = proxy.size.width * configuration.insetCenterXRatio
            let centerY = proxy.size.height * configuration.insetCenterYRatio
            let progress = CGFloat(configuration.progress(in: focalLengthRange))

            ZStack {
                Text(configuration.focalLengthLabel)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white)
                    .shadow(color: .black.opacity(0.54), radius: 3, x: 0, y: 1)
                    .position(
                        x: centerX,
                        y: max(centerY - side / 2 - 16, 44)
                    )

                ZStack {
                    CameraPreviewView(session: session, isMirrored: isMirrored)
                        .liveFilterPreview(selectedFilterPreset)
                        .scaleEffect(
                            configuration.zoomFactor(relativeToBaseFocalLength: baseFocalLengthMillimeters),
                            anchor: .center
                        )

                    VStack {
                        Spacer()
                        focalScrubber(progress: progress, width: side * 0.68)
                            .padding(.bottom, 8)
                    }
                }
                .frame(width: side, height: side)
                .clipped()
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                .overlay {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .stroke(.white.opacity(0.94), lineWidth: 2)
                }
                .shadow(color: .black.opacity(0.24), radius: 10, x: 0, y: 5)
                .contentShape(Rectangle())
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            let clampedX = min(max(value.location.x, 0), side)
                            let dragProgress = Double(clampedX / max(side, 1))
                            let span = focalLengthRange.upperBound - focalLengthRange.lowerBound
                            onFocalLengthChange(focalLengthRange.lowerBound + span * dragProgress)
                        }
                )
                .position(x: centerX, y: centerY)
            }
            .frame(width: proxy.size.width, height: proxy.size.height)
        }
        .accessibilityHidden(true)
    }

    private func focalScrubber(progress: CGFloat, width: CGFloat) -> some View {
        ZStack(alignment: .leading) {
            Capsule()
                .fill(.black.opacity(0.34))
                .frame(width: width, height: 4)

            Capsule()
                .fill(.white.opacity(0.9))
                .frame(width: max(width * progress, 4), height: 4)

            Circle()
                .fill(.white)
                .frame(width: 12, height: 12)
                .shadow(color: .black.opacity(0.24), radius: 3, x: 0, y: 1)
                .offset(x: min(max(width * progress - 6, 0), max(width - 12, 0)))
        }
        .frame(width: width, height: 16, alignment: .leading)
    }
}

private extension UIImage {
    nonisolated func normalizedForDualFocalRendering() -> UIImage {
        guard imageOrientation != .up else { return self }

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = scale
        format.opaque = true

        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
