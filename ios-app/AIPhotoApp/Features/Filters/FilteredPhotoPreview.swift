import SwiftUI
import UIKit

struct FilteredPhotoPreview: View {
    let photo: CapturedPhoto
    let previewImage: UIImage
    let selectedPreset: FilterPreset
    let presets: [FilterPreset]
    let isRendering: Bool
    let saveState: PhotoSaveState
    let onSelectPreset: (FilterPreset) -> Void
    let onSavePhoto: (Bool) -> Void

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

            savePanel

            AIAnalysisView(
                photoId: analysisPhotoId,
                filterPresetId: selectedPreset.id
            )
            .id("\(photo.id.uuidString)-\(analysisPhotoId)-\(selectedPreset.id)")

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

    private var savePanel: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text("save.title")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            Text("save.mock_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            saveStateView

            HStack(spacing: AppSpacing.sm) {
                PrimaryButton(
                    "save.action.mock_success",
                    systemImage: "icloud.and.arrow.up",
                    isEnabled: !isRendering && !saveState.isSaving
                ) {
                    onSavePhoto(false)
                }

                Button {
                    onSavePhoto(true)
                } label: {
                    Image(systemName: "exclamationmark.triangle")
                        .font(.system(size: 16, weight: .semibold))
                        .frame(width: 48, height: 48)
                        .background(AppColors.surface)
                        .foregroundStyle(AppColors.textPrimary)
                        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
                }
                .disabled(isRendering || saveState.isSaving)
                .accessibilityLabel("save.action.mock_failure")
            }
        }
        .padding(AppSpacing.md)
        .background(AppColors.elevatedSurface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var analysisPhotoId: String {
        if case .saved(let savedPhoto) = saveState {
            return savedPhoto.id
        }

        return "local-\(photo.id.uuidString.lowercased())"
    }

    @ViewBuilder
    private var saveStateView: some View {
        switch saveState {
        case .idle:
            Text("save.state.idle")
                .foregroundStyle(AppColors.textSecondary)
        case .saving:
            Label("save.state.saving", systemImage: "hourglass")
                .foregroundStyle(AppColors.textSecondary)
        case .saved:
            Label("save.state.saved_mock", systemImage: "checkmark.circle.fill")
                .foregroundStyle(AppColors.success)
        case .failed(let message):
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Label("save.state.failed", systemImage: "xmark.circle.fill")
                    .foregroundStyle(AppColors.error)
                Text(message)
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.error)
            }
        }
    }
}
