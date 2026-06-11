import SwiftUI
import UIKit

struct FilteredPhotoPreview: View {
    let photo: CapturedPhoto
    let previewImage: UIImage
    let selectedPreset: FilterPreset
    let isRendering: Bool

    var body: some View {
        FilterPreviewView(
            image: previewImage,
            sourceTitle: sourceTitle,
            presetTitle: LocalizedStringKey(selectedPreset.nameKey),
            isRendering: isRendering
        )
    }

    private var sourceTitle: LocalizedStringKey {
        switch photo.source {
        case .camera:
            return "camera.preview.source.camera"
        case .photoLibrary:
            return "camera.preview.source.library"
        }
    }
}
