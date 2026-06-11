import PhotosUI
import SwiftUI

struct ReferenceImagePickerView: View {
    @Binding var selection: PhotosPickerItem?
    let isDisabled: Bool
    let onUseSample: () -> Void
    let onShowUnavailable: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Text("filter_lab.reference.title")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            Text("filter_lab.reference.note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            PhotosPicker(
                selection: $selection,
                matching: .images,
                photoLibrary: .shared()
            ) {
                Label("filter_lab.action.choose_reference", systemImage: "photo.on.rectangle")
                    .font(AppTypography.bodyEmphasis)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.md)
                    .background(AppColors.accent)
                    .foregroundStyle(AppColors.background)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
            .disabled(isDisabled)
            .accessibilityLabel("filter_lab.action.choose_reference")

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
