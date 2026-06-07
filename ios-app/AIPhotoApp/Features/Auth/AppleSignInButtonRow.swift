import SwiftUI

struct AppleSignInButtonRow: View {
    let isLoading: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: AppSpacing.md) {
                Image(systemName: "apple.logo")
                    .font(.title3)
                Text("auth.apple")
                    .font(AppTypography.bodyEmphasis)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(AppTypography.caption)
                    .foregroundStyle(Color.white.opacity(0.72))
            }
            .padding(AppSpacing.lg)
            .foregroundStyle(Color.white)
            .background(Color.black)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .disabled(isLoading)
        .accessibilityLabel(Text("auth.apple"))
    }
}

#Preview {
    AppleSignInButtonRow(isLoading: false) {}
        .padding()
        .background(AppColors.background)
}
