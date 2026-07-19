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
    private static let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    private static let maxPreviewLongEdge: CGFloat = 1600

    func render(image: UIImage, recipe: GeneratedFilterRecipe, intensity: Double) async throws -> UIImage {
        let safeRecipe = FilterRecipeValidator.validated(recipe)
        let safeIntensity = min(max(intensity.isFinite ? intensity : 1, 0), 1)

        return try await withCheckedThrowingContinuation { continuation in
            Self.renderQueue.async {
                do {
                    let renderedImage = try Self.renderSynchronously(
                        image: image,
                        recipe: safeRecipe,
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
        recipe: GeneratedFilterRecipe,
        intensity: Double
    ) throws -> UIImage {
        let normalizedImage = image
            .resizedForGeneratedFilterRendering(maxLongEdge: maxPreviewLongEdge)
            .normalizedForGeneratedFilterRendering()
        guard var outputImage = CIImage(image: normalizedImage) else {
            throw GeneratedFilterPreviewError.renderFailed
        }
        let sourceImage = outputImage
        let parameters = recipe.parameters

        defer {
            context.clearCaches()
        }

        if intensity > 0.0001 {
            let effectIntensity = 1.0
            outputImage = try applyInputNormalization(
                recipe.colorTransform.inputNormalizationStrength,
                to: outputImage
            )
            outputImage = try applyExposure(parameters.exposure, to: outputImage)
            outputImage = try applyColorControls(parameters, intensity: effectIntensity, to: outputImage)
            outputImage = try applyTemperature(parameters, intensity: effectIntensity, to: outputImage)
            outputImage = try applyTone(parameters, intensity: effectIntensity, to: outputImage)
            outputImage = try applyColorTransform(recipe.colorTransform, intensity: effectIntensity, to: outputImage)
            outputImage = try applyBloom(parameters.bloom, to: outputImage)
            outputImage = try applyDiffusion(recipe.film.diffusion, to: outputImage)
            outputImage = try applyHalation(recipe.film, intensity: effectIntensity, to: outputImage)
            outputImage = try applyGrain(parameters.grain, film: recipe.film, to: outputImage)
            outputImage = try applyDust(parameters.dust, to: outputImage)
            outputImage = try applyVignette(parameters.vignette, to: outputImage)
            outputImage = try blend(source: sourceImage, filtered: outputImage, intensity: intensity)
        }

        let extent = outputImage.extent
        guard let cgImage = context.createCGImage(outputImage, from: extent) else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        return UIImage(cgImage: cgImage, scale: normalizedImage.scale, orientation: .up)
    }

    private static func blend(
        source: CIImage,
        filtered: CIImage,
        intensity: Double
    ) throws -> CIImage {
        let safeIntensity = min(max(intensity, 0), 1)
        if safeIntensity >= 0.9999 { return filtered }
        return try outputImage(named: "CIDissolveTransition", values: [
            kCIInputImageKey: source,
            "inputTargetImage": filtered,
            "inputTime": safeIntensity
        ]).cropped(to: source.extent)
    }

    private static func applyInputNormalization(_ strength: Double, to image: CIImage) throws -> CIImage {
        let safeStrength = min(max(strength, 0), 0.35)
        guard safeStrength > 0.0001,
              let averageLuminance = averageLuminance(of: image),
              averageLuminance > 0.02 else {
            return image
        }

        let target: Double
        if averageLuminance < 0.34 {
            target = 0.34
        } else if averageLuminance > 0.66 {
            target = 0.66
        } else {
            return image
        }
        let correctionEV = min(max(log2(target / averageLuminance) * safeStrength, -0.18), 0.18)
        return try applyExposure(correctionEV, to: image)
    }

    private static func averageLuminance(of image: CIImage) -> Double? {
        guard let filter = CIFilter(name: "CIAreaAverage") else { return nil }
        filter.setValue(image, forKey: kCIInputImageKey)
        filter.setValue(CIVector(cgRect: image.extent), forKey: kCIInputExtentKey)
        guard let averageImage = filter.outputImage else { return nil }

        var pixel = [UInt8](repeating: 0, count: 4)
        context.render(
            averageImage,
            toBitmap: &pixel,
            rowBytes: 4,
            bounds: CGRect(x: 0, y: 0, width: 1, height: 1),
            format: .RGBA8,
            colorSpace: sRGBColorSpace
        )
        let red = Double(pixel[0]) / 255
        let green = Double(pixel[1]) / 255
        let blue = Double(pixel[2]) / 255
        return red * 0.2126 + green * 0.7152 + blue * 0.0722
    }

    private static func applyColorTransform(
        _ transform: GeneratedFilterColorTransform,
        intensity: Double,
        to image: CIImage
    ) throws -> CIImage {
        let safeStrength = min(max(transform.styleIntensity * intensity, 0), 1)
        guard safeStrength > 0.0001 else { return image }
        return try outputImage(named: "CIColorCubeWithColorSpace", values: [
            kCIInputImageKey: image,
            "inputCubeDimension": GeneratedFilterColorCubeBuilder.dimension,
            "inputCubeData": GeneratedFilterColorCubeBuilder.data(transform: transform, intensity: intensity),
            "inputColorSpace": sRGBColorSpace
        ]).cropped(to: image.extent)
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
                "inputShadowAmount": min(0.22, shadowLift * 0.55)
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

    private static func applyDiffusion(_ diffusion: Double, to image: CIImage) throws -> CIImage {
        let safeDiffusion = min(max(diffusion, 0), 0.25)
        guard safeDiffusion > 0.0001 else { return image }

        let blurred = try outputImage(named: "CIGaussianBlur", values: [
            kCIInputImageKey: image,
            kCIInputRadiusKey: 1.2 + safeDiffusion * 18
        ]).cropped(to: image.extent)
        let translucentBlur = try applyingOpacity(min(safeDiffusion * 0.72, 0.18), to: blurred)
        return try outputImage(named: "CISourceOverCompositing", values: [
            kCIInputImageKey: translucentBlur,
            kCIInputBackgroundImageKey: image
        ]).cropped(to: image.extent)
    }

    private static func applyHalation(
        _ film: GeneratedFilmParameterSet,
        intensity: Double,
        to image: CIImage
    ) throws -> CIImage {
        let strength = min(max(film.halationStrength * intensity, 0), 0.25)
        guard strength > 0.0001 else { return image }

        let luminance = try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: image,
            "inputRVector": CIVector(x: 0.2126, y: 0.7152, z: 0.0722, w: 0),
            "inputGVector": CIVector(x: 0.2126, y: 0.7152, z: 0.0722, w: 0),
            "inputBVector": CIVector(x: 0.2126, y: 0.7152, z: 0.0722, w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1),
            "inputBiasVector": CIVector(x: 0, y: 0, z: 0, w: 0)
        ]).cropped(to: image.extent)
        let highlightIsolation = try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: luminance,
            "inputRVector": CIVector(x: 5, y: 0, z: 0, w: 0),
            "inputGVector": CIVector(x: 0, y: 5, z: 0, w: 0),
            "inputBVector": CIVector(x: 0, y: 0, z: 5, w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1),
            "inputBiasVector": CIVector(x: -4, y: -4, z: -4, w: 0)
        ]).cropped(to: image.extent)
        let clampedHighlights = try outputImage(named: "CIColorClamp", values: [
            kCIInputImageKey: highlightIsolation,
            "inputMinComponents": CIVector(x: 0, y: 0, z: 0, w: 0),
            "inputMaxComponents": CIVector(x: 1, y: 1, z: 1, w: 1)
        ]).cropped(to: image.extent)
        let warmth = min(max(film.halationWarmth, 0), 1)
        let warmHighlights = try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: clampedHighlights,
            "inputRVector": CIVector(x: 1, y: 0, z: 0, w: 0),
            "inputGVector": CIVector(x: 0, y: CGFloat(1 - warmth * 0.36), z: 0, w: 0),
            "inputBVector": CIVector(x: 0, y: 0, z: CGFloat(1 - warmth * 0.78), w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1),
            "inputBiasVector": CIVector(x: 0, y: 0, z: 0, w: 0)
        ])
        let blurredHalo = try outputImage(named: "CIGaussianBlur", values: [
            kCIInputImageKey: warmHighlights,
            kCIInputRadiusKey: min(max(film.halationRadius, 2), 24)
        ]).cropped(to: image.extent)
        let translucentHalo = try applyingOpacity(min(strength * 1.15, 0.25), to: blurredHalo)
        return try outputImage(named: "CIScreenBlendMode", values: [
            kCIInputImageKey: translucentHalo,
            kCIInputBackgroundImageKey: image
        ]).cropped(to: image.extent)
    }

    private static func applyGrain(
        _ grain: Double,
        film: GeneratedFilmParameterSet,
        to image: CIImage
    ) throws -> CIImage {
        let safeGrain = min(max(grain, 0), 0.35)
        guard safeGrain > 0 else { return image }
        guard let randomNoise = CIFilter(name: "CIRandomGenerator")?.outputImage else {
            throw GeneratedFilterPreviewError.renderFailed
        }

        var shapedNoise = try outputImage(named: "CIColorControls", values: [
            kCIInputImageKey: randomNoise,
            kCIInputSaturationKey: 0,
            kCIInputContrastKey: 1.15 + min(max(film.grainRoughness, 0), 1) * 0.85
        ])
        let grainBlurRadius = max(0, (min(max(film.grainSize, 0.6), 2.2) - 0.6) * 0.55)
        if grainBlurRadius > 0.001 {
            shapedNoise = try outputImage(named: "CIGaussianBlur", values: [
                kCIInputImageKey: shapedNoise,
                kCIInputRadiusKey: grainBlurRadius
            ])
        }
        let opacity = min(safeGrain * 0.5, 0.18)
        let translucentNoise = try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: shapedNoise,
            "inputRVector": CIVector(x: 1, y: 0, z: 0, w: 0),
            "inputGVector": CIVector(x: 0, y: 1, z: 0, w: 0),
            "inputBVector": CIVector(x: 0, y: 0, z: 1, w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: CGFloat(opacity)),
            "inputBiasVector": CIVector(x: 0, y: 0, z: 0, w: 0)
        ]).cropped(to: image.extent)

        let grainComposite = try outputImage(named: "CISoftLightBlendMode", values: [
            kCIInputImageKey: translucentNoise,
            kCIInputBackgroundImageKey: image
        ]).cropped(to: image.extent)

        let response = min(max(film.grainLumaResponse, -1), 1)
        guard abs(response) > 0.001 else { return grainComposite }
        let coefficient: Double
        let bias: Double
        if response > 0 {
            coefficient = -0.65 * response
            bias = 1
        } else {
            coefficient = -0.65 * response
            bias = 1 + 0.65 * response
        }
        let mask = try luminanceMask(image, coefficient: coefficient, bias: bias)
        return try outputImage(named: "CIBlendWithMask", values: [
            kCIInputImageKey: grainComposite,
            kCIInputBackgroundImageKey: image,
            kCIInputMaskImageKey: mask
        ]).cropped(to: image.extent)
    }

    private static func luminanceMask(
        _ image: CIImage,
        coefficient: Double,
        bias: Double
    ) throws -> CIImage {
        let red = 0.2126 * coefficient
        let green = 0.7152 * coefficient
        let blue = 0.0722 * coefficient
        return try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: image,
            "inputRVector": CIVector(x: CGFloat(red), y: CGFloat(green), z: CGFloat(blue), w: 0),
            "inputGVector": CIVector(x: CGFloat(red), y: CGFloat(green), z: CGFloat(blue), w: 0),
            "inputBVector": CIVector(x: CGFloat(red), y: CGFloat(green), z: CGFloat(blue), w: 0),
            "inputAVector": CIVector(x: 0, y: 0, z: 0, w: 1),
            "inputBiasVector": CIVector(x: CGFloat(bias), y: CGFloat(bias), z: CGFloat(bias), w: 0)
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
