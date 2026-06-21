import AVFoundation
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
    let session = AVCaptureSession()

    private let photoOutput = AVCapturePhotoOutput()
    private let videoOutput = AVCaptureVideoDataOutput()
    private let depthCapabilityProbe = CameraDepthCapabilityProbe()
    private let frameSignalQueue = DispatchQueue(label: "ai.photo.camera.frame-signal", qos: .utility)
    private let frameSignalState = FrameSignalState()
    nonisolated(unsafe) private let filteredPreviewState = FilteredPreviewFrameState()
    private var frameSignalDelegate: FrameSignalDelegate?
    private var frameSignalHandler: (@MainActor @Sendable ([LiveGuidanceSignal]) -> Void)?
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

    func setFrameSignalHandler(_ handler: (@MainActor @Sendable ([LiveGuidanceSignal]) -> Void)?) {
        frameSignalHandler = handler
    }

    func setFrameSignalAnalysisEnabled(_ isEnabled: Bool) {
        frameSignalState.isEnabled = isEnabled
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
        guard isConfigured, !session.isRunning else { return }
        session.startRunning()
    }

    func stopSession() {
        guard session.isRunning else { return }
        session.stopRunning()
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

        if let currentVideoInput {
            session.removeInput(currentVideoInput)
        }

        guard session.canAddInput(input) else {
            if let currentVideoInput,
               session.canAddInput(currentVideoInput) {
                session.addInput(currentVideoInput)
            }
            throw CameraCaptureError.cameraUnavailable
        }

        session.addInput(input)
        currentVideoInput = input
        currentLensOption = option
        currentPosition = camera.position
        refreshDepthCapability(for: camera)
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
            state: frameSignalState,
            filteredPreviewState: filteredPreviewState
        ) { [weak self] signals in
            self?.frameSignalHandler?(signals)
        }

        frameSignalDelegate = delegate
        videoOutput.alwaysDiscardsLateVideoFrames = true
        videoOutput.videoSettings = [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
        ]
        videoOutput.setSampleBufferDelegate(delegate, queue: frameSignalQueue)
        session.addOutput(videoOutput)
        updateVideoOutputConnection()
    }

    private func updateVideoOutputConnection() {
        guard let connection = videoOutput.connection(with: .video) else { return }

        if connection.isVideoRotationAngleSupported(90) {
            connection.videoRotationAngle = 90
        }

        if connection.isVideoMirroringSupported {
            connection.automaticallyAdjustsVideoMirroring = false
            connection.isVideoMirrored = false
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
    nonisolated(unsafe) private var _depthSignals = DepthSignals.unavailable

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

private final class FrameSignalDelegate: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let minimumAnalysisInterval: TimeInterval = 0.5
    private let brightnessAnalyzer = LiveGuidanceBrightnessAnalyzer()
    private let geometryAnalyzer = LiveGuidanceVisionGeometryAnalyzer()
    private let state: FrameSignalState
    private let filteredPreviewState: FilteredPreviewFrameState
    private let onSignals: @MainActor @Sendable ([LiveGuidanceSignal]) -> Void
    nonisolated(unsafe) private var lastAnalysisDate = Date.distantPast

    init(
        state: FrameSignalState,
        filteredPreviewState: FilteredPreviewFrameState,
        onSignals: @escaping @MainActor @Sendable ([LiveGuidanceSignal]) -> Void
    ) {
        self.state = state
        self.filteredPreviewState = filteredPreviewState
        self.onSignals = onSignals
    }

    nonisolated func captureOutput(
        _ output: AVCaptureOutput,
        didOutput sampleBuffer: CMSampleBuffer,
        from connection: AVCaptureConnection
    ) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        filteredPreviewState.handle(pixelBuffer: pixelBuffer)

        guard state.isEnabled else { return }
        let now = Date()
        guard now.timeIntervalSince(lastAnalysisDate) >= minimumAnalysisInterval else { return }
        lastAnalysisDate = now

        let brightnessSignals = brightnessAnalyzer.signals(from: pixelBuffer)
        let geometrySignals = geometryAnalyzer.signals(
            from: pixelBuffer,
            depthSignals: state.depthSignals
        )
        let signals = combinedSignals(geometrySignals: geometrySignals, brightnessSignals: brightnessSignals)
        guard !signals.isEmpty else { return }

        Task { @MainActor in
            onSignals(signals)
        }
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
