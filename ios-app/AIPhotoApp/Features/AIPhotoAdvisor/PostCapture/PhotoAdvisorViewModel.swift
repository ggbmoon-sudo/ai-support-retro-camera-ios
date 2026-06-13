import Combine
import Foundation
import UIKit

@MainActor
final class PhotoAdvisorViewModel: ObservableObject {
    @Published private(set) var state: PhotoAdvisorState = .idle
    #if DEBUG
    @Published private(set) var cloudDebugFallbackMessageKey: String?
    #endif

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
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
        state = .analyzing

        do {
            let result = try await service.analyzePhoto(input)
            guard activeRequestID == requestID else { return }
            state = .success(result)
        } catch PhotoAdvisorError.mockUnavailable {
            guard activeRequestID == requestID else { return }
            state = .unavailable(
                messageKey: PhotoAdvisorCopyResolver().messageKey(
                    for: .unavailable,
                    language: input.languageMode,
                    requestedTone: input.toneMode
                )
            )
        } catch {
            guard activeRequestID == requestID else { return }
            state = .failed(messageKey: "photo_advisor.error.invalid_result")
        }
    }

    #if DEBUG
    func analyzeCloudDebug(
        _ input: PhotoAdvisorInput,
        image: UIImage,
        consent: CloudAIConsent,
        selectedFilterId: String?,
        allowedFilterIds: Set<String>
    ) async {
        let requestID = UUID()
        activeRequestID = requestID
        lastInput = input
        cloudDebugFallbackMessageKey = nil
        state = .analyzing

        do {
            let compressedImage = try CloudAIImageCompressor().compress(image)
            let cloudInput = CloudAIPhotoAdvisorInput(
                imageData: compressedImage.data,
                contentType: compressedImage.contentType,
                width: compressedImage.width,
                height: compressedImage.height,
                metadataStripped: compressedImage.metadataStripped,
                locale: input.localeIdentifier,
                consent: consent,
                selectedFilterId: selectedFilterId
            )
            let cloudResponse = try await RemoteCloudAIService(mode: .debugRemoteMock)
                .analyzePhotoAdvisor(cloudInput)
            let result = CloudAIPhotoAdvisorMapper.map(
                cloudResponse,
                allowedFilterIds: allowedFilterIds
            )

            guard activeRequestID == requestID else { return }
            state = .success(result)
        } catch {
            guard activeRequestID == requestID else { return }
            cloudDebugFallbackMessageKey = "photo_advisor.cloud_debug.fallback"

            do {
                let fallback = try await fallbackService.analyzePhoto(input)
                guard activeRequestID == requestID else { return }
                state = .success(fallback)
            } catch {
                guard activeRequestID == requestID else { return }
                state = .unavailable(messageKey: "photo_advisor.cloud_debug.fallback")
            }
        }
    }
    #endif

    func retry() async {
        guard let lastInput else { return }
        variantSeed += 1
        let nextInput = PhotoAdvisorInput(
            photoId: lastInput.photoId,
            source: lastInput.source,
            selectedFilterId: lastInput.selectedFilterId,
            imageSignal: lastInput.imageSignal,
            mockScene: nil,
            variantSeed: variantSeed,
            localeIdentifier: lastInput.localeIdentifier,
            languageMode: lastInput.languageMode,
            toneMode: lastInput.toneMode,
            captureContext: lastInput.captureContext
        )
        await analyze(nextInput)
    }

    func runFallback() async {
        guard let lastInput else { return }
        let requestID = UUID()
        activeRequestID = requestID
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
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
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
        state = .idle
    }
}
