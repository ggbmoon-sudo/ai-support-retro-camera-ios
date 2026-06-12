import Foundation

final class MockPhotoAdvisorService: PhotoAdvisorService {
    enum Mode {
        case success
        case unavailable
        case invalidThenFallback
    }

    private let mode: Mode
    private let allowedFilterIds: Set<String>

    init(
        mode: Mode = .success,
        allowedFilterIds: Set<String> = Set(FilterPresetCatalog.all.map(\.id))
    ) {
        self.mode = mode
        self.allowedFilterIds = allowedFilterIds
    }

    func analyzePhoto(_ input: PhotoAdvisorInput) async throws -> PhotoAdvisorResult {
        try await Task.sleep(nanoseconds: 450_000_000)

        switch mode {
        case .success:
            return PhotoAdvisorHeuristicResolver.result(for: input, allowedFilterIds: allowedFilterIds)
        case .unavailable:
            throw PhotoAdvisorError.mockUnavailable
        case .invalidThenFallback:
            let fallback = PhotoAdvisorResultValidator.fallback(allowedFilterIds: allowedFilterIds)
            return PhotoAdvisorCopyResolver().localizedResult(fallback, input: input)
        }
    }
}
