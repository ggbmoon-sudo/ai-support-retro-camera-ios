import PhotosUI
import SwiftUI

struct FilterLabView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = FilterLabViewModel()
    @State private var pickerItem: PhotosPickerItem?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: AppSpacing.lg) {
                    header

                    ReferenceImagePickerView(
                        selection: $pickerItem,
                        isDisabled: viewModel.state == .analyzing,
                        onUseSample: {
                            Task {
                                await viewModel.useSampleReferenceImage()
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
            .onChange(of: pickerItem) { _, newValue in
                Task {
                    await viewModel.importReferenceImage(from: newValue)
                    pickerItem = nil
                }
            }
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
        }
    }

    @ViewBuilder
    private var stateContent: some View {
        switch viewModel.state {
        case .idle:
            EmptyStateView(
                systemImage: "camera.filters",
                title: "filter_lab.empty.title",
                message: "filter_lab.empty.message"
            )
        case .analyzing:
            analyzingView
        case .result:
            if let recipe = viewModel.recipe,
               let referenceImage = viewModel.referenceImage {
                GeneratedFilterResultView(
                    recipe: recipe,
                    referenceImage: referenceImage,
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
                    await viewModel.useSampleReferenceImage()
                }
            }
        }
    }

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
