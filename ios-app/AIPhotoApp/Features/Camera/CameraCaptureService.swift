@preconcurrency import AVFoundation
import UIKit

enum CameraCaptureError: LocalizedError {
    case cameraUnavailable
    case captureFailed
    case imageDataUnavailable

    var errorDescription: String? {
        switch self {
        case .cameraUnavailable:
            return NSLocalizedString("camera.error.unavailable", comment: "")
        case .captureFailed:
            return NSLocalizedString("camera.error.capture_failed", comment: "")
        case .imageDataUnavailable:
            return NSLocalizedString("camera.error.image_data_unavailable", comment: "")
        }
    }
}

@MainActor
final class CameraCaptureService {
    nonisolated(unsafe) let session = AVCaptureSession()

    private let photoOutput = AVCapturePhotoOutput()
    private let videoOutput = AVCaptureVideoDataOutput()
    private let depthDataOutput = AVCaptureDepthDataOutput()
    private let depthCapabilityProbe = CameraDepthCapabilityProbe()
    private let sessionQueue = DispatchQueue(label: "ai.photo.camera.capture-session", qos: .userInitiated)
    private let frameSignalQueue = DispatchQueue(label: "ai.photo.camera.frame-signal", qos: .utility)
    private let frameSignalState = FrameSignalState()
    private let filteredPreviewState = FilteredPreviewFrameState()
    private var frameSignalDelegate: FrameSignalDelegate?
    private var dataOutputSynchronizer: AVCaptureDataOutputSynchronizer?
    private var frameSignalHandler: (@MainActor @Sendable (LiveGuidanceFrameAnalysis) -> Void)?
    private var composeSubjectTrackingHandler: (@MainActor @Sendable (LocalAIComposeVisionTrackingUpdate) -> Void)?
    private var currentVideoInput: AVCaptureDeviceInput?
    private(set) var depthCapability: CameraDepthCapability = .unavailable
    private(set) var currentLensOption = LensOption.classic35
    private(set) var currentPosition: AVCaptureDevice.Position = .back
    private var isConfigured = false
    private var delegates: [PhotoCaptureDelegate] = []

    var isUsingFrontCamera: Bool {
        currentPosition == .front
    }

    var isHardwareFlashAvailable: Bool {
        currentVideoInput?.device.hasFlash == true
    }

    func setFrameSignalHandler(_ handler: (@MainActor @Sendable (LiveGuidanceFrameAnalysis) -> Void)?) {
        frameSignalHandler = handler
    }

    func setFrameSignalAnalysisEnabled(_ isEnabled: Bool) {
        frameSignalState.isEnabled = isEnabled
        if !isEnabled {
            setComposeSubjectTrackingSeed(nil)
        }
    }

    func setComposeHorizonAnalysisEnabled(_ isEnabled: Bool) {
        frameSignalState.isComposeHorizonAnalysisEnabled = isEnabled
    }

    func setComposeStructureAnalysisEnabled(_ isEnabled: Bool) {
        frameSignalState.isComposeStructureAnalysisEnabled = isEnabled
    }

    func setComposeDepthAnalysisEnabled(_ isEnabled: Bool) {
        let wasEnabled = frameSignalState.isComposeDepthAnalysisEnabled
        frameSignalState.isComposeDepthAnalysisEnabled = isEnabled
        guard wasEnabled != isEnabled,
              isConfigured,
              let camera = currentVideoInput?.device else {
            return
        }

        session.beginConfiguration()
        if isEnabled {
            refreshDepthCapability(for: camera)
            configureDepthOutputIfPossible(for: camera)
        } else {
            tearDownDepthOutputIfNeeded()
        }
        session.commitConfiguration()
        updateVideoOutputConnection()
    }

    func setComposeSubjectTrackingHandler(
        _ handler: (@MainActor @Sendable (LocalAIComposeVisionTrackingUpdate) -> Void)?
    ) {
        composeSubjectTrackingHandler = handler
    }

