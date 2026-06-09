import Foundation

final class MockPhotoAnalysisService: PhotoAnalysisService {
    enum Mode {
        case success
        case failure
    }

    private let mode: Mode

    init(mode: Mode = .success) {
        self.mode = mode
    }

    func analyzePhoto(_ request: PhotoAnalysisRequest) async throws -> PhotoAnalysisResult {
        try await Task.sleep(for: .milliseconds(300))

        if mode == .failure {
            throw PhotoAnalysisError.mockFailure
        }

        return PhotoAnalysisResult.mockSuccess(photoId: request.photoId)
    }
}
