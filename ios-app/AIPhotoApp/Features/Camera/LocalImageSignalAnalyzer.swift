import CoreGraphics
import UIKit

enum LocalImageSignalAnalyzer {
    static func analyze(_ image: UIImage) -> LocalImageSignalContext {
        guard let cgImage = image.cgImage else {
            return .unknown
        }
        guard cgImage.width >= 4,
              cgImage.height >= 4 else {
            return .unknown
        }

        let sampleWidth = 32
        let sampleHeight = 32
        var pixels = [UInt8](repeating: 0, count: sampleWidth * sampleHeight * 4)
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue

        let drewImage = pixels.withUnsafeMutableBytes { buffer in
            guard let context = CGContext(
                data: buffer.baseAddress,
                width: sampleWidth,
                height: sampleHeight,
                bitsPerComponent: 8,
                bytesPerRow: sampleWidth * 4,
                space: colorSpace,
                bitmapInfo: bitmapInfo
            ) else {
                return false
            }

            context.interpolationQuality = .low
            context.draw(cgImage, in: CGRect(x: 0, y: 0, width: sampleWidth, height: sampleHeight))
            return true
        }

        guard drewImage else {
            return .unknown
        }

        var luminanceValues: [Double] = []
        luminanceValues.reserveCapacity(sampleWidth * sampleHeight)
        var saturationTotal = 0.0
        var warmthTotal = 0.0

        for index in stride(from: 0, to: pixels.count, by: 4) {
            let red = Double(pixels[index]) / 255.0
            let green = Double(pixels[index + 1]) / 255.0
            let blue = Double(pixels[index + 2]) / 255.0
            let maxChannel = max(red, green, blue)
            let minChannel = min(red, green, blue)
            let luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue

            luminanceValues.append(luminance)
            saturationTotal += maxChannel == 0 ? 0 : (maxChannel - minChannel) / maxChannel
            warmthTotal += red - blue
        }

        guard !luminanceValues.isEmpty else {
            return .unknown
        }

        let count = Double(luminanceValues.count)
        let averageLuminance = luminanceValues.reduce(0, +) / count
        let variance = luminanceValues
            .map { pow($0 - averageLuminance, 2) }
            .reduce(0, +) / count
        let contrast = sqrt(variance)
        let saturation = saturationTotal / count
        let warmth = warmthTotal / count
        let edgeEnergy = averageEdgeEnergy(
            luminanceValues: luminanceValues,
            width: sampleWidth,
            height: sampleHeight
        )

        return LocalImageSignalContext(
            brightness: brightnessBucket(averageLuminance),
            contrast: signalBucket(contrast, low: 0.12, high: 0.24),
            saturation: signalBucket(saturation, low: 0.16, high: 0.38),
            blurRisk: blurRiskBucket(edgeEnergy: edgeEnergy, contrast: contrast),
            warmth: warmthBucket(warmth),
            clutter: clutterBucket(edgeEnergy: edgeEnergy, contrast: contrast)
        )
    }

    private static func averageEdgeEnergy(
        luminanceValues: [Double],
        width: Int,
        height: Int
    ) -> Double {
        var total = 0.0
        var comparisons = 0.0

        for y in 0..<height {
            for x in 0..<width {
                let index = y * width + x

                if x + 1 < width {
                    total += abs(luminanceValues[index] - luminanceValues[index + 1])
                    comparisons += 1
                }

                if y + 1 < height {
                    total += abs(luminanceValues[index] - luminanceValues[index + width])
                    comparisons += 1
                }
            }
        }

        guard comparisons > 0 else { return 0 }
        return total / comparisons
    }

    private static func brightnessBucket(_ luminance: Double) -> LocalImageSignalBucket {
        signalBucket(luminance, low: 0.33, high: 0.68)
    }

    private static func signalBucket(
        _ value: Double,
        low: Double,
        high: Double
    ) -> LocalImageSignalBucket {
        guard value.isFinite else {
            return .unknown
        }

        if value < low {
            return .low
        }

        if value > high {
            return .high
        }

        return .medium
    }

    private static func blurRiskBucket(
        edgeEnergy: Double,
        contrast: Double
    ) -> LocalImageSignalBucket {
        guard edgeEnergy.isFinite,
              contrast.isFinite else {
            return .unknown
        }

        if edgeEnergy < 0.035 && contrast < 0.18 {
            return .high
        }

        if edgeEnergy < 0.07 {
            return .medium
        }

        return .low
    }

    private static func warmthBucket(_ warmth: Double) -> LocalImageWarmth {
        guard warmth.isFinite else {
            return .unknown
        }

        if warmth < -0.045 {
            return .cool
        }

        if warmth > 0.045 {
            return .warm
        }

        return .neutral
    }

    private static func clutterBucket(
        edgeEnergy: Double,
        contrast: Double
    ) -> LocalImageSignalBucket {
        guard edgeEnergy.isFinite,
              contrast.isFinite else {
            return .unknown
        }

        if edgeEnergy > 0.13 && contrast > 0.2 {
            return .high
        }

        if edgeEnergy > 0.075 || contrast > 0.16 {
            return .medium
        }

        return .low
    }
}