    func setComposeSubjectTrackingSeed(
        _ seed: LocalAIComposeVisionTrackingSeed?
    ) {
        frameSignalState.composeSubjectTrackingSeed = seed
        if seed == nil {
            let delegate = frameSignalDelegate
            frameSignalQueue.async {
                delegate?.resetComposeSubjectTracking()
            }
        }
    }

    nonisolated func setFilteredPreviewFrameHandler(_ handler: ((CVPixelBuffer) -> Void)?) {
        filteredPreviewState.frameHandler = handler
    }

    func configureSessionIfNeeded() throws {
        guard !isConfigured else { return }

        let initialLensOption = preferredDefaultLensOption(for: currentPosition) ?? .classic35
        guard let camera = cameraDevice(for: initialLensOption) else {
            throw CameraCaptureError.cameraUnavailable
        }

        let input = try AVCaptureDeviceInput(device: camera)
        session.beginConfiguration()
        session.sessionPreset = .photo

        guard session.canAddInput(input), session.canAddOutput(photoOutput) else {
            session.commitConfiguration()
            throw CameraCaptureError.cameraUnavailable
        }

        session.addInput(input)
        currentVideoInput = input
        currentLensOption = initialLensOption
        currentPosition = camera.position
        session.addOutput(photoOutput)
        refreshDepthCapability(for: camera)

        configureFrameSignalOutputIfPossible()
        if frameSignalState.isComposeDepthAnalysisEnabled {
            configureDepthOutputIfPossible(for: camera)
        }
        session.commitConfiguration()
        updateVideoOutputConnection()
        isConfigured = true
    }

    func availableLensOptionsForCurrentPosition() -> [LensOption] {
        let options = availableLensOptions(for: currentPosition)
        return options.isEmpty ? availableLensOptions(for: .back) : options
    }

    func switchCameraPosition() throws {
        let targetPosition: AVCaptureDevice.Position = currentPosition == .front ? .back : .front
        guard let targetLensOption = preferredDefaultLensOption(for: targetPosition) else {
            throw CameraCaptureError.cameraUnavailable
        }

        try switchToLensOption(targetLensOption)
    }

    func selectLensOption(_ option: LensOption) throws {
        try switchToLensOption(option)
    }

    func startSession() {
        guard isConfigured else { return }
        sessionQueue.async { [session] in
            guard !session.isRunning else { return }
            session.startRunning()
        }
    }

    func stopSession() {
        sessionQueue.async { [session] in
            guard session.isRunning else { return }
            session.stopRunning()
        }
    }

    func capturePhoto(
        flashEnabled: Bool,
        completion: @MainActor @escaping (Result<Data, Error>) -> Void
    ) {
        guard isConfigured else {
            completion(.failure(CameraCaptureError.cameraUnavailable))
            return
        }

        let settings = AVCapturePhotoSettings()
        settings.flashMode = resolvedFlashMode(isEnabled: flashEnabled)
        let delegateID = UUID()
        let delegate = PhotoCaptureDelegate(id: delegateID) { [weak self] result in
            completion(result)
            self?.delegates.removeAll { $0.id == delegateID }
        }

        delegates.append(delegate)
        photoOutput.capturePhoto(with: settings, delegate: delegate)
    }

