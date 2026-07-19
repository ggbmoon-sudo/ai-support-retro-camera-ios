import Photos
import UIKit

enum FilterLabPhotoLibrarySaveError: Error {
    case accessDenied
    case saveFailed
}

struct FilterLabPhotoLibrarySaver {
    func save(_ image: UIImage) async throws {
        let authorizationStatus = await requestAddOnlyAuthorizationIfNeeded()
        guard authorizationStatus == .authorized || authorizationStatus == .limited else {
            throw FilterLabPhotoLibrarySaveError.accessDenied
        }

        try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
            PHPhotoLibrary.shared().performChanges {
                PHAssetChangeRequest.creationRequestForAsset(from: image)
            } completionHandler: { didSave, error in
                if didSave {
                    continuation.resume()
                } else {
                    continuation.resume(throwing: error ?? FilterLabPhotoLibrarySaveError.saveFailed)
                }
            }
        }
    }

    private func requestAddOnlyAuthorizationIfNeeded() async -> PHAuthorizationStatus {
        let currentStatus = PHPhotoLibrary.authorizationStatus(for: .addOnly)
        guard currentStatus == .notDetermined else {
            return currentStatus
        }

        return await withCheckedContinuation { continuation in
            PHPhotoLibrary.requestAuthorization(for: .addOnly) { status in
                continuation.resume(returning: status)
            }
        }
    }
}
