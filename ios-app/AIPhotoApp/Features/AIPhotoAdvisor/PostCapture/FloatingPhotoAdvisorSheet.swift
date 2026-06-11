import SwiftUI

struct FloatingPhotoAdvisorSheet: View {
    let photoId: String
    let source: PhotoAdvisorPhotoSource
    let selectedPreset: FilterPreset
    let presets: [FilterPreset]
    let imageSignal: PhotoAdvisorImageSignal
    let isRendering: Bool
    let onApplyFilter: (FilterPreset) -> Void
    let onClose: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            header

            ScrollView {
                PhotoAdvisorResultView(
                    photoId: photoId,
                    source: source,
                    selectedPreset: selectedPreset,
                    presets: presets,
                    imageSignal: imageSignal,
                    isRendering: isRendering,
                    onApplyFilter: onApplyFilter
                )
                .padding(.bottom, AppSpacing.xs)
            }
            .frame(maxHeight: 360)
        }
        .padding(AppSpacing.md)
        .background(AppColors.background.opacity(0.98))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.xl))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.xl)
                .stroke(Color.white.opacity(0.12), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.30), radius: 20, x: 0, y: 12)
    }

    private var header: some View {
        HStack(spacing: AppSpacing.sm) {
            Label("photo_advisor.title", systemImage: "sparkles")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(1)

            Spacer()

            Text("photo_advisor.badge.mock")
                .font(AppTypography.micro)
                .foregroundStyle(Color.black)
                .padding(.vertical, 4)
                .padding(.horizontal, AppSpacing.sm)
                .background(AppColors.accent)
                .clipShape(Capsule())

            Button(action: onClose) {
                Image(systemName: "xmark")
                    .font(.system(size: 13, weight: .bold))
                    .frame(width: 32, height: 32)
                    .background(AppColors.surface)
                    .foregroundStyle(AppColors.textPrimary)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("photo_advisor.floating.close")
        }
    }
}

#Preview {
    FloatingPhotoAdvisorSheet(
        photoId: "preview-photo",
        source: .imported,
        selectedPreset: FilterPresetCatalog.instantDream,
        presets: FilterPresetCatalog.all,
        imageSignal: PhotoAdvisorImageSignal(size: CGSize(width: 1200, height: 1600)),
        isRendering: false,
        onApplyFilter: { _ in },
        onClose: {}
    )
    .padding()
    .background(Color.black)
}