    func focusAndExpose(at devicePoint: CGPoint) -> Bool {
        guard isConfigured,
              devicePoint.x.isFinite,
              devicePoint.y.isFinite,
              let camera = currentVideoInput?.device else {
            return false
        }

        let boundedPoint = CGPoint(
            x: min(max(devicePoint.x, 0), 1),
            y: min(max(devicePoint.y, 0), 1)
        )
        var supportedFocusMode: AVCaptureDevice.FocusMode?
        if camera.isFocusPointOfInterestSupported {
            if camera.isFocusModeSupported(.autoFocus) {
                supportedFocusMode = .autoFocus
            } else if camera.isFocusModeSupported(.continuousAutoFocus) {
                supportedFocusMode = .continuousAutoFocus
            }
        }

        var supportedExposureMode: AVCaptureDevice.ExposureMode?
        if camera.isExposurePointOfInterestSupported {
            if camera.isExposureModeSupported(.autoExpose) {
                supportedExposureMode = .autoExpose
            } else if camera.isExposureModeSupported(.continuousAutoExposure) {
                supportedExposureMode = .continuousAutoExposure
            }
        }

        guard supportedFocusMode != nil || supportedExposureMode != nil else {
            return false
        }

        do {
            try camera.lockForConfiguration()
            defer { camera.unlockForConfiguration() }

            if let supportedFocusMode {
                camera.focusPointOfInterest = boundedPoint
                camera.focusMode = supportedFocusMode
            }

            if let supportedExposureMode {
                camera.exposurePointOfInterest = boundedPoint
                camera.exposureMode = supportedExposureMode
            }

            return true
        } catch {
            return false
        }
    }

    private func switchToLensOption(_ option: LensOption) throws {
        guard let camera = cameraDevice(for: option) else {
            throw CameraCaptureError.cameraUnavailable
        }

        let input = try AVCaptureDeviceInput(device: camera)

        guard isConfigured else {
            currentVideoInput = input
            currentLensOption = option
            currentPosition = camera.position
            return
        }

        session.beginConfiguration()
        defer {
            session.commitConfiguration()
            updateVideoOutputConnection()
        }

        tearDownDepthOutputIfNeeded()

        if let currentVideoInput {
            session.removeInput(currentVideoInput)
        }

        guard session.canAddInput(input) else {
            if let currentVideoInput,
               session.canAddInput(currentVideoInput) {
                session.addInput(currentVideoInput)
                refreshDepthCapability(for: currentVideoInput.device)
                configureDepthOutputIfPossible(for: currentVideoInput.device)
            }
            throw CameraCaptureError.cameraUnavailable
        }

        session.addInput(input)
        currentVideoInput = input
        currentLensOption = option
        currentPosition = camera.position
        refreshDepthCapability(for: camera)
        configureDepthOutputIfPossible(for: camera)
    }

    private func resolvedFlashMode(isEnabled: Bool) -> AVCaptureDevice.FlashMode {
        guard isEnabled,
              isHardwareFlashAvailable,
              photoOutput.supportedFlashModes.contains(.on) else {
            return .off
        }

        return .on
    }

    private func refreshDepthCapability(for camera: AVCaptureDevice) {
        depthCapability = depthCapabilityProbe.capability(
            for: camera,
            photoOutput: photoOutput
        )
        frameSignalState.depthSignals = DepthSignals(capability: depthCapability)
    }

    private func preferredDefaultLensOption(for position: AVCaptureDevice.Position) -> LensOption? {
        let options = availableLensOptions(for: position)
        switch position {
        case .back:
            return options.first { $0.id == LensOption.classic35.id } ?? options.first
        case .front:
            return options.first { $0.id == LensOption.frontSelfie.id } ?? options.first
        case .unspecified:
            return nil
        @unknown default:
            return nil
        }
    }

    private func availableLensOptions(for position: AVCaptureDevice.Position) -> [LensOption] {
        switch position {
        case .front:
            return cameraDevice(for: .frontSelfie) == nil ? [] : [.frontSelfie]
        case .back:
            let options = LensOption.all.filter { cameraDevice(for: $0) != nil }
            return options.isEmpty && fallbackBackCameraDevice() != nil ? [.classic35] : options
        case .unspecified:
            return []
        @unknown default:
            return []
        }
    }

