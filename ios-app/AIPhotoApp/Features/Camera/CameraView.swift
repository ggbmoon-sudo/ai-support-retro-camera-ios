import PhotosUI
import SwiftUI

enum CameraAppDestination {
    case inspiration
    case history
    case settings
}

private enum CameraCallout {
    case none
    case guidance
    case aiSnapshot
    case filter
    case lens
    case pose
}

struct CameraView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var sessionHistoryStore: SessionHistoryStore
    let showsCloseButton: Bool
    let navigateToAppDestination: ((CameraAppDestination) -> Void)?
    @StateObject private var viewModel: CameraViewModel
    @StateObject private var poseOverlayState = CameraPoseOverlayState()
    @State private var isCaptureFilterPickerVisible = false
    @State private var isFlashEnabled = false
    @State private var selectedTimerOption: CameraTimerOption = .off
    @State private var isTimerDialogPresented = false
    @State private var timerCountdown: Int?
    @State private var captureCountdownTask: Task<Void, Never>?
    @State private var isUsingFrontCameraMock = false
    @State private var isScreenFlashVisible = false
    @State private var isLiveGuidanceExpanded = false
    @State private var isCloudSnapshotSheetPresented = false
    @State private var activeCameraCallout: CameraCallout = .none

    init(
        showsCloseButton: Bool = true,
        initialPhoto: CapturedPhoto? = nil,
        navigateToAppDestination: ((CameraAppDestination) -> Void)? = nil
    ) {
        self.showsCloseButton = showsCloseButton
        self.navigateToAppDestination = navigateToAppDestination
        _viewModel = StateObject(
            wrappedValue: CameraViewModel(
                service: CameraCaptureService(),
                photoSaveService: MockPhotoSaveService(),
                failingPhotoSaveService: MockPhotoSaveService(mode: .failure),
                initialSelectedPhoto: initialPhoto
            )
        )
    }

    var body: some View {
        Group {
            if viewModel.selectedPhoto != nil || showsCloseButton {
                NavigationStack {
                    cameraRootContent
                        .safeAreaInset(edge: .top, spacing: 0) {
                            if viewModel.selectedPhoto != nil {
                                selectedPhotoActionBar
                                    .padding(.horizontal, AppSpacing.md)
                                    .padding(.top, AppSpacing.xs)
                                    .padding(.bottom, AppSpacing.sm)
                                    .background(Color.black.opacity(0.92))
                            }
                        }
                        .navigationTitle("")
                        .navigationBarTitleDisplayMode(.inline)
                        .toolbar(showsCloseButton ? Visibility.visible : Visibility.hidden, for: .navigationBar)
                        .toolbar(viewModel.selectedPhoto == nil ? .hidden : .visible, for: .tabBar)
                        .toolbarBackground(Color.black, for: .navigationBar)
                        .toolbarColorScheme(.dark, for: .navigationBar)
                        .toolbar {
                            if showsCloseButton {
                                ToolbarItem(placement: .topBarLeading) {
                                    Button("camera.action.close") {
                                        captureCountdownTask?.cancel()
                                        timerCountdown = nil
                                        viewModel.stopCamera()
                                        dismiss()
                                    }
                                }
                            }
                        }
                }
            } else {
                cameraRootContent
                    .ignoresSafeArea()
            }
        }
        .sheet(isPresented: $isCaptureFilterPickerVisible, onDismiss: {
                if activeCameraCallout == .filter {
                    activeCameraCallout = .none
                }
        }) {
            filterPickerSheet
        }
        .sheet(isPresented: $isCloudSnapshotSheetPresented, onDismiss: {
                if activeCameraCallout == .aiSnapshot {
                    activeCameraCallout = .none
                }
        }) {
            cloudSnapshotGuidanceSheet
        }
        .confirmationDialog(
            Text("camera.timer.dialog.title"),
            isPresented: $isTimerDialogPresented,
            titleVisibility: .visible
        ) {
            ForEach(CameraTimerOption.allCases) { option in
                Button(LocalizedStringKey(option.titleKey)) {
                    selectedTimerOption = option
                }
            }
        } message: {
            Text("camera.timer.dialog.message")
        }
        .task {
            await viewModel.prepareCamera()
        }
        .onDisappear {
            captureCountdownTask?.cancel()
            timerCountdown = nil
            viewModel.stopCamera()
        }
        .onChange(of: viewModel.pickerItem) { _, _ in
            Task {
                await viewModel.importSelectedPhoto()
            }
        }
    }

    private var cameraRootContent: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            if viewModel.selectedPhoto != nil {
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
            } else {
                content
            }

            if isScreenFlashVisible {
                Color.white
                    .ignoresSafeArea()
                    .transition(.opacity)
                    .allowsHitTesting(false)
                    .zIndex(10)
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
        GeometryReader { proxy in
            let safeTop = proxy.safeAreaInsets.top
            let safeBottom = proxy.safeAreaInsets.bottom
            let topControlInset = AppTabBarMetrics.cameraTopControlPadding(for: safeTop)
            let railBottomInset = AppTabBarMetrics.cameraRailBottomPadding(for: safeBottom)
            let controlBottomInset = AppTabBarMetrics.cameraControlBottomPadding(for: safeBottom)
            let filterBottomInset = AppTabBarMetrics.cameraFilterBottomPadding(for: safeBottom)
            let guidanceBottomInset = AppTabBarMetrics.cameraGuidanceBottomPadding(for: safeBottom)

            ZStack {
                cameraFullscreenCanvas

                cameraChromeGradient
                    .allowsHitTesting(false)

                poseOverlayLayer(
                    viewSize: proxy.size,
                    topInset: topControlInset,
                    bottomInset: controlBottomInset
                )
                .zIndex(1)

                VStack(spacing: 0) {
                    nativeCameraTopBar
                        .padding(.horizontal, AppSpacing.md)
                        .padding(.top, topControlInset)

                    cameraStatusMessagesOverlay
                        .padding(.horizontal, AppSpacing.md)
                        .padding(.top, AppSpacing.xs)

                    Spacer()
                }
                .zIndex(2)

                VStack(spacing: 0) {
                    if let activePose = poseOverlayState.activePoseGuide,
                       activeCameraCallout != .pose {
                        HStack {
                            Spacer()

                            poseOverlayBadge(for: activePose)
                        }
                        .padding(.horizontal, AppSpacing.md)
                        .padding(.top, topControlInset + 48)
                    }

                    Spacer()
                }
                .zIndex(4)

                VStack(spacing: 0) {
                    Spacer()

                    HStack {
                        Spacer()

                        nativeLiveGuidanceOverlay
                    }
                        .padding(.horizontal, AppSpacing.md)
                        .padding(.bottom, guidanceBottomInset)
                }
                .zIndex(3)

                VStack(spacing: 0) {
                    Spacer()

                    HStack {
                        VStack(alignment: .leading, spacing: AppSpacing.xs) {
                            poseViewportButton
                            filterViewportButton
                        }

                        Spacer()
                    }
                    .padding(.horizontal, AppSpacing.md)
                    .padding(.bottom, filterBottomInset)
                }
                .zIndex(4)

                VStack(spacing: 0) {
                    if activeCameraCallout == .pose {
                        posePickerCallout
                            .padding(.horizontal, AppSpacing.md)
                            .padding(.top, topControlInset + 48)
                            .transition(.opacity.combined(with: .move(edge: .top)))
                    }

                    Spacer()
                }
                .padding(.bottom, controlBottomInset + 104)
                .zIndex(7)

                VStack(spacing: 0) {
                    Spacer()

                    nativeBottomControls
                        .padding(.horizontal, AppSpacing.md)
                        .padding(.bottom, controlBottomInset)
                }
                .zIndex(5)

                VStack(spacing: 0) {
                    Spacer()

                    cameraModeRail
                        .padding(.bottom, railBottomInset)
                }
                .zIndex(6)
            }
            .frame(width: proxy.size.width, height: proxy.size.height)
            .background(Color.black)
            .ignoresSafeArea()
        }
    }

    private var cameraFullscreenCanvas: some View {
        ZStack {
            Color.black

            switch viewModel.permissionState {
            case .authorized:
                CameraPreviewView(session: viewModel.service.session)
                    .ignoresSafeArea()
                    .overlay {
                        ruleOfThirdsGrid
                    }
            case .notDetermined, .denied, .restricted, .unavailable:
                permissionMessage
                    .padding(AppSpacing.xl)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.black)
            }

            VStack {
                Spacer()

                LinearGradient(
                    colors: [.clear, .black.opacity(0.12), .black.opacity(0.54)],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 188)
                .allowsHitTesting(false)
            }
        }
    }

    private var cameraChromeGradient: some View {
        VStack {
            LinearGradient(
                colors: [.black.opacity(0.68), .black.opacity(0.22), .clear],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 116)

            Spacer()

            LinearGradient(
                colors: [.clear, .black.opacity(0.42), .black.opacity(0.9)],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 150)
        }
        .ignoresSafeArea()
    }

    private var nativeCameraTopBar: some View {
        HStack(spacing: AppSpacing.sm) {
            LiveGuidanceToggleView(
                isEnabled: viewModel.liveGuidanceState != .off,
                toggle: {
                    activeCameraCallout = .none
                    isLiveGuidanceExpanded = false
                    viewModel.toggleLiveGuidance()
                }
            )

            LiveGuidanceModeSelectorView(
                mode: viewModel.liveGuidanceMode,
                toggle: {
                    activeCameraCallout = .none
                    isLiveGuidanceExpanded = false
                    viewModel.toggleLiveGuidanceMode()
                }
            )

            Spacer(minLength: AppSpacing.xs)

            nativeIconButton(
                systemImage: isFlashEnabled ? "bolt.fill" : "bolt.slash",
                label: "camera.control.flash",
                valueKey: nil,
                isActive: isFlashEnabled
            ) {
                activeCameraCallout = .none
                isLiveGuidanceExpanded = false
                isFlashEnabled.toggle()
            }

            timerTopButton
        }
    }

    private var cameraNavigationMenu: some View {
        Menu {
            Button("tab.home") {
                navigateToAppDestination?(.inspiration)
            }

            Button("tab.history") {
                navigateToAppDestination?(.history)
            }

            Button("tab.settings") {
                navigateToAppDestination?(.settings)
            }
        } label: {
            Image(systemName: "ellipsis")
                .font(.system(size: 16, weight: .bold))
                .frame(width: 34, height: 34)
                .background(Color.black.opacity(0.46))
                .foregroundStyle(.white)
                .clipShape(Circle())
                .overlay {
                    Circle()
                        .stroke(.white.opacity(0.16), lineWidth: 1)
                }
        }
        .accessibilityLabel("camera.navigation.menu")
    }

    @ViewBuilder
    private var cameraStatusMessagesOverlay: some View {
        if viewModel.errorMessage != nil || viewModel.filterErrorMessage != nil {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                statusMessages
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(Color.black.opacity(0.58))
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.sm))
        }
    }

    @ViewBuilder
    private var nativeLiveGuidanceOverlay: some View {
        if viewModel.liveGuidanceState != .off {
            if activeCameraCallout == .guidance {
                VStack(alignment: .trailing, spacing: AppSpacing.xs) {
                    LiveGuidanceOverlayView(
                        state: viewModel.liveGuidanceState,
                        stateTitleKey: viewModel.liveGuidanceStateTitleKey,
                        suggestions: viewModel.liveGuidanceSuggestions,
                        advanceState: viewModel.advanceLiveGuidanceMockState
                    )
                    .frame(width: 244, alignment: .trailing)

                    Button {
                        withAnimation(.snappy(duration: 0.18)) {
                            activeCameraCallout = .none
                            isLiveGuidanceExpanded = false
                        }
                    } label: {
                        Image(systemName: "chevron.down")
                            .font(.system(size: 11, weight: .bold))
                            .frame(width: 32, height: 24)
                            .background(Color.black.opacity(0.5))
                            .foregroundStyle(.white.opacity(0.86))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("camera.guidance.compact.accessibility")
                }
                .transition(.opacity.combined(with: .move(edge: .bottom)))
            } else {
                guidanceCompactPill
            }
        }
    }

    private var guidanceCompactPill: some View {
        Button {
            withAnimation(.snappy(duration: 0.18)) {
                activeCameraCallout = .guidance
                isLiveGuidanceExpanded = true
            }
        } label: {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: "sparkles")
                    .font(.system(size: 12, weight: .bold))

                Text(LocalizedStringKey(viewModel.liveGuidanceStateTitleKey))
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)

                if let firstSuggestion = viewModel.liveGuidanceSuggestions.first {
                    Text(LocalizedStringKey(firstSuggestion.messageKey))
                        .font(.caption2)
                        .foregroundStyle(.white.opacity(0.78))
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                }

                Image(systemName: "chevron.up")
                    .font(.system(size: 10, weight: .bold))
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .frame(maxWidth: 260, alignment: .leading)
            .foregroundStyle(.white)
            .background(.black.opacity(0.52))
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(.white.opacity(0.18), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.guidance.compact.accessibility")
    }

    @ViewBuilder
    private func poseOverlayLayer(viewSize: CGSize, topInset: CGFloat, bottomInset: CGFloat) -> some View {
        if let activePose = poseOverlayState.activePoseGuide {
            let viewfinderTop = max(topInset + 58, 96)
            let viewfinderBottom = max(bottomInset + 132, 168)
            let viewfinderHeight = max(260, viewSize.height - viewfinderTop - viewfinderBottom)

            PoseOverlayView(
                guide: activePose,
                isMirrored: poseOverlayState.isPoseMirrored,
                opacity: poseOverlayState.poseOverlayOpacity
            )
            .frame(width: viewSize.width, height: viewfinderHeight)
            .position(x: viewSize.width / 2, y: viewfinderTop + viewfinderHeight / 2)
            .allowsHitTesting(false)
            .accessibilityHidden(true)
        }
    }

    private var posePickerCallout: some View {
        PoseSelectorView(
            guides: PoseGuideCatalog.all,
            selectedGuide: poseOverlayState.selectedPoseGuide,
            onSelect: { guide in
                withAnimation(.snappy(duration: 0.18)) {
                    poseOverlayState.selectPoseGuide(guide)
                    activeCameraCallout = .none
                    isLiveGuidanceExpanded = false
                }
            },
            onClose: {
                withAnimation(.snappy(duration: 0.18)) {
                    activeCameraCallout = .none
                }
            }
        )
        .frame(maxWidth: 356)
    }

    private var poseViewportButton: some View {
        PoseGuideButton(isActive: poseOverlayState.activePoseGuide != nil || activeCameraCallout == .pose) {
            withAnimation(.snappy(duration: 0.18)) {
                activeCameraCallout = activeCameraCallout == .pose ? .none : .pose
                isLiveGuidanceExpanded = false
            }
        }
    }

    private func poseOverlayBadge(for guide: PoseGuide) -> some View {
        HStack(spacing: AppSpacing.xs) {
            Label {
                Text(LocalizedStringKey(guide.titleKey))
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
            } icon: {
                Image(systemName: "figure.stand")
                    .font(.system(size: 11, weight: .bold))
            }

            Button {
                withAnimation(.snappy(duration: 0.16)) {
                    poseOverlayState.mirrorPoseOverlay()
                }
            } label: {
                Image(systemName: "arrow.left.and.right")
                    .font(.system(size: 11, weight: .bold))
                    .frame(width: 26, height: 24)
                    .background(Color.white.opacity(0.1))
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.pose.action.mirror")

            Button {
                withAnimation(.snappy(duration: 0.16)) {
                    poseOverlayState.closePoseOverlay()
                    if activeCameraCallout == .pose {
                        activeCameraCallout = .none
                    }
                }
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 10, weight: .bold))
                    .frame(width: 26, height: 24)
                    .background(Color.white.opacity(0.1))
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.pose.action.close")
        }
        .padding(.vertical, AppSpacing.xs)
        .padding(.horizontal, AppSpacing.sm)
        .background(Color.black.opacity(0.56))
        .foregroundStyle(.white)
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.18), lineWidth: 1)
        }
    }

    private var filterViewportButton: some View {
        Button {
            activeCameraCallout = .filter
            isLiveGuidanceExpanded = false
            isCaptureFilterPickerVisible = true
        } label: {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: "camera.filters")
                    .font(.system(size: 13, weight: .bold))

                Text(LocalizedStringKey(viewModel.selectedFilterPreset.nameKey))
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(Color.black.opacity(0.48))
            .foregroundStyle(.white)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(.white.opacity(0.2), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.filter.entry")
    }

    private var nativeBottomControls: some View {
        ZStack {
            if activeCameraCallout == .lens {
                lensDropdownCallout
                    .frame(maxWidth: 324, alignment: .trailing)
                    .offset(x: -2, y: -66)
                    .zIndex(30)
            }

            HStack(spacing: AppSpacing.xs) {
                aiSnapshotNativeButton

                Spacer(minLength: AppSpacing.xs)

                HStack(spacing: AppSpacing.xs) {
                    flipCameraButton
                    compactLensMenu
                }
            }
            .frame(maxWidth: 352)

            captureButton
                .frame(width: 88, height: 88)
                .contentShape(Circle())
                .zIndex(20)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 82)
    }

    @ViewBuilder
    private var cameraModeRail: some View {
        if navigateToAppDestination != nil {
            HStack(spacing: AppSpacing.xs) {
                cameraModeRailItem(
                    titleKey: "camera.title",
                    systemImage: "camera.viewfinder",
                    isSelected: true
                ) {}

                cameraModeRailItem(
                    titleKey: "tab.home",
                    systemImage: "sparkles",
                    isSelected: false
                ) {
                    navigateToAppDestination?(.inspiration)
                }

                cameraModeRailItem(
                    titleKey: "tab.history",
                    systemImage: "photo.stack",
                    isSelected: false
                ) {
                    navigateToAppDestination?(.history)
                }

                cameraModeRailItem(
                    titleKey: "tab.settings",
                    systemImage: "gearshape",
                    isSelected: false
                ) {
                    navigateToAppDestination?(.settings)
                }
            }
            .padding(4)
            .background(Color.black.opacity(0.42))
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
            }
            .shadow(color: .black.opacity(0.26), radius: 12, x: 0, y: 6)
        }
    }

    private func cameraModeRailItem(
        titleKey: LocalizedStringKey,
        systemImage: String,
        isSelected: Bool,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Image(systemName: systemImage)
                    .font(.system(size: 12, weight: .bold))

                Text(titleKey)
                    .font(.system(size: 12, weight: .semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.68)
            }
            .padding(.vertical, 5)
            .padding(.horizontal, AppSpacing.sm)
            .foregroundStyle(isSelected ? AppColors.accent : .white.opacity(0.78))
            .background(isSelected ? AppColors.accent.opacity(0.14) : Color.clear)
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(titleKey)
    }

    private var aiSnapshotNativeButton: some View {
        Button {
            activeCameraCallout = .aiSnapshot
            isLiveGuidanceExpanded = false
            if case .idle = viewModel.cloudSnapshotGuidanceState {
                viewModel.requestCloudSnapshotGuidanceConsent()
            }
            isCloudSnapshotSheetPresented = true
        } label: {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: "wand.and.stars")
                    .font(.system(size: 15, weight: .bold))

                Text("camera.cloud_snapshot.short")
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
            }
            .padding(.vertical, AppSpacing.sm)
            .padding(.horizontal, AppSpacing.md)
            .background(Color.black.opacity(0.54))
            .foregroundStyle(AppColors.accent)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(AppColors.accent.opacity(0.34), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.cloud_snapshot.entry")
    }

    private var flipCameraButton: some View {
        nativeIconButton(
            systemImage: "arrow.triangle.2.circlepath.camera",
            label: "camera.control.flip",
            valueKey: nil,
            isActive: isUsingFrontCameraMock
        ) {
            activeCameraCallout = .none
            isLiveGuidanceExpanded = false
            isUsingFrontCameraMock.toggle()
        }
    }

    private var compactLensMenu: some View {
        Button {
            withAnimation(.snappy(duration: 0.16)) {
                activeCameraCallout = activeCameraCallout == .lens ? .none : .lens
                isLiveGuidanceExpanded = false
            }
        } label: {
            HStack(spacing: 3) {
                Text(viewModel.selectedLensOption.focalLengthLabel)
                    .font(.caption.weight(.bold))
                    .lineLimit(1)

                Image(systemName: "chevron.down")
                    .font(.system(size: 8, weight: .bold))
            }
            .padding(.vertical, AppSpacing.sm)
            .padding(.horizontal, AppSpacing.md)
            .background(Color.black.opacity(0.54))
            .foregroundStyle(.white)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(Color.white.opacity(0.18), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(LocalizedStringKey(viewModel.selectedLensOption.accessibilityKey))
    }

    private var lensDropdownCallout: some View {
        HStack(spacing: AppSpacing.xs) {
            ForEach(viewModel.lensOptions) { option in
                Button {
                    viewModel.selectLensOption(option)
                    withAnimation(.snappy(duration: 0.16)) {
                        activeCameraCallout = .none
                    }
                } label: {
                    VStack(spacing: 1) {
                        Text(option.focalLengthLabel)
                            .font(.caption2.weight(.bold))
                            .lineLimit(1)

                        Text(option.zoomLabel)
                            .font(.caption2.weight(.medium))
                            .lineLimit(1)
                    }
                    .frame(minWidth: 46)
                    .padding(.vertical, 5)
                    .padding(.horizontal, AppSpacing.xs)
                    .background(option == viewModel.selectedLensOption ? AppColors.accent.opacity(0.26) : Color.white.opacity(0.08))
                    .foregroundStyle(option == viewModel.selectedLensOption ? AppColors.accent : .white.opacity(0.84))
                    .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .accessibilityLabel(LocalizedStringKey(option.accessibilityKey))
            }
        }
        .padding(5)
        .background(Color.black.opacity(0.58))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.16), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.24), radius: 10, x: 0, y: 5)
    }

    private var timerTopButton: some View {
        Button {
            activeCameraCallout = .none
            isLiveGuidanceExpanded = false
            isTimerDialogPresented = true
        } label: {
            ZStack {
                Circle()
                    .fill(selectedTimerOption == .off ? Color.black.opacity(0.46) : AppColors.accent.opacity(0.28))
                    .frame(width: 38, height: 38)

                if let badgeText = selectedTimerOption.badgeText {
                    Text(badgeText)
                        .font(.caption2.weight(.black))
                        .foregroundStyle(AppColors.accent)
                        .minimumScaleFactor(0.7)
                } else {
                    Image(systemName: "timer")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(.white)
                }
            }
            .overlay {
                Circle()
                    .stroke(
                        selectedTimerOption == .off ? .white.opacity(0.16) : AppColors.accent.opacity(0.44),
                        lineWidth: 1
                    )
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.control.timer")
    }

    private func nativeIconButton(
        systemImage: String,
        label: LocalizedStringKey,
        valueKey: String?,
        isActive: Bool,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            VStack(spacing: AppSpacing.xs) {
                Image(systemName: systemImage)
                    .font(.system(size: 18, weight: .semibold))
                    .frame(width: 38, height: 38)
                    .background(isActive ? AppColors.accent.opacity(0.28) : Color.black.opacity(0.46))
                    .foregroundStyle(isActive ? AppColors.accent : .white)
                    .clipShape(Circle())
                    .overlay {
                        Circle()
                            .stroke(isActive ? AppColors.accent.opacity(0.44) : .white.opacity(0.16), lineWidth: 1)
                    }

                if let valueKey {
                    Text(LocalizedStringKey(valueKey))
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(.white.opacity(0.78))
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                }
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private var previewSurface: some View {
        ZStack {
            RoundedRectangle(cornerRadius: AppCornerRadius.md)
                .fill(Color.black)

            switch viewModel.permissionState {
            case .authorized:
                CameraPreviewView(session: viewModel.service.session)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
                    .overlay {
                        ruleOfThirdsGrid
                    }
            case .notDetermined, .denied, .restricted, .unavailable:
                permissionMessage
                    .padding(AppSpacing.xl)
            }

            VStack {
                HStack {
                    focalBadge

                    Spacer()
                }

                Spacer()
            }
            .padding(AppSpacing.sm)
        }
        .aspectRatio(4 / 5, contentMode: .fit)
        .frame(maxWidth: 330)
        .padding(8)
        .background(Color(red: 0.012, green: 0.012, blue: 0.011))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.lg)
                .stroke(Color.white.opacity(0.18), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.28), radius: 16, x: 0, y: 8)
    }

    private var cameraStatusBar: some View {
        HStack(spacing: AppSpacing.sm) {
            Label(viewModel.selectedLensOption.focalLengthLabel, systemImage: "camera.aperture")
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.white.opacity(0.76))
                .padding(.vertical, AppSpacing.xs)
                .padding(.horizontal, AppSpacing.sm)
                .background(Color.white.opacity(0.08))
                .clipShape(Capsule())

            Spacer()

            Text(LocalizedStringKey(viewModel.selectedFilterPreset.nameKey))
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.white.opacity(0.72))
                .lineLimit(1)
                .minimumScaleFactor(0.7)

            LiveGuidanceToggleView(
                isEnabled: viewModel.liveGuidanceState != .off,
                toggle: viewModel.toggleLiveGuidance
            )

            LiveGuidanceModeSelectorView(
                mode: viewModel.liveGuidanceMode,
                toggle: viewModel.toggleLiveGuidanceMode
            )
        }
    }

    private var lensAndFilterControls: some View {
        HStack(spacing: AppSpacing.sm) {
            CameraLensSelectorView(
                options: viewModel.lensOptions,
                selectedOption: viewModel.selectedLensOption,
                onSelect: viewModel.selectLensOption
            )

            Spacer(minLength: AppSpacing.xs)

            Button {
                isCaptureFilterPickerVisible.toggle()
            } label: {
                filterEntryLabel
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.filter.entry")
        }
    }

    @ViewBuilder
    private var liveGuidancePanel: some View {
        if viewModel.liveGuidanceState != .off {
            VStack(spacing: AppSpacing.xs) {
                Button {
                    withAnimation(.snappy(duration: 0.18)) {
                        isLiveGuidanceExpanded.toggle()
                    }
                } label: {
                    HStack(spacing: AppSpacing.xs) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 12, weight: .bold))

                        Text(LocalizedStringKey(viewModel.liveGuidanceStateTitleKey))
                            .font(.caption2.weight(.semibold))
                            .lineLimit(1)

                        if let firstSuggestion = viewModel.liveGuidanceSuggestions.first {
                            Text(LocalizedStringKey(firstSuggestion.messageKey))
                                .font(.caption2)
                                .foregroundStyle(.white.opacity(0.7))
                                .lineLimit(1)
                                .minimumScaleFactor(0.76)
                        }

                        Spacer(minLength: AppSpacing.xs)

                        Image(systemName: isLiveGuidanceExpanded ? "chevron.down" : "chevron.up")
                            .font(.system(size: 10, weight: .bold))
                    }
                    .padding(.vertical, AppSpacing.xs)
                    .padding(.horizontal, AppSpacing.sm)
                    .foregroundStyle(.white)
                    .background(Color.black.opacity(0.48))
                    .clipShape(Capsule())
                    .overlay {
                        Capsule()
                            .stroke(.white.opacity(0.18), lineWidth: 1)
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel("camera.guidance.compact.accessibility")

                if isLiveGuidanceExpanded {
                    LiveGuidanceOverlayView(
                        state: viewModel.liveGuidanceState,
                        stateTitleKey: viewModel.liveGuidanceStateTitleKey,
                        suggestions: viewModel.liveGuidanceSuggestions,
                        advanceState: viewModel.advanceLiveGuidanceMockState
                    )
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .transition(.opacity.combined(with: .move(edge: .top)))
                }
            }
        }
    }

    private var cloudSnapshotGuidancePanel: some View {
        Button {
            if case .idle = viewModel.cloudSnapshotGuidanceState {
                viewModel.requestCloudSnapshotGuidanceConsent()
            }
            isCloudSnapshotSheetPresented = true
        } label: {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: "wand.and.stars")
                    .font(.system(size: 12, weight: .bold))

                Text("camera.cloud_snapshot.title")
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)

                Text(LocalizedStringKey(viewModel.cloudSnapshotGuidanceState.titleKey))
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.68))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)

                Spacer(minLength: AppSpacing.xs)

                Text("camera.cloud_snapshot.badge.mock")
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(AppColors.accent)
                    .lineLimit(1)
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .foregroundStyle(.white)
            .background(Color.black.opacity(0.48))
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(AppColors.accent.opacity(0.32), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.cloud_snapshot.entry")
        .accessibilityElement(children: .contain)
    }

    private var cameraAssistControls: some View {
        VStack(spacing: AppSpacing.xs) {
            liveGuidancePanel
            cloudSnapshotGuidancePanel
        }
    }

    private var focalBadge: some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(viewModel.selectedLensOption.focalLengthLabel)
                .font(.caption.weight(.bold))
                .lineLimit(1)

            Text(viewModel.selectedLensOption.zoomLabel)
                .font(.caption2.weight(.medium))
                .lineLimit(1)
        }
        .padding(.vertical, AppSpacing.xs)
        .padding(.horizontal, AppSpacing.sm)
        .background(Color.black.opacity(0.48))
        .foregroundStyle(.white)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.sm))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.sm)
                .stroke(Color.white.opacity(0.18), lineWidth: 1)
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
                systemImage: selectedTimerOption.systemImage,
                label: "camera.control.timer",
                valueKey: selectedTimerOption.shortLabelKey
            ) {
                isTimerDialogPresented = true
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
        }
        .padding(.vertical, AppSpacing.xs)
    }

    private var captureButton: some View {
        Button {
            switch viewModel.permissionState {
            case .authorized:
                scheduleCapture()
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
                } else if let timerCountdown {
                    Text("\(timerCountdown)")
                        .font(.title3.weight(.bold))
                        .foregroundStyle(.black)
                }
            }
        }
        .disabled(
            viewModel.isLoading
                || timerCountdown != nil
                || viewModel.permissionState == .denied
                || viewModel.permissionState == .restricted
                || viewModel.permissionState == .unavailable
        )
        .accessibilityLabel("camera.action.capture")
    }

    private func cameraIconButton(
        systemImage: String,
        label: LocalizedStringKey,
        valueKey: String? = nil,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            cameraIconLabel(systemImage: systemImage, label: label, valueKey: valueKey)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private func cameraIconLabel(systemImage: String, label: LocalizedStringKey, valueKey: String? = nil) -> some View {
        VStack(spacing: AppSpacing.xs) {
            Image(systemName: systemImage)
                .font(.system(size: 20, weight: .semibold))
                .frame(width: 40, height: 40)
                .background(Color.white.opacity(0.12))
                .foregroundStyle(.white)
                .clipShape(Circle())

            if let valueKey {
                Text(LocalizedStringKey(valueKey))
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.68))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            } else {
                Text(label)
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.68))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
        }
        .frame(width: 48)
    }

    private var filterEntryLabel: some View {
        HStack(spacing: AppSpacing.xs) {
            Image(systemName: "camera.filters")
                .font(.system(size: 15, weight: .semibold))

            Text("camera.filter.entry")
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
                PrimaryButton("camera.action.back_to_camera", systemImage: "camera.viewfinder") {
                    viewModel.clearSelectedPhoto()
                }

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

    private var selectedPhotoActionBar: some View {
        HStack(spacing: AppSpacing.sm) {
            Button {
                viewModel.clearSelectedPhoto()
            } label: {
                Label("camera.action.back_to_camera", systemImage: "camera.viewfinder")
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .padding(.horizontal, AppSpacing.sm)
                    .background(Color.white.opacity(0.12))
                    .foregroundStyle(.white)
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.action.back_to_camera_preview")

            Button {
                viewModel.clearSelectedPhoto()
            } label: {
                Label("camera.action.clear", systemImage: "xmark")
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .padding(.horizontal, AppSpacing.sm)
                    .background(Color.white.opacity(0.08))
                    .foregroundStyle(.white.opacity(0.9))
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.action.clear_selected_photo")
        }
        .padding(AppSpacing.xs)
        .background(Color(red: 0.05, green: 0.05, blue: 0.045).opacity(0.96))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.14), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.22), radius: 10, x: 0, y: 5)
    }

    private var filterPickerSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    FilterPresetSelectorView(
                        presets: viewModel.filterPresets,
                        selectedPreset: viewModel.selectedFilterPreset,
                        isRendering: viewModel.isFiltering,
                        onSelectPreset: { preset in
                            viewModel.selectFilterPreset(preset)
                        }
                    )

                    Text("camera.filter.pending_note")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(AppSpacing.lg)
            }
            .background(AppColors.background)
            .navigationTitle("filters.selector.title")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("camera.action.close") {
                        isCaptureFilterPickerVisible = false
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    private var cloudSnapshotGuidanceSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    HStack(spacing: AppSpacing.xs) {
                        Label("camera.cloud_snapshot.title", systemImage: "wand.and.stars")
                            .font(AppTypography.bodyEmphasis)

                        Spacer()

                        Text("camera.cloud_snapshot.badge.mock")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(AppColors.accent)
                    }

                    Text("camera.cloud_snapshot.entry_note")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)

                    Group {
                        switch viewModel.cloudSnapshotGuidanceState {
                        case .idle:
                            Button {
                                viewModel.requestCloudSnapshotGuidanceConsent()
                            } label: {
                                Label("camera.cloud_snapshot.entry", systemImage: "sparkles")
                                    .font(AppTypography.bodyEmphasis)
                                    .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(.borderedProminent)
                            .tint(AppColors.accent)
                        case .consentRequired:
                            CloudSnapshotGuidanceConsentView(
                                startAnalysis: {
                                    Task {
                                        await viewModel.startMockCloudSnapshotGuidance()
                                    }
                                },
                                simulateFailure: {
                                    Task {
                                        await viewModel.startMockCloudSnapshotGuidance(outcome: .failure)
                                    }
                                },
                                simulateUnavailable: {
                                    Task {
                                        await viewModel.startMockCloudSnapshotGuidance(outcome: .unavailable)
                                    }
                                },
                                cancel: {
                                    viewModel.resetCloudSnapshotGuidance()
                                    isCloudSnapshotSheetPresented = false
                                }
                            )
                        case .preparingSnapshot, .analyzing, .result, .failed, .unavailable:
                            CloudSnapshotGuidanceResultView(
                                state: viewModel.cloudSnapshotGuidanceState,
                                retry: viewModel.requestCloudSnapshotGuidanceConsent,
                                dismiss: {
                                    viewModel.resetCloudSnapshotGuidance()
                                    isCloudSnapshotSheetPresented = false
                                }
                            )
                        }
                    }
                    .padding(AppSpacing.md)
                    .foregroundStyle(.white)
                    .background(Color.black.opacity(0.82))
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
                }
                .padding(AppSpacing.lg)
            }
            .background(AppColors.background)
            .navigationTitle("camera.cloud_snapshot.title")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("camera.action.close") {
                        isCloudSnapshotSheetPresented = false
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    private func scheduleCapture() {
        guard timerCountdown == nil else { return }

        if selectedTimerOption.seconds == 0 {
            performCaptureNow()
            return
        }

        captureCountdownTask?.cancel()
        captureCountdownTask = Task { @MainActor in
            for remaining in stride(from: selectedTimerOption.seconds, through: 1, by: -1) {
                timerCountdown = remaining
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                guard !Task.isCancelled else {
                    timerCountdown = nil
                    return
                }
            }

            timerCountdown = nil
            performCaptureNow()
        }
    }

    private func performCaptureNow() {
        triggerScreenFlashIfNeeded()
        viewModel.capturePhoto()
    }

    private func triggerScreenFlashIfNeeded() {
        guard isUsingFrontCameraMock, isFlashEnabled else { return }

        withAnimation(.easeOut(duration: 0.04)) {
            isScreenFlashVisible = true
        }

        Task { @MainActor in
            try? await Task.sleep(nanoseconds: 140_000_000)
            withAnimation(.easeOut(duration: 0.18)) {
                isScreenFlashVisible = false
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

private enum CameraTimerOption: Int, CaseIterable, Identifiable {
    case off = 0
    case three = 3
    case five = 5
    case ten = 10

    var id: Int { rawValue }

    var seconds: Int { rawValue }

    var titleKey: String {
        switch self {
        case .off:
            return "camera.timer.option.off"
        case .three:
            return "camera.timer.option.three"
        case .five:
            return "camera.timer.option.five"
        case .ten:
            return "camera.timer.option.ten"
        }
    }

    var shortLabelKey: String {
        switch self {
        case .off:
            return "camera.timer.short.off"
        case .three:
            return "camera.timer.short.three"
        case .five:
            return "camera.timer.short.five"
        case .ten:
            return "camera.timer.short.ten"
        }
    }

    var systemImage: String {
        self == .off ? "timer" : "timer.circle.fill"
    }

    var badgeText: String? {
        switch self {
        case .off:
            return nil
        case .three:
            return "3s"
        case .five:
            return "5s"
        case .ten:
            return "10s"
        }
    }
}
