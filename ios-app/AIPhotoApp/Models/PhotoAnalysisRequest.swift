import Foundation

nonisolated struct PhotoAnalysisRequest: Identifiable, Hashable, Sendable {
    let id: String
    let photoId: String
    let ownerId: String
    let storagePath: String?
    let filterPresetId: String?
    let language: String
    let trainingConsent: Bool
    let isMock: Bool
    let createdAt: Date

    init(
        id: String = UUID().uuidString,
        photoId: String,
        ownerId: String,
        storagePath: String? = nil,
        filterPresetId: String? = nil,
        language: String = Locale.preferredLanguages.first ?? "en",
        trainingConsent: Bool = false,
        isMock: Bool = true,
        createdAt: Date = Date()
    ) {
        self.id = id
        self.photoId = photoId
        self.ownerId = ownerId
        self.storagePath = storagePath
        self.filterPresetId = filterPresetId
        self.language = language
        self.trainingConsent = trainingConsent
        self.isMock = isMock
        self.createdAt = createdAt
    }
}
