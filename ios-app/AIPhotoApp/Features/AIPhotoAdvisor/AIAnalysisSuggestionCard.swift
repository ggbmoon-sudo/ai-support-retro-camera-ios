import SwiftUI

struct AIAnalysisSuggestionCard: View {
    let suggestion: PhotoSuggestion

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            HStack(alignment: .firstTextBaseline, spacing: AppSpacing.sm) {
                Text(suggestion.title)
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Spacer()

                Text(priorityText)
                    .font(AppTypography.micro)
                    .foregroundStyle(priorityColor)
            }

            Text(suggestion.detail)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.sm)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private var priorityText: String {
        NSLocalizedString("ai.suggestion.priority.\(suggestion.priority.rawValue)", comment: "")
    }

    private var priorityColor: Color {
        switch suggestion.priority {
        case .high:
            return AppColors.error
        case .medium:
            return AppColors.warning
        case .low:
            return AppColors.textSecondary
        }
    }
}
