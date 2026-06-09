import Foundation

nonisolated struct SavedPhoto: Identifiable, Hashable, Sendable {
    let id: String
    let ownerId: String
    let source: String
    let filterPresetId: String
    let storagePath: String
    let thumbnailPath: String?
    let originalPath: String?
    let analysisStatus: String
    let status: String
    let createdAt: Date
    let updatedAt: Date
    let isMock: Bool

    var firestoreDocumentPath: String {
        PhotoStoragePath.firestoreDocumentPath(ownerId: ownerId, photoId: id)
    }

    var firestoreDocumentDraft: [String: String] {
        [
            "photoId": id,
            "ownerId": ownerId,
            "source": source,
            "filterPresetId": filterPresetId,
            "storagePath": storagePath,
            "thumbnailPath": thumbnailPath ?? "",
            "originalPath": originalPath ?? "",
            "analysisStatus": analysisStatus,
            "status": status
        ]
    }
}
