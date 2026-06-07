import SwiftUI

struct AuthView: View {
    @ObservedObject var viewModel: AuthViewModel

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.xl) {
                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    Text("auth.title")
                        .font(AppTypography.title1)
                        .foregroundStyle(AppColors.textPrimary)

                    Text("auth.subtitle")
                        .font(AppTypography.body)
                        .foregroundStyle(AppColors.textSecondary)
                }

                Picker("auth.mode.picker", selection: $viewModel.mode) {
                    ForEach(AuthMode.allCases) { mode in
                        Text(mode.titleKey).tag(mode)
                    }
                }
                .pickerStyle(.segmented)

                EmailAuthForm(
                    email: $viewModel.email,
                    password: $viewModel.password,
                    mode: viewModel.mode,
                    isLoading: viewModel.isLoading
                ) {
                    Task { await viewModel.submitEmailPassword() }
                }

                VStack(spacing: AppSpacing.md) {
                    GoogleSignInButtonRow(isLoading: viewModel.isLoading) {
                        Task { await viewModel.signInWithGoogle() }
                    }

                    AppleSignInButtonRow(isLoading: viewModel.isLoading) {
                        Task { await viewModel.signInWithApple() }
                    }
                }

                PrimaryButton(
                    "auth.guest.continue",
                    systemImage: "sparkles",
                    isEnabled: !viewModel.isLoading
                ) {
                    Task { await viewModel.continueAsGuest() }
                }

                VStack(alignment: .leading, spacing: AppSpacing.sm) {
                    Text("auth.guest.message")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)

                    Text("auth.legal.placeholder")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                }

                if viewModel.isLoading {
                    Label("auth.loading", systemImage: "hourglass")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                }

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.error)
                }
            }
            .padding(AppSpacing.xl)
        }
        .background(AppColors.background)
    }
}

#Preview {
    AuthView(viewModel: AuthViewModel())
}
