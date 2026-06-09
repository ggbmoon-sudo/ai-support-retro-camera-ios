import Foundation

nonisolated enum LiveGuidanceMode: String, CaseIterable, Identifiable, Sendable {
    case mock
    case local

    var id: String { rawValue }

    var titleKey: String {
        switch self {
        case .mock:
            return "camera.guidance.mode.mock"
        case .local:
            return "camera.guidance.mode.local"
        }
    }

    var next: LiveGuidanceMode {
        switch self {
        case .mock:
            return .local
        case .local:
            return .mock
        }
    }
}

