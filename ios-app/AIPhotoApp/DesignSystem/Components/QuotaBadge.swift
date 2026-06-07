import SwiftUI

struct QuotaBadge: View {
    let status: QuotaStatus

    var body: some View {
        HStack(spacing: AppSpacing.xs) {
            Image(systemName: status.isLow ? "exclamationmark.circle.fill" : "bolt.circle.fill")
            Text(status.localizedSummaryKey)
                .font(AppTypography.caption)
        }
        .padding(.vertical, AppSpacing.sm)
        .padding(.horizontal, AppSpacing.md)
        .background(status.isLow ? AppColors.warning.opacity(0.22) : AppColors.surface)
        .foregroundStyle(status.isLow ? AppColors.warning : AppColors.textPrimary)
        .clipShape(Capsule())
        .accessibilityLabel(status.localizedSummaryKey)
    }
}

#Preview {
    VStack {
        QuotaBadge(status: .sample)
        QuotaBadge(status: .lowSample)
    }
    .padding()
    .background(AppColors.background)
}
