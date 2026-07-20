import CoreGraphics
import ImageIO

nonisolated enum CameraFramePixelOrientation: Equatable, Sendable {
    case sensorNativeLandscape
    case portraitRotated

    var imagePropertyOrientation: CGImagePropertyOrientation {
        switch self {
        case .sensorNativeLandscape:
            return .right
        case .portraitRotated:
            return .up
        }
    }
}

nonisolated enum CameraFrameOrientationContract {
    static let portraitRotationAngleDegrees: CGFloat = 90
    static let portraitNormalizedSourceSize = CGSize(width: 3, height: 4)

    static func pixelOrientation(didApplyPortraitRotation: Bool) -> CameraFramePixelOrientation {
        didApplyPortraitRotation ? .portraitRotated : .sensorNativeLandscape
    }
}
