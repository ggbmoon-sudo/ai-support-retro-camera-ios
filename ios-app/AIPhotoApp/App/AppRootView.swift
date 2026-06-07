import SwiftUI

struct AppRootView: View {
    @State private var hasFinishedIntro = false

    var body: some View {
        Group {
            if hasFinishedIntro {
                MainTabShellView()
            } else {
                VStack(alignment: .leading, spacing: AppSpacing.xl) {
                    Spacer()

                    VStack(alignment: .leading, spacing: AppSpacing.md) {
                        Text("app.name")
                            .font(AppTypography.display)
                            .foregroundStyle(AppColors.textPrimary)

                        Text("onboarding.subtitle")
                            .font(AppTypography.body)
                            .foregroundStyle(AppColors.textSecondary)
                    }

                    VStack(spacing: AppSpacing.md) {
                        PrimaryButton("onboarding.button.start", systemImage: "sparkles") {
                            hasFinishedIntro = true
                        }

                        PrimaryButton("onboarding.button.auth_placeholder", systemImage: "person.crop.circle", isEnabled: false) {}
                    }
                    .padding(.bottom, AppSpacing.xl)
                }
                .padding(AppSpacing.xl)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(AppColors.background)
            }
        }
    }
}

#Preview {
    AppRootView()
}
