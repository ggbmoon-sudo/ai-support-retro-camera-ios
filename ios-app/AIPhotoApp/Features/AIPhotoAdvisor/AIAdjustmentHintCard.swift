import SwiftUI

struct AIAdjustmentHintCard: View {
    let hint: PhotoAdjustmentHint

    var body: some View {
        HStack(alignment: .top, spacing: AppSpacing.sm) {
            Image(systemName: symbolName)
                .font(.system(size: 16, weight: .semibold))
                .frame(width: 28, height: 28)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.sm))

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                HStack(spacing: AppSpacing.sm) {
                    Text(controlText)
                        .font(AppTypography.bodyEmphasis)
                        .foregroundStyle(AppColors.textPrimary)

                    Text(hint.displayValue)
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.accent)
                }

                Text(hint.reason)
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer(minLength: 0)
        }
        .padding(AppSpacing.sm)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private var controlText: String {
        NSLocalizedString("ai.adjustment.control.\(hint.control.rawValue)", comment: "")
    }

    private var symbolName: String {
        switch hint.control {
        case .exposure:
            return "sun.max"
        case .contrast:
            return "circle.lefthalf.filled"
        case .temperature:
            return "thermometer.sun"
        case .saturation:
            return "drop"
        }
    }
}
