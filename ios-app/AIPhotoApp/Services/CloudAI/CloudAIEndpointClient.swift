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
        return try await post(request, path: "v1/ai/photo-advisor", as: CloudAIResponse.self)
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }

    func postFilterLab(_ request: CloudAIFilterLabRequest) async throws -> CloudAIResponse {
        #if DEBUG
        return try await post(request, path: "v1/ai/filter-lab", as: CloudAIResponse.self)
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }

    func postCompositionPlanner(
        _ request: HybridCompositionPlannerRequest
    ) async throws -> HybridCompositionPlannerResponse {
        #if DEBUG
        return try await post(
            request,
            path: "v1/ai/composition-planner",
            as: HybridCompositionPlannerResponse.self
        )
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }

    #if DEBUG
    private func post<Request: Encodable & Sendable, Response: Decodable & Sendable>(
        _ request: Request,
        path: String,
        as responseType: Response.Type
    ) async throws -> Response {
        var urlRequest = Foundation.URLRequest(url: endpointURL(path: path))
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

        return try JSONDecoder().decode(responseType, from: data)
    }

    func debugHealthCheck() async -> CloudAIEndpointHealthCheckResult {
        var urlRequest = Foundation.URLRequest(url: endpointURL(path: "health"))
        urlRequest.httpMethod = "GET"
        urlRequest.timeoutInterval = min(timeoutSeconds, 8)
        urlRequest.setValue("application/json", forHTTPHeaderField: "accept")

        do {
            let (data, response) = try await Foundation.URLSession.shared.data(for: urlRequest)
            guard let httpResponse = response as? HTTPURLResponse else {
                return .unreachable
            }

            guard (200..<300).contains(httpResponse.statusCode) else {
                return .httpStatus(httpResponse.statusCode)
            }

            guard let health = try? JSONDecoder().decode(CloudAIEndpointHealthResponse.self, from: data) else {
                return .invalidHealthResponse
            }

            let providerMode = health.providerMode ?? health.mode ?? "unknown"
            guard health.productionReady == false else {
                return .backendReachableButFilterLabNotReady(providerMode: providerMode)
            }

            return health.filterLabReady == true
                ? .ready(providerMode: providerMode)
                : .backendReachableButFilterLabNotReady(providerMode: providerMode)
        } catch {
            return .unreachable
        }
    }

    private func endpointURL(path: String) -> URL {
        guard var components = URLComponents(url: baseURL, resolvingAgainstBaseURL: false) else {
            return baseURL
        }

        let basePath = components.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let endpointPath = path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let joinedPath = [basePath, endpointPath]
            .filter { !$0.isEmpty }
            .joined(separator: "/")

        components.path = joinedPath.isEmpty ? "/" : "/\(joinedPath)"
        components.query = nil
        components.fragment = nil

        return components.url ?? baseURL
    }
    #endif
}

extension CloudAIEndpointClient {
    #if DEBUG
    static let debugBaseURLDefaultsKey = "AIPhotoCloudAIBaseURL"

    static var debugBaseURLString: String {
        defaultBaseURL.absoluteString
    }

    @discardableResult
    static func debugSaveBaseURLOverride(_ rawValue: String) -> Bool {
        guard let url = normalizedBaseURL(from: rawValue) else {
            return false
        }

        UserDefaults.standard.set(url.absoluteString, forKey: debugBaseURLDefaultsKey)
        return true
    }

    static func debugClearBaseURLOverride() {
        UserDefaults.standard.removeObject(forKey: debugBaseURLDefaultsKey)
    }
    #endif

    static var defaultBaseURL: URL {
        #if DEBUG
        let configuredURLs = [
            UserDefaults.standard.string(forKey: debugBaseURLDefaultsKey),
            ProcessInfo.processInfo.environment["AI_PHOTO_CLOUD_AI_BASE_URL"]
        ].compactMap { $0 }

        for configuredURL in configuredURLs {
            if let url = normalizedBaseURL(from: configuredURL) {
                return url
            }
        }
        #endif

        return URL(string: "http://127.0.0.1:8787")!
    }

    static func normalizedBaseURL(from rawValue: String) -> URL? {
        let trimmed = rawValue.trimmingCharacters(in: .whitespacesAndNewlines)
        guard var components = URLComponents(string: trimmed),
              let scheme = components.scheme?.lowercased(),
              (scheme == "http" || scheme == "https"),
              let host = components.host,
              isDebugAllowedBaseURLHost(host),
              components.user == nil,
              components.password == nil,
              components.query == nil,
              components.fragment == nil else {
            return nil
        }

        components.scheme = scheme
        components.path = ""
        return components.url
    }

    private static func isDebugAllowedBaseURLHost(_ host: String) -> Bool {
        let normalizedHost = host.trimmingCharacters(in: CharacterSet(charactersIn: "[]")).lowercased()

        if normalizedHost == "localhost" || normalizedHost == "127.0.0.1" || normalizedHost == "::1" {
            return true
        }

        let octets = normalizedHost
            .split(separator: ".")
            .compactMap { Int($0) }

        guard octets.count == 4,
              octets.allSatisfy({ (0...255).contains($0) }) else {
            return false
        }

        return octets[0] == 10
            || (octets[0] == 172 && (16...31).contains(octets[1]))
            || (octets[0] == 192 && octets[1] == 168)
    }
}

#if DEBUG
private struct CloudAIEndpointHealthResponse: Decodable {
    let mode: String?
    let providerMode: String?
    let filterLabReady: Bool?
    let compositionPlannerReady: Bool?
    let productionReady: Bool?
}

enum CloudAIEndpointHealthCheckResult: Equatable {
    case ready(providerMode: String)
    case backendReachableButFilterLabNotReady(providerMode: String)
    case invalidHealthResponse
    case httpStatus(Int)
    case unreachable
}
#endif
