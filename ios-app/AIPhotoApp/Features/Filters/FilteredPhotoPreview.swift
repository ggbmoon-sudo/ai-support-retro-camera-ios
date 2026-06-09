import SwiftUI
import UIKit

struct FilteredPhotoPreview: View {
    let photo: CapturedPhoto
    let previewImage: UIImage
    let selectedPreset: FilterPreset
    let presets: [FilterPreset]
    let isRendering: Bool
    let onSelectPreset: (FilterPreset) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            FilterPreviewView(
                image: previewImage,
                sourceTitle: sourceTitle,
                presetTitle: LocalizedStringKey(selectedPreset.nameKey),
                isRendering: isRendering
            )

            FilterPresetSelectorView(
                presets: presets,
                selectedPreset: selectedPreset,
                isRendering: isRendering,
                onSelectPreset: onSelectPreset
            )

            Text("filters.local_only_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
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
