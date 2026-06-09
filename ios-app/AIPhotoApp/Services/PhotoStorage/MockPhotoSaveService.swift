import Foundation

final class MockPhotoSaveService: PhotoSaveService {
    enum Mode {
        case success
        case failure
    }

    private let mode: Mode

    init(mode: Mode = .success) {
        self.mode = mode
    }

    func savePhoto(_ request: PhotoSaveRequest) async throws -> SavedPhoto {
        try await Task.sleep(for: .milliseconds(300))

        if mode == .failure {
            throw PhotoSaveError.mockFailure
        }

        let photoId = "mock-\(UUID().uuidString.lowercased())"
        let previewPath = PhotoStoragePath.previewPath(ownerId: request.ownerId, photoId: photoId)
        let thumbnailPath = PhotoStoragePath.thumbnailPath(ownerId: request.ownerId, photoId: photoId)

        return SavedPhoto(
            id: photoId,
            ownerId: request.ownerId,
            source: request.source.metadataValue,
            filterPresetId: request.filterPresetId,
            storagePath: previewPath,
            thumbnailPath: thumbnailPath,
            originalPath: nil,
            analysisStatus: "not_started",
            status: "saved_mock",
            createdAt: request.createdAt,
            updatedAt: Date(),
            isMock: true
        )
    }
}
