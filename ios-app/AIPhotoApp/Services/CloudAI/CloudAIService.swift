import Foundation

protocol CloudAIService {
    func analyzePhotoAdvisor(_ input: CloudAIPhotoAdvisorInput) async throws -> CloudAIResponse
}
