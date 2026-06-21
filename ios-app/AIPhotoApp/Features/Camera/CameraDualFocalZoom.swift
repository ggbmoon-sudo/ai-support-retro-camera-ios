import SwiftUI
import UIKit

nonisolated enum CameraFocalCropAspectRatio: String, CaseIterable, Identifiable, Equatable, Sendable {
    case fourByFive
    case square
    case threeByFour

    var id: String { rawValue }

    var label: String {
        switch self {
        case .fourByFive:
            return "4:5"
        case .square:
            return "1:1"
        case .threeByFour:
            return "3:4"
        }
    }

    var widthToHeightRatio: CGFloat {
        switch self {
        case .fourByFive:
            return 4.0 / 5.0
        case .square:
            return 1.0
        case .threeByFour:
            return 3.0 / 4.0
        }
    }

    func fittingSize(in boundingSize: CGSize) -> CGSize {
        guard boundingSize.width > 0,
              boundingSize.height > 0 else {
            return .zero
        }

        let boundingRatio = boundingSize.width / boundingSize.height
        if boundingRatio > widthToHeightRatio {
            let height = boundingSize.height
            return CGSize(width: height * widthToHeightRatio, height: height)
        } else {
            let width = boundingSize.width
            return CGSize(width: width, height: width / widthToHeightRatio)
        }
    }
}

nonisolated struct CameraDualFocalZoomConfiguration: Equatable, Sendable {
    static let maximumFocalLengthMillimeters = 100.0

    let focalLengthMillimeters: Double
    let aspectRatio: CameraFocalCropAspectRatio
    let framingBoxCenterXRatio: CGFloat
    let framingBoxCenterYRatio: CGFloat

    init(
        focalLengthMillimeters: Double,
        aspectRatio: CameraFocalCropAspectRatio = .fourByFive,
        framingBoxCenterXRatio: CGFloat = 0.5,
        framingBoxCenterYRatio: CGFloat = 0.43
    ) {
        self.focalLengthMillimeters = focalLengthMillimeters
        self.aspectRatio = aspectRatio
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
        sanitizedFocalLength(baseFocalLength)
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

    static func isBaseFocalLength(
        _ focalLength: Double,
        baseFocalLength: Double
    ) -> Bool {
        abs(clampedFocalLength(focalLength, baseFocalLength: baseFocalLength) - sanitizedFocalLength(baseFocalLength)) < 0.001
    }

    func cropScale(relativeToBaseFocalLength baseFocalLength: Double) -> CGFloat {
        CGFloat(max(focalLengthMillimeters / Self.sanitizedFocalLength(baseFocalLength), 1))
    }

    func framingBoxScale(relativeToBaseFocalLength baseFocalLength: Double) -> CGFloat {
        let ratio = Self.sanitizedFocalLength(baseFocalLength) / max(focalLengthMillimeters, 1)
        return min(max(CGFloat(ratio), 0.18), 1)
    }

    func framingBoxSize(
        in previewRect: CGRect,
        relativeToBaseFocalLength baseFocalLength: Double
    ) -> CGSize {
        let scale = framingBoxScale(relativeToBaseFocalLength: baseFocalLength)
        let boundingSize = CGSize(
            width: previewRect.width * scale,
            height: previewRect.height * scale
        )
        return aspectRatio.fittingSize(in: boundingSize)
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
        let scale = configuration.framingBoxScale(relativeToBaseFocalLength: baseFocalLengthMillimeters)
        let cropSize = configuration.aspectRatio.fittingSize(
            in: CGSize(
                width: imageSize.width * scale,
                height: imageSize.height * scale
            )
        )
        let halfWidth = cropSize.width / 2
        let halfHeight = cropSize.height / 2
        let xRatio = isPreviewMirrored
            ? 1 - configuration.framingBoxCenterXRatio
            : configuration.framingBoxCenterXRatio
        let proposedCenter = CGPoint(
            x: imageSize.width * xRatio,
            y: imageSize.height * configuration.framingBoxCenterYRatio
        )
        let center = CGPoint(
            x: min(max(proposedCenter.x, halfWidth), imageSize.width - halfWidth),
            y: min(max(proposedCenter.y, halfHeight), imageSize.height - halfHeight)
        )

        return CGRect(
            x: center.x - halfWidth,
            y: center.y - halfHeight,
            width: cropSize.width,
            height: cropSize.height
        )
    }
}

enum CameraDualFocalPreviewGeometry {
    static func previewContentRect(
        in containerSize: CGSize,
        aspectRatio: CameraFocalCropAspectRatio
    ) -> CGRect {
        guard containerSize.width > 0,
              containerSize.height > 0 else {
            return .zero
        }

        let containerAspectRatio = containerSize.width / containerSize.height
        if containerAspectRatio > aspectRatio.widthToHeightRatio {
            let height = containerSize.height
            let width = height * aspectRatio.widthToHeightRatio
            return CGRect(
                x: (containerSize.width - width) / 2,
                y: 0,
                width: width,
                height: height
            )
        } else {
            let width = containerSize.width
            let height = width / aspectRatio.widthToHeightRatio
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
        boxSize: CGSize,
        in previewRect: CGRect
    ) -> CGPoint {
        let halfWidth = boxSize.width / 2
        let halfHeight = boxSize.height / 2
        return CGPoint(
            x: min(max(center.x, previewRect.minX + halfWidth), previewRect.maxX - halfWidth),
            y: min(max(center.y, previewRect.minY + halfHeight), previewRect.maxY - halfHeight)
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
            let previewRect = CameraDualFocalPreviewGeometry.previewContentRect(
                in: proxy.size,
                aspectRatio: configuration.aspectRatio
            )
            let boxSize = configuration.framingBoxSize(
                in: previewRect,
                relativeToBaseFocalLength: baseFocalLengthMillimeters
            )
            let proposedCenter = CGPoint(
                x: previewRect.minX + previewRect.width * configuration.framingBoxCenterXRatio,
                y: previewRect.minY + previewRect.height * configuration.framingBoxCenterYRatio
            )
            let center = CameraDualFocalPreviewGeometry.clampedCenter(
                proposedCenter,
                boxSize: boxSize,
                in: previewRect
            )
            let cornerRadius = min(max(min(boxSize.width, boxSize.height) * 0.045, 12), 24)

            ZStack {
                Text(configuration.focalLengthLabel)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white)
                    .shadow(color: .black.opacity(0.58), radius: 3, x: 0, y: 1)
                    .position(
                        x: center.x,
                        y: max(center.y - boxSize.height / 2 - 16, previewRect.minY + 24)
                    )

                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(.clear)
                    .frame(width: boxSize.width, height: boxSize.height)
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
                                    boxSize: boxSize,
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
