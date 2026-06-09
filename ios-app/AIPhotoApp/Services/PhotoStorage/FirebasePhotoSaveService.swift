import Foundation

final class FirebasePhotoSaveService: PhotoSaveService {
    func savePhoto(_ request: PhotoSaveRequest) async throws -> SavedPhoto {
        // TODO: Phase 05 keeps this adapter as a placeholder only.
        // Real Firebase Storage / Firestore writes require Firebase SDK setup,
        // GoogleService-Info.plist handled outside git, App Check, Auth ownership,
        // security rules, and an explicit user request in a later task.
        throw PhotoSaveError.firebaseNotConfigured
    }
}
