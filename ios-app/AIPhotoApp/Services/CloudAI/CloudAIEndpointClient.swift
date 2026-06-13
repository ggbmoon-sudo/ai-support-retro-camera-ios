import Foundation

struct CloudAIEndpointClient: Sendable {
    let baseURL: URL
    let timeoutSeconds: TimeInterval

    init(
        baseURL: URL = URL(string: "http://127.0.0.1:8787")!,
        timeoutSeconds: TimeInterval = 35
    ) {
        self.baseURL = baseURL
        self.timeoutSeconds = timeoutSeconds
    }

    func postPhotoAdvisor(_ request: CloudAIPhotoAdvisorRequest) async throws -> CloudAIResponse {
        #if DEBUG
        var urlRequest = Foundation.URLRequest(url: baseURL.appending(path: "v1/ai/photo-advisor"))
        urlRequest.httpMethod = "POST"
        urlRequest.timeoutInterval = timeoutSeconds
        urlRequest.setValue("application/json", forHTTPHeaderField: "content-type")
        urlRequest.setValue("application/json", forHTTPHeaderField: "accept")
        urlRequest.setValue("true", forHTTPHeaderField: "X-Internal-Debug-CloudAI")
        urlRequest.httpBody = try JSONEncoder().encode(request)

        let (data, response) = try await Foundation.URLSession.shared.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw CloudAIServiceError.remoteUnavailable
        }

        guard (200..<300).contains(httpResponse.statusCode) else {
            throw CloudAIServiceError.remoteHTTPStatus(httpResponse.statusCode)
        }

        return try JSONDecoder().decode(CloudAIResponse.self, from: data)
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }
}