    private func cameraDevice(for option: LensOption) -> AVCaptureDevice? {
        switch option.id {
        case LensOption.wide24.id:
            return AVCaptureDevice.default(.builtInUltraWideCamera, for: .video, position: .back)
        case LensOption.classic35.id:
            return AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back)
                ?? fallbackBackCameraDevice()
        case LensOption.portrait77.id:
            return AVCaptureDevice.default(.builtInTelephotoCamera, for: .video, position: .back)
        case LensOption.frontSelfie.id:
            return frontCameraDevice()
        default:
            return nil
        }
    }

    private func fallbackBackCameraDevice() -> AVCaptureDevice? {
        AVCaptureDevice.DiscoverySession(
            deviceTypes: [
                .builtInWideAngleCamera,
                .builtInDualWideCamera,
                .builtInDualCamera,
                .builtInTripleCamera
            ],
            mediaType: .video,
            position: .back
        ).devices.first
    }

    private func frontCameraDevice() -> AVCaptureDevice? {
        AVCaptureDevice.DiscoverySession(
            deviceTypes: [
                .builtInTrueDepthCamera,
                .builtInWideAngleCamera
            ],
            mediaType: .video,
            position: .front
        ).devices.first
    }

    private func configureFrameSignalOutputIfPossible() {
        guard session.canAddOutput(videoOutput) else { return }

        let delegate = FrameSignalDelegate(
            videoOutput: videoOutput,
            depthDataOutput: depthDataOutput,
            state: frameSignalState,
            filteredPreviewState: filteredPreviewState,
            onAnalysis: { [weak self] analysis in
                self?.frameSignalHandler?(analysis)
            },
            onTrackingUpdate: { [weak self] update in
                self?.composeSubjectTrackingHandler?(update)
            }
        )

        frameSignalDelegate = delegate
        videoOutput.alwaysDiscardsLateVideoFrames = true
        videoOutput.videoSettings = [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
        ]
        videoOutput.setSampleBufferDelegate(delegate, queue: frameSignalQueue)
        session.addOutput(videoOutput)
        updateVideoOutputConnection()
    }

    private func configureDepthOutputIfPossible(for camera: AVCaptureDevice) {
        guard frameSignalState.isComposeDepthAnalysisEnabled,
              !session.outputs.contains(where: { $0 === depthDataOutput }),
              depthCapability.hardwareDepthAvailable,
              let frameSignalDelegate,
              let preferredFormat = preferredDepthFormat(for: camera),
              session.canAddOutput(depthDataOutput) else {
            videoOutput.setSampleBufferDelegate(frameSignalDelegate, queue: frameSignalQueue)
            return
        }

        do {
            try camera.lockForConfiguration()
            camera.activeDepthDataFormat = preferredFormat
            camera.unlockForConfiguration()
        } catch {
            videoOutput.setSampleBufferDelegate(frameSignalDelegate, queue: frameSignalQueue)
            return
        }

        depthDataOutput.isFilteringEnabled = true
        depthDataOutput.alwaysDiscardsLateDepthData = true
        session.addOutput(depthDataOutput)

        let synchronizer = AVCaptureDataOutputSynchronizer(
            dataOutputs: [videoOutput, depthDataOutput]
        )
        synchronizer.setDelegate(frameSignalDelegate, queue: frameSignalQueue)
        dataOutputSynchronizer = synchronizer
        updateVideoOutputConnection()
    }

    private func tearDownDepthOutputIfNeeded() {
        dataOutputSynchronizer?.setDelegate(nil, queue: nil)
        dataOutputSynchronizer = nil

        if session.outputs.contains(where: { $0 === depthDataOutput }) {
            session.removeOutput(depthDataOutput)
        }

        frameSignalState.depthPixelOrientation = .sensorNativeLandscape
        videoOutput.setSampleBufferDelegate(frameSignalDelegate, queue: frameSignalQueue)
    }

    private func preferredDepthFormat(
        for camera: AVCaptureDevice
    ) -> AVCaptureDevice.Format? {
        let availableFormats = camera.activeFormat.supportedDepthDataFormats
        let maximumPreferredPixelCount: Int32 = 640 * 480
        let boundedFormats = availableFormats.filter {
            let dimensions = CMVideoFormatDescriptionGetDimensions($0.formatDescription)
            return dimensions.width * dimensions.height <= maximumPreferredPixelCount
        }
        let candidates = boundedFormats.isEmpty ? availableFormats : boundedFormats

        return candidates.sorted { first, second in
            let firstSubtype = CMFormatDescriptionGetMediaSubType(first.formatDescription)
            let secondSubtype = CMFormatDescriptionGetMediaSubType(second.formatDescription)
            let firstIsFloat32 = firstSubtype == kCVPixelFormatType_DepthFloat32
            let secondIsFloat32 = secondSubtype == kCVPixelFormatType_DepthFloat32
            if firstIsFloat32 != secondIsFloat32 {
                return firstIsFloat32
            }

            let firstDimensions = CMVideoFormatDescriptionGetDimensions(first.formatDescription)
            let secondDimensions = CMVideoFormatDescriptionGetDimensions(second.formatDescription)
            return firstDimensions.width * firstDimensions.height
                > secondDimensions.width * secondDimensions.height
        }.first
    }

    private func updateVideoOutputConnection() {
        let portraitRotationAngle = CameraFrameOrientationContract.portraitRotationAngleDegrees
        if let connection = videoOutput.connection(with: .video) {
            let didApplyPortraitRotation = connection.isVideoRotationAngleSupported(portraitRotationAngle)
            if didApplyPortraitRotation {
                connection.videoRotationAngle = portraitRotationAngle
            }
            frameSignalState.pixelOrientation = CameraFrameOrientationContract.pixelOrientation(
                didApplyPortraitRotation: didApplyPortraitRotation
            )

            if connection.isVideoMirroringSupported {
                connection.automaticallyAdjustsVideoMirroring = false
                connection.isVideoMirrored = false
            }
        }

        if let depthConnection = depthDataOutput.connection(with: .depthData) {
            let didApplyDepthPortraitRotation = depthConnection.isVideoRotationAngleSupported(
                portraitRotationAngle
            )
            if didApplyDepthPortraitRotation {
                depthConnection.videoRotationAngle = portraitRotationAngle
            }
            frameSignalState.depthPixelOrientation = CameraFrameOrientationContract.pixelOrientation(
                didApplyPortraitRotation: didApplyDepthPortraitRotation
            )

            if depthConnection.isVideoMirroringSupported {
                depthConnection.automaticallyAdjustsVideoMirroring = false
                depthConnection.isVideoMirrored = false
            }
        }
    }
}

