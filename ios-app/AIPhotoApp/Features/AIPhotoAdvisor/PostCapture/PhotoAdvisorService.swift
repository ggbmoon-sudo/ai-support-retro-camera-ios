import Foundation

protocol PhotoAdvisorService {
    func analyzePhoto(_ input: PhotoAdvisorInput) async throws -> PhotoAdvisorResult
}
