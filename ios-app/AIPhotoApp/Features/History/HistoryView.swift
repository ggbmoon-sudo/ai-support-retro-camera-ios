import SwiftUI

struct HistoryView: View {
    private let items: [HistoryPhotoItem] = []

    var body: some View {
        ScrollView {
            VStack(spacing: AppSpacing.lg) {
                QuotaBadge(status: .sample)
                    .frame(maxWidth: .infinity, alignment: .leading)

                if items.isEmpty {
                    EmptyStateView(
                        systemImage: "photo.stack",
                        title: "history.empty.title",
                        message: "history.empty.message"
                    )
                } else {
                    ForEach(items) { item in
                        historyRow(item)
                    }
                }
            }
            .padding(AppSpacing.lg)
        }
        .background(AppColors.background)
        .navigationTitle(Text("tab.history"))
    }

    private func historyRow(_ item: HistoryPhotoItem) -> some View {
        HStack(spacing: AppSpacing.md) {
            RoundedRectangle(cornerRadius: AppCornerRadius.md)
                .fill(AppColors.elevatedSurface)
                .frame(width: 64, height: 64)
                .overlay {
                    Image(systemName: "photo")
                        .foregroundStyle(AppColors.textSecondary)
                }

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(LocalizedStringKey(item.presetNameKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text(LocalizedStringKey(item.shortAdviceKey))
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
        HistoryView()
    }
}
