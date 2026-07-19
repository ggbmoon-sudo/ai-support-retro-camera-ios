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
    private static let context = CIContext(options: [.cacheIntermediates: false])
    private static let maxPreviewLongEdge: CGFloat = 1600

    func render(image: UIImage, recipe: GeneratedFilterRecipe, intensity: Double) async throws -> UIImage {
        let safeRecipe = FilterRecipeValidator.validated(recipe)
        let safeIntensity = min(max(intensity.isFinite ? intensity : 1, 0), 1)

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
        let normalizedImage = image
            .resizedForGeneratedFilterRendering(maxLongEdge: maxPreviewLongEdge)
            .normalizedForGeneratedFilterRendering()
        guard var outputImage = CIImage(image: normalizedImage) else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        defer {
            context.clearCaches()
        }

        outputImage = try applyExposure(parameters.exposure * intensity, to: outputImage)
        outputImage = try applyColorControls(parameters, intensity: intensity, to: outputImage)
        outputImage = try applyTemperature(parameters, intensity: intensity, to: outputImage)
        outputImage = try applyFade(parameters.fade * intensity, to: outputImage)
        outputImage = try applyGrain(parameters.grain * intensity, to: outputImage)
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
            kCIInputContrastKey: max(0.2, 1 + parameters.contrast * intensity)
        ])
    }

    private static func applyTemperature(
        _ parameters: GeneratedFilterParameterSet,
        intensity: Double,
        to image: CIImage
    ) throws -> CIImage {
        let targetTemperature = CGFloat(6500 - parameters.temperature * 1800 * intensity)
        let targetTint = CGFloat(parameters.tint * 80 * intensity)

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

    private static func applyGrain(_ grain: Double, to image: CIImage) throws -> CIImage {
        let safeGrain = min(max(grain, 0), 0.35)
        guard safeGrain > 0 else { return image }
        guard let randomNoise = CIFilter(name: "CIRandomGenerator")?.outputImage else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        let monochromeNoise = try outputImage(named: "CIColorControls", values: [
            kCIInputImageKey: randomNoise,
            kCIInputSaturationKey: 0,
            kCIInputContrastKey: 1.4
        ])
        let opacity = min(safeGrain * 0.5, 0.18)
        let translucentNoise = try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: monochromeNoise,
            "inputRVector": CIVector(x: 1, y: 0, z: 0, w: 0),
            "inputGVector": CIVector(x: 0, y: 1, z: 0, w: 0),
            "inputBVector": CIVector(x: 0, y: 0, z: 1, w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: CGFloat(opacity)),
            "inputBiasVector": CIVector(x: 0, y: 0, z: 0, w: 0)
        ]).cropped(to: image.extent)

        return try outputImage(named: "CISoftLightBlendMode", values: [
            kCIInputImageKey: translucentNoise,
            kCIInputBackgroundImageKey: image
        ]).cropped(to: image.extent)
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
    nonisolated func resizedForGeneratedFilterRendering(maxLongEdge: CGFloat) -> UIImage {
        guard size.width > 0, size.height > 0 else { return self }

        let longestEdge = max(size.width, size.height)
        guard longestEdge > maxLongEdge else { return self }

        let scaleFactor = maxLongEdge / longestEdge
        let targetSize = CGSize(
            width: max(1, (size.width * scaleFactor).rounded()),
            height: max(1, (size.height * scaleFactor).rounded())
        )
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        format.opaque = true

        return UIGraphicsImageRenderer(size: targetSize, format: format).image { context in
            context.cgContext.setFillColor(CGColor(gray: 0, alpha: 1))
            context.cgContext.fill(CGRect(origin: .zero, size: targetSize))
            draw(in: CGRect(origin: .zero, size: targetSize))
        }
    }

    nonisolated func normalizedForGeneratedFilterRendering() -> UIImage {
        guard imageOrientation != .up else { return self }

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        format.opaque = true

        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