private final class PhotoCaptureDelegate: NSObject, AVCapturePhotoCaptureDelegate {
    let id: UUID

    private let completion: @MainActor (Result<Data, Error>) -> Void

    init(id: UUID, completion: @MainActor @escaping (Result<Data, Error>) -> Void) {
        self.id = id
        self.completion = completion
    }

    nonisolated func photoOutput(
        _ output: AVCapturePhotoOutput,
        didFinishProcessingPhoto photo: AVCapturePhoto,
        error: Error?
    ) {
        if let error {
            Task { @MainActor in
                completion(.failure(error))
            }
            return
        }

        guard let data = photo.fileDataRepresentation() else {
            Task { @MainActor in
                completion(.failure(CameraCaptureError.imageDataUnavailable))
            }
            return
        }

        Task { @MainActor in
            completion(.success(data))
        }
    }
}

private final class FrameSignalState: @unchecked Sendable {
    private let lock = NSLock()
    nonisolated(unsafe) private var _isEnabled = false
    nonisolated(unsafe) private var _isComposeHorizonAnalysisEnabled = false
    nonisolated(unsafe) private var _isComposeStructureAnalysisEnabled = false
    nonisolated(unsafe) private var _isComposeDepthAnalysisEnabled = false
    nonisolated(unsafe) private var _depthSignals = DepthSignals.unavailable
    nonisolated(unsafe) private var _pixelOrientation = CameraFramePixelOrientation.sensorNativeLandscape
    nonisolated(unsafe) private var _depthPixelOrientation = CameraFramePixelOrientation.sensorNativeLandscape
    nonisolated(unsafe) private var _composeSubjectTrackingSeed: LocalAIComposeVisionTrackingSeed?

