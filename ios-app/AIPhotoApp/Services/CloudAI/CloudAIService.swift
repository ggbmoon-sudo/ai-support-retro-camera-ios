import Foundation

protocol CloudAIService {
    func analyzePhotoAdvisor(_ input: CloudAIPhotoAdvisorInput) async throws -> CloudAIResponse
    func generateFilterLab(_ input: CloudAIFilterLabInput) async throws -> CloudAIResponse
}
