import Combine
import Foundation

@MainActor
final class PhotoAdvisorViewModel: ObservableObject {
    @Published private(set) var state: PhotoAdvisorState = .idle

    private let service: any PhotoAdvisorService
    private let fallbackService: any PhotoAdvisorService
    private var activeRequestID: UUID?
    private var lastInput: PhotoAdvisorInput?
    private var variantSeed = 0

    init(
        service: (any PhotoAdvisorService)? = nil,
        fallbackService: (any PhotoAdvisorService)? = nil
    ) {
        self.service = service ?? MockPhotoAdvisorService()
        self.fallbackService = fallbackService ?? MockPhotoAdvisorService(mode: .invalidThenFallback)
    }

    func analyze(_ input: PhotoAdvisorInput) async {
        let requestID = UUID()
        activeRequestID = requestID
        lastInput = input
        state = .analyzing

        do {
            let result = try await service.analyzePhoto(input)
            guard activeRequestID == requestID else { return }
            state = .success(result)
        } catch PhotoAdvisorError.mockUnavailable {
            guard activeRequestID == requestID else { return }
            state = .unavailable(messageKey: "photo_advisor.error.unavailable")
        } catch {
            guard activeRequestID == requestID else { return }
            state = .failed(messageKey: "photo_advisor.error.invalid_result")
        }
    }

    func retry() async {
        guard let lastInput else { return }
        variantSeed += 1
        let nextInput = PhotoAdvisorInput(
            photoId: lastInput.photoId,
            source: lastInput.source,
            selectedFilterId: lastInput.selectedFilterId,
            mockScene: nil,
            variantSeed: variantSeed,
            localeIdentifier: lastInput.localeIdentifier
        )
        await analyze(nextInput)
    }

    func runFallback() async {
        guard let lastInput else { return }
        let requestID = UUID()
        activeRequestID = requestID
        state = .analyzing

        do {
            let result = try await fallbackService.analyzePhoto(lastInput)
            guard activeRequestID == requestID else { return }
            state = .success(result)
        } catch {
            guard activeRequestID == requestID else { return }
            state = .failed(messageKey: "photo_advisor.error.invalid_result")
        }
    }

    func reset() {
        activeRequestID = nil
        lastInput = nil
        variantSeed = 0
        state = .idle
    }
}
