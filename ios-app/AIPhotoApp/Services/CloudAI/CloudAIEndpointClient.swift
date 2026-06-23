import Foundation

struct CloudAIEndpointClient: Sendable {
    let baseURL: URL
    let timeoutSeconds: TimeInterval

    init(
        baseURL: URL = CloudAIEndpointClient.defaultBaseURL,
        timeoutSeconds: TimeInterval = 35
    ) {
        self.baseURL = baseURL
        self.timeoutSeconds = timeoutSeconds
    }

    func postPhotoAdvisor(_ request: CloudAIPhotoAdvisorRequest) async throws -> CloudAIResponse {
        #if DEBUG
        return try await post(request, path: "v1/ai/photo-advisor")
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }

    func postFilterLab(_ request: CloudAIFilterLabRequest) async throws -> CloudAIResponse {
        #if DEBUG
        return try await post(request, path: "v1/ai/filter-lab")
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }

    #if DEBUG
    private func post<Request: Encodable>(_ request: Request, path: String) async throws -> CloudAIResponse {
        var urlRequest = Foundation.URLRequest(url: baseURL.appending(path: path))
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
    }
    #endif
}

private extension CloudAIEndpointClient {
    static var defaultBaseURL: URL {
        #if DEBUG
        let configuredURLs = [
            UserDefaults.standard.string(forKey: "AIPhotoCloudAIBaseURL"),
            ProcessInfo.processInfo.environment["AI_PHOTO_CLOUD_AI_BASE_URL"]
        ].compactMap { $0 }

        for configuredURL in configuredURLs {
            if let url = URL(string: configuredURL),
               url.scheme == "http" || url.scheme == "https",
               url.host != nil {
                return url
            }
        }
        #endif

        return URL(string: "http://127.0.0.1:8787")!
    }
}
