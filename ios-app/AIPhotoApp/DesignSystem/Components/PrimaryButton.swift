import SwiftUI

struct PrimaryButton: View {
    private let title: LocalizedStringKey
    private let systemImage: String?
    private let isEnabled: Bool
    private let action: () -> Void

    init(
        _ title: LocalizedStringKey,
        systemImage: String? = nil,
        isEnabled: Bool = true,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.systemImage = systemImage
        self.isEnabled = isEnabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: AppSpacing.sm) {
                if let systemImage {
                    Image(systemName: systemImage)
                }
                Text(title)
                    .font(AppTypography.bodyEmphasis)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, AppSpacing.md)
            .padding(.horizontal, AppSpacing.lg)
            .background(isEnabled ? AppColors.accent : AppColors.elevatedSurface)
            .foregroundStyle(isEnabled ? Color.black : AppColors.textSecondary)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .disabled(!isEnabled)
        .accessibilityLabel(title)
    }
}

#Preview {
    VStack {
        PrimaryButton("onboarding.button.start", systemImage: "sparkles") {}
        PrimaryButton("phase.placeholder", systemImage: "hourglass", isEnabled: false) {}
    }
    .padding()
    .background(AppColors.background)
}
