import AVFoundation
import Combine
import PhotosUI
import SwiftUI
import UIKit

@MainActor
final class CameraViewModel: ObservableObject {
    @Published private(set) var permissionState: CameraPermissionState
    @Published private(set) var selectedPhoto: CapturedPhoto?
    @Published private(set) var selectedFilterPreset = FilterPresetCatalog.original
    @Published private(set) var filteredPreviewImage: UIImage?
    @Published private(set) var photoSaveState: PhotoSaveState = .idle
    @Published private(set) var errorMessage: String?
    @Published private(set) var filterErrorMessage: String?
    @Published private(set) var liveGuidanceState: LiveGuidanceMockState = .suggestionAvailable
    @Published private(set) var liveGuidanceMode: LiveGuidanceMode = .local
    @Published private(set) var liveGuidanceSuggestions: [LiveGuidanceSuggestion] = []
    @Published private(set) var cloudSnapshotGuidanceState: CloudSnapshotGuidanceState = .idle
    @Published private(set) var selectedLensOption = LensOption.classic35
    @Published private(set) var lensOptions = LensOption.all
    @Published private(set) var isUsingFrontCamera = false
    @Published private(set) var isHardwareFlashAvailable = false
    @Published private(set) var isFrontCameraCaptureMirroringEnabled = true
    @Published private(set) var isDualFocalZoomEnabled = false
    @Published private(set) var selectedDualFocalLengthMillimeters = CameraDualFocalZoomConfiguration.defaultFocalLength(
        forBaseFocalLength: LensOption.classic35.focalLengthMillimeters
    )
    @Published private(set) var selectedDualFocalAspectRatio = CameraFocalCropAspectRatio.fourByFive
    @Published private(set) var dualFocalFrameCenterXRatio: CGFloat = 0.5
    @Published private(set) var dualFocalFrameCenterYRatio: CGFloat = 0.43
    @Published private(set) var isLoading = false
    @Published private(set) var isFiltering = false
    @Published var pickerItem: PhotosPickerItem?

    let service: CameraCaptureService
    let filterPresets = FilterPresetCatalog.all

    private let filterPipeline = FilterPipeline()
    private let photoSaveService: any PhotoSaveService
    private let failingPhotoSaveService: any PhotoSaveService
    private let mockLiveGuidanceProvider: any LiveGuidanceProvider
    private let localLiveGuidanceProvider: any LiveGuidanceProvider
    private let cloudSnapshotGuidanceService: any CloudSnapshotGuidanceService
    private let liveGuidanceStabilityController = LiveGuidanceStabilityController()
    private let captureSignalMonitor = CameraCaptureDeviceSignalMonitor()
    private var activeFilterRenderID: UUID?
    private var activeCloudSnapshotGuidanceID: UUID?
    private var latestLocalFrameSignals: [LiveGuidanceSignal]?

    init(
        service: CameraCaptureService,
        photoSaveService: any PhotoSaveService,
        failingPhotoSaveService: any PhotoSaveService,
        liveGuidanceProvider: (any LiveGuidanceProvider)? = nil,
        localLiveGuidanceProvider: (any LiveGuidanceProvider)? = nil,
        cloudSnapshotGuidanceService: (any CloudSnapshotGuidanceService)? = nil,
        initialSelectedPhoto: CapturedPhoto? = nil
    ) {
        self.service = service
        self.photoSaveService = photoSaveService
        self.failingPhotoSaveService = failingPhotoSaveService
        self.mockLiveGuidanceProvider = liveGuidanceProvider ?? MockLiveGuidanceProvider()
        self.localLiveGuidanceProvider = localLiveGuidanceProvider ?? LocalRuleBasedGuidanceProvider()
        self.cloudSnapshotGuidanceService = cloudSnapshotGuidanceService ?? MockCloudSnapshotGuidanceService()
        self.selectedPhoto = initialSelectedPhoto
        self.permissionState = CameraPermissionState(
            authorizationStatus: AVCaptureDevice.authorizationStatus(for: .video)
        )
        self.service.setFrameSignalHandler { [weak self] signals in
            self?.updateLiveGuidanceFrameSignals(signals)
        }
        refreshCameraControlState()
        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions()
    }

