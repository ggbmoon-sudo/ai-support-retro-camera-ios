import CoreImage
import UIKit

nonisolated enum FilterPipelineError: LocalizedError {
    case renderFailed

    var errorDescription: String? {
        switch self {
        case .renderFailed:
            return NSLocalizedString("filters.error.render_failed", comment: "")
        }
    }
}

nonisolated final class FilterPipeline {
    private static let renderQueue = DispatchQueue(label: "app.ai-photo.filters.render", qos: .userInitiated)
    private static let context = CIContext(options: [.cacheIntermediates: true])

    func render(image: UIImage, preset: FilterPreset) async throws -> UIImage {
        guard !preset.isOriginal else { return image }

        return try await withCheckedThrowingContinuation { continuation in
            Self.renderQueue.async {
                do {
                    let renderedImage = try Self.renderSynchronously(image: image, preset: preset)
                    continuation.resume(returning: renderedImage)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }

    private static func renderSynchronously(image: UIImage, preset: FilterPreset) throws -> UIImage {
        let normalizedImage = image.normalizedForFilterRendering()
        guard var outputImage = CIImage(image: normalizedImage) else {
            throw FilterPipelineError.renderFailed
        }

        for adjustment in preset.adjustments {
            outputImage = try apply(adjustment, to: outputImage)
        }

        let extent = outputImage.extent
        guard let cgImage = context.createCGImage(outputImage, from: extent) else {
            throw FilterPipelineError.renderFailed
        }

        return UIImage(cgImage: cgImage, scale: normalizedImage.scale, orientation: .up)
    }

    private static func apply(_ adjustment: FilterAdjustment, to image: CIImage) throws -> CIImage {
        let filterName: String
        let values: [(String, Any)]

        switch adjustment {
        case .exposure(let ev):
            filterName = "CIExposureAdjust"
            values = [
                (kCIInputImageKey, image),
                (kCIInputEVKey, ev)
            ]
        case let .temperatureAndTint(neutralX, neutralY, targetNeutralX, targetNeutralY):
            filterName = "CITemperatureAndTint"
            values = [
                (kCIInputImageKey, image),
                ("inputNeutral", CIVector(x: neutralX, y: neutralY)),
                ("inputTargetNeutral", CIVector(x: targetNeutralX, y: targetNeutralY))
            ]
        case let .colorControls(saturation, brightness, contrast):
            filterName = "CIColorControls"
            values = [
                (kCIInputImageKey, image),
                (kCIInputSaturationKey, saturation),
                (kCIInputBrightnessKey, brightness),
                (kCIInputContrastKey, contrast)
            ]
        case .toneCurve(let points):
            guard points.count == 5 else {
                throw FilterPipelineError.renderFailed
            }
            filterName = "CIToneCurve"
            values = [
                (kCIInputImageKey, image),
                ("inputPoint0", CIVector(x: points[0].x, y: points[0].y)),
                ("inputPoint1", CIVector(x: points[1].x, y: points[1].y)),
                ("inputPoint2", CIVector(x: points[2].x, y: points[2].y)),
                ("inputPoint3", CIVector(x: points[3].x, y: points[3].y)),
                ("inputPoint4", CIVector(x: points[4].x, y: points[4].y))
            ]
        case let .vignette(intensity, radius):
            filterName = "CIVignette"
            values = [
                (kCIInputImageKey, image),
                (kCIInputIntensityKey, intensity),
                (kCIInputRadiusKey, radius)
            ]
        case .sharpen(let sharpness):
            filterName = "CISharpenLuminance"
            values = [
                (kCIInputImageKey, image),
                (kCIInputSharpnessKey, sharpness)
            ]
        }

        guard let filter = CIFilter(name: filterName) else {
            throw FilterPipelineError.renderFailed
        }

        values.forEach { key, value in
            filter.setValue(value, forKey: key)
        }

        guard let outputImage = filter.outputImage else {
            throw FilterPipelineError.renderFailed
        }

        return outputImage
    }
}

private extension UIImage {
    nonisolated func normalizedForFilterRendering() -> UIImage {
        guard imageOrientation != .up else { return self }

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = scale
        format.opaque = false

        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }
}
