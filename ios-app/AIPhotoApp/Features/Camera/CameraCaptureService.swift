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
    private var frameSignalDelegate: FrameSignalDelegate?
    private var frameSignalHandler: (@MainActor @Sendable ([LiveGuidanceSignal]) -> Void)?
    private(set) var depthCapability: CameraDepthCapability = .unavailable
    private var isConfigured = false
    private var delegates: [PhotoCaptureDelegate] = []

    func setFrameSignalHandler(_ handler: (@MainActor @Sendable ([LiveGuidanceSignal]) -> Void)?) {
        frameSignalHandler = handler
    }

    func setFrameSignalAnalysisEnabled(_ isEnabled: Bool) {
        frameSignalState.isEnabled = isEnabled
    }

    func configureSessionIfNeeded() throws {
        guard !isConfigured else { return }

        guard let camera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
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
        session.addOutput(photoOutput)
        depthCapability = depthCapabilityProbe.capability(
            for: camera,
            photoOutput: photoOutput
        )
        frameSignalState.depthSignals = DepthSignals(capability: depthCapability)

        configureFrameSignalOutputIfPossible()
        session.commitConfiguration()
        isConfigured = true
    }

    func startSession() {
        guard isConfigured, !session.isRunning else { return }
        session.startRunning()
    }

    func stopSession() {
        guard session.isRunning else { return }
        session.stopRunning()
    }

    func capturePhoto(completion: @MainActor @escaping (Result<Data, Error>) -> Void) {
        guard isConfigured else {
            completion(.failure(CameraCaptureError.cameraUnavailable))
            return
        }

        let settings = AVCapturePhotoSettings()
        let delegateID = UUID()
        let delegate = PhotoCaptureDelegate(id: delegateID) { [weak self] result in
            completion(result)
            self?.delegates.removeAll { $0.id == delegateID }
        }

        delegates.append(delegate)
        photoOutput.capturePhoto(with: settings, delegate: delegate)
    }

    private func configureFrameSignalOutputIfPossible() {
        guard session.canAddOutput(videoOutput) else { return }

        let delegate = FrameSignalDelegate(state: frameSignalState) { [weak self] signals in
            self?.frameSignalHandler?(signals)
        }

        frameSignalDelegate = delegate
        videoOutput.alwaysDiscardsLateVideoFrames = true
        videoOutput.videoSettings = [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarFullRange
        ]
        videoOutput.setSampleBufferDelegate(delegate, queue: frameSignalQueue)
        session.addOutput(videoOutput)
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

private final class FrameSignalDelegate: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private let minimumAnalysisInterval: TimeInterval = 0.5
    private let brightnessAnalyzer = LiveGuidanceBrightnessAnalyzer()
    private let geometryAnalyzer = LiveGuidanceVisionGeometryAnalyzer()
    private let state: FrameSignalState
    private let onSignals: @MainActor @Sendable ([LiveGuidanceSignal]) -> Void
    nonisolated(unsafe) private var lastAnalysisDate = Date.distantPast

    init(
        state: FrameSignalState,
        onSignals: @escaping @MainActor @Sendable ([LiveGuidanceSignal]) -> Void
    ) {
        self.state = state
        self.onSignals = onSignals
    }

    nonisolated func captureOutput(
        _ output: AVCaptureOutput,
        didOutput sampleBuffer: CMSampleBuffer,
        from connection: AVCaptureConnection
    ) {
        guard state.isEnabled else { return }

        let now = Date()
        guard now.timeIntervalSince(lastAnalysisDate) >= minimumAnalysisInterval else { return }
        lastAnalysisDate = now

        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
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
