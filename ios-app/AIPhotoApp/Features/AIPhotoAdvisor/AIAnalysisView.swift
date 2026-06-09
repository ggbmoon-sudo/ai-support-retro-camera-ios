import SwiftUI

struct AIAnalysisView: View {
    let photoId: String
    let filterPresetId: String?

    @StateObject private var viewModel: AIAnalysisViewModel

    init(photoId: String, filterPresetId: String?) {
        self.photoId = photoId
        self.filterPresetId = filterPresetId
        _viewModel = StateObject(wrappedValue: AIAnalysisViewModel())
    }

    init(
        photoId: String,
        filterPresetId: String?,
        analysisService: any PhotoAnalysisService,
        failingAnalysisService: any PhotoAnalysisService
    ) {
        self.photoId = photoId
        self.filterPresetId = filterPresetId
        _viewModel = StateObject(
            wrappedValue: AIAnalysisViewModel(
                analysisService: analysisService,
                failingAnalysisService: failingAnalysisService
            )
        )
    }

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            header

            Text("ai.analysis.mock_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            stateContent
        }
        .padding(AppSpacing.md)
        .background(AppColors.elevatedSurface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
        .onChange(of: photoId) { _, _ in
            viewModel.reset()
        }
        .onChange(of: filterPresetId ?? "") { _, _ in
            viewModel.reset()
        }
    }

    private var header: some View {
        HStack(alignment: .center, spacing: AppSpacing.sm) {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text("ai.analysis.title")
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text("ai.analysis.phase_label")
                    .font(AppTypography.micro)
                    .foregroundStyle(AppColors.accent)
            }

            Spacer()

            Image(systemName: "sparkles")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(AppColors.accent)
        }
    }

    @ViewBuilder
    private var stateContent: some View {
        switch viewModel.status {
        case .notStarted, .blockedByConsentLater, .quotaRequiredLater, .unsafeContent:
            actionRow
        case .analyzing:
            Label("ai.analysis.state.loading", systemImage: "hourglass")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
        case .completed:
            if let result = viewModel.result {
                AIAnalysisResultView(
                    result: result,
                    onRetry: {
                        Task {
                            await viewModel.retryLastSuccess()
                        }
                    },
                    onDismiss: viewModel.dismissResult
                )
            } else {
                actionRow
            }
        case .failed:
            failureState
        }
    }

    private var actionRow: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            PrimaryButton(
                "ai.analysis.action.mock_success",
                systemImage: "sparkles",
                isEnabled: !viewModel.isAnalyzing
            ) {
                Task {
                    await viewModel.analyze(photoId: photoId, filterPresetId: filterPresetId)
                }
            }

            Button {
                Task {
                    await viewModel.analyze(photoId: photoId, filterPresetId: filterPresetId, shouldFail: true)
                }
            } label: {
                Label("ai.analysis.action.mock_failure", systemImage: "exclamationmark.triangle")
                    .font(AppTypography.caption)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .background(AppColors.surface)
                    .foregroundStyle(AppColors.textPrimary)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
            .disabled(viewModel.isAnalyzing)
        }
    }

    private var failureState: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Label("ai.analysis.state.failed", systemImage: "xmark.circle.fill")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.error)

            if let errorMessage = viewModel.errorMessage {
                Text(errorMessage)
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.error)
                    .fixedSize(horizontal: false, vertical: true)
            }

            HStack(spacing: AppSpacing.sm) {
                Button("ai.analysis.action.retry") {
                    Task {
                        await viewModel.analyze(photoId: photoId, filterPresetId: filterPresetId)
                    }
                }
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.accent)

                Button("ai.analysis.action.dismiss") {
                    viewModel.dismissResult()
                }
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
            }
        }
    }
}

#Preview {
    AIAnalysisView(photoId: "mock-preview-photo", filterPresetId: "classic_film")
        .padding()
        .background(AppColors.background)
}
