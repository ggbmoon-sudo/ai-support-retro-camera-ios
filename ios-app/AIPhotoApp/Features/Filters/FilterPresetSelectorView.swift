import SwiftUI

struct FilterPresetSelectorView: View {
    let presets: [FilterPreset]
    let selectedPreset: FilterPreset
    let isRendering: Bool
    let onSelectPreset: (FilterPreset) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack {
                Text("filters.selector.title")
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Spacer()

                if isRendering {
                    Text("filters.rendering")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                }
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: AppSpacing.sm) {
                    ForEach(presets) { preset in
                        Button {
                            onSelectPreset(preset)
                        } label: {
                            presetChip(preset)
                        }
                        .buttonStyle(.plain)
                        .disabled(isRendering && preset.id == selectedPreset.id)
                    }
                }
                .padding(.vertical, AppSpacing.xs)
            }
        }
    }

    private func presetChip(_ preset: FilterPreset) -> some View {
        let isSelected = preset.id == selectedPreset.id

        return VStack(alignment: .leading, spacing: AppSpacing.xs) {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: preset.symbolName)
                    .font(.system(size: 15, weight: .semibold))

                Text(LocalizedStringKey(preset.nameKey))
                    .font(AppTypography.caption)
                    .lineLimit(1)
            }

            Text(LocalizedStringKey(preset.descriptionKey))
                .font(.caption2)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
                .foregroundStyle(isSelected ? AppColors.background.opacity(0.86) : AppColors.textSecondary)
        }
        .frame(width: 142, alignment: .leading)
        .padding(AppSpacing.sm)
        .background(isSelected ? AppColors.accent : AppColors.surface)
        .foregroundStyle(isSelected ? AppColors.background : AppColors.textPrimary)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        .accessibilityElement(children: .combine)
    }
}
