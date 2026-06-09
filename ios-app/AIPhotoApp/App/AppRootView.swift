import SwiftUI

struct AppRootView: View {
    @State private var hasFinishedIntro = false
    @StateObject private var authViewModel = AuthViewModel(service: MockAuthService())
    @StateObject private var sessionHistoryStore: SessionHistoryStore = MockSessionHistoryStore()

    var body: some View {
        Group {
            if let currentUser = authViewModel.currentUser {
                MainTabShellView(authUser: currentUser) {
                    Task { await authViewModel.signOut() }
                }
            } else if hasFinishedIntro {
                AuthView(viewModel: authViewModel)
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

                        PrimaryButton("onboarding.button.auth_placeholder", systemImage: "person.crop.circle") {
                            hasFinishedIntro = true
                        }
                    }
                    .padding(.bottom, AppSpacing.xl)
                }
                .padding(AppSpacing.xl)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(AppColors.background)
            }
        }
        .environmentObject(sessionHistoryStore)
        .task {
            await authViewModel.refreshSession()
        }
    }
}

#Preview {
    AppRootView()
}