    nonisolated var isEnabled: Bool {
        get {
            lock.withLock { _isEnabled }
        }
        set {
            lock.withLock {
                _isEnabled = newValue
            }
        }
    }

    nonisolated var depthSignals: DepthSignals {
        get {
            lock.withLock { _depthSignals }
        }
        set {
            lock.withLock {
                _depthSignals = newValue
            }
        }
    }

    nonisolated var isComposeHorizonAnalysisEnabled: Bool {
        get {
            lock.withLock { _isComposeHorizonAnalysisEnabled }
        }
        set {
            lock.withLock {
                _isComposeHorizonAnalysisEnabled = newValue
            }
        }
    }

    nonisolated var isComposeStructureAnalysisEnabled: Bool {
        get {
            lock.withLock { _isComposeStructureAnalysisEnabled }
        }
        set {
            lock.withLock {
                _isComposeStructureAnalysisEnabled = newValue
            }
        }
    }

    nonisolated var isComposeDepthAnalysisEnabled: Bool {
        get {
            lock.withLock { _isComposeDepthAnalysisEnabled }
        }
        set {
            lock.withLock {
                _isComposeDepthAnalysisEnabled = newValue
            }
        }
    }

    nonisolated var pixelOrientation: CameraFramePixelOrientation {
        get {
            lock.withLock { _pixelOrientation }
        }
        set {
            lock.withLock {
                _pixelOrientation = newValue
            }
        }
    }

    nonisolated var depthPixelOrientation: CameraFramePixelOrientation {
        get {
            lock.withLock { _depthPixelOrientation }
        }
        set {
            lock.withLock {
                _depthPixelOrientation = newValue
            }
        }
    }

    nonisolated var composeSubjectTrackingSeed: LocalAIComposeVisionTrackingSeed? {
        get {
            lock.withLock { _composeSubjectTrackingSeed }
        }
        set {
            lock.withLock {
                _composeSubjectTrackingSeed = newValue
            }
        }
    }

}

private final class FilteredPreviewFrameState: @unchecked Sendable {
    private let lock = NSLock()
    nonisolated(unsafe) private var _frameHandler: ((CVPixelBuffer) -> Void)?

    nonisolated var frameHandler: ((CVPixelBuffer) -> Void)? {
        get {
            lock.withLock { _frameHandler }
        }
        set {
            lock.withLock {
                _frameHandler = newValue
            }
        }
    }

    nonisolated func handle(pixelBuffer: CVPixelBuffer) {
        frameHandler?(pixelBuffer)
    }
}

private final class FrameSignalDelegate: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate, AVCaptureDataOutputSynchronizerDelegate, @unchecked Sendable {
    private let brightnessAnalyzer = LiveGuidanceBrightnessAnalyzer()
    private let lumaStructureAnalyzer = LiveGuidanceLumaStructureAnalyzer()
    private let lumaConvergenceAnalyzer = LiveGuidanceLumaConvergenceAnalyzer()
    private let geometryAnalyzer = LiveGuidanceVisionGeometryAnalyzer()
    private let depthAnalyzer = LiveGuidanceDepthAnalyzer()
    private let composeSubjectTracker = LocalAIComposeVisionSequenceTracker()
    private let workloadController = LocalCameraAIWorkloadController()
    private weak var videoOutput: AVCaptureVideoDataOutput?
    private weak var depthDataOutput: AVCaptureDepthDataOutput?
    private let state: FrameSignalState
    private let filteredPreviewState: FilteredPreviewFrameState
    private let onAnalysis: @MainActor @Sendable (LiveGuidanceFrameAnalysis) -> Void
    private let onTrackingUpdate: @MainActor @Sendable (LocalAIComposeVisionTrackingUpdate) -> Void
    nonisolated(unsafe) private var lastAnalysisDate = Date.distantPast
    nonisolated(unsafe) private var lastTrackingDate = Date.distantPast
    nonisolated(unsafe) private var workloadState = LocalCameraAIWorkloadState.initial

