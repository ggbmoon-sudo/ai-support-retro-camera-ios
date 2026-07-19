import CoreImage
import UIKit

enum GeneratedFilterPreviewError: LocalizedError {
    case renderFailed

    var errorDescription: String? {
        NSLocalizedString("filter_lab.error.preview_failed", comment: "")
    }
}

nonisolated final class GeneratedFilterPreviewRenderer {
    private struct LuminancePixelSample {
        let luminance: Double
        let color: SIMD3<Double>
    }

    private struct ShadowChromaEvidence {
        let absolute: Double
        let relative: Double
    }

    private struct LuminanceSampleGrid {
        let width: Int
        let height: Int
        let values: [Double]
        let colors: [SIMD3<Double>]
        let alpha: [Double]

        var averageOpaqueLuminance: Double? {
            guard values.count == alpha.count else { return nil }
            var total = 0.0
            var count = 0
            for index in values.indices where alpha[index] >= 0.95 {
                total += values[index]
                count += 1
            }
            return count > 0 ? total / Double(count) : nil
        }

        func percentile(
            _ fraction: Double,
            tileX: Int,
            tileY: Int,
            tileCount: Int
        ) -> Double? {
            sample(
                fraction,
                tileX: tileX,
                tileY: tileY,
                tileCount: tileCount
            )?.luminance
        }

        func sample(
            _ fraction: Double,
            tileX: Int,
            tileY: Int,
            tileCount: Int
        ) -> LuminancePixelSample? {
            guard let sampleIndexes = sortedOpaqueSampleIndexes(
                tileX: tileX,
                tileY: tileY,
                tileCount: tileCount
            ) else { return nil }
            let safeFraction = min(max(fraction, 0), 1)
            let index = min(
                sampleIndexes.count - 1,
                max(0, Int((Double(sampleIndexes.count - 1) * safeFraction).rounded()))
            )
            let pixelIndex = sampleIndexes[index]
            return LuminancePixelSample(
                luminance: values[pixelIndex],
                color: colors[pixelIndex]
            )
        }

        func shadowChromaEvidence(
            upperFraction: Double,
            tileX: Int,
            tileY: Int,
            tileCount: Int
        ) -> ShadowChromaEvidence? {
            guard let sampleIndexes = sortedOpaqueSampleIndexes(
                tileX: tileX,
                tileY: tileY,
                tileCount: tileCount
            ) else { return nil }

            let safeFraction = min(max(upperFraction, 0.05), 1)
            let shadowSampleCount = min(
                sampleIndexes.count,
                max(4, Int(ceil(Double(sampleIndexes.count) * safeFraction)))
            )
            var absoluteChromaValues: [Double] = []
            var relativeChromaValues: [Double] = []
            absoluteChromaValues.reserveCapacity(shadowSampleCount)
            relativeChromaValues.reserveCapacity(shadowSampleCount)
            for index in sampleIndexes.prefix(shadowSampleCount) {
                let color = colors[index]
                let maximum = max(color.x, max(color.y, color.z))
                let minimum = min(color.x, min(color.y, color.z))
                let absolute = maximum - minimum
                absoluteChromaValues.append(absolute)
                relativeChromaValues.append(absolute / max(maximum, 0.02))
            }
            absoluteChromaValues.sort()
            relativeChromaValues.sort()
            let medianIndex = (absoluteChromaValues.count - 1) / 2
            return ShadowChromaEvidence(
                absolute: absoluteChromaValues[medianIndex],
                relative: relativeChromaValues[medianIndex]
            )
        }

        func shadowColors(
            upperFraction: Double,
            tileX: Int,
            tileY: Int,
            tileCount: Int
        ) -> [SIMD3<Double>]? {
            guard let sampleIndexes = sortedOpaqueSampleIndexes(
                tileX: tileX,
                tileY: tileY,
                tileCount: tileCount
            ) else { return nil }
            let safeFraction = min(max(upperFraction, 0.05), 1)
            let shadowSampleCount = min(
                sampleIndexes.count,
                max(4, Int(ceil(Double(sampleIndexes.count) * safeFraction)))
            )
            return sampleIndexes.prefix(shadowSampleCount).map { colors[$0] }
        }

        private func sortedOpaqueSampleIndexes(
            tileX: Int,
            tileY: Int,
            tileCount: Int
        ) -> [Int]? {
            guard tileCount > 0,
                  tileX >= 0,
                  tileY >= 0,
                  tileX < tileCount,
                  tileY < tileCount,
                  values.count == width * height,
                  colors.count == values.count,
                  alpha.count == values.count else {
                return nil
            }

            let lowerX = tileX * width / tileCount
            let upperX = (tileX + 1) * width / tileCount
            let lowerY = tileY * height / tileCount
            let upperY = (tileY + 1) * height / tileCount
            guard lowerX < upperX, lowerY < upperY else { return nil }

            var sampleIndexes: [Int] = []
            let tilePixelCount = (upperX - lowerX) * (upperY - lowerY)
            sampleIndexes.reserveCapacity(tilePixelCount)
            for y in lowerY..<upperY {
                for x in lowerX..<upperX {
                    let index = y * width + x
                    if alpha[index] >= 0.95 {
                        sampleIndexes.append(index)
                    }
                }
            }
            let minimumOpaqueSamples = max(4, Int(ceil(Double(tilePixelCount) * 0.75)))
            guard sampleIndexes.count >= minimumOpaqueSamples else { return nil }
            sampleIndexes.sort { values[$0] < values[$1] }
            return sampleIndexes
        }
    }

    private struct AdaptiveShadowCorrection {
        let toeLift: Double
        let tileWeights: [Double]
    }

    private static let renderQueue = DispatchQueue(label: "app.ai-photo.filter-lab.render", qos: .userInitiated)
    private static let context = CIContext(options: [.cacheIntermediates: false])
    private static let sRGBColorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    private static let maxPreviewLongEdge: CGFloat = 1600
    private static let adaptiveToneSampleLongEdge: CGFloat = 64
    private static let adaptiveToneTileCount = 6
    private static let adaptiveToneMaskPixelsPerTile = 24
    private static let adaptiveToneActivationFloor = 0.006
    private static let adaptiveToneMaximumShadowChroma = 0.12
    private static let adaptiveToneMaximumRelativeShadowChroma = 0.45
    private static let adaptiveToneMaximumSampleRelativeChroma = 0.55

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
            let sourceGrid = recipe.recipeVersion == "2.0"
                ? luminanceSampleGrid(of: sourceImage)
                : nil
            let normalizedInput = try applyInputNormalization(
                recipe.colorTransform.inputNormalizationStrength,
                sampledAverageLuminance: sourceGrid?.averageOpaqueLuminance,
                to: outputImage
            )
            outputImage = normalizedInput.image
            outputImage = try applyExposure(parameters.exposure, to: outputImage)
            outputImage = try applyColorControls(parameters, intensity: effectIntensity, to: outputImage)
            outputImage = try applyTemperature(parameters, intensity: effectIntensity, to: outputImage)
            outputImage = try applyTone(parameters, intensity: effectIntensity, to: outputImage)
            let colorCubeData = recipe.recipeVersion == "2.0"
                ? GeneratedFilterColorCubeBuilder.data(
                    transform: recipe.colorTransform,
                    intensity: effectIntensity
                )
                : nil
            outputImage = try applyColorTransform(
                recipe.colorTransform,
                intensity: effectIntensity,
                cubeData: colorCubeData,
                to: outputImage
            )
            outputImage = try applyAdaptiveShadowDetailGuard(
                recipe: recipe,
                normalizationExposure: normalizedInput.exposure,
                colorCubeData: colorCubeData,
                sourceGrid: sourceGrid,
                to: outputImage
            )
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

    private static func applyAdaptiveShadowDetailGuard(
        recipe: GeneratedFilterRecipe,
        normalizationExposure: Double,
        colorCubeData: Data?,
        sourceGrid: LuminanceSampleGrid?,
        to filtered: CIImage
    ) throws -> CIImage {
        guard recipe.recipeVersion == "2.0",
              let sourceGrid,
              let filteredGrid = luminanceSampleGrid(of: filtered) else {
            return filtered
        }

        guard let correction = try adaptiveShadowCorrection(
            recipe: recipe,
            normalizationExposure: normalizationExposure,
            colorCubeData: colorCubeData,
            sourceGrid: sourceGrid,
            filteredGrid: filteredGrid
        ) else {
            return filtered
        }

        let lifted = try outputImage(named: "CIColorCubeWithColorSpace", values: [
            kCIInputImageKey: filtered,
            "inputCubeDimension": GeneratedFilterColorCubeBuilder.dimension,
            "inputCubeData": GeneratedFilterColorCubeBuilder.adaptiveShadowDetailData(
                toeLift: correction.toeLift
            ),
            "inputColorSpace": sRGBColorSpace
        ]).cropped(to: filtered.extent)
        guard let mask = try adaptiveShadowMask(
            tileWeights: correction.tileWeights,
            extent: filtered.extent
        ) else {
            return filtered
        }
        return try outputImage(named: "CIBlendWithMask", values: [
            kCIInputImageKey: lifted,
            kCIInputBackgroundImageKey: filtered,
            kCIInputMaskImageKey: mask
        ]).cropped(to: filtered.extent)
    }

    private static func adaptiveShadowCorrection(
        recipe: GeneratedFilterRecipe,
        normalizationExposure: Double,
        colorCubeData: Data?,
        sourceGrid: LuminanceSampleGrid,
        filteredGrid: LuminanceSampleGrid
    ) throws -> AdaptiveShadowCorrection? {
        var samples: [(
            index: Int,
            source: Double,
            sourceTileColors: [SIMD3<Double>],
            filtered: Double
        )] = []

        for tileY in 0..<adaptiveToneTileCount {
            for tileX in 0..<adaptiveToneTileCount {
                guard let sourceShadowSample = sourceGrid.sample(
                    0.10,
                    tileX: tileX,
                    tileY: tileY,
                    tileCount: adaptiveToneTileCount
                ),
                let sourceDetailPercentile = sourceGrid.percentile(
                    0.25,
                    tileX: tileX,
                    tileY: tileY,
                    tileCount: adaptiveToneTileCount
                ),
                let sourceShadowChroma = sourceGrid.shadowChromaEvidence(
                    upperFraction: 0.25,
                    tileX: tileX,
                    tileY: tileY,
                    tileCount: adaptiveToneTileCount
                ),
                let sourceTileColors = sourceGrid.shadowColors(
                    upperFraction: 1,
                    tileX: tileX,
                    tileY: tileY,
                    tileCount: adaptiveToneTileCount
                ),
                let filteredPercentile = filteredGrid.percentile(
                    0.10,
                    tileX: tileX,
                    tileY: tileY,
                    tileCount: adaptiveToneTileCount
                ),
                sourceShadowSample.luminance > 0.004,
                sourceShadowSample.luminance <= 0.38,
                sourceDetailPercentile - sourceShadowSample.luminance >= 0.018,
                sourceShadowChroma.absolute <= adaptiveToneMaximumShadowChroma,
                sourceShadowChroma.relative <= adaptiveToneMaximumRelativeShadowChroma,
                relativeChroma(of: sourceShadowSample.color)
                    <= adaptiveToneMaximumSampleRelativeChroma else {
                    continue
                }

                samples.append((
                    index: tileY * adaptiveToneTileCount + tileX,
                    source: sourceShadowSample.luminance,
                    sourceTileColors: sourceTileColors,
                    filtered: filteredPercentile
                ))
            }
        }

        guard samples.count >= 3,
              let fullStylePercentiles = try fullStyleShadowLuminances(
                samples.map { $0.sourceTileColors },
                recipe: recipe,
                normalizationExposure: normalizationExposure,
                colorCubeData: colorCubeData
              ),
              fullStylePercentiles.count == samples.count else {
            return nil
        }
        let primaryPercentiles = samples.map { sample in
            primaryShadowLuminance(
                sample.source,
                recipe: recipe,
                normalizationExposure: normalizationExposure
            )
        }
        let legacyAdjustedPercentiles = samples.map { sample in
            legacyAdjustedShadowLuminance(
                sample.source,
                recipe: recipe,
                normalizationExposure: normalizationExposure
            )
        }

        let colorVariationAllowance = 0.006
            + abs(recipe.parameters.temperature) * 0.006
            + abs(recipe.parameters.tint) * 0.004
        var tileDamage = [Double](
            repeating: 0,
            count: adaptiveToneTileCount * adaptiveToneTileCount
        )
        var eligibleDamage: [Double] = []

        for (sampleIndex, sample) in samples.enumerated() {
            let legacyDensityAllowance = min(
                max(primaryPercentiles[sampleIndex] - legacyAdjustedPercentiles[sampleIndex], 0),
                0.016
            )
            let colorStyleDensityAllowance = min(
                max(legacyAdjustedPercentiles[sampleIndex] - fullStylePercentiles[sampleIndex], 0),
                0.020
            )
            let declaredStyleDensityAllowance = min(
                legacyDensityAllowance + colorStyleDensityAllowance,
                0.034
            )
            let rawDamage = max(
                0,
                primaryPercentiles[sampleIndex]
                    - declaredStyleDensityAllowance
                    - colorVariationAllowance
                    - sample.filtered
            )
            tileDamage[sample.index] = rawDamage
            eligibleDamage.append(rawDamage)
        }

        let significantDamageCount = eligibleDamage.filter {
            $0 > adaptiveToneActivationFloor
        }.count
        guard significantDamageCount >= 2 else { return nil }

        eligibleDamage.sort()
        let robustIndex = min(
            eligibleDamage.count - 1,
            Int(floor(Double(eligibleDamage.count - 1) * 0.75))
        )
        let robustDamage = eligibleDamage[robustIndex]
        guard robustDamage > adaptiveToneActivationFloor else { return nil }

        let effectiveDamage = robustDamage - adaptiveToneActivationFloor
        let toeLift = min(max(effectiveDamage * 0.90, 0), 0.045)
        guard toeLift > 0.004 else { return nil }

        let weightScale = max(effectiveDamage, 0.001)
        let tileWeights = tileDamage.map { damage in
            smoothstep(
                lower: 0,
                upper: 1,
                value: max(0, damage - adaptiveToneActivationFloor) / weightScale
            )
        }
        return AdaptiveShadowCorrection(toeLift: toeLift, tileWeights: tileWeights)
    }

    private static func primaryShadowLuminance(
        _ sourceLuminance: Double,
        recipe: GeneratedFilterRecipe,
        normalizationExposure: Double
    ) -> Double {
        let normalizedLuminance = min(max(
            sourceLuminance * pow(2, normalizationExposure),
            0
        ), 1)
        let curved = interpolatedCurveValue(
            normalizedLuminance,
            curve: recipe.colorTransform.lumaCurve
        )
        let styleIntensity = min(max(recipe.colorTransform.styleIntensity, 0), 1)
        return min(max(
            normalizedLuminance + (curved - normalizedLuminance) * styleIntensity,
            0
        ), 1)
    }

    private static func legacyAdjustedShadowLuminance(
        _ sourceLuminance: Double,
        recipe: GeneratedFilterRecipe,
        normalizationExposure: Double
    ) -> Double {
        let parameters = recipe.parameters
        var value = min(max(
            sourceLuminance * pow(2, normalizationExposure + parameters.exposure),
            0
        ), 1)
        value = min(max((value - 0.5) * (1 + parameters.contrast) + 0.5, 0), 1)

        let blackLift = min(max(parameters.fade * 0.15, 0), 0.075)
        value = value * (1 - blackLift) + blackLift
        value += (1 - value) * min(max(parameters.shadowLift * 0.08, 0), 0.032)
        value = min(max(value, 0), 1)

        let curved = interpolatedCurveValue(value, curve: recipe.colorTransform.lumaCurve)
        let styleIntensity = min(max(recipe.colorTransform.styleIntensity, 0), 1)
        return min(max(value + (curved - value) * styleIntensity, 0), 1)
    }

    private static func relativeChroma(of color: SIMD3<Double>) -> Double {
        let maximum = max(color.x, max(color.y, color.z))
        let minimum = min(color.x, min(color.y, color.z))
        return (maximum - minimum) / max(maximum, 0.02)
    }

    private static func interpolatedCurveValue(_ value: Double, curve: [Double]) -> Double {
        guard curve.count == 5 else { return value }
        let safeValue = min(max(value, 0), 1)
        if safeValue >= 1 { return curve[4] }
        let scaled = safeValue * 4
        let lowerIndex = min(Int(floor(scaled)), 3)
        let fraction = scaled - Double(lowerIndex)
        return curve[lowerIndex] + (curve[lowerIndex + 1] - curve[lowerIndex]) * fraction
    }

    private static func fullStyleShadowLuminances(
        _ sourceColorGroups: [[SIMD3<Double>]],
        recipe: GeneratedFilterRecipe,
        normalizationExposure: Double,
        colorCubeData: Data?
    ) throws -> [Double]? {
        guard !sourceColorGroups.isEmpty,
              sourceColorGroups.allSatisfy({ !$0.isEmpty }) else { return [] }
        var sourceColors: [SIMD3<Double>] = []
        var groupRanges: [Range<Int>] = []
        for group in sourceColorGroups {
            let lowerBound = sourceColors.count
            sourceColors.append(contentsOf: group)
            groupRanges.append(lowerBound..<sourceColors.count)
        }
        var inputPixels: [UInt8] = []
        inputPixels.reserveCapacity(sourceColors.count * 4)
        for color in sourceColors {
            inputPixels.append(UInt8((min(max(color.x, 0), 1) * 255).rounded()))
            inputPixels.append(UInt8((min(max(color.y, 0), 1) * 255).rounded()))
            inputPixels.append(UInt8((min(max(color.z, 0), 1) * 255).rounded()))
            inputPixels.append(255)
        }

        let sampleSize = CGSize(width: CGFloat(sourceColors.count), height: 1)
        var intended = CIImage(
            bitmapData: Data(inputPixels),
            bytesPerRow: sourceColors.count * 4,
            size: sampleSize,
            format: .RGBA8,
            colorSpace: sRGBColorSpace
        )
        let parameters = recipe.parameters
        if abs(normalizationExposure) > 0.0001 {
            intended = try applyExposure(normalizationExposure, to: intended)
        }
        intended = try applyExposure(parameters.exposure, to: intended)
        intended = try applyColorControls(parameters, intensity: 1, to: intended)
        intended = try applyTemperature(parameters, intensity: 1, to: intended)
        intended = try applyFade(parameters.fade, to: intended)
        intended = try applyColorTransform(
            recipe.colorTransform,
            intensity: 1,
            cubeData: colorCubeData,
            to: intended
        )

        let bounds = CGRect(origin: .zero, size: sampleSize)
        var outputPixels = [UInt8](repeating: 0, count: sourceColors.count * 4)
        context.render(
            intended,
            toBitmap: &outputPixels,
            rowBytes: sourceColors.count * 4,
            bounds: bounds,
            format: .RGBA8,
            colorSpace: sRGBColorSpace
        )
        let luminances = sourceColors.indices.map { index in
            let offset = index * 4
            let red = Double(outputPixels[offset]) / 255
            let green = Double(outputPixels[offset + 1]) / 255
            let blue = Double(outputPixels[offset + 2]) / 255
            return red * 0.2126 + green * 0.7152 + blue * 0.0722
        }
        return groupRanges.map { range in
            var values = range.map { luminances[$0] }
            values.sort()
            let percentileIndex = min(
                values.count - 1,
                max(0, Int((Double(values.count - 1) * 0.10).rounded()))
            )
            return values[percentileIndex]
        }
    }

    private static func adaptiveShadowMask(
        tileWeights: [Double],
        extent: CGRect
    ) throws -> CIImage? {
        let tileCount = adaptiveToneTileCount
        let maskDimension = tileCount * adaptiveToneMaskPixelsPerTile
        guard tileWeights.count == tileCount * tileCount,
              extent.width.isFinite,
              extent.height.isFinite,
              extent.width > 0,
              extent.height > 0 else {
            return nil
        }

        var maskPixels: [UInt8] = []
        maskPixels.reserveCapacity(maskDimension * maskDimension * 4)
        for pixelY in 0..<maskDimension {
            let tileY = min(pixelY / adaptiveToneMaskPixelsPerTile, tileCount - 1)
            for pixelX in 0..<maskDimension {
                let tileX = min(pixelX / adaptiveToneMaskPixelsPerTile, tileCount - 1)
                let weight = tileWeights[tileY * tileCount + tileX]
                let channel = UInt8((min(max(weight, 0), 1) * 255).rounded())
                maskPixels.append(channel)
                maskPixels.append(channel)
                maskPixels.append(channel)
                maskPixels.append(255)
            }
        }
        let maskSize = CGSize(width: CGFloat(maskDimension), height: CGFloat(maskDimension))
        let tileMask = CIImage(
            bitmapData: Data(maskPixels),
            bytesPerRow: maskDimension * 4,
            size: maskSize,
            format: .RGBA8,
            colorSpace: sRGBColorSpace
        )
        guard let scaleFilter = CIFilter(name: "CILanczosScaleTransform") else { return nil }
        scaleFilter.setValue(tileMask, forKey: kCIInputImageKey)
        scaleFilter.setValue(extent.height / CGFloat(maskDimension), forKey: "inputScale")
        scaleFilter.setValue(extent.width / extent.height, forKey: "inputAspectRatio")
        guard let scaledMask = scaleFilter.outputImage else { return nil }
        let alignedMask = scaledMask.transformed(by: CGAffineTransform(
            translationX: extent.minX - scaledMask.extent.minX,
            y: extent.minY - scaledMask.extent.minY
        ))
        let featherRadius = min(max(min(extent.width, extent.height) / 320, 2), 6)
        let featheredMask = try outputImage(named: "CIGaussianBlur", values: [
            kCIInputImageKey: alignedMask.clampedToExtent(),
            kCIInputRadiusKey: featherRadius
        ]).cropped(to: extent)
        return try outputImage(named: "CIColorClamp", values: [
            kCIInputImageKey: featheredMask,
            "inputMinComponents": CIVector(x: 0, y: 0, z: 0, w: 0),
            "inputMaxComponents": CIVector(x: 1, y: 1, z: 1, w: 1)
        ]).cropped(to: extent)
    }

    private static func smoothstep(lower: Double, upper: Double, value: Double) -> Double {
        guard upper > lower else { return value >= upper ? 1 : 0 }
        let t = min(max((value - lower) / (upper - lower), 0), 1)
        return t * t * (3 - 2 * t)
    }

    private static func luminanceSampleGrid(of image: CIImage) -> LuminanceSampleGrid? {
        let extent = image.extent
        guard extent.width.isFinite,
              extent.height.isFinite,
              extent.width > 0,
              extent.height > 0 else {
            return nil
        }

        let translated = image.transformed(by: CGAffineTransform(
            translationX: -extent.minX,
            y: -extent.minY
        ))
        let scale = min(1, adaptiveToneSampleLongEdge / max(extent.width, extent.height))
        guard let filter = CIFilter(name: "CILanczosScaleTransform") else { return nil }
        filter.setValue(translated, forKey: kCIInputImageKey)
        filter.setValue(scale, forKey: "inputScale")
        filter.setValue(1, forKey: "inputAspectRatio")
        guard let sampledImage = filter.outputImage else { return nil }

        let sampleBounds = sampledImage.extent.integral
        let width = max(1, Int(sampleBounds.width))
        let height = max(1, Int(sampleBounds.height))
        var pixels = [UInt8](repeating: 0, count: width * height * 4)
        context.render(
            sampledImage,
            toBitmap: &pixels,
            rowBytes: width * 4,
            bounds: sampleBounds,
            format: .RGBA8,
            colorSpace: sRGBColorSpace
        )

        var luminance: [Double] = []
        var colors: [SIMD3<Double>] = []
        var alpha: [Double] = []
        luminance.reserveCapacity(width * height)
        colors.reserveCapacity(width * height)
        alpha.reserveCapacity(width * height)
        for pixelIndex in 0..<(width * height) {
            let offset = pixelIndex * 4
            let red = Double(pixels[offset]) / 255
            let green = Double(pixels[offset + 1]) / 255
            let blue = Double(pixels[offset + 2]) / 255
            luminance.append(red * 0.2126 + green * 0.7152 + blue * 0.0722)
            colors.append(SIMD3<Double>(red, green, blue))
            alpha.append(Double(pixels[offset + 3]) / 255)
        }
        return LuminanceSampleGrid(
            width: width,
            height: height,
            values: luminance,
            colors: colors,
            alpha: alpha
        )
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

    private static func applyInputNormalization(
        _ strength: Double,
        sampledAverageLuminance: Double?,
        to image: CIImage
    ) throws -> (image: CIImage, exposure: Double) {
        let safeStrength = min(max(strength, 0), 0.35)
        guard safeStrength > 0.0001,
              let averageLuminance = sampledAverageLuminance ?? averageLuminance(of: image),
              averageLuminance > 0.02 else {
            return (image, 0)
        }

        let target: Double
        if averageLuminance < 0.34 {
            target = 0.34
        } else if averageLuminance > 0.66 {
            target = 0.66
        } else {
            return (image, 0)
        }
        let correctionEV = min(max(log2(target / averageLuminance) * safeStrength, -0.18), 0.18)
        return (try applyExposure(correctionEV, to: image), correctionEV)
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
        cubeData: Data?,
        to image: CIImage
    ) throws -> CIImage {
        let safeStrength = min(max(transform.styleIntensity * intensity, 0), 1)
        guard safeStrength > 0.0001 else { return image }
        return try outputImage(named: "CIColorCubeWithColorSpace", values: [
            kCIInputImageKey: image,
            "inputCubeDimension": GeneratedFilterColorCubeBuilder.dimension,
            "inputCubeData": cubeData
                ?? GeneratedFilterColorCubeBuilder.data(transform: transform, intensity: intensity),
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
        var output = try applyFade(fade, to: image)

        if shadowLift > 0 || highlightRollOff > 0 {
            output = try outputImage(named: "CIHighlightShadowAdjust", values: [
                kCIInputImageKey: output,
                "inputHighlightAmount": max(0.7, 1 - highlightRollOff * 0.75),
                "inputShadowAmount": min(0.22, shadowLift * 0.55)
            ])
        }

        return output.cropped(to: image.extent)
    }

    private static func applyFade(_ fade: Double, to image: CIImage) throws -> CIImage {
        let safeFade = min(max(fade, 0), 0.5)
        guard safeFade > 0 else { return image }
        let blackLift = min(safeFade * 0.15, 0.075)
        let channelScale = 1 - blackLift
        return try outputImage(named: "CIColorMatrix", values: [
            kCIInputImageKey: image,
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
        ]).cropped(to: image.extent)
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
