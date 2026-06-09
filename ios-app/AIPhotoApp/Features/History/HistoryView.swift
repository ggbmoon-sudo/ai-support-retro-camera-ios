import SwiftUI

struct HistoryView: View {
    @EnvironmentObject private var sessionHistoryStore: SessionHistoryStore

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.lg) {
                header

                if sessionHistoryStore.items.isEmpty {
                    HistoryEmptyStateView()
                } else {
                    LazyVStack(spacing: AppSpacing.md) {
                        ForEach(sessionHistoryStore.items) { item in
                            HistoryItemCard(item: item)
                        }
                    }
                }
            }
            .padding(AppSpacing.lg)
        }
        .background(AppColors.background)
        .navigationTitle(Text("tab.history"))
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    Text("history.session.title")
                        .font(AppTypography.title2)
                        .foregroundStyle(AppColors.textPrimary)

                    Text("history.session.message")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Spacer()

                if !sessionHistoryStore.items.isEmpty {
                    Button("history.action.clear") {
                        sessionHistoryStore.clear()
                    }
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.accent)
                }
            }
        }
        .padding(AppSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.elevatedSurface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }
}

#Preview {
    NavigationStack {
        HistoryView()
    }
    .environmentObject(SessionHistoryStore())
}
