import Combine
import ImageIO
import PhotosUI
import SwiftUI
import UIKit

@MainActor
final class FilterLabViewModel: ObservableObject {
    private static let importedImageMaxLongEdge: CGFloat = 1600

    enum State: Equatable {
        case idle
        case analyzing
        case result
        case failed(String)
        case unavailable(String)
    }

    @Published private(set) var state: State = .idle
    @Published private(set) var styleReferenceImage: UIImage?
    @Published private(set) var applyTargetImage: UIImage?
    @Published private(set) var previewImage: UIImage?
    @Published private(set) var recipe: GeneratedFilterRecipe?
    @Published var intensity: Double = 1.0
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

    var canGenerate: Bool {
        styleReferenceImage != nil && applyTargetImage != nil
    }

    func importStyleReferenceImage(from pickerItem: PhotosPickerItem?) async {
        guard let pickerItem else { return }

        do {
            let image = try await loadImage(from: pickerItem)
            await updateStyleReferenceImage(image)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func importApplyTargetImage(from pickerItem: PhotosPickerItem?) async {
        guard let pickerItem else { return }

        do {
            let image = try await loadImage(from: pickerItem)
            await updateApplyTargetImage(image)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func useSampleStyleReferenceImage() async {
        await updateStyleReferenceImage(Self.sampleStyleReferenceImage())
    }

    func useSampleApplyTargetImage() async {
        await updateApplyTargetImage(Self.sampleApplyTargetImage())
    }

    func retry() async {
        if styleReferenceImage == nil {
            styleReferenceImage = Self.sampleStyleReferenceImage()
        }

        if applyTargetImage == nil {
            applyTargetImage = Self.sampleApplyTargetImage()
        }

        await generateFromCurrentImages()
    }

    func tryAnotherImage() {
        renderTask?.cancel()
        state = .idle
        styleReferenceImage = nil
        applyTargetImage = nil
        previewImage = nil
        recipe = nil
        intensity = 1.0
        isRenderingPreview = false
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
        guard recipe != nil, applyTargetImage != nil else {
            applyMessageKey = "filter_lab.apply.no_photo"
            return
        }

        applyMessageKey = "filter_lab.apply.applied_mock"
    }

    private func updateStyleReferenceImage(_ image: UIImage) async {
        styleReferenceImage = image
        await generateIfReady()
    }

    private func updateApplyTargetImage(_ image: UIImage) async {
        applyTargetImage = image
        await generateIfReady()
    }

    private func generateIfReady() async {
        guard canGenerate else {
            resetGeneratedState()
            return
        }

        #if DEBUG
        prepareCloudDebugReadyState()
        #else
        await generateFromCurrentImages()
        #endif
    }

    #if DEBUG
    private func prepareCloudDebugReadyState() {
        renderTask?.cancel()
        previewImage = nil
        recipe = nil
        isRenderingPreview = false
        applyMessageKey = nil
        cloudDebugFallbackMessageKey = nil
        state = .idle
    }
    #endif

    private func generateFromCurrentImages() async {
        guard let styleReferenceImage, applyTargetImage != nil else {
            resetGeneratedState()
            return
        }

        renderTask?.cancel()
        previewImage = nil
        recipe = nil
        isRenderingPreview = false
        applyMessageKey = nil
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
        state = .analyzing

        do {
            let generatedRecipe = try await generationService.generateFilter(from: styleReferenceImage)
            recipe = FilterRecipeValidator.validated(generatedRecipe)
            state = .result
            renderPreview()
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    private func resetGeneratedState() {
        renderTask?.cancel()
        previewImage = nil
        recipe = nil
        isRenderingPreview = false
        applyMessageKey = nil
        state = .idle
        #if DEBUG
        cloudDebugFallbackMessageKey = nil
        #endif
    }

    #if DEBUG
    func generateCloudDebug(consent: CloudAIConsent) async {
        guard let styleReferenceImage, applyTargetImage != nil else {
            await retry()
            return
        }

        renderTask?.cancel()
        previewImage = nil
        recipe = nil
        isRenderingPreview = false
        applyMessageKey = nil
        cloudDebugFallbackMessageKey = nil
        state = .analyzing

        do {
            let compressedImage = try CloudAIImageCompressor().compress(styleReferenceImage)
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
            let cloudRecipe = try CloudAIFilterLabMapper.map(cloudResponse)
            guard cloudResponse.source == .cloud, cloudRecipe.source == .cloud else {
                throw CloudAIServiceError.invalidResponse(["non_cloud_filter_lab_result"])
            }

            recipe = cloudRecipe
            state = .result
            renderPreview()
        } catch {
            let message = Self.cloudDebugFailureMessage(for: error)
            cloudDebugFallbackMessageKey = "filter_lab.cloud_debug.failed"
            state = .unavailable(message)
        }
    }

    private static func cloudDebugFailureMessage(for error: Error) -> String {
        guard let cloudError = error as? CloudAIServiceError else {
            return NSLocalizedString("filter_lab.cloud_debug.failed.network", comment: "")
        }

        switch cloudError {
        case .remoteHTTPStatus(let statusCode):
            return String(
                format: NSLocalizedString("filter_lab.cloud_debug.failed.http", comment: ""),
                statusCode
            )
        case .invalidResponse:
            return NSLocalizedString("filter_lab.cloud_debug.failed.invalid_response", comment: "")
        case .imageCompressionFailed:
            return NSLocalizedString("filter_lab.cloud_debug.failed.compression", comment: "")
        case .consentRequired:
            return NSLocalizedString("filter_lab.cloud_debug.failed.consent", comment: "")
        case .remoteDisabled:
            return NSLocalizedString("filter_lab.cloud_debug.failed.disabled", comment: "")
        case .remoteUnavailable:
            return NSLocalizedString("filter_lab.cloud_debug.failed.network", comment: "")
        }
    }
    #endif

    private func renderPreview() {
        guard let applyTargetImage, let recipe else { return }

        renderTask?.cancel()
        isRenderingPreview = true
        let renderer = previewRenderer
        let currentIntensity = intensity

        renderTask = Task { [weak self] in
            do {
                let renderedImage = try await renderer.render(
                    image: applyTargetImage,
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
                    self?.previewImage = applyTargetImage
                    self?.isRenderingPreview = false
                    self?.state = .failed(error.localizedDescription)
                }
            }
        }
    }

    private func loadImage(from pickerItem: PhotosPickerItem) async throws -> UIImage {
        guard let data = try await pickerItem.loadTransferable(type: Data.self) else {
            throw FilterGenerationError.failed
        }

        return try Self.downsampleImageData(data, maxLongEdge: Self.importedImageMaxLongEdge)
    }

    private static func downsampleImageData(_ data: Data, maxLongEdge: CGFloat) throws -> UIImage {
        let sourceOptions = [
            kCGImageSourceShouldCache: false
        ] as CFDictionary

        guard let source = CGImageSourceCreateWithData(data as CFData, sourceOptions) else {
            throw FilterGenerationError.failed
        }

        let thumbnailOptions = [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
            kCGImageSourceShouldCacheImmediately: true,
            kCGImageSourceThumbnailMaxPixelSize: Int(maxLongEdge)
        ] as CFDictionary

        guard let image = CGImageSourceCreateThumbnailAtIndex(source, 0, thumbnailOptions) else {
            throw FilterGenerationError.failed
        }

        return UIImage(cgImage: image, scale: 1, orientation: .up)
    }

    private static func sampleStyleReferenceImage() -> UIImage {
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

    private static func sampleApplyTargetImage() -> UIImage {
        let size = CGSize(width: 900, height: 1200)
        let renderer = UIGraphicsImageRenderer(size: size)

        return renderer.image { context in
            let colors = [
                UIColor(red: 0.18, green: 0.31, blue: 0.42, alpha: 1).cgColor,
                UIColor(red: 0.80, green: 0.86, blue: 0.72, alpha: 1).cgColor
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

            UIColor.black.withAlphaComponent(0.22).setFill()
            context.cgContext.fill(CGRect(x: 110, y: 720, width: 680, height: 180))

            UIColor.white.withAlphaComponent(0.28).setFill()
            context.cgContext.fill(CGRect(x: 160, y: 400, width: 180, height: 320))
            context.cgContext.fill(CGRect(x: 390, y: 320, width: 160, height: 400))
            context.cgContext.fill(CGRect(x: 600, y: 470, width: 120, height: 250))

            UIColor.white.withAlphaComponent(0.55).setStroke()
            context.cgContext.setLineWidth(6)
            context.cgContext.move(to: CGPoint(x: 130, y: 700))
            context.cgContext.addLine(to: CGPoint(x: 770, y: 700))
            context.cgContext.strokePath()
        }
    }
}
