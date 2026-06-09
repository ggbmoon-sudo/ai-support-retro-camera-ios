import SwiftUI

struct HomeView: View {
    private let inspirationCards = InspirationCard.samples

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.xl) {
                VStack(alignment: .leading, spacing: AppSpacing.sm) {
                    Text("home.badge.mock_mvp")
                        .font(AppTypography.micro)
                        .padding(.vertical, AppSpacing.xs)
                        .padding(.horizontal, AppSpacing.sm)
                        .background(AppColors.elevatedSurface)
                        .foregroundStyle(AppColors.accent)
                        .clipShape(Capsule())

                    Text("home.title")
                        .font(AppTypography.title1)
                        .foregroundStyle(AppColors.textPrimary)
                        .fixedSize(horizontal: false, vertical: true)

                    Text("home.subtitle")
                        .font(AppTypography.body)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    Text("home.section.inspiration")
                        .font(AppTypography.title2)
                        .foregroundStyle(AppColors.textPrimary)

                    ForEach(inspirationCards) { card in
                        inspirationCard(card)
                    }
                }

                Text("home.phase_note")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(AppSpacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(AppColors.surface)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
            }
            .padding(AppSpacing.lg)
        }
        .background(AppColors.background)
        .navigationTitle(Text("tab.home"))
    }

    private func inspirationCard(_ card: InspirationCard) -> some View {
        HStack(spacing: AppSpacing.md) {
            Image(systemName: card.symbolName)
                .font(.system(size: 22, weight: .semibold))
                .frame(width: 48, height: 48)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(LocalizedStringKey(card.titleKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text(LocalizedStringKey(card.descriptionKey))
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer()
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }
}

private struct InspirationCard: Identifiable {
    let id: String
    let symbolName: String
    let titleKey: String
    let descriptionKey: String

    static let samples = [
        InspirationCard(
            id: "today",
            symbolName: "sparkles",
            titleKey: "home.inspiration.today.title",
            descriptionKey: "home.inspiration.today.description"
        ),
        InspirationCard(
            id: "import_ai",
            symbolName: "photo.on.rectangle",
            titleKey: "home.inspiration.import_ai.title",
            descriptionKey: "home.inspiration.import_ai.description"
        ),
        InspirationCard(
            id: "portrait",
            symbolName: "person.crop.rectangle",
            titleKey: "home.inspiration.portrait.title",
            descriptionKey: "home.inspiration.portrait.description"
        ),
        InspirationCard(
            id: "filters",
            symbolName: "camera.filters",
            titleKey: "home.inspiration.filters.title",
            descriptionKey: "home.inspiration.filters.description"
        ),
        InspirationCard(
            id: "future_ai",
            symbolName: "wand.and.stars",
            titleKey: "home.inspiration.future_ai.title",
            descriptionKey: "home.inspiration.future_ai.description"
        )
    ]
}

#Preview {
    NavigationStack {
        HomeView()
    }
}
