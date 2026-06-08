import AVFoundation
import Combine
import PhotosUI
import SwiftUI
import UIKit

@MainActor
final class CameraViewModel: ObservableObject {
    @Published private(set) var permissionState: CameraPermissionState
    @Published private(set) var selectedPhoto: CapturedPhoto?
    @Published private(set) var errorMessage: String?
    @Published private(set) var isLoading = false
    @Published var pickerItem: PhotosPickerItem?

    let service: CameraCaptureService

    init(service: CameraCaptureService) {
        self.service = service
        self.permissionState = CameraPermissionState(
            authorizationStatus: AVCaptureDevice.authorizationStatus(for: .video)
        )
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
                self.selectedPhoto = CapturedPhoto(image: image, source: .camera)
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
            selectedPhoto = CapturedPhoto(image: image, source: .photoLibrary)
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func resetSelection() {
        selectedPhoto = nil
        pickerItem = nil
        errorMessage = nil
    }

    func stopCamera() {
        service.stopSession()
    }

    private func configureAndStart() {
        do {
            try service.configureSessionIfNeeded()
            service.startSession()
            permissionState = .authorized
        } catch {
            permissionState = .unavailable
            errorMessage = error.localizedDescription
        }
    }
}
