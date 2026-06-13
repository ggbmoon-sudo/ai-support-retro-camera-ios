import UIKit

struct CapturedPhoto: Identifiable {
    enum Source {
        case camera
        case photoLibrary
    }

    let id = UUID()
    let image: UIImage
    let source: Source
    let captureContext: CameraCaptureContext

    init(
        image: UIImage,
        source: Source,
        captureContext: CameraCaptureContext? = nil
    ) {
        self.image = image
        self.source = source
        self.captureContext = captureContext ?? {
            switch source {
            case .camera:
                return CameraCaptureContextSnapshotter.snapshot(
                    source: .captured,
                    imageSize: image.size,
                    selectedFilterId: nil,
                    previewFilterId: nil,
                    lensOption: nil,
                    liveGuidanceSignals: nil
                )
            case .photoLibrary:
                return CameraCaptureContext.imported(imageSize: image.size)
            }
        }()
    }
}
