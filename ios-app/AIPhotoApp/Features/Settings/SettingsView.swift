import SwiftUI

struct SettingsView: View {
    let authUser: AuthUser?
    let onSignOut: () -> Void

    init(authUser: AuthUser? = nil, onSignOut: @escaping () -> Void = {}) {
        self.authUser = authUser
        self.onSignOut = onSignOut
    }

    var body: some View {
        List {
            Section {
                Text("settings.local_only_note")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(.vertical, AppSpacing.xs)
            }

            Section {
                settingsRow(
                    icon: "person.crop.circle",
                    title: "settings.auth.title",
                    detail: authStatusKey
                )

                Button(action: onSignOut) {
                    settingsRow(
                        icon: "rectangle.portrait.and.arrow.right",
                        title: "settings.auth.sign_out",
                        detail: "settings.auth.sign_out.placeholder"
                    )
                }
                .disabled(authUser == nil)
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
                settingsRow(
                    icon: "trash",
                    title: "settings.privacy.delete_account",
                    detail: "settings.privacy.delete_account.placeholder"
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

    private var authStatusKey: LocalizedStringKey {
        authUser?.isGuest == true ? "settings.auth.guest" : "settings.auth.signed_in"
    }
}

#Preview {
    NavigationStack {
        SettingsView()
    }
}
