import CoreGraphics
import Foundation

struct PhotoAdvisorImageSignal: Codable, Hashable {
    let aspectRatioBucket: PhotoAdvisorAspectRatioBucket
    let hasPreviewImage: Bool

    static let unavailable = PhotoAdvisorImageSignal(
        aspectRatioBucket: .unavailable,
        hasPreviewImage: false
    )

    init(
        aspectRatioBucket: PhotoAdvisorAspectRatioBucket,
        hasPreviewImage: Bool
    ) {
        self.aspectRatioBucket = aspectRatioBucket
        self.hasPreviewImage = hasPreviewImage
    }

    init(size: CGSize?) {
        guard let size,
              size.width > 0,
              size.height > 0 else {
            self = .unavailable
            return
        }

        self.aspectRatioBucket = PhotoAdvisorAspectRatioBucket.bucket(for: size)
        self.hasPreviewImage = true
    }
}

enum PhotoAdvisorAspectRatioBucket: String, Codable, Hashable {
    case unavailable
    case square
    case portrait
    case tallPortrait = "tall_portrait"
    case landscape
    case wideLandscape = "wide_landscape"

    static func bucket(for size: CGSize) -> PhotoAdvisorAspectRatioBucket {
        guard size.width > 0, size.height > 0 else {
            return .unavailable
        }

        let ratio = size.width / size.height

        if abs(ratio - 1) <= 0.08 {
            return .square
        }

        if ratio < 0.68 {
            return .tallPortrait
        }

        if ratio < 1 {
            return .portrait
        }

        if ratio > 1.9 {
            return .wideLandscape
        }

        return .landscape
    }
}
