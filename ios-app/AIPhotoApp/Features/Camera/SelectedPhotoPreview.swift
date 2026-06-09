import SwiftUI
import UIKit

struct SelectedPhotoPreview: View {
    let photo: CapturedPhoto

    var body: some View {
        FilterPreviewView(
            image: photo.image,
            sourceTitle: sourceTitle,
            presetTitle: nil,
            isRendering: false
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
