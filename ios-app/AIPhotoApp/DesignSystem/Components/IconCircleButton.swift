import SwiftUI

struct IconCircleButton: View {
    let systemImage: String
    let accessibilityTitle: LocalizedStringKey
    let isEnabled: Bool
    let action: () -> Void

    init(
        systemImage: String,
        accessibilityTitle: LocalizedStringKey,
        isEnabled: Bool = true,
        action: @escaping () -> Void
    ) {
        self.systemImage = systemImage
        self.accessibilityTitle = accessibilityTitle
        self.isEnabled = isEnabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: 17, weight: .semibold))
                .frame(width: 44, height: 44)
                .background(AppColors.surface)
                .foregroundStyle(isEnabled ? AppColors.textPrimary : AppColors.textSecondary)
                .clipShape(Circle())
        }
        .disabled(!isEnabled)
        .accessibilityLabel(accessibilityTitle)
    }
}
