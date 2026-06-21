import PhotosUI
import SwiftUI
import UIKit

struct ReferenceImagePickerView: View {
    @Binding var selection: PhotosPickerItem?
    let selectedImage: UIImage?
    let titleKey: LocalizedStringKey
    let noteKey: LocalizedStringKey
    let actionKey: LocalizedStringKey
    let isDisabled: Bool
    let onUseSample: () -> Void
    let onShowUnavailable: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Text(titleKey)
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            Text(noteKey)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            if let selectedImage {
                Image(uiImage: selectedImage)
                    .resizable()
                    .scaledToFill()
                    .frame(maxWidth: .infinity, minHeight: 160, maxHeight: 180)
                    .clipped()
                    .background(Color.black)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }

            PhotosPicker(
                selection: $selection,
                matching: .images,
                photoLibrary: .shared()
            ) {
                Label(actionKey, systemImage: "photo.on.rectangle")
                    .font(AppTypography.bodyEmphasis)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.md)
                    .background(AppColors.accent)
                    .foregroundStyle(AppColors.background)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
            .disabled(isDisabled)
            .accessibilityLabel(actionKey)

            HStack(spacing: AppSpacing.sm) {
                Button {
                    onUseSample()
                } label: {
                    Label("filter_lab.action.use_sample", systemImage: "sparkles")
                        .font(AppTypography.caption)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, AppSpacing.sm)
                        .background(AppColors.elevatedSurface)
                        .foregroundStyle(AppColors.textPrimary)
                        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
                }
                .disabled(isDisabled)

                Button {
                    onShowUnavailable()
                } label: {
                    Label("filter_lab.action.mock_unavailable", systemImage: "wifi.slash")
                        .font(AppTypography.caption)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, AppSpacing.sm)
                        .background(AppColors.elevatedSurface)
                        .foregroundStyle(AppColors.textPrimary)
                        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
                }
                .disabled(isDisabled)
            }
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }
}
