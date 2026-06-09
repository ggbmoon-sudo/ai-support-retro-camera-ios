import Combine
import Foundation

@MainActor
final class AIAnalysisViewModel: ObservableObject {
    @Published private(set) var status: PhotoAnalysisStatus = .notStarted
    @Published private(set) var result: PhotoAnalysisResult?
    @Published private(set) var errorMessage: String?

    private let analysisService: any PhotoAnalysisService
    private let failingAnalysisService: any PhotoAnalysisService
    private var lastSuccessfulRequest: PhotoAnalysisRequest?

    init() {
        self.analysisService = MockPhotoAnalysisService()
        self.failingAnalysisService = MockPhotoAnalysisService(mode: .failure)
    }

    init(
        analysisService: any PhotoAnalysisService,
        failingAnalysisService: any PhotoAnalysisService
    ) {
        self.analysisService = analysisService
        self.failingAnalysisService = failingAnalysisService
    }

    var isAnalyzing: Bool {
        status == .analyzing
    }

    func analyze(photoId: String, filterPresetId: String?, shouldFail: Bool = false) async {
        let request = PhotoAnalysisRequest(
            photoId: photoId,
            ownerId: "mock-user",
            storagePath: nil,
            filterPresetId: filterPresetId,
            trainingConsent: false,
            isMock: true
        )

        if !shouldFail {
            lastSuccessfulRequest = request
        }

        await run(request: request, shouldFail: shouldFail)
    }

    func retryLastSuccess() async {
        guard let request = lastSuccessfulRequest else { return }
        await run(request: request, shouldFail: false)
    }

    func reset() {
        status = .notStarted
        result = nil
        errorMessage = nil
        lastSuccessfulRequest = nil
    }

    func dismissResult() {
        status = .notStarted
        result = nil
        errorMessage = nil
    }

    private func run(request: PhotoAnalysisRequest, shouldFail: Bool) async {
        status = .analyzing
        result = nil
        errorMessage = nil

        do {
            let service = shouldFail ? failingAnalysisService : analysisService
            let analysisResult = try await service.analyzePhoto(request)
            result = analysisResult
            status = .completed
        } catch {
            result = nil
            errorMessage = error.localizedDescription
            status = .failed
        }
    }
}
