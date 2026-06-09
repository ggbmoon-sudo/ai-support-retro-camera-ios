import SwiftUI

struct CameraView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = CameraViewModel(
        service: CameraCaptureService(),
        photoSaveService: MockPhotoSaveService(),
        failingPhotoSaveService: MockPhotoSaveService(mode: .failure)
    )

    var body: some View {
        NavigationStack {
            ZStack {
                AppColors.background.ignoresSafeArea()

                VStack(spacing: AppSpacing.lg) {
                    content

                    if let errorMessage = viewModel.errorMessage {
                        Text(errorMessage)
                            .font(AppTypography.caption)
                            .foregroundStyle(AppColors.error)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    if let filterErrorMessage = viewModel.filterErrorMessage {
                        Text(filterErrorMessage)
                            .font(AppTypography.caption)
                            .foregroundStyle(AppColors.error)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    Text("camera.local_only_note")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(AppSpacing.lg)
            }
            .navigationTitle(Text("camera.title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("camera.action.close") {
                        viewModel.stopCamera()
                        dismiss()
                    }
                }
            }
            .task {
                await viewModel.prepareCamera()
            }
            .onDisappear {
                viewModel.stopCamera()
            }
            .onChange(of: viewModel.pickerItem) { _, _ in
                Task {
                    await viewModel.importSelectedPhoto()
                }
            }
        }
    }

    @ViewBuilder
    private var content: some View {
        if let selectedPhoto = viewModel.selectedPhoto {
            previewContent(selectedPhoto)
        } else {
            captureContent
        }
    }

    private var captureContent: some View {
        VStack(spacing: AppSpacing.lg) {
            previewSurface

            VStack(spacing: AppSpacing.md) {
                if viewModel.permissionState == .authorized {
                    PrimaryButton(
                        "camera.action.capture",
                        systemImage: "camera.circle",
                        isEnabled: !viewModel.isLoading
                    ) {
                        viewModel.capturePhoto()
                    }
                } else if viewModel.permissionState == .notDetermined {
                    PrimaryButton(
                        "camera.permission.request",
                        systemImage: "camera",
                        isEnabled: !viewModel.isLoading
                    ) {
                        Task { await viewModel.requestCameraAccess() }
                    }
                }

                PhotoPickerView(selection: $viewModel.pickerItem, isLoading: viewModel.isLoading)
            }
        }
    }

    private var previewSurface: some View {
        ZStack {
            RoundedRectangle(cornerRadius: AppCornerRadius.lg)
                .fill(AppColors.surface)

            switch viewModel.permissionState {
            case .authorized:
                CameraPreviewView(session: viewModel.service.session)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
                    .overlay {
                        ruleOfThirdsGrid
                    }
            case .notDetermined, .denied, .restricted, .unavailable:
                permissionMessage
                    .padding(AppSpacing.xl)
            }
        }
        .frame(maxWidth: .infinity)
        .aspectRatio(3 / 4, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var permissionMessage: some View {
        VStack(spacing: AppSpacing.md) {
            Image(systemName: "camera.viewfinder")
                .font(.system(size: 44, weight: .semibold))
                .foregroundStyle(AppColors.accent)

            Text(viewModel.permissionState.titleKey)
                .font(AppTypography.title2)
                .foregroundStyle(AppColors.textPrimary)

            Text(viewModel.permissionState.messageKey)
                .font(AppTypography.body)
                .foregroundStyle(AppColors.textSecondary)
                .multilineTextAlignment(.center)
        }
    }

    private var ruleOfThirdsGrid: some View {
        GeometryReader { proxy in
            Path { path in
                let width = proxy.size.width
                let height = proxy.size.height

                for index in 1...2 {
                    let x = width * CGFloat(index) / 3
                    path.move(to: CGPoint(x: x, y: 0))
                    path.addLine(to: CGPoint(x: x, y: height))

                    let y = height * CGFloat(index) / 3
                    path.move(to: CGPoint(x: 0, y: y))
                    path.addLine(to: CGPoint(x: width, y: y))
                }
            }
            .stroke(Color.white.opacity(0.24), lineWidth: 1)
        }
        .allowsHitTesting(false)
    }

    private func previewContent(_ photo: CapturedPhoto) -> some View {
        ScrollView {
            LazyVStack(spacing: AppSpacing.lg) {
                FilteredPhotoPreview(
                    photo: photo,
                    previewImage: viewModel.filteredPreviewImage ?? photo.image,
                    selectedPreset: viewModel.selectedFilterPreset,
                    presets: viewModel.filterPresets,
                    isRendering: viewModel.isFiltering,
                    saveState: viewModel.photoSaveState,
                    onSelectPreset: viewModel.selectFilterPreset,
                    onSavePhoto: { shouldFail in
                        Task {
                            await viewModel.saveSelectedPhoto(shouldFail: shouldFail)
                        }
                    }
                )

                VStack(spacing: AppSpacing.md) {
                    PrimaryButton("camera.action.retake", systemImage: "arrow.counterclockwise") {
                        viewModel.resetSelection()
                    }

                    PhotoPickerView(selection: $viewModel.pickerItem, isLoading: viewModel.isLoading)

                    PrimaryButton(
                        "camera.action.continue_placeholder",
                        systemImage: "sparkles",
                        isEnabled: false
                    ) {}
                }
            }
            .padding(.bottom, AppSpacing.xl)
        }
        .scrollIndicators(.visible)
    }
}

#Preview {
    CameraView()
}
