import PhotosUI
import SwiftUI

struct FilterLabView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = FilterLabViewModel()
    @State private var styleReferencePickerItem: PhotosPickerItem?
    @State private var applyTargetPickerItem: PhotosPickerItem?
    #if DEBUG
    @State private var showsCloudDebugConsent = false
    #endif

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: AppSpacing.lg) {
                    header

                    ReferenceImagePickerView(
                        selection: $styleReferencePickerItem,
                        selectedImage: viewModel.styleReferenceImage,
                        titleKey: "filter_lab.style_reference.title",
                        noteKey: "filter_lab.style_reference.note",
                        actionKey: "filter_lab.action.choose_style_reference",
                        isDisabled: viewModel.state == .analyzing,
                        onUseSample: {
                            Task {
                                await viewModel.useSampleStyleReferenceImage()
                            }
                        },
                        onShowUnavailable: {
                            viewModel.showUnavailableState()
                        }
                    )

                    ReferenceImagePickerView(
                        selection: $applyTargetPickerItem,
                        selectedImage: viewModel.applyTargetImage,
                        titleKey: "filter_lab.apply_target.title",
                        noteKey: "filter_lab.apply_target.note",
                        actionKey: "filter_lab.action.choose_apply_target",
                        isDisabled: viewModel.state == .analyzing,
                        onUseSample: {
                            Task {
                                await viewModel.useSampleApplyTargetImage()
                            }
                        },
                        onShowUnavailable: {
                            viewModel.showUnavailableState()
                        }
                    )

                    stateContent
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(AppSpacing.lg)
                .padding(.bottom, AppSpacing.xl)
            }
            .background(AppColors.background)
            .navigationTitle(Text("filter_lab.title"))
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("camera.action.close") {
                        dismiss()
                    }
                }
            }
            .onChange(of: styleReferencePickerItem) { _, newValue in
                Task {
                    await viewModel.importStyleReferenceImage(from: newValue)
                    styleReferencePickerItem = nil
                }
            }
            .onChange(of: applyTargetPickerItem) { _, newValue in
                Task {
                    await viewModel.importApplyTargetImage(from: newValue)
                    applyTargetPickerItem = nil
                }
            }
            #if DEBUG
            .sheet(isPresented: $showsCloudDebugConsent) {
                CloudAIConsentView(
                    onAccept: { consent in
                        showsCloudDebugConsent = false
                        Task {
                            await viewModel.generateCloudDebug(consent: consent)
                        }
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
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text("filter_lab.badge")
                .font(AppTypography.micro)
                .padding(.vertical, AppSpacing.xs)
                .padding(.horizontal, AppSpacing.sm)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(Capsule())

            Text("filter_lab.heading")
                .font(AppTypography.title1)
                .foregroundStyle(AppColors.textPrimary)
                .fixedSize(horizontal: false, vertical: true)

            Text("filter_lab.subtitle")
                .font(AppTypography.body)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            Text("filter_lab.privacy_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            #if DEBUG
            if viewModel.canGenerate {
                Button {
                    showCloudDebugConsent()
                } label: {
                    Label("filter_lab.cloud_debug.action", systemImage: "network")
                        .font(AppTypography.micro.weight(.semibold))
                }
                .buttonStyle(.plain)
                .foregroundStyle(AppColors.accent)
                .disabled(viewModel.state == .analyzing)
                .padding(.top, AppSpacing.xs)
            }

            if let fallbackMessageKey = viewModel.cloudDebugFallbackMessageKey {
                Text(LocalizedStringKey(fallbackMessageKey))
                    .font(AppTypography.micro)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            #endif
        }
    }

    @ViewBuilder
    private var stateContent: some View {
        switch viewModel.state {
        case .idle:
            #if DEBUG
            if viewModel.canGenerate {
                cloudDebugReadyView
            } else {
                EmptyStateView(
                    systemImage: "camera.filters",
                    title: "filter_lab.empty.title",
                    message: "filter_lab.empty.message"
                )
            }
            #else
            EmptyStateView(
                systemImage: "camera.filters",
                title: "filter_lab.empty.title",
                message: "filter_lab.empty.message"
            )
            #endif
        case .analyzing:
            analyzingView
        case .result:
            if let recipe = viewModel.recipe,
               let styleReferenceImage = viewModel.styleReferenceImage,
               let applyTargetImage = viewModel.applyTargetImage {
                GeneratedFilterResultView(
                    recipe: recipe,
                    styleReferenceImage: styleReferenceImage,
                    applyTargetImage: applyTargetImage,
                    previewImage: viewModel.previewImage,
                    intensity: viewModel.intensity,
                    isRenderingPreview: viewModel.isRenderingPreview,
                    applyMessageKey: viewModel.applyMessageKey,
                    onIntensityChanged: { value in
                        viewModel.updateIntensity(value)
                    },
                    onApply: {
                        viewModel.applyMockFilter()
                    },
                    onTryAnother: {
                        viewModel.tryAnotherImage()
                    }
                )
            }
        case .failed(let message):
            messageState(
                titleKey: "filter_lab.failed.title",
                message: message,
                systemImage: "exclamationmark.triangle",
                actionKey: "filter_lab.action.retry"
            ) {
                Task {
                    await viewModel.retry()
                }
            }
        case .unavailable(let message):
            messageState(
                titleKey: "filter_lab.unavailable.title",
                message: message,
                systemImage: "wifi.slash",
                actionKey: "filter_lab.action.use_sample"
            ) {
                Task {
                    await viewModel.retry()
                }
            }
        }
    }

    #if DEBUG
    private var cloudDebugReadyView: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Image(systemName: "network")
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(AppColors.accent)

            Text("filter_lab.cloud_debug.ready.title")
                .font(AppTypography.title2)
                .foregroundStyle(AppColors.textPrimary)

            Text("filter_lab.cloud_debug.ready.message")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            PrimaryButton("filter_lab.cloud_debug.action", systemImage: "network") {
                showCloudDebugConsent()
            }
            .disabled(viewModel.state == .analyzing)
        }
        .padding(AppSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private func showCloudDebugConsent() {
        showsCloudDebugConsent = true
    }
    #endif

    private var analyzingView: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            ProgressView()
                .controlSize(.large)

            Text("filter_lab.analyzing.title")
                .font(AppTypography.title2)
                .foregroundStyle(AppColors.textPrimary)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text("filter_lab.analyzing.step.tone")
                Text("filter_lab.analyzing.step.recipe")
                Text("filter_lab.analyzing.step.preview")
            }
            .font(AppTypography.caption)
            .foregroundStyle(AppColors.textSecondary)

            Button {
                viewModel.tryAnotherImage()
            } label: {
                Label("filter_lab.action.cancel", systemImage: "xmark.circle")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textPrimary)
            }
        }
        .padding(AppSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private func messageState(
        titleKey: LocalizedStringKey,
        message: String,
        systemImage: String,
        actionKey: LocalizedStringKey,
        action: @escaping () -> Void
    ) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Image(systemName: systemImage)
                .font(.system(size: 24, weight: .semibold))
                .foregroundStyle(AppColors.accent)

            Text(titleKey)
                .font(AppTypography.title2)
                .foregroundStyle(AppColors.textPrimary)

            Text(message)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            PrimaryButton(actionKey, systemImage: "arrow.triangle.2.circlepath") {
                action()
            }
        }
        .padding(AppSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }
}
