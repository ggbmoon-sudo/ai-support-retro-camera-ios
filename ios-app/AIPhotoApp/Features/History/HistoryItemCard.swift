import SwiftUI

struct HistoryItemCard: View {
    let item: SessionHistoryItem

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            HStack(alignment: .top, spacing: AppSpacing.md) {
                thumbnail

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    HStack(spacing: AppSpacing.xs) {
                        badge("history.badge.local_only")
                        badge("history.badge.mock")
                    }

                    Text(LocalizedStringKey(item.filterPresetNameKey))
                        .font(AppTypography.bodyEmphasis)
                        .foregroundStyle(AppColors.textPrimary)

                    HStack(spacing: AppSpacing.xs) {
                        Text("history.item.created")
                        Text(item.createdAt, style: .time)
                    }
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                }

                Spacer()
            }

            detailRow(titleKey: "history.item.source", valueKey: item.sourceTitleKey)
            detailRow(titleKey: "history.item.filter", value: item.filterPresetId)
            detailRow(titleKey: "history.item.save_status", valueKey: item.saveStatus.titleKey)

            if let summary = item.mockAnalysisSummary {
                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    Text("history.item.ai_summary")
                        .font(AppTypography.micro)
                        .foregroundStyle(AppColors.accent)

                    Text(summary)
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textPrimary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(AppSpacing.sm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(AppColors.elevatedSurface)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            } else {
                detailRow(titleKey: "history.item.ai_summary", valueKey: "history.item.ai_summary.empty")
            }

            Text("history.item.local_note")
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    @ViewBuilder
    private var thumbnail: some View {
        if let thumbnailImage = item.thumbnailImage {
            Image(uiImage: thumbnailImage)
                .resizable()
                .scaledToFill()
                .frame(width: 72, height: 72)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        } else {
            RoundedRectangle(cornerRadius: AppCornerRadius.md)
                .fill(AppColors.elevatedSurface)
                .frame(width: 72, height: 72)
                .overlay {
                    Image(systemName: "photo")
                        .foregroundStyle(AppColors.textSecondary)
                }
        }
    }

    private func badge(_ key: LocalizedStringKey) -> some View {
        Text(key)
            .font(AppTypography.micro)
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(AppColors.elevatedSurface)
            .foregroundStyle(AppColors.accent)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.sm))
    }

    private func detailRow(titleKey: LocalizedStringKey, valueKey: String) -> some View {
        detailRow(titleKey: titleKey, value: NSLocalizedString(valueKey, comment: ""))
    }

    private func detailRow(titleKey: LocalizedStringKey, value: String) -> some View {
        HStack(alignment: .top, spacing: AppSpacing.sm) {
            Text(titleKey)
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.textSecondary)
                .frame(width: 92, alignment: .leading)

            Text(value)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textPrimary)
                .fixedSize(horizontal: false, vertical: true)

            Spacer(minLength: 0)
        }
    }
}
