import CoreGraphics
import Foundation

nonisolated struct CameraOverlayCoordinateMapper: Sendable {
    enum ContentMode: Sendable {
        case aspectFill
        case aspectFit
    }

    func overlayRect(
        for normalizedRect: LiveFrameNormalizedRect,
        sourceSize: CGSize,
        overlaySize: CGSize,
        contentMode: ContentMode = .aspectFill
    ) -> CGRect {
        guard sourceSize.width > 0,
              sourceSize.height > 0,
              overlaySize.width > 0,
              overlaySize.height > 0 else {
            return .zero
        }

        let scale = scaleFactor(
            sourceSize: sourceSize,
            overlaySize: overlaySize,
            contentMode: contentMode
        )
        let fittedSize = CGSize(
            width: sourceSize.width * scale,
            height: sourceSize.height * scale
        )
        let offset = CGPoint(
            x: (overlaySize.width - fittedSize.width) / 2,
            y: (overlaySize.height - fittedSize.height) / 2
        )
        let imageRect = CGRect(
            x: normalizedRect.x * sourceSize.width,
            y: (1 - normalizedRect.y - normalizedRect.height) * sourceSize.height,
            width: normalizedRect.width * sourceSize.width,
            height: normalizedRect.height * sourceSize.height
        )

        return CGRect(
            x: imageRect.minX * scale + offset.x,
            y: imageRect.minY * scale + offset.y,
            width: imageRect.width * scale,
            height: imageRect.height * scale
        )
    }

    private func scaleFactor(
        sourceSize: CGSize,
        overlaySize: CGSize,
        contentMode: ContentMode
    ) -> CGFloat {
        let widthScale = overlaySize.width / sourceSize.width
        let heightScale = overlaySize.height / sourceSize.height

        switch contentMode {
        case .aspectFill:
            return max(widthScale, heightScale)
        case .aspectFit:
            return min(widthScale, heightScale)
        }
    }
}

