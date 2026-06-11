import SwiftUI

struct PoseGuideButton: View {
    let isActive: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: "figure.stand")
                    .font(.system(size: 12, weight: .bold))

                Text("camera.pose.short")
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.76)
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(isActive ? AppColors.accent.opacity(0.26) : Color.black.opacity(0.48))
            .foregroundStyle(isActive ? AppColors.accent : .white)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(isActive ? AppColors.accent.opacity(0.48) : Color.white.opacity(0.16), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.pose.entry")
    }
}
