import SwiftUI

struct GoogleSignInButtonRow: View {
    let isLoading: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: AppSpacing.md) {
                Image(systemName: "g.circle")
                    .font(.title3)
                Text("auth.google")
                    .font(AppTypography.bodyEmphasis)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
            }
            .padding(AppSpacing.lg)
            .foregroundStyle(AppColors.textPrimary)
            .background(AppColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .disabled(isLoading)
        .accessibilityLabel(Text("auth.google"))
    }
}

#Preview {
    GoogleSignInButtonRow(isLoading: false) {}
        .padding()
        .background(AppColors.background)
}
