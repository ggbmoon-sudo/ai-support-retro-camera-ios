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
    private var isConfigured = false
    private var delegates: [PhotoCaptureDelegate] = []

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
