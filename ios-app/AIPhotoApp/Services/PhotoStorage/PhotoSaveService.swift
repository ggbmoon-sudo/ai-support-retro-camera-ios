import Foundation
import UIKit

struct PhotoSaveRequest {
    let ownerId: String
    let source: CapturedPhoto.Source
    let sourceImage: UIImage
    let filteredPreviewImage: UIImage?
    let filterPresetId: String
    let createdAt: Date
}

protocol PhotoSaveService {
    func savePhoto(_ request: PhotoSaveRequest) async throws -> SavedPhoto
}

enum PhotoSaveError: LocalizedError {
    case mockFailure
    case firebaseNotConfigured

    var errorDescription: String? {
        switch self {
        case .mockFailure:
            return NSLocalizedString("save.error.mock_failure", comment: "")
        case .firebaseNotConfigured:
            return NSLocalizedString("save.error.firebase_not_configured", comment: "")
        }
    }
}

extension CapturedPhoto.Source {
    var metadataValue: String {
        switch self {
        case .camera:
            return "camera"
        case .photoLibrary:
            return "photoLibrary"
        }
    }
}
