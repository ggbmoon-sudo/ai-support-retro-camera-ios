import SwiftUI

struct SettingsView: View {
    var body: some View {
        List {
            Section {
                settingsRow(
                    icon: "person.crop.circle",
                    title: "settings.auth.title",
                    detail: "settings.auth.placeholder"
                )
            }

            Section {
                settingsRow(
                    icon: "sparkles",
                    title: "settings.ai.title",
                    detail: "settings.ai.placeholder"
                )
                settingsRow(
                    icon: "lock.shield",
                    title: "settings.privacy.title",
                    detail: "settings.privacy.placeholder"
                )
            }

            Section {
                settingsRow(
                    icon: "creditcard",
                    title: "settings.subscription.title",
                    detail: "settings.subscription.placeholder"
                )
            }
        }
        .scrollContentBackground(.hidden)
        .background(AppColors.background)
        .navigationTitle(Text("tab.settings"))
    }

    private func settingsRow(
        icon: String,
        title: LocalizedStringKey,
        detail: LocalizedStringKey
    ) -> some View {
        HStack(spacing: AppSpacing.md) {
            Image(systemName: icon)
                .frame(width: 28)
                .foregroundStyle(AppColors.accent)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(title)
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)
                Text(detail)
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
            }
        }
        .padding(.vertical, AppSpacing.xs)
        .accessibilityElement(children: .combine)
    }
}

#Preview {
    NavigationStack {
        SettingsView()
    }
}
