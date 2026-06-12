import Foundation

struct RemoteCloudAIService: CloudAIService {
    private let mode: CloudAIBackendMode
    private let mockFallback: MockCloudAIService
    private let endpointClient: CloudAIEndpointClient
    private let validator: CloudAIResponseValidator

    init(
        mode: CloudAIBackendMode = .remoteDisabled,
        mockFallback: MockCloudAIService = MockCloudAIService(),
        endpointClient: CloudAIEndpointClient = CloudAIEndpointClient(),
        validator: CloudAIResponseValidator = CloudAIResponseValidator()
    ) {
        self.mode = mode
        self.mockFallback = mockFallback
        self.endpointClient = endpointClient
        self.validator = validator
    }

    func analyzePhotoAdvisor(_ input: CloudAIPhotoAdvisorInput) async throws -> CloudAIResponse {
        guard input.consent.imageUploadAccepted else {
            throw CloudAIServiceError.consentRequired
        }

        switch mode {
        case .mockOnly, .remoteWithMockFallback:
            return try await mockFallback.analyzePhotoAdvisor(input)
        case .remoteDisabled:
            throw CloudAIServiceError.remoteDisabled
        case .debugRemoteMock:
            guard mode.allowsNetworkRequests else {
                throw CloudAIServiceError.remoteDisabled
            }

            let request = CloudAIPhotoAdvisorRequest(input: input)
            let response = try await endpointClient.postPhotoAdvisor(request)

            switch validator.validate(response) {
            case .valid(let validResponse):
                return validResponse
            case .invalid(let issues, _):
                throw CloudAIServiceError.invalidResponse(issues.map(\.description))
            }
        }
    }
}
