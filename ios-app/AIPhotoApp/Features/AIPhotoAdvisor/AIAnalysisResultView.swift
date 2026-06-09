import SwiftUI

struct AIAnalysisResultView: View {
    let result: PhotoAnalysisResult
    let onRetry: () -> Void
    let onDismiss: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            badgeRow

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text("ai.result.summary.title")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)

                Text(result.summary)
                    .font(AppTypography.body)
                    .foregroundStyle(AppColors.textPrimary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if !result.suggestions.isEmpty {
                VStack(alignment: .leading, spacing: AppSpacing.sm) {
                    Text("ai.result.suggestions.title")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)

                    ForEach(Array(result.suggestions.prefix(3))) { suggestion in
                        AIAnalysisSuggestionCard(suggestion: suggestion)
                    }
                }
            }

            if !result.adjustments.isEmpty {
                VStack(alignment: .leading, spacing: AppSpacing.sm) {
                    Text("ai.result.adjustments.title")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)

                    ForEach(result.adjustments) { hint in
                        AIAdjustmentHintCard(hint: hint)
                    }
                }
            }

            notesSection
            actionRow
        }
    }

    private var badgeRow: some View {
        HStack(spacing: AppSpacing.sm) {
            Label("ai.result.badge.mock", systemImage: "testtube.2")
                .font(AppTypography.micro)
                .padding(.vertical, AppSpacing.xs)
                .padding(.horizontal, AppSpacing.sm)
                .background(AppColors.surface)
                .foregroundStyle(AppColors.accent)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.sm))

            Text(providerText)
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.textSecondary)

            Spacer()
        }
    }

    @ViewBuilder
    private var notesSection: some View {
        if result.compositionNotes != nil || result.lightingNotes != nil {
            VStack(alignment: .leading, spacing: AppSpacing.sm) {
                Text("ai.result.notes.title")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)

                if let compositionNotes = result.compositionNotes {
                    noteRow(title: "ai.result.notes.composition", value: compositionNotes)
                }

                if let lightingNotes = result.lightingNotes {
                    noteRow(title: "ai.result.notes.lighting", value: lightingNotes)
                }
            }
        }
    }

    private func noteRow(title: LocalizedStringKey, value: String) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text(title)
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.accent)

            Text(value)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textPrimary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.sm)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private var actionRow: some View {
        HStack(spacing: AppSpacing.sm) {
            Button("ai.analysis.action.retry") {
                onRetry()
            }
            .font(AppTypography.caption)
            .padding(.vertical, AppSpacing.sm)
            .padding(.horizontal, AppSpacing.md)
            .background(AppColors.elevatedSurface)
            .foregroundStyle(AppColors.accent)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))

            Button("ai.analysis.action.dismiss") {
                onDismiss()
            }
            .font(AppTypography.caption)
            .padding(.vertical, AppSpacing.sm)
            .padding(.horizontal, AppSpacing.md)
            .background(AppColors.elevatedSurface)
            .foregroundStyle(AppColors.textSecondary)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .frame(maxWidth: .infinity, alignment: .trailing)
    }

    private var providerText: LocalizedStringKey {
        switch result.provider {
        case .mock:
            return "ai.result.provider.mock"
        case .cloudFunction:
            return "ai.result.provider.cloud_function"
        case .gemini:
            return "ai.result.provider.gemini"
        case .openAI:
            return "ai.result.provider.openai"
        case .unknown:
            return "ai.result.provider.unknown"
        }
    }
}
