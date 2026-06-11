import UIKit

protocol FilterGenerationService {
    func generateFilter(from referenceImage: UIImage) async throws -> GeneratedFilterRecipe
}

enum FilterGenerationError: LocalizedError {
    case unavailable
    case failed

    var errorDescription: String? {
        switch self {
        case .unavailable:
            return NSLocalizedString("filter_lab.error.unavailable", comment: "")
        case .failed:
            return NSLocalizedString("filter_lab.error.failed", comment: "")
        }
    }
}
