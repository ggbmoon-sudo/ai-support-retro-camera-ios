import Foundation

struct RemoteCloudAIService: CloudAIService {
    private let mode: CloudAIBackendMode
    private let mockFallback: MockCloudAIService

    init(
        mode: CloudAIBackendMode = .remoteDisabled,
        mockFallback: MockCloudAIService = MockCloudAIService()
    ) {
        self.mode = mode
        self.mockFallback = mockFallback
    }

    func analyzePhotoAdvisor(_ input: CloudAIPhotoAdvisorInput) async throws -> CloudAIResponse {
        switch mode {
        case .mockOnly, .remoteWithMockFallback:
            return try await mockFallback.analyzePhotoAdvisor(input)
        case .remoteDisabled:
            throw CloudAIServiceError.remoteDisabled
        }
    }
}
