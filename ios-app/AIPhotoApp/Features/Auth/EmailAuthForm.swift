import SwiftUI

struct EmailAuthForm: View {
    @Binding var email: String
    @Binding var password: String

    let mode: AuthMode
    let isLoading: Bool
    let onSubmit: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            TextField("auth.email.placeholder", text: $email)
                .textInputAutocapitalization(.never)
                .keyboardType(.emailAddress)
                .textContentType(.emailAddress)
                .authFieldStyle()

            SecureField("auth.password.placeholder", text: $password)
                .textContentType(mode == .signIn ? .password : .newPassword)
                .authFieldStyle()

            PrimaryButton(submitTitle, systemImage: "envelope", isEnabled: !isLoading) {
                onSubmit()
            }
        }
    }

    private var submitTitle: LocalizedStringKey {
        switch mode {
        case .signIn:
            return "auth.email.submit.sign_in"
        case .createAccount:
            return "auth.email.submit.create_account"
        }
    }
}

private extension View {
    func authFieldStyle() -> some View {
        self
            .font(AppTypography.body)
            .padding(.vertical, AppSpacing.md)
            .padding(.horizontal, AppSpacing.lg)
            .background(AppColors.surface)
            .foregroundStyle(AppColors.textPrimary)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            .overlay(
                RoundedRectangle(cornerRadius: AppCornerRadius.md)
                    .stroke(AppColors.elevatedSurface, lineWidth: 1)
            )
    }
}

#Preview {
    EmailAuthForm(
        email: .constant(""),
        password: .constant(""),
        mode: .signIn,
        isLoading: false
    ) {}
    .padding()
    .background(AppColors.background)
}
