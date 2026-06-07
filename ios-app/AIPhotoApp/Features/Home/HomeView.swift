import SwiftUI

struct HomeView: View {
    private let presets = CameraPreset.samples
    private let quota = QuotaStatus.sample

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.xl) {
                HStack {
                    VStack(alignment: .leading, spacing: AppSpacing.xs) {
                        Text("home.title")
                            .font(AppTypography.title1)
                            .foregroundStyle(AppColors.textPrimary)

                        Text("home.subtitle")
                            .font(AppTypography.body)
                            .foregroundStyle(AppColors.textSecondary)
                    }

                    Spacer()

                    QuotaBadge(status: quota)
                }

                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    Text("home.section.presets")
                        .font(AppTypography.title2)
                        .foregroundStyle(AppColors.textPrimary)

                    ForEach(presets) { preset in
                        presetRow(preset)
                    }
                }

                VStack(spacing: AppSpacing.md) {
                    PrimaryButton("home.button.camera_placeholder", systemImage: "camera", isEnabled: false) {}
                    PrimaryButton("home.button.import_placeholder", systemImage: "photo.on.rectangle", isEnabled: false) {}
                }

                Text("home.phase_note")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(AppSpacing.lg)
        }
        .background(AppColors.background)
        .navigationTitle(Text("tab.home"))
    }

    private func presetRow(_ preset: CameraPreset) -> some View {
        HStack(spacing: AppSpacing.md) {
            Image(systemName: preset.symbolName)
                .font(.system(size: 22, weight: .semibold))
                .frame(width: 48, height: 48)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(LocalizedStringKey(preset.nameKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text(LocalizedStringKey(preset.descriptionKey))
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
            }

            Spacer()
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }
}

#Preview {
    NavigationStack {
        HomeView()
    }
}
