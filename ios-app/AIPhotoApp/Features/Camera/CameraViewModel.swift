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
    @Published private(set) var isLoading = false
    @Published private(set) var isFiltering = false
    @Published var pickerItem: PhotosPickerItem?

    let service: CameraCaptureService
    let filterPresets = FilterPresetCatalog.all
    let lensOptions = LensOption.all

    private let filterPipeline = FilterPipeline()
    private let photoSaveService: any PhotoSaveService
    private let failingPhotoSaveService: any PhotoSaveService
    private let mockLiveGuidanceProvider: any LiveGuidanceProvider
    private let localLiveGuidanceProvider: any LiveGuidanceProvider
    private let cloudSnapshotGuidanceService: any CloudSnapshotGuidanceService
    private let liveGuidanceStabilityController = LiveGuidanceStabilityController()
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
        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions()
    }

    var liveGuidanceStateTitleKey: String {
        liveGuidanceState.titleKey(for: liveGuidanceMode)
    }

    func prepareCamera() async {
        errorMessage = nil

        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            permissionState = .authorized
            configureAndStart()
        case .notDetermined:
            permissionState = .notDetermined
        case .denied:
            permissionState = .denied
        case .restricted:
            permissionState = .restricted
        @unknown default:
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
        }
    }

    func capturePhoto() {
        guard permissionState == .authorized else { return }
        isLoading = true
        errorMessage = nil

        service.capturePhoto { [weak self] result in
            guard let self else { return }
            self.isLoading = false

            switch result {
            case .success(let data):
                guard let image = UIImage(data: data) else {
                    self.errorMessage = CameraCaptureError.imageDataUnavailable.localizedDescription
                    return
                }
                self.setSelectedPhoto(CapturedPhoto(image: image, source: .camera))
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
            setSelectedPhoto(CapturedPhoto(image: image, source: .photoLibrary))
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
        let request = PhotoSaveRequest(
            ownerId: "mock-user",
            source: selectedPhoto.source,
            sourceImage: selectedPhoto.image,
            filteredPreviewImage: filteredPreviewImage,
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
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func stopCamera() {
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
        selectedLensOption = option
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
            service.startSession()
            permissionState = .authorized
            updateFrameSignalAnalysisAvailability()
        } catch {
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
}
