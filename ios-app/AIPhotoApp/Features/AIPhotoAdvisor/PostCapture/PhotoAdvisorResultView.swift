import SwiftUI
import UIKit

struct PhotoAdvisorResultView: View {
    let photoId: String
    let source: PhotoAdvisorPhotoSource
    let selectedPreset: FilterPreset
    let presets: [FilterPreset]
    let imageSignal: PhotoAdvisorImageSignal
    let captureContext: CameraCaptureContext
    let debugSourceImage: UIImage?
    let isRendering: Bool
    let onApplyFilter: (FilterPreset) -> Void

    @StateObject private var viewModel: PhotoAdvisorViewModel
    @ObservedObject private var toneSettings = CameraCoachToneSettingsStore.shared
    @State private var applyMessageKey: String?
    #if DEBUG
    @State private var showsCloudDebugConsent = false
    #endif

    init(
        photoId: String,
        source: PhotoAdvisorPhotoSource,
        selectedPreset: FilterPreset,
        presets: [FilterPreset],
        imageSignal: PhotoAdvisorImageSignal = .unavailable,
        captureContext: CameraCaptureContext = .mock,
        debugSourceImage: UIImage? = nil,
        isRendering: Bool,
        onApplyFilter: @escaping (FilterPreset) -> Void
    ) {
        self.photoId = photoId
        self.source = source
        self.selectedPreset = selectedPreset
        self.presets = presets
        self.imageSignal = imageSignal
        self.captureContext = captureContext
        self.debugSourceImage = debugSourceImage
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
        #if DEBUG
        .sheet(isPresented: $showsCloudDebugConsent) {
            CloudAIConsentView(
                onAccept: { consent in
                    showsCloudDebugConsent = false
                    runCloudDebug(consent: consent)
                },
                onCancel: {
                    showsCloudDebugConsent = false
                }
            )
            .presentationDetents([.medium])
            .presentationDragIndicator(.visible)
            .padding()
        }
        #endif
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
        let card = PhotoAdvisorResultCardModel(result: result, input: currentInput)

        return VStack(alignment: .leading, spacing: AppSpacing.md) {
            VStack(alignment: .leading, spacing: AppSpacing.sm) {
                Text(LocalizedStringKey(card.moodHeadlineKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)
                    .fixedSize(horizontal: false, vertical: true)

                if let visualReasonKey = card.visualReasonKey {
                    Label {
                        Text(LocalizedStringKey(visualReasonKey))
                            .fixedSize(horizontal: false, vertical: true)
                    } icon: {
                        Image(systemName: "sparkles")
                    }
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.accent)
                }
            }

            #if DEBUG
            captureContextDebugPreview
            #endif

            if let fallbackMessageKey = card.fallbackMessageKey {
                fallbackContextRow(fallbackMessageKey)
            }

            if let recommendation = card.primaryFilterRecommendation {
                filterSection(recommendation)
            }

            adviceSection(card)

            #if DEBUG
            if let messageKey = viewModel.cloudDebugFallbackMessageKey {
                Label(LocalizedStringKey(messageKey), systemImage: "wifi.exclamationmark")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.warning)
                    .fixedSize(horizontal: false, vertical: true)
            }
            #endif

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
            }
        }
    }

    private func filterSection(_ recommendation: PhotoAdvisorFilterRecommendation) -> some View {
        compactSection(titleKey: "photo_advisor.section.filters", icon: "camera.filters") {
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

    private func adviceSection(_ card: PhotoAdvisorResultCardModel) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            ForEach(card.adviceItems) { advice in
                adviceRow(advice)
            }
        }
    }

    private func fallbackContextRow(_ messageKey: String) -> some View {
        Label {
            Text(LocalizedStringKey(messageKey))
                .fixedSize(horizontal: false, vertical: true)
        } icon: {
            Image(systemName: "info.circle")
        }
        .font(AppTypography.caption)
        .foregroundStyle(AppColors.textSecondary)
        .padding(AppSpacing.sm)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
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

            #if DEBUG
            if debugSourceImage != nil {
                Button {
                    showsCloudDebugConsent = true
                } label: {
                    Label("photo_advisor.cloud_debug.action", systemImage: "network")
                        .font(AppTypography.micro.weight(.semibold))
                }
                .buttonStyle(.plain)
                .foregroundStyle(AppColors.accent)
                .disabled(viewModel.state.isAnalyzing)
                .padding(.top, AppSpacing.xs)
            }
            #endif
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

    private func adviceRow(_ advice: PhotoAdvisorCardAdvice) -> some View {
        adviceRow(
            titleKey: LocalizedStringKey(advice.titleKey),
            icon: advice.icon,
            textKey: advice.textKey
        )
    }

    private var currentInput: PhotoAdvisorInput {
        PhotoAdvisorInput(
            photoId: photoId,
            source: source,
            selectedFilterId: selectedPreset.id,
            imageSignal: imageSignal,
            languageMode: toneSettings.runtimeLanguageMode,
            toneMode: toneSettings.runtimeToneMode,
            captureContext: captureContext
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

    #if DEBUG
    private var captureContextDebugPreview: some View {
        compactSection(titleKey: "Capture context", icon: "waveform.path.ecg") {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                debugBucketRow("Level", value: debugLevelLabel)
                debugBucketRow("Motion", value: debugMotionLabel)
                debugBucketRow("Light", value: debugLightLabel)
                debugBucketRow("Blur hint", value: captureContext.localImageSignals.blurRisk.rawValue)
                debugBucketRow("Creative intent", value: captureContext.creativeIntent.adviceMode.rawValue)
            }
        }
    }

    private func debugBucketRow(_ label: String, value: String) -> some View {
        HStack(spacing: AppSpacing.xs) {
            Text(label)
                .foregroundStyle(AppColors.textPrimary)
            Text(value.replacingOccurrences(of: "_", with: " "))
                .foregroundStyle(AppColors.textSecondary)
        }
        .font(AppTypography.micro)
    }

    private var debugLevelLabel: String {
        captureContext.level.available
            ? captureContext.level.levelBucket.rawValue
            : "unknown"
    }

    private var debugMotionLabel: String {
        captureContext.motion.available
            ? captureContext.motion.motionBucket.rawValue
            : "unknown"
    }

    private var debugLightLabel: String {
        if captureContext.exposure.available {
            return captureContext.exposure.exposureBucket.rawValue
        }

        switch captureContext.localImageSignals.brightness {
        case .low:
            return "low"
        case .medium:
            return "balanced"
        case .high:
            return "bright"
        case .unknown:
            return "unknown"
        }
    }

    private func runCloudDebug(consent: CloudAIConsent) {
        guard let debugSourceImage else { return }

        Task {
            await viewModel.analyzeCloudDebug(
                currentInput,
                image: debugSourceImage,
                consent: consent,
                selectedFilterId: selectedPreset.id,
                allowedFilterIds: Set(presets.map(\.id))
            )
        }
    }
    #endif
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
