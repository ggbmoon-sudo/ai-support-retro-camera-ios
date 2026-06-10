import Foundation

nonisolated enum CloudSnapshotGuidanceState: Equatable, Sendable {
    case idle
    case consentRequired
    case preparingSnapshot
    case analyzing
    case result(CloudSnapshotGuidanceResponse)
    case failed(messageKey: String)
    case unavailable(messageKey: String)

    var isWorking: Bool {
        switch self {
        case .preparingSnapshot, .analyzing:
            return true
        case .idle, .consentRequired, .result, .failed, .unavailable:
            return false
        }
    }

    var titleKey: String {
        switch self {
        case .idle:
            return "camera.cloud_snapshot.state.idle"
        case .consentRequired:
            return "camera.cloud_snapshot.state.consent"
        case .preparingSnapshot:
            return "camera.cloud_snapshot.state.preparing"
        case .analyzing:
            return "camera.cloud_snapshot.state.analyzing"
        case .result:
            return "camera.cloud_snapshot.state.result"
        case .failed:
            return "camera.cloud_snapshot.state.failed"
        case .unavailable:
            return "camera.cloud_snapshot.state.unavailable"
        }
    }
}
