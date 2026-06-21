import SwiftUI
import UIKit

nonisolated struct CameraDualFocalZoomConfiguration: Equatable, Sendable {
    static let maximumFocalLengthMillimeters = 100.0

    let focalLengthMillimeters: Double
    let framingBoxCenterXRatio: CGFloat
    let framingBoxCenterYRatio: CGFloat

    init(
        focalLengthMillimeters: Double,
        framingBoxCenterXRatio: CGFloat = 0.5,
        framingBoxCenterYRatio: CGFloat = 0.43
    ) {
        self.focalLengthMillimeters = focalLengthMillimeters
        self.framingBoxCenterXRatio = framingBoxCenterXRatio
        self.framingBoxCenterYRatio = framingBoxCenterYRatio
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
        clampedFocalLength(55, baseFocalLength: baseFocalLength)
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

    func cropScale(relativeToBaseFocalLength baseFocalLength: Double) -> CGFloat {
        CGFloat(max(focalLengthMillimeters / Self.sanitizedFocalLength(baseFocalLength), 1))
    }

    func framingBoxSideRatio(relativeToBaseFocalLength baseFocalLength: Double) -> CGFloat {
        let ratio = Self.sanitizedFocalLength(baseFocalLength) / max(focalLengthMillimeters, 1)
        return min(max(CGFloat(ratio), 0.18), 1)
    }

    func progress(in range: ClosedRange<Double>) -> Double {
        let span = max(range.upperBound - range.lowerBound, 1)
        return min(max((focalLengthMillimeters - range.lowerBound) / span, 0), 1)
    }

    private static func sanitizedFocalLength(_ focalLength: Double) -> Double {
        max(focalLength.rounded(), 1)
    }
}

enum CameraDualFocalPhotoCropper {
    static func crop(
        image: UIImage,
        configuration: CameraDualFocalZoomConfiguration,
        baseFocalLengthMillimeters: Double,
        isPreviewMirrored: Bool
    ) -> UIImage {
        let normalizedImage = image.normalizedForDualFocalCrop()
        let imageSize = normalizedImage.size

        guard imageSize.width > 0,
              imageSize.height > 0,
              let sourceCGImage = normalizedImage.cgImage else {
            return image
        }

        let cropRect = cropRect(
            imageSize: imageSize,
            configuration: configuration,
            baseFocalLengthMillimeters: baseFocalLengthMillimeters,
            isPreviewMirrored: isPreviewMirrored
        )
        let pixelXScale = CGFloat(sourceCGImage.width) / imageSize.width
        let pixelYScale = CGFloat(sourceCGImage.height) / imageSize.height
        let proposedPixelCropRect = CGRect(
            x: cropRect.minX * pixelXScale,
            y: cropRect.minY * pixelYScale,
            width: cropRect.width * pixelXScale,
            height: cropRect.height * pixelYScale
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

        return UIImage(
            cgImage: croppedCGImage,
            scale: normalizedImage.scale,
            orientation: .up
        )
    }

    private static func cropRect(
        imageSize: CGSize,
        configuration: CameraDualFocalZoomConfiguration,
        baseFocalLengthMillimeters: Double,
        isPreviewMirrored: Bool
    ) -> CGRect {
        let side = min(imageSize.width, imageSize.height) * configuration.framingBoxSideRatio(
            relativeToBaseFocalLength: baseFocalLengthMillimeters
        )
        let halfSide = side / 2
        let xRatio = isPreviewMirrored
            ? 1 - configuration.framingBoxCenterXRatio
            : configuration.framingBoxCenterXRatio
        let proposedCenter = CGPoint(
            x: imageSize.width * xRatio,
            y: imageSize.height * configuration.framingBoxCenterYRatio
        )
        let center = CGPoint(
            x: min(max(proposedCenter.x, halfSide), imageSize.width - halfSide),
            y: min(max(proposedCenter.y, halfSide), imageSize.height - halfSide)
        )

        return CGRect(
            x: center.x - halfSide,
            y: center.y - halfSide,
            width: side,
            height: side
        )
    }
}

enum CameraDualFocalPreviewGeometry {
    static let photoAspectRatio: CGFloat = 3.0 / 4.0

    static func previewContentRect(in containerSize: CGSize) -> CGRect {
        guard containerSize.width > 0,
              containerSize.height > 0 else {
            return .zero
        }

        let containerAspectRatio = containerSize.width / containerSize.height
        if containerAspectRatio > photoAspectRatio {
            let height = containerSize.height
            let width = height * photoAspectRatio
            return CGRect(
                x: (containerSize.width - width) / 2,
                y: 0,
                width: width,
                height: height
            )
        } else {
            let width = containerSize.width
            let height = width / photoAspectRatio
            return CGRect(
                x: 0,
                y: (containerSize.height - height) / 2,
                width: width,
                height: height
            )
        }
    }

    static func clampedCenter(
        _ center: CGPoint,
        side: CGFloat,
        in previewRect: CGRect
    ) -> CGPoint {
        let halfSide = side / 2
        return CGPoint(
            x: min(max(center.x, previewRect.minX + halfSide), previewRect.maxX - halfSide),
            y: min(max(center.y, previewRect.minY + halfSide), previewRect.maxY - halfSide)
        )
    }
}

struct CameraDualFocalViewfinderOverlay: View {
    let configuration: CameraDualFocalZoomConfiguration
    let baseFocalLengthMillimeters: Double
    let onFrameCenterChange: (_ xRatio: CGFloat, _ yRatio: CGFloat) -> Void

    @State private var dragStartCenter: CGPoint?

    var body: some View {
        GeometryReader { proxy in
            let previewRect = CameraDualFocalPreviewGeometry.previewContentRect(in: proxy.size)
            let side = min(previewRect.width, previewRect.height) * configuration.framingBoxSideRatio(
                relativeToBaseFocalLength: baseFocalLengthMillimeters
            )
            let proposedCenter = CGPoint(
                x: previewRect.minX + previewRect.width * configuration.framingBoxCenterXRatio,
                y: previewRect.minY + previewRect.height * configuration.framingBoxCenterYRatio
            )
            let center = CameraDualFocalPreviewGeometry.clampedCenter(
                proposedCenter,
                side: side,
                in: previewRect
            )
            let cornerRadius = min(max(side * 0.045, 12), 24)

            ZStack {
                Text(configuration.focalLengthLabel)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white)
                    .shadow(color: .black.opacity(0.58), radius: 3, x: 0, y: 1)
                    .position(
                        x: center.x,
                        y: max(center.y - side / 2 - 16, previewRect.minY + 24)
                    )

                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(.clear)
                    .frame(width: side, height: side)
                    .overlay {
                        RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                            .stroke(.white.opacity(0.95), lineWidth: 2)
                    }
                    .shadow(color: .black.opacity(0.28), radius: 8, x: 0, y: 4)
                    .contentShape(Rectangle())
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { value in
                                let startCenter = dragStartCenter ?? center
                                if dragStartCenter == nil {
                                    dragStartCenter = center
                                }

                                let proposedDragCenter = CGPoint(
                                    x: startCenter.x + value.translation.width,
                                    y: startCenter.y + value.translation.height
                                )
                                let clampedCenter = CameraDualFocalPreviewGeometry.clampedCenter(
                                    proposedDragCenter,
                                    side: side,
                                    in: previewRect
                                )
                                onFrameCenterChange(
                                    (clampedCenter.x - previewRect.minX) / previewRect.width,
                                    (clampedCenter.y - previewRect.minY) / previewRect.height
                                )
                            }
                            .onEnded { _ in
                                dragStartCenter = nil
                            }
                    )
                    .position(x: center.x, y: center.y)
            }
            .frame(width: proxy.size.width, height: proxy.size.height)
        }
        .accessibilityHidden(true)
    }
}

private extension UIImage {
    nonisolated func normalizedForDualFocalCrop() -> UIImage {
        guard imageOrientation != .up else { return self }

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = scale
        format.opaque = true

        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
