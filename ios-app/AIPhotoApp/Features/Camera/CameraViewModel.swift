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
    @Published private(set) var isLocalAIComposeEnabled = false
    @Published private(set) var localAIComposeGuide = LocalAIComposeGuide.searching
    @Published private(set) var isLocalAIComposeDepthLayerCueActive = false
    @Published private(set) var localAIComposeDepthOcclusionMask: LiveFrameDepthOcclusionMask?
    @Published private(set) var isLocalAIComposeSubjectLocked = false
    @Published private(set) var localAIComposePolicyPreference = LocalAIComposePolicyPreference.automatic
    @Published private(set) var isLocalAIComposeTargetHorizontallyFlipped = false
    @Published private(set) var hybridCompositionPlannerState: HybridCompositionPlannerState = .idle
    @Published private(set) var isHybridCompositionLiveSessionActive = false
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
    private let hybridCompositionPlannerService: any HybridCompositionPlannerService
    private let liveGuidanceStabilityController = LiveGuidanceStabilityController()
    private let localAIComposeGuideResolver = LocalAIComposeGuideResolver()
    private let localAIComposePolicyResolver = LocalAIComposePolicyResolver()
    private let localAIComposeSubjectAmbiguityController = LocalAIComposeSubjectAmbiguityController()
    private let localAIComposeHorizonStabilityController = LocalAIComposeHorizonStabilityController()
    private let localAIComposeGuidanceActionStabilityController = LocalAIComposeGuidanceActionStabilityController()
    private let localAIComposePoseFramingStabilityController = LocalAIComposePoseFramingStabilityController()
    private let localAIComposeReadinessController = LocalAIComposeReadinessController()
    private let localAIComposeSymmetryStabilityController = LocalAIComposeSymmetryStabilityController()
    private let localAIComposeLeadingLineStabilityController = LocalAIComposeLeadingLineStabilityController()
    private let localAIComposeQuietSpaceStabilityController = LocalAIComposeQuietSpaceStabilityController()
    private let localAIComposeMotionGateController = LocalAIComposeMotionGateController()
    private let localAIComposeLeadRoomStabilityController = LocalAIComposeLeadRoomStabilityController()
    private let localAIComposeGroupStabilityController = LocalAIComposeGroupStabilityController()
    private let localAIComposeDepthStabilityController = LocalAIComposeDepthStabilityController()
    private let localAIComposeDepthOcclusionStabilityController = LocalAIComposeDepthOcclusionStabilityController()
    private let localAIComposeTemporalSubjectTracker = LocalAIComposeTemporalSubjectTracker()
    private let captureSignalMonitor = CameraCaptureDeviceSignalMonitor()
    private var activeFilterRenderID: UUID?
    private var activeCloudSnapshotGuidanceID: UUID?
    private var activeHybridCompositionPlannerID: UUID?
    private var hybridCompositionLiveSessionID: UUID?
    private var hybridCompositionLiveLoopTask: Task<Void, Never>?
    private var hybridCompositionNetworkTask: Task<Void, Never>?
    private var hybridCompositionSubjectHint: LiveFramePoint?
    private var pendingHybridCompositionPlan: HybridCompositionPlan?
    private var pendingHybridCompositionPlanMatchCount = 0
    private var activeHybridCompositionPlan: HybridCompositionPlan?
    private var latestLocalFrameSignals: [LiveGuidanceSignal]?
    private var latestLiveFrameSignals: LiveFrameSignals?
    private var latestLocalAIComposeSubjectCandidates: [LiveFrameSubjectCandidate] = []
    private var localAIComposeSelectedCandidate: LiveFrameSubjectCandidate?
    private var localAIComposeTrackingState: LocalAIComposeTemporalTrackingState?
    private var activeLocalAIComposeVisionTrackingSeedID: UUID?
    private var latestLocalAIComposeVisionTrackingSequenceIndex = 0
    private var localAIComposeTargetAnchor: LiveFramePoint?
    private var localAIComposeTargetBox: LiveFrameNormalizedRect?
    private var localAIComposePolicy: LocalAIComposePolicy?
    private var localAIComposeSubjectAmbiguityState = LocalAIComposeSubjectAmbiguityState.initial
    private var localAIComposeHorizonState = LocalAIComposeHorizonStabilityState.initial
    private var localAIComposeGuidanceActionState = LocalAIComposeGuidanceActionState.initial
    private var localAIComposePoseFramingState = LocalAIComposePoseFramingState.initial
    private var localAIComposeReadinessState = LocalAIComposeReadinessState.initial
    private var localAIComposeSymmetryState = LocalAIComposeSymmetryStabilityState.initial
    private var localAIComposeLeadingLineState = LocalAIComposeLeadingLineStabilityState.initial
    private var localAIComposeQuietSpaceState = LocalAIComposeQuietSpaceStabilityState.initial
    private var localAIComposeMotionGateState = LocalAIComposeMotionGateState.initial
    private var localAIComposeLeadRoomState = LocalAIComposeLeadRoomStabilityState.initial
    private var localAIComposeGroupState = LocalAIComposeGroupStabilityState.initial
    private var localAIComposeDepthState = LocalAIComposeDepthStabilityState.initial
    private var localAIComposeDepthOcclusionState = LocalAIComposeDepthOcclusionState.initial
    private var localAIComposeGroupHasFreshEvidence = false
    private var isLocalAIComposeThermalProtectionActive = false
    private let hybridCompositionKeyframeIntervalNanoseconds: UInt64 = 1_000_000_000

    init(
        service: CameraCaptureService,
        photoSaveService: any PhotoSaveService,
        failingPhotoSaveService: any PhotoSaveService,
        liveGuidanceProvider: (any LiveGuidanceProvider)? = nil,
        localLiveGuidanceProvider: (any LiveGuidanceProvider)? = nil,
        cloudSnapshotGuidanceService: (any CloudSnapshotGuidanceService)? = nil,
        hybridCompositionPlannerService: (any HybridCompositionPlannerService)? = nil,
        initialSelectedPhoto: CapturedPhoto? = nil
    ) {
        self.service = service
        self.photoSaveService = photoSaveService
        self.failingPhotoSaveService = failingPhotoSaveService
        self.mockLiveGuidanceProvider = liveGuidanceProvider ?? MockLiveGuidanceProvider()
        self.localLiveGuidanceProvider = localLiveGuidanceProvider ?? LocalRuleBasedGuidanceProvider()
        self.cloudSnapshotGuidanceService = cloudSnapshotGuidanceService ?? MockCloudSnapshotGuidanceService()
        self.hybridCompositionPlannerService = hybridCompositionPlannerService
            ?? RemoteHybridCompositionPlannerService()
        self.selectedPhoto = initialSelectedPhoto
        self.permissionState = CameraPermissionState(
            authorizationStatus: AVCaptureDevice.authorizationStatus(for: .video)
        )
        self.service.setFrameSignalHandler { [weak self] analysis in
            self?.updateLiveGuidanceFrameAnalysis(analysis)
        }
        self.service.setComposeSubjectTrackingHandler { [weak self] update in
            self?.updateLocalAIComposeVisionTracking(update)
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

    var liveGuidanceOverlayActionTitleKey: String {
        if liveGuidanceMode == .local {
            return "camera.guidance.action.next_hint"
        }

        return "camera.guidance.action.next_state"
    }

    var liveGuidanceCompactIconName: String {
        if let firstSuggestion = liveGuidanceSuggestions.first {
            return firstSuggestion.category.systemImageName
        }

        switch liveGuidanceState {
        case .off:
            return "lightbulb.slash"
        case .idle:
            return "lightbulb"
        case .scanning:
            return "scope"
        case .suggestionAvailable:
            return liveGuidanceMode == .local ? "lightbulb" : "sparkles"
        case .paused:
            return "pause.circle"
        }
    }

    var isLiveGuidanceOverlayActionEnabled: Bool {
        if liveGuidanceMode == .local {
            return liveGuidanceSuggestions.count > 1
        }

        return liveGuidanceState != .off
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

    var canRequestHybridCompositionPlan: Bool {
        isLocalAIComposeEnabled
            && hybridCompositionSubjectHint != nil
            && !isHybridCompositionLiveSessionActive
            && !hybridCompositionPlannerState.isWorking
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

    func focusAndExpose(at devicePoint: CGPoint) -> Bool {
        guard permissionState == .authorized,
              selectedPhoto == nil else {
            return false
        }

        return service.focusAndExpose(at: devicePoint)
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
        service.setComposeHorizonAnalysisEnabled(false)
        service.setComposeStructureAnalysisEnabled(false)
        service.stopSession()
        resetLocalAIComposeThermalProtection()
        resetLocalAIComposeTarget()
    }

    func toggleLocalAICompose() {
        isLocalAIComposeEnabled.toggle()
        localAIComposePolicyPreference = .automatic
        isLocalAIComposeTargetHorizontallyFlipped = false
        resetHybridCompositionPlanner()
        resetLocalAIComposeHorizon()
        resetLocalAIComposeSymmetry()
        resetLocalAIComposeLeadingLines()
        resetLocalAIComposeQuietSpace()
        resetLocalAIComposeMotionGate()
        resetLocalAIComposeThermalProtection()
        clearLocalAIComposeSelectionState()
        clearLocalAIComposeTargetGeometry()
        localAIComposeGuide = .searching

        if isLocalAIComposeEnabled {
            liveGuidanceMode = .local
            if liveGuidanceState == .off || liveGuidanceState == .paused {
                liveGuidanceState = .suggestionAvailable
            }
        }

        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions(resetStability: true)
        refreshLocalAIComposeGuide()
    }

    @discardableResult
    func selectLocalAIComposeSubject(at displayPoint: LiveFramePoint) -> Bool {
        guard isLocalAIComposeEnabled else { return false }

        #if DEBUG
        // In the internal hybrid path the long press is also the photographer's
        // semantic grounding hint. It remains useful even when the local detector
        // has not produced a candidate; GPT Vision will provide the authoritative
        // initial box after explicit session consent.
        resetHybridCompositionPlanner()
        hybridCompositionSubjectHint = displayPoint
        #endif

        let analysisPoint = LiveFramePoint(
            x: isUsingFrontCamera ? 1 - displayPoint.x : displayPoint.x,
            y: displayPoint.y
        )
        let selectableCandidates = localAIComposeSubjectAmbiguityState.requiresSelection
            ? localAIComposePolicyResolver.selectionCandidates(
                in: latestLocalAIComposeSubjectCandidates
            )
            : latestLocalAIComposeSubjectCandidates
        guard let candidate = subjectCandidate(
            nearestTo: analysisPoint,
            in: selectableCandidates,
            maximumDistance: 0.22
        ) else {
            #if DEBUG
            let provisionalCandidate = provisionalHybridSubjectCandidate(
                centeredAt: analysisPoint
            )
            isLocalAIComposeSubjectLocked = true
            localAIComposeSelectedCandidate = provisionalCandidate
            localAIComposeTrackingState = localAIComposeTemporalSubjectTracker
                .initialState(for: provisionalCandidate)
            seedLocalAIComposeVisionTracking(with: provisionalCandidate)
            clearLocalAIComposeTargetGeometry()
            refreshLocalAIComposeGuide()
            return true
            #else
            return false
            #endif
        }

        isLocalAIComposeSubjectLocked = true
        localAIComposeSelectedCandidate = candidate
        if localAIComposePolicyPreference == .fixed(.groupBalance) {
            localAIComposePolicyPreference = .automatic
            isLocalAIComposeTargetHorizontallyFlipped = false
        }
        resetLocalAIComposeLeadRoom()
        resetLocalAIComposeGroup()
        resetLocalAIComposeDepth()
        localAIComposeTrackingState = localAIComposeTemporalSubjectTracker.initialState(for: candidate)
        localAIComposeSubjectAmbiguityState = .initial
        seedLocalAIComposeVisionTracking(with: candidate)
        clearLocalAIComposeTargetGeometry()
        refreshLocalAIComposeGuide()
        return true
    }

    func clearLocalAIComposeSubjectSelection() {
        resetHybridCompositionPlanner()
        clearLocalAIComposeSelectionState()
        clearLocalAIComposeTargetGeometry()
        refreshLocalAIComposeGuide()
    }

    func selectLocalAIComposePolicyPreference(
        _ preference: LocalAIComposePolicyPreference
    ) {
        guard isLocalAIComposeEnabled else { return }
        resetHybridCompositionPlanner()
        let wasGroupBalance = localAIComposePolicyPreference == .fixed(.groupBalance)
        localAIComposePolicyPreference = preference
        isLocalAIComposeTargetHorizontallyFlipped = false
        if preference == .fixed(.groupBalance) {
            clearLocalAIComposeSelectionState()
        }
        if wasGroupBalance || preference == .fixed(.groupBalance) {
            resetLocalAIComposeDepth()
        }
        clearLocalAIComposeTargetGeometry()
        refreshLocalAIComposeGuide()
    }

    func toggleLocalAIComposeTargetSide() {
        guard isLocalAIComposeEnabled,
              localAIComposeGuide.subjectBox != nil,
              localAIComposeGuide.policy?.supportsHorizontalTargetFlip == true else {
            return
        }
        isLocalAIComposeTargetHorizontallyFlipped.toggle()
        clearLocalAIComposeTargetGeometry()
        refreshLocalAIComposeGuide()
    }

    func requestHybridCompositionPlannerConsent() {
        guard canRequestHybridCompositionPlan else { return }
        hybridCompositionPlannerState = .consentRequired
    }

    func startHybridCompositionPlanner(consent: CloudAIConsent) {
        guard canRequestHybridCompositionPlan,
              consent.imageUploadAccepted else {
            hybridCompositionPlannerState = .failed(
                messageKey: "camera.hybrid_compose.error.subject_required"
            )
            return
        }

        let sessionID = UUID()
        hybridCompositionLiveSessionID = sessionID
        isHybridCompositionLiveSessionActive = true
        pendingHybridCompositionPlan = nil
        pendingHybridCompositionPlanMatchCount = 0
        hybridCompositionPlannerState = .preparingSnapshot
        requestNextHybridCompositionKeyframe(
            sessionID: sessionID,
            consent: consent,
            showsWorkingState: true
        )
    }

    func retryHybridCompositionPlanner() {
        guard canRequestHybridCompositionPlan else { return }
        hybridCompositionPlannerState = .consentRequired
    }

    func dismissHybridCompositionPlanner() {
        hybridCompositionPlannerState = .idle
    }

    func stopHybridCompositionLiveSession() {
        stopHybridCompositionLiveSession(
            clearsPlan: false,
            clearsSubjectHint: false
        )
        hybridCompositionPlannerState = .idle
    }

    func toggleLiveGuidance() {
        liveGuidanceState = liveGuidanceState == .off ? .suggestionAvailable : .off
        updateFrameSignalAnalysisAvailability()
        refreshLiveGuidanceSuggestions(resetStability: true)
    }

    func toggleLiveGuidanceMode() {
        if isLocalAIComposeEnabled {
            isLocalAIComposeEnabled = false
            resetLocalAIComposeGuide()
        }
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

    func performLiveGuidanceOverlayAction() {
        guard liveGuidanceMode == .local else {
            advanceLiveGuidanceMockState()
            return
        }

        guard liveGuidanceSuggestions.count > 1 else { return }
        let firstSuggestion = liveGuidanceSuggestions.removeFirst()
        liveGuidanceSuggestions.append(firstSuggestion)
    }

    func selectLensOption(_ option: LensOption) {
        do {
            try service.selectLensOption(option)
            refreshCameraControlState()
            resetLocalAIComposeTarget()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func toggleCameraPosition() {
        do {
            try service.switchCameraPosition()
            refreshCameraControlState()
            resetLocalAIComposeTarget()
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
        isLocalAIComposeEnabled = false
        resetLocalAIComposeGuide()
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

    private func updateLiveGuidanceFrameAnalysis(_ analysis: LiveGuidanceFrameAnalysis) {
        let shouldPauseForThermalProtection = isLocalAIComposeEnabled
            && analysis.workloadMode == .thermallyPaused
        if shouldPauseForThermalProtection {
            if !isLocalAIComposeThermalProtectionActive {
                isLocalAIComposeThermalProtectionActive = true
                localAIComposeGuidanceActionState = .initial
                localAIComposePoseFramingState = .initial
                localAIComposeReadinessState = .initial
                resetLocalAIComposeDepth()
                service.setComposeDepthAnalysisEnabled(false)
            }
            refreshLocalAIComposeGuide()
            return
        } else if isLocalAIComposeThermalProtectionActive {
            isLocalAIComposeThermalProtectionActive = false
            service.setComposeDepthAnalysisEnabled(
                permissionState == .authorized
                    && selectedPhoto == nil
                    && isLocalAIComposeEnabled
            )
        }

        latestLocalFrameSignals = analysis.guidanceSignals
        latestLiveFrameSignals = analysis.liveFrameSignals
        latestLocalAIComposeSubjectCandidates = analysis.subjectCandidates
        let deviceSignals = captureSignalMonitor.snapshot()
        localAIComposeGroupHasFreshEvidence = false

        if isLocalAIComposeEnabled {
            let motionGateUpdate = localAIComposeMotionGateController.update(
                state: localAIComposeMotionGateState,
                motion: captureSignalMonitor.composeMotionStability()
            )
            localAIComposeMotionGateState = motionGateUpdate.state
            if motionGateUpdate.didEnterPause {
                localAIComposeGuidanceActionState = .initial
                localAIComposePoseFramingState = .initial
                localAIComposeReadinessState = .initial
                resetLocalAIComposeDepthOcclusion()
            }

            if !localAIComposeMotionGateState.isPaused {
                let depthUpdate = localAIComposeDepthStabilityController.update(
                    state: localAIComposeDepthState,
                    signals: analysis.liveFrameSignals?.depth ?? .unavailable
                )
                localAIComposeDepthState = depthUpdate.state
                isLocalAIComposeDepthLayerCueActive = depthUpdate.state.isActive
                let depthOcclusionUpdate = localAIComposeDepthOcclusionStabilityController.update(
                    state: localAIComposeDepthOcclusionState,
                    candidateMask: analysis.depthOcclusionMask
                )
                localAIComposeDepthOcclusionState = depthOcclusionUpdate.state
                localAIComposeDepthOcclusionMask = depthOcclusionUpdate.state.activeMask
                localAIComposeHorizonState = localAIComposeHorizonStabilityController.update(
                    state: localAIComposeHorizonState,
                    detectedAngleDegrees: analysis.sceneHorizonSignal?.angleDegreesRounded
                )
                let symmetryUpdate = localAIComposeSymmetryStabilityController.update(
                    state: localAIComposeSymmetryState,
                    evidence: analysis.sceneStructureSignal?.symmetryEvidence ?? .unavailable
                )
                localAIComposeSymmetryState = symmetryUpdate.state
                if symmetryUpdate.didChangeActiveState,
                   localAIComposePolicyPreference == .automatic,
                   !isLocalAIComposeSubjectLocked {
                    clearLocalAIComposeTargetGeometry()
                }
                let leadingLineUpdate = localAIComposeLeadingLineStabilityController.update(
                    state: localAIComposeLeadingLineState,
                    signal: analysis.sceneStructureSignal?.leadingLineSignal ?? .unavailable
                )
                localAIComposeLeadingLineState = leadingLineUpdate.state
                if leadingLineUpdate.didChangeActivePoint,
                   (localAIComposePolicyPreference == .automatic
                    || localAIComposePolicyPreference == .fixed(.leadingLines)),
                   !isLocalAIComposeSubjectLocked {
                    clearLocalAIComposeTargetGeometry()
                }
                let quietSpaceUpdate = localAIComposeQuietSpaceStabilityController.update(
                    state: localAIComposeQuietSpaceState,
                    signal: analysis.sceneStructureSignal?.quietSpaceSignal ?? .unavailable
                )
                localAIComposeQuietSpaceState = quietSpaceUpdate.state
                if quietSpaceUpdate.didChangeActiveSide,
                   (localAIComposePolicyPreference == .automatic
                    || localAIComposePolicyPreference == .fixed(.negativeSpace)),
                   !isLocalAIComposeSubjectLocked {
                    clearLocalAIComposeTargetGeometry()
                }
                let groupUpdate = localAIComposeGroupStabilityController.update(
                    state: localAIComposeGroupState,
                    memberBoxes: localAIComposePolicyResolver.selectionCandidateBoxes(
                        in: latestLocalAIComposeSubjectCandidates
                    )
                )
                localAIComposeGroupState = groupUpdate.state
                localAIComposeGroupHasFreshEvidence = groupUpdate.hasFreshActiveObservation
                if groupUpdate.didChangeActiveGroup,
                   localAIComposePolicyPreference == .fixed(.groupBalance) {
                    clearLocalAIComposeTargetGeometry()
                }
            }
        }
        let didMatchLockedSubject = updateLockedLocalAIComposeSubject()
        if isLocalAIComposeEnabled,
           !localAIComposeMotionGateState.isPaused {
            let leadRoomUpdate = localAIComposeLeadRoomStabilityController.update(
                state: localAIComposeLeadRoomState,
                horizontalVelocity: didMatchLockedSubject
                    ? localAIComposeTrackingState?.velocity.x
                    : nil
            )
            localAIComposeLeadRoomState = leadRoomUpdate.state
            if leadRoomUpdate.didChangeActiveDirection,
               (localAIComposePolicyPreference == .automatic
                || localAIComposePolicyPreference == .fixed(.leadRoom)),
               !isLocalAIComposeSubjectLocked {
                clearLocalAIComposeTargetGeometry()
            }
        }
        refreshLocalAIComposeGuide(
            consumesFreshFrameSample: true,
            deviceSignals: deviceSignals
        )

        guard liveGuidanceMode == .local else { return }
        refreshLiveGuidanceSuggestions()
    }

    private func updateLocalAIComposeVisionTracking(
        _ update: LocalAIComposeVisionTrackingUpdate
    ) {
        guard isLocalAIComposeEnabled,
              isLocalAIComposeSubjectLocked,
              activeLocalAIComposeVisionTrackingSeedID == update.seedID,
              update.sequenceIndex > latestLocalAIComposeVisionTrackingSequenceIndex else {
            return
        }
        latestLocalAIComposeVisionTrackingSequenceIndex = update.sequenceIndex

        switch update.phase {
        case .tracked:
            guard let box = update.box,
                  let selectedCandidate = localAIComposeSelectedCandidate else {
                return
            }
            if let trackingState = localAIComposeTrackingState {
                localAIComposeTrackingState = localAIComposeTemporalSubjectTracker
                    .reconcilingFastTrackedBox(box, with: trackingState)
            }
            localAIComposeSelectedCandidate = LiveFrameSubjectCandidate(
                box: box,
                kind: selectedCandidate.kind,
                poseFramingSignal: selectedCandidate.poseFramingSignal
            )
        case .lost:
            localAIComposeSelectedCandidate = nil
            stopLocalAIComposeVisionTracking()
            clearLocalAIComposeLockTransientEvidence()
        }

        // Sequence tracking improves display cadence only. It must not advance the
        // fresh-frame ambiguity, action, pose-edge, or Hold/Ready controllers.
        refreshLocalAIComposeGuide()
    }

    private func updateFrameSignalAnalysisAvailability() {
        let guidanceNeedsFrames = liveGuidanceMode == .local
            && liveGuidanceState != .off
            && liveGuidanceState != .paused
        let shouldAnalyzeFrames = permissionState == .authorized
            && selectedPhoto == nil
            && (guidanceNeedsFrames || isLocalAIComposeEnabled)

        service.setFrameSignalAnalysisEnabled(shouldAnalyzeFrames)
        service.setComposeHorizonAnalysisEnabled(
            shouldAnalyzeFrames && isLocalAIComposeEnabled
        )
        service.setComposeStructureAnalysisEnabled(
            shouldAnalyzeFrames && isLocalAIComposeEnabled
        )
        service.setComposeDepthAnalysisEnabled(
            shouldAnalyzeFrames
                && isLocalAIComposeEnabled
                && !isLocalAIComposeThermalProtectionActive
        )

        if !shouldAnalyzeFrames {
            latestLocalFrameSignals = nil
            latestLiveFrameSignals = nil
            latestLocalAIComposeSubjectCandidates = []
            clearLocalAIComposeSelectionState()
            clearLocalAIComposeTargetGeometry()
            resetLocalAIComposeHorizon()
            resetLocalAIComposeSymmetry()
            resetLocalAIComposeLeadingLines()
            resetLocalAIComposeQuietSpace()
            resetLocalAIComposeMotionGate()
            resetLocalAIComposeDepth()
            resetLocalAIComposeThermalProtection()
            liveGuidanceStabilityController.reset()
        }

    }

    private func refreshLocalAIComposeGuide(
        consumesFreshFrameSample: Bool = false,
        deviceSignals providedDeviceSignals: CameraCaptureDeviceSignalSnapshot? = nil
    ) {
        guard isLocalAIComposeEnabled else {
            localAIComposeGuide = .searching
            return
        }

        let deviceSignals = providedDeviceSignals ?? captureSignalMonitor.snapshot()
        let advancesStableEvidence = consumesFreshFrameSample
            && !localAIComposeMotionGateState.isPaused
            && !isLocalAIComposeThermalProtectionActive
        let isGroupGuidanceSelected = localAIComposePolicyPreference == .fixed(.groupBalance)
        let advancesGuideEvidence = advancesStableEvidence
            && (!isGroupGuidanceSelected || localAIComposeGroupHasFreshEvidence)
        let hasMultipleSubjects = localAIComposePolicyResolver.hasMultiplePlausibleSubjects(
            latestLocalAIComposeSubjectCandidates
        )
        if advancesStableEvidence,
           !isGroupGuidanceSelected {
            let ambiguityUpdate = localAIComposeSubjectAmbiguityController.update(
                state: localAIComposeSubjectAmbiguityState,
                hasMultipleSubjects: hasMultipleSubjects,
                isSubjectLocked: isLocalAIComposeSubjectLocked
            )
            localAIComposeSubjectAmbiguityState = ambiguityUpdate.state
            if ambiguityUpdate.didChangeRequirement,
               !isLocalAIComposeSubjectLocked {
                clearLocalAIComposeTargetGeometry()
            }
        }
        let requiresSubjectSelection = !isGroupGuidanceSelected
            && !isLocalAIComposeSubjectLocked
            && localAIComposeSubjectAmbiguityState.requiresSelection
        let selectionCandidateBoxes = requiresSubjectSelection
            ? localAIComposePolicyResolver.selectionCandidateBoxes(
                in: latestLocalAIComposeSubjectCandidates
            )
            : []

        let subjectContext: LocalAIComposeSubjectContext?
        if isGroupGuidanceSelected {
            subjectContext = localAIComposePolicyResolver.groupSubjectContext(
                activeGroupBox: localAIComposeGroupState.activeBox
            )
        } else {
            subjectContext = localAIComposePolicyResolver.subjectContext(
                frameSignals: latestLiveFrameSignals,
                subjectCandidates: latestLocalAIComposeSubjectCandidates,
                selectedCandidate: localAIComposeSelectedCandidate,
                isSubjectLocked: isLocalAIComposeSubjectLocked
            )
        }
        if advancesGuideEvidence {
            localAIComposePoseFramingState = localAIComposePoseFramingStabilityController.update(
                state: localAIComposePoseFramingState,
                detectedEdges: requiresSubjectSelection
                    ? nil
                    : subjectContext?.poseFramingSignal?.nearEdges
            )
        }
        if localAIComposePolicy == nil,
           !localAIComposeMotionGateState.isPaused,
           !isLocalAIComposeThermalProtectionActive,
           !requiresSubjectSelection,
           let subjectContext {
            if let activeHybridCompositionPlan {
                localAIComposePolicy = activeHybridCompositionPlan.localPolicy
            } else {
                switch localAIComposePolicyPreference {
                case .automatic:
                    localAIComposePolicy = localAIComposePolicyResolver.recommendedPolicy(
                        for: subjectContext,
                        favorsSymmetry: localAIComposeSymmetryState.isActive,
                        leadingLinePoint: localAIComposeLeadingLineState.activePoint,
                        subjectMotionDirection: localAIComposeLeadRoomState.activeDirection,
                        quietSpaceSide: localAIComposeQuietSpaceState.activeSide
                    )
                case let .fixed(policy):
                    localAIComposePolicy = policy
                }
            }
        }
        let hybridTarget = resolvedHybridCompositionTarget(
            subjectContext: subjectContext,
            policy: localAIComposePolicy
        )
        let provisionalGuide = localAIComposeGuideResolver.guide(
            subjectContext: subjectContext,
            policy: localAIComposePolicy,
            requiresSubjectSelection: requiresSubjectSelection,
            isGroupGuidanceSelected: isGroupGuidanceSelected,
            isSubjectLocked: isLocalAIComposeSubjectLocked,
            targetAnchor: localAIComposeTargetAnchor ?? hybridTarget?.anchor,
            targetBox: localAIComposeTargetBox ?? hybridTarget?.box,
            level: deviceSignals.level,
            isMirrored: isUsingFrontCamera,
            sceneHorizonAngleDegrees: localAIComposeHorizonState.activeAngleDegrees,
            isSceneHorizonNearLevel: localAIComposeHorizonState.isNearLevel,
            poseFramingEdges: localAIComposePoseFramingState.activeEdges,
            activeGuidanceAction: localAIComposeGuidanceActionState.activeAction,
            favorsSymmetry: localAIComposeSymmetryState.isActive,
            leadingLinePoint: localAIComposeLeadingLineState.activePoint,
            subjectMotionDirection: localAIComposeLeadRoomState.activeDirection,
            quietSpaceSide: localAIComposeQuietSpaceState.activeSide,
            isTargetHorizontallyFlipped: isLocalAIComposeTargetHorizontallyFlipped,
            selectionCandidateBoxes: selectionCandidateBoxes
        )
        if advancesGuideEvidence {
            localAIComposeGuidanceActionState = localAIComposeGuidanceActionStabilityController.update(
                state: localAIComposeGuidanceActionState,
                proposedAction: provisionalGuide.guidanceAction
            )
            localAIComposeReadinessState = localAIComposeReadinessController.update(
                state: localAIComposeReadinessState,
                isAlignedFrame: provisionalGuide.guidanceAction == .aligned
                    && localAIComposeGuidanceActionState.activeAction == .aligned
            )
        }
        let guide: LocalAIComposeGuide
        if isLocalAIComposeThermalProtectionActive {
            guide = provisionalGuide.applyingThermalProtectionPause(
                preservesExistingTarget: localAIComposeTargetAnchor != nil
            )
        } else if localAIComposeMotionGateState.isPaused {
            guide = provisionalGuide.applyingMotionPause(
                true,
                preservesExistingTarget: localAIComposeTargetAnchor != nil
            )
        } else {
            let displayedAction = localAIComposeGuidanceActionState.activeAction
                ?? provisionalGuide.guidanceAction
            guide = provisionalGuide
                .applyingGuidanceAction(displayedAction)
                .applyingReadiness(localAIComposeReadinessState.readiness)
        }

        if localAIComposeTargetAnchor == nil,
           !localAIComposeMotionGateState.isPaused,
           !isLocalAIComposeThermalProtectionActive {
            localAIComposeTargetAnchor = guide.targetAnchor
            localAIComposeTargetBox = guide.targetBox
            localAIComposePolicy = guide.policy
        }

        localAIComposeGuide = guide
    }

    private func resetLocalAIComposeTarget() {
        resetHybridCompositionPlanner()
        clearLocalAIComposeTargetGeometry()
        clearLocalAIComposeSelectionState()
        resetLocalAIComposeHorizon()
        resetLocalAIComposeSymmetry()
        resetLocalAIComposeLeadingLines()
        resetLocalAIComposeQuietSpace()
        resetLocalAIComposeMotionGate()
        resetLocalAIComposeDepth()
        resetLocalAIComposeThermalProtection()
        latestLiveFrameSignals = nil
        latestLocalAIComposeSubjectCandidates = []
        refreshLocalAIComposeGuide()
    }

    private func resetLocalAIComposeGuide() {
        resetHybridCompositionPlanner()
        localAIComposePolicyPreference = .automatic
        isLocalAIComposeTargetHorizontallyFlipped = false
        clearLocalAIComposeTargetGeometry()
        clearLocalAIComposeSelectionState()
        resetLocalAIComposeHorizon()
        resetLocalAIComposeSymmetry()
        resetLocalAIComposeLeadingLines()
        resetLocalAIComposeQuietSpace()
        resetLocalAIComposeMotionGate()
        resetLocalAIComposeDepth()
        resetLocalAIComposeThermalProtection()
        latestLiveFrameSignals = nil
        latestLocalAIComposeSubjectCandidates = []
        localAIComposeGuide = .searching
    }

    private func resetLocalAIComposeHorizon() {
        localAIComposeHorizonState = .initial
    }

    private func resetLocalAIComposeSymmetry() {
        localAIComposeSymmetryState = .initial
    }

    private func resetLocalAIComposeLeadingLines() {
        localAIComposeLeadingLineState = .initial
    }

    private func resetLocalAIComposeQuietSpace() {
        localAIComposeQuietSpaceState = .initial
    }

    private func resetLocalAIComposeMotionGate() {
        localAIComposeMotionGateState = .initial
    }

    private func resetLocalAIComposeLeadRoom() {
        localAIComposeLeadRoomState = .initial
    }

    private func resetLocalAIComposeGroup() {
        localAIComposeGroupState = .initial
        localAIComposeGroupHasFreshEvidence = false
    }

    private func resetLocalAIComposeDepth() {
        localAIComposeDepthState = .initial
        isLocalAIComposeDepthLayerCueActive = false
        resetLocalAIComposeDepthOcclusion()
    }

    private func resetLocalAIComposeDepthOcclusion() {
        localAIComposeDepthOcclusionState = .initial
        localAIComposeDepthOcclusionMask = nil
    }

    private func resetLocalAIComposeThermalProtection() {
        isLocalAIComposeThermalProtectionActive = false
    }

    private func clearLocalAIComposeTargetGeometry() {
        localAIComposeTargetAnchor = nil
        localAIComposeTargetBox = nil
        localAIComposePolicy = nil
        localAIComposeGuidanceActionState = .initial
        localAIComposePoseFramingState = .initial
        localAIComposeReadinessState = .initial
    }

    private func requestNextHybridCompositionKeyframe(
        sessionID: UUID,
        consent: CloudAIConsent,
        showsWorkingState: Bool
    ) {
        guard isHybridCompositionLiveSessionActive,
              hybridCompositionLiveSessionID == sessionID,
              let focusPoint = resolvedHybridCompositionFocusPoint() else {
            return
        }

        let requestID = UUID()
        activeHybridCompositionPlannerID = requestID
        if showsWorkingState {
            hybridCompositionPlannerState = .preparingSnapshot
        }

        service.captureAnalysisSnapshot { [weak self] result in
            guard let self,
                  self.hybridCompositionLiveSessionID == sessionID,
                  self.activeHybridCompositionPlannerID == requestID,
                  self.hybridCompositionNetworkTask == nil else {
                return
            }

            switch result {
            case .success(let image):
                self.hybridCompositionNetworkTask = Task { @MainActor [weak self] in
                    await self?.analyzeHybridCompositionSnapshot(
                        image,
                        consent: consent,
                        focusPoint: focusPoint,
                        sessionID: sessionID,
                        requestID: requestID,
                        showsWorkingState: showsWorkingState
                    )
                }
            case .failure:
                self.failHybridCompositionLiveSession(
                    sessionID: sessionID,
                    messageKey: "camera.hybrid_compose.error.snapshot"
                )
            }
        }

        Task { @MainActor [weak self] in
            try? await Task.sleep(nanoseconds: 3_000_000_000)
            guard let self,
                  self.hybridCompositionLiveSessionID == sessionID,
                  self.activeHybridCompositionPlannerID == requestID,
                  self.hybridCompositionNetworkTask == nil else {
                return
            }
            self.failHybridCompositionLiveSession(
                sessionID: sessionID,
                messageKey: "camera.hybrid_compose.error.snapshot"
            )
        }
    }

    private func analyzeHybridCompositionSnapshot(
        _ image: UIImage,
        consent: CloudAIConsent,
        focusPoint: LiveFramePoint,
        sessionID: UUID,
        requestID: UUID,
        showsWorkingState: Bool
    ) async {
        guard hybridCompositionLiveSessionID == sessionID,
              activeHybridCompositionPlannerID == requestID else {
            return
        }

        if showsWorkingState {
            hybridCompositionPlannerState = .analyzing
        }
        do {
            let displayedImage = isUsingFrontCamera
                ? image.horizontallyMirroredForFrontCameraCapture()
                : image
            let compressedImage = try CloudAIImageCompressor().compress(displayedImage)
            let selectedCandidate = localAIComposeSelectedCandidate
            let response = try await hybridCompositionPlannerService.analyze(
                HybridCompositionPlannerInput(
                    imageData: compressedImage.data,
                    contentType: compressedImage.contentType,
                    width: compressedImage.width,
                    height: compressedImage.height,
                    metadataStripped: compressedImage.metadataStripped,
                    locale: Locale.preferredLanguages.first ?? "en",
                    consent: consent,
                    localContext: HybridCompositionLocalContext(
                        subjectKind: selectedCandidate.map {
                            hybridSubjectKind(for: $0.kind)
                        } ?? .salientObject,
                        subjectCount: latestLocalAIComposeSubjectCandidates.count > 1
                            ? .multiple
                            : .single,
                        lensBucket: hybridLensBucket(for: selectedLensOption),
                        focusHint: HybridCompositionFocusHint(displayPoint: focusPoint)
                    )
                )
            )
            guard hybridCompositionLiveSessionID == sessionID,
                  activeHybridCompositionPlannerID == requestID else {
                return
            }
            guard let plan = response.plan,
                  let cloudCandidate = plan.groundedSubjectCandidate(
                    isFrontCameraMirrored: isUsingFrontCamera
                  ) else {
                throw CloudAIServiceError.invalidResponse(["invalid_composition_grounding"])
            }

            activeHybridCompositionPlannerID = nil
            hybridCompositionNetworkTask = nil
            applyHybridCompositionGrounding(cloudCandidate)
            applyStabilizedHybridCompositionStrategy(plan)
            hybridCompositionPlannerState = .applied(activeHybridCompositionPlan ?? plan)
            scheduleNextHybridCompositionKeyframe(
                sessionID: sessionID,
                consent: consent
            )
        } catch is CancellationError {
            return
        } catch {
            guard hybridCompositionLiveSessionID == sessionID,
                  activeHybridCompositionPlannerID == requestID else {
                return
            }
            failHybridCompositionLiveSession(
                sessionID: sessionID,
                messageKey: "camera.hybrid_compose.error.unavailable"
            )
        }
    }

    private func scheduleNextHybridCompositionKeyframe(
        sessionID: UUID,
        consent: CloudAIConsent
    ) {
        hybridCompositionLiveLoopTask?.cancel()
        hybridCompositionLiveLoopTask = Task { @MainActor [weak self] in
            guard let self else { return }
            try? await Task.sleep(
                nanoseconds: self.hybridCompositionKeyframeIntervalNanoseconds
            )
            guard !Task.isCancelled,
                  self.hybridCompositionLiveSessionID == sessionID,
                  self.isHybridCompositionLiveSessionActive else {
                return
            }
            self.requestNextHybridCompositionKeyframe(
                sessionID: sessionID,
                consent: consent,
                showsWorkingState: false
            )
        }
    }

    private func applyHybridCompositionGrounding(
        _ cloudCandidate: LiveFrameSubjectCandidate
    ) {
        if activeHybridCompositionPlan != nil,
           localAIComposeSelectedCandidate != nil {
            // The cloud box belongs to an older keyframe by the time it arrives.
            // Keep the current fast local geometry instead of snapping backward.
            return
        }
        let currentBox = localAIComposeSelectedCandidate?.box
        let liveCandidate = LiveFrameSubjectCandidate(
            box: currentBox ?? cloudCandidate.box,
            kind: cloudCandidate.kind
        )
        isLocalAIComposeSubjectLocked = true
        localAIComposeSelectedCandidate = liveCandidate
        localAIComposeTrackingState = localAIComposeTemporalSubjectTracker
            .initialState(for: liveCandidate)
        localAIComposeSubjectAmbiguityState = .initial
        seedLocalAIComposeVisionTracking(with: liveCandidate)
        refreshLocalAIComposeGuide()
    }

    private func applyStabilizedHybridCompositionStrategy(
        _ plan: HybridCompositionPlan
    ) {
        let shouldApply: Bool
        if let activePlan = activeHybridCompositionPlan {
            if activePlan.hasSameStrategy(as: plan) {
                pendingHybridCompositionPlan = nil
                pendingHybridCompositionPlanMatchCount = 0
                shouldApply = false
            } else if pendingHybridCompositionPlan?.hasSameStrategy(as: plan) == true {
                pendingHybridCompositionPlanMatchCount += 1
                shouldApply = pendingHybridCompositionPlanMatchCount >= 2
            } else {
                pendingHybridCompositionPlan = plan
                pendingHybridCompositionPlanMatchCount = 1
                shouldApply = false
            }
        } else {
            shouldApply = true
        }

        guard shouldApply else { return }
        activeHybridCompositionPlan = plan
        pendingHybridCompositionPlan = nil
        pendingHybridCompositionPlanMatchCount = 0
        localAIComposePolicyPreference = .fixed(plan.localPolicy)
        isLocalAIComposeTargetHorizontallyFlipped = false
        clearLocalAIComposeTargetGeometry()
        refreshLocalAIComposeGuide()
    }

    private func resolvedHybridCompositionTarget(
        subjectContext: LocalAIComposeSubjectContext?,
        policy: LocalAIComposePolicy?
    ) -> (anchor: LiveFramePoint, box: LiveFrameNormalizedRect)? {
        guard let plan = activeHybridCompositionPlan,
              let subjectContext,
              let policy else {
            return nil
        }

        var anchor = plan.targetAnchor(
            isFrontCameraMirrored: isUsingFrontCamera
        )
        if isLocalAIComposeTargetHorizontallyFlipped,
           policy.supportsHorizontalTargetFlip {
            anchor = LiveFramePoint(x: 1 - anchor.x, y: anchor.y)
        }
        let box = localAIComposePolicyResolver.targetBox(
            for: subjectContext,
            policy: policy,
            centeredAt: anchor,
            desiredAreaOverride: plan.targetArea
        )
        return (anchor, box)
    }

    private func hybridSubjectKind(
        for kind: LiveFrameSubjectCandidateKind
    ) -> HybridCompositionSubjectKind {
        switch kind {
        case .face:
            return .face
        case .body:
            return .body
        case .salientObject:
            return .salientObject
        }
    }

    private func hybridLensBucket(for lens: LensOption) -> HybridCompositionLensBucket {
        if lens.focalLengthMillimeters < 30 {
            return .wide
        }
        if lens.focalLengthMillimeters >= 60 {
            return .telephoto
        }
        return .standard
    }

    private func resetHybridCompositionPlanner() {
        stopHybridCompositionLiveSession(
            clearsPlan: true,
            clearsSubjectHint: true
        )
        hybridCompositionPlannerState = .idle
    }

    private func stopHybridCompositionLiveSession(
        clearsPlan: Bool,
        clearsSubjectHint: Bool
    ) {
        hybridCompositionLiveLoopTask?.cancel()
        hybridCompositionLiveLoopTask = nil
        hybridCompositionNetworkTask?.cancel()
        hybridCompositionNetworkTask = nil
        hybridCompositionLiveSessionID = nil
        activeHybridCompositionPlannerID = nil
        isHybridCompositionLiveSessionActive = false
        pendingHybridCompositionPlan = nil
        pendingHybridCompositionPlanMatchCount = 0
        if clearsPlan {
            activeHybridCompositionPlan = nil
        }
        if clearsSubjectHint {
            hybridCompositionSubjectHint = nil
        }
    }

    private func failHybridCompositionLiveSession(
        sessionID: UUID,
        messageKey: String
    ) {
        guard hybridCompositionLiveSessionID == sessionID else { return }
        stopHybridCompositionLiveSession(
            clearsPlan: false,
            clearsSubjectHint: false
        )
        hybridCompositionPlannerState = .failed(messageKey: messageKey)
    }

    private func resolvedHybridCompositionFocusPoint() -> LiveFramePoint? {
        guard let candidate = localAIComposeSelectedCandidate else {
            return hybridCompositionSubjectHint
        }
        let analysisCenter = candidate.box.center
        let displayPoint = LiveFramePoint(
            x: isUsingFrontCamera ? 1 - analysisCenter.x : analysisCenter.x,
            y: analysisCenter.y
        )
        hybridCompositionSubjectHint = displayPoint
        return displayPoint
    }

    private func provisionalHybridSubjectCandidate(
        centeredAt point: LiveFramePoint
    ) -> LiveFrameSubjectCandidate {
        let width: CGFloat = 0.20
        let height: CGFloat = 0.20
        return LiveFrameSubjectCandidate(
            box: LiveFrameNormalizedRect(
                CGRect(
                    x: point.x - width / 2,
                    y: point.y - height / 2,
                    width: width,
                    height: height
                )
            ),
            kind: .salientObject
        )
    }

    private func clearLocalAIComposeLockTransientEvidence() {
        localAIComposeGuidanceActionState = .initial
        localAIComposePoseFramingState = .initial
        localAIComposeReadinessState = .initial
        resetLocalAIComposeDepth()
    }

    private func clearLocalAIComposeSelectionState() {
        stopLocalAIComposeVisionTracking()
        isLocalAIComposeSubjectLocked = false
        localAIComposeSelectedCandidate = nil
        localAIComposeTrackingState = nil
        localAIComposeSubjectAmbiguityState = .initial
        resetLocalAIComposeLeadRoom()
        resetLocalAIComposeGroup()
        resetLocalAIComposeDepth()
    }

    @discardableResult
    private func updateLockedLocalAIComposeSubject() -> Bool {
        guard isLocalAIComposeSubjectLocked,
              let trackingState = localAIComposeTrackingState else {
            return false
        }

        let trackingUpdate = localAIComposeTemporalSubjectTracker.update(
            state: trackingState,
            candidates: latestLocalAIComposeSubjectCandidates
        )
        localAIComposeTrackingState = trackingUpdate.state

        switch trackingUpdate.phase {
        case .confirmed:
            guard let candidate = trackingUpdate.candidate else {
                return false
            }
            let displayedCandidate = localAIComposeSelectedCandidate
            let needsSequenceReseed = displayedCandidate.map {
                localAIComposeTemporalSubjectTracker.requiresSequenceReseed(
                    displayedBox: $0.box,
                    detectorBox: candidate.box
                )
            } ?? true

            if needsSequenceReseed || activeLocalAIComposeVisionTrackingSeedID == nil {
                localAIComposeSelectedCandidate = candidate
                seedLocalAIComposeVisionTracking(with: candidate)
            } else if let displayedCandidate {
                localAIComposeSelectedCandidate = LiveFrameSubjectCandidate(
                    box: displayedCandidate.box,
                    kind: displayedCandidate.kind,
                    poseFramingSignal: candidate.poseFramingSignal
                )
            }
            return trackingUpdate.hasFreshObservation

        case .retained:
            if activeLocalAIComposeVisionTrackingSeedID == nil {
                localAIComposeSelectedCandidate = nil
                clearLocalAIComposeLockTransientEvidence()
            }
            return false

        case .lost:
            if isHybridCompositionLiveSessionActive,
               activeHybridCompositionPlan == nil,
               activeLocalAIComposeVisionTrackingSeedID != nil {
                // A touch-seeded VNTrackObjectRequest may still be carrying the
                // subject while the first GPT keyframe is in flight. Do not let
                // the slower category detector discard that provisional track
                // solely because its pre-GPT kind does not match yet.
                return false
            }
            localAIComposeSelectedCandidate = nil
            stopLocalAIComposeVisionTracking()
            clearLocalAIComposeLockTransientEvidence()
            return false
        }
    }

    private func seedLocalAIComposeVisionTracking(
        with candidate: LiveFrameSubjectCandidate
    ) {
        guard isLocalAIComposeEnabled,
              isLocalAIComposeSubjectLocked else {
            stopLocalAIComposeVisionTracking()
            return
        }

        let seed = LocalAIComposeVisionTrackingSeed(
            id: UUID(),
            box: candidate.box
        )
        activeLocalAIComposeVisionTrackingSeedID = seed.id
        latestLocalAIComposeVisionTrackingSequenceIndex = 0
        service.setComposeSubjectTrackingSeed(seed)
    }

    private func stopLocalAIComposeVisionTracking() {
        activeLocalAIComposeVisionTrackingSeedID = nil
        latestLocalAIComposeVisionTrackingSequenceIndex = 0
        service.setComposeSubjectTrackingSeed(nil)
    }

    private func subjectCandidate(
        nearestTo point: LiveFramePoint,
        in candidates: [LiveFrameSubjectCandidate],
        maximumDistance: CGFloat
    ) -> LiveFrameSubjectCandidate? {
        let containingCandidates = candidates.filter { $0.box.contains(point) }
        if let mostSpecificCandidate = containingCandidates.min(by: { $0.box.area < $1.box.area }) {
            return mostSpecificCandidate
        }

        guard let nearestCandidate = candidates.min(by: {
            squaredDistance(from: $0.box.center, to: point)
                < squaredDistance(from: $1.box.center, to: point)
        }) else {
            return nil
        }

        let maximumDistanceSquared = maximumDistance * maximumDistance
        return squaredDistance(from: nearestCandidate.box.center, to: point) <= maximumDistanceSquared
            ? nearestCandidate
            : nil
    }

    private func squaredDistance(
        from lhs: LiveFramePoint,
        to rhs: LiveFramePoint
    ) -> CGFloat {
        let deltaX = lhs.x - rhs.x
        let deltaY = lhs.y - rhs.y
        return deltaX * deltaX + deltaY * deltaY
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
