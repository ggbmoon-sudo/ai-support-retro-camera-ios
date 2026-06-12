import Foundation

enum CloudAIBackendMode: Equatable, Sendable {
    case mockOnly
    case remoteDisabled
    case remoteWithMockFallback

    static let defaultMode: CloudAIBackendMode = .mockOnly

    var allowsNetworkRequests: Bool {
        false
    }
}
