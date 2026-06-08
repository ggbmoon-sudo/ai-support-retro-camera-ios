import SwiftUI

struct SelectedPhotoPreview: View {
    let photo: CapturedPhoto

    var body: some View {
        Image(uiImage: photo.image)
            .resizable()
            .scaledToFit()
            .frame(maxWidth: .infinity)
            .background(Color.black)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
            .overlay(alignment: .topLeading) {
                Text(sourceTitle)
                    .font(AppTypography.caption)
                    .padding(.horizontal, AppSpacing.sm)
                    .padding(.vertical, AppSpacing.xs)
                    .background(AppColors.surface.opacity(0.92))
                    .foregroundStyle(AppColors.textPrimary)
                    .clipShape(Capsule())
                    .padding(AppSpacing.sm)
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