    init(
        videoOutput: AVCaptureVideoDataOutput,
        depthDataOutput: AVCaptureDepthDataOutput,
        state: FrameSignalState,
        filteredPreviewState: FilteredPreviewFrameState,
        onAnalysis: @escaping @MainActor @Sendable (LiveGuidanceFrameAnalysis) -> Void,
        onTrackingUpdate: @escaping @MainActor @Sendable (LocalAIComposeVisionTrackingUpdate) -> Void
    ) {
        self.videoOutput = videoOutput
        self.depthDataOutput = depthDataOutput
        self.state = state
        self.filteredPreviewState = filteredPreviewState
        self.onAnalysis = onAnalysis
        self.onTrackingUpdate = onTrackingUpdate
    }

    nonisolated func captureOutput(
        _ output: AVCaptureOutput,
        didOutput sampleBuffer: CMSampleBuffer,
        from connection: AVCaptureConnection
    ) {
        handle(sampleBuffer: sampleBuffer, depthData: nil)
    }

    nonisolated func dataOutputSynchronizer(
        _ synchronizer: AVCaptureDataOutputSynchronizer,
        didOutput synchronizedDataCollection: AVCaptureSynchronizedDataCollection
    ) {
        guard let videoOutput,
              let synchronizedVideoData = synchronizedDataCollection.synchronizedData(
                for: videoOutput
              ) as? AVCaptureSynchronizedSampleBufferData,
              !synchronizedVideoData.sampleBufferWasDropped else {
            return
        }

        let synchronizedDepthData = depthDataOutput.flatMap {
            synchronizedDataCollection.synchronizedData(for: $0)
                as? AVCaptureSynchronizedDepthData
        }
        let depthData = synchronizedDepthData?.depthDataWasDropped == false
            ? synchronizedDepthData?.depthData
            : nil
        handle(
            sampleBuffer: synchronizedVideoData.sampleBuffer,
            depthData: depthData
        )
    }

    private nonisolated func handle(
        sampleBuffer: CMSampleBuffer,
        depthData: AVDepthData?
    ) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        filteredPreviewState.handle(pixelBuffer: pixelBuffer)

        guard state.isEnabled else { return }
        let now = Date()
        let previousWorkloadMode = workloadState.mode
        workloadState = workloadController.update(
            state: workloadState,
            thermalState: ProcessInfo.processInfo.thermalState,
            isLowPowerModeEnabled: ProcessInfo.processInfo.isLowPowerModeEnabled,
            now: now
        )
        let workloadProfile = workloadController.profile(for: workloadState.mode)
        let didChangeWorkloadMode = workloadState.mode != previousWorkloadMode
        if didChangeWorkloadMode {
            lastAnalysisDate = .distantPast
            lastTrackingDate = .distantPast
            if !workloadProfile.runsLockedSubjectTracking {
                composeSubjectTracker.reset()
            }
        }

        guard workloadProfile.runsVisionAnalysis else {
            guard didChangeWorkloadMode
                    || now.timeIntervalSince(lastAnalysisDate)
                        >= workloadProfile.fullAnalysisInterval else {
                return
            }
            lastAnalysisDate = now
            let analysis = LiveGuidanceFrameAnalysis(
                guidanceSignals: [],
                liveFrameSignals: nil,
                subjectCandidates: [],
                sceneHorizonSignal: nil,
                sceneStructureSignal: nil,
                workloadMode: .thermallyPaused,
                depthOcclusionMask: nil
            )
            Task { @MainActor in
                onAnalysis(analysis)
            }
            return
        }

        let trackingSeed = state.composeSubjectTrackingSeed
        if let trackingSeed,
           workloadProfile.runsLockedSubjectTracking {
            if now.timeIntervalSince(lastTrackingDate)
                >= workloadProfile.lockedSubjectTrackingInterval {
                lastTrackingDate = now
                let update = composeSubjectTracker.update(
                    seed: trackingSeed,
                    pixelBuffer: pixelBuffer,
                    orientation: state.pixelOrientation.imagePropertyOrientation
                )
                if let update {
                    Task { @MainActor in
                        onTrackingUpdate(update)
                    }
                }
            }
        } else if composeSubjectTracker.isActive {
            composeSubjectTracker.reset()
            lastTrackingDate = .distantPast
        }

