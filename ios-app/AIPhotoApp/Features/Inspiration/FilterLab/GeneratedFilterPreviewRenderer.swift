import CoreImage
import UIKit

enum GeneratedFilterPreviewError: LocalizedError {
    case renderFailed

    var errorDescription: String? {
        NSLocalizedString("filter_lab.error.preview_failed", comment: "")
    }
}

nonisolated final class GeneratedFilterPreviewRenderer {
    private static let renderQueue = DispatchQueue(label: "app.ai-photo.filter-lab.render", qos: .userInitiated)
    private static let context = CIContext(options: [.cacheIntermediates: true])

    func render(image: UIImage, recipe: GeneratedFilterRecipe, intensity: Double) async throws -> UIImage {
        let safeRecipe = FilterRecipeValidator.validated(recipe)
        let safeIntensity = min(max(intensity.isFinite ? intensity : 0.75, 0), 1)

        return try await withCheckedThrowingContinuation { continuation in
            Self.renderQueue.async {
                do {
                    let renderedImage = try Self.renderSynchronously(
                        image: image,
                        parameters: safeRecipe.parameters,
                        intensity: safeIntensity
                    )
                    continuation.resume(returning: renderedImage)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }

    private static func renderSynchronously(
        image: UIImage,
        parameters: GeneratedFilterParameterSet,
        intensity: Double
    ) throws -> UIImage {
        let normalizedImage = image.normalizedForGeneratedFilterRendering()
        guard var outputImage = CIImage(image: normalizedImage) else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        outputImage = try applyExposure(parameters.exposure * intensity, to: outputImage)
        outputImage = try applyColorControls(parameters, intensity: intensity, to: outputImage)
        outputImage = try applyTemperature(parameters, intensity: intensity, to: outputImage)
        outputImage = try applyFade(parameters.fade * intensity, to: outputImage)
        outputImage = try applyVignette(parameters.vignette * intensity, to: outputImage)

        let extent = outputImage.extent
        guard let cgImage = context.createCGImage(outputImage, from: extent) else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        return UIImage(cgImage: cgImage, scale: normalizedImage.scale, orientation: .up)
    }

    private static func applyExposure(_ exposure: Double, to image: CIImage) throws -> CIImage {
        try outputImage(named: "CIExposureAdjust", values: [
            kCIInputImageKey: image,
            kCIInputEVKey: exposure
        ])
    }

    private static func applyColorControls(
        _ parameters: GeneratedFilterParameterSet,
        intensity: Double,
        to image: CIImage
    ) throws -> CIImage {
        try outputImage(named: "CIColorControls", values: [
            kCIInputImageKey: image,
            kCIInputSaturationKey: max(0, 1 + parameters.saturation * intensity),
            kCIInputBrightnessKey: parameters.exposure * 0.18 * intensity,
            kCIInputContrastKey: max(0.2, 1 + parameters.contrast * intensity)
        ])
    }

    private static func applyTemperature(
        _ parameters: GeneratedFilterParameterSet,
        intensity: Double,
        to image: CIImage
    ) throws -> CIImage {
        let targetTemperature = 6500 - parameters.temperature * 1800 * intensity
        let targetTint = parameters.tint * 80 * intensity

        return try outputImage(named: "CITemperatureAndTint", values: [
            kCIInputImageKey: image,
            "inputNeutral": CIVector(x: 6500, y: 0),
            "inputTargetNeutral": CIVector(x: targetTemperature, y: targetTint)
        ])
    }

    private static func applyFade(_ fade: Double, to image: CIImage) throws -> CIImage {
        guard fade > 0 else { return image }
        return try outputImage(named: "CIHighlightShadowAdjust", values: [
            kCIInputImageKey: image,
            "inputHighlightAmount": max(0.6, 1 - fade * 0.35),
            "inputShadowAmount": min(1, fade * 1.3)
        ])
    }

    private static func applyVignette(_ vignette: Double, to image: CIImage) throws -> CIImage {
        guard vignette > 0 else { return image }
        return try outputImage(named: "CIVignette", values: [
            kCIInputImageKey: image,
            kCIInputIntensityKey: vignette * 2.2,
            kCIInputRadiusKey: 1.65
        ])
    }

    private static func outputImage(named filterName: String, values: [String: Any]) throws -> CIImage {
        guard let filter = CIFilter(name: filterName) else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        values.forEach { key, value in
            filter.setValue(value, forKey: key)
        }

        guard let outputImage = filter.outputImage else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        return outputImage
    }
}

private extension UIImage {
    nonisolated func normalizedForGeneratedFilterRendering() -> UIImage {
        guard imageOrientation != .up else { return self }

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = scale
        format.opaque = false

        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
