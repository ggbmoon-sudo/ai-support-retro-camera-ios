import SwiftUI

struct FloatingFilterGridView: View {
    let presets: [FilterPreset]
    let selectedPreset: FilterPreset
    let recommendedFilters: [PhotoAdvisorFilterRecommendation]
    let isRendering: Bool
    let onSelectPreset: (FilterPreset) -> Void
    let onClose: () -> Void

    private struct RecommendedFilterRow: Identifiable {
        let recommendation: PhotoAdvisorFilterRecommendation
        let preset: FilterPreset

        var id: String {
            recommendation.id
        }
    }

    private var columns: [GridItem] {
        [
            GridItem(.flexible(), spacing: AppSpacing.sm, alignment: .top),
            GridItem(.flexible(), spacing: AppSpacing.sm, alignment: .top)
        ]
    }

    private var recommendedRows: [RecommendedFilterRow] {
        recommendedFilters.compactMap { recommendation in
            guard let preset = presets.first(where: { $0.id == recommendation.filterId }) else {
                return nil
            }

            return RecommendedFilterRow(recommendation: recommendation, preset: preset)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            header

            ScrollView {
                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    if !recommendedRows.isEmpty {
                        recommendedSection
                    }

                    allFiltersSection

                    Text("photo_advisor.footer.no_upload")
                        .font(AppTypography.micro)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.bottom, AppSpacing.xs)
            }
            .frame(maxHeight: 320)
        }
        .padding(AppSpacing.md)
        .background(AppColors.elevatedSurface.opacity(0.98))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.xl))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.xl)
                .stroke(Color.white.opacity(0.12), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.30), radius: 20, x: 0, y: 12)
    }

    private var header: some View {
        HStack(spacing: AppSpacing.sm) {
            Label("photo_advisor.floating.select_filter", systemImage: "camera.filters")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(1)

            Spacer()

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

    private var recommendedSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            sectionHeader("photo_advisor.floating.ai_recommended", icon: "sparkles")

            VStack(spacing: AppSpacing.sm) {
                ForEach(recommendedRows) { row in
                    recommendedButton(row)
                }
            }
        }
    }

    private var allFiltersSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            sectionHeader("photo_advisor.floating.all_filters", icon: "square.grid.2x2")

            LazyVGrid(columns: columns, spacing: AppSpacing.sm) {
                ForEach(presets) { preset in
                    presetButton(preset)
                }
            }
        }
    }

    private func sectionHeader(_ titleKey: LocalizedStringKey, icon: String) -> some View {
        Label(titleKey, systemImage: icon)
            .font(AppTypography.caption.weight(.semibold))
            .foregroundStyle(AppColors.textPrimary)
    }

    private func recommendedButton(_ row: RecommendedFilterRow) -> some View {
        let isSelected = row.preset.id == selectedPreset.id

        return Button {
            onSelectPreset(row.preset)
        } label: {
            HStack(alignment: .top, spacing: AppSpacing.sm) {
                Image(systemName: row.preset.symbolName)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(AppColors.accent)
                    .frame(width: 22)

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    HStack(spacing: AppSpacing.xs) {
                        Text(LocalizedStringKey(row.preset.nameKey))
                            .font(AppTypography.caption.weight(.semibold))
                            .foregroundStyle(AppColors.textPrimary)
                            .lineLimit(1)

                        Text("photo_advisor.floating.recommended")
                            .font(AppTypography.micro)
                            .foregroundStyle(Color.black)
                            .padding(.vertical, 2)
                            .padding(.horizontal, AppSpacing.xs)
                            .background(AppColors.accent)
                            .clipShape(Capsule())
                    }

                    Text(LocalizedStringKey(row.recommendation.reasonKey))
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer(minLength: AppSpacing.xs)

                Image(systemName: isSelected ? "checkmark.circle.fill" : "plus.circle")
                    .foregroundStyle(isSelected ? AppColors.success : AppColors.accent)
            }
            .padding(AppSpacing.sm)
            .background(AppColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            .overlay {
                RoundedRectangle(cornerRadius: AppCornerRadius.md)
                    .stroke(isSelected ? AppColors.success.opacity(0.5) : AppColors.textSecondary.opacity(0.16), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .disabled(isRendering && isSelected)
    }

    private func presetButton(_ preset: FilterPreset) -> some View {
        let isSelected = preset.id == selectedPreset.id

        return Button {
            onSelectPreset(preset)
        } label: {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                HStack(spacing: AppSpacing.xs) {
                    Image(systemName: isSelected ? "checkmark.circle.fill" : preset.symbolName)
                        .font(.system(size: 14, weight: .semibold))

                    Text(LocalizedStringKey(preset.nameKey))
                        .font(AppTypography.caption.weight(.semibold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.76)
                }

                Text(LocalizedStringKey(preset.descriptionKey))
                    .font(AppTypography.micro)
                    .foregroundStyle(isSelected ? Color.black.opacity(0.72) : AppColors.textSecondary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
            }
            .frame(maxWidth: .infinity, minHeight: 74, alignment: .topLeading)
            .padding(AppSpacing.sm)
            .background(isSelected ? AppColors.accent : AppColors.surface)
            .foregroundStyle(isSelected ? Color.black : AppColors.textPrimary)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            .overlay {
                RoundedRectangle(cornerRadius: AppCornerRadius.md)
                    .stroke(isSelected ? AppColors.accent : AppColors.textSecondary.opacity(0.14), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .disabled(isRendering && isSelected)
    }
}

#Preview {
    FloatingFilterGridView(
        presets: FilterPresetCatalog.all,
        selectedPreset: FilterPresetCatalog.streetChrome,
        recommendedFilters: PhotoAdvisorFixtures.result(for: .busyBackground).recommendedFilters,
        isRendering: false,
        onSelectPreset: { _ in },
        onClose: {}
    )
    .padding()
    .background(Color.black)
}