    var liveGuidanceStateTitleKey: String {
        guard liveGuidanceMode == .local,
              liveGuidanceState != .off,
              liveGuidanceState != .paused else {
            return liveGuidanceState.titleKey(for: liveGuidanceMode)
        }

        return GuidanceCopyResolver().chipTitleKey(
            language: CameraCoachToneSettingsStore.shared.runtimeLanguageMode,
            requestedTone: CameraCoachToneSettingsStore.shared.runtimeToneMode
        )
    }

    var legacyLiveGuidanceStateTitleKey: String {
        liveGuidanceState.titleKey(for: liveGuidanceMode)
    }

    var dualFocalZoomConfiguration: CameraDualFocalZoomConfiguration {
        CameraDualFocalZoomConfiguration(
            focalLengthMillimeters: selectedDualFocalLengthMillimeters,
            aspectRatio: selectedDualFocalAspectRatio,
            framingBoxCenterXRatio: dualFocalFrameCenterXRatio,
            framingBoxCenterYRatio: dualFocalFrameCenterYRatio
        )
    }

    var dualFocalZoomRange: ClosedRange<Double> {
        CameraDualFocalZoomConfiguration.focalLengthRange(
            forBaseFocalLength: selectedLensOption.focalLengthMillimeters
        )
    }

    var selectedDualFocalLengthLabel: String {
        CameraDualFocalZoomConfiguration.focalLengthLabel(for: selectedDualFocalLengthMillimeters)
    }

    var dualFocalMinimumLengthLabel: String {
        CameraDualFocalZoomConfiguration.focalLengthLabel(for: dualFocalZoomRange.lowerBound)
    }

    var dualFocalMaximumLengthLabel: String {
        CameraDualFocalZoomConfiguration.focalLengthLabel(for: dualFocalZoomRange.upperBound)
    }

    var dualFocalAspectRatioOptions: [CameraFocalCropAspectRatio] {
        CameraFocalCropAspectRatio.allCases
    }

    var selectedDualFocalAspectRatioLabel: String {
        selectedDualFocalAspectRatio.label
    }

    var isLiveFilterPreviewActive: Bool {
        selectedPhoto == nil && !selectedFilterPreset.isOriginal
    }

    var canFlipSelectedPhotoHorizontally: Bool {
        selectedPhoto?.source == .camera
    }

