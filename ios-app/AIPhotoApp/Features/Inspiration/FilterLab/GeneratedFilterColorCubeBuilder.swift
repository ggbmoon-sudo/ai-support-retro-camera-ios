import Foundation

nonisolated enum GeneratedFilterColorCubeBuilder {
    static let dimension = 17
    private static let fixedCurveX = [0.0, 0.25, 0.5, 0.75, 1.0]

    static func data(
        transform: GeneratedFilterColorTransform,
        intensity: Double
    ) -> Data {
        let safeIntensity = min(max(transform.styleIntensity * intensity, 0), 1)
        let weights = transform.basisLUTWeights
        var values: [Float] = []
        values.reserveCapacity(dimension * dimension * dimension * 4)

        for blueIndex in 0..<dimension {
            for greenIndex in 0..<dimension {
                for redIndex in 0..<dimension {
                    let input = SIMD3<Double>(
                        Double(redIndex) / Double(dimension - 1),
                        Double(greenIndex) / Double(dimension - 1),
                        Double(blueIndex) / Double(dimension - 1)
                    )
                    let curved = applyCurves(input, transform: transform)
                    let mapped = weightedBasisColor(curved, weights: weights)
                    let output = clamp(input + (mapped - input) * safeIntensity)
                    values.append(Float(output.x))
                    values.append(Float(output.y))
                    values.append(Float(output.z))
                    values.append(1)
                }
            }
        }

        return values.withUnsafeBufferPointer { buffer in
            Data(
                bytes: buffer.baseAddress!,
                count: buffer.count * MemoryLayout<Float>.size
            )
        }
    }

    private static func applyCurves(
        _ color: SIMD3<Double>,
        transform: GeneratedFilterColorTransform
    ) -> SIMD3<Double> {
        let luminanceCurved = SIMD3<Double>(
            curve(color.x, values: transform.lumaCurve),
            curve(color.y, values: transform.lumaCurve),
            curve(color.z, values: transform.lumaCurve)
        )
        return clamp(SIMD3<Double>(
            curve(luminanceCurved.x, values: transform.redCurve),
            curve(luminanceCurved.y, values: transform.greenCurve),
            curve(luminanceCurved.z, values: transform.blueCurve)
        ))
    }

    private static func weightedBasisColor(
        _ color: SIMD3<Double>,
        weights: GeneratedFilterBasisLUTWeights
    ) -> SIMD3<Double> {
        let bases = [
            color,
            warmAmber(color),
            roseFlash(color),
            coolChrome(color),
            tealOrange(color),
            mutedPastel(color),
            deepBrown(color),
            chromeSlide(color)
        ]
        let weightValues = [
            weights.neutral,
            weights.warmAmber,
            weights.roseFlash,
            weights.coolChrome,
            weights.tealOrange,
            weights.mutedPastel,
            weights.deepBrown,
            weights.chromeSlide
        ]
        return clamp(zip(bases, weightValues).reduce(SIMD3<Double>(repeating: 0)) { result, item in
            result + item.0 * item.1
        })
    }

    private static func warmAmber(_ color: SIMD3<Double>) -> SIMD3<Double> {
        let highlight = smoothstep(0.35, 1, luminance(color))
        return clamp(SIMD3<Double>(
            color.x * 1.035 + color.y * 0.012 + highlight * 0.012,
            color.y * 1.006 + highlight * 0.006,
            color.z * 0.94
        ))
    }

    private static func roseFlash(_ color: SIMD3<Double>) -> SIMD3<Double> {
        let midtone = 1 - min(abs(luminance(color) - 0.55) * 1.8, 1)
        return clamp(SIMD3<Double>(
            color.x * 1.025 + midtone * 0.018,
            color.y * 0.985,
            color.z * 1.015 + midtone * 0.009
        ))
    }

    private static func coolChrome(_ color: SIMD3<Double>) -> SIMD3<Double> {
        clamp(SIMD3<Double>(
            color.x * 0.965,
            color.y * 1.005,
            color.z * 1.04 + color.y * 0.008
        ))
    }

    private static func tealOrange(_ color: SIMD3<Double>) -> SIMD3<Double> {
        let luma = luminance(color)
        let shadows = 1 - smoothstep(0.12, 0.62, luma)
        let highlights = smoothstep(0.48, 0.95, luma)
        return clamp(SIMD3<Double>(
            color.x - shadows * 0.024 + highlights * 0.032,
            color.y + shadows * 0.018 + highlights * 0.01,
            color.z + shadows * 0.038 - highlights * 0.028
        ))
    }

    private static func mutedPastel(_ color: SIMD3<Double>) -> SIMD3<Double> {
        let luma = SIMD3<Double>(repeating: luminance(color))
        let muted = luma + (color - luma) * 0.82
        return clamp(muted * 0.97 + SIMD3<Double>(repeating: 0.025))
    }

    private static func deepBrown(_ color: SIMD3<Double>) -> SIMD3<Double> {
        let midtone = 1 - min(abs(luminance(color) - 0.45) * 2.2, 1)
        return clamp(SIMD3<Double>(
            color.x * 1.025 + midtone * 0.015,
            color.y * 0.975,
            color.z * 0.9 - midtone * 0.008
        ))
    }

    private static func chromeSlide(_ color: SIMD3<Double>) -> SIMD3<Double> {
        let separated = SIMD3<Double>(
            smoothSCurve(color.x),
            smoothSCurve(color.y),
            smoothSCurve(color.z)
        )
        let luma = SIMD3<Double>(repeating: luminance(separated))
        return clamp(luma + (separated - luma) * 1.07)
    }

    private static func curve(_ value: Double, values: [Double]) -> Double {
        guard values.count == fixedCurveX.count else { return value }
        let safeValue = min(max(value, 0), 1)
        if safeValue >= 1 { return values[values.count - 1] }
        let scaled = safeValue * Double(values.count - 1)
        let lower = min(Int(floor(scaled)), values.count - 2)
        let fraction = scaled - Double(lower)
        return values[lower] + (values[lower + 1] - values[lower]) * fraction
    }

    private static func luminance(_ color: SIMD3<Double>) -> Double {
        color.x * 0.2126 + color.y * 0.7152 + color.z * 0.0722
    }

    private static func smoothSCurve(_ value: Double) -> Double {
        let smooth = value * value * (3 - 2 * value)
        return value + (smooth - value) * 0.32
    }

    private static func smoothstep(_ lower: Double, _ upper: Double, _ value: Double) -> Double {
        let t = min(max((value - lower) / (upper - lower), 0), 1)
        return t * t * (3 - 2 * t)
    }

    private static func clamp(_ color: SIMD3<Double>) -> SIMD3<Double> {
        SIMD3<Double>(
            min(max(color.x, 0), 1),
            min(max(color.y, 0), 1),
            min(max(color.z, 0), 1)
        )
    }
}
