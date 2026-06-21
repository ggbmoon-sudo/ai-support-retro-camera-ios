import Combine
import PhotosUI
import SwiftUI
import UIKit

@MainActor
final class FilterLabViewModel: ObservableObject {
    enum State: Equatable {
        case idle
        case analyzing
        case result
        case failed(String)
        case unavailable(String)
    }

    @Published private(set) var state: State = .idle
    @Published private(set) var referenceImage: UIImage?
    @Published private(set) var previewImage: UIImage?
    @Published private(set) var recipe: GeneratedFilterRecipe?
    @Published var intensity: Double = 0.72
    @Published private(set) var isRenderingPreview = false
    @Published private(set) var applyMessageKey: String?
    #if DEBUG
    @Published private(set) var cloudDebugFallbackMessageKey: String?
    #endif

    private let generationService: FilterGenerationService
    private let fallbackGenerationService: FilterGenerationService
    private let previewRenderer = GeneratedFilterPreviewRenderer()
    private var renderTask: Task<Void, Never>?

    init(
        generationService: FilterGenerationService? = nil,
        fallbackGenerationService: FilterGenerationService? = nil
    ) {
        self.generationService = generationService ?? MockFilterGenerationService()
        self.fallbackGenerationService = fallbackGenerationService ?? MockFilterGenerationService()
    }

    deinit {
        renderTask?.cancel()
    }

    func importReferenceImage(from pickerItem: PhotosPickerItem?) async {
        guard let pickerItem else { return }

        do {
            guard let data = try await pickerItem.loadTransferable(type: Data.self),
                  let image = UIImage(data: data) else {
                throw FilterGenerationError.failed
            }

            await generate(from: image)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func useSampleReferenceImage() async {
        await generate(from: Self.sampleReferenceImage())
    }

    func retry() async {
        guard let referenceImage else {
            await useSampleReferenceImage()
            return
        }

        await generate(from: referenceImage)
    }

    func tryAnotherImage() {
        renderTask?.cancel()
        state = .idle
        referenceImage = nil
        previewImage = nil
        recipe = nil
        intensity = 0.72
        applyMessageKey = nil
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
    }

    func showUnavailableState() {
        state = .unavailable(NSLocalizedString("filter_lab.error.unavailable", comment: ""))
    }

    func updateIntensity(_ value: Double) {
        intensity = min(max(value, 0), 1)
        renderPreview()
    }

    func applyMockFilter() {
        guard recipe != nil, referenceImage != nil else {
            applyMessageKey = "filter_lab.apply.no_photo"
            return
        }

        applyMessageKey = "filter_lab.apply.applied_mock"
    }

    private func generate(from image: UIImage) async {
        renderTask?.cancel()
        referenceImage = image
        previewImage = nil
        recipe = nil
        applyMessageKey = nil
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
        state = .analyzing

        do {
            let generatedRecipe = try await generationService.generateFilter(from: image)
            recipe = FilterRecipeValidator.validated(generatedRecipe)
            state = .result
            renderPreview()
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    #if DEBUG
    func generateCloudDebug(consent: CloudAIConsent) async {
        guard let referenceImage else {
            await useSampleReferenceImage()
            return
        }

        renderTask?.cancel()
        previewImage = nil
        recipe = nil
        applyMessageKey = nil
        cloudDebugFallbackMessageKey = nil
        state = .analyzing

        do {
            let compressedImage = try CloudAIImageCompressor().compress(referenceImage)
            let cloudInput = CloudAIFilterLabInput(
                imageData: compressedImage.data,
                contentType: compressedImage.contentType,
                width: compressedImage.width,
                height: compressedImage.height,
                metadataStripped: compressedImage.metadataStripped,
                locale: Locale.current.identifier,
                consent: consent
            )
            let cloudResponse = try await RemoteCloudAIService(mode: .debugRemoteMock)
                .generateFilterLab(cloudInput)
            recipe = try CloudAIFilterLabMapper.map(cloudResponse)
            state = .result
            renderPreview()
        } catch {
            cloudDebugFallbackMessageKey = "filter_lab.cloud_debug.fallback"

            do {
                let fallback = try await fallbackGenerationService.generateFilter(from: referenceImage)
                recipe = FilterRecipeValidator.validated(fallback)
                applyMessageKey = "filter_lab.cloud_debug.fallback"
                state = .result
                renderPreview()
            } catch {
                state = .unavailable(NSLocalizedString("filter_lab.cloud_debug.fallback", comment: ""))
            }
        }
    }
    #endif

    private func renderPreview() {
        guard let referenceImage, let recipe else { return }

        renderTask?.cancel()
        isRenderingPreview = true
        let renderer = previewRenderer
        let currentIntensity = intensity

        renderTask = Task { [weak self] in
            do {
                let renderedImage = try await renderer.render(
                    image: referenceImage,
                    recipe: recipe,
                    intensity: currentIntensity
                )

                guard !Task.isCancelled else { return }
                await MainActor.run {
                    self?.previewImage = renderedImage
                    self?.isRenderingPreview = false
                }
            } catch {
                guard !Task.isCancelled else { return }
                await MainActor.run {
                    self?.previewImage = referenceImage
                    self?.isRenderingPreview = false
                    self?.state = .failed(error.localizedDescription)
                }
            }
        }
    }

    private static func sampleReferenceImage() -> UIImage {
        let size = CGSize(width: 900, height: 1200)
        let renderer = UIGraphicsImageRenderer(size: size)

        return renderer.image { context in
            let colors = [
                UIColor(red: 0.96, green: 0.70, blue: 0.36, alpha: 1).cgColor,
                UIColor(red: 0.30, green: 0.38, blue: 0.54, alpha: 1).cgColor
            ] as CFArray
            let colorSpace = CGColorSpaceCreateDeviceRGB()
            let gradient = CGGradient(colorsSpace: colorSpace, colors: colors, locations: [0, 1])

            if let gradient {
                context.cgContext.drawLinearGradient(
                    gradient,
                    start: CGPoint(x: 0, y: 0),
                    end: CGPoint(x: size.width, y: size.height),
                    options: []
                )
            }

            UIColor.black.withAlphaComponent(0.18).setFill()
            context.cgContext.fill(CGRect(x: 140, y: 700, width: 620, height: 180))

            UIColor.white.withAlphaComponent(0.35).setStroke()
            context.cgContext.setLineWidth(8)
            context.cgContext.strokeEllipse(in: CGRect(x: 340, y: 260, width: 220, height: 220))
            context.cgContext.move(to: CGPoint(x: 450, y: 480))
            context.cgContext.addLine(to: CGPoint(x: 450, y: 760))
            context.cgContext.move(to: CGPoint(x: 340, y: 600))
            context.cgContext.addLine(to: CGPoint(x: 560, y: 600))
            context.cgContext.strokePath()
        }
    }
}
