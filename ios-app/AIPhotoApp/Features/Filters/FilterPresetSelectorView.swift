import SwiftUI

struct FilterPresetSelectorView: View {
    let presets: [FilterPreset]
    let selectedPreset: FilterPreset
    let isRendering: Bool
    let onSelectPreset: (FilterPreset) -> Void
    @State private var selectedGroup: FilterPresetGroup = .featured

    private var availableGroups: [FilterPresetGroup] {
        FilterPresetGroup.allCases.filter { group in
            presets.contains { $0.group == group }
        }
    }

    private var groupedPresets: [FilterPreset] {
        presets.filter { $0.group == selectedGroup }
    }

    private var columns: [GridItem] {
        [
            GridItem(.adaptive(minimum: 148), spacing: AppSpacing.sm, alignment: .top)
        ]
    }

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

            groupPicker

            LazyVGrid(columns: columns, alignment: .leading, spacing: AppSpacing.sm) {
                ForEach(groupedPresets) { preset in
                    Button {
                        onSelectPreset(preset)
                    } label: {
                        presetChip(preset)
                    }
                    .buttonStyle(.plain)
                    .disabled(isRendering && preset.id == selectedPreset.id)
                }
            }
            .animation(.snappy(duration: 0.18), value: selectedGroup)
        }
        .onAppear {
            syncSelectedGroup()
        }
        .onChange(of: selectedPreset.id) { _, _ in
            syncSelectedGroup()
        }
    }

    private var groupPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: AppSpacing.sm) {
                ForEach(availableGroups, id: \.self) { group in
                    Button {
                        selectedGroup = group
                    } label: {
                        groupChip(group)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.vertical, AppSpacing.xs)
        }
    }

    private func groupChip(_ group: FilterPresetGroup) -> some View {
        let isSelected = group == selectedGroup

        return Text(LocalizedStringKey(group.titleKey))
            .font(AppTypography.caption)
            .lineLimit(1)
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(isSelected ? AppColors.accent : AppColors.surface)
            .foregroundStyle(isSelected ? AppColors.background : AppColors.textPrimary)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(isSelected ? AppColors.accent : AppColors.textSecondary.opacity(0.24), lineWidth: 1)
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
        .frame(maxWidth: .infinity, minHeight: 86, alignment: .leading)
        .padding(AppSpacing.sm)
        .background(isSelected ? AppColors.accent : AppColors.surface)
        .foregroundStyle(isSelected ? AppColors.background : AppColors.textPrimary)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        .accessibilityElement(children: .combine)
    }

    private func syncSelectedGroup() {
        guard availableGroups.contains(selectedPreset.group) else {
            selectedGroup = availableGroups.first ?? .featured
            return
        }

        selectedGroup = selectedPreset.group
    }
}