        guard now.timeIntervalSince(lastAnalysisDate)
                >= workloadProfile.fullAnalysisInterval else {
            return
        }
        lastAnalysisDate = now

        let brightnessSignals = brightnessAnalyzer.signals(from: pixelBuffer)
        let includeSceneHorizon = state.isComposeHorizonAnalysisEnabled
        let pixelOrientation = state.pixelOrientation
        let sceneStructureSignal: LiveFrameSceneStructureSignal?
        if state.isComposeStructureAnalysisEnabled {
            let symmetrySignal = lumaStructureAnalyzer.signal(
                from: pixelBuffer,
                pixelOrientation: pixelOrientation
            )
            let lumaCompositionAnalysis = lumaConvergenceAnalyzer.analysis(
                from: pixelBuffer,
                pixelOrientation: pixelOrientation
            )
            sceneStructureSignal = LiveFrameSceneStructureSignal(
                symmetryEvidence: symmetrySignal.symmetryEvidence,
                leadingLineSignal: lumaCompositionAnalysis.leadingLineSignal,
                quietSpaceSignal: lumaCompositionAnalysis.quietSpaceSignal
            )
        } else {
            sceneStructureSignal = nil
        }
        let baseGeometryAnalysis = geometryAnalyzer.analysis(
            from: pixelBuffer,
            depthSignals: state.depthSignals,
            includeSceneHorizon: includeSceneHorizon,
            pixelOrientation: pixelOrientation
        )
        let depthAnalysis: LiveGuidanceDepthAnalysis
        if state.isComposeDepthAnalysisEnabled,
           let depthData,
           let subjectBox = baseGeometryAnalysis.liveFrameSignals?
            .geometry.subjectBoxNormalized {
            depthAnalysis = depthAnalyzer.analysis(
                from: depthData,
                subjectBox: subjectBox,
                depthPixelOrientation: state.depthPixelOrientation,
                fallback: state.depthSignals
            )
        } else {
            depthAnalysis = .fallback(state.depthSignals)
        }
        let geometryAnalysis = baseGeometryAnalysis.applyingDepthSignals(
            depthAnalysis.signals
        )
        let signals = combinedSignals(
            geometrySignals: geometryAnalysis.signals,
            brightnessSignals: brightnessSignals
        )
        guard !signals.isEmpty
                || geometryAnalysis.liveFrameSignals != nil
                || includeSceneHorizon
                || sceneStructureSignal != nil else {
            return
        }

        let analysis = LiveGuidanceFrameAnalysis(
            guidanceSignals: signals,
            liveFrameSignals: geometryAnalysis.liveFrameSignals,
            subjectCandidates: geometryAnalysis.subjectCandidates,
            sceneHorizonSignal: geometryAnalysis.sceneHorizonSignal,
            sceneStructureSignal: sceneStructureSignal,
            workloadMode: workloadProfile.mode,
            depthOcclusionMask: depthAnalysis.occlusionMask
        )

        Task { @MainActor in
            onAnalysis(analysis)
        }
    }

    nonisolated func resetComposeSubjectTracking() {
        composeSubjectTracker.reset()
        lastTrackingDate = .distantPast
    }

    private nonisolated func combinedSignals(
        geometrySignals: [LiveGuidanceSignal],
        brightnessSignals: [LiveGuidanceSignal]
    ) -> [LiveGuidanceSignal] {
        let hasLightingWarning = brightnessSignals.contains(.tooDark) || brightnessSignals.contains(.tooBright)
        let orderedSignals = hasLightingWarning
            ? brightnessSignals + geometrySignals
            : geometrySignals + brightnessSignals

        return orderedSignals.reduce(into: []) { result, signal in
            guard !result.contains(signal) else { return }
            result.append(signal)
        }
    }
}
