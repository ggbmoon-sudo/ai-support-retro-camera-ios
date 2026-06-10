import Foundation

@MainActor
protocol CloudSnapshotGuidanceService {
    func analyze(_ request: CloudSnapshotGuidanceRequest) async throws -> CloudSnapshotGuidanceResponse
}
