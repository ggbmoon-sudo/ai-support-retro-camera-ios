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

        let displayedContentRect = displayedContentRect(
            sourceSize: sourceSize,
            overlaySize: overlaySize,
            contentMode: contentMode
        )
        let scale = displayedContentRect.width / sourceSize.width
        let imageRect = CGRect(
            x: normalizedRect.x * sourceSize.width,
            y: (1 - normalizedRect.y - normalizedRect.height) * sourceSize.height,
            width: normalizedRect.width * sourceSize.width,
            height: normalizedRect.height * sourceSize.height
        )

        return CGRect(
            x: imageRect.minX * scale + displayedContentRect.minX,
            y: imageRect.minY * scale + displayedContentRect.minY,
            width: imageRect.width * scale,
            height: imageRect.height * scale
        )
    }

    func normalizedPoint(
        for overlayPoint: CGPoint,
        sourceSize: CGSize,
        overlaySize: CGSize,
        contentMode: ContentMode = .aspectFill
    ) -> LiveFramePoint? {
        guard sourceSize.width > 0,
              sourceSize.height > 0,
              overlaySize.width > 0,
              overlaySize.height > 0 else {
            return nil
        }

        let displayedContentRect = displayedContentRect(
            sourceSize: sourceSize,
            overlaySize: overlaySize,
            contentMode: contentMode
        )
        guard displayedContentRect.contains(overlayPoint) else {
            return nil
        }

        let scale = displayedContentRect.width / sourceSize.width
        let imageX = (overlayPoint.x - displayedContentRect.minX) / scale
        let imageY = (overlayPoint.y - displayedContentRect.minY) / scale
        let normalizedX = imageX / sourceSize.width
        let normalizedY = 1 - imageY / sourceSize.height

        guard (0...1).contains(normalizedX),
              (0...1).contains(normalizedY) else {
            return nil
        }

        return LiveFramePoint(x: normalizedX, y: normalizedY)
    }

    func displayedContentRect(
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

        return CGRect(
            x: (overlaySize.width - fittedSize.width) / 2,
            y: (overlaySize.height - fittedSize.height) / 2,
            width: fittedSize.width,
            height: fittedSize.height
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
