import PhotosUI
import SwiftUI

struct CameraView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var sessionHistoryStore: SessionHistoryStore
    let showsCloseButton: Bool
    @StateObject private var viewModel = CameraViewModel(
        service: CameraCaptureService(),
        photoSaveService: MockPhotoSaveService(),
        failingPhotoSaveService: MockPhotoSaveService(mode: .failure)
    )
    @State private var isCaptureFilterPickerVisible = false
    @State private var isFlashEnabled = false
    @State private var isTimerEnabled = false
    @State private var isUsingFrontCameraMock = false

    init(showsCloseButton: Bool = true) {
        self.showsCloseButton = showsCloseButton
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.black.ignoresSafeArea()

                ScrollView {
                    VStack(spacing: AppSpacing.lg) {
                        content
                        statusMessages
                        localOnlyNote
                    }
                    .padding(.horizontal, AppSpacing.md)
                    .padding(.top, AppSpacing.sm)
                    .padding(.bottom, AppSpacing.xl)
                }
                .scrollIndicators(.visible)
            }
            .navigationTitle(Text("camera.title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Color.black, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                if showsCloseButton {
                    ToolbarItem(placement: .topBarLeading) {
                        Button("camera.action.close") {
                            viewModel.stopCamera()
                            dismiss()
                        }
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
        VStack(spacing: AppSpacing.md) {
            cameraStatusBar
            previewSurface

            if isCaptureFilterPickerVisible {
                FilterPresetSelectorView(
                    presets: viewModel.filterPresets,
                    selectedPreset: viewModel.selectedFilterPreset,
                    isRendering: viewModel.isFiltering,
                    onSelectPreset: viewModel.selectFilterPreset
                )
                .padding(AppSpacing.md)
                .background(AppColors.elevatedSurface)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))

                Text("camera.filter.pending_note")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }

            cameraControls

            Text("camera.capture.helper")
                .font(AppTypography.caption)
                .foregroundStyle(.white.opacity(0.62))
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.md)
        .background(Color(red: 0.04, green: 0.04, blue: 0.035))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
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

            VStack {
                Spacer()

                HStack {
                    Spacer()

                    Button {
                        isCaptureFilterPickerVisible.toggle()
                    } label: {
                        filterEntryLabel
                    }
                    .buttonStyle(.plain)
                    .padding(AppSpacing.md)
                    .accessibilityLabel("camera.filter.entry")
                }
            }
        }
        .frame(maxWidth: .infinity)
        .aspectRatio(4 / 5, contentMode: .fit)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var cameraStatusBar: some View {
        HStack(spacing: AppSpacing.sm) {
            Label("camera.shell.status", systemImage: "camera.aperture")
                .font(AppTypography.caption)
                .foregroundStyle(.white.opacity(0.82))
                .lineLimit(1)

            Spacer()

            Text(LocalizedStringKey(viewModel.selectedFilterPreset.nameKey))
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.accent)
                .lineLimit(1)
        }
    }

    private var cameraControls: some View {
        HStack(spacing: AppSpacing.sm) {
            cameraIconButton(
                systemImage: isFlashEnabled ? "bolt.fill" : "bolt.slash",
                label: "camera.control.flash"
            ) {
                isFlashEnabled.toggle()
            }

            cameraIconButton(
                systemImage: isTimerEnabled ? "timer.circle.fill" : "timer",
                label: "camera.control.timer"
            ) {
                isTimerEnabled.toggle()
            }

            Spacer(minLength: AppSpacing.xs)

            captureButton

            Spacer(minLength: AppSpacing.xs)

            cameraIconButton(
                systemImage: "arrow.triangle.2.circlepath.camera",
                label: "camera.control.flip"
            ) {
                isUsingFrontCameraMock.toggle()
            }

            photoImportButton
        }
        .padding(.vertical, AppSpacing.sm)
    }

    private var captureButton: some View {
        Button {
            switch viewModel.permissionState {
            case .authorized:
                viewModel.capturePhoto()
            case .notDetermined:
                Task { await viewModel.requestCameraAccess() }
            case .denied, .restricted, .unavailable:
                break
            }
        } label: {
            ZStack {
                Circle()
                    .stroke(.white.opacity(0.92), lineWidth: 4)
                    .frame(width: 70, height: 70)

                Circle()
                    .fill(viewModel.permissionState == .authorized ? .white : AppColors.accent)
                    .frame(width: 54, height: 54)

                if viewModel.isLoading {
                    ProgressView()
                        .tint(.black)
                }
            }
        }
        .disabled(viewModel.isLoading || viewModel.permissionState == .denied || viewModel.permissionState == .restricted || viewModel.permissionState == .unavailable)
        .accessibilityLabel("camera.action.capture")
    }

    private var photoImportButton: some View {
        PhotosPicker(
            selection: $viewModel.pickerItem,
            matching: .images,
            photoLibrary: .shared()
        ) {
            cameraIconLabel(systemImage: "photo.on.rectangle", label: "camera.action.import")
        }
        .disabled(viewModel.isLoading)
        .accessibilityLabel("camera.action.import")
    }

    private func cameraIconButton(
        systemImage: String,
        label: LocalizedStringKey,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            cameraIconLabel(systemImage: systemImage, label: label)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private func cameraIconLabel(systemImage: String, label: LocalizedStringKey) -> some View {
        VStack(spacing: AppSpacing.xs) {
            Image(systemName: systemImage)
                .font(.system(size: 20, weight: .semibold))
                .frame(width: 40, height: 40)
                .background(Color.white.opacity(0.12))
                .foregroundStyle(.white)
                .clipShape(Circle())

            Text(label)
                .font(.caption2)
                .foregroundStyle(.white.opacity(0.68))
                .lineLimit(1)
                .minimumScaleFactor(0.75)
        }
        .frame(width: 48)
    }

    private var filterEntryLabel: some View {
        HStack(spacing: AppSpacing.xs) {
            Image(systemName: "camera.filters")
                .font(.system(size: 15, weight: .semibold))

            Text(LocalizedStringKey(viewModel.selectedFilterPreset.nameKey))
                .font(AppTypography.caption)
                .lineLimit(1)
        }
        .padding(.vertical, AppSpacing.sm)
        .padding(.horizontal, AppSpacing.md)
        .background(.ultraThinMaterial)
        .foregroundStyle(AppColors.textPrimary)
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(AppColors.accent.opacity(0.7), lineWidth: 1)
        }
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
                .fixedSize(horizontal: false, vertical: true)
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
                        guard viewModel.selectedPhoto?.id == photo.id else { return }
                        sessionHistoryStore.recordMockSave(
                            photo: photo,
                            previewImage: viewModel.filteredPreviewImage ?? photo.image,
                            filterPreset: viewModel.selectedFilterPreset,
                            saveState: viewModel.photoSaveState
                        )
                    }
                },
                onAnalysisCompleted: { result in
                    guard viewModel.selectedPhoto?.id == photo.id else { return }
                    sessionHistoryStore.recordMockAnalysis(
                        photo: photo,
                        previewImage: viewModel.filteredPreviewImage ?? photo.image,
                        filterPreset: viewModel.selectedFilterPreset,
                        result: result
                    )
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

                Text("camera.continue.disabled_note")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    @ViewBuilder
    private var statusMessages: some View {
        if let errorMessage = viewModel.errorMessage {
            Text(errorMessage)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.error)
                .frame(maxWidth: .infinity, alignment: .leading)
                .fixedSize(horizontal: false, vertical: true)
        }

        if let filterErrorMessage = viewModel.filterErrorMessage {
            Text(filterErrorMessage)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.error)
                .frame(maxWidth: .infinity, alignment: .leading)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var localOnlyNote: some View {
        Text("camera.local_only_note")
            .font(AppTypography.caption)
            .foregroundStyle(AppColors.textSecondary)
            .fixedSize(horizontal: false, vertical: true)
            .padding(AppSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AppColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }
}

#Preview {
    CameraView()
        .environmentObject(SessionHistoryStore())
}
