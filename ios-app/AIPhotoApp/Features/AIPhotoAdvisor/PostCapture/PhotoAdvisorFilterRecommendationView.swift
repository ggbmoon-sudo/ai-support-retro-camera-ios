import SwiftUI

struct PhotoAdvisorFilterRecommendationView: View {
    let recommendation: PhotoAdvisorFilterRecommendation
    let preset: FilterPreset?
    let isSelected: Bool
    let isRendering: Bool
    let onApply: (FilterPreset) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack(alignment: .top, spacing: AppSpacing.sm) {
                Image(systemName: preset?.symbolName ?? "camera.filters")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(AppColors.accent)
                    .frame(width: 24)

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    Text(presetName)
                        .font(AppTypography.caption.weight(.semibold))
                        .foregroundStyle(AppColors.textPrimary)
                        .lineLimit(1)

                    Text(LocalizedStringKey(recommendation.reasonKey))
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer(minLength: AppSpacing.sm)
            }

            Button {
                guard let preset else { return }
                onApply(preset)
            } label: {
                Label(applyTitleKey, systemImage: isSelected ? "checkmark.circle.fill" : "camera.filters")
                    .font(AppTypography.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.76)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .background(isSelected ? AppColors.success.opacity(0.18) : AppColors.accent)
                    .foregroundStyle(isSelected ? AppColors.success : Color.black)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
            .buttonStyle(.plain)
            .disabled(preset == nil || isRendering)
        }
        .padding(AppSpacing.sm)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.md)
                .stroke(isSelected ? AppColors.success.opacity(0.5) : AppColors.textSecondary.opacity(0.16), lineWidth: 1)
        }
        .accessibilityElement(children: .combine)
    }

    private var presetName: LocalizedStringKey {
        guard let preset else {
            return "photo_advisor.filter.missing"
        }

        return LocalizedStringKey(preset.nameKey)
    }

    private var applyTitleKey: LocalizedStringKey {
        isSelected ? "photo_advisor.action.applied_filter" : "photo_advisor.action.apply_filter"
    }
}
