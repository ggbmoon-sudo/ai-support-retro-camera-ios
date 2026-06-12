import Foundation

enum CloudAIBackendMode: Equatable, Sendable {
    case mockOnly
    case remoteDisabled
    case remoteWithMockFallback
    case debugRemoteMock

    static let defaultMode: CloudAIBackendMode = .mockOnly

    var allowsNetworkRequests: Bool {
        #if DEBUG
        if case .debugRemoteMock = self {
            return true
        }
        #endif

        return false
    }
}
