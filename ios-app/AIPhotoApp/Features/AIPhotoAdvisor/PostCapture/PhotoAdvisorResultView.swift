import SwiftUI

struct PhotoAdvisorResultView: View {
    let photoId: String
    let source: PhotoAdvisorPhotoSource
    let selectedPreset: FilterPreset
    let presets: [FilterPreset]
    let imageSignal: PhotoAdvisorImageSignal
    let isRendering: Bool
    let onApplyFilter: (FilterPreset) -> Void

    @StateObject private var viewModel: PhotoAdvisorViewModel
    @State private var applyMessageKey: String?

    init(
        photoId: String,
        source: PhotoAdvisorPhotoSource,
        selectedPreset: FilterPreset,
        presets: [FilterPreset],
        imageSignal: PhotoAdvisorImageSignal = .unavailable,
        isRendering: Bool,
        onApplyFilter: @escaping (FilterPreset) -> Void
    ) {
        self.photoId = photoId
        self.source = source
        self.selectedPreset = selectedPreset
        self.presets = presets
        self.imageSignal = imageSignal
        self.isRendering = isRendering
        self.onApplyFilter = onApplyFilter
        _viewModel = StateObject(wrappedValue: PhotoAdvisorViewModel())
    }

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            header
            stateContent
            footer
        }
        .padding(AppSpacing.md)
        .background(AppColors.elevatedSurface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.lg)
                .stroke(AppColors.accent.opacity(0.18), lineWidth: 1)
        }
        .task(id: currentInput) {
            viewModel.reset()
            await viewModel.analyze(currentInput)
        }
        .onChange(of: selectedPreset.id) { _, _ in
            applyMessageKey = nil
        }
    }

    private var header: some View {
        HStack(alignment: .center, spacing: AppSpacing.sm) {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text("photo_advisor.title")
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text("photo_advisor.subtitle")
                    .font(AppTypography.micro)
                    .foregroundStyle(AppColors.textSecondary)
            }

            Spacer()

            HStack(spacing: AppSpacing.xs) {
                Text("photo_advisor.badge.mock")
                    .font(AppTypography.micro)
                    .foregroundStyle(Color.black)
                    .padding(.vertical, 4)
                    .padding(.horizontal, AppSpacing.sm)
                    .background(AppColors.accent)
                    .clipShape(Capsule())

                Text("photo_advisor.badge.local_demo")
                    .font(AppTypography.micro)
                    .foregroundStyle(AppColors.textPrimary)
                    .padding(.vertical, 4)
                    .padding(.horizontal, AppSpacing.sm)
                    .background(AppColors.surface)
                    .clipShape(Capsule())
            }
        }
    }

    @ViewBuilder
    private var stateContent: some View {
        switch viewModel.state {
        case .idle:
            PrimaryButton("photo_advisor.action.analyze", systemImage: "sparkles") {
                Task {
                    await viewModel.analyze(currentInput)
                }
            }
        case .analyzing:
            analyzingState
        case .success(let result):
            resultContent(result)
        case .failed(let messageKey):
            recoveryState(
                titleKey: "photo_advisor.state.failed",
                messageKey: messageKey,
                actionKey: "photo_advisor.action.use_local_fallback"
            ) {
                Task {
                    await viewModel.runFallback()
                }
            }
        case .unavailable(let messageKey):
            recoveryState(
                titleKey: "photo_advisor.state.unavailable",
                messageKey: messageKey,
                actionKey: "photo_advisor.action.use_local_fallback"
            ) {
                Task {
                    await viewModel.runFallback()
                }
            }
        }
    }

    private var analyzingState: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Label("photo_advisor.state.analyzing", systemImage: "hourglass")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            Text("photo_advisor.state.analyzing_detail")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private func resultContent(_ result: PhotoAdvisorResult) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            VStack(alignment: .leading, spacing: AppSpacing.sm) {
                Text(LocalizedStringKey(result.summaryKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)
                    .fixedSize(horizontal: false, vertical: true)

                if let firstSuggestion = result.suggestions.first {
                    Label {
                        Text(LocalizedStringKey(firstSuggestion.textKey))
                            .fixedSize(horizontal: false, vertical: true)
                    } icon: {
                        Image(systemName: "sparkles")
                    }
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.accent)
                }
            }

            strengthsSection(result.strengthsKeys)
            suggestionsSection(result.suggestions)
            filterSection(result.recommendedFilters)
            adviceSection(result)

            if let applyMessageKey {
                Label(LocalizedStringKey(applyMessageKey), systemImage: "info.circle")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
            }

            HStack(spacing: AppSpacing.sm) {
                Button {
                    Task {
                        await viewModel.retry()
                    }
                } label: {
                    Label("photo_advisor.action.retry", systemImage: "arrow.clockwise")
                        .font(AppTypography.caption.weight(.semibold))
                }
                .foregroundStyle(AppColors.accent)
                .disabled(viewModel.state.isAnalyzing)

                Spacer()

                Text(sourceKey(result.source))
                    .font(AppTypography.micro)
                    .foregroundStyle(AppColors.textSecondary)
            }
        }
    }

    private func strengthsSection(_ strengths: [String]) -> some View {
        compactSection(titleKey: "photo_advisor.section.strengths", icon: "checkmark.seal") {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                ForEach(strengths, id: \.self) { key in
                    bulletText(key)
                }
            }
        }
    }

    private func suggestionsSection(_ suggestions: [PhotoAdvisorSuggestion]) -> some View {
        compactSection(titleKey: "photo_advisor.section.suggestions", icon: "wand.and.stars") {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                ForEach(suggestions) { suggestion in
                    bulletText(suggestion.textKey)
                }
            }
        }
    }

    private func filterSection(_ recommendations: [PhotoAdvisorFilterRecommendation]) -> some View {
        compactSection(titleKey: "photo_advisor.section.filters", icon: "camera.filters") {
            VStack(spacing: AppSpacing.sm) {
                ForEach(recommendations) { recommendation in
                    let preset = preset(for: recommendation.filterId)
                    PhotoAdvisorFilterRecommendationView(
                        recommendation: recommendation,
                        preset: preset,
                        isSelected: preset?.id == selectedPreset.id,
                        isRendering: isRendering,
                        onApply: applyRecommendedFilter
                    )
                }
            }
        }
    }

    private func adviceSection(_ result: PhotoAdvisorResult) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            adviceRow(
                titleKey: "photo_advisor.section.retake",
                icon: result.retakeAdvice.shouldRetake ? "arrow.triangle.2.circlepath" : "checkmark.circle",
                textKey: result.retakeAdvice.reasonKey
            )

            if let cropAdvice = result.cropAdvice {
                adviceRow(
                    titleKey: "photo_advisor.section.crop",
                    icon: cropAdvice.recommended ? "crop" : "rectangle.dashed",
                    textKey: cropAdvice.textKey
                )
            }
        }
    }

    private func recoveryState(
        titleKey: LocalizedStringKey,
        messageKey: String,
        actionKey: LocalizedStringKey,
        action: @escaping () -> Void
    ) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Label(titleKey, systemImage: "exclamationmark.triangle")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.warning)

            Text(LocalizedStringKey(messageKey))
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            Button(action: action) {
                Label(actionKey, systemImage: "arrow.clockwise")
                    .font(AppTypography.caption.weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .background(AppColors.surface)
                    .foregroundStyle(AppColors.textPrimary)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
            .buttonStyle(.plain)
        }
    }

    private var footer: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text("photo_advisor.footer.no_upload")
            Text("photo_advisor.footer.future_cloud")
        }
        .font(AppTypography.micro)
        .foregroundStyle(AppColors.textSecondary)
        .fixedSize(horizontal: false, vertical: true)
    }

    private func compactSection<Content: View>(
        titleKey: LocalizedStringKey,
        icon: String,
        @ViewBuilder content: () -> Content
    ) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Label(titleKey, systemImage: icon)
                .font(AppTypography.caption.weight(.semibold))
                .foregroundStyle(AppColors.textPrimary)

            content()
        }
        .padding(AppSpacing.sm)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface.opacity(0.72))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private func bulletText(_ key: String) -> some View {
        HStack(alignment: .top, spacing: AppSpacing.xs) {
            Text("•")
                .foregroundStyle(AppColors.accent)
            Text(LocalizedStringKey(key))
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .font(AppTypography.caption)
    }

    private func adviceRow(titleKey: LocalizedStringKey, icon: String, textKey: String) -> some View {
        HStack(alignment: .top, spacing: AppSpacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 14, weight: .semibold))
                .foregroundStyle(AppColors.accent)
                .frame(width: 20)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(titleKey)
                    .font(AppTypography.caption.weight(.semibold))
                    .foregroundStyle(AppColors.textPrimary)

                Text(LocalizedStringKey(textKey))
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(AppSpacing.sm)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface.opacity(0.72))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private var currentInput: PhotoAdvisorInput {
        PhotoAdvisorInput(
            photoId: photoId,
            source: source,
            selectedFilterId: selectedPreset.id,
            imageSignal: imageSignal
        )
    }

    private func preset(for filterId: String) -> FilterPreset? {
        presets.first { $0.id == filterId }
    }

    private func applyRecommendedFilter(_ preset: FilterPreset) {
        guard !isRendering else { return }
        onApplyFilter(preset)
        applyMessageKey = "photo_advisor.action.applied_message"
    }

    private func sourceKey(_ source: PhotoAdvisorSource) -> LocalizedStringKey {
        switch source {
        case .mock:
            return "photo_advisor.source.mock"
        case .local:
            return "photo_advisor.source.local"
        case .cloud:
            return "photo_advisor.source.cloud"
        case .fallback:
            return "photo_advisor.source.fallback"
        }
    }
}

#Preview {
    PhotoAdvisorResultView(
        photoId: "preview-photo",
        source: .imported,
        selectedPreset: FilterPresetCatalog.original,
        presets: FilterPresetCatalog.all,
        isRendering: false,
        onApplyFilter: { _ in }
    )
    .padding()
    .background(AppColors.background)
}
