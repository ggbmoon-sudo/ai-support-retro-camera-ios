import Foundation

nonisolated enum PhotoSaveState: Equatable, Sendable {
    case idle
    case saving
    case saved(SavedPhoto)
    case failed(String)

    var isSaving: Bool {
        if case .saving = self {
            return true
        }
        return false
    }
}