    func prepareCamera() async {
        errorMessage = nil

        guard selectedPhoto == nil else {
            captureSignalMonitor.stop()
            updateFrameSignalAnalysisAvailability()
            return
        }

        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            permissionState = .authorized
            configureAndStart()
        case .notDetermined:
            captureSignalMonitor.stop()
            permissionState = .notDetermined
        case .denied:
            captureSignalMonitor.stop()
            permissionState = .denied
        case .restricted:
            captureSignalMonitor.stop()
            permissionState = .restricted
        @unknown default:
            captureSignalMonitor.stop()
            permissionState = .unavailable
        }
    }

    func requestCameraAccess() async {
        isLoading = true
        let granted = await AVCaptureDevice.requestAccess(for: .video)
        isLoading = false

        permissionState = granted ? .authorized : .denied
        if granted {
            configureAndStart()
        } else {
            captureSignalMonitor.stop()
        }
    }

    func resumeCameraIfNeeded() async {
        guard selectedPhoto == nil else {
            captureSignalMonitor.stop()
            return
        }

        await prepareCamera()
    }

    func capturePhoto(isFlashEnabled: Bool) {
        guard permissionState == .authorized else { return }
        isLoading = true
        errorMessage = nil

        service.capturePhoto(flashEnabled: isFlashEnabled) { [weak self] result in
            guard let self else { return }
            self.isLoading = false

            switch result {
            case .success(let data):
                guard let image = UIImage(data: data) else {
                    self.errorMessage = CameraCaptureError.imageDataUnavailable.localizedDescription
                    return
                }
                let croppedImage = self.isDualFocalZoomEnabled
                    ? CameraDualFocalPhotoCropper.crop(
                        image: image,
                        configuration: self.dualFocalZoomConfiguration,
                        baseFocalLengthMillimeters: self.selectedLensOption.focalLengthMillimeters,
                        isPreviewMirrored: self.isUsingFrontCamera
                    )
                    : image
                let outputImage = self.isUsingFrontCamera && self.isFrontCameraCaptureMirroringEnabled
                    ? croppedImage.horizontallyMirroredForFrontCameraCapture()
                    : croppedImage
                let analyzedImageSignals = LocalImageSignalAnalyzer.analyze(outputImage)
                let captureContext = CameraCaptureContextSnapshotter.snapshot(
                    source: .captured,
                    imageSize: outputImage.size,
                    selectedFilterId: self.selectedFilterPreset.id,
                    previewFilterId: self.selectedFilterPreset.id,
                    lensOption: self.selectedLensOption,
                    liveGuidanceSignals: self.latestLocalFrameSignals,
                    deviceSignalSnapshot: self.captureSignalMonitor.snapshot(),
                    analyzedImageSignals: analyzedImageSignals,
                    compositionHelpers: CameraCompositionHelperContext(
                        gridEnabled: false,
                        levelGuideEnabled: false,
                        centerGuideEnabled: self.liveGuidanceMode == .local
                    )
                )
                self.setSelectedPhoto(
                    CapturedPhoto(
                        image: outputImage,
                        source: .camera,
                        captureContext: captureContext
                    )
                )
            case .failure(let error):
                self.errorMessage = error.localizedDescription
            }
        }
    }

    func importSelectedPhoto() async {
        guard let pickerItem else { return }
        isLoading = true
        errorMessage = nil

        do {
            guard let data = try await pickerItem.loadTransferable(type: Data.self),
                  let image = UIImage(data: data) else {
                throw CameraCaptureError.imageDataUnavailable
            }
            let analyzedImageSignals = LocalImageSignalAnalyzer.analyze(image)
            setSelectedPhoto(
                CapturedPhoto(
                    image: image,
                    source: .photoLibrary,
                    captureContext: CameraCaptureContext.imported(
                        imageSize: image.size,
                        localImageSignals: analyzedImageSignals
                    )
                )
            )
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func selectFilterPreset(_ preset: FilterPreset) {
        selectedFilterPreset = preset
        filterErrorMessage = nil
        photoSaveState = .idle
        refreshLiveGuidanceSuggestions()

        guard let selectedPhoto else {
            filteredPreviewImage = nil
            isFiltering = false
            activeFilterRenderID = nil
            return
        }

        if preset.isOriginal {
            filteredPreviewImage = nil
            isFiltering = false
            activeFilterRenderID = nil
            return
        }

        let renderID = UUID()
        activeFilterRenderID = renderID
        isFiltering = true

        Task {
            do {
                let image = try await filterPipeline.render(image: selectedPhoto.image, preset: preset)
                guard activeFilterRenderID == renderID,
                      self.selectedPhoto?.id == selectedPhoto.id,
                      selectedFilterPreset.id == preset.id else {
                    return
                }
                filteredPreviewImage = image
                isFiltering = false
            } catch {
                guard activeFilterRenderID == renderID else { return }
                filteredPreviewImage = nil
                filterErrorMessage = error.localizedDescription
                isFiltering = false
            }
        }
    }

    func saveSelectedPhoto(shouldFail: Bool = false) async {
        guard let selectedPhoto else { return }

        photoSaveState = .saving
        var resolvedFilteredPreviewImage = filteredPreviewImage
        if resolvedFilteredPreviewImage == nil,
           !selectedFilterPreset.isOriginal {
            isFiltering = true
            do {
                let image = try await filterPipeline.render(image: selectedPhoto.image, preset: selectedFilterPreset)
                guard self.selectedPhoto?.id == selectedPhoto.id else {
                    isFiltering = false
                    photoSaveState = .idle
                    return
                }
                resolvedFilteredPreviewImage = image
                filteredPreviewImage = image
                isFiltering = false
            } catch {
                filterErrorMessage = error.localizedDescription
                photoSaveState = .failed(error.localizedDescription)
                isFiltering = false
                return
            }
        }

        let request = PhotoSaveRequest(
            ownerId: "mock-user",
            source: selectedPhoto.source,
            sourceImage: selectedPhoto.image,
            filteredPreviewImage: resolvedFilteredPreviewImage,
            filterPresetId: selectedFilterPreset.id,
            createdAt: Date()
        )

        do {
            let service = shouldFail ? failingPhotoSaveService : photoSaveService
            let savedPhoto = try await service.savePhoto(request)
            guard self.selectedPhoto?.id == selectedPhoto.id else { return }
            photoSaveState = .saved(savedPhoto)
        } catch {
            photoSaveState = .failed(error.localizedDescription)
        }
    }

    func resetSelection() {
        clearSelectedPhoto()
        resetFilterState()
    }

    func clearSelectedPhoto() {
        selectedPhoto = nil
        pickerItem = nil
        errorMessage = nil
        filteredPreviewImage = nil
        filterErrorMessage = nil
        isFiltering = false
        activeFilterRenderID = nil
        resetSaveState()
        resetCloudSnapshotGuidance()
        updateFrameSignalAnalysisAvailability()
        if permissionState == .authorized {
            configureAndStart()
        } else {
            startCaptureSignalMonitoringIfNeeded()
        }
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func flipSelectedPhotoHorizontally() {
        guard let selectedPhoto,
              canFlipSelectedPhotoHorizontally else {
            return
        }

        let currentPreset = selectedFilterPreset
        let mirroredPhotoImage = selectedPhoto.image.horizontallyMirroredForFrontCameraCapture()
        let mirroredFilteredImage = filteredPreviewImage?.horizontallyMirroredForFrontCameraCapture()

        self.selectedPhoto = CapturedPhoto(
            image: mirroredPhotoImage,
            source: selectedPhoto.source,
            captureContext: selectedPhoto.captureContext
        )
        filteredPreviewImage = mirroredFilteredImage
        filterErrorMessage = nil
        isFiltering = false
        activeFilterRenderID = nil
        resetSaveState()
        resetCloudSnapshotGuidance()

        if mirroredFilteredImage == nil,
           !currentPreset.isOriginal {
            selectFilterPreset(currentPreset)
        }
    }

    func stopCamera() {
        captureSignalMonitor.stop()
        service.setFrameSignalAnalysisEnabled(false)
        service.stopSession()
    }

    func toggleLiveGuidance() {
        liveGuidanceState = liveGuidanceState == .off ? .suggestionAvailable : .off
        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func toggleLiveGuidanceMode() {
        liveGuidanceMode = liveGuidanceMode.next
        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func refreshLiveGuidanceCopyForCurrentTone() {
        guard liveGuidanceMode == .local else { return }
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func advanceLiveGuidanceMockState() {
        switch liveGuidanceState {
        case .off:
            liveGuidanceState = .idle
        case .idle:
            liveGuidanceState = .scanning
        case .scanning:
            liveGuidanceState = .suggestionAvailable
        case .suggestionAvailable:
            liveGuidanceState = .paused
        case .paused:
            liveGuidanceState = .idle
        }
        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func selectLensOption(_ option: LensOption) {
        do {
            try service.selectLensOption(option)
            refreshCameraControlState()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func toggleCameraPosition() {
        do {
            try service.switchCameraPosition()
            refreshCameraControlState()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func toggleFrontCameraCaptureMirroring() {
        isFrontCameraCaptureMirroringEnabled.toggle()
    }

    func enableDualFocalZoom() {
        let baseFocalLength = selectedLensOption.focalLengthMillimeters
        let nextFocalLength = CameraDualFocalZoomConfiguration.isBaseFocalLength(
            selectedDualFocalLengthMillimeters,
            baseFocalLength: baseFocalLength
        )
            ? baseFocalLength * 1.15
            : selectedDualFocalLengthMillimeters
        updateDualFocalLength(nextFocalLength)
    }

    func disableDualFocalZoom() {
        selectedDualFocalLengthMillimeters = CameraDualFocalZoomConfiguration.defaultFocalLength(
            forBaseFocalLength: selectedLensOption.focalLengthMillimeters
        )
        isDualFocalZoomEnabled = false
    }

    func updateDualFocalLength(_ focalLength: Double) {
        let baseFocalLength = selectedLensOption.focalLengthMillimeters
        let clampedFocalLength = CameraDualFocalZoomConfiguration.clampedFocalLength(
            focalLength,
            baseFocalLength: baseFocalLength
        )
        selectedDualFocalLengthMillimeters = clampedFocalLength
        isDualFocalZoomEnabled = !CameraDualFocalZoomConfiguration.isBaseFocalLength(
            clampedFocalLength,
            baseFocalLength: baseFocalLength
        )
    }

    func updateDualFocalAspectRatio(_ aspectRatio: CameraFocalCropAspectRatio) {
        selectedDualFocalAspectRatio = aspectRatio
    }

    func updateDualFocalFrameCenter(xRatio: CGFloat, yRatio: CGFloat) {
        dualFocalFrameCenterXRatio = min(max(xRatio, 0), 1)
        dualFocalFrameCenterYRatio = min(max(yRatio, 0), 1)
        isDualFocalZoomEnabled = !CameraDualFocalZoomConfiguration.isBaseFocalLength(
            selectedDualFocalLengthMillimeters,
            baseFocalLength: selectedLensOption.focalLengthMillimeters
        )
    }

    func requestCloudSnapshotGuidanceConsent() {
        guard !cloudSnapshotGuidanceState.isWorking else { return }
        cloudSnapshotGuidanceState = .consentRequired
    }

    func startMockCloudSnapshotGuidance(outcome: CloudSnapshotGuidanceMockOutcome = .success) async {
        guard !cloudSnapshotGuidanceState.isWorking else { return }

        let guidanceID = UUID()
        activeCloudSnapshotGuidanceID = guidanceID
        cloudSnapshotGuidanceState = .preparingSnapshot
        let request = CloudSnapshotGuidanceRequest(
            filterPresetID: selectedFilterPreset.id,
            filterNameKey: selectedFilterPreset.nameKey,
            lensFocalLengthLabel: selectedLensOption.focalLengthLabel,
            guidanceModeID: liveGuidanceMode.id,
            requestedAt: Date()
        )

        try? await Task.sleep(nanoseconds: 200_000_000)
        guard activeCloudSnapshotGuidanceID == guidanceID else { return }
        cloudSnapshotGuidanceState = .analyzing
        do {
            let service: any CloudSnapshotGuidanceService = outcome == .success
                ? cloudSnapshotGuidanceService
                : MockCloudSnapshotGuidanceService(outcome: outcome)
            let response = try await service.analyze(request)
            guard activeCloudSnapshotGuidanceID == guidanceID else { return }
            cloudSnapshotGuidanceState = .result(response)
        } catch let error as CloudSnapshotGuidanceError {
            guard activeCloudSnapshotGuidanceID == guidanceID else { return }
            switch error {
            case .mockFailure:
                cloudSnapshotGuidanceState = .failed(messageKey: error.messageKey)
            case .mockUnavailable:
                cloudSnapshotGuidanceState = .unavailable(messageKey: error.messageKey)
            }
        } catch {
            guard activeCloudSnapshotGuidanceID == guidanceID else { return }
            cloudSnapshotGuidanceState = .failed(messageKey: "camera.cloud_snapshot.error.mock_failure")
        }
    }

    func resetCloudSnapshotGuidance() {
        activeCloudSnapshotGuidanceID = nil
        cloudSnapshotGuidanceState = .idle
    }

    private func configureAndStart() {
        do {
            try service.configureSessionIfNeeded()
            refreshCameraControlState()
            service.startSession()
            permissionState = .authorized
            startCaptureSignalMonitoringIfNeeded()
            updateFrameSignalAnalysisAvailability()
        } catch {
            captureSignalMonitor.stop()
            permissionState = .unavailable
            updateFrameSignalAnalysisAvailability()
            errorMessage = error.localizedDescription
        }
    }

    private func setSelectedPhoto(_ photo: CapturedPhoto) {
        let pendingPreset = selectedFilterPreset
        selectedPhoto = photo
        filteredPreviewImage = nil
        filterErrorMessage = nil
        isFiltering = false
        activeFilterRenderID = nil
        resetSaveState()
        resetCloudSnapshotGuidance()
        updateFrameSignalAnalysisAvailability()
        captureSignalMonitor.stop()

        if pendingPreset.isOriginal {
            selectedFilterPreset = FilterPresetCatalog.original
        } else {
            selectFilterPreset(pendingPreset)
        }
    }

    private func resetFilterState() {
        selectedFilterPreset = FilterPresetCatalog.original
        filteredPreviewImage = nil
        filterErrorMessage = nil
        isFiltering = false
        activeFilterRenderID = nil
    }

    private func resetSaveState() {
        photoSaveState = .idle
    }

    private func refreshLiveGuidanceSuggestions(resetStability: Bool = false) {
        if resetStability {
            liveGuidanceStabilityController.reset()
        }

        let frameSignals = liveGuidanceMode == .local ? latestLocalFrameSignals : nil
        let suggestions = activeLiveGuidanceProvider.suggestions(
            for: liveGuidanceState,
            selectedPreset: selectedFilterPreset,
            frameSignals: frameSignals
        )

        guard liveGuidanceMode == .local,
              liveGuidanceState == .suggestionAvailable else {
            liveGuidanceSuggestions = Array(suggestions.prefix(2))
            return
        }

        liveGuidanceSuggestions = liveGuidanceStabilityController.suggestions(from: suggestions)
    }

    private var activeLiveGuidanceProvider: any LiveGuidanceProvider {
        switch liveGuidanceMode {
        case .mock:
            return mockLiveGuidanceProvider
        case .local:
            return localLiveGuidanceProvider
        }
    }

    private func updateLiveGuidanceFrameSignals(_ signals: [LiveGuidanceSignal]) {
        latestLocalFrameSignals = signals

        guard liveGuidanceMode == .local else { return }
        refreshLiveGuidanceSuggestions()
    }

    private func updateFrameSignalAnalysisAvailability() {
        let shouldAnalyzeFrames = permissionState == .authorized
            && selectedPhoto == nil
            && liveGuidanceMode == .local
            && liveGuidanceState != .off
            && liveGuidanceState != .paused

        service.setFrameSignalAnalysisEnabled(shouldAnalyzeFrames)

        if !shouldAnalyzeFrames {
            latestLocalFrameSignals = nil
            liveGuidanceStabilityController.reset()
        }

    }

    private func startCaptureSignalMonitoringIfNeeded() {
        guard permissionState == .authorized,
              selectedPhoto == nil else {
            captureSignalMonitor.stop()
            return
        }

        captureSignalMonitor.start()
    }

    private func refreshCameraControlState() {
        let availableOptions = service.availableLensOptionsForCurrentPosition()
        lensOptions = availableOptions.isEmpty ? [service.currentLensOption] : availableOptions
        selectedLensOption = lensOptions.contains(service.currentLensOption)
            ? service.currentLensOption
            : lensOptions[0]
        isUsingFrontCamera = service.isUsingFrontCamera
        isHardwareFlashAvailable = service.isHardwareFlashAvailable
        refreshDualFocalZoomForSelectedLens()
    }

    private func refreshDualFocalZoomForSelectedLens() {
        let baseFocalLength = selectedLensOption.focalLengthMillimeters
        let currentFocalLength = isDualFocalZoomEnabled
            ? selectedDualFocalLengthMillimeters
            : CameraDualFocalZoomConfiguration.defaultFocalLength(forBaseFocalLength: baseFocalLength)
        let clampedFocalLength = CameraDualFocalZoomConfiguration.clampedFocalLength(
            currentFocalLength,
            baseFocalLength: baseFocalLength
        )
        selectedDualFocalLengthMillimeters = clampedFocalLength
        isDualFocalZoomEnabled = !CameraDualFocalZoomConfiguration.isBaseFocalLength(
            clampedFocalLength,
            baseFocalLength: baseFocalLength
        )
    }

}

private extension UIImage {
    func horizontallyMirroredForFrontCameraCapture() -> UIImage {
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = scale
        format.opaque = false

        return UIGraphicsImageRenderer(size: size, format: format).image { context in
            context.cgContext.translateBy(x: size.width, y: 0)
            context.cgContext.scaleBy(x: -1, y: 1)
            draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
