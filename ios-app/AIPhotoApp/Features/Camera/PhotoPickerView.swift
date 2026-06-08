import PhotosUI
import SwiftUI

struct PhotoPickerView: View {
    @Binding var selection: PhotosPickerItem?
    let isLoading: Bool

    var body: some View {
        PhotosPicker(
            selection: $selection,
            matching: .images,
            photoLibrary: .shared()
        ) {
            Label("camera.action.import", systemImage: "photo.on.rectangle")
                .font(AppTypography.bodyEmphasis)
                .frame(maxWidth: .infinity)
                .padding(.vertical, AppSpacing.md)
                .background(AppColors.surface)
                .foregroundStyle(AppColors.textPrimary)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .disabled(isLoading)
        .accessibilityLabel("camera.action.import")
    }
}
