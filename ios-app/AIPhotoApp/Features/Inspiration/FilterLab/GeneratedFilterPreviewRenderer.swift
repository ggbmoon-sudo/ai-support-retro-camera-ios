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
        outputImage = try applyTone(parameters, intensity: intensity, to: outputImage)
        outputImage = try applyBloom(parameters.bloom * intensity, to: outputImage)
        outputImage = try applyGrain(parameters.grain * intensity, to: outputImage)
        outputImage = try applyDust(parameters.dust * intensity, to: outputImage)
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

    private static func applyTone(
        _ parameters: GeneratedFilterParameterSet,
        intensity: Double,
        to image: CIImage
    ) throws -> CIImage {
        let fade = min(max(parameters.fade * intensity, 0), 0.5)
        let shadowLift = min(max(parameters.shadowLift * intensity, 0), 0.4)
        let highlightRollOff = min(max(parameters.highlightRollOff * intensity, 0), 0.4)
        var output = image

        if fade > 0 {
            let blackLift = min(fade * 0.15, 0.075)
            let channelScale = 1 - blackLift
            output = try outputImage(named: "CIColorMatrix", values: [
                kCIInputImageKey: output,
                "inputRVector": CIVector(x: CGFloat(channelScale), y: 0, z: 0, w: 0),
                "inputGVector": CIVector(x: 0, y: CGFloat(channelScale), z: 0, w: 0),
                "inputBVector": CIVector(x: 0, y: 0, z: CGFloat(channelScale), w: 0),
                "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1),
                "inputBiasVector": CIVector(
                    x: CGFloat(blackLift),
                    y: CGFloat(blackLift),
                    z: CGFloat(blackLift),
                    w: 0
                )
            ])
        }

        if shadowLift > 0 || highlightRollOff > 0 {
            output = try outputImage(named: "CIHighlightShadowAdjust", values: [
                kCIInputImageKey: output,
                "inputHighlightAmount": max(0.7, 1 - highlightRollOff * 0.75),
                "inputShadowAmount": min(1, shadowLift * 1.8)
            ])
        }

        return output.cropped(to: image.extent)
    }

    private static func applyBloom(_ bloom: Double, to image: CIImage) throws -> CIImage {
        let safeBloom = min(max(bloom, 0), 0.3)
        guard safeBloom > 0 else { return image }

        return try outputImage(named: "CIBloom", values: [
            kCIInputImageKey: image,
            kCIInputRadiusKey: 3 + safeBloom * 20,
            kCIInputIntensityKey: safeBloom
        ]).cropped(to: image.extent)
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

    private static func applyDust(_ dust: Double, to image: CIImage) throws -> CIImage {
        let safeDust = min(max(dust, 0), 0.35)
        guard safeDust > 0 else { return image }
        guard let randomNoise = CIFilter(name: "CIRandomGenerator")?.outputImage else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        let monochromeNoise = try outputImage(named: "CIColorControls", values: [
            kCIInputImageKey: randomNoise,
            kCIInputSaturationKey: 0,
            kCIInputContrastKey: 1
        ])
        let sparseDefects = try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: monochromeNoise,
            "inputRVector": CIVector(x: 3, y: 0, z: 0, w: 0),
            "inputGVector": CIVector(x: 0, y: 3, z: 0, w: 0),
            "inputBVector": CIVector(x: 0, y: 0, z: 3, w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1),
            "inputBiasVector": CIVector(x: -2.55, y: -2.55, z: -2.55, w: 0)
        ]).cropped(to: image.extent)
        let specks = try applyingOpacity(min(safeDust * 0.24, 0.08), to: sparseDefects)
        let motionBlurred = try outputImage(named: "CIMotionBlur", values: [
            kCIInputImageKey: sparseDefects,
            kCIInputRadiusKey: 9,
            kCIInputAngleKey: CGFloat(Double.pi / 2)
        ]).cropped(to: image.extent)
        let scratches = try applyingOpacity(min(safeDust * 0.08, 0.026), to: motionBlurred)
        let imageWithSpecks = try outputImage(named: "CIScreenBlendMode", values: [
            kCIInputImageKey: specks,
            kCIInputBackgroundImageKey: image
        ]).cropped(to: image.extent)

        return try outputImage(named: "CIScreenBlendMode", values: [
            kCIInputImageKey: scratches,
            kCIInputBackgroundImageKey: imageWithSpecks
        ]).cropped(to: image.extent)
    }

    private static func applyingOpacity(_ opacity: Double, to image: CIImage) throws -> CIImage {
        try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: image,
            "inputRVector": CIVector(x: 1, y: 0, z: 0, w: 0),
            "inputGVector": CIVector(x: 0, y: 1, z: 0, w: 0),
            "inputBVector": CIVector(x: 0, y: 0, z: 1, w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: CGFloat(opacity)),
            "inputBiasVector": CIVector(x: 0, y: 0, z: 0, w: 0)
        ]).cropped(to: image.extent)
    }

    private static func applyVignette(_ vignette: Double, to image: CIImage) throws -> CIImage {
        guard vignette > 0 else { return image }
        return try outputImage(named: "CIVignette", values: [
            kCIInputImageKey: image,
            kCIInputIntensityKey: vignette * 1.35,
            kCIInputRadiusKey: 1.8
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
